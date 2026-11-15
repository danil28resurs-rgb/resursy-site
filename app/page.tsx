'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import CallModal from './components/CallModal'

export default function Home() {
  const [services, setServices] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMapOpen, setIsMapOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase.from('services').select('*').order('sort_order')
        if (error) {
          console.error("Ошибка базы:", error)
        } else if (data) {
          setServices(data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const element = document.getElementById('services')
    if (!element) return

    const targetPosition = element.getBoundingClientRect().top + window.scrollY - 80
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    const duration = 1500 

    let start: number | null = null

    function step(timestamp: number) {
      if (!start) start = timestamp
      const progress = timestamp - start
      const percent = Math.min(progress / duration, 1)
      const ease = percent < 0.5 
        ? 2 * percent * percent 
        : 1 - Math.pow(-2 * percent + 2, 2) / 2

      window.scrollTo(0, startPosition + distance * ease)

      if (progress < duration) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1C1C1E] text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#C9A227] rounded flex items-center justify-center font-bold text-[#1C1C1E] text-xl">Р</div>
            <div>
              <h1 className="text-xl font-bold tracking-wider">ООО «РЕСУРСЫ»</h1>
              <p className="text-xs text-gray-400">г. Кызыл</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <a href="#services" onClick={scrollToServices} className="hover:text-[#C9A227] transition">Услуги</a>
            <a href="#" className="hover:text-[#C9A227] transition">О компании</a>
            <a href="#" className="hover:text-[#C9A227] transition">Контакты</a>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="relative overflow-hidden bg-[#C9A227] text-[#1C1C1E] px-6 py-2.5 rounded-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(201,162,39,0.2)] hover:shadow-[0_0_25px_rgba(201,162,39,0.5)] hover:-translate-y-0.5 active:translate-y-0 group"
          >
            <span className="relative z-10">Заказать звонок</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
          </button>
        </div>
      </header>

      <section className="relative bg-[#1C1C1E] py-32 px-6 overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541888086925-eb3c5c6a1c9e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Полный цикл: <br/>
            <span className="text-[#C9A227]">от карьера до объекта</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Своё сырьё. Своё производство. Своя техника. Без посредников и скрытых наценок.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="relative overflow-hidden bg-[#C9A227] text-[#1C1C1E] font-bold py-4 px-8 rounded-xl hover:bg-yellow-500 transition-all duration-300 shadow-[0_0_20px_rgba(201,162,39,0.4)] hover:shadow-[0_0_40px_rgba(201,162,39,0.7)] hover:-translate-y-1 active:translate-y-0 active:scale-95 text-lg group"
            >
              <span className="relative z-10">Получить прайс-лист</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shine" />
            </button>

            <a href="#services" onClick={scrollToServices} className="border-2 border-white text-white font-bold py-4 px-8 rounded-xl hover:bg-white hover:text-[#1C1C1E] transition-all duration-300 text-lg text-center block sm:inline-block cursor-pointer hover:-translate-y-1 active:translate-y-0">
              Наши направления
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl mb-4">🏭</div>
            <h3 className="font-bold text-xl mb-2">Своё производство</h3>
            <p className="text-gray-600 text-sm">Контролируем качество на каждом этапе — от добычи до отгрузки.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="font-bold text-xl mb-2">Своя техника</h3>
            <p className="text-gray-600 text-sm">Оперативная доставка по Кызылу и Республике Тыва без задержек.</p>
          </div>
          <div>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="font-bold text-xl mb-2">Честные цены</h3>
            <p className="text-gray-600 text-sm">Работаем напрямую, поэтому предлагаем лучшие условия на рынке.</p>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-6 max-w-7xl mx-auto flex-grow scroll-mt-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-[#1C1C1E]">Наши направления</h3>
          <div className="w-24 h-1 bg-[#C9A227] mx-auto"></div>
        </div>
        
        {isLoading ? (
          <p className="text-center text-gray-500">Загрузка каталога...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-red-500">Нет данных. Проверьте базу.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="group relative bg-white rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
                <div className="h-56 bg-gray-200 overflow-hidden relative">
                  {service.image_url ? (
                    <img 
                      src={service.image_url} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#2D2D2D] text-gray-400">
                      Фото скоро появится
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold mb-3 text-[#1C1C1E]">{service.title}</h4>
                  <p className="text-gray-600 mb-6 flex-grow text-sm leading-relaxed">{service.short_desc}</p>
                  
                  <a href={'/' + service.slug} className="inline-flex items-center text-[#C9A227] font-bold group-hover:text-[#b08d1e] transition-colors">
                    Подробнее 
                    <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-[#1C1C1E] text-gray-400 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-white font-bold text-xl mb-4">ООО «РЕСУРСЫ»</h3>
            <p className="text-sm max-w-md mb-6">
              Производственный холдинг в г. Кызыл. Бетон, щебень, песок, ФБС, керамзитобетонные блоки, аренда спецтехники и грузоперевозки.
            </p>
            
            <div className="text-xs text-gray-500 space-y-1 mt-4 border-t border-gray-800 pt-4">
              <p>Юр. адрес: 667010, РТ, г. Кызыл, ул. Энергетиков, д.6, Строение А</p>
              <p>ИНН: 1701056444 | КПП: 170101001 | ОГРН: 1151719001411</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#services" onClick={scrollToServices} className="hover:text-[#C9A227]">Направления</a></li>
              <li><a href="#" className="hover:text-[#C9A227]">О компании</a></li>
              <li><a href="#" className="hover:text-[#C9A227]">Контакты</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm mb-6">
              <li>г. Кызыл, ул. Энергетиков, д.6, Лит. А</li>
              <li><a href="tel:+73942222200" className="hover:text-[#C9A227]">8 (394 22) 2-22-00</a></li>
              <li>
                <a 
                  href="https://e.mail.ru/compose/?to=investor17@bk.ru&subject=Заявка с сайта ООО «Ресурсы»" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-[#C9A227] transition-colors"
                  title="Написать письмо через Mail.ru"
                >
                  investor17@bk.ru
                </a>
              </li>
            </ul>
            
            <div className="relative group">
              <div 
                className="w-full h-48 rounded-lg overflow-hidden border border-gray-700 bg-gray-800 relative cursor-pointer"
                onClick={() => setIsMapOpen(true)}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10 flex items-center justify-center pointer-events-none">
                  <span className="bg-[#C9A227] text-[#1C1C1E] text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    Нажмите, чтобы увеличить
                  </span>
                </div>
                <iframe 
                  src="https://yandex.ru/map-widget/v1/?ll=94.381379%2C51.693385&z=16&pt=94.381379,51.693385,pm2rdm" 
                  width="100%" 
                  height="100%" 
                  frameBorder="0"
                  title="Карта проезда"
                  className="pointer-events-none"
                ></iframe>
              </div>
              
              <a 
                href="https://2gis.ru/kyzyl/search/51.693385%2C%2094.381379" 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute bottom-2 right-2 z-20 bg-white text-[#1C1C1E] text-xs font-bold px-3 py-1.5 rounded-md shadow hover:bg-gray-100 transition flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Маршрут в 2ГИС
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-sm">
          © 2024 ООО «РЕСУРСЫ». Все права защищены.
        </div>
      </footer>

      <CallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} source="Главная страница" />

      {isMapOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-modal"
          onClick={() => setIsMapOpen(false)}
        >
          <div 
            className="relative w-full max-w-6xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white p-3 flex justify-between items-center shadow-sm z-10">
              <a 
                href="https://2gis.ru/kyzyl/search/51.693385%2C%2094.381379" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#C9A227] text-[#1C1C1E] px-5 py-2 rounded-lg font-bold text-sm hover:bg-yellow-500 transition shadow"
              >
                Построить маршрут в 2ГИС
              </a>
              <button 
                onClick={() => setIsMapOpen(false)}
                className="text-gray-400 hover:text-red-500 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 relative">
              <iframe 
                src="https://yandex.ru/map-widget/v1/?ll=94.381379%2C51.693385&z=16&pt=94.381379,51.693385,pm2rdm" 
                width="100%" 
                height="100%" 
                frameBorder="0"
                title="Большая карта"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}