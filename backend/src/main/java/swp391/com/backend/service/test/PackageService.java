package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.jpa.repository.test.PackageRepository;
import swp391.com.backend.jpa.pojo.test.Panel;

import java.util.List;

@Service
public class PackageService {
    private final PackageRepository packageRepository;

    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    public Panel createPackage(Panel aPanel) {
        return packageRepository.save(aPanel);
    }

    public List<Panel> getAllPackages(){
        return packageRepository.findAll();
    }

    public void deletePackageById(Integer id) {
        packageRepository.deleteById(id);
    }
}
