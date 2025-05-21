// src/page/ProfilePage.tsx
import React from 'react';
import Navbar from './Navbar/Navbar';
import { EditIcon, RefreshCw, UserIcon } from 'lucide-react';

const Profile: React.FC = () => {
  // Datos del perfil basados en el JSON
  const profileData = {
    id: "96a66859-c3f0-42fa-b9b2-3c51750f4338",
    status: "SUBMITTED",
    currency: "USD",
    contact: {
      city: "BOGOTA",
      country: "COL",
      email_address: "carloss@example.com",
      phone_number: "+10000000000",
      street_address: ["CALLE 100 # 135 - 24"],
      local_street_address: null
    },
    identity: {
      given_name: "CARLOS",
      family_name: "RODRIGUEZ",
      date_of_birth: "2002-09-25",
      party_type: "natural_person",
      tax_id_type: "COL_NIT",
      country_of_tax_residence: "COL",
      funding_source: ["employment_income"]
    },
    account_number: "822285670",
    crypto_status: "INACTIVE",
    created_at: "2025-05-08T20:45:12.579368Z",
    account_type: "trading",
    trading_type: "margin"
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleUpdateProfile = () => {
    // Lógica para actualizar el perfil
    alert('Redirigiendo a actualización de perfil');
    // Aquí iría la navegación al formulario de edición
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
  };

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />
      <main className="flex-1 overflow-auto p-6 max-w-3xl mx-auto w-full">
        {/* Contenedor principal del perfil */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 mb-6 border border-gray-700">
          {/* Encabezado con título e ícono de recarga */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <UserIcon className="h-5 w-5" /> Perfil del Usuario
            </h2>
            <button
              onClick={handleRefresh}
              className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
              aria-label="Recargar"
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>

          {/* Sección de información personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#2A2A2A] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Información Personal</h3>
              <div className="space-y-2">
                <p><span className="text-gray-400">Nombre:</span> {profileData.identity.given_name} {profileData.identity.family_name}</p>
                <p><span className="text-gray-400">Fecha de nacimiento:</span> {formatDate(profileData.identity.date_of_birth)}</p>
                <p><span className="text-gray-400">Tipo de identificación:</span> {profileData.identity.tax_id_type}</p>
                <p><span className="text-gray-400">Residencia fiscal:</span> {profileData.identity.country_of_tax_residence}</p>
              </div>
            </div>

            <div className="bg-[#2A2A2A] p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">Información de Contacto</h3>
              <div className="space-y-2">
                <p><span className="text-gray-400">Email:</span> {profileData.contact.email_address}</p>
                <p><span className="text-gray-400">Teléfono:</span> {profileData.contact.phone_number}</p>
                <p><span className="text-gray-400">Dirección:</span> {profileData.contact.street_address[0]}</p>
                <p><span className="text-gray-400">Ciudad/País:</span> {profileData.contact.city}, {profileData.contact.country}</p>
              </div>
            </div>
          </div>

          {/* Sección de información de la cuenta */}
          <div className="bg-[#2A2A2A] p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-400">Información de la Cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span className="text-gray-400">Número de cuenta:</span> {profileData.account_number}</p>
                <p><span className="text-gray-400">Estado:</span> <span className="text-green-400">{profileData.status}</span></p>
                <p><span className="text-gray-400">Moneda:</span> {profileData.currency}</p>
              </div>
              <div>
                <p><span className="text-gray-400">Tipo de cuenta:</span> {profileData.account_type}</p>
                <p><span className="text-gray-400">Tipo de trading:</span> {profileData.trading_type}</p>
                <p><span className="text-gray-400">Fecha de creación:</span> {formatDate(profileData.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            <button
              onClick={handleUpdateProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <EditIcon className="h-4 w-4" /> Actualizar Perfil
            </button>
            <button
              onClick={handleRefresh}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Recargar Datos
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-gray-400 p-4 text-sm text-center border-t border-gray-700">
        © 2025 Acciones El Bosque. Todos los derechos reservados. | Contacto: info@accioneselbosque.com
      </footer>
    </div>
  );
};

export default Profile;