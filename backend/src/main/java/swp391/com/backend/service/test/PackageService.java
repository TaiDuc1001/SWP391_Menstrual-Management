package swp391.com.backend.service.test;

import org.springframework.stereotype.Service;
import swp391.com.backend.repository.test.PackageRepository;

import java.util.List;

@Service
public class PackageService {
    private final PackageRepository packageRepository;

    public PackageService(PackageRepository packageRepository) {
        this.packageRepository = packageRepository;
    }

    public Package createPackage(Package aPackage) {
        return packageRepository.save(aPackage);
    }

    public List<Package> getAllPackages(){
        return packageRepository.findAll();
    }
}
