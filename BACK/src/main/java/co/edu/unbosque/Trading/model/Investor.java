package co.edu.unbosque.Trading.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "investors")
@Builder
@Data
public class Investor extends User {

    @ManyToOne
    @JoinColumn(name = "commission_id")
    private Commission commission;

}