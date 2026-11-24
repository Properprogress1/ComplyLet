package uk.co.complylet.organisations;

import java.util.List;
import java.util.UUID;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.co.complylet.identity.VerifiedIdentity;

@RestController
@RequestMapping("/api/v1")
class WorkspaceController {
    private final Workspaces workspaces;

    WorkspaceController(Workspaces workspaces) {
        this.workspaces = workspaces;
    }

    @GetMapping("/workspaces")
    List<Workspaces.Workspace> list(@AuthenticationPrincipal OidcUser user,
                                    @RequestParam(required = false) UUID after) {
        var actor = VerifiedIdentity.from(user);
        return workspaces.list(actor.issuer(), actor.subject(), after);
    }

    @PostMapping("/workspaces/{id}/selection")
    Workspaces.Workspace select(@AuthenticationPrincipal OidcUser user, @PathVariable UUID id) {
        var actor = VerifiedIdentity.from(user);
        return workspaces.select(actor.issuer(), actor.subject(), id);
    }
}
