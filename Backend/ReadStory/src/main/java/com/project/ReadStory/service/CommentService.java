package com.project.ReadStory.service;

import com.project.ReadStory.Mapper.CommentMapper;
import com.project.ReadStory.dto.request.CommentCreationRequest;
import com.project.ReadStory.dto.request.CommentUpdateRequest;
import com.project.ReadStory.dto.request.UserCreationRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.CommentResponse;
import com.project.ReadStory.dto.response.PagedResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Comment;
import com.project.ReadStory.entity.Story;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.exception.AppException;
import com.project.ReadStory.exception.ErrorCode;
import com.project.ReadStory.responsitory.CommentRepository;
import com.project.ReadStory.responsitory.StoryRepository;
import com.project.ReadStory.responsitory.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StoryRepository storyRepository;

    @Autowired
    private CommentMapper commentMapper;

    //Tao comment moi
    public Comment createComment(CommentCreationRequest request) {
        Comment comment = commentMapper.toComment(request);

        // Kiểm tra xem người dùng vaf truyeenj có tồn tại không
        Story story = storyRepository.findByMaTruyen(request.getMaTruyen())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy truyện với id: " + request.getMaTruyen()));
        User user = userRepository.findByMaNguoiDung(request.getMaNguoiDung())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + request.getMaNguoiDung()));

        // Gán người dùng và truyện cho bình luận
        comment.setTruyen(story);
        comment.setNguoiDung(user);
        return commentRepository.save(comment);
    }

    //Delete comment
    public void deleteComment(Long commentID) {
        if (!commentRepository.existsByMaBinhLuan(commentID)) throw new RuntimeException("Comment không tồn tại");
        commentRepository.deleteById(commentID.toString());
    }

    //Lấy list bình luận
    public PagedResponse<Comment> getAllCommentsInStory(Long storyId, Pageable pageable) {
        Page<Comment> page = commentRepository.findByTruyen_MaTruyen(storyId, pageable);

        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
    // Câp nhât bình luận
    public CommentResponse updateComment(Long commentId, CommentUpdateRequest request) {
        Comment comment = commentRepository.findByMaBinhLuan(commentId).orElseThrow(() -> new RuntimeException("Bình luận không tồn tại"));

        Long maTmp = comment.getTruyen().getMaTruyen(), maUser = comment.getNguoiDung().getMaNguoiDung();
        if (maTmp != request.getMaTruyen()) throw new RuntimeException("Bạn không được phép sửa bình luận này vì không thuộc truyện bạn chỉ định");
        if (maUser != request.getMaNguoiDung()) throw new RuntimeException("Bạn không được phép sửa bình luận này vì không phải của bạn");
        commentMapper.updateComment(comment, request);
        return commentMapper.toCommentResponse(commentRepository.save(comment));
    }

    //Tìm kiếm bình luận
    public Page<CommentResponse> searchComments(String keyword, Pageable pageable) {
        return commentRepository.searchByNoiDungContaining(keyword, pageable)
                .map(CommentMapper::toCommentResponse_1);
    }

    //Lấy list cho admin
    public Page<CommentResponse> getAllComments(Pageable pageable) {
        return commentRepository.findAllWithUserAndStory(pageable)
                .map(CommentMapper::toCommentResponse_1);
    }

    // Lấy thông kê cho quản lý bình luận
    public Map<String, Object> getCommentStatistics() {
        long totalCommentsToday = commentRepository.countCommentsAddToday();
        long totalCommentsYesterday = commentRepository.countCommentsAddYesterday();
        long totalCommentsLastMonth = commentRepository.countCommentsAddLastMonth();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCommentsToday", totalCommentsToday);
        stats.put("totalCommentsYesterday", totalCommentsYesterday);
        stats.put("totalCommentsLastMonth", totalCommentsLastMonth);
        return stats;
    }

}
