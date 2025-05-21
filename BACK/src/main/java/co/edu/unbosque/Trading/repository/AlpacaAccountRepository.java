package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.AlpacaAccountResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlpacaAccountRepository extends JpaRepository<AlpacaAccountResponse, Long> {

}
