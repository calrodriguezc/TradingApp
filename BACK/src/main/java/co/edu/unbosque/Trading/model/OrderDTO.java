package co.edu.unbosque.Trading.model;

import lombok.Data;

@Data
public class OrderDTO {

    private String symbol;         // Símbolo de la acción (e.g., "AAPL")
    private String side;           // "buy" o "sell"
    private String type;           // Tipo de orden: "market", "limit", "stop", "stop_limit"
    private String time_in_force;  // "day", "gtc", etc.

    private Double price;          // Precio límite (solo para limit y stop-limit orders)
    private Integer qty;           // Cantidad de acciones (solo para market y limit orders)
    private Double notional;       // Valor en dólares (solo para market y limit orders cuando se compra por valor en dólares)
    private Double stop_price;     // Precio de activación para stop orders (solo para stop y stop-limit orders)

}
