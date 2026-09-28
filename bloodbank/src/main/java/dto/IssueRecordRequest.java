package dto;

import enums.IssueStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class IssueRecordRequest {

    @NotNull(message = "Blood unit ID is required")
    private Long bloodUnitId;

    @NotBlank(message = "Recipient name is required")
    private String recipientName;

    @NotBlank(message = "Hospital name is required")
    private String hospitalName;

    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;

    @NotNull(message = "Issue status is required")
    private IssueStatus status;

    public IssueRecordRequest() {
    }

    public Long getBloodUnitId() {
        return bloodUnitId;
    }

    public void setBloodUnitId(Long bloodUnitId) {
        this.bloodUnitId = bloodUnitId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public IssueStatus getStatus() {
        return status;
    }

    public void setStatus(IssueStatus status) {
        this.status = status;
    }
}