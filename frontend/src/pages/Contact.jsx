import React, { useState } from 'react'
import emailjs from '@emailjs/browser'

export default function Contact(){
  return (
    <div className='max-w-4xl mx-auto px-4 py-8'>
      <header className='text-center mb-6'>
        <h1 className='text-3xl font-semibold'>Help Center</h1>
      </header>

      <section className='bg-white border border-gray-200 p-6 mb-6 mx-auto max-w-3xl'>
        <h2 className='text-xl font-semibold mb-3 text-center'>FAQs</h2>
        <div className='space-y-2 text-gray-700 mx-auto max-w-2xl'>
          <details className='p-3 rounded hover:bg-gray-50 text-left'>
            <summary className='cursor-pointer font-medium'>How do I create an account?</summary>
            <div className='mt-2 text-sm'>Sign up using your email account, provide basic information and verify your email. You'll be ready to start cataloguing books in minutes.</div>
          </details>

          <details className='p-3 rounded hover:bg-gray-50 text-left'>
            <summary className='cursor-pointer font-medium'>Are my books private?</summary>
            <div className='mt-2 text-sm'>Your book collection remains private. Only you can view and manage your shelves.</div>
          </details>

          <details className='p-3 rounded hover:bg-gray-50 text-left'>
            <summary className='cursor-pointer font-medium'>How do I report a bug or request a feature?</summary>
            <div className='mt-2 text-sm'>Email us at <a className='text-blue-600 hover:underline' href='mailto:you@example.com'>support@pagekeeper.com</a> with details, screenshots, and steps to reproduce.</div>
          </details>

          <details className='p-3 rounded hover:bg-gray-50 text-left'>
            <summary className='cursor-pointer font-medium'>What devices work?</summary>
            <div className='mt-2 text-sm'>PageKeeper runs in modern desktop and mobile browsers — Chrome, Firefox, Edge, and Safari. Mobile and tablet are supported; for the best experience keep your browser up to date.</div>
          </details>

          <details className='p-3 rounded hover:bg-gray-50 text-left'>
            <summary className='cursor-pointer font-medium'>Are there any mobile apps?</summary>
            <div className='text-sm mt-1'>We currently support mobile browsers; native apps are planned for a future release.</div>
          </details>

          <details className='p-3 rounded hover:bg-gray-50 text-left'>
            <summary className='cursor-pointer font-medium'>How do I delete my account?</summary>
            <div className='text-sm mt-1'>Contact support at <a className='text-blue-600 hover:underline' href='mailto:you@example.com'>support@pagekeeper.com</a> with your request.</div>
          </details>
        </div>
      </section>

      <section className='mt-6 overflow-hidden'>
        <section className='text-center mt-6'>
          <h2 className='text-2xl font-semibold py-4'>Still have questions?</h2>
        </section>

        <div className='md:flex'>
          <div className='md:w-1/2 p-6 border-b md:border-b-0 md:border-r'>
            <h3 className='text-lg font-semibold'>Contact us</h3>
            <p className='mt-3 text-gray-700'>Email: <a className='text-blue-600 hover:underline' href='mailto:you@example.com'>support@pagekeeper.com</a></p>
            <p className='mt-2 text-gray-700'>Phone: +1 (555) 123-4567</p>
            <p className='mt-4 text-sm text-gray-500'>Our support team typically responds within 1-2 business days.</p>
          </div>

          <div className='md:w-1/2 p-6'>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}

//connect to emailjs
function ContactForm(){
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleChange = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError(null)
    setSuccess(null)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setError('Email service not configured. Please contact support.')
      setSending(false)
      return
    }

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
    }

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey)
      setSuccess('Thanks — your message was sent.')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error('EmailJS error', err)
      setError('Sorry, something went wrong sending your message. Please try again later.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700'>Name</label>
        <input value={form.name} onChange={handleChange('name')} className='mt-1 block w-full border px-3 py-2 bg-white' required />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Email</label>
        <input type='email' value={form.email} onChange={handleChange('email')} className='mt-1 block w-full border px-3 py-2 bg-white' required />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700'>Message</label>
        <textarea value={form.message} onChange={handleChange('message')} rows={5} className='mt-1 block w-full border px-3 py-2 bg-white' required />
      </div>

      <div>
        <button type='submit' disabled={sending} className='bg-[#594A3E] text-white px-4 py-2 rounded hover:opacity-95'>
          {sending ? 'Sending…' : 'Submit'}
        </button>
      </div>

      {success && <p className='text-sm text-green-600'>{success}</p>}
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </form>
  )
}

