import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { FiBook, FiHeart, FiLayers } from 'react-icons/fi'

export default function BooksList() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  // UI state
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // all | owned | wishlist

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await api.get('/books')
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

  const counts = useMemo(() => {
    const owned = books.filter(b => (b.shelf || '').toLowerCase() === 'owned').length
    const wishlist = books.filter(b => (b.shelf || '').toLowerCase() === 'wishlist').length
    return { owned, wishlist, total: books.length }
  }, [books])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return books.filter(b => {
      if (filter === 'owned' && (b.shelf || '').toLowerCase() !== 'owned') return false
      if (filter === 'wishlist' && (b.shelf || '').toLowerCase() !== 'wishlist') return false
      if (!q) return true
      const title = (b.title || '').toLowerCase()
      const author = (b.author || '').toLowerCase()
      const genre = (b.genre || '').toLowerCase()
      return title.includes(q) || author.includes(q) || genre.includes(q)
    })
  }, [books, query, filter])

  if (loading) return <p className='text-center py-8'>Loading...</p>
  if (err) return <p className='text-center py-8 text-red-600'>{err}</p>

  return (
    <div className='max-w-6xl mx-auto px-4 py-6'>
      <div className='flex items-center justify-between mb-4'>
        <h2 className='text-2xl font-semibold'>My Books</h2>
        <Link to='/books/new' className='bg-[#594A3E] text-white px-3 py-2 rounded hover:opacity-95'>Add Book</Link>
      </div>

      {/* Statistics */}
      <div className='flex gap-3 mb-4'>
        <div className='bg-white border p-4 flex-1 flex items-center justify-between'>
          <div>
            <div className='text-xs text-gray-500'>Owned</div>
            <div className='text-lg font-semibold'>{counts.owned}</div>
          </div>
            <div className='text-gray-400'><FiBook size={28} /></div>
        </div>
        <div className='bg-white border p-4 flex-1 flex items-center justify-between'>
          <div>
            <div className='text-xs text-gray-500'>Wishlist</div>
            <div className='text-lg font-semibold'>{counts.wishlist}</div>
          </div>
            <div className='text-gray-400'><FiHeart size={28} /></div>
        </div>
        <div className='bg-white border p-4 w-40 flex items-center justify-between'>
          <div>
            <div className='text-xs text-gray-500'>Total</div>
            <div className='text-lg font-semibold'>{counts.total}</div>
          </div>
            <div className='text-gray-400'><FiLayers size={22} /></div>
        </div>
      </div>

      {/* Search */}
      <div className='mb-3'>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Search by title, author, or genre'
          className='w-full border rounded px-3 py-2'
        />
      </div>

      {/* Filter tabs */}
      <div className='flex gap-2 items-center mb-4'>
        {['all', 'owned', 'wishlist'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1 rounded ${filter === t ? 'bg-[#594A3E] text-white' : 'bg-white border'}`}>
            {t === 'all' ? 'All Books' : (t === 'owned' ? 'Owned' : 'Wishlist')}
          </button>
        ))}
        <div className='ml-auto text-sm text-gray-500'>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Book cards */}
      {filtered.length === 0 ? (
        <p className='text-gray-600'>No books match your criteria.</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filtered.map(b => (
            <div key={b._id} className='bg-white border border-gray-200 rounded p-4 flex flex-col'>
              <div className='flex items-start gap-3'>
                <div className='w-20 h-28 shrink-0 bg-gray-50 border rounded overflow-hidden'>
                  {b.coverImage ? (
                    (() => {
                      const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : ''
                      const src = b.coverImage.startsWith('/uploads') && base ? `${base}${b.coverImage}` : b.coverImage
                      return <img src={src} alt='cover' className='w-full h-full object-cover' />
                    })()
                  ) : (
                    <div className='w-full h-full flex items-center justify-center text-xs text-gray-400'>No Image</div>
                  )}
                </div>
                <div className='flex-1'>
                  <Link to={`/books/${b._id}`} className='font-medium hover:underline'>{b.title}</Link>
                  <div className='text-sm text-gray-600'>{b.author}</div>
                  <div className='text-xs text-gray-500 mt-2'>{b.genre || ''}</div>
                </div>
              </div>
              <div className='mt-3 flex items-center justify-between text-sm text-gray-500'>
                <div>{b.shelf || '—'}</div>
                <div>{b.readStatus || '—'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
