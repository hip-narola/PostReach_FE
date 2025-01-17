// context/DataContext.tsx
"use client"
import { createContext, useState, ReactNode } from 'react';
import { DataContextResponseType } from '../shared/dataPass';

interface DataContextType {
    sharedData: object ;
    setSharedData: (data: DataContextResponseType) => void;

    mobileSidenav: boolean;
    setMobileSidenav: (settings: boolean) => void;

    getSidebarAccess: boolean;
    setSidebarAccess: (disabled: boolean) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [sharedData, setSharedData] = useState<object>({});
  const [mobileSidenav, setMobileSidenav] = useState<boolean>(false);
  const [getSidebarAccess, setSidebarAccess] = useState<boolean>(true);
  return (
    <DataContext.Provider value={{ sharedData, setSharedData ,mobileSidenav, setMobileSidenav,getSidebarAccess,setSidebarAccess}}>
      {children}
    </DataContext.Provider>
  );
};