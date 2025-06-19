package swp391.com.backend.feature.staff.mapper;

import org.mapstruct.Mapper;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.staff.dto.StaffDTO;

@Mapper(componentModel = "spring")
public interface StaffMapper {
    StaffDTO toDTO(Staff entity);
    Staff toEntity(StaffDTO dto);
}
