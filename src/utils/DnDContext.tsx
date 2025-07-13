import { createContext, useState, type ReactNode } from 'react';
 
 
const DnDContext = createContext<[string | null, (arg: string) => void]>([null, (_) => {}]);
 
export const DnDProvider = ({ children }: {children: ReactNode}) => {
  const [type, setType] = useState<string | null>(null);
 
  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}
 
export default DnDContext;