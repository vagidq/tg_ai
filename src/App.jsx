import { useEffect } from 'react'

const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#121212',
  color: '#f5f5f5',
  margin: 0,
  padding: '24px',
  boxSizing: 'border-box',
}

const headingStyle = {
  margin: 0,
  fontSize: '28px',
  fontWeight: 500,
  textAlign: 'center',
  lineHeight: 1.4,
}

function App() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user || null

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
    <main style={pageStyle}>
      <h1 style={headingStyle}>{greeting}</h1>
    </main>
  )
}

export default App
