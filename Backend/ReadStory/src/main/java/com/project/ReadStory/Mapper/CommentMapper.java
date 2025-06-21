package com.project.ReadStory.Mapper;

import com.project.ReadStory.dto.request.CommentCreationRequest;
import com.project.ReadStory.dto.request.CommentUpdateRequest;
import com.project.ReadStory.dto.request.UserUpdateRequest;
import com.project.ReadStory.dto.response.CommentResponse;
import com.project.ReadStory.dto.response.UserResponse;
import com.project.ReadStory.entity.Comment;
import com.project.ReadStory.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    Comment toComment(CommentCreationRequest request);

    CommentResponse toCommentResponse(Comment comment);

    public static CommentResponse toCommentResponse_1(Comment comment) {
        return CommentResponse.builder()
                .maBinhLuan(comment.getMaBinhLuan())
                .noiDung(comment.getNoiDung())
                .ngayThem(comment.getNgayThem())
                .ngayChinhSua(comment.getNgayChinhSua())
                .tenNguoiDung(comment.getNguoiDung().getTenDangNhap()) // Lấy từ User
                .tenTruyen(comment.getTruyen().getTenTruyen())          // Lấy từ Story
                .build();
    }
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateComment(@MappingTarget Comment comment, CommentUpdateRequest request);

}
