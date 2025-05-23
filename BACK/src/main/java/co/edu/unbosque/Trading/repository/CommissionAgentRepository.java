package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.CommissionAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommissionAgentRepository extends JpaRepository<CommissionAgent, Long> {

    boolean existsByUsername(String username);

}