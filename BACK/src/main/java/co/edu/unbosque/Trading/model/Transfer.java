package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "transfer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Transfer {

    @Id
    private String id;
    @JsonProperty("relationship_id")
    private String relationshipId;
    @JsonProperty("account_id")
    private String accountId;
    private String status;
    private String amount;
    private String direction;
    @JsonProperty("created_at")
    private String createdAt;

}