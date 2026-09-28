package repository;

import entity.Donor;
import enums.BloodGroup;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DonorRepository extends JpaRepository<Donor, Long> {

    Optional<Donor> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Donor> findByBloodGroup(BloodGroup bloodGroup);
}