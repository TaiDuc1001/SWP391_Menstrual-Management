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
import swp391.com.backend.feature.examination.data.ExaminationRepository;
import swp391.com.backend.feature.examination.data.ExaminationStatus;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
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

        // Số mẫu xét nghiệm (tất cả trạng thái)
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

        return AdminDashboardDTO.builder()
                .totalAccounts(totalAccounts)
                .totalBlogs(totalBlogs)
                .totalAppointments(totalAppointments)
                .totalTestServices(totalExaminations)
                .totalRevenue(totalRevenue)
                .growthRate(0)
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
            notifications.add(SystemNotificationDTO.builder()
                .message("There are " + pendingAccounts + " accounts pending approval")
                .type("warning")
                .priority("medium")
                .isRead(false)
                .build());
        }
        
        // Kiểm tra examinations cần xử lý
        long pendingExams = examinationRepository.findAll().stream()
            .filter(exam -> exam.getExaminationStatus() == ExaminationStatus.SAMPLED)
            .count();
        
        if (pendingExams > 0) {
            notifications.add(SystemNotificationDTO.builder()
                .message(pendingExams + " examinations are waiting to be processed")
                .type("info")
                .priority("medium")
                .isRead(false)
                .build());
        }
        
        // Kiểm tra appointments cần confirm
        long pendingAppointments = appointmentRepository.findAll().stream()
            .filter(app -> app.getAppointmentStatus() == AppointmentStatus.BOOKED)
            .count();
        
        if (pendingAppointments > 0) {
            notifications.add(SystemNotificationDTO.builder()
                .message(pendingAppointments + " appointments are waiting for confirmation")
                .type("info")
                .priority("low")
                .isRead(false)
                .build());
        }
        
        // Thông báo hệ thống (có thể config từ admin)
        notifications.add(SystemNotificationDTO.builder()
            .message("System maintenance scheduled for tonight at 23:00")
            .type("error")
            .priority("high")
            .isRead(false)
            .build());
        
        return notifications;
    }
}
