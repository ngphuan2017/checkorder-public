package org.annp.checkorder.service;

import org.annp.checkorder.entity.Status;

import java.util.List;

public interface StatusService {

    Status findStatusByStatusIdAndColumnName(int statusId, String columnName);

    List<Status> findStatusByColumnName(String columnName);
}
