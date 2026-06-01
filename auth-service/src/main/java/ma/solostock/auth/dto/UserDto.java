package ma.solostock.auth.dto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class UserDto {
    private Long id;
    private String email;
    private String fullName;
    private String company;
    private String phone;
    private String role;
    private Boolean active;
    private LocalDateTime createdAt;
}
