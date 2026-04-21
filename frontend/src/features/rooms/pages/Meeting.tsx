import socket from "../sockets/socket"
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../auth/hooks/useAuth"
import { usePeer } from "../hooks/usePeer"
import ReactPlayer from "react-player"

const Meeting = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { handleLogout } = useAuth()
  const { peer, createOffer, createAnswer, setRemoteDescription, addIceCandidate } = usePeer()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ message: string; username: string }>>([])
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [isSocketConnected, setIsSocketConnected] = useState(socket.connected)
  const [myStream, setMyStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMicEnabled, setIsMicEnabled] = useState(true)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const initialTheme: "light" | "dark" = savedTheme === "dark" ? "dark" : "light"
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const nextTheme: "light" | "dark" = theme === "light" ? "dark" : "light"
    setTheme(nextTheme)
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    localStorage.setItem("theme", nextTheme)
  }

  useEffect(() => {
    const player = localVideoRef.current
    if (!player) {
      return
    }

    if (!myStream) {
      player.srcObject = null
      return
    }

    if (player.srcObject !== myStream) {
      player.srcObject = myStream
    }

    const playPromise = player.play()
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error: unknown) => {
        const mediaError = error as { name?: string; message?: string }
        if (mediaError?.name !== "AbortError") {
          console.log("Local stream play failed", mediaError?.message ?? error)
        }
      })
    }
  }, [myStream])

  useEffect(() => {
    const player = remoteVideoRef.current
    if (!player) {
      return
    }

    if (!remoteStream) {
      player.srcObject = null
      return
    }

    if (player.srcObject !== remoteStream) {
      player.srcObject = remoteStream
    }

    const playPromise = player.play()
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((error: unknown) => {
        const mediaError = error as { name?: string; message?: string }
        if (mediaError?.name !== "AbortError") {
          console.log("Remote stream play failed", mediaError?.message ?? error)
        }
      })
    }
  }, [remoteStream])

  useEffect(() => {
    let mounted = true

    const handleTrack = (event: RTCTrackEvent) => {
      const [incomingStream] = event.streams
      if (incomingStream) {
        setRemoteStream(incomingStream)
      }
    }

    const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
      if (!event.candidate || !roomId) {
        return
      }
      socket.emit("ice-candidate", { roomId, candidate: event.candidate.toJSON() })
    }

    const setupLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        setMyStream(stream)
        stream.getTracks().forEach((track) => {
          const alreadyAdded = peer.getSenders().some((sender) => sender.track?.id === track.id)
          if (!alreadyAdded) {
            peer.addTrack(track, stream)
          }
        })
      } catch (error) {
        console.log("Unable to access camera/microphone", error)
      }
    }

    peer.addEventListener("track", handleTrack)
    peer.addEventListener("icecandidate", handleIceCandidate)
    void setupLocalMedia()

    return () => {
      mounted = false
      peer.removeEventListener("track", handleTrack)
      peer.removeEventListener("icecandidate", handleIceCandidate)
      setMyStream((current) => {
        current?.getTracks().forEach((track) => track.stop())
        return null
      })
      setRemoteStream(null)
    }
  }, [peer, roomId])

  useEffect(() => {
    if (!roomId) {
      console.log("Cannot find roomId")
      return
    }

    const joinRoom = () => {
      socket.emit("join-room", { roomId })
    }

    const handleConnect = () => {
      setIsSocketConnected(true)
      joinRoom()
    }

    const handleDisconnect = () => {
      setIsSocketConnected(false)
    }

    const handleUserJoined = async ({ userId }: { userId: string }) => {
      console.log(`${userId} joined ${roomId}`)
      const offer = await createOffer()
      socket.emit("call-user", { userId, offer })
    }

    const handleIncomingMessage = ({ message: incomingMessage, username }: { message: string; username: string }) => {
      setMessages((currentMessages) => [...currentMessages, { message: incomingMessage, username }])
    }

    const handleConnectError = (error: Error) => {
      console.log("Socket connection failed:", error.message)
    }
    const handleIncomingCall = async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log("Incoming call from ", from, offer)
      const answer = await createAnswer(offer)
      socket.emit("call-accepted", { userId: from, answer })
    }

    const handleCallAccepting = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      await setRemoteDescription(answer)
    }

    const handleIncomingIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      await addIceCandidate(candidate)
    }

    socket.on("connect", handleConnect)
    socket.on("disconnect", handleDisconnect)
    socket.on("user-joined", handleUserJoined)
    socket.on("message", handleIncomingMessage)
    socket.on("connect_error", handleConnectError)
    socket.on("incoming-call", handleIncomingCall)
    socket.on("call-accepted", handleCallAccepting)
    socket.on("ice-candidate", handleIncomingIceCandidate)
    if (socket.connected) {
      setIsSocketConnected(true)
      joinRoom()
    } else {
      socket.connect()
    }
    return () => {
      socket.off("connect", handleConnect)
      socket.off("disconnect", handleDisconnect)
      socket.off("user-joined", handleUserJoined)
      socket.off("message", handleIncomingMessage)
      socket.off("connect_error", handleConnectError)
      socket.off("incoming-call", handleIncomingCall)
      socket.off("call-accepted", handleCallAccepting)
      socket.off("ice-candidate", handleIncomingIceCandidate)
      socket.disconnect()
    }
  }, [roomId, createOffer, createAnswer, setRemoteDescription, addIceCandidate])

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

  const handleToggleMute = () => {
    if (!myStream) {
      return
    }
    const nextValue = !isMicEnabled
    myStream.getAudioTracks().forEach((track) => {
      track.enabled = nextValue
    })
    setIsMicEnabled(nextValue)
  }

  const handleToggleVideo = () => {
    if (!myStream) {
      return
    }
    const nextValue = !isVideoEnabled
    myStream.getVideoTracks().forEach((track) => {
      track.enabled = nextValue
    })
    setIsVideoEnabled(nextValue)
  }

  const stopLocalTracks = () => {
    myStream?.getTracks().forEach((track) => track.stop())
    setMyStream(null)
  }

  const handleLeaveMeeting = () => {
    stopLocalTracks()
    setRemoteStream(null)
    if (socket.connected) {
      socket.disconnect()
    }
    navigate("/meeting")
  }

  const handleLogoutClick = async () => {
    try {
      stopLocalTracks()
      setRemoteStream(null)
      if (socket.connected) {
        socket.disconnect()
      }
      await handleLogout()
      navigate("/signin")
    } catch {
      console.log("Logout failed")
    }
  }

  return (
    <main className="diagnostic-grid min-h-screen bg-[#f5f5f5] text-[#3f3f3f] transition-colors duration-300 dark:bg-[#0f1115] dark:text-gray-100">
      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        className="fixed right-5 top-5 z-30 flex items-center justify-center border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
      >
        <span className={`transition-transform duration-300 ${theme === "light" ? "rotate-0" : "rotate-180"}`}>
          {theme === "light" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 transition-transform duration-300"
            >
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3a7.2 7.2 0 0 0 9.8 9.8z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4 transition-transform duration-300"
            >
              <circle cx="12" cy="12" r="4" />
              <path
                d="M12 2v2.2M12 19.8V22M22 12h-2.2M4.2 12H2M19.1 4.9l-1.6 1.6M6.5 17.5l-1.6 1.6M19.1 19.1l-1.6-1.6M6.5 6.5 4.9 4.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
      </button>

      {/* Top status bar */}
      <header className="border-b border-[#d6d6d6] px-6 py-4 dark:border-white/10 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-normal tracking-[0.34em] text-[#7d7d7d] dark:text-white/50">ACTIVE SESSION</p>
              <p className="mt-2 text-xs tracking-[0.16em] text-[#8a8a8a] dark:text-white/35">MEETING / LIVE</p>
            </div>
            <div className="flex items-center gap-3">
              <p className={`text-[10px] tracking-[0.18em] ${isSocketConnected ? "text-[#5b8f5b] dark:text-emerald-300" : "text-[#a67853] dark:text-amber-300"}`}>
                {isSocketConnected ? "SOCKET ONLINE" : "CONNECTING"}
              </p>
              <p className="font-mono text-[11px] tracking-[0.2em] text-[#8c8c8c] dark:text-white/35">{roomId}</p>
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

      <div className="relative mx-auto max-w-7xl px-6 py-8 sm:px-10 lg:px-16">
        {/* Decorative background accents */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="diagnostic-blur left-[8%] top-[12%] h-40 w-48" />
          <div className="diagnostic-blur right-[14%] top-[44%] h-56 w-56" />
        </div>

        <div className="relative grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Primary video stage */}
          <div className="border border-[#d7d7d7] bg-[#f6f6f6]/80 p-8 dark:border-white/10 dark:bg-white/5">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded border border-[#cccccc] bg-[#e8e8e8] p-2 dark:border-white/15 dark:bg-white/10">
                <p className="mb-2 text-[10px] tracking-[0.18em] text-[#7d7d7d] dark:text-white/45">YOU</p>
                <div className="aspect-video overflow-hidden rounded bg-[#111]">
                  {myStream ? (
                    <ReactPlayer
                      ref={(node) => {
                        localVideoRef.current = node as HTMLVideoElement | null
                      }}
                      muted
                      playing={false}
                      playsInline
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm tracking-[0.12em] text-[#a0a0a0]">CAMERA OFFLINE</div>
                  )}
                </div>
              </div>

              <div className="rounded border border-[#cccccc] bg-[#e8e8e8] p-2 dark:border-white/15 dark:bg-white/10">
                <p className="mb-2 text-[10px] tracking-[0.18em] text-[#7d7d7d] dark:text-white/45">REMOTE</p>
                <div className="aspect-video overflow-hidden rounded bg-[#111]">
                  {remoteStream ? (
                    <ReactPlayer
                      ref={(node) => {
                        remoteVideoRef.current = node as HTMLVideoElement | null
                      }}
                      playing={false}
                      playsInline
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm tracking-[0.12em] text-[#a0a0a0]">WAITING FOR PEER VIDEO</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Participants and quick actions */}
          <aside className="border border-[#d7d7d7] p-6 dark:border-white/10 dark:bg-white/5">
            <p className="text-[10px] tracking-[0.3em] text-[#7e7e7e] uppercase dark:text-white/45">PARTICIPANTS</p>
            <div className="mt-5 space-y-3">
              <div className="rounded border border-[#e1e1e1] bg-[#fafafa] p-3 dark:border-white/10 dark:bg-white/5">
                <p className="text-[11px] tracking-[0.08em] text-[#5c5c5c] dark:text-white/60">You</p>
              </div>
            </div>

            <div className="mt-6 border-t border-[#dcdcdc] pt-4 dark:border-white/10">
              <p className="text-[10px] tracking-[0.28em] text-[#858585] uppercase dark:text-white/40">CONTROLS</p>
              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleLeaveMeeting}
                  className="w-full border border-[#c9c9c9] px-3 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10"
                >
                  Leave
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Room chat feed */}
        <section className="relative mt-6 border border-[#d7d7d7] bg-[#f6f6f6]/80 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between border-b border-[#dcdcdc] pb-3 dark:border-white/10">
            <p className="text-[10px] tracking-[0.3em] text-[#7e7e7e] uppercase dark:text-white/45">CONVERSATION</p>
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

          <div className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
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

        {/* Bottom action row: call controls + chat input */}
        <div className="mt-6 border-t border-[#d9d9d9] pt-4 dark:border-white/10">
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleToggleMute}
              className="rounded border border-[#d2d2d2] px-4 py-2 text-[11px] tracking-[0.2em] transition-colors duration-200 hover:border-[#a8a8a8] hover:bg-[#efefef] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10"
            >
              {isMicEnabled ? "MUTE" : "UNMUTE"}
            </button>
            <button
              type="button"
              onClick={handleToggleVideo}
              className="rounded border border-[#d2d2d2] px-4 py-2 text-[11px] tracking-[0.2em] transition-colors duration-200 hover:border-[#a8a8a8] hover:bg-[#efefef] dark:border-white/20 dark:hover:border-white/40 dark:hover:bg-white/10"
            >
              {isVideoEnabled ? "VIDEO OFF" : "VIDEO ON"}
            </button>
            <button
              type="button"
              onClick={handleLeaveMeeting}
              className="rounded border border-[#b44b4b] px-4 py-2 text-[11px] tracking-[0.2em] text-[#b44b4b] transition-colors duration-200 hover:border-[#8a3a3a] hover:bg-[#f5e5e5] dark:border-red-400/50 dark:text-red-300 dark:hover:bg-red-950/30"
            >
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
