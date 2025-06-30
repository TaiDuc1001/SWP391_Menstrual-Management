package swp391.com.backend.feature.doctor.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByAccountId(Long accountId);
}
