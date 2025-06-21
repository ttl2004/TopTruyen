package com.project.ReadStory.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Lỗi không xác định"),
    INVALID_KEY(9998, "Từ khóa không hợp lệ"),
    USER_EXIST(1001, "Người dùng đã tồn tại"),
    USERNAME_EXIST(1002, "Tên đăng nhập đã tồn tại"),
    EMAIL_EXIST(1003, "Email đã tồn tại"),

    USER_INVALID(1004, "Tên tối thiểu 6 ký tự"),
    USERNAME_INVALID(1005, "Tên đăng nhập tối thiểu 3 ký tự"),
    PASSWORD_INVALID(1006, "Vui lòng nhập tối thiểu 8 ký tự cho mật khẩu"),
    EMAIL_INVALID(1007, "Email không hợp lệ"),
    EMAIL_NULL(1008, "Email không được để trống"),
    USER_NOT_FOUND(1009, "Người dùng không tồn tại"),
    UNAUTHENTICATED(1010, "Tên đăng nhập hoặc mật khẩu không đúng"),
    STORY_NAME_INVALID(2001, "Tên truyện tối thiểu 3 ký tự"),
    CHAPTER_NAME_INVALID(3001, "Tên chương tối thiểu 6 ký tự"),
    CHAPTER_EXIST(3002, "Chương đã tồn tại"),
    ;
    private int code;
    private String message;
}
