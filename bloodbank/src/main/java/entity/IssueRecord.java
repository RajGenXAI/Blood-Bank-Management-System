package entity;

import enums.IssueStatus;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "issue_records")
public class IssueRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "blood_unit_id", nullable = false)
    private BloodUnit bloodUnit;

    @Column(nullable = false)
    private String recipientName;

    @Column(nullable = false)
    private String hospitalName;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssueStatus status;

    public IssueRecord() {
    }

    public IssueRecord(BloodUnit bloodUnit,
                       String recipientName,
                       String hospitalName,
                       LocalDate issueDate,
                       IssueStatus status) {
        this.bloodUnit = bloodUnit;
        this.recipientName = recipientName;
        this.hospitalName = hospitalName;
        this.issueDate = issueDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public BloodUnit getBloodUnit() {
        return bloodUnit;
    }

    public void setBloodUnit(BloodUnit bloodUnit) {
        this.bloodUnit = bloodUnit;
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