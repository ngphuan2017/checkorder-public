package org.annp.checkorder.service.impl;

import org.annp.checkorder.entity.Account;
import org.annp.checkorder.repository.AccountRepository;
import org.annp.checkorder.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public Account findAccountById(Integer accountId) {
        return accountRepository.findAccountById(accountId).orElse(null);
    }

    @Override
    public List<Account> findAll() {
        return accountRepository.findAll();
    }
}
