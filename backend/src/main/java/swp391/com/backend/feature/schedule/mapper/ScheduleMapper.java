package swp391.com.backend.feature.schedule.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import swp391.com.backend.feature.schedule.data.Schedule;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.schedule.dto.ScheduleResponse;
import swp391.com.backend.feature.schedule.dto.SlotOptionResponse;
import swp391.com.backend.feature.schedule.dto.SlotResponse;

@Mapper(componentModel = "spring")
public interface ScheduleMapper {
    
    @Mapping(source = "doctor.id", target = "doctorId")
    @Mapping(source = "doctor.name", target = "doctorName")
    @Mapping(source = "slot", target = "slot", qualifiedByName = "slotToSlotResponse")
    @Mapping(target = "hasAppointment", ignore = true)
    ScheduleResponse toScheduleResponse(Schedule schedule);
    
    @Named("slotToSlotResponse")
    default SlotResponse toSlotResponse(Slot slot) {
        if (slot == null) {
            return null;
        }
        String displayName = slot == Slot.ZERO ? slot.name() : "Slot " + slot.ordinal();
        return new SlotResponse(displayName, slot.getTimeRange());
    }
    
    default SlotOptionResponse toSlotOptionResponse(Slot slot) {
        if (slot == null) {
            return null;
        }
        String displayName = slot == Slot.ZERO ? slot.name() : "Slot " + slot.ordinal();
        return new SlotOptionResponse(slot.name(), displayName, slot.getTimeRange(), slot.ordinal());
    }
}
