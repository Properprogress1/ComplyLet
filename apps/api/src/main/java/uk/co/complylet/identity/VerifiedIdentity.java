package uk.co.complylet.identity;

import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.server.ResponseStatusException;

public record VerifiedIdentity(String issuer, String subject) {
    public static VerifiedIdentity from(OidcUser user) {
        if (user == null || !Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Verified email required");
        }
        return new VerifiedIdentity(user.getIssuer().toString(), user.getSubject());
    }
}
