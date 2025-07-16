package swp391.com.backend.feature.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.feature.dashboard.dto.AdminDashboardDTO;
import swp391.com.backend.feature.dashboard.dto.RecentActivityDTO;
import swp391.com.backend.feature.dashboard.dto.SystemNotificationDTO;
import swp391.com.backend.feature.dashboard.service.AdminDashboardService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<AdminDashboardDTO> getDashboardData() {
        return ResponseEntity.ok(adminDashboardService.getDashboardData());
    }

    @GetMapping("/monthly-revenue")
    public ResponseEntity<java.util.List<AdminDashboardService.MonthlyRevenue>> getMonthlyRevenue(@RequestParam int year) {
        return ResponseEntity.ok(adminDashboardService.getMonthlyRevenue(year));
    }

    @GetMapping("/service-distribution")
    public ResponseEntity<java.util.List<AdminDashboardService.ServiceDistribution>> getServiceDistribution() {
        return ResponseEntity.ok(adminDashboardService.getServiceDistribution());
    }

    @GetMapping("/recent-activities")
    public ResponseEntity<List<RecentActivityDTO>> getRecentActivities() {
        return ResponseEntity.ok(adminDashboardService.getRecentActivities());
    }

    @GetMapping("/all-activities")
    public ResponseEntity<List<RecentActivityDTO>> getAllActivities() {
        return ResponseEntity.ok(adminDashboardService.getAllActivities());
    }

    @GetMapping("/notifications")
    public ResponseEntity<List<SystemNotificationDTO>> getSystemNotifications() {
        return ResponseEntity.ok(adminDashboardService.getSystemNotifications());
    }

    @GetMapping("/notifications/{id}/mark-read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable String id) {
        adminDashboardService.markNotificationAsRead(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/notifications/mark-all-read")
    public ResponseEntity<Void> markAllNotificationsAsRead() {
        adminDashboardService.markAllNotificationsAsRead();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/daily-revenue")
    public ResponseEntity<java.util.List<AdminDashboardService.DailyRevenue>> getDailyRevenue(
        @RequestParam String startDate,
        @RequestParam String endDate
    ) {
        java.time.LocalDate fromDate = java.time.LocalDate.parse(startDate);
        java.time.LocalDate toDate = java.time.LocalDate.parse(endDate);
        return ResponseEntity.ok(adminDashboardService.getDailyRevenue(fromDate, toDate));
    }

    @GetMapping("/daily-appointments")
    public ResponseEntity<java.util.List<AdminDashboardService.DailyAppointmentCount>> getDailyAppointments(
        @RequestParam String startDate,
        @RequestParam String endDate
    ) {
        java.time.LocalDate fromDate = java.time.LocalDate.parse(startDate);
        java.time.LocalDate toDate = java.time.LocalDate.parse(endDate);
        return ResponseEntity.ok(adminDashboardService.getDailyAppointments(fromDate, toDate));
    }

    @GetMapping("/daily-user-growth")
    public ResponseEntity<java.util.List<AdminDashboardService.DailyUserGrowth>> getDailyUserGrowth(
        @RequestParam String startDate,
        @RequestParam String endDate
    ) {
        java.time.LocalDate fromDate = java.time.LocalDate.parse(startDate);
        java.time.LocalDate toDate = java.time.LocalDate.parse(endDate);
        return ResponseEntity.ok(adminDashboardService.getDailyUserGrowth(fromDate, toDate));
    }
}

