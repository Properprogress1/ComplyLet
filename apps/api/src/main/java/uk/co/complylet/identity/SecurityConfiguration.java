package uk.co.complylet.identity;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestCustomizers;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy;
import org.springframework.security.web.header.writers.StaticHeadersWriter;

@Configuration(proxyBeanMethods = false)
class SecurityConfiguration {
    @Bean
    SecurityFilterChain security(HttpSecurity http, ClientRegistrationRepository clients,
                                 @Value("${APP_ORIGIN}") String origin) throws Exception {
        var requests = new DefaultOAuth2AuthorizationRequestResolver(clients, "/oauth2/authorization");
        requests.setAuthorizationRequestCustomizer(OAuth2AuthorizationRequestCustomizers.withPkce());

        var oidcLogout = new OidcClientInitiatedLogoutSuccessHandler(clients);
        oidcLogout.setPostLogoutRedirectUri(origin + "/");
        http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/oauth2/authorization/complylet",
                        "/login/oauth2/code/complylet").permitAll()
                .requestMatchers("/api/v1/**", "/v3/api-docs").authenticated()
                .anyRequest().denyAll())
            .oauth2Login(oidc -> oidc
                    .authorizationEndpoint(endpoint -> endpoint.authorizationRequestResolver(requests))
                    .defaultSuccessUrl(origin + "/", true)
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
