package swp391.com.backend.service.test;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.repository.test.PanelRepository;
import swp391.com.backend.jpa.pojo.test.Panel;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PanelService {
    private final PanelRepository panelRepository;

    public Panel createPackage(Panel aPanel) {
        return panelRepository.save(aPanel);
    }

    public List<Panel> getAllPanels(){ return panelRepository.findAll(); }

    public void deletePackageById(Long id) {
        panelRepository.deleteById(id);
    }
}
