package co.edu.unbosque.Trading.repository;

import co.edu.unbosque.Trading.model.AchRelationship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AchRelationshipRepository extends JpaRepository<AchRelationship, Long> {
}