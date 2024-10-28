'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type ResolvedEventsContextType = {
  resolvedEvents: Set<string>;
  setResolvedEvents: (events: Set<string>) => void;
};

const ResolvedEventsContext = createContext<ResolvedEventsContextType | undefined>(undefined);

export function ResolvedEventsProvider({ children }: { children: React.ReactNode }) {
  const [resolvedEvents, setResolvedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedEvents = localStorage.getItem('resolvedEvents');
    if (storedEvents) {
      setResolvedEvents(new Set<string>(JSON.parse(storedEvents)));
    }
  }, []);

  return (
    <ResolvedEventsContext.Provider value={{ resolvedEvents, setResolvedEvents }}>
      {children}
    </ResolvedEventsContext.Provider>
  );
}

export const useResolvedEvents = () => {
  const context = useContext(ResolvedEventsContext);
  if (!context) {
    throw new Error('useResolvedEvents must be used within ResolvedEventsProvider');
  }
  return context;
};

