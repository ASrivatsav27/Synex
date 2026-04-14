import socket from "../sockets/socket"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"

const Meeting = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { handleLogout } = useAuth()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ message: string; username: string }>>([])

  useEffect(() => {
    if (!roomId) {
      return console.log("Cannot find roomId")
    }

    socket.emit("join-room", { roomId })

    const handleUserJoined = ({ userId }: { userId: string }) => {
      console.log(`${userId} joined ${roomId}`)
    }

    const handleIncomingMessage = ({ message, username }: { message: string; username: string }) => {
      setMessages((currentMessages) => [...currentMessages, { message, username }])
    }

    socket.on("user-joined", handleUserJoined)
    socket.on("message", handleIncomingMessage)

    return () => {
      socket.off("user-joined", handleUserJoined)
      socket.off("message", handleIncomingMessage)
    }
  }, [roomId])

  const handleMessage = (event: React.FormEvent) => {
    event.preventDefault()

    if (!message.trim() || !roomId) {
      return
    }
    socket.emit("message-listen", { roomId, message })
    setMessage("")
  }

  const handleClearChat = () => {
    setMessages([])
  }

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
      navigate("/signin")
    } catch {
      console.log("Logout failed")
    }
  }

  return (
    <main className="diagnostic-grid min-h-screen bg-[#f5f5f5] text-[#3f3f3f] transition-colors duration-300 dark:bg-[#0f1115] dark:text-gray-100">
      {/* Header */}
      <header className="border-b border-[#d6d6d6] px-6 py-4 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-normal tracking-[0.34em] text-[#7d7d7d] dark:text-white/50">ACTIVE SESSION</p>
              <p className="mt-2 text-xs tracking-[0.16em] text-[#8a8a8a] dark:text-white/35">MEETING / LIVE</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-[11px] tracking-[0.2em] text-[#8c8c8c] dark:text-white/35 font-mono">{roomId}</p>
              <button
                type="button"
                onClick={handleLogoutClick}
                className="border border-[#c9c9c9] px-3 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="diagnostic-blur left-[8%] top-[12%] h-40 w-48" />
          <div className="diagnostic-blur right-[14%] top-[44%] h-56 w-56" />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Video Area */}
          <div className="border border-[#d7d7d7] bg-[#f6f6f6]/80 p-8 dark:border-white/10 dark:bg-white/5">
            <div className="aspect-video rounded border border-[#cccccc] bg-[#e8e8e8] flex items-center justify-center dark:border-white/15 dark:bg-white/10">
              <p className="text-sm tracking-[0.12em] text-[#7d7d7d] dark:text-white/45">VIDEO STREAM</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="border border-[#d7d7d7] p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] tracking-[0.3em] text-[#7e7e7e] dark:text-white/45 uppercase">PARTICIPANTS</p>
            <div className="mt-5 space-y-3">
              <div className="rounded border border-[#e1e1e1] bg-[#fafafa] p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-[11px] tracking-[0.08em] text-[#5c5c5c] dark:text-white/60">You</p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#dcdcdc] pt-4 dark:border-white/10">
              <p className="text-[10px] tracking-[0.28em] text-[#858585] dark:text-white/40 uppercase">CONTROLS</p>
              <div className="mt-4 space-y-2">
                <button className="w-full border border-[#c9c9c9] px-3 py-2 text-[10px] tracking-[0.2em] uppercasee transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10">
                  Leave
                </button>
              </div>
            </div>
          </aside>
        </div>

        <section className="relative mt-6 border border-[#d7d7d7] bg-[#f6f6f6]/80 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between border-b border-[#dcdcdc] pb-3 dark:border-white/10">
            <p className="text-[10px] tracking-[0.3em] text-[#7e7e7e] dark:text-white/45 uppercase">CONVERSATION</p>
            <div className="flex items-center gap-3">
              <p className="text-[10px] tracking-[0.18em] text-[#8d8d8d] dark:text-white/35">LIVE ROOM CHAT</p>
              <button
                type="button"
                onClick={handleClearChat}
                className="border border-[#c9c9c9] px-3 py-1 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-4 max-h-72 overflow-y-auto pr-1 space-y-3">
            {messages.length === 0 ? (
              <p className="text-[11px] tracking-[0.08em] text-[#8d8d8d] dark:text-white/35">No messages yet. Send one below to start the conversation.</p>
            ) : (
              messages.map((item, index) => (
                <article
                  key={`${item.username}-${index}`}
                  className="rounded border border-[#cfcfcf] bg-white px-4 py-3 shadow-sm dark:border-white/10 dark:bg-[#12151c]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] tracking-[0.18em] text-[#7d7d7d] dark:text-white/40">{item.username}</p>
                    <span className="text-[10px] tracking-[0.14em] text-[#9b9b9b] dark:text-white/30">MESSAGE</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#3f3f3f] dark:text-gray-100">{item.message}</p>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Footer Controls */}
        <div className="mt-6 border-t border-[#d9d9d9] pt-4 dark:border-white/10">
          <div className="flex items-center justify-center gap-3">
            <button className="rounded border border-[#d2d2d2] px-4 py-2 text-[11px] tracking-[0.2em] transition-colors duration-200 hover:border-[#a8a8a8] hover:bg-[#efefef] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10">
              MUTE
            </button>
            <button className="rounded border border-[#d2d2d2] px-4 py-2 text-[11px] tracking-[0.2em] transition-colors duration-200 hover:border-[#a8a8a8] hover:bg-[#efefef] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10">
              VIDEO
            </button>
            <button className="rounded border border-[#b44b4b] px-4 py-2 text-[11px] tracking-[0.2em] text-[#b44b4b] transition-colors duration-200 hover:border-[#8a3a3a] hover:bg-[#f5e5e5] dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-950/30">
              END CALL
            </button>
            <form onSubmit={handleMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                placeholder="Enter your message"
                onChange={(event) => {
                  setMessage(event.target.value)
                }}
                className="w-72 border border-[#cccccc] bg-transparent px-3 py-2 text-sm tracking-[0.08em] text-[#444444] outline-none placeholder:text-[#9c9c9c] focus:border-[#9d9d9d] dark:border-white/15 dark:text-gray-200 dark:placeholder:text-white/35 dark:focus:border-white/35"
              />
              <button
                type="submit"
                className="border border-[#c9c9c9] px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Meeting