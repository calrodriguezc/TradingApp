package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.Transfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransferRepository extends JpaRepository<Transfer, Long> {

    List<Transfer> findByAccountId(String accountId);

}
