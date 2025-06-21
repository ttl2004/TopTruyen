package com.project.ReadStory.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Value("${jwt.signerKey}")
    private String signerKey;

    private final String [] RRR = {
            "/auth/login",
            "/auth/introspect",
            "/users",
            "/users/**",
            "/storys"
            ,"/storys/**",
            "/storys/*/chapters",
            "/storys/*/chapters/**",
            "/categorys",
            "/categorys/**",
    };
    private final String [] PUBLIC_ENDPOINTS = {
            "/auth/login",
            "/storys"//User chỉ có get
            ,"/storys/**",//User chỉ có get
            "/storys/*/chapters",//User chỉ có get
            "/storys/*/chapters/**",//User chỉ có get
            "/categorys",//User chỉ có get
    };

    private final String [] PRIVATE_ENDPOINTS = {
            "/auth/introspect",
            "/users",
            "/users/**",
            "/categorys/**",

    };


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Cho phép tất cả truy cập login
                .requestMatchers(HttpMethod.POST, "/auth/login", "users").permitAll()

                // ✅ Cho phép tất cả USER và ADMIN truy cập PUBLIC_ENDPOINTS (GET, POST tùy logic)
                .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.PUT, "/users/myInfo/**").hasAuthority("USER")
                .requestMatchers(HttpMethod.GET, "/users/myInfo").hasAnyAuthority("USER", "ADMIN")
                .requestMatchers(PUBLIC_ENDPOINTS).hasAuthority("ADMIN")
                // ✅ Chỉ ADMIN mới được quyền với các PRIVATE_ENDPOINTS
                .requestMatchers(PRIVATE_ENDPOINTS).hasAuthority("ADMIN")

                // ✅ Các request còn lại yêu cầu xác thực
                .anyRequest().authenticated()

        );

        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder()).jwtAuthenticationConverter(jwtAuthenticationConverter()))
        );

//        Tắt bảo vệ CSRF vì ứng dụng này dùng API (RESTful) thay vì form login truyền thống.
        httpSecurity.csrf(AbstractHttpConfigurer::disable);
        return httpSecurity.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            String role = jwt.getClaimAsString("authority");
            if (role == null) return List.of();

            return List.of(new SimpleGrantedAuthority(role));
        });
        return converter;
    }

//    @Bean
//    public JwtAuthenticationConverter jwtAuthenticationConverter() {
//        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
//        converter.setAuthorityPrefix("ROLE_");
//        converter.setAuthoritiesClaimName("roles");
//
//        JwtAuthenticationConverter authenticationConverter = new JwtAuthenticationConverter();
//        authenticationConverter.setJwtGrantedAuthoritiesConverter(converter);
//        return authenticationConverter;
//    }
    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec =new SecretKeySpec(signerKey.getBytes(), "HS512");
        return NimbusJwtDecoder.withSecretKey(secretKeySpec).macAlgorithm(MacAlgorithm.HS512).build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedOrigin("http://localhost:3000");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.addAllowedHeader("*");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }
}
