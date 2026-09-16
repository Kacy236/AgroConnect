import { Link } from 'react-router-dom'
import { Check, CheckCheck } from 'lucide-react'
import { chatStamp, cx } from '@/lib/utils'
import './ChatList.css'

function lastMessage(c) {
  return c.messages[c.messages.length - 1]
}

export function ChatList({ conversations, basePath, currentUserId, activeId }) {
  return (
    <ul className="chat-list">
      {conversations.map((c) => {
        const last = lastMessage(c)
        const unread = c.messages.filter((m) => !m.read).length
        const mine = last?.from === currentUserId
        return (
          <li key={c.id}>
            <Link to={`${basePath}/${c.id}`} className={cx('chat-list-item', activeId === c.id && 'chat-list-item-active')}>
              <img src={c.participantAvatar} alt="" className="chat-list-avatar" />
              <div className="chat-list-info">
                <p className="chat-list-name">{c.participantName}</p>
                <p className="chat-list-preview">
                  {mine ? (
                    last?.read ? (
                      <CheckCheck className="icon-16" style={{ color: '#4A9BF5', flexShrink: 0 }} />
                    ) : (
                      <Check className="icon-16" style={{ flexShrink: 0 }} />
                    )
                  ) : null}
                  <span className="chat-list-preview-text">{last?.body ?? 'No messages yet'}</span>
                </p>
              </div>
              <div className="chat-list-meta">
                <span className={cx('chat-list-time', unread && 'chat-list-time-unread')}>{last ? chatStamp(last.at) : ''}</span>
                {unread ? <span className="chat-list-badge">{unread}</span> : null}
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}