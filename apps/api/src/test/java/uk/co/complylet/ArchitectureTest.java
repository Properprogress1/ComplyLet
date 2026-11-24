package uk.co.complylet;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

class ArchitectureTest {
    @Test
    void moduleDependenciesRespectPublishedBoundaries() {
        ApplicationModules.of(ComplyLet.class).verify();
    }
}
