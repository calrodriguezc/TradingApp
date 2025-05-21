package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Embeddable
@Data
public class Contact {

    private String city;
    private String country;
    @JsonProperty("email_address")
    private String emailAddress;
    @JsonProperty("phone_number")
    private String phoneNumber;
    @ElementCollection
    @CollectionTable(name = "street_addresses", joinColumns = @JoinColumn(name = "account_id"))
    @Column(name = "street_address")
    @JsonProperty("street_address")
    private List<String> streetAddress;
    @JsonProperty("local_street_address")
    private String localStreetAddress;

}
