import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState, useEffect } from 'react'

interface Asset {
  symbol: string
  name: string
  lastPrice: number
  change: number
  changePercent: number
  volume: number
}

interface StocktableProps {
  onSelectSymbol: (symbol: string) => void
  selectedSymbol: string
}

const Stocktable = ({ onSelectSymbol, selectedSymbol }: StocktableProps) => {
  const [assets, setAssets] = useState<Asset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssetsData = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('http://localhost:8080/alpaca/assets', {
          method: 'GET',
          credentials: 'include', // Incluye cookies en la solicitud
          headers: {
            'Content-Type': 'application/json',
            // Puedes agregar otros headers necesarios aquí
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('No autorizado. Por favor inicie sesión.')
          }
          throw new Error(`Error HTTP: ${response.status}`)
        }

        const data = await response.json()
        setAssets(data)
      } catch (error) {
        console.error('Error fetching assets:', error)
        setError(error instanceof Error ? error.message : 'Error desconocido al cargar datos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssetsData()
  }, [])

  const handleRowClick = (symbol: string) => {
    const cleanSymbol = symbol.trim().toUpperCase()
    console.log('Fila clickeada:', cleanSymbol)
    onSelectSymbol(cleanSymbol)
  }

  // Función para formatear números con separadores de miles
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  if (isLoading) {
    return (
      <div className="bg-[#1E1E1E] rounded-md shadow-md p-4 h-full text-white flex items-center justify-center">
        <div className="animate-pulse">Cargando datos de activos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-[#1E1E1E] rounded-md shadow-md p-4 h-full text-white flex flex-col items-center justify-center">
        <div className="text-red-400 mb-2">Error al cargar los datos</div>
        <div className="text-gray-400 text-sm">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="bg-[#1E1E1E] rounded-md shadow-md p-4 h-full text-white">
      <Table>
        <TableCaption className="text-gray-400">Lista de activos disponibles</TableCaption>
        <TableHeader>
          <TableRow className="bg-[#121212] hover:bg-[#121212]">
            <TableHead className="w-[100px] text-gray-200">Símbolo</TableHead>
            <TableHead className="text-gray-200">Nombre</TableHead>
            <TableHead className="text-right text-gray-200">Último precio</TableHead>
            <TableHead className="text-right text-gray-200">Cambio</TableHead>
            <TableHead className="text-right text-gray-200">Cambio %</TableHead>
            <TableHead className="text-right text-gray-200">Volumen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset, index) => {
            const isSelected = asset.symbol.trim().toUpperCase() === selectedSymbol
            const isPositiveChange = asset.change >= 0
            const isPositivePercent = asset.changePercent >= 0

            return (
              <TableRow
                key={`${asset.symbol}-${index}`}
                className={`cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-900 text-blue-100' : 'hover:bg-[#2A2A2A]'
                }`}
                onClick={() => handleRowClick(asset.symbol)}
              >
                <TableCell className={`font-medium ${isSelected ? 'text-blue-300' : 'text-blue-500'}`}>
                  {asset.symbol}
                </TableCell>
                <TableCell className="max-w-[150px] truncate text-gray-300">{asset.name}</TableCell>
                <TableCell className="text-right">${formatNumber(asset.lastPrice)}</TableCell>
                <TableCell className={`text-right ${isPositiveChange ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositiveChange ? '+' : ''}{formatNumber(asset.change)}
                </TableCell>
                <TableCell className={`text-right ${isPositivePercent ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositivePercent ? '+' : ''}{formatNumber(asset.changePercent)}%
                </TableCell>
                <TableCell className="text-right text-gray-300">
                  {asset.volume.toLocaleString('en-US')}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default Stocktable