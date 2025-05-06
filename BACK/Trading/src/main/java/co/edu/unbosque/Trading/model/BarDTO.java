package co.edu.unbosque.Trading.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BarDTO {

    private String t; // timestamp
    private double o; // open
    private double h; // high
    private double l; // low
    private double c; // close
    private long v;   // volume

}
