import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React, { useState, useEffect } from 'react';

// 1. Definimos la interfaz para Asset
interface Asset {
  symbol: string;
  name: string;
  lastPrice: number;
  change: number;
  changePercent: number;
  volume: number;
}

const Stocktable = () => {
    const [assets, setAssets] = useState<Asset[]>([]);

    // Usamos useEffect para obtener los datos al cargar el componente
    useEffect(() => {
        const fetchAssetsData = async () => {
            const response = await fetch('http://localhost:8080/api/assets');  // Asumiendo que tu backend entrega los datos de assets
            const data = await response.json();
            setAssets(data);
        };
        fetchAssetsData();
    }, []);
    return (

        <div>
            <Table>
                <TableCaption>A list of your assets.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Symbol</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Last Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right">Change %</TableHead>
                        <TableHead className="text-right">Volume</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {assets.map((asset, index) => (
                        <TableRow key={index}>
                            <TableCell>{asset.symbol}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{asset.name}</TableCell>
                            <TableCell className="text-right">${asset.lastPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{asset.change.toFixed(2)}</TableCell>
                            <TableCell className="text-right">{asset.changePercent.toFixed(2)}%</TableCell>
                            <TableCell className="text-right">{asset.volume.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default Stocktable