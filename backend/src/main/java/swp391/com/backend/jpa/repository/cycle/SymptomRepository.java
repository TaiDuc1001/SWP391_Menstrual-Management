package swp391.com.backend.jpa.repository.cycle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.cycle.Symptom;

@Repository
public interface SymptomRepository extends JpaRepository<Symptom, Integer> {
}
