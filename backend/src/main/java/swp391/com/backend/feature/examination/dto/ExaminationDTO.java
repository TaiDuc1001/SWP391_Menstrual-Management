package swp391.com.backend.feature.examination.dto;

import lombok.Data;
import lombok.experimental.FieldNameConstants;
import org.springframework.hateoas.server.core.Relation;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.examination.data.PaymentMethod;
import swp391.com.backend.feature.schedule.data.Slot;

import java.time.LocalDate;

@Data
@Relation(collectionRelation = "examinations", itemRelation = "examination")
@FieldNameConstants(level = lombok.AccessLevel.PRIVATE)
public class ExaminationDTO {
    Long id;
    Long staffId;
    String staffName;
    Long customerId;
    String customerName;
    PaymentMethod paymentMethod;
    Slot slot;
    String timeRange;
    LocalDate date;
    Long panelId;
    String panelName;
    Long resultId;
    ExaminationStatus examinationStatus;
}
