package swp391.com.backend.jpa.repository.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.test.Panel;

@Repository
public interface PackageRepository extends JpaRepository<Panel, Integer> {
}
