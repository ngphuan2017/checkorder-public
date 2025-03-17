package org.annp.checkorder.repository;

import org.annp.checkorder.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
@Transactional
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Override
    Optional<Order> findById(Integer integer);

    @Query("SELECT o FROM Order o WHERE o.secretKey = :secretKey")
    Optional<Order> findOrderBySecretKey(@Param("secretKey") String secretKey);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.secretKey = :secretKey")
    Integer countBySecretKey(@Param("secretKey") String secretKey);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.accountId = :accountId")
    Integer countByAccountId(@Param("accountId") Integer accountId);

    // Thay đổi cách phân trang để tương thích nhiều DB hơn
    @Query("SELECT o FROM Order o ORDER BY o.id DESC")
    Page<Order> findAllOrders(Pageable pageable);

    // Thêm phương thức tìm kiếm với phân trang
    @Query("SELECT o FROM Order o WHERE LOWER(o.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(o.secretKey) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY o.id DESC")
    Page<Order> searchOrders(@Param("searchTerm") String searchTerm, Pageable pageable);
}
