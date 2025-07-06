package swp391.com.backend.feature.examination.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import swp391.com.backend.feature.customer.data.Customer;
import swp391.com.backend.feature.customer.service.CustomerService;
import swp391.com.backend.feature.examination.assembler.ExaminationAssembler;
import swp391.com.backend.feature.examination.data.Examination;
import swp391.com.backend.feature.examination.data.ExaminationRepository;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.examination.dto.ExaminationDTO;
import swp391.com.backend.feature.examination.exception.ExaminationConflictException;
import swp391.com.backend.feature.examination.mapper.ExaminationMapper;
import swp391.com.backend.feature.panel.data.Panel;
import swp391.com.backend.feature.panel.service.PanelService;
import swp391.com.backend.feature.result.data.Result;
import swp391.com.backend.feature.result.service.ResultService;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.schedule.data.Slot;
import swp391.com.backend.feature.schedule.service.ScheduleService;
import swp391.com.backend.feature.staff.data.Staff;
import swp391.com.backend.feature.staff.service.StaffService;
import swp391.com.backend.feature.testType.data.TestType;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExaminationService {
    private final ExaminationRepository examinationRepository;
    private final ResultService resultService;
    private final ScheduleService scheduleService;
    private final ExaminationMapper examinationMapper;
    private final ExaminationAssembler examinationAssembler;
    private final CustomerService customerService;
    private final StaffService staffService;
    private final PanelService panelService;

    public List<Examination> getAllExaminations() {
        return examinationRepository.findAllWithRelations();
    }

    @Transactional
    public Examination createExamination(Examination examination) {
        validateExaminationConflict(examination);
        return examinationRepository.save(examination);
    }

    @Transactional
    public Examination updateExamination(Examination examination) {
        Examination updatedExamination = examinationRepository.save(examination);
        return updatedExamination;
    }

    public List<ResultDetail> getResultDetailById(Long id){
        return resultService.findResultDetailsByExaminationId(id);
    }

    public List<TestType> getTestTypesById(Long id) {
        return resultService.findTestTypesByExaminationId(id);
    }

    public Examination findExaminationById(Long id) {
        return examinationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Examination not found with id: " + id));
    }

    public Examination updateExaminationStatus(Long id, ExaminationDTO dto) {
        Examination existingExamination = findExaminationById(id);
        ExaminationStatus currentStatus = existingExamination.getExaminationStatus();
        ExaminationStatus newStatus = dto.getExaminationStatus();

        if (currentStatus == ExaminationStatus.SAMPLED && newStatus == ExaminationStatus.EXAMINED) {
            if (existingExamination.getResult() == null) {
                Result result = new Result();
                result.setExamination(existingExamination);
                Result savedResult = resultService.saveResult(result);
                existingExamination.setResult(savedResult);
            }
        }

        if(currentStatus == ExaminationStatus.PENDING && newStatus != ExaminationStatus.IN_PROGRESS){
            throw new IllegalArgumentException("Pending examinations can only be set to IN_PROGRESS status");
        }else if(currentStatus == ExaminationStatus.IN_PROGRESS && newStatus != ExaminationStatus.SAMPLED){
            throw new IllegalArgumentException("In-progress examinations can only be set to SAMPLED status");
        }else if(currentStatus == ExaminationStatus.SAMPLED && newStatus != ExaminationStatus.EXAMINED){
            throw new IllegalArgumentException("Sampled examinations can only be set to EXAMINED status");
        }else if(currentStatus == ExaminationStatus.EXAMINED && newStatus != ExaminationStatus.COMPLETED){
            throw new IllegalArgumentException("Examined examinations can only be set to COMPLETED status");
        }else if(currentStatus == ExaminationStatus.COMPLETED && newStatus == ExaminationStatus.CANCELLED){
            throw new IllegalArgumentException("Completed examinations cannot be cancelled");
        }

        existingExamination.setExaminationStatus(newStatus);
        return examinationRepository.save(existingExamination);
    }

    public Examination updateExamination(Long id, ExaminationDTO dto){
        Examination existingExamination = findExaminationById(id);
        Customer newCustomer = customerService.findCustomerById(dto.getCustomerId());
        Staff newStaff = staffService.findStaffById(dto.getStaffId());
        Panel newPanel = panelService.findPanelById(dto.getPanelId());

        existingExamination = existingExamination.toBuilder()
                .customer(newCustomer)
                .staff(newStaff)
                .panel(newPanel)
                .date(dto.getDate())
                .slot(dto.getSlot())
                .paymentMethod(dto.getPaymentMethod())
                .examinationStatus(dto.getExaminationStatus())
                .build();

        return examinationRepository.save(existingExamination);
    }

    public Examination cancelExamination(Long id) {
        Examination existingExamination = findExaminationById(id);
        if (existingExamination.getExaminationStatus() == ExaminationStatus.COMPLETED) {
            throw new IllegalArgumentException("Completed examinations cannot be cancelled");
        }
        existingExamination.setExaminationStatus(ExaminationStatus.CANCELLED);
        return examinationRepository.save(existingExamination);
    }

    public Examination updateExaminationTestResults(Long id, List<ResultDetail> testResults) {
        Examination existingExamination = findExaminationById(id);
        existingExamination.getResult().setResultDetails(testResults);
        return examinationRepository.save(existingExamination);
    }

    public List<Examination> getExaminationsByStaffId(Long id) {
        return examinationRepository.findExaminationsByStaffId(id);
    }

    public Examination updateExaminationStatusWithStaff(Long id, ExaminationDTO dto) {
        Examination existingExamination = findExaminationById(id);
        Examination updatedStatusExamination = updateExaminationStatus(id, dto);
        ExaminationStatus status = updatedStatusExamination.getExaminationStatus();
        Long staffId = dto.getStaffId();

        if (staffId != null && (status == ExaminationStatus.IN_PROGRESS || status == ExaminationStatus.SAMPLED || status == ExaminationStatus.EXAMINED)) {
            if (existingExamination.getStaff() == null) {
                Staff staff = new Staff();
                staff.setId(staffId);
                existingExamination.setStaff(staff);
            }
        }

        return examinationRepository.save(existingExamination);;
    }

    private void validateExaminationConflict(Examination examination) {
        boolean conflictExists = examinationRepository.existsByDateAndSlotAndNotCancelledOrCompleted(
            examination.getDate(), 
            examination.getSlot()
        );
        
        if (conflictExists) {
            throw new ExaminationConflictException("An examination is already scheduled for this date and time slot");
        }
    }

    public List<String> getAvailableSlots(String dateString) {
        LocalDate date = LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
        
        List<Slot> allSlots = Arrays.asList(Slot.values());
        List<String> allSlotTimeRanges = allSlots.stream()
                .filter(slot -> !slot.getTimeRange().equals("Filler slot, not used"))
                .map(Slot::getTimeRange)
                .collect(Collectors.toList());

        List<Slot> bookedSlots = examinationRepository.findBookedSlotsByDate(date);
        List<String> bookedSlotTimeRanges = bookedSlots.stream()
                .map(Slot::getTimeRange)
                .collect(Collectors.toList());
        
        return allSlotTimeRanges.stream()
                .filter(slot -> !bookedSlotTimeRanges.contains(slot))
                .collect(Collectors.toList());
    }

    public EntityModel<ExaminationDTO> toModel(Examination examination) {
        ExaminationDTO dto = examinationMapper.toDTO(examination);
        return examinationAssembler.toModel(dto);
    }

    public CollectionModel<EntityModel<ExaminationDTO>> toCollectionModel(List<Examination> examinations) {
        List<ExaminationDTO> models = examinationMapper.toDTOs(examinations);
        return examinationAssembler.toCollectionModel(models);
    }
}
