// Este archivo sirve como wrapper compatible con TypeScript y React
const Alpaca = require("@alpacahq/alpaca-trade-api");

export const createAlpacaClient = () => {
  return new Alpaca({
    keyId: "PK0ZORZ41QDYCXAIV8LE",
    secretKey: "V1XaqlPqNJ3kACK27BCLM7Bmg0KAH4a587yafI1v",
    paper: true,
  });
};
