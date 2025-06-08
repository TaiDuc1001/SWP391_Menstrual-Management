package swp391.com.backend.repository.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.pojo.test.PackageTest;
import swp391.com.backend.pojo.test.Test;

import java.util.List;

@Repository
public interface PackageTestRepository extends JpaRepository<PackageTest, Integer> {
    List<Test> findTestsByPackageId(Integer packageId);
}
