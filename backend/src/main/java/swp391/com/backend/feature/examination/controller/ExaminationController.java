package swp391.com.backend.feature.examination.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.examination.assembler.ExaminationAssembler;
import swp391.com.backend.feature.examination.dto.ExaminationDTO;
import swp391.com.backend.feature.examination.mapper.ExaminationMapper;
import swp391.com.backend.feature.examination.service.ExaminationService;
import swp391.com.backend.feature.examination.testResult.TestResultMapper;
import swp391.com.backend.feature.panel.service.PanelService;
import swp391.com.backend.feature.resultDetail.service.ResultDetailsService;
import swp391.com.backend.feature.testType.mapper.TestTypeMapper;

import java.util.Map;

@RestController
@RequestMapping("/api/examinations")
@RequiredArgsConstructor
public class ExaminationController {
    private final ResultDetailsService resultDetailsService;
    private final ExaminationService examinationService;
    private final TestTypeMapper testTypeMapper;
    private final ExaminationMapper examinationMapper;
    private final TestResultMapper testResultMapper;
    private final PanelService panelService;
    private final ExaminationAssembler examinationAssembler;

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<ExaminationDTO>>> getAllExaminations() {
        return ResponseEntity.ok(examinationService.getAllExaminations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> getExaminationById(@PathVariable Long id) {
        return ResponseEntity.ok(examinationService.getExaminationById(id));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<CollectionModel<EntityModel<ExaminationDTO>>> getExaminationsForStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(examinationService.getExaminationsByStaffId(staffId));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<CollectionModel<EntityModel<ExaminationDTO>>> getExaminationsForCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(examinationService.getExaminationsByCustomerId(customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> updateExamination(@PathVariable Long id, @RequestBody ExaminationDTO examinationDTO) {
        return ResponseEntity.ok(examinationService.updateExamination(id, examinationDTO));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EntityModel<ExaminationDTO>> updateExaminationStatus(@PathVariable Long id, @RequestBody ExaminationDTO examinationDTO) {
        return ResponseEntity.ok(examinationService.updateExaminationStatus(id, examinationDTO));
    }

    @DeleteMapping("/{id}/status")
    public ResponseEntity<EntityModel<ExaminationDTO>> cancelExamination(@PathVariable Long id) {
        return ResponseEntity.ok(examinationService.cancelExamination(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> deleteExamination(@PathVariable Long id) {
        return cancelExamination(id);
    }

    @PutMapping("/payment/scan/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> scanExaminationPayment(@PathVariable Long id, @RequestBody ExaminationDTO dto) {
            return ResponseEntity.ok(examinationService.updateExaminationStatusWithStaff(id, dto));
    }

    @GetMapping("/payment/callback/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> handleExaminationPaymentCallback(@PathVariable Long id, @RequestParam Map<String, String> queryParams) {
        return examinationService.handleExaminationPaymentCallback(id, queryParams);
    }

    @GetMapping("/payment/{id}")
    public ResponseEntity<?> getExaminationPaymentInfo(@PathVariable Long id) {
        return ResponseEntity.ok(examinationService.getExaminationPaymentInfo(id));
    }

//    @GetMapping("/{id}")
//    public ResponseEntity<ExaminedExaminationDTO> getExaminationById(@PathVariable Long id) {
//        Examination examination = examinationService.findExaminationById(id);
//        ExaminedExaminationDTO dto = examinationMapper.toExaminedDTO(examination);
//        List<ResultDetail> resultDetails = examinationService.getResultDetailById(id);
//        List<TestType> testTypes = examinationService.getTestTypesById(id);
//        List<TestResultListDTO> testResultList = testResultMapper.toTestResultDtoList(testTypes, resultDetails);
//        dto.setTestResults(testResultList);
//        return ResponseEntity.ok(dto);
//    }

}

