package ma.solostock.negotiation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.solostock.negotiation.entity.Offer;
import ma.solostock.negotiation.entity.OfferStatus;
import ma.solostock.negotiation.repository.OfferRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds demo offers on first startup (idempotent).
 * User IDs match auth-service DataSeeder:
 *   admin=1, sup1=2, sup2=3, sup3=4, buyer1=5, buyer2=6, buyer3=7
 * Product IDs match catalog-service DataSeeder (1-based insertion order).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final OfferRepository offerRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (offerRepository.count() > 0) {
            log.info("[Seeder] Offers already seeded — skipping.");
            return;
        }

        log.info("[Seeder] Seeding demo offers…");

        // ── IDs ───────────────────────────────────────────────────────────
        long sup1 = 2L, sup2 = 3L, sup3 = 4L;
        long buy1 = 5L, buy2 = 6L, buy3 = 7L;

        List<Offer> offers = List.of(

            // Buyer1 negotiating Laptop (product 1, supplier1)
            Offer.builder()
                .productId(1L).productName("Laptop ProBook 15 Core i7")
                .buyerId(buy1).supplierId(sup1)
                .proposedPrice(4800.0).originalPrice(5200.0).quantity(5)
                .message("We'd like to order 5 units — can you offer a volume discount?")
                .status(OfferStatus.ACCEPTED)
                .createdAt(LocalDateTime.now().minusDays(40))
                .updatedAt(LocalDateTime.now().minusDays(38))
                .build(),

            // Buyer2 negotiating Écran 27" (product 2, supplier1)
            Offer.builder()
                .productId(2L).productName("Écran 27\" 4K UHD IPS")
                .buyerId(buy2).supplierId(sup1)
                .proposedPrice(1600.0).originalPrice(1850.0).quantity(20)
                .message("We need 20 monitors for our new office. Can we get 14% off?")
                .status(OfferStatus.COUNTER_OFFERED)
                .createdAt(LocalDateTime.now().minusDays(30))
                .updatedAt(LocalDateTime.now().minusDays(28))
                .build(),

            // Buyer3 negotiating Smartphone (product 4, supplier1)
            Offer.builder()
                .productId(4L).productName("Smartphone Android 5G Pro")
                .buyerId(buy3).supplierId(sup1)
                .proposedPrice(2100.0).originalPrice(2300.0).quantity(50)
                .message("Interested in 50 units for our retail chain. What's your best price?")
                .status(OfferStatus.PENDING)
                .createdAt(LocalDateTime.now().minusDays(15))
                .build(),

            // Buyer1 negotiating Chemise (product 6, supplier2)
            Offer.builder()
                .productId(6L).productName("Chemise Oxford Homme — Lot 12")
                .buyerId(buy1).supplierId(sup2)
                .proposedPrice(650.0).originalPrice(720.0).quantity(10)
                .message("10 lots for our boutique — can you do 650 MAD per lot?")
                .status(OfferStatus.ACCEPTED)
                .createdAt(LocalDateTime.now().minusDays(35))
                .updatedAt(LocalDateTime.now().minusDays(33))
                .build(),

            // Buyer2 negotiating Djellaba (product 7, supplier2)
            Offer.builder()
                .productId(7L).productName("Djellaba Femme Brodée — Collection Été")
                .buyerId(buy2).supplierId(sup2)
                .proposedPrice(420.0).originalPrice(480.0).quantity(30)
                .message("30 units for the summer season — flexible on colour mix.")
                .status(OfferStatus.REJECTED)
                .createdAt(LocalDateTime.now().minusDays(25))
                .updatedAt(LocalDateTime.now().minusDays(24))
                .build(),

            // Buyer3 negotiating Jean (product 8, supplier2)
            Offer.builder()
                .productId(8L).productName("Jean Denim Premium Homme — Lot 24")
                .buyerId(buy3).supplierId(sup2)
                .proposedPrice(1300.0).originalPrice(1440.0).quantity(5)
                .message("5 lots needed urgently — can you ship within 3 days?")
                .status(OfferStatus.PENDING)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build(),

            // Buyer1 negotiating Huile d'Olive (product 10, supplier3)
            Offer.builder()
                .productId(10L).productName("Huile d'Olive Extra Vierge — Bidon 5L")
                .buyerId(buy1).supplierId(sup3)
                .proposedPrice(250.0).originalPrice(280.0).quantity(100)
                .message("100 bidons pour notre chaîne de supermarchés — prix dégressif?")
                .status(OfferStatus.ACCEPTED)
                .createdAt(LocalDateTime.now().minusDays(28))
                .updatedAt(LocalDateTime.now().minusDays(26))
                .build(),

            // Buyer2 negotiating Miel (product 11, supplier3)
            Offer.builder()
                .productId(11L).productName("Miel de Thym Pur — Pot 1kg")
                .buyerId(buy2).supplierId(sup3)
                .proposedPrice(85.0).originalPrice(95.0).quantity(48)
                .message("48 pots pour une épicerie bio — remise possible?")
                .status(OfferStatus.COUNTER_OFFERED)
                .createdAt(LocalDateTime.now().minusDays(18))
                .updatedAt(LocalDateTime.now().minusDays(17))
                .build(),

            // Buyer3 negotiating Huile Argan (product 14, supplier3)
            Offer.builder()
                .productId(14L).productName("Huile d'Argan Pure — Flacon 100ml (lot 24)")
                .buyerId(buy3).supplierId(sup3)
                .proposedPrice(880.0).originalPrice(960.0).quantity(10)
                .message("10 lots for our spa chain. Looking for a long-term partnership.")
                .status(OfferStatus.ACCEPTED)
                .createdAt(LocalDateTime.now().minusDays(10))
                .updatedAt(LocalDateTime.now().minusDays(8))
                .build(),

            // Buyer1 negotiating Imprimante (product 13, supplier1)
            Offer.builder()
                .productId(13L).productName("Imprimante Laser Couleur A4")
                .buyerId(buy1).supplierId(sup1)
                .proposedPrice(2000.0).originalPrice(2200.0).quantity(8)
                .message("8 printers for a corporate client — can you include on-site setup?")
                .status(OfferStatus.PENDING)
                .createdAt(LocalDateTime.now().minusDays(3))
                .build(),

            // Buyer2 negotiating Switch (product 3, supplier1)
            Offer.builder()
                .productId(3L).productName("Switch Réseau 24 Ports Gigabit")
                .buyerId(buy2).supplierId(sup1)
                .proposedPrice(900.0).originalPrice(980.0).quantity(15)
                .message("15 switches for a datacenter build-out project.")
                .status(OfferStatus.ACCEPTED)
                .createdAt(LocalDateTime.now().minusDays(22))
                .updatedAt(LocalDateTime.now().minusDays(20))
                .build(),

            // Buyer3 negotiating Savon Beldi (product 15, supplier3)
            Offer.builder()
                .productId(15L).productName("Savon Beldi Traditionnel — Seau 5kg")
                .buyerId(buy3).supplierId(sup3)
                .proposedPrice(290.0).originalPrice(320.0).quantity(20)
                .message("20 buckets for our hammam chain across 4 cities.")
                .status(OfferStatus.PENDING)
                .createdAt(LocalDateTime.now().minusDays(2))
                .build()
        );

        offerRepository.saveAll(offers);
        log.info("[Seeder] ✅ {} demo offers created.", offers.size());
    }
}
