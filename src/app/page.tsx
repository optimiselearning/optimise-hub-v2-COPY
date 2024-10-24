// src/app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">OL Hub v2</h1>
      <div className="space-y-4">
        <a 
          href="/student"
          className="block w-48 p-4 text-center bg-black text-white rounded-lg hover:bg-white hover:text-black hover:border-black border border-black"
        >
          Student Login
        </a>
        <a 
          href="/tutor" 
          className="block w-48 p-4 text-center bg-white text-black border border-black rounded-lg hover:bg-black hover:text-white"
        >
          Tutor Login
        </a>
        <a 
          href="/admin" 
          className="block w-48 p-4 text-center bg-gray-100 text-black border border-black rounded-lg hover:bg-black hover:text-white"
        >
          Admin Login
        </a>
      </div>
    </main>
  )
}
