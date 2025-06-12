package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.test.TestTypeRepository;

import java.util.List;

@Service
public class TestTypeService {
     private final TestTypeRepository testTypeRepository;

    public TestTypeService(TestTypeRepository testTypeRepository) {
        this.testTypeRepository = testTypeRepository;
    }

    public List<TestType> getAllTests() {
        return testTypeRepository.findAll();
    }

    public TestType createTest(TestType testType) {
        return testTypeRepository.save(testType);
    }

    public void deleteTestById(Long id) {
        testTypeRepository.deleteById(id); }


    public TestType findTestById(Long id) {
        return testTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test type not found with id: " + id));
    }
}
