package com.project.ReadStory.controller;

import com.project.ReadStory.Mapper.ChapterMapper;
import com.project.ReadStory.dto.request.*;
import com.project.ReadStory.dto.response.ChapterResponse;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.StoryResponse;
import com.project.ReadStory.entity.Chapter;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.service.ChapterService;
import io.micrometer.common.lang.NonNull;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/storys/{storyId}/chapters")

public class ChapterController {

    @Autowired
    private ChapterService chapterService;

    @Autowired
    private ChapterMapper chapterMapper;

    //Tạo hoặc thêm chương mới
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ChapterResponse>> createChapter(
            @PathVariable Long storyId,
            @RequestPart("info") @Valid @NonNull ChapterCreationRequest request,
            @RequestPart("zipFile") @NonNull MultipartFile zipFile) {
        System.out.println("Story ID: " + storyId);
        request.setMaTruyen(storyId);
        System.out.println("Request: " + request.getMaTruyen());
        Chapter createdChapter = chapterService.createChapter(request, zipFile);
        ChapterResponse chapterResponse = chapterMapper.toChapterResponse(createdChapter);

        ApiResponse<ChapterResponse> response = new ApiResponse<>();
        response.setResult(chapterResponse);
        return ResponseEntity.ok(response);
    }

    //Xoá chương
    @DeleteMapping("/{chapterId}")
    void deleteChapter(@PathVariable Integer chapterId) {

        chapterService.deleteChapter(chapterId);
    }

    //Cập nhật chương
    @PutMapping("/{chapterId}")
    public ChapterResponse updateChapter(
            @PathVariable Integer chapterId,
            @RequestPart("info") @Valid ChapterUpdateRequest request,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {
        return chapterService.updateChapter(chapterId, request, imageFile);
    }

    //Lấy tất cả chương
    @GetMapping
    public ResponseEntity<PagedResponse<Chapter>> getAllChapters(@PathVariable Long storyId, Pageable pageable) {
        return ResponseEntity.ok(chapterService.getAllChapters(storyId, pageable));
    }

    //Lấy chương theo id
    @GetMapping("/{chapterId}")
    ChapterResponse getChapterById(@PathVariable Integer chapterId) {
        return chapterService.getChapterById(chapterId);
    }
}
