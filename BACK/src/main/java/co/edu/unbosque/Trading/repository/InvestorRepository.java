package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.Investor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestorRepository extends JpaRepository<Investor, Long> {

    List<Investor> findByCommissionId(Long commissionId);
    boolean existsByUsername(String username);

}