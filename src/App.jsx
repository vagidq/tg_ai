import { useEffect, useRef, useState } from 'react'
import Mascot from './components/Mascot.jsx'

const STYLES = [
  {
    id: 'cyberpunk',
    name: 'Киберпанк',
    icon: '⚡',
    gradient: 'from-neutral-700 via-neutral-800 to-neutral-950',
  },
  {
    id: 'anime',
    name: 'Аниме',
    icon: '✨',
    gradient: 'from-neutral-600 via-neutral-700 to-neutral-900',
  },
  {
    id: 'realism',
    name: 'Реализм',
    icon: '📷',
    gradient: 'from-neutral-500 via-neutral-700 to-neutral-800',
  },
  {
    id: 'sketch',
    name: 'Эскиз',
    icon: '✏️',
    gradient: 'from-neutral-400 via-neutral-600 to-neutral-700',
  },
]

const glassCard =
  'glass-panel rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md'
const glassButton =
  'glass-panel w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 font-outfit text-base font-semibold text-neutral-100 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-[0.98]'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getMascotState(isGenerating, hasResult) {
  if (isGenerating) return 'thinking'
  if (hasResult) return 'success'
  return 'idle'
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
  const mascotState = getMascotState(isGenerating, hasResult)
  const isMainScreen = !isGenerating && !hasResult

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
      : 'Выбери стиль и загрузи фото'

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-black via-neutral-950 to-neutral-900 px-4 py-6 font-outfit text-neutral-100 sm:px-6 sm:py-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {isMainScreen && (
        <div className="pointer-events-none fixed right-0 bottom-0 z-20 translate-x-4 translate-y-2 sm:translate-x-2 sm:translate-y-0">
          <Mascot state="idle" size="xl" />
        </div>
      )}

      <div
        className={`animate-in relative z-10 mx-auto flex w-full max-w-lg flex-col gap-6 sm:gap-8 ${
          isMainScreen ? 'pb-36 sm:pb-44' : ''
        }`}
      >
        <header className="text-center">
          {!isMainScreen && (
            <div className="mb-4 flex justify-center">
              <Mascot state={mascotState} size="lg" />
            </div>
          )}
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {greeting}
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-neutral-500">
            {subtitle}
          </p>
        </header>

        {isGenerating && (
          <div className="animate-in flex flex-col items-center gap-6 pb-8">
            <p className="text-pulse-muted text-xl font-bold tracking-tight text-neutral-300 sm:text-2xl">
              Обработка нейросетью...
            </p>
          </div>
        )}

        {hasResult && selectedStyle && (
          <div className="animate-in flex flex-col gap-6">
            <h2 className="text-center text-2xl font-black tracking-tight text-white">
              Результат
            </h2>
            <div className={`${glassCard} p-3`}>
              <div
                className={`h-64 w-full rounded-xl bg-gradient-to-br ${selectedStyle.gradient}`}
              />
            </div>
            <p className="text-center text-sm font-medium text-neutral-500">
              Стиль:{' '}
              <span className="text-neutral-200">{selectedStyle.name}</span>
            </p>
            <button type="button" onClick={handleTryAgain} className={glassButton}>
              Попробовать снова
            </button>
          </div>
        )}

        {isMainScreen && (
          <>
            {selectedImage && (
              <div className="animate-in flex flex-col items-center gap-3">
                <div className={`${glassCard} p-2`}>
                  <img
                    src={selectedImage.previewUrl}
                    alt="Загруженное фото"
                    className="h-40 w-40 rounded-xl object-cover sm:h-48 sm:w-48"
                  />
                </div>
                <p className="max-w-full truncate text-xs font-medium text-neutral-600">
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
                    className={`animate-fade-in-down group flex flex-col overflow-hidden rounded-2xl border text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
                      isSelected
                        ? 'border-white/40 bg-white/10 ring-2 ring-white/30'
                        : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
                    }`}
                  >
                    <div
                      className={`flex h-24 items-center justify-center bg-gradient-to-br ${style.gradient} transition-transform duration-300 group-hover:scale-105 sm:h-28`}
                    >
                      <span className="text-4xl drop-shadow-lg" aria-hidden="true">
                        {style.icon}
                      </span>
                    </div>
                    <div className="px-3 py-3">
                      <span className="text-sm font-bold tracking-tight text-neutral-200 sm:text-base">
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
                className={glassButton}
              >
                {selectedImage ? 'Изменить фото' : 'Выбрать фото'}
              </button>
            )}

            {canGenerate && (
              <button
                type="button"
                onClick={handleGenerate}
                className="w-full rounded-2xl bg-white py-4 text-base font-black tracking-tight text-black transition-all duration-300 hover:bg-neutral-200 active:scale-[0.98]"
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
