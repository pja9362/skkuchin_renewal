package skkuchin.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
import skkuchin.service.domain.Chat.ChatMessage;
import skkuchin.service.domain.Chat.ChatRoom;
import skkuchin.service.domain.Chat.ResponseType;
import skkuchin.service.domain.User.AppUser;
import skkuchin.service.domain.User.Major;
import skkuchin.service.domain.User.Profile;

import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;


public class ChatRoomDto {

    @Getter
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static  class RoomRequest {
        @NotNull
        private Long id;

        public ChatRoom toEntity(AppUser user){
            return ChatRoom.builder()
                    .user1(user)
                    .build();
        }
    }

    @Getter
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static  class ReactionRequest{
        @NotNull
        private ResponseType reaction;
    }

    @Getter
    @RequiredArgsConstructor
    @AllArgsConstructor
    public static  class BooleanRequest{
        @NotNull
        private Boolean reaction;
    }

    @Getter
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class Response {
        @JsonProperty
        private String roomId;
        private String message;
        private Major major;
        private String nickname;
        private Profile image;
        @JsonProperty
        private Long user1Id;
        @JsonProperty
        private Long user2Id;
        @JsonProperty
        private boolean user1Alarm;
        @JsonProperty
        private boolean user2Alarm;
        @JsonProperty
        private LocalDateTime messageTime;
        @JsonProperty
        private String displayTime;
        @JsonProperty
        private int messageCount;

        public Response(ChatRoom chatroom, ChatMessage chatMessage, int messageCount, AppUser otherUser) {
            this.messageTime = chatMessage.getDate();
            this.displayTime = formatDate(chatMessage.getDate());
            this.message = chatMessage.getMessage();
            this.roomId = chatroom.getRoomId();
            this.user1Id = chatroom.getUser1().getId();
            this.user2Id = chatroom.getUser2().getId();
            this.messageCount = messageCount;
            this.user1Alarm = chatroom.isUser1Alarm();
            this.user2Alarm = chatroom.isUser2Alarm();
            this.major = otherUser.getMajor();
            this.nickname = otherUser.getNickname();
            this.image = otherUser.getImage();
        }

        private String formatDate(LocalDateTime date) {
            LocalDateTime now = LocalDateTime.now();
            long diff = ChronoUnit.MINUTES.between(date, now);
            if (diff < 1) {
                return "방금 전";
            } else if (diff < 60) {
                return diff + "분 전";
            } else if (diff < 1440) {
                return (diff / 60) + "시간 전";
            } else if (diff < 2880) {
                return "어제";
            } else if (date.getYear() == now.getYear()) {
                return date.format(DateTimeFormatter.ofPattern("M월 d일"));
            } else {
                return date.format(DateTimeFormatter.ofPattern("yyyy. M. d."));
            }
        }
    }

    @Getter
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class settingResponse{
        @JsonProperty
        private boolean user1Blocked;
        @JsonProperty
        private boolean user2Blocked;
        @JsonProperty
        private boolean user1Alarm;
        @JsonProperty
        private boolean user2Alarm;
        @JsonProperty
        private String meetPlace;
        @JsonProperty
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy.MM.dd (E) HH:mm", timezone = "Asia/Seoul", locale = "ko-KR")
        private LocalDateTime meetTime;

        public settingResponse(ChatRoom chatRoom){
            this.user1Blocked = chatRoom.isUser1Blocked();
            this.user2Blocked = chatRoom.isUser2Blocked();
            this.user1Alarm = chatRoom.isUser1Alarm();
            this.user2Alarm = chatRoom.isUser2Alarm();
            this.meetPlace = chatRoom.getMeetPlace();
            this.meetTime = chatRoom.getMeetTime();
        }
    }

    @Getter
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class userResponse{
        @JsonProperty
        private Long user1Id;
        @JsonProperty
        private Long user2Id;
        @JsonProperty
        private String roomId;
        @JsonProperty
        private LocalDateTime createdDate;
        @JsonProperty
        private String displayTime;

        public userResponse(ChatRoom chatRoom){
            this.user1Id = chatRoom.getUser1().getId();
            this.user2Id = chatRoom.getUser2().getId();
            this.roomId = chatRoom.getRoomId();
            this.createdDate = chatRoom.getExpireDate().minusDays(2);
            this.displayTime = formatDate(chatRoom.getExpireDate().minusDays(2));
        }

        private String formatDate(LocalDateTime date) {
            LocalDateTime now = LocalDateTime.now();
            long diff = ChronoUnit.MINUTES.between(date, now);
            if (diff < 1) {
                return "방금 전";
            } else if (diff < 60) {
                return diff + "분 전";
            } else if (diff < 1440) {
                return (diff / 60) + "시간 전";
            } else if (diff < 2880) {
                return "어제";
            } else if (date.getYear() == now.getYear()) {
                return date.format(DateTimeFormatter.ofPattern("M월 d일"));
            } else {
                return date.format(DateTimeFormatter.ofPattern("yyyy. M. d."));
            }
        }
    }

    @Getter
    @Setter
    @JsonNaming(value = PropertyNamingStrategies.SnakeCaseStrategy.class)
    public static class DebeziumDto{
        private Long id;

        @JsonProperty
        private String roomId;

        @JsonProperty
        private Long user1Id;

        @JsonProperty
        private Long user2Id;

        private ResponseType response;

        @JsonProperty
        private Timestamp expireDate;

        @JsonProperty
        private Boolean user1Block;

        @JsonProperty
        private Boolean user2Block;

        @JsonProperty
        private Boolean user1Alarm;

        @JsonProperty
        private Boolean user2Alarm;

        @JsonProperty
        private String meetPlace;

        @JsonProperty
        private Timestamp meetTime;
    }
}