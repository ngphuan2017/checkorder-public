package org.annp.checkorder.service;

import org.annp.checkorder.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

public interface OrderService {
    Order findById(int id);
    Order findOrderBySecretKey(String secretKey);
    boolean countBySecretKey(String secretKey);
    boolean saveOrder(Order order);
    Page<Order> findAllOrders(Pageable pageable);
    Page<Order> searchOrders(String searchTerm, Pageable pageable);
    Integer countByAccountId(int accountId);
    boolean deleteOrder(int id);
}
