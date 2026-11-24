# ADR 0002 — Supported Spring stack

Use Java 21, Spring Boot 4.1 and Spring Modulith 2.1. Spring Boot 3.5 reached the end of open-source support in June 2026. Use Spring Boot’s managed JUnit Jupiter 6 runtime for compatibility with its Spring TestContext integration. This differs from the master specification’s JUnit 5 line item. Test source uses Jupiter’s standard annotations and assertions.

[Spring Boot 3.5 support notice](https://spring.io/blog/2026/06/25/spring-boot-3-5-16-available-now/) · [Spring Boot testing support](https://docs.spring.io/spring-boot/4.1/reference/testing/index.html)
