import React from 'react'
import secureImg from '../assets/secure.svg'
import organizeImg from '../assets/organize.svg'
import progressImg from '../assets/progress.svg'
import readImg from '../assets/read.svg'
import searchImg from '../assets/search.svg'
import analyticsImg from '../assets/analytics.svg'

const cards = [
  {
    key: 'secure',
    tag: 'Secure',
    heading: 'Protect your reading world',
    img: secureImg,
    desc: 'Your book collection stays private and safe. We use advanced encryption to guard your personal library and reading data.'
  },
  {
    key: 'organize',
    tag: 'Organize',
    heading: 'Shelves, tags and custom lists',
    img: organizeImg,
    desc: 'Create shelves, tags, and custom lists so your collection stays tidy and discoverable.'
  },
  {
    key: 'progress',
    tag: 'Progress',
    heading: 'Track your reading journey',
    img: progressImg,
    desc: 'Track reading progress and status per book — know what you started and what you finished.'
  },
  {
    key: 'read',
    tag: 'Read',
    heading: 'Reading status made simple',
    img: readImg,
    desc: 'Mark books as read, currently reading, or did not finish. Understand your reading habits at a glance.'
  },
  {
    key: 'search',
    tag: 'Search',
    heading: 'Find books with precision and ease',
    img: searchImg,
    desc: 'Powerful search and filters help you find books by title, author, or tag.'
  },
  {
    key: 'analytics',
    tag: 'Analytics',
    heading: 'Insights & reading stats',
    img: analyticsImg,
    desc: 'Dive deep into your reading habits with comprehensive collectioon statistics. Track you literacy landscape at a glance.'
  }
]

export default function Features(){
  return (
    <div className='max-w-6xl mx-auto px-4 py-12 space-y-8'>
      <header className='text-center'>
        <h1 className='text-3xl font-semibold'>Discover your reading companion</h1>
        <p className='mt-2 text-gray-600 py-4'>Explore powerful features designed to help book lovers track, organize, and celebrate their reading journey</p>
      </header>

      <section className='space-y-6'>
        {cards.map((c, idx) => (
          <article key={c.key} className={`bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm flex flex-col md:flex-row items-stretch ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''} md:h-64 lg:md:h-120`}>
            <div className='md:w-1/2 w-full h-56 md:h-full'>
              <img src={c.img} alt={c.title} className='w-full h-full object-cover' />
            </div>

            <div className='md:w-1/2 w-full p-6 flex items-center h-56 md:h-full'>
              <div>
                <div className='text-sm text-blue-600 font-semibold uppercase tracking-widest mb-2'>{c.tag}</div>
                <h3 className='text-2xl font-semibold mb-2'>{c.heading}</h3>
                <p className='text-gray-700'>{c.desc}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
