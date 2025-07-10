package swp391.com.backend.feature.dashboard.dto;

import lombok.Builder;

@Builder
public record AdminDashboardDTO(
    long totalAccounts,
    long totalBlogs,
    long totalAppointments,
    long totalTestServices,
    double totalRevenue,
    double growthRate
) {
}
