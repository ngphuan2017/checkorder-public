package org.annp.checkorder.service;

import org.annp.checkorder.entity.MasterData;

import java.util.List;

public interface MasterDataService {

    MasterData findMasterDataByCodeAndColumnName(int code, String columnName);

    List<MasterData> findMasterDataByColumnName(String columnName);
}
