package swp391.com.backend.controller.test;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import swp391.com.backend.pojo.test.Package;
import swp391.com.backend.service.test.PackageService;

import java.util.List;

@RestController
public class PackageController {
    private final PackageService packageService;

    public PackageController(PackageService packageService) {
        this.packageService = packageService;
    }

    @GetMapping("/api/packages")
    public ResponseEntity<List<Package>> getAllPackages(){
        return ResponseEntity.ok(packageService.getAllPackages());
    }
}
