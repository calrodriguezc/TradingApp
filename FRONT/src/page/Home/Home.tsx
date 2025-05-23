import { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Stocktable from './StockTable';
import CandleChart from './CandleChart';

const Home = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');

  return (
    <div className="h-screen flex flex-col bg-[#121212] text-gray-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-1/2 border-r overflow-y-auto">
          <Stocktable onSelectSymbol={setSelectedSymbol} selectedSymbol={selectedSymbol} />
        </div>
        <div className="w-full lg:w-1/2 p-4 flex items-center justify-center">
          <div className="w-full">
            <CandleChart symbol={selectedSymbol} />
          </div>
        </div>
      </div>
      <footer className="bg-[#1A1A1A] text-gray-400 p-4 text-sm text-center border-t border-gray-700">
        © 2025 Acciones El Bosque. Todos los derechos reservados. | Contacto: info@accioneselbosque.com
      </footer>
    </div>
  );
};

export default Home;