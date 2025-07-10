package swp391.com.backend.feature.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import swp391.com.backend.feature.account.data.AccountRepository;
import swp391.com.backend.feature.appointment.data.AppointmentRepository;
import swp391.com.backend.feature.appointment.data.AppointmentStatus;
import swp391.com.backend.feature.blog.data.BlogRepository;
import swp391.com.backend.feature.dashboard.dto.AdminDashboardDTO;
import swp391.com.backend.feature.examination.data.ExaminationRepository;
import swp391.com.backend.feature.examination.data.ExaminationStatus;
import swp391.com.backend.feature.panel.data.PanelRepository;

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
    private final PanelRepository panelRepository;

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
}
