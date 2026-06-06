import { useEffect, useState } from 'react'

const STYLES = [
  {
    id: 'cyberpunk',
    name: 'Киберпанк',
    icon: '⚡',
    gradient: 'from-fuchsia-600 via-violet-600 to-cyan-500',
    glow: 'hover:shadow-[0_0_24px_rgba(192,38,211,0.5)]',
  },
  {
    id: 'anime',
    name: 'Аниме',
    icon: '✨',
    gradient: 'from-pink-400 via-rose-400 to-purple-500',
    glow: 'hover:shadow-[0_0_24px_rgba(244,114,182,0.5)]',
  },
  {
    id: 'realism',
    name: 'Реализм',
    icon: '📷',
    gradient: 'from-amber-700 via-stone-600 to-emerald-800',
    glow: 'hover:shadow-[0_0_24px_rgba(180,83,9,0.4)]',
  },
  {
    id: 'sketch',
    name: 'Эскиз',
    icon: '✏️',
    gradient: 'from-neutral-500 via-neutral-400 to-neutral-600',
    glow: 'hover:shadow-[0_0_24px_rgba(163,163,163,0.35)]',
  },
]

function App() {
  const [selectedStyleId, setSelectedStyleId] = useState(null)
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user || null

  const selectedStyle = STYLES.find((style) => style.id === selectedStyleId)

  function handleStyleSelect(style) {
    setSelectedStyleId(style.id)
    console.log(`Выбран стиль: ${style.name}`)
  }

  useEffect(() => {
    console.log('User data:', window.Telegram?.WebApp?.initDataUnsafe?.user)

    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
    }
  }, [])

  const greeting = user
    ? `Привет, ${user.first_name}!`
    : 'Привет, гость!'

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-8 text-[#f5f5f5] sm:px-6">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        <header className="text-center">
          <h1 className="text-2xl font-medium leading-snug sm:text-3xl">
            {greeting}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Выберите стиль для генерации
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4">
          {STYLES.map((style, index) => {
            const isSelected = selectedStyleId === style.id

            return (
            <button
              key={style.id}
              type="button"
              onClick={() => handleStyleSelect(style)}
              style={{ animationDelay: `${index * 80}ms` }}
              className={`animate-fade-in-down group flex flex-col overflow-hidden rounded-2xl border bg-[#1e1e1e] text-left transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] ${
                isSelected
                  ? 'border-transparent ring-2 ring-blue-500'
                  : 'border-white/10 hover:border-white/25'
              } ${style.glow}`}
            >
              <div
                className={`flex h-24 items-center justify-center bg-gradient-to-br ${style.gradient} transition-transform duration-300 group-hover:scale-105 sm:h-28`}
              >
                <span className="text-4xl drop-shadow-md" aria-hidden="true">
                  {style.icon}
                </span>
              </div>
              <div className="px-3 py-3">
                <span className="text-sm font-semibold tracking-wide sm:text-base">
                  {style.name}
                </span>
              </div>
            </button>
            )
          })}
        </section>

        {selectedStyle && (
          <button
            type="button"
            className="w-full rounded-xl bg-blue-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
          >
            Сгенерировать
          </button>
        )}
      </div>
    </main>
  )
}

export default App
