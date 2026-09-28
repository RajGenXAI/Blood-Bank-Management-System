package service;

import dto.IssueRecordRequest;
import entity.BloodUnit;
import entity.IssueRecord;
import enums.BloodUnitStatus;
import enums.IssueStatus;
import exception.BadRequestException;
import exception.ResourceNotFoundException;
import repository.BloodUnitRepository;
import repository.IssueRecordRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class IssueRecordService {

    private final IssueRecordRepository issueRecordRepository;
    private final BloodUnitRepository bloodUnitRepository;
    private final BloodUnitService bloodUnitService;

    public IssueRecordService(
            IssueRecordRepository issueRecordRepository,
            BloodUnitRepository bloodUnitRepository,
            BloodUnitService bloodUnitService) {

        this.issueRecordRepository = issueRecordRepository;
        this.bloodUnitRepository = bloodUnitRepository;
        this.bloodUnitService = bloodUnitService;
    }

    public IssueRecord createIssue(IssueRecordRequest request) {

        BloodUnit bloodUnit = bloodUnitRepository.findById(
                request.getBloodUnitId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Blood unit not found with id: "
                                + request.getBloodUnitId()
                )
        );

        validateBloodUnitForIssue(bloodUnit);

        IssueRecord issueRecord = new IssueRecord();

        issueRecord.setBloodUnit(bloodUnit);
        issueRecord.setRecipientName(request.getRecipientName());
        issueRecord.setHospitalName(request.getHospitalName());
        issueRecord.setIssueDate(request.getIssueDate());
        issueRecord.setStatus(IssueStatus.ISSUED);

        bloodUnit.setStatus(BloodUnitStatus.ISSUED);
        bloodUnitRepository.save(bloodUnit);

        return issueRecordRepository.save(issueRecord);
    }

    public List<IssueRecord> getAllIssues() {
        return issueRecordRepository.findAll();
    }

    public IssueRecord getIssueById(Long id) {

        return issueRecordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Issue record not found with id: " + id
                        )
                );
    }

    public List<IssueRecord> getIssuesByStatus(
            IssueStatus status) {

        return issueRecordRepository.findByStatus(status);
    }

    public List<IssueRecord> getIssuesByBloodUnit(
            Long bloodUnitId) {

        if (!bloodUnitRepository.existsById(bloodUnitId)) {
            throw new ResourceNotFoundException(
                    "Blood unit not found with id: " + bloodUnitId
            );
        }

        return issueRecordRepository.findByBloodUnitId(bloodUnitId);
    }

    public void deleteIssue(Long id) {

        IssueRecord issueRecord = getIssueById(id);

        issueRecordRepository.delete(issueRecord);
    }

    private void validateBloodUnitForIssue(
            BloodUnit bloodUnit) {

        if (bloodUnit.getStatus() == BloodUnitStatus.ISSUED) {
            throw new BadRequestException(
                    "This blood unit has already been issued."
            );
        }

        if (bloodUnit.getStatus() == BloodUnitStatus.RESERVED) {
            throw new BadRequestException(
                    "This blood unit is currently reserved."
            );
        }

        if (bloodUnit.getExpiryDate().isBefore(LocalDate.now())) {

            bloodUnit.setStatus(BloodUnitStatus.EXPIRED);
            bloodUnitRepository.save(bloodUnit);

            throw new BadRequestException(
                    "This blood unit has expired and cannot be issued."
            );
        }

        if (bloodUnitService.isNearExpiry(bloodUnit)) {
            throw new BadRequestException(
                    "This blood unit is near expiry and cannot be issued."
            );
        }

        if (bloodUnit.getStatus() != BloodUnitStatus.AVAILABLE) {
            throw new BadRequestException(
                    "This blood unit is not available for issue."
            );
        }
    }
}