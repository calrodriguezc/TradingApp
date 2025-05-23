package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.Commission;
import co.edu.unbosque.Trading.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, String> {

    Optional<Commission> findByOrderId(String orderId);

    Optional<Commission> findByOrder(Orders order);
}