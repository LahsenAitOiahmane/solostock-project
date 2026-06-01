package ma.solostock.messaging.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long offerId;
    private Long senderId;
    private Long receiverId;

    @Column(length = 1024)
    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();
    private boolean read = false;
}
