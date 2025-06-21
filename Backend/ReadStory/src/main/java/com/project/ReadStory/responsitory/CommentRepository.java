package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.Category;
import com.project.ReadStory.entity.Comment;
import com.project.ReadStory.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CommentRepository extends JpaRepository<Comment, String> {
    boolean existsByMaBinhLuan(Long maBinhLuan);
    Optional<Comment> findByMaBinhLuan(Long maBinhLuan);
    Page<Comment> findByTruyen_MaTruyen(Long maTruyen, Pageable pageable);

    @Query("SELECT c FROM Comment c JOIN FETCH c.nguoiDung JOIN FETCH c.truyen")
    Page<Comment> findAllWithUserAndStory(Pageable pageable);
    @Query(value = "SELECT c FROM Comment c JOIN FETCH c.nguoiDung JOIN FETCH c.truyen " +
            "WHERE LOWER(c.noiDung) LIKE LOWER(CONCAT('%', :keyword, '%'))",
            countQuery = "SELECT COUNT(c) FROM Comment c WHERE LOWER(c.noiDung) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Comment> searchByNoiDungContaining(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "SELECT COUNT(*) FROM binh_luan b WHERE DATE(b.ngay_them) = CURRENT_DATE", nativeQuery = true)
    long countCommentsAddToday();

    @Query(value = "SELECT COUNT(*) FROM binh_luan b WHERE DATE(b.ngay_them) = CURRENT_DATE - INTERVAL 1 DAY", nativeQuery = true)
    long countCommentsAddYesterday();

    @Query(value = "SELECT COUNT(*) FROM binh_luan b WHERE b.ngay_them >= CURRENT_DATE - INTERVAL 1 MONTH", nativeQuery = true)
    long countCommentsAddLastMonth();

}
