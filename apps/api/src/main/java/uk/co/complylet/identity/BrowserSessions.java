package uk.co.complylet.identity;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSessionBindingEvent;
import jakarta.servlet.http.HttpSessionBindingListener;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
class BrowserSessions {
    private static final String ATTRIBUTE = BrowserSessions.class.getName();
    private static final Logger LOG = LoggerFactory.getLogger(BrowserSessions.class);
    private final ConcurrentMap<VerifiedIdentity, ConcurrentMap<UUID, Entry>> sessions = new ConcurrentHashMap<>();

    record Device(UUID id, String browser, Instant signedInAt, boolean current) {}

    void register(HttpServletRequest request, OidcUser user) {
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            request.getSession().removeAttribute(ATTRIBUTE);
            return;
        }
        var actor = VerifiedIdentity.from(user);
        var entry = new Entry(actor, browser(request.getHeader("User-Agent")));
        request.getSession().setAttribute(ATTRIBUTE, entry);
    }

    boolean revoked(HttpServletRequest request) {
        var entry = current(request);
        return entry != null && entry.revoked;
    }

    List<Device> list(VerifiedIdentity actor, HttpServletRequest request) {
        var own = sessions.get(actor);
        if (own == null) {
            return List.of();
        }
        var current = current(request);
        return own.values().stream()
                .filter(entry -> !entry.revoked)
                .sorted(Comparator.comparing((Entry entry) -> entry.signedInAt).reversed()
                        .thenComparing(entry -> entry.id))
                .map(entry -> new Device(entry.id, entry.browser, entry.signedInAt, entry == current))
                .toList();
    }

    void revoke(VerifiedIdentity actor, HttpServletRequest request, UUID id) {
        var current = current(request);
        var own = sessions.get(actor);
        var entry = own == null ? null : own.get(id);
        if (entry == null || current == null || entry == current || !current.actor.equals(actor) || !entry.revoke()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Session unavailable");
        }

        LOG.info("Browser session revoked, acting session={}, revoked session={}", current.id, entry.id);
    }

    private static Entry current(HttpServletRequest request) {
        var session = request.getSession(false);
        return session == null ? null : (Entry) session.getAttribute(ATTRIBUTE);
    }

    private static String browser(String userAgent) {
        if (userAgent == null) return "Unknown browser";
        var agent = userAgent.toLowerCase(Locale.ROOT);
        if (agent.contains("edg/") || agent.contains("edga/") || agent.contains("edgios/")) return "Edge";
        if (agent.contains("firefox/") || agent.contains("fxios/")) return "Firefox";
        if (agent.contains("chrome/") || agent.contains("crios/")) return "Chrome";
        if (agent.contains("safari/")) return "Safari";
        return "Unknown browser";
    }

    private final class Entry implements HttpSessionBindingListener {
        private final UUID id = UUID.randomUUID();
        private final VerifiedIdentity actor;
        private final String browser;
        private final Instant signedInAt = Instant.now();
        private volatile boolean revoked;

        private Entry(VerifiedIdentity actor, String browser) {
            this.actor = actor;
            this.browser = browser;
        }

        private synchronized boolean revoke() {
            if (revoked) return false;
            revoked = true;
            return true;
        }

        @Override
        public void valueBound(HttpSessionBindingEvent event) {
            sessions.compute(actor, (key, entries) -> {
                var own = entries == null ? new ConcurrentHashMap<UUID, Entry>() : entries;
                own.put(id, this);
                return own;
            });
        }

        @Override
        public void valueUnbound(HttpSessionBindingEvent event) {
            sessions.computeIfPresent(actor, (key, own) -> {
                own.remove(id);
                return own.isEmpty() ? null : own;
            });
        }
    }
}
