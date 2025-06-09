package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.PackageTest;
import swp391.com.backend.jpa.pojo.test.Test;
import swp391.com.backend.jpa.repository.test.PackageTestRepository;

import java.util.List;

@Service
public class PackageTestService {
    private final PackageTestRepository packageTestRepository;

    public PackageTestService(PackageTestRepository packageTestRepository) {
        this.packageTestRepository = packageTestRepository;
    }

    public List<Test> getTestsByPackageId(Integer packageId) {
        return packageTestRepository.findTestsByPackageId(packageId);
    }

    public void addTestToPackage(Integer packageId, Integer testId) {
        PackageTest packageTest = new PackageTest();
        packageTest.setPackageId(packageId);
        packageTest.setTestId(testId);
        packageTestRepository.save(packageTest);
    }
}
