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
        
        // Get total test services from Panel repository (no default values)
        long totalTestServices = panelRepository.count();
        
        // Calculate total revenue from ALL completed transactions (not just current month)
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
        
        // Calculate growth rate based on actual data (could be improved with historical comparison)
        double growthRate = 0.0; // Set to 0 until we have historical data to compare
        
        return AdminDashboardDTO.builder()
                .totalAccounts(totalAccounts)
                .totalBlogs(totalBlogs)
                .totalAppointments(totalAppointments)
                .totalTestServices(totalTestServices)
                .totalRevenue(totalRevenue)
                .growthRate(growthRate)
                .build();
    }
}
