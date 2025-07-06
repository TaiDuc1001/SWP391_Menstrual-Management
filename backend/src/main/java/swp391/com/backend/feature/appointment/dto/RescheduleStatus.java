package swp391.com.backend.feature.appointment.dto;

public enum RescheduleStatus {
    PENDING,        // Customer đã gửi request, chờ doctor approve
    APPROVED,       // Doctor đã approve 1 option
    REJECTED,       // Doctor đã reject
    CANCELLED       // Customer đã cancel request
}
