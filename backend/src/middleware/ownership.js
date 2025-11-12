import Book from '../models/Book.js';

export const requireOwnership = (Model = Book, idParam = 'id') => async (req, res, next) => {
  try {
    const id = req.params[idParam];
    if (!id) return res.status(400).json({error: 'Missing id parameter'});
    const doc = await Model.findById(id);
    if (!doc) return res.status(404).json({error: 'Not found'});
    //ensure authenticated
    if (!req.user || !req.user.id) return res.status(401).json({error: 'Not authenticated'});
    
    const owner = doc.createdBy;
    const isOwner = owner && (typeof owner.equals === 'function' ? owner.equals(req.user.id) : owner.toString() === req.user.id);
    if (!isOwner) return res.status(403).json({error: 'Not authorized'});
    
    req.resource = doc;
    next();
  } catch (err) {
    next(err);
  }
};