import { useChat, useChatToggle, useMaybeLayoutContext } from "@livekit/components-react";
import type { ChatMessage, Participant } from "livekit-client";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import { cloneSingleChild } from "../../utils/clone_single_child";
import { Card } from "../ui/card";
import { MessageCircleOff, MessagesSquare, Send, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { createDefaultGrammar, tokenize } from "@/utils/message_utils";

export interface ReceivedChatMessage extends ChatMessage {
  from?: Participant;
}

export interface LegacyChatMessage extends ChatMessage {
  ignoreLegacy?: boolean;
}

export interface LegacyReceivedChatMessage extends ReceivedChatMessage {
  ignoreLegacy?: boolean;
}
export type MessageEncoder = (message: LegacyChatMessage) => Uint8Array;
export type MessageDecoder = (message: Uint8Array) => LegacyReceivedChatMessage;

export type ChatOptions = {
  /** @deprecated the new chat API doesn't rely on encoders and decoders anymore and uses a dedicated chat API instead */
  messageEncoder?: (message: LegacyChatMessage) => Uint8Array;
  /** @deprecated the new chat API doesn't rely on encoders and decoders anymore and uses a dedicated chat API instead */
  messageDecoder?: (message: Uint8Array) => LegacyReceivedChatMessage;
  channelTopic?: string;

  updateChannelTopic?: string;
};

export interface ChatProps extends React.HTMLAttributes<HTMLDivElement>, ChatOptions {
  messageFormatter?: MessageFormatter;
}

export function Chat({
  messageFormatter,
  messageDecoder,
  messageEncoder,
  channelTopic,
  ...props
}: ChatProps) {
  const ulRef = useRef<HTMLUListElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatOptions: ChatOptions = useMemo(() => {
    return { messageDecoder, messageEncoder, channelTopic };
  }, [messageDecoder, messageEncoder, channelTopic]);

  const { chatMessages, send, isSending } = useChat(chatOptions);

  const layoutContext = useMaybeLayoutContext();
  const lastReadMsgAt = useRef<ChatMessage['timestamp']>(0);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (inputRef.current && inputRef.current.value.trim() !== '') {
      await send(inputRef.current.value);
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  }

  useEffect(() => {
    if (ulRef) {
      ulRef.current?.scrollTo({ top: ulRef.current.scrollHeight });
    }
  }, [ulRef, chatMessages]);

  useEffect(() => {
    if (!layoutContext || chatMessages.length === 0) {
      return;
    }

    if (
      layoutContext.widget.state?.showChat &&
      chatMessages.length > 0 &&
      lastReadMsgAt.current !== chatMessages[chatMessages.length - 1]?.timestamp
    ) {
      lastReadMsgAt.current = chatMessages[chatMessages.length - 1]?.timestamp;
      return;
    }

    const unreadMessageCount = chatMessages.filter(
      (msg) => !lastReadMsgAt.current || msg.timestamp > lastReadMsgAt.current,
    ).length;

    const { widget } = layoutContext;
    if (unreadMessageCount > 0 && widget.state?.unreadMessages !== unreadMessageCount) {
      widget.dispatch?.({ msg: 'unread_msg', count: unreadMessageCount });
    }
  }, [chatMessages, layoutContext?.widget]);

  return (
    <Card {...props} className="lk-chat w-[100px] z-[1] mb-[80px] sticky mt-2 ml-2 right-2 p-0">
      <div className="lk-chat-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-2">
            <MessagesSquare/>
            <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        {layoutContext && (
          <ChatToggle className="lk-close-button">
            <X/>
          </ChatToggle>
        )}
      </div>

    {chatMessages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full p-4 text-muted-foreground gap-5">
            <MessageCircleOff size="120"/>
            <p>No messages yet.</p>
        </div>
    )}

    <ul className="lk-list lk-chat-messages" ref={ulRef} style={{ padding: "0 10px" }}>
      {props.children
        ? chatMessages.map((msg, idx) =>
          cloneSingleChild(props.children, {
            entry: msg,
            key: msg.id ?? idx,
            messageFormatter,
          }),
        )
        : chatMessages.map((msg, idx, allMsg) => {
          const hideName = idx >= 1 && allMsg[idx - 1].from === msg.from;
          // If the time delta between two messages is bigger than 60s show timestamp.
          const hideTimestamp = idx >= 1 && msg.timestamp - allMsg[idx - 1].timestamp < 60_000;

          return (
            <ChatEntry
            key={msg.id ?? idx}
            hideName={hideName}
            hideTimestamp={hideName === false ? false : hideTimestamp}
            entry={msg}
            messageFormatter={messageFormatter}
            />
          );
        })}
    </ul>
      <form className="lk-chat-form" onSubmit={handleSubmit}>
        <Input
          className="lk-form-control lk-chat-form-input"
          disabled={isSending}
          ref={inputRef}
          type="text"
          placeholder="Enter a message..."
          onInput={(ev) => ev.stopPropagation()}
          onKeyDown={(ev) => ev.stopPropagation()}
          onKeyUp={(ev) => ev.stopPropagation()}
        />
        <Button size="default" type="submit" disabled={isSending}>
            <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  );
}

export interface ChatToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const ChatToggle: (
  props: ChatToggleProps & React.RefAttributes<HTMLButtonElement>,
) => React.ReactNode = /* @__PURE__ */ forwardRef<HTMLButtonElement, ChatToggleProps>(
  function ChatToggle(props: ChatToggleProps, ref) {
    const { mergedProps } = useChatToggle({ props });

    return (
      <Button ref={ref} {...mergedProps} className="" variant={"ghost"}>
        {props.children}
      </Button>
    );
  },
);

export type MessageFormatter = (message: string) => React.ReactNode;

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  entry: ReceivedChatMessage;
  hideName?: boolean;
  hideTimestamp?: boolean;
  messageFormatter?: MessageFormatter;
}

export const ChatEntry: (
    props: ChatEntryProps & React.RefAttributes<HTMLLIElement>,
) => React.ReactNode = /* @__PURE__ */ forwardRef<HTMLLIElement, ChatEntryProps>(
    function ChatEntry(
        { entry, hideName = false, hideTimestamp = false, messageFormatter, ...props }: ChatEntryProps,
        ref,
    ) {
        const formattedMessage = useMemo(() => {
            return messageFormatter ? messageFormatter(entry.message) : entry.message;
        }, [entry.message, messageFormatter]);
        const hasBeenEdited = !!entry.editTimestamp;
        const time = new Date(entry.timestamp);
        const locale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';

        const name = entry.from?.name ?? entry.from?.identity ?? "Unknown";
        const isOwnMessage = entry.from?.isLocal;

        return (
            <li ref={ref} {...props} className="list-none">
                <div className={`space-y-1 ${isOwnMessage ? "text-right" : "text-left"}`}>
                    <div
                        className={`flex items-center gap-2 text-xs text-muted-foreground ${
                            isOwnMessage ? "justify-end" : "justify-start"
                        }`}
                    >
                        {!isOwnMessage && !hideName && <span className="font-medium">{name}</span>}
                        {!hideTimestamp && (
                            <span>
                                {hasBeenEdited && 'edited '}
                                {time.toLocaleTimeString(locale, { timeStyle: 'short' })}
                            </span>
                        )}
                    </div>
                    <div className={`inline-block max-w-[80%] ${isOwnMessage ? "ml-auto" : "mr-auto"}`}>
                        <div
                            className={`p-3 rounded-lg text-sm ${
                                isOwnMessage
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                            }`}
                        >
                            <span className="lk-message-body">{formattedMessage}</span>
                            <span className="lk-message-attachements">
                                {entry.attachedFiles?.map(
                                    (file) =>
                                        file.type.startsWith('image/') && (
                                            <img
                                                style={{ maxWidth: '300px', maxHeight: '300px' }}
                                                key={file.name}
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                            />
                                        ),
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </li>
        );
    },
);

/** @public */
export function formatChatMessageLinks(message: string): React.ReactNode {
  return tokenize(message, createDefaultGrammar()).map((tok, i) => {
    if (typeof tok === `string`) {
      return tok;
    } else {
      const content = tok.content.toString();
      const href =
        tok.type === `url`
          ? /^http(s?):\/\//.test(content)
            ? content
            : `https://${content}`
          : `mailto:${content}`;
      return (
        <a className="lk-chat-link" key={i} href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      );
    }
  });
}


