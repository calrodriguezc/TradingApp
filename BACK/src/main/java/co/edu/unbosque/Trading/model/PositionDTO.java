package co.edu.unbosque.Trading.model;

import lombok.Data;

@Data
public class PositionDTO {

    private String symbol;
    private int qty;
    private double avg_entry_price;
    private double current_price;
    private double market_value;
    private double unrealized_pl;
    private double unrealized_plpc;
    private double change_today;
}
