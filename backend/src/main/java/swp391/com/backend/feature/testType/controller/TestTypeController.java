package swp391.com.backend.feature.testType.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.feature.testType.data.TestTypeRepository;
import swp391.com.backend.feature.testType.dto.TestTypeDTO;
import swp391.com.backend.feature.testType.mapper.TestTypeMapper;
import swp391.com.backend.feature.testType.service.TestTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/test-types")
@RequiredArgsConstructor
public class TestTypeController {
    private final TestTypeService testTypeService;
    private final TestTypeMapper testTypeMapper;

    @GetMapping
    public ResponseEntity<List<TestTypeDTO>> getAllTestTypes() {
        List<TestTypeDTO> testTypes = testTypeService.getAllTests()
                .stream()
                .map(testTypeMapper::toDTO)
                .toList();
        return ResponseEntity.ok(testTypes);
    }
}
