package swp391.com.backend.feature.panel.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.feature.panel.data.PanelTag;
import swp391.com.backend.feature.panel.data.PanelType;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimplePanelDTO {
    private Long id;
    private String panelName;
    private String description;
    private BigDecimal price;
    private Integer responseTime;
    private PanelTag panelTag;
    private PanelType panelType;
    private List<String> testTypesNames;
    private List<String> testTypesDescriptions;
}
