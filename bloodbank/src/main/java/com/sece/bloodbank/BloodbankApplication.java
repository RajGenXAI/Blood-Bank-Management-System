package com.sece.bloodbank;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {
		"com.sece.bloodbank",
		"config",
		"controller",
		"service",
		"repository",
		"entity",
		"dto",
		"enums",
		"exception"
})
@EntityScan("entity")
@EnableJpaRepositories("repository")
public class BloodbankApplication {

	public static void main(String[] args) {
		SpringApplication.run(BloodbankApplication.class, args);
	}
}