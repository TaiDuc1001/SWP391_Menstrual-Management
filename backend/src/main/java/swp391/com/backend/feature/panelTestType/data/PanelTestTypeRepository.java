package swp391.com.backend.feature.panelTestType.data;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PanelTestTypeRepository extends JpaRepository<PanelTestType, Long> {
    List<PanelTestType> findTestsByPanelId(Long packageId);

    void deleteByPanelIdAndTestTypeId(Long panelId, Long testTypeId);

    List<PanelTestType> findPanelTestTypesByPanelId(Long panelId);

    List<PanelTestType> findTestTypesByPanelId(Long panelId);
    
    void deleteByPanelId(Long panelId);
}
