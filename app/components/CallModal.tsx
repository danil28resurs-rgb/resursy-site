'use client'

import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Компонент для красивого выпадающего списка
function CustomSelect({ options, value, onChange }: { options: string[], value: string, onChange: (val: string) => void }) {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer flex justify-between items-center transition-all duration-200 hover:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]"
      >
        <span className="text-gray-800">{value}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-modal origin-top">
          <ul className="max-h-48 overflow-y-auto custom-scrollbar py-1">
            {options.map((option) => (
              <li 
                key={option}
                onClick={() => { onChange(option); setIsOpen(false); }}
                className={`px-4 py-2.5 cursor-pointer transition-colors duration-150 ${value === option ? 'bg-[#C9A227]/10 text-[#C9A227] font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function CallModal({ isOpen, onClose, source, serviceName }: { isOpen: boolean, onClose: () => void, source: string, serviceName?: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('Кызыл')
  const [interest, setInterest] = useState(serviceName || 'Бетон')
  const [customInterest, setCustomInterest] = useState('') // Текст для "Другое"
  const [contactTime, setContactTime] = useState('В любое время')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Если выбрано "Другое", берем текст из поля, иначе - из селекта
    const finalInterest = interest === 'Другое (напишу сам)' ? customInterest : interest

    const { error } = await supabase.from('leads').insert([
      { 
        name, phone, city, 
        interest: finalInterest, 
        contact_time: contactTime, 
        source, 
        status: 'new',
        message: serviceName ? `Интересует: ${serviceName}` : 'Общий запрос'
      }
    ])

    setLoading(false)

    if (error) {
      alert('Ошибка при отправке: ' + error.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setName('')
        setPhone('')
        setCustomInterest('')
      }, 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-md transition-all duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-md p-8 relative animate-modal border border-white/20">
        
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl leading-none">
          &times;
        </button>

        {success ? (
          <div className="text-center py-10">
            <div className="text-6xl mb-4 animate-bounce">✅</div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">Заявка отправлена!</h3>
            <p className="text-gray-600">Мы свяжемся с вами в ближайшее время.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-[#1C1C1E] mb-2 tracking-tight">Оставить заявку</h2>
            <p className="text-gray-500 mb-8 text-sm">Заполните форму, и мы перезвоним в удобное время.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Ваше имя</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:bg-white transition-all duration-200"
                  placeholder="Иван"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Телефон</label>
                <input 
                  type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:bg-white transition-all duration-200"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Город</label>
                  <input 
                    type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:bg-white transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Время звонка</label>
                  <CustomSelect 
                    options={['В любое время', 'Утром (с 9 до 12)', 'Днем (с 12 до 17)', 'Вечером (с 17 до 20)']}
                    value={contactTime}
                    onChange={setContactTime}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Что интересует?</label>
                <CustomSelect 
                  options={['Бетон', 'Щебень', 'Песок', 'Блоки ФБС', 'Керамзитобетонные блоки', 'Аренда спецтехники', 'Грузоперевозки', 'Другое (напишу сам)']}
                  value={interest}
                  onChange={setInterest}
                />
              </div>

              {/* Показываем это поле, только если выбран пункт "Другое" */}
              {interest === 'Другое (напишу сам)' && (
                <div className="animate-modal origin-top">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Напишите, что вам нужно</label>
                  <input 
                    type="text" 
                    required 
                    value={customInterest} 
                    onChange={(e) => setCustomInterest(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:bg-white transition-all duration-200"
                    placeholder="Например: Бетон М400 с доставкой"
                  />
                </div>
              )}
              
              <button 
                type="submit" disabled={loading}
                className="w-full relative overflow-hidden bg-[#C9A227] text-[#1C1C1E] font-extrabold py-4 px-4 rounded-xl text-lg mt-4 transition-all duration-300 shadow-[0_0_20px_rgba(201,162,39,0.3)] hover:shadow-[0_0_30px_rgba(201,162,39,0.6)] hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 group"
              >
                <span className="relative z-10">{loading ? 'Отправка...' : 'Отправить заявку'}</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}