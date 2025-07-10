package swp391.com.backend.feature.dashboard.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    // Endpoint for monthly revenue chart
    @GetMapping("/monthly-revenue")
    public ResponseEntity<java.util.List<AdminDashboardService.MonthlyRevenue>> getMonthlyRevenue(@RequestParam int year) {
        return ResponseEntity.ok(adminDashboardService.getMonthlyRevenue(year));
    }

    // Endpoint for service distribution chart
    @GetMapping("/service-distribution")
    public ResponseEntity<java.util.List<AdminDashboardService.ServiceDistribution>> getServiceDistribution() {
        return ResponseEntity.ok(adminDashboardService.getServiceDistribution());
    }

    // Endpoint for recent activities
    @GetMapping("/recent-activities")
    public ResponseEntity<List<RecentActivityDTO>> getRecentActivities() {
        return ResponseEntity.ok(adminDashboardService.getRecentActivities());
    }

    // Endpoint for all activities 
    @GetMapping("/all-activities")
    public ResponseEntity<List<RecentActivityDTO>> getAllActivities() {
        return ResponseEntity.ok(adminDashboardService.getAllActivities());
    }

    // Endpoint for system notifications
    @GetMapping("/notifications")
    public ResponseEntity<List<SystemNotificationDTO>> getSystemNotifications() {
        return ResponseEntity.ok(adminDashboardService.getSystemNotifications());
    }
}
