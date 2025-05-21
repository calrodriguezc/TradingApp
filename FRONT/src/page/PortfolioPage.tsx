// src/page/PortfolioPage.tsx
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
import { RefreshCcw, FileText, BarChart3, DollarSign } from 'lucide-react';

interface Order {
  id: string;
  symbol: string;
  qty: number;
  notional: number | null;
  type: string;
  side: string;
  timeInForce: string;
  status: string;
  createdAt: string;
}

interface Position {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  current_price: number;
  market_value: number;
  unrealized_pl: number;
  unrealized_plpc: number;
  change_today: number;
}

const PortfolioPage: React.FC = () => {
  const [accountId, setAccountId] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    symbol: '',
    side: 'buy',
    type: 'market',
    time_in_force: 'day',
    price: '',
    qty: '',
    notional: '',
    stop_price: '',
  });
  const [orderMessage, setOrderMessage] = useState('');

  const fetchData = async () => {
    try {
      const accountRes = await fetch('http://localhost:8080/api/payment-details', {
        credentials: 'include',
      });
      if (!accountRes.ok) throw new Error('Error al obtener ID de cuenta');
      const accountData = await accountRes.json();
      const id = accountData.accountId;
      setAccountId(id);

      const ordersRes = await fetch(`http://localhost:8080/ach/orders/${id}`, {
        credentials: 'include',
      });
      if (!ordersRes.ok) throw new Error('Error al obtener órdenes');
      const ordersData = await ordersRes.json();
      setOrders(ordersData);

      const positionsRes = await fetch(`http://localhost:8080/ach/portfolio/${id}`, {
        credentials: 'include',
      });
      if (!positionsRes.ok) throw new Error('Error al obtener posiciones');
      const positionsData = await positionsRes.json();
      setPositions(positionsData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error desconocido');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderMessage('');

    try {
      const res = await fetch(`http://localhost:8080/ach/createOrder/${accountId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          symbol: formData.symbol,
          side: formData.side,
          type: formData.type,
          time_in_force: formData.time_in_force,
          price: formData.price ? parseFloat(formData.price) : null,
          qty: formData.qty ? parseInt(formData.qty) : null,
          notional: formData.notional ? parseFloat(formData.notional) : null,
          stop_price: formData.stop_price ? parseFloat(formData.stop_price) : null,
        }),
      });

      const message = await res.text();

      if (!res.ok) throw new Error(message);
      setOrderMessage(`✅ ${message}`);
      setFormData({
        symbol: '',
        side: 'buy',
        type: 'market',
        time_in_force: 'day',
        price: '',
        qty: '',
        notional: '',
        stop_price: '',
      });
      fetchData();
    } catch (err: any) {
      setOrderMessage("❌ Fondos insuficientes");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />
      <main className="flex-1 overflow-auto p-6 max-w-6xl mx-auto w-full">

        {/* Sección Nueva - Comprar/Vender */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 mb-6 border border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5" /> Comprar o Vender Activos
          </h2>

          {orderMessage && <p className="mb-4 text-sm text-white">{orderMessage}</p>}

          <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              placeholder="Símbolo (ej: AAPL)"
              className="bg-[#2A2A2A] p-2 rounded text-white"
              required
            />
            <select
              name="side"
              value={formData.side}
              onChange={handleInputChange}
              className="bg-[#2A2A2A] p-2 rounded text-white"
            >
              <option value="buy">Comprar</option>
              <option value="sell">Vender</option>
            </select>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="bg-[#2A2A2A] p-2 rounded text-white"
            >
              <option value="market">Market</option>
              <option value="limit">Limit</option>
              <option value="stop">Stop</option>
              <option value="stop_limit">Stop Limit</option>
            </select>
            <select
              name="time_in_force"
              value={formData.time_in_force}
              onChange={handleInputChange}
              className="bg-[#2A2A2A] p-2 rounded text-white"
            >
              <option value="day">Day</option>
              <option value="gtc">GTC</option>
            </select>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Precio límite"
              step="0.01"
              className="bg-[#2A2A2A] p-2 rounded text-white"
            />
            <input
              type="number"
              name="qty"
              value={formData.qty}
              onChange={handleInputChange}
              placeholder="Cantidad"
              className="bg-[#2A2A2A] p-2 rounded text-white"
            />
            <input
              type="number"
              name="notional"
              value={formData.notional}
              onChange={handleInputChange}
              placeholder="Valor en USD"
              step="0.01"
              className="bg-[#2A2A2A] p-2 rounded text-white"
            />
            <input
              type="number"
              name="stop_price"
              value={formData.stop_price}
              onChange={handleInputChange}
              placeholder="Precio Stop"
              step="0.01"
              className="bg-[#2A2A2A] p-2 rounded text-white"
            />
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded text-white font-semibold"
              >
                Ejecutar Orden
              </button>
            </div>
          </form>
        </div>

        {/* Órdenes */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 mb-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" /> Órdenes del Portafolio
            </h2>
            <button
              onClick={handleRefresh}
              className="text-gray-400 hover:text-white transition p-1 rounded-full hover:bg-gray-700"
              aria-label="Recargar"
            >
              <RefreshCcw className="h-5 w-5" />
            </button>
          </div>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          {orders.length === 0 ? (
            <p className="text-gray-400">No hay órdenes registradas.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">ID</th>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">Símbolo</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Cantidad</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Monto</th>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">Tipo</th>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">Lado</th>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">T. Fuerza</th>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">Estado</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="border-b border-gray-700 p-2">{order.id}</td>
                      <td className="border-b border-gray-700 p-2">{order.symbol}</td>
                      <td className="border-b border-gray-700 p-2 text-right">{order.qty}</td>
                      <td className="border-b border-gray-700 p-2 text-right">
                        {order.notional ? `$${order.notional.toLocaleString()}` : '—'}
                      </td>
                      <td className="border-b border-gray-700 p-2">{order.type}</td>
                      <td className="border-b border-gray-700 p-2">{order.side}</td>
                      <td className="border-b border-gray-700 p-2">{order.timeInForce}</td>
                      <td className="border-b border-gray-700 p-2">{order.status}</td>
                      <td className="border-b border-gray-700 p-2 text-right">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Posiciones */}
        <div className="bg-[#1E1E1E] rounded-2xl shadow p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5" /> Posiciones Activas
            </h2>
          </div>

          {positions.length === 0 ? (
            <p className="text-gray-400">No hay posiciones activas.</p>
          ) : (
            <div className="overflow-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="border-b border-gray-600 p-2 text-left text-gray-400">Símbolo</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Cantidad</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Precio Promedio</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Precio Actual</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Valor Mercado</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">Ganancia/Pérdida</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">% G/P</th>
                    <th className="border-b border-gray-600 p-2 text-right text-gray-400">% Cambio Hoy</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos, index) => (
                    <tr key={index}>
                      <td className="border-b border-gray-700 p-2">{pos.symbol}</td>
                      <td className="border-b border-gray-700 p-2 text-right">{pos.qty}</td>
                      <td className="border-b border-gray-700 p-2 text-right">${pos.avg_entry_price.toFixed(2)}</td>
                      <td className="border-b border-gray-700 p-2 text-right">${pos.current_price.toFixed(2)}</td>
                      <td className="border-b border-gray-700 p-2 text-right">${pos.market_value.toFixed(2)}</td>
                      <td className="border-b border-gray-700 p-2 text-right" style={{ color: pos.unrealized_pl >= 0 ? '#4ade80' : '#f87171' }}>
                        ${pos.unrealized_pl.toFixed(2)}
                      </td>
                      <td className="border-b border-gray-700 p-2 text-right" style={{ color: pos.unrealized_plpc >= 0 ? '#4ade80' : '#f87171' }}>
                        {(pos.unrealized_plpc * 100).toFixed(2)}%
                      </td>
                      <td className="border-b border-gray-700 p-2 text-right" style={{ color: pos.change_today >= 0 ? '#4ade80' : '#f87171' }}>
                        {(pos.change_today * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-[#1A1A1A] text-gray-400 p-4 text-sm text-center">
        © {new Date().getFullYear()} Carol Investments. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default PortfolioPage;
