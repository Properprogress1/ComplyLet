ARG API_BASE_IMAGE
FROM ${API_BASE_IMAGE}
WORKDIR /app
COPY --chown=65532:65532 apps/api/target/complylet-api-0.1.0-SNAPSHOT.jar /app/application.jar
USER 65532:65532
ENTRYPOINT ["java", "-jar", "/app/application.jar"]
