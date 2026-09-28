package service;

import dto.BloodUnitRequest;
import entity.BloodUnit;
import enums.BloodUnitStatus;
import exception.BadRequestException;
import exception.ResourceNotFoundException;
import repository.BloodUnitRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BloodUnitService {

    private static final long NEAR_EXPIRY_DAYS = 3;

    private final BloodUnitRepository bloodUnitRepository;

    public BloodUnitService(BloodUnitRepository bloodUnitRepository) {
        this.bloodUnitRepository = bloodUnitRepository;
    }

    public BloodUnit createBloodUnit(BloodUnitRequest request) {

        if (bloodUnitRepository.existsByUnitCode(request.getUnitCode())) {
            throw new BadRequestException(
                    "A blood unit with this unit code already exists."
            );
        }

        if (request.getExpiryDate().isBefore(request.getCollectionDate())) {
            throw new BadRequestException(
                    "Expiry date cannot be before collection date."
            );
        }

        BloodUnit bloodUnit = new BloodUnit();

        bloodUnit.setUnitCode(request.getUnitCode());
        bloodUnit.setBloodGroup(request.getBloodGroup());
        bloodUnit.setCollectionDate(request.getCollectionDate());
        bloodUnit.setExpiryDate(request.getExpiryDate());

        bloodUnit.setStatus(
                calculateStatus(
                        request.getExpiryDate(),
                        request.getStatus()
                )
        );

        return bloodUnitRepository.save(bloodUnit);
    }

    public List<BloodUnit> getAllBloodUnits() {

        List<BloodUnit> units = bloodUnitRepository.findAll();

        units.forEach(this::updateExpiryStatus);

        return bloodUnitRepository.saveAll(units);
    }

    public BloodUnit getBloodUnitById(Long id) {

        BloodUnit bloodUnit = bloodUnitRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Blood unit not found with id: " + id
                        )
                );

        updateExpiryStatus(bloodUnit);

        return bloodUnitRepository.save(bloodUnit);
    }

    public BloodUnit updateBloodUnit(
            Long id,
            BloodUnitRequest request) {

        BloodUnit bloodUnit = getBloodUnitById(id);

        if (!bloodUnit.getUnitCode().equals(request.getUnitCode())
                && bloodUnitRepository.existsByUnitCode(request.getUnitCode())) {

            throw new BadRequestException(
                    "A blood unit with this unit code already exists."
            );
        }

        if (request.getExpiryDate().isBefore(request.getCollectionDate())) {
            throw new BadRequestException(
                    "Expiry date cannot be before collection date."
            );
        }

        bloodUnit.setUnitCode(request.getUnitCode());
        bloodUnit.setBloodGroup(request.getBloodGroup());
        bloodUnit.setCollectionDate(request.getCollectionDate());
        bloodUnit.setExpiryDate(request.getExpiryDate());

        bloodUnit.setStatus(
                calculateStatus(
                        request.getExpiryDate(),
                        request.getStatus()
                )
        );

        return bloodUnitRepository.save(bloodUnit);
    }

    public void deleteBloodUnit(Long id) {

        BloodUnit bloodUnit = getBloodUnitById(id);

        bloodUnitRepository.delete(bloodUnit);
    }

    public List<BloodUnit> getAvailableUnits() {

        List<BloodUnit> units =
                bloodUnitRepository.findByStatus(
                        BloodUnitStatus.AVAILABLE
                );

        units.forEach(this::updateExpiryStatus);

        return units.stream()
                .filter(unit ->
                        unit.getStatus() == BloodUnitStatus.AVAILABLE
                )
                .toList();
    }

    private BloodUnitStatus calculateStatus(
            LocalDate expiryDate,
            BloodUnitStatus requestedStatus) {

        LocalDate today = LocalDate.now();

        if (expiryDate.isBefore(today)) {
            return BloodUnitStatus.EXPIRED;
        }

        if (requestedStatus == BloodUnitStatus.ISSUED
                || requestedStatus == BloodUnitStatus.RESERVED) {
            return requestedStatus;
        }

        return BloodUnitStatus.AVAILABLE;
    }

    private void updateExpiryStatus(BloodUnit bloodUnit) {

        LocalDate today = LocalDate.now();

        if (bloodUnit.getExpiryDate().isBefore(today)
                && bloodUnit.getStatus() != BloodUnitStatus.ISSUED) {

            bloodUnit.setStatus(BloodUnitStatus.EXPIRED);
        }
    }

    public boolean isNearExpiry(BloodUnit bloodUnit) {

        LocalDate today = LocalDate.now();

        LocalDate nearExpiryDate =
                today.plusDays(NEAR_EXPIRY_DAYS);

        return !bloodUnit.getExpiryDate().isBefore(today)
                && !bloodUnit.getExpiryDate().isAfter(nearExpiryDate);
    }
}