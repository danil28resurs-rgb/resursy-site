import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-[#1C1C1E] text-white p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-[#C9A227] mb-6">АДМИНКА</h2>
        <Link href="/admin" className="hover:text-[#C9A227] transition">Главная</Link>
        <Link href="/admin/services" className="hover:text-[#C9A227] transition">Направления и цены</Link>
        <Link href="/admin/leads" className="hover:text-[#C9A227] transition">Заявки с сайта</Link>
        <Link href="/" className="mt-auto text-sm text-gray-400 hover:text-white transition pt-4 border-t border-gray-700">
          ← Вернуться на сайт
        </Link>
      </aside>

      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Добро пожаловать!</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-2">Управление сайтом</h3>
            <p className="text-gray-600 mb-4">Добавляйте фото, меняйте цены и описания услуг.</p>
            <Link href="/admin/services" className="bg-[#C9A227] text-[#1C1C1E] px-4 py-2 rounded font-bold inline-block">Перейти к услугам</Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold mb-2">Заявки клиентов</h3>
            <p className="text-gray-600 mb-4">Смотрите, кто оставил заявку на обратный звонок.</p>
            <Link href="/admin/leads" className="border border-gray-300 px-4 py-2 rounded font-bold inline-block hover:bg-gray-50">Смотреть заявки</Link>
          </div>
        </div>
      </main>
    </div>
  )
}