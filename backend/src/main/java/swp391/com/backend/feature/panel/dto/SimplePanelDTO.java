package swp391.com.backend.feature.panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimplePanelDTO {
    private Long id;
    private String panelName;
    private String description;
    private Integer responseTime;
    private PanelTag panelTag;
    private PanelType panelType;
}
