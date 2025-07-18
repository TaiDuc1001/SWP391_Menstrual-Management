
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

    public static class DailyRevenue {
        public String date; // yyyy-MM-dd
        public double revenue;
        public DailyRevenue(String date, double revenue) {
            this.date = date;
            this.revenue = revenue;
        }
    }
    public static class DailyAppointmentCount {
        public String date;
        public long count;
        public DailyAppointmentCount(String date, long count) {
            this.date = date;
            this.count = count;
        }
    }
    public static class DailyUserGrowth {
        public String date;
        public long newUsers;
        public DailyUserGrowth(String date, long newUsers) {
            this.date = date;
            this.newUsers = newUsers;
        }
    }

    public List<DailyRevenue> getDailyRevenue(java.time.LocalDate from, java.time.LocalDate to) {
        List<DailyRevenue> result = new ArrayList<>();
        java.time.LocalDate date = from;
        while (!date.isAfter(to)) {
            final java.time.LocalDate currentDate = date;
            double revenue = examinationRepository.findAll().stream()
                .filter(exam -> exam.getPanel() != null && exam.getPanel().getPrice() != null)
                .filter(exam -> exam.getExaminationStatus() == ExaminationStatus.COMPLETED ||
                                exam.getExaminationStatus() == ExaminationStatus.EXAMINED)
                .filter(exam -> exam.getDate() != null && exam.getDate().isEqual(currentDate))
                .mapToDouble(exam -> exam.getPanel().getPrice().doubleValue())
                .sum();
            revenue += appointmentRepository.findAll().stream()
                .filter(app -> app.getAppointmentStatus() == AppointmentStatus.FINISHED)
                .filter(app -> app.getDoctor() != null && app.getDoctor().getPrice() != null)
                .filter(app -> app.getDate() != null && app.getDate().isEqual(currentDate))
                .mapToDouble(app -> app.getDoctor().getPrice().doubleValue())
                .sum();
            result.add(new DailyRevenue(currentDate.toString(), revenue));
            date = date.plusDays(1);
        }
        return result;
    }

    public List<DailyAppointmentCount> getDailyAppointments(java.time.LocalDate from, java.time.LocalDate to) {
        List<DailyAppointmentCount> result = new ArrayList<>();
        java.time.LocalDate date = from;
        while (!date.isAfter(to)) {
            final java.time.LocalDate currentDate = date;
            long count = appointmentRepository.findAll().stream()
                .filter(app -> app.getDate() != null && app.getDate().isEqual(currentDate))
                .count();
            result.add(new DailyAppointmentCount(currentDate.toString(), count));
            date = date.plusDays(1);
        }
        return result;
    }

    public List<DailyUserGrowth> getDailyUserGrowth(java.time.LocalDate from, java.time.LocalDate to) {
        List<DailyUserGrowth> result = new ArrayList<>();
        java.time.LocalDate date = from;
        while (!date.isAfter(to)) {
            final java.time.LocalDate currentDate = date;
            long newUsers = accountRepository.findAll().stream()
                .filter(acc -> acc.getCreatedAt() != null && acc.getCreatedAt().toLocalDate().isEqual(currentDate))
                .count();
            result.add(new DailyUserGrowth(currentDate.toString(), newUsers));
            date = date.plusDays(1);
        }
        return result;
    }

    public java.util.List<MonthlyRevenue> getMonthlyRevenue(int year) {
        java.util.Map<Integer, Double> revenueByMonth = new java.util.HashMap<>();

        for (int m = 1; m <= 12; m++) revenueByMonth.put(m, 0.0);

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

        long totalAccounts = accountRepository.count();
        long totalBlogs = blogRepository.count();
        long totalAppointments = appointmentRepository.count();
        long totalExaminations = examinationRepository.count();

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

        List<UserGrowthDTO> userGrowthByMonth = new ArrayList<>();
        java.time.Year currentYear = java.time.Year.now();
        for (int m = 1; m <= 12; m++) {
            final int month = m;
            long newUsers = accountRepository.findAll().stream()
                .filter(acc -> acc.getCreatedAt() != null && acc.getCreatedAt().getYear() == currentYear.getValue() && acc.getCreatedAt().getMonthValue() == month)
                .count();
            userGrowthByMonth.add(new UserGrowthDTO(month, newUsers));
        }

        List<AppointmentCountDTO> appointmentsByMonth = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            final int month = m;
            long count = appointmentRepository.findAll().stream()
                .filter(app -> app.getDate() != null && app.getDate().getYear() == currentYear.getValue() && app.getDate().getMonthValue() == month)
                .count();
            appointmentsByMonth.add(new AppointmentCountDTO(month, count));
        }

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

    public List<RecentActivityDTO> getRecentActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();

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

        return activities.stream()
            .sorted(Comparator.comparing(RecentActivityDTO::getTimestamp).reversed())
            .limit(10)
            .collect(Collectors.toList());
    }

    public List<RecentActivityDTO> getAllActivities() {
        List<RecentActivityDTO> activities = new ArrayList<>();

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

        return activities.stream()
            .sorted(Comparator.comparing(RecentActivityDTO::getTimestamp).reversed())
            .collect(Collectors.toList());
    }

    public List<SystemNotificationDTO> getSystemNotifications() {
        List<SystemNotificationDTO> notifications = new ArrayList<>();

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

    private final Map<String, Boolean> notificationReadStatus = new HashMap<>();

    public void markNotificationAsRead(String id) {
        notificationReadStatus.put(id, true);
    }

    public void markAllNotificationsAsRead() {
        List<SystemNotificationDTO> notifications = getSystemNotifications();
        for (SystemNotificationDTO notification : notifications) {
            notificationReadStatus.put(notification.getId(), true);
        }
    }
}

