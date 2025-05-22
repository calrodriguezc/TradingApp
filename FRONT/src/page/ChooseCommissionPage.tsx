import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';

interface Commission {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
}

const ChooseCommissionPage = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [investorId, setInvestorId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Obtener perfil para obtener el ID del inversionista
    fetch('http://localhost:8080/api/mi-perfil', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setInvestorId(data.id))
      .catch((err) => console.error('Error al obtener perfil del inversionista:', err));
  }, []);

  useEffect(() => {
    fetch('http://localhost:8080/investor/commissions', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setCommissions(data))
      .catch((err) => console.error('Error al obtener comisionistas:', err));
  }, []);

  const assignCommission = () => {
    if (!selectedCommission || investorId === null) return;

    const url = `http://localhost:8080/investor/${investorId}/assign-commission?commission_id=${selectedCommission.id}`;

    fetch(url, {
      method: 'PUT',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || 'Comisionista asignado con éxito');
      })
      .catch((error) => {
        console.error('Error al asignar comisionista:', error);
        setMessage('Ocurrió un error al asignar el comisionista.');
      });
  };

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Tabla de comisionistas */}
        <div className="w-full lg:w-1/2 border-r border-gray-700 overflow-y-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Comisionistas Disponibles</h2>
          <table className="min-w-full text-left text-sm border border-gray-600">
            <thead className="bg-[#1A1A1A] text-gray-300">
              <tr>
                <th className="px-4 py-2 border-b border-gray-700">Nombre</th>
                <th className="px-4 py-2 border-b border-gray-700">Email</th>
                <th className="px-4 py-2 border-b border-gray-700">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-800 cursor-pointer"
                  onClick={() => {
                    setSelectedCommission(c);
                    setMessage(null); // Limpiar mensaje anterior
                  }}
                >
                  <td className="px-4 py-2 border-b border-gray-700 text-blue-400 underline">
                    {c.name} {c.lastName}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">{c.email}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{c.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel derecho - Detalles del comisionista */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
          {selectedCommission ? (
            <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-green-300">Detalles del Comisionista</h3>
              <p><span className="font-semibold text-gray-300">Nombre:</span> {selectedCommission.name} {selectedCommission.lastName}</p>
              <p><span className="font-semibold text-gray-300">Email:</span> {selectedCommission.email}</p>
              <p><span className="font-semibold text-gray-300">Teléfono:</span> {selectedCommission.phoneNumber}</p>
              <p><span className="font-semibold text-gray-300">Usuario:</span> {selectedCommission.username}</p>

              <button
                onClick={assignCommission}
                className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
              >
                Elegir este comisionista
              </button>

              {message && (
                <p className="mt-3 text-sm text-yellow-400">{message}</p>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-20">
              Selecciona un comisionista para ver detalles.
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[#1A1A1A] text-gray-400 p-4 text-sm text-center border-t border-gray-700">
        © 2025 Acciones El Bosque. Todos los derechos reservados. | Contacto: info@accioneselbosque.com
      </footer>
    </div>
  );
};

export default ChooseCommissionPage;
