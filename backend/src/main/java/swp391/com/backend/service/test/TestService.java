package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.Test;
import swp391.com.backend.jpa.repository.test.TestRepository;

import java.util.List;

@Service
public class TestService {
     private final TestRepository testRepository;

    public TestService(TestRepository testRepository) {
        this.testRepository = testRepository;
    }

    public List<Test> getAllTests() {
        return testRepository.findAll();
    }

    public Test createTest(Test test) {
        return testRepository.save(test);
    }

    public void deleteTestById(Integer id) {
        testRepository.deleteById(id);
    }
}
