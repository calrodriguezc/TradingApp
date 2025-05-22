package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.Commission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommissionRepository extends JpaRepository<Commission, Long> {

    @Query("SELECT c FROM Commission c JOIN FETCH c.investors WHERE c.id = :id")
    Optional<Commission> findWithInvestorsById(@Param("id") Long id);

    boolean existsByUsername(String username);

}