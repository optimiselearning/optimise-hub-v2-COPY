'use client';

import Link from 'next/link';
import { useLessonStore } from '@/store/lessonStore';
import { useResolvedEvents } from '@/contexts/ResolvedEventsContext';
import { usePathname } from 'next/navigation';

export function DashboardNav() {
  const { feedEvents } = useLessonStore();
  const { resolvedEvents } = useResolvedEvents();
  const pathname = usePathname();
  
  const unreadCount = feedEvents.filter(event => !resolvedEvents.has(event.id)).length;

  return (
    <nav className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
          <span className="text-xl font-semibold mr-10">OL Hub v2</span>
          <Link 
            href="/student" 
            className={`block mr-4 text-black antialiased hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums ${pathname === '/student' ? 'font-bold' : 'font-medium'}`}
          >
            Student Login
          </Link>
          <Link 
            href="/tutor" 
            className={`block mr-4 text-black antialiased hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums ${pathname === '/tutor' ? 'font-bold' : 'font-medium'}`}
          >
            Tutor Login
          </Link>
          <Link 
            href="/admin" 
            className={`block mr-4 text-black antialiased hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums ${pathname === '/admin' ? 'font-bold' : 'font-medium'}`}
          >
            Admin Login
          </Link>
          <Link 
            href="/user-feed" 
            className={`block mr-[100px] text-black antialiased hover:underline hover:underline-offset-2 hover:decoration-black hover:decoration-2 tabular-nums relative ${pathname === '/user-feed' ? 'font-bold' : 'font-medium'}`}
          >
            User Feed
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>
          <Link 
            href="/" 
            className="block text-black px-2 py-1 font-black border border-black antialiased text-sm hover:bg-black hover:text-white tabular-nums"
          >
            Logout
          </Link>
        </div>
      </nav>
  );
}
