import React, { useState, useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import { RefreshCcw, WalletIcon } from 'lucide-react';

interface AchTransfer {
  id: string;
  relationshipId: string;
  accountId: string;
  status: string;
  amount: string;
  direction: 'INCOMING' | 'OUTGOING';
  createdAt: string;
}

const Wallet: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [achTransfers, setAchTransfers] = useState<AchTransfer[]>([]);

  const [relationshipId, setRelationshipId] = useState('');
  const [direction, setDirection] = useState<'INCOMING' | 'OUTGOING'>('INCOMING');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState('');
  const [hasAchRelationship, setHasAchRelationship] = useState(false);

  const [transferSuccess, setTransferSuccess] = useState('');
  const [transferError, setTransferError] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/payment-details', {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.accountId && data.achId) {
          setAccountId(data.accountId);
          setRelationshipId(data.achId);
          setHasAchRelationship(true);
        } else {
          setHasAchRelationship(false);
        }
      })
      .catch(() => setHasAchRelationship(false));
  }, []);

  useEffect(() => {
    if (accountId) {
      fetch(`http://localhost:8080/ach/account-balance/${accountId}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => {
          const cashValue = parseFloat(data.cash);
          setBalance(cashValue);
        });

      fetch(`http://localhost:8080/transfer/getTransfers/${accountId}`, {
        credentials: 'include',
      })
        .then((res) => res.json())
        .then((data) => setAchTransfers(data))
        .catch((err) => console.error('Error al obtener transferencias ACH:', err));
    }
  }, [accountId]);
  
  const handleRefresh = () => window.location.reload();

  const handleTransfer = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/transfer/${accountId}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transfer_type: 'ach',
            direction,
            timing: 'immediate',
            relationship_id: relationshipId,
            amount,
          }),
        }
      );

      if (response.ok) {
        setTransferSuccess('Transferencia realizada con éxito.');
        setTransferError('');
        setAmount('');
        setDirection('INCOMING');

        // Refresh balance and transfer list
        fetch(`http://localhost:8080/ach/account-balance/${accountId}`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => {
            const cashValue = parseFloat(data.cash);
            setBalance(cashValue);
          });

        fetch(`http://localhost:8080/transfer/getTransfers/${accountId}`, {
          credentials: 'include',
        })
          .then((res) => res.json())
          .then((data) => setAchTransfers(data));

      } else {
        const err = await response.text();
        throw new Error(err);
      }
    } catch (err: any) {
      setTransferError(err.message || 'Error al realizar la transferencia');
      setTransferSuccess('');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />
      <main className="flex-1 overflow-auto p-6 max-w-3xl mx-auto w-full">
        {/* Billetera */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 mb-6 border border-gray-700 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <WalletIcon className="h-5 w-5" /> Billetera
            </h2>
            <button
              onClick={handleRefresh}
              className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
              aria-label="Recargar"
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-2">Dinero disponible:</p>
            <p className="text-3xl font-semibold text-green-400 mb-4">
              ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>

          {/* Transferencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'INCOMING' | 'OUTGOING')}
              className="p-2 bg-gray-800 text-white rounded-lg"
            >
              <option value="INCOMING">Entrante</option>
              <option value="OUTGOING">Saliente</option>
            </select>
            <input
              type="number"
              placeholder="Monto"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 bg-gray-800 text-white rounded-lg"
            />
          </div>

          <button
            className={`px-4 py-2 rounded-lg transition ${
              hasAchRelationship
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
            onClick={handleTransfer}
            disabled={!hasAchRelationship}
          >
            Enviar Transferencia
          </button>

          {!hasAchRelationship && (
            <p className="text-yellow-400 mt-4">
              Debes registrar una relación ACH en la sección <strong>Detalles de Pago</strong> antes de transferir.
            </p>
          )}

          {transferSuccess && <p className="text-green-400 mt-4">{transferSuccess}</p>}
          {transferError && <p className="text-red-400 mt-4">{transferError}</p>}
        </div>

        {/* Historial de movimientos */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 border border-gray-700 mb-6">
          <h3 className="text-xl font-bold mb-4 text-white">Historial de movimientos ACH</h3>
          {achTransfers.length === 0 ? (
            <p className="text-gray-400">No hay movimientos registrados.</p>
          ) : (
            <table className="w-full table-auto border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-gray-600 p-2 text-left text-gray-400">Dirección</th>
                  <th className="border-b border-gray-600 p-2 text-right text-gray-400">Monto</th>
                  <th className="border-b border-gray-600 p-2 text-right text-gray-400">Estado</th>
                  <th className="border-b border-gray-600 p-2 text-right text-gray-400">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {achTransfers.map((tx) => (
                  <tr key={tx.id}>
                    
                    <td className="border-b border-gray-700 p-2">
                      {tx.direction === 'INCOMING' ? 'Entrante' : 'Saliente'}
                    </td>
                    <td className="border-b border-gray-700 p-2 text-right">
                      ${parseFloat(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="border-b border-gray-700 p-2 text-right">{tx.status}</td>
                    <td className="border-b border-gray-700 p-2 text-right">
                      {new Date(tx.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <footer className="bg-[#1A1A1A] text-gray-400 p-4 text-sm text-center border-t border-gray-700">
        © 2025 Acciones El Bosque. Todos los derechos reservados. | Contacto: info@accioneselbosque.com
      </footer>
    </div>
  );
};

export default Wallet;
