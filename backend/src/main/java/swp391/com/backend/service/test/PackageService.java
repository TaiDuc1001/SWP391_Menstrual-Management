package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.repository.test.PanelRepository;
import swp391.com.backend.jpa.pojo.test.Panel;

import java.util.List;

@Service
public class PackageService {
    private final PanelRepository panelRepository;

    public PackageService(PanelRepository panelRepository) {
        this.panelRepository = panelRepository;
    }

    public Panel createPackage(Panel aPanel) {
        return panelRepository.save(aPanel);
    }

    public List<Panel> getAllPackages(){
        return panelRepository.findAll();
    }

    public void deletePackageById(Long id) {
        panelRepository.deleteById(id);
    }
}
