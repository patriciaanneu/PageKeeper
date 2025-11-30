import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

export default function BooksList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api.get('/books')
        // backend returns { books: [...] }
        const payload = res?.data
        const list = Array.isArray(payload) ? payload : (payload?.books ?? [])
        if (mounted) setBooks(list)
      } catch (e) {
        setErr('Unable to fetch books — are you logged in?')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  if (loading) return <p className='text-center py-8'>Loading...</p>
  if (err) return <p className='text-center py-8 text-red-600'>{err}</p>

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-xl font-semibold'>My Books</h2>
        <Link to='/books/new' className='bg-[#594A3E] text-white px-3 py-2 rounded hover:opacity-95'>Add Book</Link>
      </div>
      {books.length === 0 && <p className='text-gray-600'>No books found.</p>}
      <ul className='space-y-3'>
        {books.map(b => (
          <li key={b._id} className='bg-white border border-gray-200 rounded p-4 flex justify-between items-start'>
            <div className='flex items-start gap-3'>
              {b.coverImage ? (
                (() => {
                  const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : ''
                  const src = b.coverImage.startsWith('/uploads') && base ? `${base}${b.coverImage}` : b.coverImage
                  return <img src={src} alt='cover' className='w-12 h-16 object-cover rounded' />
                })()
              ) : (
                <div className='w-12 h-16 bg-gray-100 border rounded flex items-center justify-center text-xs text-gray-400'>No Image</div>
              )}
              <div>
                <Link to={`/books/${b._id}`} className='font-medium hover:underline'>{b.title}</Link>
                <div className='text-sm text-gray-600'>{b.author}</div>
              </div>
            </div>
            <div className='text-sm text-gray-500'>{b.shelf || '—'} • {b.readStatus || '—'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
