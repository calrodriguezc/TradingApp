package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "users_alpaca")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"disclosures", "agreements"}) // Ignora estos campos en JSON
public class AlpacaAccountResponse {

    @Id
    private String id;

    @JsonProperty("account_number")
    private String accountNumber;

    private String status;

    @JsonProperty("crypto_status")
    private String cryptoStatus;

    private String currency;

    @JsonProperty("last_equity")
    private String lastEquity;

    @JsonProperty("created_at")
    private String createdAt;

    @JsonProperty("account_type")
    private String accountType;

    @JsonProperty("account_sub_type")
    private String accountSubType;

    @JsonProperty("trading_type")
    private String tradingType;

    @Embedded
    @JsonProperty("contact")
    private Contact contact;

    @Embedded
    @JsonProperty("identity")
    private Identity identity;

    @OneToOne(mappedBy = "alpacaAccount")
    @JsonIgnore
    private User user;

}