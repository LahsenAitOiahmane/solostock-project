package ma.solostock.messaging.controller;

import ma.solostock.messaging.dto.MessageDto;
import ma.solostock.messaging.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Validated
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Send a new message. The service will persist it and we broadcast it via WebSocket.
     */
    @PostMapping
    public MessageDto sendMessage(@RequestBody MessageDto messageDto) {
        MessageDto saved = messageService.save(messageDto);
        // Broadcast to subscribers of the offer channel
        String destination = "/topic/offer." + saved.getOfferId();
        messagingTemplate.convertAndSend(destination, saved);
        return saved;
    }

    /**
     * Retrieve all messages for a given offer, ordered by timestamp.
     */
    @GetMapping("/offer/{offerId}")
    public List<MessageDto> getMessagesByOffer(@PathVariable Long offerId) {
        return messageService.getByOfferId(offerId);
    }
}
