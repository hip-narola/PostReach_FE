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

    getPartner: boolean;
    setPartner: (disabled: boolean) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [sharedData, setSharedData] = useState<object>({});
  const [mobileSidenav, setMobileSidenav] = useState<boolean>(false);
  const [getSidebarAccess, setSidebarAccess] = useState<boolean>(true);
  const [getPartner, setPartner] = useState<boolean>(false);
  return (
    <DataContext.Provider value={{ sharedData, setSharedData ,mobileSidenav, setMobileSidenav,getSidebarAccess,setSidebarAccess,getPartner,setPartner}}>
      {children}
    </DataContext.Provider>
  );
};