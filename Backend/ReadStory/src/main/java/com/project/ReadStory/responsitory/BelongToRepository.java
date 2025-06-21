package com.project.ReadStory.responsitory;

import com.project.ReadStory.entity.BelongTo;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BelongToRepository extends JpaRepository<BelongTo, String> {
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM thuoc_ve tv WHERE tv.ma_truyen = :maTruyen", nativeQuery = true)
    void deleteByMaTruyen(@Param("maTruyen") Long maTruyen);
}
