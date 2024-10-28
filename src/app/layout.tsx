// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SideNav from '@/components/SideNav'
import { FeedProvider } from '@/contexts/FeedContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OL Hub v2',
  description: 'Schedule and manage tutoring sessions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <FeedProvider>
          {children}
        </FeedProvider>
      </body>
    </html>
  )
}
