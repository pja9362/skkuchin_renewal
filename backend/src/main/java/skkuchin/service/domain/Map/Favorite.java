package skkuchin.service.domain.Map;

import lombok.*;
import skkuchin.service.domain.User.AppUser;

import javax.persistence.*;

// test
@Entity
//@Data
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Favorite {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long id;


    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;






}

