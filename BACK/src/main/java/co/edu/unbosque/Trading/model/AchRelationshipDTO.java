package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AchRelationshipDTO {

    @JsonProperty("bank_account_type")
    private String bankAccountType;
    @JsonProperty("account_owner_name")
    private String accountOwnerName;
    @JsonProperty("bank_account_number")
    private String bankAccountNumber;
    @JsonProperty("bank_routing_number")
    private String bankRoutingNumber;

}