package com.project.ReadStory.config;

import com.project.ReadStory.entity.User;
import com.project.ReadStory.responsitory.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Role;

import java.util.HashSet;

@Configuration
@Slf4j
public class ApplicationInitConfig {
    @Bean
    public ApplicationRunner khoiChayUngDung(UserRepository userRepository) {
        return args -> {
            if (userRepository.findByTenDangNhap("admin").isEmpty()) {
                User admin = User.builder()
                        .tenDangNhap("admin")
                        .tenNguoiDung("admin")
                        .matKhau("admin@123")
                        .quyenHan("ADMIN")
                        .build();
                userRepository.save(admin);
                log.warn("Tạo tài khoản admin thành công");
            }
            else {
                log.warn("Tài khoản admin đã tồn tại trong DB");
            }
        };
    }
}
