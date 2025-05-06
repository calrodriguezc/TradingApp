import React, { useEffect } from "react";
import { createAlpacaClient } from "src/services/AlpacaClient";

const AlpacaTest: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      const alpaca = createAlpacaClient();

      const options = {
        start: "2022-09-01",
        end: "2022-09-07",
        timeframe: alpaca.newTimeframe(1, alpaca.timeframeUnit.DAY),
      };

      try {
        const bars = await alpaca.getCryptoBars(["BTC/USD"], options);
        console.log("Datos de BTC/USD:", bars.get("BTC/USD"));
      } catch (error) {
        console.error("Error al obtener datos de Alpaca:", error);
      }
    };

    fetchData();
  }, []);

  return <div>Consulta de datos de Alpaca en consola...</div>;
};

export default AlpacaTest;
