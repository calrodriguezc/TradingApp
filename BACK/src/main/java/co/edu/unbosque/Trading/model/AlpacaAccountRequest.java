package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlpacaAccountRequest {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Contact {
        private String email_address;
        private String phone_number;
        private List<String> street_address;
        private String city;

        // Getters y Setters
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Identity {
        private String tax_id_type;
        private String given_name;
        private String family_name;
        private String date_of_birth;
        private String country_of_tax_residence;
        private List<String> funding_source;
        private String tax_id;

        // Getters y Setters
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Disclosures {
        @JsonProperty("is_control_person")
        private boolean is_control_person;
        @JsonProperty("is_affiliated_exchange_or_finra")
        private boolean is_affiliated_exchange_or_finra;
        @JsonProperty("is_politically_exposed")
        private boolean is_politically_exposed;
        @JsonProperty("immediate_family_exposed")
        private boolean immediate_family_exposed;

        // Getters y Setters
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Agreement {
        private String agreement;
        private String signed_at;
        private String ip_address;

        // Getters y Setters
    }

    private Contact contact;
    private Identity identity;
    private Disclosures disclosures;
    private String account_type;
    private String account_sub_type;
    private List<Agreement> agreements;

}