package swp391.com.backend.feature.examination.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.feature.examination.assembler.ExaminationAssembler;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.examination.dto.ExaminationDTO;
import swp391.com.backend.feature.examination.dto.ExaminationPaymentInfo;
import swp391.com.backend.feature.examination.mapper.ExaminationMapper;
import swp391.com.backend.feature.examination.service.ExaminationService;
import swp391.com.backend.feature.examination.testResult.TestResultMapper;
import swp391.com.backend.feature.panel.service.PanelService;
import swp391.com.backend.feature.resultDetail.service.ResultDetailsService;
import swp391.com.backend.feature.testType.mapper.TestTypeMapper;

import java.util.List;
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
        List<Examination> result = examinationService.getAllExaminations();
        return ResponseEntity.ok(examinationService.toCollectionModel(result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> getExaminationById(@PathVariable Long id) {
        Examination result = examinationService.findExaminationById(id);
        return ResponseEntity.ok(examinationService.toModel(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> updateExamination(@PathVariable Long id, @RequestBody ExaminationDTO examinationDTO) {
        Examination updatedExamination = examinationService.updateExamination(id, examinationDTO);
        return ResponseEntity.ok(examinationService.toModel(updatedExamination));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EntityModel<ExaminationDTO>> updateExaminationStatus(@PathVariable Long id, @RequestBody ExaminationDTO examinationDTO) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, examinationDTO);
        return ResponseEntity.ok(examinationService.toModel(updatedExamination));
    }

    @DeleteMapping("/{id}/status")
    public ResponseEntity<EntityModel<ExaminationDTO>> cancelExamination(@PathVariable Long id) {
        Examination cancelledExamination = examinationService.cancelExamination(id);
        return ResponseEntity.ok(examinationService.toModel(cancelledExamination));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> deleteExamination(@PathVariable Long id) {
        return cancelExamination(id);
    }

    @PutMapping("/payment/scan/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> scanExaminationPayment(@PathVariable Long id, @RequestBody ExaminationDTO dto) {
            Examination updatedExamination = examinationService.updateExaminationStatusWithStaff(id, dto);
            return ResponseEntity.ok(examinationService.toModel(updatedExamination));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<CollectionModel<EntityModel<ExaminationDTO>>> getExaminationsForStaff(@PathVariable Long staffId) {
        List<Examination> result = examinationService.getExaminationsByStaffId(staffId);
        return ResponseEntity.ok(examinationService.toCollectionModel(result));
    }

    @GetMapping("/payment/callback/{id}")
    public ResponseEntity<EntityModel<ExaminationDTO>> handleExaminationPaymentCallback(@PathVariable Long id, @RequestParam Map<String, String> queryParams) {
        Examination examination = examinationService.findExaminationById(id);
        if (examination.getExaminationStatus() != ExaminationStatus.PENDING) {
            return ResponseEntity.badRequest().build();
        }

        if(queryParams.containsKey("vnp_ResponseCode") && !queryParams.get("vnp_ResponseCode").equals("00")) {
            examination.setExaminationStatus(ExaminationStatus.CANCELLED);
        } else {
            examination.setExaminationStatus(ExaminationStatus.IN_PROGRESS);
        }

        String frontendUrl = "http://localhost:3000/customer/examination-payment-return";
        if (queryParams.containsKey("vnp_ResponseCode")) {
            frontendUrl += "?status=" + queryParams.get("vnp_ResponseCode");
        }

        return ResponseEntity.status(302)
                .header("Location", frontendUrl)
                .body(examinationService.toModel(examination));
    }

    @GetMapping("/payment/{id}")
    public ResponseEntity<?> getExaminationPaymentInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);
        if (examination == null) {
            return ResponseEntity.notFound().build();
        }

        ExaminationPaymentInfo paymentInfo = ExaminationPaymentInfo.builder()
                .examinationId(examination.getId())
                .customerName(examination.getCustomer().getName())
                .staffName(examination.getStaff() != null ? examination.getStaff().getName() : "Not assigned")
                .date(examination.getDate().toString())
                .timeRange(examination.getSlot().getTimeRange())
                .amount(examination.getPanel().getPrice())
                .panelName(examination.getPanel().getPanelName())
                .qrCodeUrl("https://via.placeholder.com/256x256/000000/FFFFFF?text=QR+Code")
                .build();

        return ResponseEntity.ok(paymentInfo);
    }
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

