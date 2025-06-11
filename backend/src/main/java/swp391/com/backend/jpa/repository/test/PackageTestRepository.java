package swp391.com.backend.jpa.repository.test;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import swp391.com.backend.jpa.pojo.test.PanelTestType;
import swp391.com.backend.jpa.pojo.test.TestType;

import java.util.List;

@Repository
public interface PackageTestRepository extends JpaRepository<PanelTestType, Integer> {
    List<TestType> findTestsByPackageId(Integer packageId);

    void deleteByPackageIdAndTestId(Integer packageId, Integer testId);
}
