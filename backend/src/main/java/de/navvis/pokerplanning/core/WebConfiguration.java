package de.navvis.pokerplanning.core;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * This class is necessary for angular route to work correctly in a deployed environment.
 * Refreshing or copy-pasting a link only works if the page is index.html, thus with this class we
 * are telling Spring Boot to redirect addresses to index.html.
 * Reference:
 * https://stackoverflow.com/questions/39331929/spring-catch-all-route-for-index-html/42998817#42998817
 */
@Configuration
public class WebConfiguration extends WebMvcConfigurerAdapter
{
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/{spring:\\w+}").setViewName("forward:/");
		registry.addViewController("/**/{spring:\\w+}").setViewName("forward:/");
		registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
			.setViewName("forward:/");
	}
}
