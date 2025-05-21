package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ach_relationships")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AchRelationship {

    @Id
    private String achRelationshipId;
    private String bankAccountType;
    private String accountOwnerName;
    private String bankAccountNumber;
    private String bankRoutingNumber;

    @OneToOne(mappedBy = "achRelationship")
    @JsonIgnore
    private User user;

}