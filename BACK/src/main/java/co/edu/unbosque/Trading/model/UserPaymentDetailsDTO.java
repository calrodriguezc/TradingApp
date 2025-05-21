package co.edu.unbosque.Trading.model;

import lombok.Data;

@Data
public class UserPaymentDetailsDTO {

    private String accountId;
    private String AccountOwnerName;
    private String bankAccountNumber;
    private String bankAccountType;
    private String bankRoutingNumber;
    private String achId;

}