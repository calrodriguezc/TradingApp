package co.edu.unbosque.Trading.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetDTO {

    private String symbol;
    private String name;
    private String exchange;
    private double lastPrice;
    private double change;
    private double changePercent;
    private long volume;

}