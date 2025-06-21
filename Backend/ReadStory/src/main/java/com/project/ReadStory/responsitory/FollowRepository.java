package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.Comment;
import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.ReadStory;
import com.project.ReadStory.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, String> {
    boolean existsByMaTheoDoi(Long maTheoDoi);
    Optional<Follow> findByMaTheoDoi(Long maTheoDoi);
    Page<Follow> findByNguoiDung_MaNguoiDung(Long maNguoiDung, Pageable pageable);
    Optional<Follow> findByTruyen_MaTruyenAndNguoiDung_MaNguoiDung(Long maTruyen, Long maNguoiDung);
}
