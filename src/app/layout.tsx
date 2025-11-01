import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bl1nk Note - The Agentic IDE on the Web',
  description: 'AI-Powered Workspace for intelligent automation and design',
  keywords: ['AI', 'IDE', 'automation', 'workspace', 'design'],
  authors: [{ name: 'bl1nk Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div id="root">{children}</div>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}
