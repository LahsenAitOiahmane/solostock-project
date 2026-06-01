package ma.solostock.messaging.service;

import ma.solostock.messaging.dto.MessageDto;
import ma.solostock.messaging.entity.Message;
import ma.solostock.messaging.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {
    @Autowired
    private MessageRepository repository;

    public MessageDto save(MessageDto dto) {
        Message message = new Message();
        message.setOfferId(dto.getOfferId());
        message.setSenderId(dto.getSenderId());
        message.setReceiverId(dto.getReceiverId());
        message.setContent(dto.getContent());
        // timestamp & read are defaulted
        Message saved = repository.save(message);
        return toDto(saved);
    }

    public List<MessageDto> getByOfferId(Long offerId) {
        return repository.findByOfferIdOrderByTimestampAsc(offerId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private MessageDto toDto(Message m) {
        MessageDto dto = new MessageDto();
        dto.setId(m.getId());
        dto.setOfferId(m.getOfferId());
        dto.setSenderId(m.getSenderId());
        dto.setReceiverId(m.getReceiverId());
        dto.setContent(m.getContent());
        dto.setTimestamp(m.getTimestamp());
        dto.setRead(m.isRead());
        return dto;
    }
}
