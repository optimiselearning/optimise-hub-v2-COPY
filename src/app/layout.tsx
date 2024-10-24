// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SideNav from '@/components/SideNav'

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
      <body className={inter.className}>{children}</body>
    </html>
  )
}