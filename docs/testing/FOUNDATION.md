# Foundation verification

`make test` runs the Spring Modulith architecture check, MockMvc requests against PostgreSQL, database grants and isolation checks, React tests and strict TypeScript plus Vite production build. Testcontainers supplies PostgreSQL by default. The disposable native PostgreSQL alternative is documented in the README. The HTTP integration suite supplies synthetic verified identities through Spring Security’s test support. Playwright separately drives the genuine local Keycloak session and tries a foreign workspace ID and a request missing CSRF. A multi-browser scenario checks session visibility, foreign and unknown target equivalence, self-revocation rejection, CSRF, and rejection of a revoked browser on a protected workspace route.

The workspace browser test also checks keyboard navigation and skip-link focus, 320 CSS-pixel reflow, and axe WCAG A/AA rules on the sign-in, selected workspace and dark-mode account views. These checks are part of the existing Playwright command.

Use the bundled Chromium on supported development hosts. To run with an existing Chrome executable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. CI installs bundled Chromium.

Future business modules must cover cross-tenant reads, creates, updates, deletes, inference and exports at their normal entry points. Add negative tests for role, branch and assigned-resource scope. Verify legal rule boundaries against approved test cases as those modules land.
