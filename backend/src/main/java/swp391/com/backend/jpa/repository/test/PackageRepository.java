package swp391.com.backend.jpa.repository.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.test.Package;

@Repository
public interface PackageRepository extends JpaRepository<Package, Integer> {
}
