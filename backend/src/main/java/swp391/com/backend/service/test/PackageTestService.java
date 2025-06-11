package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.pojo.test.PanelTestType;
import swp391.com.backend.jpa.repository.test.PanelTestTypeRepository;

import java.util.List;

@Service
public class PackageTestService {
    private final PanelTestTypeRepository panelTestTypeRepository;

    public PackageTestService(PanelTestTypeRepository panelTestTypeRepository) {
        this.panelTestTypeRepository = panelTestTypeRepository;
    }

    public List<PanelTestType> getTestsByPackageId(Long packageId) {
        return panelTestTypeRepository.findTestsByPanelId(packageId);
    }

    public void addTestToPackage(Long packageId, Long testTypeId) {
        PanelTestType panelTestType = new PanelTestType();
        panelTestType.setPanelId(packageId);
        panelTestType.setTestTypeId(testTypeId);
        panelTestTypeRepository.save(panelTestType);
    }

    public void removeTestFromPackage(Long packageId, Long testTypeId) {
        panelTestTypeRepository.deleteByPanelIdAndTestTypeId(packageId, testTypeId);
    }
}
