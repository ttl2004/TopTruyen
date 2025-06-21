package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StoryRepository extends JpaRepository<Story, String> {
    boolean existsByMaTruyen(Long maTruyen);
    Optional<Story> findByMaTruyen(Long maTruyen);
    List<Story> findByTenTruyenContainingIgnoreCase(String keyword);

    Page<Story> findByTenTruyenContainingIgnoreCase(String keyword, Pageable pageable);

    @Query(value = """
                SELECT COUNT(*)
                FROM truyen t
                JOIN doc_truyen dt on dt.ma_truyen = t.ma_truyen
                WHERE t.ma_truyen = :maTruyen
                GROUP BY t.ma_truyen;
            """, nativeQuery = true)
    long getLuotDoc(@Param("maTruyen") Long maTruyen);

    @Query(value = """
                SELECT COUNT(*)
                FROM truyen t
                JOIN chuong dt on dt.ma_truyen = t.ma_truyen
                WHERE t.ma_truyen = :maTruyen
                GROUP BY t.ma_truyen;
            """, nativeQuery = true)
    long getSochuong(@Param("maTruyen") Long maTruyen);

    @Query(value = """
        SELECT t.ma_truyen, tl.ten_the_loai
        FROM truyen t
        JOIN thuoc_ve tv ON tv.ma_truyen = t.ma_truyen
        JOIN the_loai tl ON tl.ma_the_loai = tv.ma_the_loai
        WHERE t.ma_truyen = :maTruyen
        GROUP BY t.ma_truyen, tl.ten_the_loai
    """, nativeQuery = true)
    List<Object[]> findCategoriesRawByMaTruyen(@Param("maTruyen") Long maTruyen);
}
