package service;

import org.springframework.stereotype.Service;
import repository.BloodUnitRepository;
import repository.DonationRepository;
import repository.DonorRepository;
import repository.IssueRecordRepository;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final DonorRepository donorRepository;
    private final DonationRepository donationRepository;
    private final BloodUnitRepository bloodUnitRepository;
    private final IssueRecordRepository issueRecordRepository;

    public DashboardService(
            DonorRepository donorRepository,
            DonationRepository donationRepository,
            BloodUnitRepository bloodUnitRepository,
            IssueRecordRepository issueRecordRepository) {

        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
        this.bloodUnitRepository = bloodUnitRepository;
        this.issueRecordRepository = issueRecordRepository;
    }

    public Map<String, Object> getDashboardSummary() {

        Map<String, Object> summary = new HashMap<>();

        summary.put("totalDonors", donorRepository.count());

        summary.put("totalDonations", donationRepository.count());

        summary.put("totalBloodUnits", bloodUnitRepository.count());

        summary.put("totalIssues", issueRecordRepository.count());

        summary.put(
                "availableBloodUnits",
                bloodUnitRepository
                        .findByStatus(enums.BloodUnitStatus.AVAILABLE)
                        .size()
        );

        summary.put(
                "expiredBloodUnits",
                bloodUnitRepository
                        .findAll()
                        .stream()
                        .filter(unit ->
                                unit.getExpiryDate().isBefore(LocalDate.now())
                        )
                        .count()
        );

        return summary;
    }
}