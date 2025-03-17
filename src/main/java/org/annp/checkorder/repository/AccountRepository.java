package org.annp.checkorder.repository;

import org.annp.checkorder.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query("SELECT a FROM Account a WHERE a.id = :accountId")
    Optional<Account> findAccountById(@Param("accountId") Integer accountId);

    @Override
    List<Account> findAll();
}
