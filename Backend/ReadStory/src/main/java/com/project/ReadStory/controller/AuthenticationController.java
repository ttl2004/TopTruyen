package com.project.ReadStory.controller;

import com.nimbusds.jose.JOSEException;
import com.project.ReadStory.dto.request.ApiResponse;
import com.project.ReadStory.dto.request.AuthenticationRequest;
import com.project.ReadStory.dto.request.IntrospectRequest;
import com.project.ReadStory.dto.response.AuthenticationResponse;
import com.project.ReadStory.dto.response.IntrospectResponse;
import com.project.ReadStory.exception.ErrorCode;
import com.project.ReadStory.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();

    }
    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectRequest request) throws ParseException, JOSEException {
        var result = authenticationService.introspect(request);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();

    }
}
