package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.Follow;
import com.project.ReadStory.entity.ReadStory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReadStoryRepository extends JpaRepository<ReadStory, String> {
    boolean existsByMaDoc(Long maDoc);
    Optional<ReadStory> findByMaDoc(Long maDoc);
    Page<ReadStory> findByNguoiDung_MaNguoiDung(Long maNguoiDung, Pageable pageable);
    Optional<ReadStory> findByTruyen_MaTruyenAndNguoiDung_MaNguoiDung(Long maTruyen, Long maNguoiDung);

}
