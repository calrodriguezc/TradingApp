import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';

interface Investor {
  id: number;
  username: string;
  password: string;
  role: string;
  name: string;
  lastName: string;
  cedula: string;
  email: string;
  phoneNumber: string;
  alpacaAccount: any;
  achRelationship: any;
  commission: any;
  enabled: boolean;
  credentialsNonExpired: boolean;
  accountNonExpired: boolean;
  authorities: string[];
  accountNonLocked: boolean;
}

const InvestorsPage = () => {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [commissionId, setCommissionId] = useState<number | null>(null);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  // Obtener perfil del comisionista logeado
  useEffect(() => {
    fetch('http://localhost:8080/api/mi-perfil', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setCommissionId(data.id);
      })
      .catch((err) => console.error('Error al obtener el perfil:', err));
  }, []);

  // Obtener inversionistas asociados
  useEffect(() => {
    if (commissionId !== null) {
      fetch(`http://localhost:8080/investor/by-commission/${commissionId}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => setInvestors(data))
        .catch((err) => console.error('Error al obtener inversionistas:', err));
    }
  }, [commissionId]);

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Tabla de inversionistas */}
        <div className="w-full lg:w-1/2 border-r border-gray-700 overflow-y-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Inversionistas Asociados</h2>
          <table className="min-w-full text-left text-sm border border-gray-600">
            <thead className="bg-[#1A1A1A] text-gray-300">
              <tr>
                <th className="px-4 py-2 border-b border-gray-700">Nombre</th>
                <th className="px-4 py-2 border-b border-gray-700">Apellido</th>
                <th className="px-4 py-2 border-b border-gray-700">Cédula</th>
                <th className="px-4 py-2 border-b border-gray-700">Email</th>
                <th className="px-4 py-2 border-b border-gray-700">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {investors.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-gray-800 cursor-pointer"
                >
                  <td
                    className="px-4 py-2 border-b border-gray-700 text-blue-400 underline"
                    onClick={() => setSelectedInvestor(inv)}
                  >
                    {inv.name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">{inv.lastName}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{inv.cedula}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{inv.email}</td>
                  <td className="px-4 py-2 border-b border-gray-700">{inv.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel derecho - Detalles del inversionista */}
        <div className="w-full lg:w-1/2 p-6 overflow-y-auto">
          {selectedInvestor ? (
            <div className="bg-[#1e1e1e] p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-blue-300">Detalles del Inversionista</h3>
              <pre className="text-sm whitespace-pre-wrap text-gray-300">
                {JSON.stringify(selectedInvestor, null, 2)}
              </pre>
            </div>
          ) : (
            <div className="text-gray-400 text-center mt-20">
              Selecciona un inversionista para ver detalles.
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

export default InvestorsPage;
