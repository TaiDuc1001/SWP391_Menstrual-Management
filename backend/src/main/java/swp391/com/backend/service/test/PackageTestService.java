package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.PanelTestType;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.test.PackageTestRepository;

import java.util.List;

@Service
public class PackageTestService {
    private final PackageTestRepository packageTestRepository;

    public PackageTestService(PackageTestRepository packageTestRepository) {
        this.packageTestRepository = packageTestRepository;
    }

    public List<TestType> getTestsByPackageId(Integer packageId) {
        return packageTestRepository.findTestsByPackageId(packageId);
    }

    public void addTestToPackage(Integer packageId, Integer testId) {
        PanelTestType panelTestType = new PanelTestType();
        panelTestType.setPackageId(packageId);
        panelTestType.setTestId(testId);
        packageTestRepository.save(panelTestType);
    }

    public void removeTestFromPackage(Integer packageId, Integer testId) {
        packageTestRepository.deleteByPackageIdAndTestId(packageId, testId);
    }
}
