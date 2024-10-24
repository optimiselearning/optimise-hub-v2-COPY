// src/app/(dashboard)/layout.tsx
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="min-h-screen bg-white">
        <nav className="border-b border-black/10">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <span className="text-xl font-semibold">OL Hub v2</span>
            <a 
              href="/" 
              className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition-colors"
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