package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Embeddable
@Data
public class Identity {

    @JsonProperty("given_name")
    private String givenName;
    @JsonProperty("family_name")
    private String familyName;
    @JsonProperty("date_of_birth")
    private String dateOfBirth;
    @JsonProperty("party_type")
    private String partyType;
    @JsonProperty("tax_id_type")
    private String taxIdType;
    @JsonProperty("country_of_tax_residence")
    private String countryOfTaxResidence;
    @ElementCollection
    @CollectionTable(name = "funding_sources", joinColumns = @JoinColumn(name = "account_id"))
    @Column(name = "funding_source")
    @JsonProperty("funding_source")
    private List<String> fundingSource;

}