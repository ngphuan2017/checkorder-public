package org.annp.checkorder.service.impl;

import org.annp.checkorder.entity.Role;
import org.annp.checkorder.repository.RoleRepository;
import org.annp.checkorder.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public Role findById(int roleId) {
        return roleRepository.findById(roleId).orElse(null);
    }

    @Override
    public List<Role> findAll() {
        return roleRepository.findAll();
    }
}
