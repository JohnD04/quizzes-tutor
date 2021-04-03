package pt.ulisboa.tecnico.socialsoftware.tutor.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = {"pt.ulisboa.tecnico.socialsoftware.tutor", "pt.ulisboa.tecnico.socialsoftware.events"})
public class TutorModuleConfiguration {
}
