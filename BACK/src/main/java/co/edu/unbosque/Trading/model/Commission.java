package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "commissions")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class Commission extends User {

    @JsonIgnore
    @OneToMany(mappedBy = "commission", cascade = CascadeType.ALL)
    private List<Investor> investors = new ArrayList<>();

}