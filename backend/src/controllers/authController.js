import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import RefreshToken from '../models/RefreshToken.js';

//short-lived sign in access token
const signToken = (user) => {
    const payload = {id: user._id};
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallbacksecret',{
        expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });
};

const generateRefreshToken = async (user) => {
    const token = crypto.randomBytes(64).toString('hex');
    const days = parseInt(process.env.REFRESH_EXPIRES_DAYS || '7', 10);
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const doc = new RefreshToken({user: user._id, token, expiresAt});
    await doc.save();
    return token;
}

export const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        if (!firstName || !lastName || !email || !password) return res.status(400).json({error: 'Missing fields'});
        let existing = await User.findOne({email});
        if (existing) return res.status(400).json({error: 'Email already registered'});
        const user = new User({firstName, lastName, email, password});
        await user.save();
        const token = signToken(user);
        const refreshToken = await generateRefreshToken(user);

        //set refresh token as httponly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: (parseInt(process.env.REFRESH_EXPIRES_DAYS || '7', 10) * 24 * 60* 60 * 1000)
        });

        res.status(201).json({token, user: {id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email}});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).json({error: 'Missing fields'});
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({error: 'Invalid credentials'});
        const match = await user.comparePassword(password);
        if (!match) return res.status(400).json({error: 'Invalid credentials'});
        const token = signToken(user);
        const refreshToken = await generateRefreshToken(user);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: (parseInt(process.env.REFRESH_EXPIRES_DAYS || '7', 10) * 24 * 60 * 60 * 1000)
        });

        res.json({token, user: {id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email}});
    } catch (error) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

//exchange a valid refresh token for a new access token
export const refresh = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!token) return res.status(401).json({error: 'No refresh token provided'});
        const doc = await RefreshToken.findOne({token});
        if (!doc || doc.revoked) return res.status(401).json({error: 'Invalid refresh token'});
        if (doc.expiresAt < new Date()) return res.status(401).json({error: 'Refresh token expired'});

        const user = await User.findById(doc.user);
        if (!user) return res.status(401).json({error: 'Invalid token user'});

        //rotate: revoke old and issue new
        doc.revoked = true;
        await doc.save();
        const newRefreshToken = await generateRefreshToken(user);
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: (parseInt(process.env.REFRESH_EXPIRES_DAYS || '7', 10) * 24 * 60 * 60 * 1000)
        });

        const accessToken = signToken(user);
        res.json({token: accessToken});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

//logout: revoke refresh token and clear cookie
export const logout = async (req, res) => {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        if (token) {
            await RefreshToken.findOneAndUpdate({token}, {revoked: true});
        }
        res.clearCookie('refreshToken');
        res.json({message: 'Logged out'});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Server error'});
    }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};