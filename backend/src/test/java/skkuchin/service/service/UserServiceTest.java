package skkuchin.service.service;

import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import junit.framework.TestCase;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.platform.commons.logging.Logger;
import org.junit.platform.commons.logging.LoggerFactory;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import skkuchin.service.common.MockTest;
import skkuchin.service.domain.AppUser;
import skkuchin.service.domain.Role;
import skkuchin.service.exception.DuplicateException;
import skkuchin.service.repo.RoleRepo;
import skkuchin.service.repo.UserRepo;

import java.util.ArrayList;
import java.util.Collection;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.BDDMockito.given;

public class UserServiceTest extends MockTest {
    @InjectMocks
    private UserServiceImpl userService;
    @Mock
    private UserRepo userRepo;
    @Mock
    private RoleRepo roleRepo;
    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        ReflectionTestUtils.setField(userService, "passwordEncoder", passwordEncoder);
    }

    @Test
    public void username으로_user_불러오기_성공() {
        //given
        Collection<Role> roles = new ArrayList<>();
        roles.add(new Role(1L, "ROLE_USER"));
        AppUser user = new AppUser(1L, "user", "user111", "1234", roles);
        given(userRepo.findByUsername(any())).willReturn(user);

        //when
        UserDetails test = userService.loadUserByUsername("user");

        //then
        assertThat(test).isNotNull();
    }

    @Test(expected = UsernameNotFoundException.class)
    public void username으로_user_불러오기_실패() {
        //given
        given(userRepo.findByUsername("user2")).willReturn(null);

        //when
        UserDetails test = userService.loadUserByUsername("user2");
    }

    @Test
    public void saveUser_성공() {
        //given
        Collection<Role> roles = new ArrayList<>();
        roles.add(new Role(1L, "ROLE_USER"));
        AppUser user = new AppUser(1L, "user", "user111", "1234", roles);
        given(passwordEncoder.encode(anyString())).willReturn("encoderPassword");
        given(userRepo.save(any())).willReturn(user);

        //when
        AppUser savedUser = userService.saveUser(user);

        //then
        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getNickname()).isEqualTo(user.getNickname());
        assertThat(savedUser.getUsername()).isEqualTo(user.getUsername());
        assertThat(savedUser.getPassword()).isEqualTo("encoderPassword");
    }

    @Test
    public void user_role_추가_성공() {
        //given
        Role role = new Role(1L, "ROLE_USER");
        Collection<Role> roles = new ArrayList<>();
        AppUser user = new AppUser(1L, "user", "user111", "1234", roles);
        given(userRepo.findByUsername("user111")).willReturn(user);
        given(roleRepo.findByName("ROLE_USER")).willReturn(role);

        //when
        userService.addRoleToUser(user.getUsername(), role.getName());
    }

    @Test(expected = DuplicateException.class)
    @DisplayName("addRoleToUser 실패")
    public void user_role_이미_존재하면_추가x() {
        //given
        Role role = new Role(1L, "ROLE_USER");
        Collection<Role> roles = new ArrayList<>();
        roles.add(role);
        AppUser user = new AppUser(1L, "user", "user111", "1234", roles);
        given(userRepo.findByUsername("user111")).willReturn(user);
        given(roleRepo.findByName("ROLE_USER")).willReturn(role);

        //when
        userService.addRoleToUser(user.getUsername(), role.getName());
    }


}
