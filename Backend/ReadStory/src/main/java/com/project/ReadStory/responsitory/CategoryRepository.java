package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.Category;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    boolean existsByMaTheLoai(Long maTheLoai);

    Optional<Category> findByMaTheLoai(Long maTheLoai);

    Page<Category> findByTenTheLoaiContainingIgnoreCase(String keyword, Pageable pageable);
}
