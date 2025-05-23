package co.edu.unbosque.Trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class Orders {

    @Id
    private String id;

    private String symbol;

    private Double qty;

    private Double notional;

    private String type;

    private String side;

    private String timeInForce;

    private String status;

    private String createdAt;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Commission commission;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public void setCommission(Commission commission) {
        if (commission == null) {
            if (this.commission != null) {
                this.commission.setOrder(null);
            }
        } else {
            commission.setOrder(this);
        }
        this.commission = commission;
    }

}