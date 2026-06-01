import axios from 'axios';

// Base URL for API — routes through the API gateway on port 8080
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

/** Send a new message for an offer */
export const sendMessage = async (offerId: number, content: string) => {
  const payload = {
    offerId,
    content,
    // senderId will be resolved from JWT on the server
  };
  await axios.post(`${API_BASE}/api/messages`, payload, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
};

/** Load message history for an offer */
export const fetchMessages = async (offerId: number) => {
  const resp = await axios.get(`${API_BASE}/api/messages/offer/${offerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return resp.data;
};

/**
 * Subscribe to a specific offer's message channel via polling fallback.
 * Real-time WebSocket requires @stomp/stompjs which is unavailable in this container.
 * Falls back to HTTP polling every 5 seconds.
 */
export const subscribeToOffer = (offerId: number, callback: (msgs: any[]) => void) => {
  const interval = setInterval(async () => {
    try {
      const messages = await fetchMessages(offerId);
      if (Array.isArray(messages)) {
        callback(messages);
      }
    } catch (e) {
      // Silently fail on network errors during polling
    }
  }, 5000);

  return () => clearInterval(interval);
};
