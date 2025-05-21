import React, { useState, useEffect } from 'react';
import Navbar from './Navbar/Navbar';

interface UserPaymentDetails {
  accountId: string;
  accountOwnerName: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankAccountType?: 'CHECKING' | 'SAVINGS';
  achId?: string;
}

const PaymentDetails: React.FC = () => {
  const [bankAccountType, setBankAccountType] = useState<'CHECKING' | 'SAVINGS'>('CHECKING');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
  const [errors, setErrors] = useState<{ account?: string; routing?: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState<UserPaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inputsDisabled, setInputsDisabled] = useState(false);

  // Obtener datos del usuario al cargar el componente
  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/payment-details', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Error al obtener datos del usuario');
        }

        const data = await response.json();

        setPaymentDetails(data);
        setBankAccountType(data.bankAccountType || 'CHECKING');
        setBankAccountNumber(data.bankAccountNumber || '');
        setBankRoutingNumber(data.bankRoutingNumber || '');

        // Desactivar inputs si ya existe relación ACH
        if (data.achId || data.bankAccountNumber || data.bankRoutingNumber) {
          setInputsDisabled(true);
          setSuccessMessage('Cuenta bancaria ya asociada.');
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error fetching payment details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const validate = () => {
    const newErrors: { account?: string; routing?: string } = {};

    if (!/^\d{8,12}$/.test(bankAccountNumber)) {
      newErrors.account = 'El número de cuenta debe tener entre 8 y 12 dígitos.';
    }

    if (!/^\d{9}$/.test(bankRoutingNumber)) {
      newErrors.routing = 'El número de ruta debe tener exactamente 9 dígitos.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && paymentDetails) {
      try {
        const response = await fetch(`http://localhost:8080/ach/${paymentDetails.accountId}`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bank_account_type: bankAccountType,
            account_owner_name: paymentDetails.accountOwnerName,
            bank_account_number: bankAccountNumber,
            bank_routing_number: bankRoutingNumber,
          }),
        });

        if (response.ok) {
          const achId = await response.text();
          setInputsDisabled(true);
          setSuccessMessage('Cuenta bancaria creada correctamente.');
          setErrors({});
        } else if (response.status === 409) {
          setSuccessMessage('Ya existe una cuenta bancaria asociada.');
          setInputsDisabled(true);
        } else {
          const errorText = await response.text();
          console.error('Alpaca ACH Error:', response.status, errorText);
          setError(`Error ${response.status}: ${errorText}`);
        }
      } catch (err) {
        console.error('Catch block error:', err);
        setSuccessMessage('');
        setError('Error al guardar los datos bancarios');
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Cargando datos del usuario...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>No se encontraron datos de pago</p>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />

      <main className="flex-1 overflow-auto p-6 max-w-xl mx-auto w-full">
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            {inputsDisabled ? 'Cuenta Bancaria Asociada' : 'Detalle de Pago'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-400 font-medium">ID de cuenta</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600 opacity-70 cursor-not-allowed"
                value={paymentDetails.accountId}
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-400 font-medium">Titular de la cuenta</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600 opacity-70 cursor-not-allowed"
                value={paymentDetails.accountOwnerName}
                readOnly
              />
            </div>

            {paymentDetails.achId && (
              <div>
                <label className="block mb-1 text-gray-400 font-medium">ID de relación bancaria</label>
                <input
                  type="text"
                  className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600 opacity-70 cursor-not-allowed"
                  value={paymentDetails.achId}
                  readOnly
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-gray-400 font-medium">Tipo de cuenta</label>
              <select
                className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600"
                value={bankAccountType}
                onChange={(e) => setBankAccountType(e.target.value as 'CHECKING' | 'SAVINGS')}
                disabled={inputsDisabled}
              >
                <option value="CHECKING">CHECKING</option>
                <option value="SAVINGS">SAVINGS</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-400 font-medium">Número de cuenta bancaria</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="Ingrese el número de cuenta"
                disabled={inputsDisabled}
              />
              {errors.account && <p className="text-red-500 text-sm mt-1">{errors.account}</p>}
            </div>

            <div>
              <label className="block mb-1 text-gray-400 font-medium">Número de ruta bancaria</label>
              <input
                type="text"
                className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-gray-600"
                value={bankRoutingNumber}
                onChange={(e) => setBankRoutingNumber(e.target.value)}
                placeholder="Ingrese el número de ruta"
                disabled={inputsDisabled}
              />
              {errors.routing && <p className="text-red-500 text-sm mt-1">{errors.routing}</p>}
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition w-full mt-4"
              disabled={loading || inputsDisabled}
            >
              {loading ? 'Guardando...' : 'Guardar cuenta bancaria'}
            </button>

            {successMessage && (
              <p className="text-green-500 text-sm text-center mt-4">{successMessage}</p>
            )}
          </form>
        </div>
      </main>

      <footer className="bg-[#1A1A1A] text-gray-400 p-4 text-sm text-center border-t border-gray-700">
        © 2025 Acciones El Bosque. Todos los derechos reservados. | Contacto: info@accioneselbosque.com
      </footer>
    </div>
  );
};

export default PaymentDetails;
