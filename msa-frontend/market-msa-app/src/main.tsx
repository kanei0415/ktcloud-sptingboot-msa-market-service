import { createRoot } from 'react-dom/client'
import './index.css'
import TanStackProvider from '@providers/TanStackProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <TanStackProvider />
)
