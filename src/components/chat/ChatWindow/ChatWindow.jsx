import { useEffect, useRef, useState } from 'react'
import { CheckCheck, Send } from 'lucide-react'
import { cx, shortTime } from '@/lib/utils'
import './ChatWindow.css'

export function ChatWindow({ conversation, currentUserId, onSend, showAvatars = true }) {
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [conversation.messages.length])

  function submit(e) {
    e.preventDefault()
    if (!draft.trim()) return
    onSend(draft)
    setDraft('')
  }

  return (
    <div className="chat-window">
      <div className="chat-window-scroll">
        <ul className="chat-window-list">
          {conversation.messages.map((m) => {
            const mine = m.from === currentUserId
            return (
              <li key={m.id} className={cx('chat-window-row', mine ? 'chat-window-row-mine' : 'chat-window-row-theirs')}>
                {!mine && showAvatars ? <img src={conversation.participantAvatar} alt="" className="chat-window-avatar" /> : null}
                <div className={cx('chat-window-bubble', mine ? 'chat-window-bubble-mine' : 'chat-window-bubble-theirs')}>
                  <p className="chat-window-text">{m.body}</p>
                  <p className={cx('chat-window-time', mine ? 'chat-window-time-mine' : 'chat-window-time-theirs')}>
                    {shortTime(m.at)}
                    {mine ? <CheckCheck className="icon-14" style={{ color: '#7FD4FF' }} /> : null}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="chat-window-form">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) submit(e)
          }}
          placeholder="Type a message"
          aria-label="Message"
          className="field chat-window-input"
        />
        <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="chat-window-send">
          <Send className="icon-20" style={{ transform: 'translateX(1px)' }} />
        </button>
      </form>
    </div>
  )
}