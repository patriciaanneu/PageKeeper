import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'

export default function BookDetail(){
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [err, setErr] = useState('')

  useEffect(()=>{
    let mounted = true
    async function load(){
      try{
        const res = await api.get(`/books/${id}`)
        // backend returns { book }
        const payload = res?.data
        const bookObj = payload?.book ?? payload
        if(mounted) setBook(bookObj)
      }catch(e){
        setErr('Unable to load book')
      }
    }
    load()
    return ()=>{ mounted = false }
  },[id])

  if(err) return <p className='text-center py-8 text-red-600'>{err}</p>
  if(!book) return <p className='text-center py-8'>Loading...</p>

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='bg-white border border-gray-200 rounded-lg p-6 space-y-3'>
        <div className='flex justify-between items-start gap-4'>
          <div className='flex items-start gap-4'>
            {book.coverImage ? (
              (() => {
                const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : ''
                const src = book.coverImage.startsWith('/uploads') && base ? `${base}${book.coverImage}` : book.coverImage
                return <img src={src} alt='cover' className='w-24 h-32 object-cover rounded' />
              })()
            ) : (
              <div className='w-24 h-32 bg-gray-100 border rounded flex items-center justify-center text-xs text-gray-400'>No Image</div>
            )}
            <div>
              <h1 className='text-2xl font-bold'>{book.title}</h1>
              <div className='text-sm text-gray-600'>{book.author}</div>
            </div>
          </div>
          <div className='text-sm text-gray-500'>{book.shelf || '—'}</div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm text-gray-700'>
          <div><strong>Genre:</strong> {book.genre || '—'}</div>
          <div><strong>Pages:</strong> {book.pages || '—'}</div>
          <div><strong>ISBN:</strong> {book.isbn || '—'}</div>
          <div><strong>Published Year:</strong> {book.publicationYear || book.edition || '—'}</div>
        </div>

        <div className='text-gray-700'>
          <h3 className='font-medium'>Notes</h3>
          <p className='mt-1 text-sm'>{book.notes || '—'}</p>
        </div>

        <div className='flex gap-2'>
          <Link to={`/books/${id}/edit`} className='px-3 py-2 bg-[#594A3E] text-white rounded hover:opacity-95'>Edit</Link>
          <Link to='/books' className='px-3 py-2 bg-gray-200 text-gray-800 rounded hover:opacity-95'>Back</Link>
        </div>
      </div>
    </div>
  )
}
