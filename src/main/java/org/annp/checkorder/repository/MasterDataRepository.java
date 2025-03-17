package org.annp.checkorder.repository;

import org.annp.checkorder.entity.MasterData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface MasterDataRepository extends JpaRepository<MasterData, Integer> {

    @Query("SELECT m FROM MasterData m WHERE m.code = :code AND m.columnName = :columnName")
    Optional<MasterData> findMasterDataByCodeAndColumnName(@Param("code") Integer code, @Param("columnName") String columnName);

    @Query("SELECT m FROM MasterData m WHERE m.columnName = :columnName")
    List<MasterData> findMasterDataByColumnName(@Param("columnName") String columnName);
}
