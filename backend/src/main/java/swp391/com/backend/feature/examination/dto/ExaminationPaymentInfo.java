package swp391.com.backend.feature.examination.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ExaminationPaymentInfo {
    private Long examinationId;
    private String customerName;
    private String staffName;
    private String date;
    private String timeRange;
    private BigDecimal amount;
    private String panelName;
    private String qrCodeUrl;
}

