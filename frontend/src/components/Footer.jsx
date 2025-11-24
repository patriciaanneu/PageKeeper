import React from 'react'
import { FaGithub } from 'react-icons/fa'

export default function Footer({ repoUrl = '#' }){
  return (
    <footer className='max-w-5xl mx-auto px-4 mt-8'>
      <div className='border-t border-gray-200 pt-4 pb-6 flex items-center justify-between'>
        <div className='text-sm text-gray-600'>© {new Date().getFullYear()} PageKeeper</div>
        <div>
          <a href={repoUrl} aria-label='GitHub' target='_blank' rel='noopener noreferrer' className='text-gray-700 hover:text-gray-900'>
            <FaGithub className='w-6 h-6' aria-hidden='true' />
          </a>
        </div>
      </div>
    </footer>
  )
}
