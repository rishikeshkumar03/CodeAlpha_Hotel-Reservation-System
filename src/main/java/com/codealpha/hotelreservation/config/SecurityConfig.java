package com.codealpha.hotelreservation.config;

import com.codealpha.hotelreservation.entity.User;
import com.codealpha.hotelreservation.repository.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;

import java.util.Optional;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final UserRepository userRepository;

    public SecurityConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::disable))
            .authorizeHttpRequests(auth -> auth
                // Public UI pages & static assets
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/confirmation.html",
                    "/terms.html",
                    "/privacy.html",
                    "/css/**",
                    "/js/**",
                    "/assets/**",
                    "/images/**",
                    "/favicon.ico",
                    "/h2-console/**"
                ).permitAll()
                // Public API endpoints
                .requestMatchers(
                    "/api/auth/**",
                    "/api/hotels/**",
                    "/api/rooms/**",
                    "/api/policy/**",
                    "/api/bookings/quote"
                ).permitAll()
                // Admin-only endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // User & Booking endpoints
                .requestMatchers("/api/bookings/**", "/api/user/**").authenticated()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED))
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService()))
                .defaultSuccessUrl("/?oauth_success=true", true)
            )
            .logout(logout -> logout
                .logoutUrl("/api/auth/logout")
                .logoutSuccessHandler((req, res, auth) -> {
                    res.setStatus(HttpServletResponse.SC_OK);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"success\":true,\"message\":\"Successfully signed out\"}");
                })
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }

    @Bean
    public OAuth2UserService<OAuth2UserRequest, OAuth2User> customOAuth2UserService() {
        DefaultOAuth2UserService delegate = new DefaultOAuth2UserService();
        return userRequest -> {
            OAuth2User oAuth2User = delegate.loadUser(userRequest);
            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");

            if (email != null) {
                String normalizedEmail = email.trim().toLowerCase();
                Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);
                if (userOptional.isEmpty()) {
                    User newUser = new User(
                        normalizedEmail,
                        null,
                        name != null ? name : "Google Guest",
                        passwordEncoder().encode("oauth-token-" + normalizedEmail),
                        "ROLE_USER",
                        "GOOGLE"
                    );
                    userRepository.save(newUser);
                }
            }
            return oAuth2User;
        };
    }
}

