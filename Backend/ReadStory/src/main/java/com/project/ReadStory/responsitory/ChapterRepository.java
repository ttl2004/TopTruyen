package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.Chapter;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, String> {
    boolean existsByMaChuong(Integer maChuong);
    Optional<Chapter> findByMaChuong(Integer maChuong);
    Page<Chapter> findByTruyen_MaTruyen(Long maTruyen, Pageable pageable);
}
