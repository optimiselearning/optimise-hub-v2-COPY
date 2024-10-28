// src/app/(dashboard)/layout.tsx
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <span className="text-xl font-semibold mr-10">OL Hub v2</span>
          <Link 
            href="/student" 
            className="block  mr-4 text-black antialiased font-medium hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums"
          >
            Student Login
          </Link>
          <Link 
            href="/tutor" 
            className="block  mr-4 text-black antialiased font-medium hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums"
          >
            Tutor Login
          </Link>
          <Link 
            href="/admin" 
            className="block mr-4 text-black antialiased font-medium hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums"
          >
            Admin Login
          </Link>
          <Link 
            href="/user-feed" 
            className="block mr-[100px] text-black antialiased font-medium hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums"
          >
            User Feed
          </Link>
          <Link 
            href="/" 
            className="block text-black px-2 py-1 font-black border border-black antialiased text-sm hover:bg-black hover:text-white tabular-nums"
          >
            Logout
          </Link>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
