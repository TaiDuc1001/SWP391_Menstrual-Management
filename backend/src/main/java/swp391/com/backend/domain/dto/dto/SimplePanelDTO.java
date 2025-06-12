package swp391.com.backend.domain.dto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import swp391.com.backend.jpa.pojo.test.PanelTag;
import swp391.com.backend.jpa.pojo.test.PanelType;

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
