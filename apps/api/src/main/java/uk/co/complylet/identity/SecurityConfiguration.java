package uk.co.complylet.identity;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

@Configuration(proxyBeanMethods = false)
class SecurityConfiguration {
    @Bean
    SecurityFilterChain security(HttpSecurity http, ClientRegistrationRepository clients, BrowserSessions sessions,
                                 @Value("${APP_ORIGIN}") String origin) throws Exception {
        var requests = new DefaultOAuth2AuthorizationRequestResolver(clients, "/oauth2/authorization");
        requests.setAuthorizationRequestCustomizer(OAuth2AuthorizationRequestCustomizers.withPkce());

        var oidcLogout = new OidcClientInitiatedLogoutSuccessHandler(clients);
        oidcLogout.setPostLogoutRedirectUri(origin + "/");
        var signIn = new SimpleUrlAuthenticationSuccessHandler(origin + "/");
        signIn.setAlwaysUseDefaultTargetUrl(true);
        var clearRevokedSession = new SecurityContextLogoutHandler();
        http.addFilterBefore(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain) throws ServletException, IOException {
                if (sessions.revoked(request)) {
                    clearRevokedSession.logout(request, response, null);
                }
                chain.doFilter(request, response);
            }
        }, CsrfFilter.class)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/oauth2/authorization/complylet",
                        "/login/oauth2/code/complylet").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/session", "/api/v1/sessions", "/api/v1/workspaces").authenticated()
                .requestMatchers(HttpMethod.HEAD, "/api/v1/session", "/api/v1/sessions", "/api/v1/workspaces").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/v1/sessions/{id}").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/v1/workspaces/{id}/selection").authenticated()
                .requestMatchers(HttpMethod.GET, "/v3/api-docs").access((authentication, context) ->
                        new AuthorizationDecision(authentication.get().getPrincipal() instanceof OidcUser user
                                && Boolean.TRUE.equals(user.getEmailVerified())))
                .anyRequest().denyAll())
            .oauth2Login(oidc -> oidc
                    .authorizationEndpoint(endpoint -> endpoint.authorizationRequestResolver(requests))
                    .successHandler((request, response, authentication) -> {
                        if (authentication.getPrincipal() instanceof OidcUser user) {
                            sessions.register(request, user);
                        }
                        signIn.onAuthenticationSuccess(request, response, authentication);
                    })
                    .failureUrl(origin + "/?login=failed"))
            .requestCache(cache -> cache.disable())
            .exceptionHandling(errors -> errors
                    .authenticationEntryPoint((request, response, exception) ->
                            writeProblem(response, HttpStatus.UNAUTHORIZED))
                    .accessDeniedHandler((request, response, exception) ->
                            writeProblem(response, HttpStatus.FORBIDDEN)))
            .logout(logout -> logout.deleteCookies("COMPLYLET_SESSION")
                    .logoutSuccessHandler(oidcLogout))
            .headers(headers -> headers
                    .contentSecurityPolicy(csp -> csp.policyDirectives(
                            "default-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'"))
                    .referrerPolicy(referrer -> referrer.policy(ReferrerPolicy.NO_REFERRER))
                    .addHeaderWriter(new StaticHeadersWriter("Permissions-Policy",
                            "camera=(), microphone=(), geolocation=()")));
        return http.build();
    }

    private static void writeProblem(HttpServletResponse response, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType("application/problem+json");
        response.getWriter().write("""
                {"type":"about:blank","title":"%s","status":%d}
                """.formatted(status.getReasonPhrase(), status.value()));
    }
}
