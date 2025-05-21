package co.edu.unbosque.Trading.model;

import lombok.Data;

@Data
public class TransferDTO {

    private String transfer_type;
    private String direction;
    private String timing;
    private String relationship_id;
    private String amount;

}