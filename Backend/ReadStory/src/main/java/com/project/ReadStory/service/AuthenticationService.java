package com.project.ReadStory.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.project.ReadStory.dto.request.AuthenticationRequest;
import com.project.ReadStory.dto.request.IntrospectRequest;
import com.project.ReadStory.dto.response.AuthenticationResponse;
import com.project.ReadStory.dto.response.IntrospectResponse;
import com.project.ReadStory.entity.User;
import com.project.ReadStory.exception.AppException;
import com.project.ReadStory.exception.ErrorCode;
import com.project.ReadStory.responsitory.UserRepository;
import lombok.*;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    @Autowired
    private UserRepository userRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SINGER_KEY;
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var user = userRepository.findByTenDangNhap(request.getTenDangNhap())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        boolean authenticated = user.getMatKhau().equals(request.getMatKhau());
        if (!authenticated) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }


        var token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    // Generate token
    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        // Set the payload
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getTenDangNhap())
                .issuer("dra.com")
                .issueTime(new Date())
                .expirationTime(new Date(System.currentTimeMillis() + 3600 * 24 * 1000)) // 1 hour expiration
                .claim("authority", user.getQuyenHan())
                .claim("userId", user.getMaNguoiDung())
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        // Create the JWS object
        JWSObject jwsObject = new JWSObject(header, payload);

        // Sign the JWS object
        try{
            jwsObject.sign(new MACSigner(SINGER_KEY.getBytes()));
            // Trả về chuỗi JWT hoàn chỉnh
            return jwsObject.serialize();
        }
        catch (JOSEException e) {
            log.error("Không thể tạo token", e);
            throw new RuntimeException(e);
        }
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        var token = request.getToken();

        JWSVerifier verifier = new MACVerifier(SINGER_KEY.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);

        return IntrospectResponse.builder()
                .valid(verified && expirationTime.after(new Date()))
                .build();


    }
}