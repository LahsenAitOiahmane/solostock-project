import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Drawer, IconButton, TextField, Box, Typography, alpha, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import { subscribeToOffer, fetchMessages, sendMessage } from '../../services/messagingService';
import { useAuth } from '../../context/AuthContext';

// ─── Design Tokens (dark panel, lime accent) ─────────────────────────────────
const PANEL_BG    = '#0f0f10';
const PANEL_SIDE  = '#16161a';
const LIME        = '#c1f11d';
const MSG_ME_BG   = LIME;
const MSG_HIM_BG  = '#1e1e26';
const BORDER      = 'rgba(255,255,255,0.07)';
const TEXT_PRI    = '#f0f0f0';
const TEXT_MUT    = '#5a5a6e';

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChatDrawerProps {
  offerId: number;
  open: boolean;
  onClose: () => void;
}

interface Message {
  id?: number;
  offerId?: number;
  content: string;
  senderId?: number;
  senderName?: string;
  sender?: { name?: string; id?: number };
  createdAt?: string;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, isMe }: { name: string; isMe: boolean }) => (
  <Box sx={{
    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
    bgcolor: isMe ? alpha(LIME, 0.25) : '#2a2a38',
    border: `1.5px solid ${isMe ? alpha(LIME, 0.5) : BORDER}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.7rem', fontWeight: 800,
    color: isMe ? LIME : '#aaa',
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  }}>
    {name.charAt(0).toUpperCase()}
  </Box>
);

// ─── Single bubble ────────────────────────────────────────────────────────────
const Bubble = ({ msg, isMe }: { msg: Message; isMe: boolean }) => {
  const name  = isMe ? 'You' : (msg.senderName || msg.sender?.name || 'Buyer');
  const time  = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: isMe ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      gap: 1,
      maxWidth: '100%',
      animation: 'fadeUp 0.2s ease',
      '@keyframes fadeUp': {
        from: { opacity: 0, transform: 'translateY(8px)' },
        to:   { opacity: 1, transform: 'translateY(0)' },
      }
    }}>
      <Avatar name={name} isMe={isMe} />

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
        {/* sender label */}
        <Typography sx={{
          fontSize: '0.65rem', fontWeight: 700, mb: 0.4, px: 0.5,
          color: isMe ? alpha(LIME, 0.7) : TEXT_MUT,
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {name}
        </Typography>

        {/* bubble */}
        <Box sx={{
          px: 2, py: 1.2,
          bgcolor: isMe ? MSG_ME_BG : MSG_HIM_BG,
          borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          boxShadow: isMe
            ? `0 4px 20px ${alpha(LIME, 0.25)}`
            : `0 4px 16px ${alpha('#000', 0.4)}`,
          border: `1px solid ${isMe ? 'transparent' : BORDER}`,
        }}>
          <Typography sx={{
            fontSize: '0.88rem', lineHeight: 1.55, wordBreak: 'break-word',
            color: isMe ? '#000' : TEXT_PRI, fontWeight: isMe ? 600 : 400,
          }}>
            {msg.content}
          </Typography>
        </Box>

        {/* time + tick */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mt: 0.4, px: 0.5 }}>
          {time && (
            <Typography sx={{ fontSize: '0.6rem', color: TEXT_MUT }}>{time}</Typography>
          )}
          {isMe && <DoneAllRoundedIcon sx={{ fontSize: 11, color: alpha(LIME, 0.5) }} />}
        </Box>
      </Box>
    </Box>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ChatDrawer: React.FC<ChatDrawerProps> = ({ offerId, open, onClose }) => {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [messages, setMessages]   = useState<Message[]>([]);
  const [newMsg,   setNewMsg]     = useState('');
  const [sending,  setSending]    = useState(false);
  const [focused,  setFocused]    = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  // Initial load
  useEffect(() => {
    if (!open) return;
    fetchMessages(offerId)
      .then(data => { setMessages(data); setTimeout(scrollToBottom, 100); })
      .catch(err  => console.error('Failed to load messages', err));
  }, [offerId, open]);

  // Polling subscription
  useEffect(() => {
    if (!open) return;
    const unsub = subscribeToOffer(offerId, (msgs: Message[]) => setMessages(msgs));
    return () => unsub();
  }, [offerId, open]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  // Focus input when drawer opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const handleSend = useCallback(async () => {
    if (!newMsg.trim() || sending) return;
    setSending(true);
    const optimistic: Message = { content: newMsg.trim(), senderId: currentUserId, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    setNewMsg('');
    try {
      await sendMessage(offerId, optimistic.content);
      const updated = await fetchMessages(offerId);
      setMessages(updated);
    } catch (e) {
      console.error('Failed to send', e);
    } finally {
      setSending(false);
    }
  }, [offerId, newMsg, sending, currentUserId]);

  const canSend = newMsg.trim().length > 0 && !sending;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100vw', sm: 420 },
          bgcolor: PANEL_BG,
          backgroundImage: 'none',
          borderLeft: `1px solid ${BORDER}`,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <Box sx={{
        px: 3, py: 2.5,
        borderBottom: `1px solid ${BORDER}`,
        background: `linear-gradient(135deg, ${alpha(LIME, 0.06)} 0%, transparent 60%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* icon badge */}
          <Box sx={{
            width: 38, height: 38, borderRadius: '10px',
            bgcolor: alpha(LIME, 0.12),
            border: `1px solid ${alpha(LIME, 0.2)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18, color: LIME }} />
          </Box>
          <Box>
            <Typography sx={{
              fontWeight: 800, fontSize: '0.98rem', color: TEXT_PRI,
              fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.01em',
            }}>
              Negotiation Chat
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#22c55e', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.7rem', color: TEXT_MUT }}>
                Offer #{offerId} · Live
              </Typography>
            </Box>
          </Box>
        </Box>

        <Tooltip title="Close chat">
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: TEXT_MUT,
              bgcolor: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BORDER}`,
              borderRadius: '8px',
              '&:hover': { color: TEXT_PRI, bgcolor: 'rgba(255,255,255,0.08)' },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── Messages ──────────────────────────────────────────────────────── */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: 2.5, py: 3,
        display: 'flex', flexDirection: 'column', gap: 2,
        bgcolor: PANEL_BG,
        backgroundImage: `
          radial-gradient(ellipse at 30% 20%, ${alpha(LIME, 0.025)} 0%, transparent 60%),
          radial-gradient(ellipse at 80% 80%, ${alpha('#8b5cf6', 0.04)} 0%, transparent 60%)
        `,
        '&::-webkit-scrollbar': { width: 4 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: BORDER, borderRadius: 2 },
      }}>
        {messages.length === 0 ? (
          <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            height: '100%', gap: 1.5,
          }}>
            <Box sx={{
              width: 64, height: 64, borderRadius: '18px',
              bgcolor: alpha(LIME, 0.08),
              border: `1px solid ${alpha(LIME, 0.15)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 28, color: alpha(LIME, 0.5) }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: TEXT_PRI, fontSize: '0.95rem' }}>
              Start the conversation
            </Typography>
            <Typography sx={{ color: TEXT_MUT, fontSize: '0.8rem', textAlign: 'center', maxWidth: 260 }}>
              Send a message to negotiate pricing and terms for this offer.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === currentUserId;
            return <Bubble key={msg.id ?? idx} msg={msg} isMe={isMe} />;
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* ── Input ─────────────────────────────────────────────────────────── */}
      <Box sx={{
        px: 2.5, pb: 2.5, pt: 2,
        borderTop: `1px solid ${BORDER}`,
        bgcolor: PANEL_SIDE,
        flexShrink: 0,
      }}>
        <Box sx={{
          display: 'flex', alignItems: 'flex-end', gap: 1.5,
          bgcolor: PANEL_BG,
          border: `1.5px solid ${focused ? alpha(LIME, 0.4) : BORDER}`,
          borderRadius: '16px',
          p: 1.5,
          transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: focused ? `0 0 0 3px ${alpha(LIME, 0.08)}` : 'none',
        }}>
          <TextField
            inputRef={inputRef}
            fullWidth
            multiline
            maxRows={4}
            variant="standard"
            placeholder="Message your counterparty…"
            value={newMsg}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => setNewMsg(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '0.875rem',
                color: TEXT_PRI,
                caretColor: LIME,
                py: 0.3, px: 0.5,
                '& ::placeholder': { color: TEXT_MUT, opacity: 1 },
              },
            }}
          />

          {/* Send button */}
          <Box
            onClick={canSend ? handleSend : undefined}
            sx={{
              width: 38, height: 38, borderRadius: '10px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              bgcolor: canSend ? LIME : alpha(LIME, 0.1),
              border: `1.5px solid ${canSend ? 'transparent' : alpha(LIME, 0.15)}`,
              cursor: canSend ? 'pointer' : 'default',
              transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
              transform: canSend ? 'scale(1)' : 'scale(0.92)',
              '&:hover': canSend ? { bgcolor: '#d4ff35', transform: 'scale(1.07)' } : {},
              '&:active': canSend ? { transform: 'scale(0.97)' } : {},
            }}
          >
            <SendRoundedIcon sx={{
              fontSize: 17,
              color: canSend ? '#000' : alpha(LIME, 0.35),
              ml: '2px',
              transition: 'color 0.18s',
            }} />
          </Box>
        </Box>

        <Typography sx={{
          fontSize: '0.62rem', color: TEXT_MUT, textAlign: 'center', mt: 1.2,
          letterSpacing: '0.02em',
        }}>
          ↵ Enter to send &nbsp;·&nbsp; ⇧ Shift+Enter for new line
        </Typography>
      </Box>
    </Drawer>
  );
};

export default ChatDrawer;
