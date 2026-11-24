package uk.co.complylet.identity;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sessions")
class BrowserSessionController {
    private final BrowserSessions sessions;

    BrowserSessionController(BrowserSessions sessions) {
        this.sessions = sessions;
    }

    @GetMapping
    List<BrowserSessions.Device> list(@AuthenticationPrincipal OidcUser user, HttpServletRequest request) {
        return sessions.list(VerifiedIdentity.from(user), request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    void revoke(@AuthenticationPrincipal OidcUser user, HttpServletRequest request, @PathVariable UUID id) {
        sessions.revoke(VerifiedIdentity.from(user), request, id);
    }
}
