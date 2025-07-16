package swp391.com.backend.feature.appointment.mapper;

import org.springframework.stereotype.Component;
import swp391.com.backend.feature.appointment.data.RescheduleOption;
import swp391.com.backend.feature.appointment.data.RescheduleRequest;
import swp391.com.backend.feature.appointment.dto.RescheduleRequestDTO;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RescheduleMapper {

    public RescheduleRequestDTO toDTO(RescheduleRequest rescheduleRequest) {
        if (rescheduleRequest == null) {
            return null;
        }

        List<RescheduleRequestDTO.RescheduleOptionDTO> optionDTOs = Collections.emptyList();
        if (rescheduleRequest.getOptions() != null) {
            optionDTOs = rescheduleRequest.getOptions().stream()
                    .map(this::toOptionDTO)
                    .collect(Collectors.toList());
        }

        return RescheduleRequestDTO.builder()
                .id(rescheduleRequest.getId())
                .appointmentId(rescheduleRequest.getAppointment().getId())
                .customerId(rescheduleRequest.getCustomer().getId())
                .doctorId(rescheduleRequest.getDoctor().getId())
                .customerNote(rescheduleRequest.getCustomerNote())
                .status(rescheduleRequest.getStatus())
                .options(optionDTOs)
                .build();
    }

    public RescheduleRequestDTO.RescheduleOptionDTO toOptionDTO(RescheduleOption option) {
        if (option == null) {
            return null;
        }

        return RescheduleRequestDTO.RescheduleOptionDTO.builder()
                .id(option.getId())
                .date(option.getDate())
                .slot(option.getSlot())
                .timeRange(option.getSlot() != null ? option.getSlot().getTimeRange() : null)
                .isSelected(option.getIsSelected())
                .build();
    }

    public List<RescheduleRequestDTO> toDTOList(List<RescheduleRequest> rescheduleRequests) {
        if (rescheduleRequests == null) {
            return Collections.emptyList();
        }

        return rescheduleRequests.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}

