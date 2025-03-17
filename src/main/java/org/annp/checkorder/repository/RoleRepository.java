package org.annp.checkorder.repository;

import org.annp.checkorder.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public interface RoleRepository extends JpaRepository<Role, Integer> {

    @Override
    Optional<Role> findById(Integer integer);

    @Override
    List<Role> findAll();
}
