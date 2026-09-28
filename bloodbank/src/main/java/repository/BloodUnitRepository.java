package repository;

import entity.BloodUnit;
import enums.BloodGroup;
import enums.BloodUnitStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BloodUnitRepository extends JpaRepository<BloodUnit, Long> {

    Optional<BloodUnit> findByUnitCode(String unitCode);

    boolean existsByUnitCode(String unitCode);

    List<BloodUnit> findByBloodGroup(BloodGroup bloodGroup);

    List<BloodUnit> findByStatus(BloodUnitStatus status);
}