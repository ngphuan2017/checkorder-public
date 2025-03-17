package org.annp.checkorder.repository;

import org.annp.checkorder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional
public interface UserRepository extends JpaRepository<User, Integer>{

    @Override
    Optional<User> findById(Integer integer);

    Optional<User> findByUsername(String username);
}
