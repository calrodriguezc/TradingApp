import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState } from 'react'
import Stocktable from './StockTable'
import Navbar from '../Navbar/Navbar'
import CandleChart from './CandleChart'

const Home = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');   // AAPL por defecto

  return (
    <div className="mx-6 my-3 md:mx-12 md:my-4 lg:mx-16 lg:my-5">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full lg:w-1/2 border-r overflow-y-auto">
          <Stocktable onSelectSymbol={setSelectedSymbol} selectedSymbol={selectedSymbol} />  {/* PASAMOS props */}
        </div>

        <div className="w-full lg:w-1/2 p-4">
          <CandleChart symbol={selectedSymbol} />
        </div>
      </div>
    </div>
  );
};

export default Home