package skkuchin.service.api.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.*;
import skkuchin.service.api.dto.*;
import skkuchin.service.domain.User.AppUser;
import skkuchin.service.domain.User.Role;
import skkuchin.service.exception.BlankException;
import skkuchin.service.exception.DuplicateException;
import skkuchin.service.security.auth.PrincipalDetails;
import skkuchin.service.service.UserService;

import javax.mail.MessagingException;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUsers() {
        List<UserDto.Response> users = userService.getUsers();
        return new ResponseEntity<>(new CMRespDto<>(1, "유저 전체 조회 완료", users), HttpStatus.OK);
    }

    @PostMapping("/user/saves")
    public ResponseEntity<?> saveUser(@Valid @RequestBody UserDto.SignUpForm signUpForm) {
        try {
            userService.saveUser(signUpForm);
            return new ResponseEntity<>(new CMRespDto<>(1, "회원가입 완료", null), HttpStatus.CREATED);
        } catch (DataIntegrityViolationException exception) {
            //username 또는 nickname 중복 시 에러
            throw new DuplicateException("duplicate_error");
        } catch(TransactionSystemException exception) {
            //null 또는 blank data가 있을 경우 에러
            throw new BlankException("blank_error");
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/confirmEmail")
    public ResponseEntity<Boolean> mailConfirm(@ModelAttribute EmailAuthRequestDto requestDto) throws MessagingException, UnsupportedEncodingException {
        log.info("success");
        return ResponseEntity.ok().body(userService.confirmEmail(requestDto));
    }

    /*
    @PostMapping("/role/save")
    public ResponseEntity<Role>saveRole(@RequestBody Role role) {
        URI uri = URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/role/save").toString());
        return ResponseEntity.created(uri).body(userService.saveRole(role));
    }*/

    @PostMapping("/role/addtouser")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> addRoleToUser(@RequestBody UserDto.RoleToUser form) {
        userService.addRoleToUser(form.getUsername(), form.getRoleName());
        return new ResponseEntity<>(new CMRespDto<>(1, "role 추가 완료", null), HttpStatus.OK);
    }

    @GetMapping("/token/verify")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> verifyToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {

                String access = authorizationHeader.substring("Bearer ".length());
                Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(access);
                Date current = new Date(System.currentTimeMillis());
                //return ResponseEntity.ok().body(current.before(decodedJWT.getExpiresAt()));
            return new ResponseEntity<>(new CMRespDto<>(1, "토큰 유효성 검증 완료", current.before(decodedJWT.getExpiresAt())), HttpStatus.OK);

        } else {
            throw new RuntimeException("Access token is missing");
        }
    }

    @GetMapping("/token/refresh")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) throws IOException {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String refresh = authorizationHeader.substring("Bearer ".length());
                Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(refresh);
                String username = decodedJWT.getSubject();
                AppUser user = userService.getUserForRefresh(username);
                String access = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000)) //10분
                        .withIssuer(request.getRequestURL().toString())
                        .withClaim("roles", user.getRoles().stream().map(Role::getName).collect(Collectors.toList()))
                        .sign(algorithm);

                UserDto.TokenResponse response = new UserDto.TokenResponse(access, refresh);
                return new ResponseEntity<>(new CMRespDto<>(1, "access token 재발급 완료", response), HttpStatus.OK);
            } catch (Exception exception) {
                /*
                response.setHeader("error", exception.getMessage());
                response.setStatus(FORBIDDEN.value());
                //response.sendError(FORBIDDEN.value());
                Map<String, String> error = new HashMap<>();
                error.put("error_message", exception.getMessage());
                response.setContentType(MimeTypeUtils.APPLICATION_JSON_VALUE);
                new ObjectMapper().writeValue(response.getOutputStream(), error);*/
            }
        } else {
            throw new RuntimeException("Refresh token is missing");
        }
        return null;
    }

    @GetMapping("/user/me")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> getMyInfo(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        AppUser user = principalDetails.getUser();
        UserDto.Response userResp = userService.getUser(user.getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "본인 계정 상세 정보 조회 완료", userResp), HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getUserInfo(@PathVariable Long userId) {
        UserDto.Response userResp = userService.getUser(userId);
        return new ResponseEntity<>(new CMRespDto<>(1, "특정 유저 상세 정보 조회 완료", userResp), HttpStatus.OK);
    }

    @PutMapping("/user/me")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> updateMyInfo(@Valid @RequestBody UserDto.PutRequest dto, @AuthenticationPrincipal PrincipalDetails principalDetails) {
        AppUser user = principalDetails.getUser();
        userService.updateUser(user.getId(), dto);
        return new ResponseEntity<>(new CMRespDto<>(1, "본인 계정 수정 완료", null), HttpStatus.OK);
    }

    @PutMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateUser(@PathVariable Long userId, @Valid @RequestBody UserDto.PutRequest dto) {
        userService.updateUser(userId, dto);
        return new ResponseEntity<>(new CMRespDto<>(1, "특정 유저 계정 수정 완료", null), HttpStatus.OK);
    }

    @DeleteMapping("/user/me")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<?> deleteUser(@AuthenticationPrincipal PrincipalDetails principalDetails) {
        AppUser user = principalDetails.getUser();
        userService.deleteUser(user.getId());
        return new ResponseEntity<>(new CMRespDto<>(1, "본인 계정 삭제 완료", null), HttpStatus.OK);
    }

    @DeleteMapping("/user/{userId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteAnotherUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return new ResponseEntity<>(new CMRespDto<>(1, "특정 유저 삭제 완료", null), HttpStatus.OK);
    }
}



