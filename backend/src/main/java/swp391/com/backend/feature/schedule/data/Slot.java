package swp391.com.backend.feature.schedule.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Slot {
    ZERO("Filler slot, not used"),
    ONE("9:00 AM - 9:45 AM"),
    TWO("10:00 AM - 10:45 AM"),
    THREE("11:00 AM - 11:45 AM"),
    FOUR("1:00 PM - 1:45 PM"),
    FIVE("2:00 PM - 2:45 PM"),
    SIX("3:00 PM - 3:45 PM"),
    SEVEN("4:00 PM - 4:45 PM"),
    EIGHT("5:00 PM - 5:45 PM");

    private final String timeRange;
}
