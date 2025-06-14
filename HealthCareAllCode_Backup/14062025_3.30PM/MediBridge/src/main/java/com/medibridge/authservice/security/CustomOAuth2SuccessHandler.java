/*package com.medibridge.authservice.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    public CustomOAuth2SuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        String token = jwtUtil.generateToken(email);

        HttpSession session = request.getSession();
        session.setAttribute("AuthId", email);
        session.setAttribute("JWTToken", token);

        response.sendRedirect("/api/auth/login-success");
    }
}*/





/*package com.medibridge.authservice.security;

//package com.wellnesswave.healthcare.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
public class CustomOAuth2SuccessHandler {
	
	
	
	 @GetMapping("/")
	    public String index() {
	        return "index"; // Return your Landing page view
	    }
	    
	    

	    @GetMapping("/login-success")
	    public String loginSuccess(@AuthenticationPrincipal OAuth2User principal, Model model, HttpServletRequest request) {
	        String name = principal.getAttribute("name");
	        String email = principal.getAttribute("email");  // Fetching email from OAuth

	        // Store in the session
	        HttpSession session = request.getSession();
	        session.setAttribute("AuthId", email != null ? email : name);  // Prioritize email if available

	        // Pass to the model
	        model.addAttribute("name", name);
	        model.addAttribute("email", email);

	        return "login-success"; // Return the view for successful login
	    }
	  
	 
	    
	   @GetMapping("/logout-success")
	    public String logoutSuccess() {
	        System.out.println("Logout Success Controller Triggered");
	        return "logout-success";
	    }
	    
	    
	    // New endpoint to get session info
	    @GetMapping("/session-info")
	    public String getSessionInfo(HttpServletRequest request, Model model) {
	        HttpSession session = request.getSession();
	        String authId = (String) session.getAttribute("AuthId");
	        String sessionId = session.getId();

	        model.addAttribute("authId", authId != null ? authId : "Not Logged In");
	        model.addAttribute("sessionId", sessionId);

	        return "session-info";  // Create this HTML page to display the info
	    }

	
}*/
	
	
	// new updated with JWT

package com.medibridge.authservice.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    public CustomOAuth2SuccessHandler(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // Generate JWT based on email
        String jwt = jwtUtil.generateToken(email); // 🔄 See below on how to support email string

        // Store in session
        HttpSession session = request.getSession();
        session.setAttribute("AuthId", email);
        session.setAttribute("JWTToken", jwt);

       // response.sendRedirect("/api/auth/login-success");
      //  response.sendRedirect("http://localhost:3000/login?token=" + jwt);
        response.sendRedirect("http://localhost:3000/dashboard?token=" + jwt);
    }
}

	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*  // @Autowired
//   private JwtUtil jwtUtil;

  // 🔰 Home Page
  @GetMapping("/")
  public String index() {
      return "index";
  }

  // 🔰 Login Success Handler
  @GetMapping("/login-success")
  public String loginSuccess(
          @AuthenticationPrincipal OAuth2User principal,
          Model model,
          HttpServletRequest request
  ) {
      // 📝 Extract Name and Email for SSO Login
      String name = principal.getAttribute("name");
      String email = principal.getAttribute("email");

      System.out.println("🔍 Principal Name: " + name);
      System.out.println("🔍 Principal Email: " + email);

      // 🔰 Session Handling
      HttpSession session = request.getSession();
      
      // 🔀 **Differentiating SSO and Manual Login:**
      String identifier;

      if (email != null) {
          // ✅ If email exists, it's SSO Login
          identifier = email;
      } else {
          // 🔄 If email is null, we consider it Manual Login
          // 🚀 Extracting `name` and `contact` for manual login
          String contact = principal.getAttribute("contact");

          if (name == null || contact == null) {
              System.out.println("⚠️  Name or Contact is null, session not set.");
              return "redirect:/login?error"; // 🔁 Redirect to login with error
          }

          System.out.println("🔍 Manual Login -> Name: " + name + ", Contact: " + contact);

          // 🔐 Generate a combined identifier for Manual Login
          identifier = name + "-" + contact;
      }

      // 🔍 Store the identifier in session
      session.setAttribute("AuthId", identifier);
*/
      // 🔐 Generate JWT Token
  //    String jwtToken = jwtUtil.generateToken(identifier);
    //  System.out.println("🔰 Generated JWT Token: " + jwtToken);

   /*   if (jwtToken != null) {
          session.setAttribute("JWTToken", jwtToken);
          session.setMaxInactiveInterval(1800); // 30 minutes session timeout
      } else {
          System.out.println("⚠️  JWT Token generation failed!");
          return "redirect:/login?error";
      }*/

 /*     // 🔰 Set Attributes for Thymeleaf
      model.addAttribute("name", name);
      model.addAttribute("email", email);
    //  model.addAttribute("jwtToken", session.getAttribute("JWTToken"));

      return "home";  // ⬅️ Redirect to the home page
  }

  // 🔰 Logout Success Handler
  @GetMapping("/logout-success")
  public String logoutSuccess(HttpServletRequest request) {
      System.out.println("🚀 Logout Success Controller Triggered");
      
      // 🔄 Invalidate Session on Logout
      HttpSession session = request.getSession(false);
      if (session != null) {
          session.invalidate();
          System.out.println("✅ Session Invalidated Successfully");
      }
      
      return "logout-success";
  }*/

/*  // 🔰 Session Info Display
  @GetMapping("/session-info")
  public String getSessionInfo(HttpServletRequest request, Model model) {
      HttpSession session = request.getSession();
      String authId = (String) session.getAttribute("AuthId");
      String sessionId = session.getId();
      String jwtToken = (String) session.getAttribute("JWTToken");

      System.out.println("🔍 Session Info -> AuthId: " + authId + ", JWT Token: " + jwtToken);

      model.addAttribute("authId", authId != null ? authId : "Not Logged In");
      model.addAttribute("sessionId", sessionId);
      model.addAttribute("jwtToken", jwtToken != null ? jwtToken : "Token Not Generated");

      return "session-info";
  }*/

/*   // 🔰 Endpoint to Test JWT Session
  @GetMapping("/test-session")
  public ResponseEntity<String> testSession(HttpServletRequest request) {
      HttpSession session = request.getSession();
      String jwtToken = (String) session.getAttribute("JWTToken");
      return ResponseEntity.ok("JWT Token in Session: " + (jwtToken != null ? jwtToken : "No Token Found"));
  }*/

  // 🔰 NEW: Get JWT Token Only
/*   @GetMapping("/jwt-token")
  @ResponseBody
  public ResponseEntity<String> getJwtToken(HttpServletRequest request) {
      HttpSession session = request.getSession();
      String jwtToken = (String) session.getAttribute("JWTToken");
      return ResponseEntity.ok(jwtToken != null ? jwtToken : "No Token Found");
  }*/

