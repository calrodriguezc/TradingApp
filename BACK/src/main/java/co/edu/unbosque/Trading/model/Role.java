package co.edu.unbosque.Trading.model;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {

    ADMIN, INVESTOR, COMMISSION;

    @Override
    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}