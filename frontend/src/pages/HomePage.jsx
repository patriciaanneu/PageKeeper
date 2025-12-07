import React from 'react'
import { NavLink } from 'react-router-dom'
import HeroImg from '../assets/HeroImg.jpg'
import { FiBook, FiBarChart2, FiLock } from 'react-icons/fi'

export default function HomePage(){
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <section className="bg-[#DCD7C9] border border-[#DCD7C9] overflow-hidden shadow-sm mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="p-8 sm:p-14 flex flex-col justify-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Your digital library companion starts here</h2>
            <p className="mt-4 text-[#3F4E4F] text-lg sm:text-xl max-w-lg">Track every book you've read or want to read. PageKeeper transform your reading journey into a simple, powerful experience.</p>

            <div className="mt-8 flex flex-wrap gap-4">
              <NavLink to="/register" className="inline-block bg-[#A27B5B] text-[#EFEFEF] px-6 py-3 rounded-lg text-base sm:text-lg hover:opacity-90">Get Started</NavLink>
              <NavLink to="/features" className="inline-block bg-[#EFEFEF] border border-gray-300 px-5 py-3 rounded-lg text-base sm:text-lg hover:bg-gray-50">Learn More</NavLink>
            </div>
          </div>

          <div className="relative w-full h-80 sm:h-[420px] lg:h-[520px]">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-white" />
            <img
              src={HeroImg}
              alt="Books on a shelf"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#DCD7C9] border border-[#DCD7C9] p-6">
        <h1 className="text-2xl font-bold mb-2 text-center">Welcome to PageKeeper</h1>
        <p className="text-[#3F4E4F] mb-4 text-center mx-auto max-w-lg">Track your books, reading progress, and build your personal library.</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="group block bg-[#EFEFEF] border border-gray-200 p-4 shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg focus:outline-none" aria-label="Organize - Create and organize books" role="article">
            <div className="flex flex-col items-start">
              <FiBook className="w-8 h-8 text-[#A27B5B] mb-3" />
              <h3 className="text-lg font-semibold">Organize</h3>
              <p className="text-[#3F4E4F] mt-2">Organize books into wishlist and owned collections.</p>
            </div>
          </div>

          <div className="group block bg-[#EFEFEF] border border-gray-200 p-4 shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg focus:outline-none" aria-label="Track Progress - Track read status and shelves" role="article">
            <div className="flex flex-col items-start">
              <FiBarChart2 className="w-8 h-8 text-[#A27B5B] mb-3" />
              <h3 className="text-lg font-semibold">Track Progress</h3>
              <p className="text-[#3F4E4F] mt-2">Monitor your reading status from start to end with simple updates.</p>
            </div>
          </div>

          <div className="group block bg-[#EFEFEF] border border-gray-200 p-4 shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg focus:outline-none" aria-label="Secure Auth - Secure auth with refresh tokens" role="article">
            <div className="flex flex-col items-start">
              <FiLock className="w-8 h-8 text-[#A27B5B] mb-3" />
              <h3 className="text-lg font-semibold">Secure personal library</h3>
              <p className="text-[#3F4E4F] mt-2">Protect your book collection with robust authentication and private management.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
