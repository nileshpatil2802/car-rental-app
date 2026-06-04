package com.My_Car_Rental_Application.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import java.util.List;  
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig {
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//    
//    
//
//    @Bean
//    SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
//        return httpSecurity
//            .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF for REST API
//            .cors(Customizer.withDefaults())
//            .sessionManagement(session -> session
//                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // ← Add this
//                )
//            .authorizeHttpRequests(registry -> {
//                // ✅ PUBLIC - No login needed
//                registry.requestMatchers("/home/**").permitAll();
//                registry.requestMatchers("/home/register").permitAll();
//                registry.requestMatchers("/home/cars").permitAll();
//                registry.requestMatchers("/home/cars/**").permitAll();
//
//                // 🔒 SECURED - Login required
//                registry.requestMatchers("/auth/admin/**").hasRole("ADMIN");
//                registry.requestMatchers("/user/**").hasRole("USER");
//                registry.anyRequest().authenticated();
//            })
//
//            .httpBasic(Customizer.withDefaults()) // React sends username+password in header
//
//            .build();
//    }
//
//        @Bean
//        PasswordEncoder passwordEncoder() {
//            return NoOpPasswordEncoder.getInstance();
//        }
//
//        @Bean
//        AuthenticationManager authenticationManager(
//            AuthenticationConfiguration config) throws Exception {
//        	return config.getAuthenticationManager();
//        }
//
//}
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults()) // Enable CORS
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {

                    // Public APIs
                    auth.requestMatchers("/home/**").permitAll();

                    // Protected APIs
                    auth.requestMatchers("/auth/admin/**").hasRole("ADMIN");
                    auth.requestMatchers("/user/**").hasRole("USER");

                    auth.anyRequest().authenticated();
                })
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }

    @Bean
    AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173"));

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        configuration.setAllowedHeaders(
                List.of("*"));

        configuration.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source =
                new org.springframework.web.cors.UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
