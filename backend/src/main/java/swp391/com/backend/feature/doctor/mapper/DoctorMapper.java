package swp391.com.backend.feature.doctor.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import swp391.com.backend.feature.doctor.dto.DoctorDTO;
import swp391.com.backend.feature.doctor.dto.SimpleDoctorDTO;
import swp391.com.backend.feature.doctor.data.Doctor;

@Mapper(componentModel = "spring")
public interface DoctorMapper {
    SimpleDoctorDTO toSimpleDTO(Doctor entity);
    
    @Mapping(source = "account.id", target = "accountId")
    DoctorDTO toDTO(Doctor entity);
    
    @Mapping(target = "account", ignore = true)
    @Mapping(target = "appointments", ignore = true)
    @Mapping(target = "schedules", ignore = true)
    Doctor toEntity(DoctorDTO dto);
}
