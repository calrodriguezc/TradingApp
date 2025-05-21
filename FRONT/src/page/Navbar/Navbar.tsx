import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { GripHorizontalIcon } from "lucide-react";
import Sidebar from "./Sidebar";
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";  // Asegúrate de tener este componente disponible
import foto_perfil from '@/image/foto_perfil.png';
import icono_trading from '@/image/icono_trading.png';
import { useUser } from '@/page/Navbar/UserContext';

const Navbar = () => {
    const { role } = useUser();

    const getRoleName = () => {
        switch (role) {
            case 'ADMIN':
                return 'ADMINISTRADOR';
            case 'INVESTOR':
                return 'INVERSIONISTA';
            case 'COMMISSION':
                return 'COMISIONISTA';
            default:
                return 'INVERSIONrISTA'; // O cualquier valor por defecto que prefieras
        }
    };

    const getRoleColor = () => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-500'; // Rojo para admin
            case 'INVESTOR':
                return 'bg-[#16C784]'; // Verde para inversionista
            case 'COMMISSION':
                return 'bg-blue-500'; // Azul para comisionista
            default:
                return 'bg-gray-500';
        }
    };
    return (
        <div className='px-4 py-3 border-b z-50 bg-[#1E1E1E] text-white sticky top-0 left-0 right-0 flex justify-between items-center'>

            {/* Menú + Título */}
            <div className='flex items-center gap-4'>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full h-11 w-11">
                            <GripHorizontalIcon className="h-7 w-7" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-72 border-r-0 flex flex-col justify-center bg-[#1E1E1E] text-white" side="left">
                        <SheetHeader>
                            <SheetTitle>
                                <div className="text-2xl flex justify-center items-center gap-2">
                                    <Avatar>
                                        <AvatarImage src={icono_trading} />
                                    </Avatar>
                                    <span className="text-white"> Plataforma</span>
                                </div>
                            </SheetTitle>
                        </SheetHeader>
                        <Sidebar />
                    </SheetContent>
                </Sheet>
                <p className="text-base lg:text-lg font-semibold">Aplicativo Web Trading - Acciones El Bosque</p>
            </div>

            {/* Búsqueda */}
            <div className='flex-1 mx-6 max-w-md'>
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Buscar activos o acciones..."
                        className="pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-600 text-white placeholder-gray-400 rounded-lg w-full"
                    />
                </div>
            </div>

            {/* Perfil + Rol */}
            <div className='flex items-center gap-4'>
                <Badge className={`text-white ${getRoleColor()}`} variant="outline">
                    {getRoleName()}
                </Badge>
                <Avatar>
                    <AvatarImage src={foto_perfil} />
                </Avatar>
            </div>

        </div>
    );
};

export default Navbar;