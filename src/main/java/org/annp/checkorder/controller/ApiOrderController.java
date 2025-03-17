package org.annp.checkorder.controller;

import org.annp.checkorder.dto.AccountResponseDto;
import org.annp.checkorder.dto.OrderRequestDto;
import org.annp.checkorder.dto.UserResponseDto;
import org.annp.checkorder.entity.Account;
import org.annp.checkorder.entity.MasterData;
import org.annp.checkorder.entity.Order;
import org.annp.checkorder.entity.Role;
import org.annp.checkorder.entity.Status;
import org.annp.checkorder.entity.User;
import org.annp.checkorder.service.AccountService;
import org.annp.checkorder.service.MasterDataService;
import org.annp.checkorder.service.OrderService;
import org.annp.checkorder.service.RoleService;
import org.annp.checkorder.service.StatusService;
import org.annp.checkorder.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class ApiOrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private UserService userService;

    @Autowired
    private MasterDataService masterDataService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private StatusService statusService;

    @GetMapping("/api/orders")
    public ResponseEntity<?> getOrders(@RequestParam(defaultValue = "1") int page,
                                       @RequestParam(defaultValue = "25") int limit,
                                       @RequestParam(required = false) String search) {
        try {
            Pageable pageable = PageRequest.of(page - 1, limit);
            Page<Order> ordersPage;
            if (search != null && !search.isEmpty()) {
                // Tìm kiếm theo cả tên và mã bí mật
                ordersPage = orderService.searchOrders(search, pageable);
            } else {
                ordersPage = orderService.findAllOrders(pageable);
            }
            return new ResponseEntity<>(ordersPage, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/orders/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable(value = "orderId") int orderId) {
        try {
            Order order = orderService.findById(orderId);
            AccountResponseDto accountDto = new AccountResponseDto();
            if (order.getAccountId() != null) {
                Account account = accountService.findAccountById(order.getAccountId());
                accountDto = new AccountResponseDto(account);
            }
            User user = userService.findById(order.getUpdatedBy());
            UserResponseDto userDto = new UserResponseDto(user);
            MasterData masterData = new MasterData();
            if (order.getType() != null) {
                masterData = masterDataService.findMasterDataByCodeAndColumnName(order.getType(), "order_type");
            }
            Role role = roleService.findById(user.getRoleId());
            Status status = statusService.findStatusByStatusIdAndColumnName(order.getStatus(), "order_status");
            Map<String, Object> response = new HashMap<>();
            response.put("order", order);
            response.put("account", accountDto);
            response.put("user", userDto);
            response.put("masterData", masterData);
            response.put("role", role);
            response.put("status", status);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/api/orders/master-data")
    public ResponseEntity<?> getOrderById() {
        try {
            List<Account> accounts = accountService.findAll();
            List<AccountResponseDto> accountDtos = new ArrayList<>();
            Map<String, Object> countOrder = new HashMap<>();
            for (Account account : accounts) {
                Integer count = orderService.countByAccountId(account.getId());
                countOrder.put("count" + account.getId(), count);
                accountDtos.add(new AccountResponseDto(account));
            }
            List<MasterData> masterDatas = masterDataService.findMasterDataByColumnName("order_type");
            List<Role> roles = roleService.findAll();
            List<Status> status = statusService.findStatusByColumnName("order_status");
            Map<String, Object> response = new HashMap<>();
            response.put("accounts", accountDtos);
            response.put("masterData", masterDatas);
            response.put("role", roles);
            response.put("status", status);
            response.put("countOrder", countOrder);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/api/orders/add")
    public ResponseEntity<?> addOrder(@RequestBody OrderRequestDto o) {
        try {
            Order order = new Order();
            order.setName(o.getData().getName());
            order.setAccountId(o.getData().getAccountId());
            order.setStatus(o.getData().getStatus());
            order.setType(o.getData().getType());
            order.setSecretKey(o.getData().getSecretKey());
            order.setUpdatedBy(o.getData().getUserId());
            return orderService.saveOrder(order) ? new ResponseEntity<>(HttpStatus.OK)
                    : new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/api/orders/{orderId}")
    public ResponseEntity<?> updateOrder(@PathVariable(value = "orderId") int orderId,
                                         @RequestBody OrderRequestDto o) {
        try {
            Order order = orderService.findById(orderId);
            order.setName(o.getData().getName());
            order.setAccountId(o.getData().getAccountId());
            order.setStatus(o.getData().getStatus());
            order.setType(o.getData().getType());
            order.setSecretKey(o.getData().getSecretKey());
            order.setUpdatedBy(o.getData().getUserId());
            order.setSum2fa(o.getData().getSum2fa());
            order.setEndDate(o.getData().getEndDate());
            return orderService.saveOrder(order) ? new ResponseEntity<>(HttpStatus.OK)
                    : new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/api/orders/{orderId}")
    public ResponseEntity<?> deleteOrder(@PathVariable(value = "orderId") int orderId) {
        try {
            return orderService.deleteOrder(orderId) ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
                    : new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
