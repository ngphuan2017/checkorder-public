package org.annp.checkorder.service;

import org.annp.checkorder.entity.Role;

import java.util.List;

public interface RoleService {
    Role findById(int roleId);

    List<Role> findAll();
}
