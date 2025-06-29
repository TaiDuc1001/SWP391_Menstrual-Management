package swp391.com.backend.feature.panel.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PanelStatisticsDTO {
    Long totalPanels;
    Long activePanels;
    Long inactivePanels;
    String mostPopularPanel;
    Double averagePrice;
}
