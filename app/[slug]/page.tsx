'use client'

import { Suspense, useState, useEffect, use } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import CallModal from '../components/CallModal'

function ServiceData({ slug }: { slug: string }) {
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchService() {
      const { data } = await supabase.from('services').select('*').eq('slug', slug).single()
      if (data) setService(data)
      setLoading(false)
    }
    fetchService()
  }, [slug])

  if (loading) return <div className="text-center py-20 text-gray-500">Загрузка услуги...</div>
  if (!service) return <div className="text-center py-20 text-red-500">Услуга не найдена</div>

  return (
    <>
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {service.image_url && (
          <div className="w-full h-[300px] md:h-[450px] relative">
            <img 
              src={service.image_url} 
              alt={service.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        <div className="p-8 md:p-14">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1C1C1E] mb-8">
            {service.title}
          </h1>
          
          <div className="prose max-w-none text-gray-700 leading-relaxed text-lg mb-14 whitespace-pre-line">
            {service.full_desc || 'Описание скоро появится...'}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200 text-center relative overflow-hidden">
            {/* Декоративный фон */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#1C1C1E]">Нужна консультация?</h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">Оставьте заявку на {service.title.toLowerCase()}, и мы свяжемся с вами в течение 15 минут.</p>
            
            {/* Живая кнопка на странице услуги */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative overflow-hidden bg-[#C9A227] text-[#1C1C1E] font-extrabold py-4 px-10 rounded-xl text-lg transition-all duration-300 shadow-[0_0_20px_rgba(201,162,39,0.3)] hover:shadow-[0_0_40px_rgba(201,162,39,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-95 group"
            >
              <span className="relative z-10">Оставить заявку</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />
            </button>
          </div>
        </div>
      </div>

      <CallModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        source={service.title} 
        serviceName={service.title}
      />
    </>
  )
}

function ServicePageContent({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F3EF]">
      <header className="bg-[#1C1C1E] text-white py-5 px-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-[#C9A227] rounded flex items-center justify-center font-bold text-[#1C1C1E] text-xl">Р</div>
            <div>
              <h1 className="text-xl font-bold tracking-wider">ООО «РЕСУРСЫ»</h1>
              <p className="text-xs text-gray-400">г. Кызыл</p>
            </div>
          </Link>
          <Link href="/" className="text-[#C9A227] hover:text-white transition font-medium bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10">
            ← На главную
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full px-6 py-16">
        <ServiceData slug={resolvedParams.slug} />
      </main>

      <footer className="bg-[#1C1C1E] text-gray-400 py-8 px-6 text-center text-sm">
        © 2024 ООО «РЕСУРСЫ». Все права защищены.
      </footer>
    </div>
  )
}

export default function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Загрузка...</div>}>
      <ServicePageContent params={params} />
    </Suspense>
  )
}