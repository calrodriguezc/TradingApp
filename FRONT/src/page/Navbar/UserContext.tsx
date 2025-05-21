// UserContext.tsx
import { createContext, useContext, useState } from 'react';

type UserRole = 'ADMIN' | 'INVESTOR' | 'COMMISSION' | '';

interface UserContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const UserContext = createContext<UserContextType>({
  role: '',
  setRole: () => {},
});

// Exporta el Provider como una exportación nombrada
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole>('');

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
};

// Asegúrate de que el hook useUser sea una exportación nombrada
export const useUser = () => useContext(UserContext);

// Opcional: Exporta el contexto si lo necesitas en otros lugares
export default UserContext;