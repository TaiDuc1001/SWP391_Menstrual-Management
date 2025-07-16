package swp391.com.backend.feature.dashboard.dto;

import lombok.Builder;
import java.util.List;

@Builder
public record AdminDashboardDTO(
    long totalAccounts,
    long totalBlogs,
    long totalAppointments,
    long totalTestServices,
    double totalRevenue,
    double growthRate,
    List<UserGrowthDTO> userGrowthByMonth,
    List<AppointmentCountDTO> appointmentsByMonth,
    double satisfactionRate,
    double returnRate,
    double avgWaitTime,
    double avgRating,
    long activeUsers,
    double avgInteractionsPerUser,
    double avgSessionTime,
    double uptime,
    double responseTime,
    double systemErrors,
    double bandwidth
) {}


