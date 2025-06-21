package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByTenNguoiDung(String tenNguoiDung);
    boolean existsByTenDangNhap(String tenDangNhap);
    boolean existsByEmail(String email);

    boolean existsByMaNguoiDung(Long maNguoiDung);

    Optional<User> findByMaNguoiDung(Long maNguoiDung);
    Optional<User> findByTenDangNhap(String tenDangNhap);


    Page<User> findByTenNguoiDungContainingIgnoreCase(String keyword, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM nguoi_dung u WHERE DATE(u.ngay_tao) = CURRENT_DATE AND u.quyen_han = 'USER'", nativeQuery = true)
    long countUsersRegisteredToday();

    @Query(value = "SELECT COUNT(*) FROM nguoi_dung u WHERE DATE(u.ngay_tao) = CURRENT_DATE - INTERVAL 1 DAY AND u.quyen_han = 'USER'", nativeQuery = true)
    long countUsersRegisteredYesterday();

    @Query(value = "SELECT COUNT(*) FROM nguoi_dung u WHERE u.ngay_tao >= CURRENT_DATE - INTERVAL 1 MONTH AND u.quyen_han = 'USER'", nativeQuery = true)
    long countUsersRegisteredLastMonth();


}
