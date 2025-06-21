package com.project.ReadStory.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) //field nào null thì ko hiển thị
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse <T> {
    private int code = 1000;
    private String message;
    private T result;
}
