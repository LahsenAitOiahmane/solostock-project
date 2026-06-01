package ma.solostock.payment;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.solostock.payment.entity.PaymentMethod;
import ma.solostock.payment.entity.PaymentStatus;
import ma.solostock.payment.entity.Transaction;
import ma.solostock.payment.repository.TransactionRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds demo payment transactions on first startup (idempotent).
 * Maps to the accepted offers seeded in negotiation-service:
 *   Offer 1 (buy1 → sup1, 5 laptops @4800)  → contract 1
 *   Offer 4 (buy1 → sup2, 10 chemises @650)  → contract 2
 *   Offer 7 (buy1 → sup3, 100 huiles @250)   → contract 3
 *   Offer 9 (buy3 → sup3, 10 argan @880)     → contract 4
 *   Offer 11(buy2 → sup1, 15 switches @900)  → contract 5
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final TransactionRepository transactionRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (transactionRepository.count() > 0) {
            log.info("[Seeder] Transactions already seeded — skipping.");
            return;
        }

        log.info("[Seeder] Seeding demo payment transactions…");

        // User IDs: buy1=5, buy2=6, buy3=7, sup1=2, sup2=3, sup3=4
        List<Transaction> txs = List.of(

            // Accepted offer 1: 5 laptops @ 4800 = 24 000 MAD  (COMPLETED)
            Transaction.builder()
                .contractId(1L).payerId(5L).receiverId(2L)
                .amount(24_000.0).currency("MAD")
                .method(PaymentMethod.VIREMENT)
                .status(PaymentStatus.COMPLETED)
                .reference("TXN-2026-0001")
                .createdAt(LocalDateTime.now().minusDays(37))
                .completedAt(LocalDateTime.now().minusDays(36))
                .build(),

            // Accepted offer 4: 10 lots chemises @ 650 = 6 500 MAD  (COMPLETED)
            Transaction.builder()
                .contractId(2L).payerId(5L).receiverId(3L)
                .amount(6_500.0).currency("MAD")
                .method(PaymentMethod.CREDIT)
                .status(PaymentStatus.COMPLETED)
                .reference("TXN-2026-0002")
                .createdAt(LocalDateTime.now().minusDays(32))
                .completedAt(LocalDateTime.now().minusDays(30))
                .build(),

            // Accepted offer 7: 100 bidons @ 250 = 25 000 MAD  (COMPLETED)
            Transaction.builder()
                .contractId(3L).payerId(5L).receiverId(4L)
                .amount(25_000.0).currency("MAD")
                .method(PaymentMethod.TRAITE)
                .status(PaymentStatus.COMPLETED)
                .reference("TXN-2026-0003")
                .createdAt(LocalDateTime.now().minusDays(25))
                .completedAt(LocalDateTime.now().minusDays(23))
                .build(),

            // Accepted offer 9: 10 argan lots @ 880 = 8 800 MAD  (PENDING — awaiting payment)
            Transaction.builder()
                .contractId(4L).payerId(7L).receiverId(4L)
                .amount(8_800.0).currency("MAD")
                .method(PaymentMethod.VIREMENT)
                .status(PaymentStatus.PENDING)
                .reference("TXN-2026-0004")
                .createdAt(LocalDateTime.now().minusDays(7))
                .build(),

            // Accepted offer 11: 15 switches @ 900 = 13 500 MAD  (COMPLETED)
            Transaction.builder()
                .contractId(5L).payerId(6L).receiverId(2L)
                .amount(13_500.0).currency("MAD")
                .method(PaymentMethod.VIREMENT)
                .status(PaymentStatus.COMPLETED)
                .reference("TXN-2026-0005")
                .createdAt(LocalDateTime.now().minusDays(19))
                .completedAt(LocalDateTime.now().minusDays(17))
                .build(),

            // An extra FAILED transaction for dashboard realism
            Transaction.builder()
                .contractId(6L).payerId(6L).receiverId(3L)
                .amount(12_600.0).currency("MAD")
                .method(PaymentMethod.CREDIT)
                .status(PaymentStatus.FAILED)
                .reference("TXN-2026-0006")
                .createdAt(LocalDateTime.now().minusDays(10))
                .build()
        );

        transactionRepository.saveAll(txs);
        log.info("[Seeder] ✅ {} demo transactions created.", txs.size());
    }
}
