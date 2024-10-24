// src/app/(dashboard)/layout.tsx
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
            <a 
          href="/student"
          className="block w-36 text-black hover:font-bold"
        >
          Student Login
        </a>
        <a 
          href="/tutor" 
          className="block w-36 text-black hover:font-bold"
        >
          Tutor Login
        </a>
        <a 
          href="/admin" 
          className="block w-36 text-black hover:font-bold"
        >
          Admin Login
        </a>
            <a 
              href="/" 
              className="hover:font-semibold"
            >
              Logout
            </a>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    )
  }