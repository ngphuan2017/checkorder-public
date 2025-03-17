package org.annp.checkorder.repository;

import org.annp.checkorder.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface StatusRepository extends JpaRepository<Status, Integer> {

    @Query("SELECT s FROM Status s WHERE s.statusId = :statusId AND s.columnName = :columnName")
    Optional<Status> findStatusByStatusIdAndColumnName(@Param("statusId") Integer statusId, @Param("columnName") String columnName);

    @Query("SELECT s FROM Status s WHERE s.columnName = :columnName")
    List<Status> findStatusByColumnName(@Param("columnName") String columnName);
}
