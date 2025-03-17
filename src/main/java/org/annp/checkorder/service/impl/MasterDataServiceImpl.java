package org.annp.checkorder.service.impl;

import org.annp.checkorder.entity.MasterData;
import org.annp.checkorder.repository.MasterDataRepository;
import org.annp.checkorder.service.MasterDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MasterDataServiceImpl implements MasterDataService {

    @Autowired
    private MasterDataRepository masterDataRepository;

    @Override
    public MasterData findMasterDataByCodeAndColumnName(int code, String columnName) {
        return masterDataRepository.findMasterDataByCodeAndColumnName(code, columnName).orElse(null);
    }

    @Override
    public List<MasterData> findMasterDataByColumnName(String columnName) {
        return masterDataRepository.findMasterDataByColumnName(columnName);
    }
}
