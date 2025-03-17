package org.annp.checkorder.service;

import org.annp.checkorder.entity.User;

public interface UserService {

    User findById(int id);

    User findByUsername(String username);
}
