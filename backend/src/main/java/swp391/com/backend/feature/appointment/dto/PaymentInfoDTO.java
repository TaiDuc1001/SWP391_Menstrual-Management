package swp391.com.backend.feature.appointment.dto;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentInfoDTO {
    Long appointmentId;
    String customerName;
    String doctorName;
    LocalDate date;
    String timeRange;
    Double amount;
    String qrCodeUrl;
}

