package controller;

import dto.IssueRecordRequest;
import entity.IssueRecord;
import enums.IssueStatus;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.IssueRecordService;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
public class IssueRecordController {

    private final IssueRecordService issueRecordService;

    public IssueRecordController(IssueRecordService issueRecordService) {
        this.issueRecordService = issueRecordService;
    }

    @PostMapping
    public ResponseEntity<IssueRecord> createIssue(
            @Valid @RequestBody IssueRecordRequest request) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(issueRecordService.createIssue(request));
    }

    @GetMapping
    public ResponseEntity<List<IssueRecord>> getAllIssues() {
        return ResponseEntity.ok(
                issueRecordService.getAllIssues()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<IssueRecord> getIssueById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                issueRecordService.getIssueById(id)
        );
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<IssueRecord>> getIssuesByStatus(
            @PathVariable IssueStatus status) {

        return ResponseEntity.ok(
                issueRecordService.getIssuesByStatus(status)
        );
    }

    @GetMapping("/blood-unit/{bloodUnitId}")
    public ResponseEntity<List<IssueRecord>> getIssuesByBloodUnit(
            @PathVariable Long bloodUnitId) {

        return ResponseEntity.ok(
                issueRecordService.getIssuesByBloodUnit(bloodUnitId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable Long id) {

        issueRecordService.deleteIssue(id);

        return ResponseEntity.noContent().build();
    }
}