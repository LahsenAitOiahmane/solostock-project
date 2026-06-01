package ma.solostock.catalog;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.solostock.catalog.entity.Category;
import ma.solostock.catalog.entity.Product;
import ma.solostock.catalog.entity.ProductStatus;
import ma.solostock.catalog.repository.ProductRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Seeds demo products on first startup (idempotent).
 * Supplier IDs correspond to the DataSeeder in auth-service:
 *   supplier1 → id 2  (TechDistrib Maroc)
 *   supplier2 → id 3  (Mode & Textile SA)
 *   supplier3 → id 4  (Alimenta Import)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (productRepository.count() > 0) {
            log.info("[Seeder] Products already seeded — skipping.");
            return;
        }

        log.info("[Seeder] Seeding demo products…");

        // Supplier IDs are deterministic (seeded first in auth-service):
        // admin=1, supplier1=2, supplier2=3, supplier3=4, buyer1=5, buyer2=6, buyer3=7
        long sup1 = 2L, sup2 = 3L, sup3 = 4L;

        List<Product> products = List.of(

            // ── ELECTRONIQUE / INFORMATIQUE ────────────────────────────────
            Product.builder()
                .name("Laptop ProBook 15 Core i7")
                .description("Ultrabook professionnel 15\", Core i7-12th Gen, 16GB RAM, SSD 512GB, écran IPS FHD. Idéal pour la bureautique et le développement.")
                .wholesalePrice(5200.0).retailPrice(6800.0)
                .stockQuantity(45).minOrderQuantity(2)
                .category(Category.INFORMATIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(55))
                .build(),

            Product.builder()
                .name("Écran 27\" 4K UHD IPS")
                .description("Moniteur professionnel 27 pouces, résolution 3840×2160, taux de rafraîchissement 60Hz, ports HDMI + DisplayPort + USB-C.")
                .wholesalePrice(1850.0).retailPrice(2400.0)
                .stockQuantity(120).minOrderQuantity(5)
                .category(Category.INFORMATIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(50))
                .build(),

            Product.builder()
                .name("Switch Réseau 24 Ports Gigabit")
                .description("Commutateur réseau géré 24 ports 10/100/1000 Mbps + 4 ports SFP uplink, rack 1U, idéal PME.")
                .wholesalePrice(980.0).retailPrice(1350.0)
                .stockQuantity(60).minOrderQuantity(3)
                .category(Category.INFORMATIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(40))
                .build(),

            Product.builder()
                .name("Smartphone Android 5G Pro")
                .description("Téléphone 6.7\", processeur Snapdragon 8 Gen 2, 256 Go stockage, triple caméra 200MP, batterie 5000mAh.")
                .wholesalePrice(2300.0).retailPrice(3200.0)
                .stockQuantity(200).minOrderQuantity(10)
                .category(Category.ELECTRONIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(35))
                .build(),

            Product.builder()
                .name("Tablette 10\" Éducation")
                .description("Tablette Android 10 pouces, 64 Go, WiFi 6, résistante aux chocs, idéale pour écoles et formations.")
                .wholesalePrice(890.0).retailPrice(1200.0)
                .stockQuantity(3).minOrderQuantity(10)
                .category(Category.ELECTRONIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(28))
                .build(),

            // ── TEXTILE ────────────────────────────────────────────────────
            Product.builder()
                .name("Chemise Oxford Homme — Lot 12")
                .description("Chemise 100% coton Oxford, coupe slim fit, disponible en blanc, bleu ciel et anthracite. Tailles S à XXL. Vendu par lot de 12.")
                .wholesalePrice(720.0).retailPrice(1080.0)
                .stockQuantity(85).minOrderQuantity(1)
                .category(Category.TEXTILE).status(ProductStatus.AVAILABLE)
                .supplierId(sup2).supplierName("Mode & Textile SA")
                .createdAt(LocalDateTime.now().minusDays(42))
                .build(),

            Product.builder()
                .name("Djellaba Femme Brodée — Collection Été")
                .description("Djellaba légère en soie naturelle, broderies dorées à la main, livrée avec ceinture assortie. Disponible en 6 coloris.")
                .wholesalePrice(480.0).retailPrice(750.0)
                .stockQuantity(150).minOrderQuantity(5)
                .category(Category.TEXTILE).status(ProductStatus.AVAILABLE)
                .supplierId(sup2).supplierName("Mode & Textile SA")
                .createdAt(LocalDateTime.now().minusDays(38))
                .build(),

            Product.builder()
                .name("Jean Denim Premium Homme — Lot 24")
                .description("Jean stretch coupe droite, 98% coton / 2% élasthanne, triple couture renforcée, tailles 38–52. Lot de 24 pièces assorties.")
                .wholesalePrice(1440.0).retailPrice(2160.0)
                .stockQuantity(60).minOrderQuantity(1)
                .category(Category.TEXTILE).status(ProductStatus.AVAILABLE)
                .supplierId(sup2).supplierName("Mode & Textile SA")
                .createdAt(LocalDateTime.now().minusDays(25))
                .build(),

            Product.builder()
                .name("T-Shirt Coton Bio Personnalisable")
                .description("T-shirt 100% coton biologique, certifié GOTS, disponible en 15 couleurs, impression sérigraphie possible dès 50 pièces.")
                .wholesalePrice(35.0).retailPrice(65.0)
                .stockQuantity(0).minOrderQuantity(50)
                .category(Category.TEXTILE).status(ProductStatus.AVAILABLE)
                .supplierId(sup2).supplierName("Mode & Textile SA")
                .createdAt(LocalDateTime.now().minusDays(15))
                .build(),

            // ── ALIMENTAIRE ────────────────────────────────────────────────
            Product.builder()
                .name("Huile d'Olive Extra Vierge — Bidon 5L")
                .description("Huile d'olive première pression à froid, origine région Meknès-Fès, acidité < 0.3%, certifiée BIO. Idéale restaurants et épiceries.")
                .wholesalePrice(280.0).retailPrice(420.0)
                .stockQuantity(300).minOrderQuantity(20)
                .category(Category.ALIMENTAIRE).status(ProductStatus.AVAILABLE)
                .supplierId(sup3).supplierName("Alimenta Import")
                .createdAt(LocalDateTime.now().minusDays(48))
                .build(),

            Product.builder()
                .name("Miel de Thym Pur — Pot 1kg")
                .description("Miel artisanal 100% naturel de fleurs de thym, récolté dans le Haut-Atlas. Sans conservateurs. Conditionnement en pot en verre.")
                .wholesalePrice(95.0).retailPrice(160.0)
                .stockQuantity(500).minOrderQuantity(24)
                .category(Category.ALIMENTAIRE).status(ProductStatus.AVAILABLE)
                .supplierId(sup3).supplierName("Alimenta Import")
                .createdAt(LocalDateTime.now().minusDays(32))
                .build(),

            Product.builder()
                .name("Épices Ras el-Hanout — Sac 25kg")
                .description("Mélange traditionnel marocain de 27 épices broyées, qualité export. Idéal pour restaurants, hôtels et importateurs alimentaires.")
                .wholesalePrice(1200.0).retailPrice(1800.0)
                .stockQuantity(80).minOrderQuantity(2)
                .category(Category.ALIMENTAIRE).status(ProductStatus.AVAILABLE)
                .supplierId(sup3).supplierName("Alimenta Import")
                .createdAt(LocalDateTime.now().minusDays(20))
                .build(),

            // ── MATERIEL_BUREAU ────────────────────────────────────────────
            Product.builder()
                .name("Chaise de Bureau Ergonomique Mesh")
                .description("Chaise réglable en hauteur, accoudoirs 4D, support lombaire réglable, assise maillée respirante, capacité 150kg, garantie 5 ans.")
                .wholesalePrice(1100.0).retailPrice(1650.0)
                .stockQuantity(40).minOrderQuantity(4)
                .category(Category.MATERIEL_BUREAU).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(22))
                .build(),

            Product.builder()
                .name("Imprimante Laser Couleur A4")
                .description("Imprimante laser couleur recto-verso automatique, 30 ppm, WiFi + Ethernet + USB, bac 250 feuilles, compatible avec tous systèmes.")
                .wholesalePrice(2200.0).retailPrice(2900.0)
                .stockQuantity(25).minOrderQuantity(2)
                .category(Category.MATERIEL_BUREAU).status(ProductStatus.AVAILABLE)
                .supplierId(sup1).supplierName("TechDistrib Maroc")
                .createdAt(LocalDateTime.now().minusDays(18))
                .build(),

            // ── COSMETIQUE ─────────────────────────────────────────────────
            Product.builder()
                .name("Huile d'Argan Pure — Flacon 100ml (lot 24)")
                .description("Huile d'argan cosmétique certifiée, pressée à froid, 100% pure et naturelle, packaging premium, lot de 24 flacons en verre.")
                .wholesalePrice(960.0).retailPrice(1440.0)
                .stockQuantity(200).minOrderQuantity(1)
                .category(Category.COSMETIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup3).supplierName("Alimenta Import")
                .createdAt(LocalDateTime.now().minusDays(12))
                .build(),

            Product.builder()
                .name("Savon Beldi Traditionnel — Seau 5kg")
                .description("Savon noir naturel à base d'huile d'olive et d'eucalyptus, utilisé dans les hammams. 100% bio, sans parabènes.")
                .wholesalePrice(320.0).retailPrice(520.0)
                .stockQuantity(150).minOrderQuantity(5)
                .category(Category.COSMETIQUE).status(ProductStatus.AVAILABLE)
                .supplierId(sup3).supplierName("Alimenta Import")
                .createdAt(LocalDateTime.now().minusDays(8))
                .build()
        );

        productRepository.saveAll(products);
        log.info("[Seeder] ✅ {} demo products created.", products.size());
    }
}
