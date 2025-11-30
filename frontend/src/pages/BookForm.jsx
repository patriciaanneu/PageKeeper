import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api/client'

const defaultData = { 
    title: '',
    author: '',
    genre: '',
    pages: '',
    isbn: '',
    edition: '',
    notes: '',
    shelf: '',
    readStatus: '',
    coverImage: ''
}

const SHELF_OPTIONS = [ '', 'Wishlist', 'Owned' ]
const READ_STATUS = [ '', 'Not Read', 'Reading', 'Read', 'DNF' ]

function validateFields(data) {
    const errors = {}
    if(!data.title || data.title.trim().length < 1 ) errors.title = 'Title is required'
    if(!data.author || data.author.trim().length < 1) errors.author = 'Author is required'
    if(data.pages && (!/^[0-9]+$/.test(String(data.pages)) || Number(data.pages) <= 0)) errors.pages = 'Pages must be a positive number'
    if(data.isbn && !/^[0-9\- ]+$/.test(data.isbn)) errors.isbn = 'ISBN should contain digits, spaces or dashes'
    return errors
}

export default function BookForm() {
    const { id } = useParams()
    const editMode = Boolean(id)
    const [data, setData] = useState(defaultData)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(editMode)
    const [errors, setErrors] = useState({})
    const [coverFile, setCoverFile] = useState(null)
    const [coverPreview, setCoverPreview] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        if(!editMode) return
        let mounted = true
        async function load() {
            try {
                    const res = await api.get(`/books/${id}`)
                    if ( mounted){
                        // backend returns { book }
                        const book = res?.data?.book ?? res?.data
                        const d = {...defaultData, ...book}
                        setData(d)
                    }
            } catch (e) {
                setMsg('Unable to load for edit')
            } finally {
                if(mounted) setLoading(false)
            }
        }
        load()
        return () => { mounted = false }
    }, [id, editMode])

    useEffect(() => {
        if (coverFile) {
            const url = URL.createObjectURL(coverFile)
            setCoverPreview(url)
            return() => URL.revokeObjectURL(url)
        }
        setCoverPreview('')
    }, [coverFile])

    function setField(k, v){ setData(d => ({...d, [k]: v})) }

    function handleFile(e) {
        const f = e.target.files && e.target.files[0]
        if (f) { setCoverFile(f) }
    }

    async function submit(e) {
        e.preventDefault()
        setMsg('')
        const current = { ...data }
        const v = validateFields(current)
        setErrors(v)
        if (Object.keys(v).length) return

        try {
            if (!api.defaults.headers.common?.['Authorization']) {
                try {
                    const r = await api.post('/auth/refresh')
                    const newToken = r?.data?.token
                    if (newToken) api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
                } catch (refreshErr) {
                    
                }
            }

            let savedBook
            if (editMode) {
                const res = await api.put(`/books/${id}`, current)
                savedBook = res?.data?.book ?? res?.data
            } else {
                const res = await api.post('/books', current)
                savedBook = res?.data?.book ?? res?.data
            }

            if (coverFile && savedBook && (savedBook._id || savedBook.id)) {
                const bookId = savedBook._id || savedBook.id
                const form = new FormData()
                form.append('cover', coverFile)
                await api.post(`/books/${bookId}/cover`, form)
            }
            navigate('/books')
        } catch (err) {
            setMsg(err?.response?.data?.message || err?.response?.data?.error || 'Save failed')
        }
    }

    if (loading) return <p className='text-center py-8'> Loading...</p>

    return (
        <div className='max-w-xl mx-auto px-4 py-8'>
            <form onSubmit={submit} className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'>
                <h2 className='text-lg font-semibold'>{editMode? 'Edit Book' : 'Add Book'}</h2>

                <div>
                    <label className='block text-sm text-gray-700 mb-1'>Title <span className='text-red-600'>*</span></label>
                    <input className='w-full border px-3 py-2' value={data.title} onChange={e => setField('title', e.target.value)} />
                    {errors.title && <p className='text-sm text-red-600'>{errors.title}</p>}
                </div>

                <div>
                    <label className='block text-sm text-gray-700 mb-1'>Author <span className='text-red-600'>*</span></label>
                    <input className='w-full border px-3 py-2' value={data.author} onChange={e=>setField('author',e.target.value)} />
                    {errors.author && <p className='text-sm text-red-600'>{errors.author}</p>}
                </div>
                
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Genre</label>
                        <input className='w-full border px-3 py-2' value={data.genre} onChange={e=>setField('genre',e.target.value)} />
                    </div>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Pages</label>
                        <input className='w-full border px-3 py-2' value={data.pages} onChange={e=>setField('pages',e.target.value)} />
                        {errors.pages && <p className='text-sm text-red-600'>{errors.pages}</p>}
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>ISBN</label>
                        <input className='w-full border px-3 py-2' value={data.isbn} onChange={e=>setField('isbn',e.target.value)} />
                        {errors.isbn && <p className='text-sm text-red-600'>{errors.isbn}</p>}
                    </div>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Edition</label>
                        <input className='w-full border px-3 py-2' value={data.edition} onChange={e=>setField('edition',e.target.value)} />
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Shelf</label>
                        <select className='w-full border px-3 py-2' value={data.shelf} onChange={e=>setField('shelf',e.target.value)}>
                            {SHELF_OPTIONS.map(s => <option key={s} value={s}>{s || '— Select —'}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm text-gray-700 mb-1'>Read Status</label>
                        <select className='w-full border px-3 py-2' value={data.readStatus} onChange={e=>setField('readStatus',e.target.value)}>
                            {READ_STATUS.map(s => <option key={s} value={s}>{s || '— Select —'}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className='block text-sm text-gray-700 mb-1'>Notes</label>
                    <textarea className='w-full border px-3 py-2' value={data.notes} onChange={e=>setField('notes',e.target.value)} rows={4} />
                </div>

                <div>
                    <label className='block text-sm text-gray-700 mb-1'>Cover Image</label>
                    <div>
                        <input type='file' accept='image/*' onChange={handleFile} />
                    </div>
                    {coverPreview && <img src={coverPreview} alt='preview' className='mt-3 h-40 object-contain border' />}
                    {!coverPreview && data.coverImage && (() => {
                        const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : ''
                        const src = data.coverImage.startsWith('/uploads') && base ? `${base}${data.coverImage}` : data.coverImage
                        return <img src={src} alt='cover' className='mt-3 h-40 object-contain border' />
                    })()}
                </div>

                <div className='flex gap-2'>
                    <button className='bg-[#594A3E] text-white px-4 py-2 rounded hover:opacity-95' type='submit'>Save</button>
                    <button type='button' className='px-3 py-2 bg-gray-200 rounded' onClick={()=>navigate('/books')}>Cancel</button>
                </div>

                {msg && <p className='text-sm text-red-600'>{msg}</p>}
            </form>
        </div>
    )
}
