package swp391.com.backend.domain.controller.test;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import swp391.com.backend.domain.dto.dto.ExaminationCreateResponse;
import swp391.com.backend.domain.dto.dto.ExaminationDTO;
import swp391.com.backend.domain.dto.dto.PanelDTO;
import swp391.com.backend.domain.dto.request.ExaminationCreateRequest;
import swp391.com.backend.domain.dto.simpledto.SimplePanelDTO;
import swp391.com.backend.domain.mapper.ExaminationMapper;
import swp391.com.backend.domain.mapper.PanelMapper;
import swp391.com.backend.jpa.pojo.examination.Examination;
import swp391.com.backend.jpa.pojo.test.Panel;
import swp391.com.backend.service.examination.ExaminationService;
import swp391.com.backend.service.test.PanelService;
import swp391.com.backend.service.test.PanelTestTypeService;

import java.util.List;

@RestController
@RequestMapping("api/panels")
@RequiredArgsConstructor
public class PanelController {
    private final PanelService panelService;
    private final PanelTestTypeService panelTestTypeService;
    private final PanelMapper panelMapper;
    private final ExaminationService examinationService;
    private final ExaminationMapper examinationMapper;

    @GetMapping
    public ResponseEntity<List<SimplePanelDTO>> getAllPanels(){
        List<SimplePanelDTO> result =  panelService.getAllPanels().stream()
                .map(panelMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PanelDTO> getPanelById(@PathVariable Long id) {
        Panel panel = panelService.findPanelById(id);
        System.out.println("Panel name: " + panel.getPanelName());
        PanelDTO result = panelMapper.toDTO(panel);
        System.out.println("Panel price:" + result.getPrice());
        List<String> testTypesDescriptions = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getDescription())
                .toList();

        List<String> testTypesNames = panelTestTypeService.getTestTypesByPanelId(id)
                .stream()
                .map(testType -> testType.getName())
                .toList();
        result.setTestTypesDescriptions(testTypesDescriptions);
        result.setTestTypesNames(testTypesNames);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ExaminationCreateResponse> createExamination(@PathVariable Long id, @RequestBody ExaminationCreateRequest request) {
        Panel panel = panelService.findPanelById(id);
        Examination examination = Examination.builder()
                .panel(panel)
                .date(request.getDate())
                .slot(request.getSlot())
                .build();

        Examination createdExamination = examinationService.createExamination(examination);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examinationMapper.toCreateResponse(createdExamination));
    }
}
