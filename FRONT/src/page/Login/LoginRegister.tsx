import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import tradingImage from '@/image/tradingimage.jpg';
import { toast } from 'sonner';
import { useUser } from '@/page/Navbar/UserContext';

const LoginRegister = () => {
    const { setRole } = useUser();
    const [loginData, setLoginData] = useState({ username: '', password: '', role: '' })
    const [registerData, setRegisterData] = useState({
        username: '', password: '', role: '', name: '', lastName: '',
        cedula: '', email: '', phoneNumber: ''
    })

    const [activeTab, setActiveTab] = useState('login')
    const [loginError, setLoginError] = useState('')
    const [registerErrors, setRegisterErrors] = useState({
        username: '', password: '', name: '', lastName: '',
        cedula: '', email: '', phoneNumber: '', role: ''
    })

    const navigate = useNavigate()

    const backgroundStyle = {
        backgroundImage: `url(${tradingImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    // Validation functions
    const validateName = (name: string) => {
        return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)
    }

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const validatePhone = (phone: string) => {
        return /^\d+$/.test(phone)
    }

    const allowedRoles = ['ADMIN', 'INVESTOR', 'COMMISSION']

    const validateForm = () => {
        const errors = {
            username: !registerData.username ? 'Usuario requerido' : '',
            password: registerData.password.length < 9
                ? 'La contraseña debe tener al menos 9 caracteres'
                : '',
            name: !registerData.name
                ? 'Nombre requerido'
                : !validateName(registerData.name)
                    ? 'El nombre no debe contener números'
                    : '',
            lastName: !registerData.lastName
                ? 'Apellido requerido'
                : !validateName(registerData.lastName)
                    ? 'El apellido no debe contener números'
                    : '',
            role: !registerData.role || !allowedRoles.includes(registerData.role)
                ? 'Rol inválido o no seleccionado'
                : '',
            cedula: registerData.cedula.length < 9
                ? 'La cédula debe tener al menos 9 dígitos'
                : '',
            email: !registerData.email
                ? 'Correo requerido'
                : !validateEmail(registerData.email)
                    ? 'Formato de correo inválido (ejemplo@dominio.com)'
                    : '',
            phoneNumber: !registerData.phoneNumber
                ? 'Celular requerido'
                : !validatePhone(registerData.phoneNumber)
                    ? 'El celular solo debe contener números'
                    : ''
        }

        setRegisterErrors(errors)
        return !Object.values(errors).some(error => error !== '')
    }

    const handleLogin = async () => {
        setLoginError('');

        if (!loginData.username || !loginData.password) {
            setLoginError('Por favor complete todos los campos');
            return;
        }

        const formData = new URLSearchParams();
        formData.append('username', loginData.username);
        formData.append('password', loginData.password);

        try {
            const response = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
                credentials: 'include',
            });

            if (response.ok) {
                // Llamada adicional para obtener el perfil
                const perfilRes = await fetch('http://localhost:8080/api/mi-perfil', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (perfilRes.ok) {
                    const perfilData = await perfilRes.json();
                    const { role } = perfilData;

                    if (['ADMIN', 'INVESTOR', 'COMMISSION'].includes(role)) {
                        setRole(role);
                        toast.success('Inicio de sesión exitoso');
                        navigate('/Home');
                    } else {
                        setLoginError('Rol no autorizado');
                        toast.error('Rol no autorizado');
                    }
                } else {
                    setLoginError('No se pudo obtener el perfil del usuario');
                    toast.error('Error al obtener el rol del usuario');
                }
            } else {
                const errorData = await response.json();
                setLoginError('Credenciales inválidas. Por favor intente nuevamente.');
                toast.error('Credenciales inválidas');
            }
        } catch (error) {
            console.error("Error de red:", error);
            setLoginError('Error de conexión con el servidor');
            toast.error('Error de conexión');
        }
    };

    const handleRegister = async () => {
        const isValid = validateForm();
        if (!isValid) {
            toast.error('Por favor corrija los errores en el formulario');
            return;
        }

        // Elegir el endpoint según el rol
        let registerUrl = '';
        switch (registerData.role) {
            case 'INVESTOR':
                registerUrl = 'http://localhost:8080/api/register/investor';
                break;
            case 'COMMISSION':
                registerUrl = 'http://localhost:8080/api/register/commission';
                break;
            case 'ADMIN':
                registerUrl = 'http://localhost:8080/api/register/admin';
                break;
            default:
                toast.error('Rol inválido');
                return;
        }

        try {
            const res = await fetch(registerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error del servidor:', errorData);
                toast.error(errorData.message || 'Error al registrar');
                return;
            }

            const result = await res.json();
            toast.success('Usuario registrado correctamente');
            setActiveTab('login');

            // Limpiar formulario
            setRegisterData({
                username: '', password: '', role: '', name: '', lastName: '',
                cedula: '', email: '', phoneNumber: ''
            });
        } catch (err) {
            console.error('Error de red:', err);
            toast.error('Error en la conexión con el servidor');
        }
    };


    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4"
            style={backgroundStyle}
        >
            <div className="relative z-10 w-full max-w-md text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Aplicativo Web Trading</h1>
                <p className="text-lg text-white">Acciones El Bosque</p>
            </div>

            <div className="relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px] bg-white p-6 rounded-lg shadow-md bg-opacity-90">
                    <TabsList className="w-full">
                        <TabsTrigger className="data-[state=active]:bg-[#16C784] data-[state=active]:text-white" value="login">Iniciar sesión</TabsTrigger>
                        <TabsTrigger className="data-[state=active]:bg-[#16C784] data-[state=active]:text-white" value="register">Registrarse</TabsTrigger>
                    </TabsList>

                    {/* LOGIN */}
                    <TabsContent value="login">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Iniciar Sesión</CardTitle>
                                <CardDescription>Digite sus datos para entrar a la aplicación</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {loginError && (
                                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md mb-2">
                                        {loginError}
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <Label htmlFor="username">Usuario</Label>
                                    <Input
                                        id="username"
                                        placeholder="usuario123"
                                        value={loginData.username}
                                        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button variant="link" className="underline text-sm text-blue-900 hover:text-blue-950">
                                    ¿Olvidaste la contraseña?
                                </Button>
                                <Button onClick={handleLogin} className="bg-blue-900 hover:bg-blue-950 text-white">
                                    Entrar
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* REGISTER */}
                    <TabsContent value="register">
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Registrarse</CardTitle>
                                <CardDescription>Complete los campos para crear su cuenta</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    {
                                        label: 'Nombre de usuario',
                                        id: 'username',
                                        placeholder: 'usuario123',
                                        error: registerErrors.username
                                    },
                                    {
                                        label: 'Contraseña',
                                        id: 'password',
                                        type: 'password',
                                        placeholder: 'Mínimo 9 caracteres',
                                        error: registerErrors.password
                                    },
                                    {
                                        label: 'Nombre',
                                        id: 'name',
                                        placeholder: 'Juan',
                                        error: registerErrors.name
                                    },
                                    {
                                        label: 'Apellido',
                                        id: 'lastName',
                                        placeholder: 'Pérez',
                                        error: registerErrors.lastName
                                    },
                                    {
                                        label: 'Cédula',
                                        id: 'cedula',
                                        placeholder: '123456789',
                                        error: registerErrors.cedula
                                    },
                                    {
                                        label: 'Correo',
                                        id: 'email',
                                        placeholder: 'ejemplo@dominio.com',
                                        error: registerErrors.email
                                    },
                                    {
                                        label: 'Celular',
                                        id: 'phoneNumber',
                                        placeholder: '0987654321',
                                        error: registerErrors.phoneNumber
                                    }
                                ].map(({ label, id, type, placeholder, error }) => (
                                    <div className="space-y-1" key={id}>
                                        <Label htmlFor={id}>{label}</Label>
                                        <Input
                                            id={id}
                                            type={type || 'text'}
                                            placeholder={placeholder}
                                            value={registerData[id as keyof typeof registerData]}
                                            onChange={(e) => {
                                                setRegisterData({ ...registerData, [id]: e.target.value })
                                                // Clear error when typing
                                                if (error) {
                                                    setRegisterErrors({ ...registerErrors, [id]: '' })
                                                }
                                            }}
                                            className={error ? 'border-red-500' : ''}
                                        />
                                        {error && (
                                            <p className="text-red-500 text-xs mt-1">{error}</p>
                                        )}
                                    </div>
                                ))}
                                <div className="space-y-1">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select
                                        value={registerData.role}
                                        onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="INVESTOR">Inversor</SelectItem>
                                            <SelectItem value="COMMISSION">Comisionista</SelectItem>
                                            <SelectItem value="ADMIN">Administrador</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {registerErrors.role && (
                                        <p className="text-red-500 text-sm">{registerErrors.role}</p>
                                    )}
                                </div>

                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button className="bg-blue-900 hover:bg-blue-950 text-white" onClick={handleRegister}>
                                    Guardar
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default LoginRegister