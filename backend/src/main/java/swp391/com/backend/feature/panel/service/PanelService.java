package swp391.com.backend.feature.panel.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.panel.data.PanelRepository;
import swp391.com.backend.feature.panel.data.Panel;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PanelService {
    private final PanelRepository panelRepository;

    public Panel createPackage(Panel aPanel) {
        return panelRepository.save(aPanel);
    }

    public List<Panel> getAllPanels(){ return panelRepository.findAll(); }

    public Panel findPanelById(Long id) {
        return panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found with id: " + id));
    }

    public void deletePackageById(Long id) {
        panelRepository.deleteById(id);
    }
}
