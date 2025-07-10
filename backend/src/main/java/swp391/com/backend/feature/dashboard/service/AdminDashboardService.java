package swp391.com.backend.feature.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.account.data.AccountRepository;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.blog.data.BlogRepository;
import swp391.com.backend.feature.dashboard.dto.AdminDashboardDTO;
import swp391.com.backend.feature.dashboard.dto.RecentActivityDTO;
import swp391.com.backend.feature.dashboard.dto.SystemNotificationDTO;
import swp391.com.backend.feature.dashboard.dto.UserGrowthDTO;
import swp391.com.backend.feature.dashboard.dto.AppointmentCountDTO;
import swp391.com.backend.feature.examination.data.ExaminationRepository;
import swp391.com.backend.feature.examination.data.ExaminationStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    // Doanh thu từng tháng trong năm hiện tại
    public java.util.List<MonthlyRevenue> getMonthlyRevenue(int year) {
        java.util.Map<Integer, Double> revenueByMonth = new java.util.HashMap<>();
        // Khởi tạo 12 tháng = 0
        for (int m = 1; m <= 12; m++) revenueByMonth.put(m, 0.0);

        // Xét nghiệm
        examinationRepository.findAll().stream()
            .filter(exam -> exam.getPanel() != null && exam.getPanel().getPrice() != null)
            .filter(exam -> exam.getExaminationStatus() == ExaminationStatus.COMPLETED ||
                            exam.getExaminationStatus() == ExaminationStatus.EXAMINED)
            .filter(exam -> exam.getDate() != null && exam.getDate().getYear() == year)
            .forEach(exam -> {
                int month = exam.getDate().getMonthValue();
                double price = exam.getPanel().getPrice().doubleValue();
                revenueByMonth.put(month, revenueByMonth.get(month) + price);
            });
        // Lịch hẹn
        appointmentRepository.findAll().stream()
            .filter(app -> app.getAppointmentStatus() == AppointmentStatus.FINISHED)
            .filter(app -> app.getDoctor() != null && app.getDoctor().getPrice() != null)
            .filter(app -> app.getDate() != null && app.getDate().getYear() == year)
            .forEach(app -> {
                int month = app.getDate().getMonthValue();
                double price = app.getDoctor().getPrice().doubleValue();
                revenueByMonth.put(month, revenueByMonth.get(month) + price);
            });
        java.util.List<MonthlyRevenue> result = new java.util.ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            result.add(new MonthlyRevenue(m, revenueByMonth.get(m)));
        }
        return result;
    }

    // Phân bố số lượng dịch vụ (panel)
    public java.util.List<ServiceDistribution> getServiceDistribution() {
        java.util.Map<String, Integer> panelCount = new java.util.HashMap<>();
        examinationRepository.findAll().stream()
            .filter(exam -> exam.getPanel() != null)
            .forEach(exam -> {
                String panelName = exam.getPanel().getPanelName();
                panelCount.put(panelName, panelCount.getOrDefault(panelName, 0) + 1);
            });
        java.util.List<ServiceDistribution> result = new java.util.ArrayList<>();
        for (var entry : panelCount.entrySet()) {
            result.add(new ServiceDistribution(entry.getKey(), entry.getValue()));
        }
        return result;
    }

    // DTO cho biểu đồ
    public static class MonthlyRevenue {
        public int month;
        public double revenue;
        public MonthlyRevenue(int month, double revenue) {
            this.month = month;
            this.revenue = revenue;
        }
    }
    public static class ServiceDistribution {
        public String name;
        public int value;
        public ServiceDistribution(String name, int value) {
            this.name = name;
            this.value = value;
        }
    }

    private final AccountRepository accountRepository;
    private final BlogRepository blogRepository;
    private final AppointmentRepository appointmentRepository;
    private final ExaminationRepository examinationRepository;

    public AdminDashboardDTO getDashboardData() {
        // Get actual counts from repositories
        long totalAccounts = accountRepository.count();
        long totalBlogs = blogRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalExaminations = examinationRepository.count();

        // Tổng doanh thu (từ tất cả các phiếu xét nghiệm và lịch hẹn đã hoàn thành)
        double examinationRevenue = examinationRepository.findAll().stream()
            .filter(exam -> exam.getPanel() != null && exam.getPanel().getPrice() != null)
            .filter(exam -> exam.getExaminationStatus() == ExaminationStatus.COMPLETED ||
                            exam.getExaminationStatus() == ExaminationStatus.EXAMINED)
            .mapToDouble(exam -> exam.getPanel().getPrice().doubleValue())
            .sum();
        double appointmentRevenue = appointmentRepository.findAll().stream()
            .filter(app -> app.getAppointmentStatus() == AppointmentStatus.FINISHED)
            .filter(app -> app.getDoctor() != null && app.getDoctor().getPrice() != null)
            .mapToDouble(app -> app.getDoctor().getPrice().doubleValue())
            .sum();
        double totalRevenue = examinationRevenue + appointmentRevenue;

        // User growth by month (12 months)
        List<UserGrowthDTO> userGrowthByMonth = new ArrayList<>();
        java.time.Year currentYear = java.time.Year.now();
        for (int m = 1; m <= 12; m++) {
            final int month = m;
            long newUsers = accountRepository.findAll().stream()
                .filter(acc -> acc.getCreatedAt() != null && acc.getCreatedAt().getYear() == currentYear.getValue() && acc.getCreatedAt().getMonthValue() == month)
                .count();
            userGrowthByMonth.add(new UserGrowthDTO(month, newUsers));
        }

        // Appointments by month (12 months)
        List<AppointmentCountDTO> appointmentsByMonth = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            final int month = m;
            long count = appointmentRepository.findAll().stream()
                .filter(app -> app.getDate() != null && app.getDate().getYear() == currentYear.getValue() && app.getDate().getMonthValue() == month)
                .count();
            appointmentsByMonth.add(new AppointmentCountDTO(month, count));
        }

        // Dummy/placeholder values for advanced metrics (replace with real calculations)
        double satisfactionRate = 95.0;
        double returnRate = 78.0;
        double avgWaitTime = 15.0;
        double avgRating = 4.8;
        long activeUsers = 1245;
        double avgInteractionsPerUser = 3.2;
        double avgSessionTime = 12.58; // minutes
        double uptime = 99.9;
        double responseTime = 0.8;
        double systemErrors = 0.1;
        double bandwidth = 85.0;

        return AdminDashboardDTO.builder()
                .totalAccounts(totalAccounts)
                .totalBlogs(totalBlogs)
                .totalAppointments(totalAppointments)
                .totalTestServices(totalExaminations)
                .totalRevenue(totalRevenue)
                .growthRate(0)
                .userGrowthByMonth(userGrowthByMonth)
                .appointmentsByMonth(appointmentsByMonth)
                .satisfactionRate(satisfactionRate)
                .returnRate(returnRate)
                .avgWaitTime(avgWaitTime)
                .avgRating(avgRating)
                .activeUsers(activeUsers)
                .avgInteractionsPerUser(avgInteractionsPerUser)
                .avgSessionTime(avgSessionTime)
                .uptime(uptime)
                .responseTime(responseTime)
                .systemErrors(systemErrors)
                .bandwidth(bandwidth)
                .build();
    }
    
    // Recent Activities
    public List<RecentActivityDTO> getRecentActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();
        
        // Lấy appointments gần đây (5 ngày qua) - sử dụng date thay vì createdAt
        LocalDateTime fiveDaysAgo = LocalDateTime.now().minusDays(5);
        
        appointmentRepository.findAll().stream()
            .filter(app -> app.getDate() != null && app.getDate().isAfter(fiveDaysAgo.toLocalDate()))
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .limit(5)
            .forEach(app -> {
                String customerName = app.getCustomer() != null ? app.getCustomer().getName() : "Unknown";
                String doctorName = app.getDoctor() != null ? app.getDoctor().getName() : "Unknown Doctor";
                activities.add(RecentActivityDTO.builder()
                    .time(app.getDate().atStartOfDay().format(DateTimeFormatter.ofPattern("MM/dd")))
                    .action("Appointment: " + customerName + " with Dr. " + doctorName)
                    .type("appointment")
                    .timestamp(app.getDate().atStartOfDay())
                    .build());
            });
        
        // Lấy examinations gần đây - sử dụng date thay vì updatedAt
        examinationRepository.findAll().stream()
            .filter(exam -> exam.getDate() != null && exam.getDate().isAfter(fiveDaysAgo.toLocalDate()))
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .limit(5)
            .forEach(exam -> {
                String customerName = exam.getCustomer() != null ? exam.getCustomer().getName() : "Unknown";
                String panelName = exam.getPanel() != null ? exam.getPanel().getPanelName() : "Unknown Panel";
                String statusText = exam.getExaminationStatus() != null ? exam.getExaminationStatus().toString() : "Unknown";
                activities.add(RecentActivityDTO.builder()
                    .time(exam.getDate().atStartOfDay().format(DateTimeFormatter.ofPattern("MM/dd")))
                    .action("STI Test: " + customerName + " - " + panelName + " (" + statusText + ")")
                    .type("sti-test")
                    .timestamp(exam.getDate().atStartOfDay())
                    .build());
            });
        
        // Lấy blogs được tạo gần đây - Blog có createdAt
        blogRepository.findAll().stream()
            .filter(blog -> blog.getCreatedAt() != null && blog.getCreatedAt().isAfter(fiveDaysAgo))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .limit(3)
            .forEach(blog -> {
                activities.add(RecentActivityDTO.builder()
                    .time(blog.getCreatedAt().format(DateTimeFormatter.ofPattern("HH:mm")))
                    .action("New blog: " + blog.getTitle())
                    .type("blog")
                    .timestamp(blog.getCreatedAt())
                    .build());
            });
        
    // Sắp xếp theo thời gian mới nhất và lấy 10 hoạt động gần nhất
        return activities.stream()
            .sorted(Comparator.comparing(RecentActivityDTO::getTimestamp).reversed())
            .limit(10)
            .collect(Collectors.toList());
    }
    
    // All Activities (for Activities page)
    public List<RecentActivityDTO> getAllActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();
        
        // Lấy tất cả appointments (30 ngày qua)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        appointmentRepository.findAll().stream()
            .filter(app -> app.getDate() != null && app.getDate().isAfter(thirtyDaysAgo.toLocalDate()))
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .forEach(app -> {
                String customerName = app.getCustomer() != null ? app.getCustomer().getName() : "Unknown";
                String doctorName = app.getDoctor() != null ? app.getDoctor().getName() : "Unknown Doctor";
                String statusText = app.getAppointmentStatus() != null ? app.getAppointmentStatus().toString() : "Unknown";
                activities.add(RecentActivityDTO.builder()
                    .time(app.getDate().atStartOfDay().format(DateTimeFormatter.ofPattern("MM/dd")))
                    .action("Appointment: " + customerName + " with Dr. " + doctorName + " (" + statusText + ")")
                    .type("appointment")
                    .timestamp(app.getDate().atStartOfDay())
                    .build());
            });
        
        // Lấy tất cả examinations (30 ngày qua)
        examinationRepository.findAll().stream()
            .filter(exam -> exam.getDate() != null && exam.getDate().isAfter(thirtyDaysAgo.toLocalDate()))
            .sorted((a, b) -> b.getDate().compareTo(a.getDate()))
            .forEach(exam -> {
                String customerName = exam.getCustomer() != null ? exam.getCustomer().getName() : "Unknown";
                String panelName = exam.getPanel() != null ? exam.getPanel().getPanelName() : "Unknown Panel";
                String statusText = exam.getExaminationStatus() != null ? exam.getExaminationStatus().toString() : "Unknown";
                activities.add(RecentActivityDTO.builder()
                    .time(exam.getDate().atStartOfDay().format(DateTimeFormatter.ofPattern("MM/dd")))
                    .action("STI Test: " + customerName + " - " + panelName + " (" + statusText + ")")
                    .type("sti-test")
                    .timestamp(exam.getDate().atStartOfDay())
                    .build());
            });
        
        // Lấy tất cả blogs (30 ngày qua)
        blogRepository.findAll().stream()
            .filter(blog -> blog.getCreatedAt() != null && blog.getCreatedAt().isAfter(thirtyDaysAgo))
            .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
            .forEach(blog -> {
                activities.add(RecentActivityDTO.builder()
                    .time(blog.getCreatedAt().format(DateTimeFormatter.ofPattern("MM/dd HH:mm")))
                    .action("New blog: " + blog.getTitle())
                    .type("blog")
                    .timestamp(blog.getCreatedAt())
                    .build());
            });
        
        // Sắp xếp theo thời gian mới nhất
        return activities.stream()
            .sorted(Comparator.comparing(RecentActivityDTO::getTimestamp).reversed())
            .collect(Collectors.toList());
    }
    
    // System Notifications
    public List<SystemNotificationDTO> getSystemNotifications() {
        List<SystemNotificationDTO> notifications = new ArrayList<>();
        
        // Kiểm tra accounts pending approval
        long pendingAccounts = accountRepository.findAll().stream()
            .filter(account -> !account.getStatus()) // status = false means pending
            .count();
        
        if (pendingAccounts > 0) {
            String id = "accounts-pending-" + pendingAccounts;
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message(pendingAccounts + (pendingAccounts > 1 ? " accounts are" : " account is") + " pending approval")
                .type("warning")
                .priority("medium")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        // Separate notifications for different examination states that need attention
        
        // 1. SAMPLED examinations that need processing
        long sampledExams = examinationRepository.findAll().stream()
            .filter(exam -> exam.getExaminationStatus() == ExaminationStatus.SAMPLED)
            .count();
        
        if (sampledExams > 0) {
            String id = "examinations-sampled-" + sampledExams;
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message(sampledExams + (sampledExams > 1 ? " examinations have" : " examination has") + " samples ready for analysis")
                .type("info")
                .priority(sampledExams > 5 ? "high" : "medium")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        // 2. EXAMINED examinations that need final review/approval
        long examinedExams = examinationRepository.findAll().stream()
            .filter(exam -> exam.getExaminationStatus() == ExaminationStatus.EXAMINED)
            .count();
        
        if (examinedExams > 0) {
            String id = "examinations-examined-" + examinedExams;
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message(examinedExams + (examinedExams > 1 ? " examinations need" : " examination needs") + " final approval")
                .type("warning")
                .priority("high")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        // 3. Overdue PENDING examinations
        long overdueExams = examinationRepository.findAll().stream()
            .filter(exam -> 
                exam.getExaminationStatus() == ExaminationStatus.PENDING &&
                exam.getDate() != null && 
                exam.getDate().isBefore(java.time.LocalDate.now())
            )
            .count();
        
        if (overdueExams > 0) {
            String id = "examinations-overdue-" + overdueExams;
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message(overdueExams + (overdueExams > 1 ? " overdue examinations require" : " overdue examination requires") + " attention")
                .type("error")
                .priority("high")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        // Kiểm tra appointments cần confirm
        long pendingAppointments = appointmentRepository.findAll().stream()
            .filter(app -> app.getAppointmentStatus() == AppointmentStatus.BOOKED)
            .count();
        
        if (pendingAppointments > 0) {
            String id = "appointments-pending-" + pendingAppointments;
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message(pendingAppointments + (pendingAppointments > 1 ? " appointments are" : " appointment is") + " waiting for confirmation")
                .type("info")
                .priority(pendingAppointments > 10 ? "high" : "low")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        // Check for appointments scheduled for today
        long todayAppointments = appointmentRepository.findAll().stream()
            .filter(app -> app.getDate() != null && app.getDate().equals(java.time.LocalDate.now()))
            .filter(app -> app.getAppointmentStatus() != AppointmentStatus.CANCELLED 
                    && app.getAppointmentStatus() != AppointmentStatus.FINISHED)
            .count();
            
        if (todayAppointments > 0) {
            String id = "appointments-today-" + todayAppointments;
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message(todayAppointments + (todayAppointments > 1 ? " appointments" : " appointment") + " scheduled for today")
                .type("warning")
                .priority("medium")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        // Add system maintenance notification if scheduled
        // In a real system, this would come from a configuration or scheduled maintenance table
        // For demo purposes, we'll check if today is a maintenance day (e.g., first day of the month)
        if (java.time.LocalDate.now().getDayOfMonth() == 1) {
            String id = "system-maintenance-monthly";
            notifications.add(SystemNotificationDTO.builder()
                .id(id)
                .message("System maintenance scheduled for tonight at 23:00")
                .type("error")
                .priority("medium")
                .isRead(notificationReadStatus.getOrDefault(id, false))
                .build());
        }
        
        return notifications;
    }
    
    // System Notifications repository for storing read status
    private final Map<String, Boolean> notificationReadStatus = new HashMap<>();
    
    // Mark notification as read
    public void markNotificationAsRead(String id) {
        notificationReadStatus.put(id, true);
    }
    
    // Mark all notifications as read
    public void markAllNotificationsAsRead() {
        List<SystemNotificationDTO> notifications = getSystemNotifications();
        for (SystemNotificationDTO notification : notifications) {
            notificationReadStatus.put(notification.getId(), true);
        }
    }
}
