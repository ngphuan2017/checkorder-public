package org.annp.checkorder.service.impl;

import org.annp.checkorder.entity.Order;
import org.annp.checkorder.repository.OrderRepository;
import org.annp.checkorder.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Order findById(int id) {
        return orderRepository.findById(id).orElse(null);
    }

    @Override
    public Order findOrderBySecretKey(String secretKey) {
        return orderRepository.findOrderBySecretKey(secretKey).orElse(null);
    }

    @Override
    public boolean countBySecretKey(String secretKey) {
        return orderRepository.countBySecretKey(secretKey) > 0;
    }

    @Override
    public boolean saveOrder(Order order) {
        try {
            orderRepository.save(order);  // Lưu hoặc cập nhật Order
            return true;  // Thành công
        } catch (Exception ex) {
            ex.printStackTrace();  // In lỗi nếu có vấn đề
            return false;  // Thất bại
        }
    }

    @Override
    public Page<Order> findAllOrders(Pageable pageable) {
        return orderRepository.findAllOrders(pageable);
    }

    @Override
    public Page<Order> searchOrders(String searchTerm, Pageable pageable) {
        return orderRepository.searchOrders(searchTerm, pageable);
    }

    @Override
    public Integer countByAccountId(int accountId) {
        return orderRepository.countByAccountId(accountId);
    }

    @Override
    public boolean deleteOrder(int id) {
        try {
            orderRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

}
