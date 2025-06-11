package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.jpa.repository.test.TestRepository;

import java.util.List;

@Service
public class TestService {
     private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public List<TestType> getAllTests() {
        return testRepository.findAll();
    }

    public TestType createTest(TestType testType) {
        return testRepository.save(testType);
    }

    public void deleteTestById(Integer id) {
        testRepository.deleteById(id.longValue());
    }
}
