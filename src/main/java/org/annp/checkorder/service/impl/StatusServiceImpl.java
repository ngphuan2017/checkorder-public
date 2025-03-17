package org.annp.checkorder.service.impl;

import org.annp.checkorder.entity.Status;
import org.annp.checkorder.repository.StatusRepository;
import org.annp.checkorder.service.StatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StatusServiceImpl implements StatusService {

    @Autowired
    private StatusRepository statusRepository;

    @Override
    public Status findStatusByStatusIdAndColumnName(int statusId, String columnName) {
        return statusRepository.findStatusByStatusIdAndColumnName(statusId, columnName).orElse(null);
    }

    @Override
    public List<Status> findStatusByColumnName(String columnName) {
        return statusRepository.findStatusByColumnName(columnName);
    }
}
