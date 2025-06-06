package com.medibridge.authservice.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth/dashboard")
public class DashboardController {

   /* @GetMapping
    public String home(@RequestHeader(name = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // remove 'Bearer ' prefix
            System.out.println("Received JWT Token: " + token); // You can use it as needed
            return "Welcome to Dashboard! AuthID: " + token;
        } else {
            return "Token not provided in Authorization header!";
        }
    }*/
	
	@GetMapping
	public ResponseEntity<String> home(
	    @RequestHeader(name = "Authorization", required = false) String authHeader,
	    @RequestParam(name = "token", required = false) String tokenParam
	) {
	    HttpHeaders headers = new HttpHeaders();
	    headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");
	    headers.add("Pragma", "no-cache");

	    String token = null;

	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        token = authHeader.substring(7);
	    } else if (tokenParam != null && !tokenParam.isEmpty()) {
	        token = tokenParam;
	    }

	    String response = (token != null)
	        ? "Welcome to Dashboard! AuthID: " + token
	        : "Token not provided in Authorization header or query parameter!";

	    return ResponseEntity.ok()
	            .headers(headers)
	            .body(response);
	}

	
	
	
	
	/*
	 * 200 ok
	 * @GetMapping
	public ResponseEntity<String> home(@RequestHeader(name = "Authorization", required = false) String authHeader) {
	    HttpHeaders headers = new HttpHeaders();
	    headers.setCacheControl("no-store, no-cache, must-revalidate, max-age=0");
	    headers.add("Pragma", "no-cache");

	    String response;
	    if (authHeader != null && authHeader.startsWith("Bearer ")) {
	        String token = authHeader.substring(7); // remove 'Bearer ' prefix
	        System.out.println("Received JWT Token: " + token);
	        response = "Welcome to Dashboard! AuthID: " + token;
	    } else {
	        response = "Token not provided in Authorization header!";
	    }

	    return ResponseEntity.ok()
	            .headers(headers)
	            .body(response);
	}
    
    */

    @GetMapping("/LoginPage")
    public String index() {
        return "Login Page - Please Login!";
    }

    @GetMapping("/patientregistration")
    public String patientRegistration() {
        return "Patient Registration Page";
    }
}
