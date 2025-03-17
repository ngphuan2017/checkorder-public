package org.annp.checkorder.service;

import org.annp.checkorder.entity.Account;

import java.util.List;

public interface AccountService {

    Account findAccountById(Integer accountId);

    List<Account> findAll();
}
