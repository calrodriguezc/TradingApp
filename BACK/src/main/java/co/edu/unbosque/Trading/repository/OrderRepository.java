package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Orders, String> {

    List<Orders> findByStatus(String status);

    @Query("SELECT o FROM Orders o JOIN FETCH o.commission WHERE o.id = :id")
    Optional<Orders> findByIdWithCommission(@Param("id") String id);

}