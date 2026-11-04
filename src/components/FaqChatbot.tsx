import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  ArrowUpRight,
  ChevronRight,
  Compass,
  MessageCircle,
  Phone,
  RotateCcw,
  SendHorizontal,
  X,
} from 'lucide-react';
import { CollegeLogo } from './CollegeImage';
import {
  CHATBOT_CATEGORIES,
  CHATBOT_FAQ_DATABASE,
  CHATBOT_INITIAL_SUGGESTIONS,
  CHATBOT_WELCOME_MESSAGE,
} from '../data/chatbotFaqs';
import {
  ChatbotCategoryId,
  ChatbotQuickAction,
  ChatMessage,
  ConversationContextState,
} from '../types/chatbot';
import {
  createInitialConversationContext,
  processConversationTurn,
} from '../utils/chatbotConversationEngine';

interface FaqChatbotProps {
  /** Hide floating button and panel when another modal or full-screen portal view is active */
  hidden?: boolean;
  /** Callback to navigate to sections/pages or open the Admission Enquiry modal */
  onAction: (action: ChatbotQuickAction) => void;
}

function formatCurrentTimeLabel(date: Date = new Date()): string {
  return date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

const URL_SPLIT_REGEX = /(https?:\/\/[^\s]+)/g;

function renderParagraphWithLinks(paragraph: string, isBot: boolean): React.ReactNode {
  const parts = paragraph.split(URL_SPLIT_REGEX);
  if (parts.length === 1) {
    return paragraph;
  }

  return parts.map((part, index) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      const cleanHref = part.replace(/[.,;!?)]+$/, '');
      const trailingPunctuation = part.slice(cleanHref.length);
      return (
        <React.Fragment key={`url-${index}`}>
          <a
            href={cleanHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 font-semibold underline underline-offset-4 break-all transition-colors ${
              isBot
                ? 'text-[var(--color-brand)] hover:text-[var(--color-brand-dark)]'
                : 'text-white hover:text-white/90'
            }`}
          >
            <span>{cleanHref}</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 inline" />
          </a>
          {trailingPunctuation}
        </React.Fragment>
      );
    }
    return <React.Fragment key={`txt-${index}`}>{part}</React.Fragment>;
  });
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: 'welcome-msg',
    sender: 'bot',
    textParagraphs: CHATBOT_WELCOME_MESSAGE,
    timestampLabel: formatCurrentTimeLabel(),
    categoryLabel: 'Campus Desk',
    suggestedQuestions: CHATBOT_INITIAL_SUGGESTIONS,
  };
}

export const FaqChatbot: React.FC<FaqChatbotProps> = ({ hidden = false, onAction }) => {
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const inputId = useId();

  const [isOpen, setIsOpen] = useState(false);
  const [showGreetingBubble, setShowGreetingBubble] = useState(false);
  const [greetingDismissed, setGreetingDismissed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage()]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTopicBrowser, setShowTopicBrowser] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ChatbotCategoryId>(
    ChatbotCategoryId.GENERAL,
  );

  const launcherButtonRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const wasOpenRef = useRef(false);
  const conversationContextRef = useRef<ConversationContextState>(
    createInitialConversationContext(),
  );

  const categoryQuestions = useMemo(
    () => CHATBOT_FAQ_DATABASE.filter((item) => item.category === activeCategory),
    [activeCategory],
  );

  // Gently reveal the Atlantis University-style "Hello! How can I help you?" notification prompt
  useEffect(() => {
    if (greetingDismissed || isOpen) return;
    const timer = window.setTimeout(
      () => {
        setShowGreetingBubble(true);
      },
      prefersReducedMotion ? 0 : 750,
    );
    return () => window.clearTimeout(timer);
  }, [greetingDismissed, isOpen, prefersReducedMotion]);

  // Clean up any pending response timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to newest message or typing indicator when conversation updates
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'end',
    });
  }, [messages, isTyping, isOpen, prefersReducedMotion]);

  // Manage keyboard focus on open and restore focus to launcher on close
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      setGreetingDismissed(true);
      setShowGreetingBubble(false);
      const focusTimer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 60);
      return () => window.clearTimeout(focusTimer);
    }

    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      launcherButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Allow Escape key to close the chat window
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const submitQuestion = useCallback(
    (rawQuestion: string) => {
      const trimmed = rawQuestion.trim();
      if (!trimmed || isTyping) return;

      const timestamp = formatCurrentTimeLabel();
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        textParagraphs: [trimmed],
        timestampLabel: timestamp,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setShowTopicBrowser(false);
      setIsTyping(true);

      const delayMs = prefersReducedMotion ? 0 : 320;
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = window.setTimeout(() => {
        const turnResult = processConversationTurn(
          trimmed,
          conversationContextRef.current,
        );
        conversationContextRef.current = turnResult.nextContext;

        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          textParagraphs: turnResult.replyParagraphs,
          timestampLabel: formatCurrentTimeLabel(),
          categoryLabel: turnResult.categoryLabel,
          verificationNote: turnResult.verificationNote,
          suggestedQuestions:
            turnResult.suggestedQuestions.length > 0
              ? turnResult.suggestedQuestions
              : undefined,
          actions: turnResult.actions.length > 0 ? turnResult.actions : undefined,
          isFallback: turnResult.isFallback,
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        typingTimeoutRef.current = null;
      }, delayMs);
    },
    [isTyping, prefersReducedMotion],
  );

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    submitQuestion(inputValue);
  };

  const handleResetConversation = () => {
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    conversationContextRef.current = createInitialConversationContext();
    setIsTyping(false);
    setShowTopicBrowser(false);
    setInputValue('');
    setMessages([createWelcomeMessage()]);
    inputRef.current?.focus();
  };

  const handleQuickActionClick = (action: ChatbotQuickAction) => {
    // Close chat window when opening the enquiry/contact page or on compact mobile screens so destination is visible
    if (
      action.action === 'open-enquiry' ||
      action.action === 'scroll-contact' ||
      action.action === 'open-advisory' ||
      window.innerWidth < 640
    ) {
      setIsOpen(false);
    }
    onAction(action);
  };

  const handleOpenFromGreeting = () => {
    setGreetingDismissed(true);
    setShowGreetingBubble(false);
    setIsOpen(true);
  };

  const handleDismissGreeting = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setGreetingDismissed(true);
    setShowGreetingBubble(false);
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.section
            key="chc-campus-guide-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby={titleId}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 14, scale: 0.98 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { opacity: 1, y: 0, scale: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 10, scale: 0.98 }
            }
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-[calc(100vw-2rem)] sm:w-[400px] md:w-[425px] h-[min(630px,calc(100dvh-5.5rem))] bg-white border border-[var(--color-hairline)] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Institutional Header — Official Deep Red Brand Identity */}
            <header className="bg-[var(--color-brand)] text-white px-4 py-3.5 border-b border-white/15 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <CollegeLogo size="sm" variant="light" />
                  <div className="min-w-0">
                    <h2
                      id={titleId}
                      className="font-display text-base font-semibold text-white leading-tight truncate"
                    >
                      CHC Campus Guide
                    </h2>
                    <p className="text-[11px] text-white/80 leading-tight mt-0.5 truncate">
                      CAPITOL HILL COLLEGE <span aria-hidden="true">·</span> ...Shaping Futures Since 2005...
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setShowTopicBrowser((prev) => !prev)}
                    aria-expanded={showTopicBrowser}
                    aria-label="Explore campus topics"
                    title="Explore topics"
                    className={`inline-flex items-center gap-1.5 px-2.5 h-9 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-white ${
                      showTopicBrowser
                        ? 'bg-white text-[var(--color-brand)]'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Compass className="w-3.5 h-3.5 shrink-0" />
                    <span className="hidden xs:inline sm:inline">Explore</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetConversation}
                    aria-label="Reset conversation"
                    title="Start fresh"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-white"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close CHC Campus Guide"
                    title="Close"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus-visible:outline-white"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </header>

            {/* Collapsible Campus Topic Explorer */}
            {showTopicBrowser && (
              <div className="bg-[var(--color-canvas)] border-b border-[var(--color-hairline)] px-4 py-3 shrink-0 max-h-68 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                    Explore Campus Guide Topics
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowTopicBrowser(false)}
                    className="text-xs font-semibold text-[var(--color-brand)] hover:underline cursor-pointer"
                  >
                    Back to chat
                  </button>
                </div>

                <div
                  role="tablist"
                  aria-label="Campus guide categories"
                  className="flex flex-wrap gap-1.5 pb-2.5 border-b border-[var(--color-hairline)]"
                >
                  {CHATBOT_CATEGORIES.map((cat) => {
                    const selected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selected
                            ? 'bg-[var(--color-brand)] text-white'
                            : 'bg-white text-[var(--color-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                        }`}
                      >
                        {cat.shortLabel}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 overflow-y-auto space-y-1 pr-1">
                  {categoryQuestions.map((faq) => (
                    <button
                      key={faq.id}
                      type="button"
                      onClick={() => submitQuestion(faq.question)}
                      className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-[var(--color-ink)] hover:bg-white hover:text-[var(--color-brand)] flex items-center justify-between gap-2 transition-colors cursor-pointer group"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)] group-hover:text-[var(--color-brand)] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Conversation Transcript */}
            <div
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[var(--color-canvas)]"
            >
              {messages.map((msg, msgIndex) => {
                const isBot = msg.sender === 'bot';
                const isLatestMessage = msgIndex === messages.length - 1;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}
                  >
                    {/* Quiet Inline Message Metadata */}
                    <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] mb-1 px-1">
                      <span className="font-semibold text-[var(--color-primary-ink)]">
                        {isBot ? 'CHC Campus Guide' : 'You'}
                      </span>
                      {isBot && msg.categoryLabel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[var(--color-brand)] font-medium">
                            {msg.categoryLabel}
                          </span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{msg.timestampLabel}</span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        isBot
                          ? 'bg-white text-[var(--color-ink)] border border-[var(--color-hairline)] rounded-tl-sm shadow-2xs space-y-2.5'
                          : 'bg-[var(--color-primary-ink)] text-white rounded-tr-sm'
                      }`}
                    >
                      {msg.textParagraphs.map((paragraph, pIdx) => (
                        <p key={pIdx} className="whitespace-pre-line">
                          {renderParagraphWithLinks(paragraph, isBot)}
                        </p>
                      ))}

                      {/* Administrative Verification Note (when applicable) */}
                      {isBot && msg.verificationNote && (
                        <div className="mt-2.5 rounded-lg border border-[var(--color-brand-border)] bg-[var(--color-brand-soft)] px-3 py-2 text-xs text-[var(--color-primary-ink)] leading-relaxed">
                          <span className="font-semibold text-[var(--color-brand)]">
                            Administrative Note:{' '}
                          </span>
                          {msg.verificationNote}
                        </div>
                      )}

                      {/* Direct Telephone Strip on Fallback */}
                      {isBot && msg.isFallback && (
                        <div className="pt-2 border-t border-[var(--color-hairline)] flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)]">
                          <a
                            href="tel:015312399"
                            className="inline-flex items-center gap-1 font-semibold text-[var(--color-brand)] hover:underline tabular-nums"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            01-5312399
                          </a>
                          <span aria-hidden="true">·</span>
                          <a
                            href="mailto:info.capitolhillcollege@gmail.com"
                            className="font-medium text-[var(--color-primary-ink)] hover:text-[var(--color-brand)] hover:underline break-all"
                          >
                            info.capitolhillcollege@gmail.com
                          </a>
                        </div>
                      )}

                      {/* Contextual Navigation / Enquiry / External Map Buttons */}
                      {isBot && msg.actions && msg.actions.length > 0 && (
                        <div className="pt-2 flex flex-wrap gap-2">
                          {msg.actions.map((act, actIdx) => {
                            const btnClasses = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                              actIdx === 0
                                ? 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]'
                                : 'bg-[var(--color-canvas)] text-[var(--color-primary-ink)] border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                            }`;

                            if (act.externalHref) {
                              return (
                                <a
                                  key={`${msg.id}-act-${actIdx}`}
                                  href={act.externalHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={btnClasses}
                                >
                                  <span>{act.label}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                </a>
                              );
                            }

                            return (
                              <button
                                key={`${msg.id}-act-${actIdx}`}
                                type="button"
                                onClick={() => handleQuickActionClick(act)}
                                className={btnClasses}
                              >
                                <span>{act.label}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Optional Quick-Start / Follow-Up Suggestions */}
                    {isBot &&
                      isLatestMessage &&
                      !isTyping &&
                      msg.suggestedQuestions &&
                      msg.suggestedQuestions.length > 0 && (
                        <div className="mt-2.5 w-full">
                          <p className="text-[11px] font-medium text-[var(--color-muted)] mb-1.5 px-1">
                            {msg.id === 'welcome-msg'
                              ? 'Popular things to ask:'
                              : 'You can also ask:'}
                          </p>
                          <div
                            className={
                              msg.id === 'welcome-msg'
                                ? 'flex flex-col gap-1.5'
                                : 'flex flex-wrap gap-1.5'
                            }
                          >
                            {msg.suggestedQuestions.map((questionText) =>
                              msg.id === 'welcome-msg' ? (
                                <button
                                  key={questionText}
                                  type="button"
                                  onClick={() => submitQuestion(questionText)}
                                  className="w-full text-left px-3 py-2 rounded-xl bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:bg-[var(--color-brand-soft)]/50 text-xs font-medium text-[var(--color-primary-ink)] flex items-center justify-between gap-2 transition-colors cursor-pointer group"
                                >
                                  <span className="leading-snug">{questionText}</span>
                                  <ChevronRight className="w-3.5 h-3.5 text-[var(--color-muted)] group-hover:text-[var(--color-brand)] shrink-0 transition-transform group-hover:translate-x-0.5" />
                                </button>
                              ) : (
                                <button
                                  key={questionText}
                                  type="button"
                                  onClick={() => submitQuestion(questionText)}
                                  className="text-left px-3 py-1.5 rounded-lg bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] text-xs font-medium text-[var(--color-primary-ink)] transition-colors cursor-pointer"
                                >
                                  {questionText}
                                </button>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTyping && (
                <div
                  className="flex flex-col items-start"
                  aria-label="CHC Campus Guide is typing"
                >
                  <span className="text-[11px] font-medium text-[var(--color-muted)] mb-1 px-1">
                    CHC Campus Guide
                  </span>
                  <div className="bg-white border border-[var(--color-hairline)] rounded-2xl rounded-tl-sm px-4 py-3 shadow-2xs inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand)] animate-pulse [animation-delay:240ms]" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Question Input Form */}
            <form
              onSubmit={handleFormSubmit}
              className="bg-white border-t border-[var(--color-hairline)] p-3 shrink-0"
            >
              <div className="flex items-center gap-2">
                <label htmlFor={inputId} className="sr-only">
                  Chat with CHC Campus Guide
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  maxLength={240}
                  placeholder="Ask about Teku location, programs, or say hi..."
                  className="flex-1 min-w-0 h-11 px-3.5 text-sm text-[var(--color-ink)] bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl placeholder:text-[var(--color-muted)] focus:bg-white focus:border-[var(--color-brand)] focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  aria-label="Send message"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white transition-colors shrink-0 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <SendHorizontal className="w-4 h-4" />
                </button>
              </div>
              <p className="mt-1.5 px-1 text-[10px] text-[var(--color-muted)] flex items-center justify-between gap-2">
                <span>CAPITOL HILL COLLEGE · Teku, Kathmandu</span>
                <button
                  type="button"
                  onClick={() =>
                    handleQuickActionClick({
                      label: 'Contact Admissions',
                      action: 'scroll-contact',
                    })
                  }
                  className="font-semibold text-[var(--color-brand)] hover:underline cursor-pointer"
                >
                  Direct Contact
                </button>
              </p>
            </form>
          </motion.section>
        ) : (
          <div
            key="chc-campus-guide-launcher-stack"
            className="flex flex-col items-end gap-2.5"
          >
            {/* Atlantis University-Inspired Greeting Notification Bubble */}
            <AnimatePresence>
              {showGreetingBubble && !greetingDismissed && (
                <motion.div
                  key="chc-greeting-callout"
                  initial={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 10, scale: 0.96 }
                  }
                  animate={
                    prefersReducedMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  exit={
                    prefersReducedMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 6, scale: 0.96 }
                  }
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  onClick={handleOpenFromGreeting}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOpenFromGreeting();
                    }
                  }}
                  aria-label="Hello! How can I help you today? Click to chat with CHC Campus Guide"
                  className="pointer-events-auto relative max-w-[268px] sm:max-w-[296px] rounded-2xl rounded-br-sm bg-white border border-[var(--color-hairline)] hover:border-[var(--color-brand)] px-4 py-3.5 shadow-xl cursor-pointer transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-[var(--color-brand)] tracking-tight">
                        CHC Campus Guide
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--color-primary-ink)] leading-snug">
                        Hello! How can I help you today?
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-muted)] leading-relaxed">
                        Have a question about programs, admissions, or our Teku campus? Chat with us here!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleDismissGreeting}
                      aria-label="Dismiss chat greeting notification"
                      title="Dismiss"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-canvas)] hover:text-[var(--color-primary-ink)] transition-colors shrink-0 cursor-pointer -mr-1 -mt-0.5"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rebranded College Launcher Button */}
            <motion.button
              ref={launcherButtonRef}
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open CHC Campus Guide chat"
              aria-expanded={isOpen}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative inline-flex items-center gap-2.5 h-12 sm:h-13 pl-3.5 pr-4 sm:pr-5 rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white border border-white/20 shadow-lg transition-colors cursor-pointer group"
            >
              <span className="relative w-8 h-8 rounded-full bg-white text-[var(--color-brand)] flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 fill-current" />
                {!greetingDismissed && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary-ink)] text-[9px] font-bold text-white ring-2 ring-[var(--color-brand)]"
                  >
                    1
                  </span>
                )}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  CHC Campus Guide
                </span>
                <span className="hidden sm:block text-[10px] text-white/85 whitespace-nowrap">
                  Chat with us · Teku, Kathmandu
                </span>
              </span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
