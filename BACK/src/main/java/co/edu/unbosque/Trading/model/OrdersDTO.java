package co.edu.unbosque.Trading.model;

import lombok.Data;

@Data
public class OrdersDTO {

        private String id;
        private String symbol;
        private Double qty;
        private Double notional;
        private String type;
        private String side;
        private String timeInForce;
        private String status;
        private String createdAt;

}