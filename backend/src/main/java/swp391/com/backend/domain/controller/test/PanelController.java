package swp391.com.backend.domain.controller.test;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.domain.dto.dto.SimplePanelDTO;
import swp391.com.backend.domain.mapper.PanelMapper;
import swp391.com.backend.jpa.pojo.test.Panel;
import swp391.com.backend.service.test.PanelService;

import java.util.List;

@RestController
@RequestMapping("api/panels")
@RequiredArgsConstructor
public class PanelController {
    private final PanelService panelService;
    private final PanelMapper panelMapper;

    @GetMapping
    public ResponseEntity<List<SimplePanelDTO>> getAllPanels(){
        List<SimplePanelDTO> result =  panelService.getAllPanels().stream()
                .map(panelMapper::toSimpleDTO)
                .toList();
        return ResponseEntity.ok(result);
    }
}
