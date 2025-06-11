package swp391.com.backend.jpa.repository.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.test.TestType;

@Repository
public interface TestRepository extends JpaRepository<TestType, Long> {
}
