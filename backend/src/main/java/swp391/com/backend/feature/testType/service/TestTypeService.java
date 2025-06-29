package swp391.com.backend.feature.testType.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.testType.data.TestTypeRepository;
import swp391.com.backend.feature.testType.dto.CreateTestTypeRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TestTypeService {
     private final TestTypeRepository testTypeRepository;

    public List<TestType> getAllTests() {
        return testTypeRepository.findAll();
    }

    public TestType createTest(TestType testType) {
        return testTypeRepository.save(testType);
    }
    
    public TestType createTestType(CreateTestTypeRequest request) {
        TestType testType = new TestType();
        testType.setName(request.getName());
        testType.setDescription(request.getDescription());
        testType.setNormalRange(request.getNormalRange());
        testType.setUnit(request.getUnit());
        
        return testTypeRepository.save(testType);
    }

    public void deleteTestById(Long id) {
        testTypeRepository.deleteById(id); }


    public TestType findTestById(Long id) {
        return testTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test type not found with id: " + id));
    }
}
