package org.annp.checkorder.service;

public interface TwoFaService {

    String get2faCode(String secret);
}
