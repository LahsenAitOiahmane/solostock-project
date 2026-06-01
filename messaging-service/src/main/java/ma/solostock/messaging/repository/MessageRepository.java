package ma.solostock.messaging.repository;

import ma.solostock.messaging.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByOfferIdOrderByTimestampAsc(Long offerId);
}
