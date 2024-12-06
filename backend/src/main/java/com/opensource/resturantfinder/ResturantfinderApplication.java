package com.opensource.resturantfinder;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.opensource.resturantfinder")
public class ResturantfinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(ResturantfinderApplication.class, args);
	}

}
