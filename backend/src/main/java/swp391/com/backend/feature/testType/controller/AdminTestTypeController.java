package swp391.com.backend.feature.testType.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.testType.data.TestType;
import swp391.com.backend.feature.testType.dto.CreateTestTypeRequest;
import swp391.com.backend.feature.testType.dto.TestTypeDTO;
import swp391.com.backend.feature.testType.mapper.TestTypeMapper;
import swp391.com.backend.feature.testType.service.TestTypeService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/test-types")
@RequiredArgsConstructor
public class AdminTestTypeController {
    
    private final TestTypeService testTypeService;
    private final TestTypeMapper testTypeMapper;

    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllTestTypes() {
        List<TestType> testTypes = testTypeService.getAllTests();
        
        List<TestTypeDTO> testTypeDTOs = testTypes.stream()
                .map(testTypeMapper::toDTO)
                .toList();
        
        Map<String, Object> response = new HashMap<>();
        response.put("testTypes", testTypeDTOs);
        response.put("totalItems", testTypeDTOs.size());
        
        return ResponseEntity.ok(response);
    }

    
    @GetMapping("/{id}")
    public ResponseEntity<TestTypeDTO> getTestTypeById(@PathVariable Long id) {
        TestType testType = testTypeService.findTestById(id);
        TestTypeDTO dto = testTypeMapper.toDTO(testType);
        
        return ResponseEntity.ok(dto);
    }

    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTestType(@Valid @RequestBody CreateTestTypeRequest request) {
        TestType createdTestType = testTypeService.createTestType(request);
        TestTypeDTO dto = testTypeMapper.toDTO(createdTestType);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Test type created successfully");
        response.put("testType", dto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTestType(@PathVariable Long id) {

        testTypeService.findTestById(id);
        
        testTypeService.deleteTestById(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Test type deleted successfully");
        response.put("deletedId", id.toString());
        
        return ResponseEntity.ok(response);
    }
}
