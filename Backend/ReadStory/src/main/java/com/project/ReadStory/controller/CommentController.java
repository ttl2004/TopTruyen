package com.project.ReadStory.controller;

import com.project.ReadStory.dto.request.*;
import com.project.ReadStory.dto.response.ChapterResponse;
import com.project.ReadStory.dto.response.CommentResponse;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.entity.Chapter;
import com.project.ReadStory.entity.Comment;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
//@RequestMapping("/stories/{storyId}/comments")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @PostMapping("/stories/{storyId}/comments")
    ApiResponse<Comment> createComment(
            @PathVariable Long storyId,
            @RequestBody @Valid CommentCreationRequest request) {
        // Set the story ID in the request
        request.setMaTruyen(storyId);
        ApiResponse<Comment> apiResponse = new ApiResponse<>();

        apiResponse.setResult(commentService.createComment(request));

        return apiResponse;
    }

    @DeleteMapping("/stories/{storyId}/comments/{commentId}")
    void deleteComment(@PathVariable Long commentId) {

        commentService.deleteComment(commentId);
    }

    @GetMapping("/stories/{storyId}/comments")
    public ResponseEntity<PagedResponse<Comment>> getAllComments(@PathVariable Long storyId, Pageable pageable) {
        return ResponseEntity.ok(commentService.getAllCommentsInStory(storyId, pageable));
    }

    //Cập nhật bình luận
    @PutMapping("/stories/{storyId}/comments/{commentId}")
    public CommentResponse updateComment(
            @PathVariable Long storyId,
            @PathVariable Long commentId,
            @RequestBody CommentUpdateRequest request) {
        request.setMaTruyen(storyId);
        return commentService.updateComment(commentId, request);
    }
    @GetMapping("/commentAdmin/search")
    public ResponseEntity<Page<CommentResponse>> searchComments(
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(commentService.searchComments(keyword, pageable));
    }

    @GetMapping("/commentAdmin")
    public ResponseEntity<Page<CommentResponse>> getAllComments(Pageable pageable) {
        return ResponseEntity.ok(commentService.getAllComments(pageable));
    }
    @DeleteMapping("/commentAdmin/{commentId}")
    void deleteCommentAdmin(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
    }

    @GetMapping("/commentAdmin/statistical")
    public Map<String, Object> statisticalComments(){
        return commentService.getCommentStatistics();
    }
}
