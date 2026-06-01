package ma.solostock.auth.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.solostock.auth.entity.Role;
import ma.solostock.auth.entity.User;
import ma.solostock.auth.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Seeds demo users on first startup.
 * Safe to run multiple times — skips if users already exist.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.count() > 0) {
            log.info("[Seeder] Users already seeded — skipping.");
            return;
        }

        log.info("[Seeder] Seeding demo users…");
        String pw = passwordEncoder.encode("password123");

        // ── ADMIN ──────────────────────────────────────────────────────────
        userRepository.save(User.builder()
                .email("admin@solostock.ma")
                .password(pw)
                .fullName("Admin Solostock")
                .company("Solostock Platform")
                .phone("+212 600 000 000")
                .role(Role.ADMIN)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(90))
                .build());

        // ── SUPPLIERS (FOURNISSEUR) ────────────────────────────────────────
        userRepository.save(User.builder()
                .email("supplier1@solostock.ma")
                .password(pw)
                .fullName("Youssef Alami")
                .company("TechDistrib Maroc")
                .phone("+212 661 112 233")
                .role(Role.FOURNISSEUR)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(60))
                .build());

        userRepository.save(User.builder()
                .email("supplier2@solostock.ma")
                .password(pw)
                .fullName("Fatima Benali")
                .company("Mode & Textile SA")
                .phone("+212 662 445 566")
                .role(Role.FOURNISSEUR)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(45))
                .build());

        userRepository.save(User.builder()
                .email("supplier3@solostock.ma")
                .password(pw)
                .fullName("Mehdi Tazi")
                .company("Alimenta Import")
                .phone("+212 663 778 899")
                .role(Role.FOURNISSEUR)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(30))
                .build());

        // ── BUYERS (ACHETEUR) ─────────────────────────────────────────────
        userRepository.save(User.builder()
                .email("buyer1@solostock.ma")
                .password(pw)
                .fullName("Sara Idrissi")
                .company("Retail Hub Casablanca")
                .phone("+212 664 321 987")
                .role(Role.ACHETEUR)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(50))
                .build());

        userRepository.save(User.builder()
                .email("buyer2@solostock.ma")
                .password(pw)
                .fullName("Karim Moussaoui")
                .company("Souk Digital SARL")
                .phone("+212 665 654 321")
                .role(Role.ACHETEUR)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(20))
                .build());

        userRepository.save(User.builder()
                .email("buyer3@solostock.ma")
                .password(pw)
                .fullName("Nadia Rachidi")
                .company("Nadia Boutique")
                .phone("+212 666 987 654")
                .role(Role.ACHETEUR)
                .active(true)
                .createdAt(LocalDateTime.now().minusDays(10))
                .build());

        log.info("[Seeder] ✅ 7 demo users created.");
    }
}
