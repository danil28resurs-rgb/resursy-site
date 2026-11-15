'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

// Красивый выпадающий список для статусов с иконками
function StatusSelect({ currentStatus, onChange }: { currentStatus: string, onChange: (val: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const statuses = [
    { 
      value: 'new', 
      label: 'Новая', 
      color: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
      icon: <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
    },
    { 
      value: 'called', 
      label: 'Позвонили', 
      color: 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
      icon: <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
    },
    { 
      value: 'done', 
      label: 'Сделка', 
      color: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
    },
    { 
      value: 'spam', 
      label: 'Спам', 
      color: 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-gray-200',
      icon: <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    },
  ]

  const current = statuses.find(s => s.value === currentStatus) || statuses[0]

  return (
    <div className="relative w-40" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between transition-all duration-200 font-bold text-sm shadow-sm ${current.color}`}
      >
        <div className="flex items-center gap-2">
          {current.icon}
          <span>{current.label}</span>
        </div>
        <svg className={`w-4 h-4 opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-modal origin-top">
          <ul className="py-1">
            {statuses.map((status) => (
              <li 
                key={status.value}
                onClick={() => { onChange(status.value); setIsOpen(false); }}
                className={`px-3 py-2.5 text-sm cursor-pointer transition-colors duration-150 font-medium flex items-center gap-2 ${
                  currentStatus === status.value ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {status.icon}
                {status.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      
    if (error) {
      console.error("Ошибка загрузки:", error)
    } else if (data) {
      setLeads(data)
    }
    setLoading(false)
  }

  async function updateStatus(id: number, newStatus: string) {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id)
      
    if (!error) {
      fetchLeads() 
    } else {
      alert('Ошибка при сохранении статуса: ' + error.message)
    }
  }

  if (loading) return <div className="p-10 text-gray-700">Загрузка заявок...</div>

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#1C1C1E] text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#C9A227] mb-6">АДМИНКА</h2>
        <Link href="/admin" className="hover:text-[#C9A227]">Главная</Link>
        <Link href="/admin/services" className="hover:text-[#C9A227]">Направления и цены</Link>
        <Link href="/admin/leads" className="text-[#C9A227] font-bold">Заявки с сайта</Link>
        <Link href="/" className="mt-auto text-sm text-gray-400 hover:text-white pt-4 border-t border-gray-700">
          ← Вернуться на сайт
        </Link>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Заявки клиентов</h1>
        
        {leads.length === 0 ? (
          <div className="bg-white p-10 text-center rounded-lg shadow-sm text-gray-500">
            Пока нет ни одной заявки.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-visible">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-medium">Дата</th>
                  <th className="p-4 font-medium">Имя</th>
                  <th className="p-4 font-medium">Телефон</th>
                  <th className="p-4 font-medium">Интересует</th>
                  <th className="p-4 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr 
                    key={lead.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 table-row-animate"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(lead.created_at).toLocaleString('ru-RU', { 
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                    <td className="p-4 font-bold text-[#1C1C1E]">{lead.name}</td>
                    <td className="p-4">
                      <a href={`tel:${lead.phone}`} className="text-[#C9A227] hover:underline font-medium">
                        {lead.phone}
                      </a>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {lead.interest || lead.message || 'Не указано'}
                    </td>
                    <td className="p-4">
                      <StatusSelect 
                        currentStatus={lead.status || 'new'} 
                        onChange={(newStatus) => updateStatus(lead.id, newStatus)} 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}