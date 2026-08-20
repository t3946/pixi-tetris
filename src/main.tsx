import { createRoot } from 'react-dom/client'
import { App } from './App'
import { loadFonts } from '@src/assets/fonts'

async function start() {
    await loadFonts()
    createRoot(document.getElementById('root')!).render(<App />)
}

void start()
