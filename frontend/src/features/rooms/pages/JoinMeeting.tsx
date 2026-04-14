import { useEffect, useState } from "react";
import { useRoom } from "../hooks/useRoom";
import { useNavigate } from "react-router-dom";

const statusRows = [
  { label: "LATENCY", value: "24ms" },
  { label: "NODES", value: "12" },
  { label: "UPTIME", value: "99.98%" },
  { label: "MODEL", value: "AI-COLLAB v2" },
];

const axisTicks = Array.from({ length: 7 }, (_, i) => i * 10);

const sampleCodes = ["A14", "C29", "R07", "M42", "T11"];

const JoinMeeting = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createStatus, setCreateStatus] = useState<"idle" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const { handleCreateRoom } = useRoom();
  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme: "light" | "dark" = savedTheme === "dark" ? "dark" : "light";
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme: "light" | "dark" = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("theme", nextTheme);
  };

  const onCreateRoom = async () => {
    if (isCreating) return;

    setIsCreating(true);
    setCreateStatus("idle");
    setFeedbackMessage("");

    try {
      const response = await handleCreateRoom();
      const newRoomCode = response.room.roomId;
      setRoomCode(newRoomCode);
      setCreateStatus("success");

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(newRoomCode);
        setFeedbackMessage("New room created. Code copied to clipboard.");
        return;
      }

      setFeedbackMessage("New room created. Room code is ready to join.");
    } catch {
      setCreateStatus("error");
      setFeedbackMessage("Could not create a room right now. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  const onJoinRoom = (event: React.FormEvent) => {
    if (!roomCode.trim()) {
      setFeedbackMessage("Please Enter a room code")
      return;
    }
    event.preventDefault()
    navigate(`/join-meeting/${roomCode}`)
 }
  return (

    <main className="diagnostic-grid min-h-screen bg-[#f5f5f5] px-6 py-8 text-[#3f3f3f] transition-colors duration-300 dark:bg-[#0f1115] dark:text-gray-100 sm:px-10 lg:px-16">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        className="fixed top-5 right-5 z-30 flex items-center justify-center border border-gray-300 bg-white px-3 py-2 text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
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

      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="diagnostic-blur left-[8%] top-[12%] h-40 w-48" />
          <div className="diagnostic-blur right-[14%] top-[44%] h-56 w-56" />
          <div className="diagnostic-blur bottom-[8%] left-[34%] h-44 w-44" />
        </div>

        <header className="relative mb-16 flex items-start justify-between border-b border-[#d6d6d6] pb-4 dark:border-white/10">
          <div>
            <p className="text-[10px] font-normal tracking-[0.34em] text-[#7d7d7d] dark:text-white/50">SESSION MONITOR</p>
            <p className="mt-2 text-xs tracking-[0.16em] text-[#8a8a8a] dark:text-white/35">MEETING / DIAGNOSTIC / LIVE</p>
          </div>
          <p className="text-[11px] tracking-[0.2em] text-[#8c8c8c] dark:text-white/35">UTC 09:42:16</p>
        </header>

        <section className="relative grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="pl-0 lg:pl-6">
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.28em] text-[#828282] dark:text-white/45">REAL-TIME COLLABORATION SYSTEM</p>
              <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-light text-[#3a3a3a] dark:text-gray-100 sm:text-5xl">
                Real-time collaboration system
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#666666] dark:text-gray-400">
                Clinical-grade video sessions with synchronized AI assistance, transcript analysis,
                and low-latency shared context for distributed teams.
              </p>
            </div>

            <div className="max-w-xl border border-[#dbdbdb] bg-[#f6f6f6]/80 p-6 dark:border-white/10 dark:bg-white/5">
              <label className="mb-3 block text-[10px] tracking-[0.24em] text-[#7c7c7c] dark:text-white/45">ROOM CODE</label>
              <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(event) => setRoomCode(event.target.value)}
                  placeholder="Enter session identifier"
                  className="w-full border border-[#cccccc] bg-transparent px-3 py-2 text-sm tracking-[0.12em] text-[#444444] outline-none transition-colors duration-200 placeholder:text-[#9c9c9c] focus:border-[#9d9d9d] dark:border-white/15 dark:text-gray-200 dark:placeholder:text-white/35 dark:focus:border-white/35"
                />
                <button
                  type="button"
                  onClick={onJoinRoom}
                  className="border border-[#c9c9c9] px-5 py-2 text-[11px] tracking-[0.2em] text-[#4c4c4c] uppercase transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-gray-200 dark:hover:border-white/40 dark:hover:bg-white/10"
                >
                  Join
                </button>
                <button
                  type="button"
                  onClick={onCreateRoom}
                  disabled={isCreating}
                  className="border border-[#d2d2d2] px-5 py-2 text-[11px] tracking-[0.2em] text-[#5a5a5a] uppercase transition-colors duration-200 hover:border-[#a8a8a8] hover:bg-[#efefef] disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/20 dark:text-gray-300 dark:hover:border-white/40 dark:hover:bg-white/10"
                >
                  {isCreating ? "Creating..." : "New"}
                </button>
              </form>
              {feedbackMessage ? (
                <p
                  className={`mt-3 text-[11px] tracking-[0.08em] ${
                    createStatus === "error"
                      ? "text-[#b44b4b] dark:text-red-300"
                      : "text-[#5c5c5c] dark:text-white/60"
                  }`}
                >
                  {feedbackMessage}
                </p>
              ) : null}
              <p className="mt-4 text-[11px] tracking-[0.14em] text-[#8f8f8f] dark:text-white/35">FORMAT: XXX-000-AX</p>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-[#d9d9d9] pt-5 text-[11px] tracking-[0.14em] text-[#7f7f7f] dark:border-white/10 dark:text-white/45 sm:grid-cols-4">
              {sampleCodes.map((code) => (
                <span key={code}>{code}</span>
              ))}
            </div>
          </div>

          <aside className="relative border border-[#d7d7d7] p-6 dark:border-white/10 dark:bg-white/5 lg:mt-10">
            <p className="text-[10px] tracking-[0.3em] text-[#7e7e7e] dark:text-white/45">SESSION TELEMETRY</p>
            <div className="mt-5 space-y-4">
              {statusRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-[#e1e1e1] pb-2 dark:border-white/10">
                  <span className="text-[11px] tracking-[0.16em] text-[#7b7b7b] dark:text-white/45">{row.label}</span>
                  <span className="text-sm tracking-[0.08em] text-[#4f4f4f] dark:text-gray-200">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#dcdcdc] pt-4 dark:border-white/10">
              <p className="mb-3 text-[10px] tracking-[0.28em] text-[#858585] dark:text-white/40">AXIS MARKERS</p>
              <div className="flex items-center gap-2 text-[10px] text-[#8d8d8d] dark:text-white/40">
                {axisTicks.map((tick) => (
                  <div key={tick} className="flex items-center gap-1">
                    <span className="inline-block h-2 w-px bg-[#b7b7b7] dark:bg-white/30" />
                    <span>{tick}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>

  );
};

export default JoinMeeting