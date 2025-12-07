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

  if(err) return <p className='text-center py-8 text-[#632111]'>{err}</p>
  if(!book) return <p className='text-center py-8'>Loading...</p>

  return (
    <div className='max-w-3xl mx-auto px-4 py-8'>
      <div className='bg-[#DCD7C9] border border-[#DCD7C9] shadow-sm rounded-lg p-6 space-y-3'>
        <div className='flex justify-between items-start gap-4'>
          <div className='flex items-start gap-4'>
            {book.coverImage ? (
              (() => {
                const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : ''
                const src = book.coverImage.startsWith('/uploads') && base ? `${base}${book.coverImage}` : book.coverImage
                return <img src={src} alt='cover' className='w-24 h-32 object-cover rounded shadow-sm' />
              })()
            ) : (
              <div className='w-24 h-32 bg-gray-100 border rounded flex items-center justify-center text-xs text-[#3F4E4F]'>No Image</div>
            )}
            <div>
              <h1 className='text-2xl font-bold'>{book.title}</h1>
              <div className='text-sm text-[#3F4E4F]'>{book.author}</div>
            </div>
          </div>
          <div className='text-sm text-[#3F4E4F]'>{book.shelf || '—'}</div>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm text-[#2C3639]'>
          <div><strong>Genre:</strong> {book.genre || '—'}</div>
          <div><strong>Pages:</strong> {book.pages || '—'}</div>
          <div><strong>ISBN:</strong> {book.isbn || '—'}</div>
          <div><strong>Published Year:</strong> {book.publicationYear || book.edition || '—'}</div>
        </div>

        <div className='text-[#2C3639]'>
          <h3 className='font-medium'>Notes</h3>
          <p className='mt-1 text-sm'>{book.notes || '—'}</p>
        </div>

        <div className='flex gap-2'>
          <Link to={`/books/${id}/edit`} className='px-3 py-2 bg-[#A27B5B] text-[#EFEFEF] rounded hover:opacity-95'>Edit</Link>
          <Link to='/books' className='px-3 py-2 bg-[#EFEFEF] rounded hover:opacity-85'>Back</Link>
        </div>
      </div>
    </div>
  )
}
