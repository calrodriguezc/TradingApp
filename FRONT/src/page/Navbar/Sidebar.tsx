import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import {
  BookmarkIcon,
  CreditCardIcon,
  ExternalLinkIcon,
  HomeIcon,
  LandmarkIcon,
  LayoutDashboardIcon,
  PersonStandingIcon,
  WalletIcon,
  SettingsIcon,
  UsersIcon,
  ShieldIcon,
  FileTextIcon,
  GlobeIcon,
  DatabaseIcon
} from 'lucide-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

type MenuItem = {
  name: string;
  path?: string;
  onClick?: () => void;
  icon: React.ReactNode;
};

interface SidebarBaseProps {
  menu: MenuItem[];
}

// Componente para el sidebar de ADMIN
const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      navigate("/");
    }
  };

  const adminMenu = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboardIcon className='h-5 w-5' /> },
    { name: "Usuarios", path: "/admin/users", icon: <UsersIcon className='h-5 w-5' /> },
    { name: "Configuración", path: "/admin/settings", icon: <SettingsIcon className='h-5 w-5' /> },
    { name: "Roles y Permisos", path: "/admin/roles", icon: <ShieldIcon className='h-5 w-5' /> },
    { name: "Contenido", path: "/admin/content", icon: <FileTextIcon className='h-5 w-5' /> },
    { name: "Apariencia", path: "/admin/appearance", icon: <GlobeIcon className='h-5 w-5' /> },
    { name: "Backups", path: "/admin/backups", icon: <DatabaseIcon className='h-5 w-5' /> },
    { name: "Perfil", path: "/profile", icon: <PersonStandingIcon className='h-5 w-5' /> },
    { name: "Cerrar sesión", onClick: handleLogout, icon: <ExternalLinkIcon className='h-5 w-5' /> },
  ];

  return <SidebarBase menu={adminMenu} />;
};

// Componente para el sidebar de COMMISSION
const CommissionSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      navigate("/");
    }
  };

  const commissionMenu = [
    { name: "Home", path: "/home", icon: <HomeIcon className='h-5 w-5' /> },
    { name: "Mis Inversionistas", path: "/commission/investors", icon: <UsersIcon className='h-5 w-5' /> },
    { name: "Portafolio", path: "/portfolio", icon: <LayoutDashboardIcon className='h-5 w-5' /> },
    { name: "Lista de deseo", path: "/watchlist", icon: <BookmarkIcon className='h-5 w-5' /> },
    { name: "Billetera", path: "/wallet", icon: <WalletIcon className='h-5 w-5' /> },
    { name: "Detalle de pago", path: "/payment-details", icon: <LandmarkIcon className='h-5 w-5' /> },
    { name: "Retiro", path: "/withdrawal", icon: <CreditCardIcon className='h-5 w-5' /> },
    { name: "Perfil", path: "/profile", icon: <PersonStandingIcon className='h-5 w-5' /> },
    { name: "Cerrar sesión", onClick: handleLogout, icon: <ExternalLinkIcon className='h-5 w-5' /> },
  ];

  return <SidebarBase menu={commissionMenu} />;
};

// Componente para el sidebar de INVESTOR (el original)
const InvestorSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        credentials: "include"
      });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      navigate("/");
    }
  };

  const investorMenu = [
    { name: "Home", path: "/home", icon: <HomeIcon className='h-5 w-5' /> },
    { name: "Portafolio", path: "/portfolio", icon: <LayoutDashboardIcon className='h-5 w-5' /> },
    { name: "Comisionista", path: "/choose-commission", icon: <BookmarkIcon className='h-5 w-5' /> },
    { name: "Billetera", path: "/wallet", icon: <WalletIcon className='h-5 w-5' /> },
    { name: "Detalle de pago", path: "/payment-details", icon: <LandmarkIcon className='h-5 w-5' /> },
    { name: "Retiro", path: "/withdrawal", icon: <CreditCardIcon className='h-5 w-5' /> },
    { name: "Perfil", path: "/profile", icon: <PersonStandingIcon className='h-5 w-5' /> },
    { name: "Cerrar sesión", onClick: handleLogout, icon: <ExternalLinkIcon className='h-5 w-5' /> },
  ];

  return <SidebarBase menu={investorMenu} />;
};

// Componente base que renderiza el menú (para evitar duplicar código)
const SidebarBase: React.FC<SidebarBaseProps> = ({ menu }) => {
  return (
    <div className='px-4 py-6 bg-[#1E1E1E] text-white h-full w-full'>
      <div className='flex flex-col gap-3'>
        {menu.map((item) => (
          <SheetClose asChild key={item.name}>
            {item.path ? (
              <Link to={item.path} className='block'>
                <Button
                  variant="outline"
                  className='flex items-center gap-4 w-full justify-start px-4 py-3 bg-[#2A2A2A] border border-gray-600 text-white hover:bg-[#3A3A3A] transition rounded-lg'>
                  <span>{item.icon}</span>
                  <span className='text-sm font-medium'>{item.name}</span>
                </Button>
              </Link>
            ) : (
              <button
                onClick={item.onClick}
                className='flex items-center gap-4 w-full justify-start px-4 py-3 bg-[#2A2A2A] border border-gray-600 text-white hover:bg-[#3A3A3A] transition rounded-lg text-left'>
                <span>{item.icon}</span>
                <span className='text-sm font-medium'>{item.name}</span>
              </button>
            )}
          </SheetClose>
        ))}
      </div>
    </div>
  );
};

// Componente principal que selecciona el sidebar según el rol
const Sidebar = () => {
  const { role } = useUser();

  if (role === 'ADMIN') return <AdminSidebar />;
  if (role === 'COMMISSION') return <CommissionSidebar />;
  
  // Por defecto retorna el sidebar de inversionista
  return <InvestorSidebar />;
};

export default Sidebar;