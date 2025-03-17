package org.annp.checkorder.service.impl;

import org.annp.checkorder.entity.Role;
import org.annp.checkorder.entity.User;
import org.annp.checkorder.repository.RoleRepository;
import org.annp.checkorder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user != null) {
            Role role = roleRepository.findById(user.getRoleId()).orElse(null);
            if (role != null) {
                List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority(role.getPermission()));
                return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
            }
        }
        throw new UsernameNotFoundException("Not found");
    }
}
