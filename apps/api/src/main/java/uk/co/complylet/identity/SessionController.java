package uk.co.complylet.identity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
class SessionController {
    record Session(String csrfToken, String csrfHeader) {
        @Override
        public String toString() {
            return "Session[csrfHeader=" + csrfHeader + "]";
        }
    }

    @GetMapping("/api/v1/session")
    Session session(@AuthenticationPrincipal OidcUser user, CsrfToken csrf) {
        VerifiedIdentity.from(user);
        return new Session(csrf.getToken(), csrf.getHeaderName());
    }
}
