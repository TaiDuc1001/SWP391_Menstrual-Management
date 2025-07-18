package swp391.com.backend.feature.schedule.data;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum Slot {
    ZERO("Filler slot, not used"),
    ONE("7:00 AM - 8:00 AM"),
    TWO("8:15 AM - 9:15 AM"),
    THREE("9:30 AM - 10:30 AM"),
    FOUR("10:45 AM - 11:45 AM"),
    FIVE("1:00 PM - 2:00 PM"),
    SIX("2:15 PM - 3:15 PM"),
    SEVEN("3:30 PM - 4:30 PM"),
    EIGHT("4:45 PM - 5:45 PM");

    private final String timeRange;

    @JsonCreator
    public static Slot fromString(String value) {
        for (Slot slot : Slot.values()) {
            if (slot.name().equalsIgnoreCase(value) || slot.timeRange.equalsIgnoreCase(value)) {
                return slot;
            }
        }
        throw new IllegalArgumentException("Unknown slot: " + value);
    }
}

