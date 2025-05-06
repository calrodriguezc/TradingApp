import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { useNavigate } from 'react-router-dom'
import tradingImage from '@/image/tradingimage.jpg';

const LoginRegister = () => {
    const [loginData, setLoginData] = useState({ username: '', password: '', role: '' })
    const [registerData, setRegisterData] = useState({
        username: '', password: '', role: '', name: '', lastName: '',
        dni: '', email: '', phoneNumber: ''
    })
    const [activeTab, setActiveTab] = useState('login');

    const navigate = useNavigate()

    // Estilos para el fondo con tu imagen
    const backgroundStyle = {
        backgroundImage: `url(${tradingImage})`, // Cambia esto por la ruta correcta
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    };

    const handleLogin = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            })
            const result = await res.json()
            if (res.ok) {
                navigate('/Home')
                alert('Inicio de sesión exitoso')
            } else {
                alert(result.message || 'Credenciales incorrectas')
            }
        } catch (err) {
            console.error(err)
            alert('Error en la conexión con el servidor')
        }
    }

    const handleRegister = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registerData),
            })
            const result = await res.json()
            if (res.ok) {
                alert('Usuario registrado correctamente');
                setActiveTab('login');
            } else {
                alert(result.message || 'Error al registrar')
            }
        } catch (err) {
            console.error(err)
            alert('Error en la conexión con el servidor')
        }
    }

    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen p-4"
            style={backgroundStyle}
        >
            {/* Capa semitransparente para mejorar legibilidad */}


            <div className="relative z-10 w-full max-w-md text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Aplicativo Web Trading</h1>
                <p className="text-lg text-white">Acciones El Bosque</p>
            </div>

            <div className="relative z-10">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px] bg-white p-6 rounded-lg shadow-md bg-opacity-90">
                    {/* Resto del código permanece igual */}
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
                                <div className="space-y-1">
                                    <Label htmlFor="username">Usuario</Label>
                                    <Input
                                        id="username"
                                        placeholder="usuario"
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
                                <div className="space-y-1">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select onValueChange={(value) => setLoginData({ ...loginData, role: value })}>
                                        <SelectTrigger className="w-full" id="role">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">ADMINISTRADOR</SelectItem>
                                            <SelectItem value="investor">INVERSIONISTA</SelectItem>
                                            <SelectItem value="commission">COMISIONISTA</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                    <TabsContent value="register">x
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>Registrarse</CardTitle>
                                <CardDescription>Complete los campos para crear su cuenta</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {[
                                    { label: 'Nombre de usuario', id: 'username' },
                                    { label: 'Contraseña', id: 'password', type: 'password' },
                                    { label: 'Nombre', id: 'name' },
                                    { label: 'Apellido', id: 'lastName' },
                                    { label: 'Cédula', id: 'dni' },
                                    { label: 'Correo', id: 'email' },
                                    { label: 'Celular', id: 'phoneNumber' }
                                ].map(({ label, id, type }) => (
                                    <div className="space-y-1" key={id}>
                                        <Label htmlFor={id}>{label}</Label>
                                        <Input
                                            id={id}
                                            type={type || 'text'}
                                            value={registerData[id as keyof typeof registerData]}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, [id]: e.target.value })
                                            }
                                        />
                                    </div>
                                ))}
                                <div className="space-y-1">
                                    <Label htmlFor="role">Rol</Label>
                                    <Select onValueChange={(value) => setRegisterData({ ...registerData, role: value })}>
                                        <SelectTrigger className="w-full" id="role">
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">ADMINISTRADOR</SelectItem>
                                            <SelectItem value="investor">INVERSIONISTA</SelectItem>
                                            <SelectItem value="commission">COMISIONISTA</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button className="bg-blue-900 hover:bg-blue-950 text-white" onClick={handleRegister}>Guardar</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default LoginRegister