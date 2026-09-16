import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, MessageSquareDashed } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useChats } from '@/context/ChatContext'
import { ChatList } from '@/components/chat/ChatList/ChatList'
import { ChatWindow } from '@/components/chat/ChatWindow/ChatWindow'
import { EmptyState, SearchInput } from '@/components/ui/Bits/Bits'
import { cx } from '@/lib/utils'
import './ChatPage.css'

/**
 * One screen serving both chat routes. Phones show either the list or the
 * thread; from desktop widths up both panes sit side by side.
 */
export function ChatPage({ role }) {
  const { id } = useParams()
  const { user } = useAuth()
  const { conversations, byId, send, markRead } = useChats()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const basePath = role === 'farmer' ? '/farmer/chats' : '/buyer/chats'
  const currentUserId = user?.id ?? ''

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return conversations
    return conversations.filter(
      (c) =>
        c.participantName.toLowerCase().includes(q) ||
        c.messages.some((m) => m.body.toLowerCase().includes(q)),
    )
  }, [conversations, query])

  // On desktop a thread is always shown; default to the first conversation.
  const active = id ? byId(id) : filtered[0]

  useEffect(() => {
    if (id) markRead(id)
  }, [id, markRead])

  const showThreadOnMobile = Boolean(id)

  return (
    <div className="chat-page">
      {/* Mobile thread header */}
      {showThreadOnMobile && active ? (
        <header className="chat-header chat-header--mobile-only">
          <button
            type="button"
            onClick={() => navigate(basePath)}
            aria-label="Back to chats"
            className="icon-btn"
          >
            <ChevronLeft className="icon-md" />
          </button>
          <img src={active.participantAvatar} alt="" className="chat-avatar" />
          <div className="min-w-0">
            <p className="chat-title">{active.participantName}</p>
            <p className={cx('chat-status', active.online && 'chat-status--online')}>
              {active.online ? 'Online' : active.lastSeen}
            </p>
          </div>
        </header>
      ) : (
        <header className={cx('chat-list-header', showThreadOnMobile && 'chat-list-header--hidden-mobile')}>
          <button
            type="button"
            onClick={() => navigate(role === 'farmer' ? '/farmer' : '/buyer')}
            aria-label="Go back"
            className="icon-btn icon-btn--mobile-only"
          >
            <ChevronLeft className="icon-md" />
          </button>
          <h1 className={cx('chat-list-title', role === 'buyer' && 'chat-list-title--buyer')}>Chats</h1>
          <span className="spacer-40" />
        </header>
      )}

      <div className="chat-body">
        {/* List pane */}
        <section className={cx('chat-list-pane', showThreadOnMobile && 'chat-list-pane--hidden-mobile')}>
          <div className="chat-search-wrap">
            <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search product..." />
          </div>
          <div className="chat-list-scroll">
            {filtered.length ? (
              <ChatList
                conversations={filtered}
                basePath={basePath}
                currentUserId={currentUserId}
                activeId={active?.id}
              />
            ) : (
              <div className="p-4">
                <EmptyState
                  icon={<MessageSquareDashed className="icon-md-lg" />}
                  title="No conversations found"
                  description="Try a different name or message."
                />
              </div>
            )}
          </div>
        </section>

        {/* Thread pane */}
        <section className={cx('chat-thread-pane', !showThreadOnMobile && 'chat-thread-pane--hidden-mobile')}>
          {active ? (
            <>
              <header className="chat-thread-header">
                <img src={active.participantAvatar} alt="" className="chat-avatar" />
                <div className="min-w-0">
                  <p className="chat-thread-title">{active.participantName}</p>
                  <p className="chat-status chat-status--online">
                    {active.online ? 'Online' : active.lastSeen}
                  </p>
                </div>
              </header>
              <ChatWindow
                conversation={active}
                currentUserId={currentUserId}
                onSend={(body) => send(active.id, currentUserId, body)}
              />
            </>
          ) : (
            <div className="chat-empty-wrap">
              <EmptyState
                icon={<MessageSquareDashed className="icon-md-lg" />}
                title="Pick a conversation"
                description="Choose a chat on the left to start messaging."
              />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}