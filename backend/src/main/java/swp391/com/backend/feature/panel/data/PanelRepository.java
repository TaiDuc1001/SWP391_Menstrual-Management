package swp391.com.backend.feature.panel.data;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PanelRepository extends JpaRepository<Panel, Long> {
    
    @Query("SELECT p FROM Panel p WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(p.panelName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "p.description LIKE CONCAT('%', :keyword, '%')) AND " +
           "(:panelType IS NULL OR p.panelType = :panelType) AND " +
           "(:panelTag IS NULL OR p.panelTag = :panelTag)")
    Page<Panel> searchPanels(@Param("keyword") String keyword, 
                           @Param("panelType") PanelType panelType,
                           @Param("panelTag") PanelTag panelTag,
                           Pageable pageable);
    
    @Query("SELECT COUNT(p) FROM Panel p")
    Long countTotalPanels();
    
    @Query("SELECT AVG(p.price) FROM Panel p")
    Double getAveragePrice();
}

