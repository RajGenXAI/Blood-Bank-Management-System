package repository;

import entity.IssueRecord;
import enums.IssueStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRecordRepository extends JpaRepository<IssueRecord, Long> {

    List<IssueRecord> findByStatus(IssueStatus status);

    List<IssueRecord> findByBloodUnitId(Long bloodUnitId);
}