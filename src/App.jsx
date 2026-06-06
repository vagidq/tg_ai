import { useEffect, useRef, useState } from 'react'

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

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function App() {
  const [selectedStyleId, setSelectedStyleId] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasResult, setHasResult] = useState(false)
  const fileInputRef = useRef(null)
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user || null

  const selectedStyle = STYLES.find((style) => style.id === selectedStyleId)
  const canGenerate = Boolean(selectedStyle && selectedImage && !isGenerating && !hasResult)

  function handleStyleSelect(style) {
    setSelectedStyleId(style.id)
    console.log(`Выбран стиль: ${style.name}`)
  }

  function handleSelectPhotoClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    console.log('Имя файла:', file.name)
    console.log('Размер файла:', formatFileSize(file.size))

    setSelectedImage((prev) => {
      if (prev?.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl)
      }
      return {
        file,
        name: file.name,
        size: file.size,
        previewUrl: URL.createObjectURL(file),
      }
    })

    event.target.value = ''
  }

  function handleGenerate() {
    setIsGenerating(true)
    setHasResult(false)
  }

  function handleTryAgain() {
    setIsGenerating(false)
    setHasResult(false)
    setSelectedStyleId(null)
    setSelectedImage((prev) => {
      if (prev?.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl)
      }
      return null
    })
  }

  useEffect(() => {
    console.log('User data:', window.Telegram?.WebApp?.initDataUnsafe?.user)

    const webApp = window.Telegram?.WebApp
    if (webApp) {
      webApp.ready()
      webApp.expand()
    }
  }, [])

  useEffect(() => {
    return () => {
      if (selectedImage?.previewUrl) {
        URL.revokeObjectURL(selectedImage.previewUrl)
      }
    }
  }, [selectedImage])

  useEffect(() => {
    if (!isGenerating) return

    const timer = setTimeout(() => {
      setIsGenerating(false)
      setHasResult(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isGenerating])

  const greeting = user
    ? `Привет, ${user.first_name}!`
    : 'Привет, гость!'

  const subtitle = isGenerating
    ? 'Подождите немного...'
    : hasResult
      ? 'Готово!'
      : 'Выберите стиль для генерации'

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-8 text-[#f5f5f5] sm:px-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mx-auto flex w-full max-w-lg flex-col gap-8">
        <header className="text-center">
          <h1 className="text-2xl font-medium leading-snug sm:text-3xl">
            {greeting}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">{subtitle}</p>
        </header>

        {isGenerating && (
          <div className="flex flex-col items-center justify-center gap-8 py-20">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500/25 border-t-blue-500" />
            </div>
            <p className="animate-pulse text-lg font-medium text-neutral-300">
              Генерируем ваш стиль...
            </p>
          </div>
        )}

        {hasResult && selectedStyle && (
          <div className="flex flex-col gap-6">
            <h2 className="text-center text-xl font-semibold">Результат:</h2>
            <div
              className={`mx-auto h-64 w-full max-w-sm rounded-2xl bg-gradient-to-br shadow-lg ${selectedStyle.gradient}`}
            />
            <p className="text-center text-sm text-neutral-400">
              Стиль: {selectedStyle.name}
            </p>
            <button
              type="button"
              onClick={handleTryAgain}
              className="w-full rounded-xl border border-white/15 bg-[#1e1e1e] py-3.5 text-base font-medium text-[#f5f5f5] transition-all duration-200 hover:border-blue-400/50 hover:bg-[#252525] active:scale-[0.98]"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {!isGenerating && !hasResult && (
          <>
            {selectedImage && (
              <div className="flex flex-col items-center gap-2">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e1e] p-2 shadow-lg">
                  <img
                    src={selectedImage.previewUrl}
                    alt="Загруженное фото"
                    className="h-40 w-40 rounded-xl object-cover sm:h-48 sm:w-48"
                  />
                </div>
                <p className="max-w-full truncate text-xs text-neutral-400">
                  {selectedImage.name} · {formatFileSize(selectedImage.size)}
                </p>
              </div>
            )}

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
                onClick={handleSelectPhotoClick}
                className="w-full rounded-xl border border-white/15 bg-[#1e1e1e] py-3.5 text-base font-medium text-[#f5f5f5] transition-all duration-200 hover:border-blue-400/50 hover:bg-[#252525] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] active:scale-[0.98]"
              >
                {selectedImage ? 'Изменить фото' : 'Выбрать фото'}
              </button>
            )}

            {canGenerate && (
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full rounded-xl bg-blue-500 py-3.5 text-base font-semibold text-white transition-colors hover:bg-blue-400 active:bg-blue-600"
              >
                Сгенерировать
              </button>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default App
