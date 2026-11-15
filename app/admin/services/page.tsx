'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<number | null>(null)

  useEffect(() => {
    fetchServices()
  }, [])

  async function fetchServices() {
    const { data } = await supabase.from('services').select('*').order('sort_order')
    if (data) setServices(data)
    setLoading(false)
  }

  async function updateService(id: number, field: string, value: string) {
    const { error } = await supabase.from('services').update({ [field]: value }).eq('id', id)
    if (!error) { alert('Текст сохранен!'); fetchServices() } 
    else { alert('Ошибка: ' + error.message) }
  }

  async function uploadPhoto(id: number, file: File) {
    try {
      setUploading(id)
      const fileExt = file.name.split('.').pop()
      const fileName = id + '-' + Math.random() + '.' + fileExt
      const { error: uploadError } = await supabase.storage.from('photos').upload(fileName, file)
      if (uploadError) throw uploadError
      
      const { data } = supabase.storage.from('photos').getPublicUrl(fileName)
      const { error: updateError } = await supabase.from('services').update({ image_url: data.publicUrl }).eq('id', id)
      if (updateError) throw updateError

      alert('Фото загружено!')
      fetchServices()
    } catch (error: any) {
      alert('Ошибка загрузки фото: ' + error.message)
    } finally {
      setUploading(null)
    }
  }

  if (loading) return <div className="p-10">Загрузка...</div>

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#1C1C1E] text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#C9A227] mb-6">АДМИНКА</h2>
        <Link href="/admin" className="hover:text-[#C9A227]">Главная</Link>
        <Link href="/admin/services" className="text-[#C9A227] font-bold">Направления и цены</Link>
        <Link href="/admin/leads" className="hover:text-[#C9A227]">Заявки с сайта</Link>
        <Link href="/" className="mt-auto text-sm text-gray-400 hover:text-white pt-4 border-t border-gray-700">
          ← Вернуться на сайт
        </Link>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Управление услугами</h1>
        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 rounded-lg shadow-sm flex gap-6">
              <div className="w-1/3">
                <div className="w-full h-40 bg-gray-200 rounded mb-2 flex items-center justify-center overflow-hidden">
                  {service.image_url ? <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-sm">Нет фото</span>}
                </div>
                <label className="block w-full text-center cursor-pointer bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 py-2 rounded transition text-sm">
                  {uploading === service.id ? 'Загрузка...' : 'Загрузить фото'}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    if (e.target.files && e.target.files[0]) uploadPhoto(service.id, e.target.files[0])
                  }} />
                </label>
              </div>
              <div className="w-2/3 space-y-4">
                <h3 className="text-xl font-bold text-[#C9A227]">{service.title}</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Краткое описание</label>
                  <textarea className="w-full border p-2 rounded" rows={2} defaultValue={service.short_desc || ''} onBlur={(e) => updateService(service.id, 'short_desc', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Полное описание</label>
                  <textarea className="w-full border p-2 rounded" rows={4} defaultValue={service.full_desc || ''} onBlur={(e) => updateService(service.id, 'full_desc', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}