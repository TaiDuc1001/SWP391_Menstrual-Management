package swp391.com.backend.domain.controller.examination;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.ExaminedExaminationDTO;
import swp391.com.backend.domain.dto.dto.SampledExaminationDTO;
import swp391.com.backend.domain.dto.dto.TestResultListDTO;
import swp391.com.backend.domain.dto.dto.TestTypeDTO;
import swp391.com.backend.domain.dto.request.ExaminationUpdateRequest;
import swp391.com.backend.domain.dto.simpledto.SimpleExaminationDTO;
import swp391.com.backend.domain.mapper.ExaminationMapper;
import swp391.com.backend.domain.mapper.TestResultMapper;
import swp391.com.backend.domain.mapper.TestTypeMapper;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.examination.ExaminationStatus;
import swp391.com.backend.jpa.pojo.examination.Result;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;
import swp391.com.backend.service.examination.ExaminationService;
import swp391.com.backend.service.examination.ResultDetailsService;
import swp391.com.backend.service.test.PanelService;

import java.util.List;

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

    @GetMapping
    public ResponseEntity<List<SimpleExaminationDTO>> getAllOrders() {
        List<SimpleExaminationDTO> result = examinationService.getAllExaminations()
                .stream()
                .map(examinationMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/sampled/{id}")
    public ResponseEntity<?> getSampledExaminationInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);

        if(examination.getExaminationStatus().ordinal() < 1) {
            return ResponseEntity.badRequest().body("Unsampled examination");
        }

        SampledExaminationDTO sampledExaminationDTO = examinationMapper.toSampledDTO(examination);
        List<TestTypeDTO> testTypes = examinationService.getTestTypesById(id)
                .stream()
                .map(testTypeMapper::toDTO)
                .toList();

        sampledExaminationDTO.setTestTypes(testTypes);
        sampledExaminationDTO.setExaminationStatus(examination.getExaminationStatus());
        return ResponseEntity.ok(sampledExaminationDTO);
    }

    @GetMapping("/examined/{id}")
    public ResponseEntity<?> getExaminedExaminationInfo(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);

        if(examination.getExaminationStatus().ordinal() < 2) {
            return ResponseEntity.badRequest().body("Unexamined examination");
        }

        ExaminedExaminationDTO examinedExaminationDTO = examinationMapper.toExaminedDTO(examination);
        List<ResultDetail> resultDetails = examinationService.getResultDetailById(id);
        List<TestType> testTypes = examinationService.getTestTypesById(id);
        List<TestResultListDTO> testResultList = testResultMapper.toTestResultDtoList(testTypes, resultDetails);

        examinedExaminationDTO.setTestResults(testResultList);
        examinedExaminationDTO.setExaminationStatus(examination.getExaminationStatus());
        return ResponseEntity.ok(examinedExaminationDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExaminedExaminationDTO> getExaminationById(@PathVariable Long id) {
        Examination examination = examinationService.findExaminationById(id);
        if (examination == null) {
            return ResponseEntity.notFound().build();
        }
        ExaminedExaminationDTO dto = examinationMapper.toExaminedDTO(examination);
        List<ResultDetail> resultDetails = examinationService.getResultDetailById(id);
        List<TestType> testTypes = examinationService.getTestTypesById(id);
        List<TestResultListDTO> testResultList = testResultMapper.toTestResultDtoList(testTypes, resultDetails);
        dto.setTestResults(testResultList);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/sampled/{id}")
    public ResponseEntity<SimpleExaminationDTO> sampleExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.SAMPLED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @PutMapping("/examined/{id}")
    public ResponseEntity<SimpleExaminationDTO> examineExamination(@PathVariable Long id, @RequestBody ExaminationUpdateRequest request) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.EXAMINED);

        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        Result result = updatedExamination.getResult();
        System.out.println(result.getId());
        List<ResultDetail> testResults = testResultMapper.splitDtoList(request.getTestResults()).getRight()
                .stream()
                .map(resultDetail -> {
                    resultDetail.setResultId(result.getId());
                    resultDetail.setResult(result);
                    System.out.println(resultDetail.getResultId() + " " + resultDetail.getTestTypeId());
                    return resultDetailsService.updateResultDetail(resultDetail);
                })
                .toList();

        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @PutMapping("/completed/{id}")
    public ResponseEntity<SimpleExaminationDTO> completeExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.COMPLETED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<SimpleExaminationDTO> cancelExamination(@PathVariable Long id) {
        Examination updatedExamination = examinationService.updateExaminationStatus(id, ExaminationStatus.CANCELLED);
        if (updatedExamination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(examinationMapper.toSimpleDTO(updatedExamination));
    }

    @DeleteMapping("/api/orders/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        examinationService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
