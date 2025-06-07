/*package com.medibridge.authservice.controller;

import com.medibridge.authservice.dto.LoginRequest;
import com.medibridge.authservice.dto.LoginResponse;
import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import com.medibridge.authservice.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserRepository userRepo) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            System.out.println("Attempting to authenticate user: " + request.getUsername());

            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            System.out.println("Authentication successful for: " + request.getUsername());

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            User user = userRepo.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

            String roleName = (user.getRole() != null && user.getRole().getName() != null)
                              ? user.getRole().getName()
                              : "ROLE_NOT_ASSIGNED";

            return ResponseEntity.ok(new LoginResponse("Login Successful", jwt, roleName));
        } catch (Exception ex) {
            ex.printStackTrace(); // ✅ Print stack trace to see exact reason
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }
}*/

//Enahced code 05/06/2025

package com.medibridge.authservice.controller;

import com.medibridge.authservice.dto.LoginRequest;
import com.medibridge.authservice.dto.LoginResponse;
import com.medibridge.authservice.model.RefreshToken;
import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import com.medibridge.authservice.security.JwtUtil;
import com.medibridge.authservice.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;
    private final RefreshTokenService refreshTokenService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserRepository userRepo, RefreshTokenService refreshTokenService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            User user = userRepo.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

            String roleName = (user.getRole() != null && user.getRole().getName() != null)
                              ? user.getRole().getName()
                              : "ROLE_NOT_ASSIGNED";
            
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername());
           // return ResponseEntity.ok(new LoginResponse("Login Successful", jwt, roleName));
            return ResponseEntity.ok(
            	    new LoginResponse("Login Successful", jwt, refreshToken.getToken(), roleName)
            	);
        
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

  
    
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String requestRefreshToken = request.get("refreshToken");

        return refreshTokenService.findByToken(requestRefreshToken)
            .map(refreshToken -> {
                if (refreshTokenService.isExpired(refreshToken)) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired");
                }

                String newAccessToken = jwtUtil.generateToken(refreshToken.getUser().getUsername());
                return ResponseEntity.ok(Map.of("token", newAccessToken));
            }).orElseThrow(() -> new RuntimeException("Invalid refresh token"));
    }
    
    
    
    @GetMapping("/login-success")
    public String loginSuccess(@AuthenticationPrincipal OAuth2User principal, HttpServletRequest request, Model model) {
        
    	 if (principal == null) {
    	        return "redirect:/Login?error=oauth2_principal_null";
    	    }
    	
    	String email = principal.getAttribute("email");

        // Try to find user by email from DB
        User user = userRepo.findByUsername(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));

        // Create Spring Security UserDetails
        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword()) // required, even if dummy
            .authorities(user.getRole().getName())
            .build();

        // Generate JWT
        String jwt = jwtUtil.generateToken(userDetails);

        // Store in session
        HttpSession session = request.getSession();
        session.setAttribute("AuthId", email);
        session.setAttribute("JWTToken", jwt);
        model.addAttribute("email", email);
        return "LoginPage";  //login-success
    }

    @GetMapping("/logout-success")
    public String logoutSuccess() {
        return "logout-success";
    }

    @GetMapping("/session-info")
    public Map<String, Object> getSessionInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Map<String, Object> info = new HashMap<>();
        info.put("AuthId", session != null ? session.getAttribute("AuthId") : "N/A");
        info.put("JWTToken", session != null ? session.getAttribute("JWTToken") : "N/A");
        info.put("SessionId", session != null ? session.getId() : "N/A");
        return info;
    }
}


//working code
/*package com.medibridge.authservice.controller;

import com.medibridge.authservice.dto.LoginRequest;
import com.medibridge.authservice.dto.LoginResponse;
import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import com.medibridge.authservice.security.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserRepository userRepo) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            User user = userRepo.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

            String roleName = (user.getRole() != null && user.getRole().getName() != null)
                              ? user.getRole().getName()
                              : "ROLE_NOT_ASSIGNED";

            return ResponseEntity.ok(new LoginResponse("Login Successful", jwt, roleName));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @GetMapping("/login-success")
    public String loginSuccess(@AuthenticationPrincipal OAuth2User principal, HttpServletRequest request, Model model) {
        String email = principal.getAttribute("email");
        HttpSession session = request.getSession();
        session.setAttribute("AuthId", email);
        model.addAttribute("email", email);
        return "Login Success for " + email;
    }

    @GetMapping("/logout-success")
    public String logoutSuccess() {
        return "Logout Success";
    }

   // @GetMapping("/session-info")
    //public Map<String, Object> getSessionInfo(HttpServletRequest request) {
      //  HttpSession session = request.getSession(false);
       // Map<String, Object> info = new HashMap<>();
        //info.put("AuthId", session != null ? session.getAttribute("AuthId") : "N/A");
        //info.put("JWTToken", session != null ? session.getAttribute("JWTToken") : "N/A");
        //info.put("SessionId", session != null ? session.getId() : "N/A");
        //return info;
   // }
    
    @GetMapping("/api/auth/session-info")
    @ResponseBody
    public Map<String, Object> getSessionInfo(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> info = new HashMap<>();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // remove 'Bearer ' part
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                info.put("AuthId", claims.getSubject());
                info.put("Roles", claims.get("roles"));
                info.put("JWTToken", token);
            } catch (Exception e) {
                info.put("error", "Invalid or expired token");
            }
        } else {
            info.put("error", "Missing or malformed Authorization header");
        }

        return info;
    }

}*/


/*
package com.medibridge.authservice.controller;

import com.medibridge.authservice.dto.LoginRequest;
import com.medibridge.authservice.dto.LoginResponse;
import com.medibridge.authservice.model.User;
import com.medibridge.authservice.repository.UserRepository;
import com.medibridge.authservice.security.JwtUtil;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepo;

    @Value("${jwt.secret}")  // Inject the secret from application.properties
    private String secret;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserRepository userRepo) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userRepo = userRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            User user = userRepo.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

            String roleName = (user.getRole() != null && user.getRole().getName() != null)
                              ? user.getRole().getName()
                              : "ROLE_NOT_ASSIGNED";

            return ResponseEntity.ok(new LoginResponse("Login Successful", jwt, roleName));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @GetMapping("/login-success")
    public String loginSuccess(@AuthenticationPrincipal OAuth2User principal, HttpServletRequest request, Model model) {
        String email = principal.getAttribute("email");
        HttpSession session = request.getSession();
        session.setAttribute("AuthId", email);
        model.addAttribute("email", email);
        return "Login Success for " + email;
    }

    @GetMapping("/logout-success")
    public String logoutSuccess() {
        return "Logout Success";
    }

    // <-- FIXED mapping path here (removed duplicated prefix)
    @GetMapping("/session-info")
    @ResponseBody
    public Map<String, Object> getSessionInfo(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> info = new HashMap<>();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // remove 'Bearer ' part
            try {
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                info.put("AuthId", claims.getSubject());
                info.put("Roles", claims.get("roles"));
                info.put("JWTToken", token);
            } catch (Exception e) {
                info.put("error", "Invalid or expired token");
            }
        } else {
            info.put("error", "Missing or malformed Authorization header");
        }

        return info;
    }

}
*/

