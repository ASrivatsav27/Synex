const statusRows = [
  { label: "LATENCY", value: "24ms" },
  { label: "NODES", value: "12" },
  { label: "UPTIME", value: "99.98%" },
  { label: "MODEL", value: "AI-COLLAB v2" },
];

const axisTicks = Array.from({ length: 7 }, (_, i) => i * 10);

const sampleCodes = ["A14", "C29", "R07", "M42", "T11"];

const JoinMeeting = () => {
  return (

    <main className="diagnostic-grid min-h-screen bg-[#f5f5f5] px-6 py-8 text-[#3f3f3f] sm:px-10 lg:px-16">
      <div className="relative mx-auto max-w-7xl">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="diagnostic-blur left-[8%] top-[12%] h-40 w-48" />
          <div className="diagnostic-blur right-[14%] top-[44%] h-56 w-56" />
          <div className="diagnostic-blur bottom-[8%] left-[34%] h-44 w-44" />
        </div>

        <header className="relative mb-16 flex items-start justify-between border-b border-[#d6d6d6] pb-4">
          <div>
            <p className="text-[10px] font-normal tracking-[0.34em] text-[#7d7d7d]">SESSION MONITOR</p>
            <p className="mt-2 text-xs tracking-[0.16em] text-[#8a8a8a]">MEETING / DIAGNOSTIC / LIVE</p>
          </div>
          <p className="text-[11px] tracking-[0.2em] text-[#8c8c8c]">UTC 09:42:16</p>
        </header>

        <section className="relative grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
          <div className="pl-0 lg:pl-6">
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.28em] text-[#828282]">REAL-TIME COLLABORATION SYSTEM</p>
              <h1 className="mt-4 max-w-2xl text-4xl leading-tight font-light text-[#3a3a3a] sm:text-5xl">
                Real-time collaboration system
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-[#666666]">
                Clinical-grade video sessions with synchronized AI assistance, transcript analysis,
                and low-latency shared context for distributed teams.
              </p>
            </div>

            <div className="max-w-xl border border-[#dbdbdb] bg-[#f6f6f6]/80 p-6">
              <label className="mb-3 block text-[10px] tracking-[0.24em] text-[#7c7c7c]">ROOM CODE</label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  placeholder="Enter session identifier"
                  className="w-full border border-[#cccccc] bg-transparent px-3 py-2 text-sm tracking-[0.12em] text-[#444444] outline-none transition-colors duration-200 placeholder:text-[#9c9c9c] focus:border-[#9d9d9d]"
                />
                <button className="border border-[#c9c9c9] px-5 py-2 text-[11px] tracking-[0.2em] text-[#4c4c4c] uppercase transition-colors duration-200 hover:border-[#9b9b9b] hover:bg-[#ececec]">
                  Join
                </button>
                <button className="border border-[#d2d2d2] px-5 py-2 text-[11px] tracking-[0.2em] text-[#5a5a5a] uppercase transition-colors duration-200 hover:border-[#a8a8a8] hover:bg-[#efefef]">
                  New
                </button>
              </div>
              <p className="mt-4 text-[11px] tracking-[0.14em] text-[#8f8f8f]">FORMAT: XXX-000-AX</p>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 border-t border-[#d9d9d9] pt-5 text-[11px] tracking-[0.14em] text-[#7f7f7f] sm:grid-cols-4">
              {sampleCodes.map((code) => (
                <span key={code}>{code}</span>
              ))}
            </div>
          </div>

          <aside className="relative border border-[#d7d7d7] p-6 lg:mt-10">
            <p className="text-[10px] tracking-[0.3em] text-[#7e7e7e]">SESSION TELEMETRY</p>
            <div className="mt-5 space-y-4">
              {statusRows.map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-[#e1e1e1] pb-2">
                  <span className="text-[11px] tracking-[0.16em] text-[#7b7b7b]">{row.label}</span>
                  <span className="text-sm tracking-[0.08em] text-[#4f4f4f]">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#dcdcdc] pt-4">
              <p className="mb-3 text-[10px] tracking-[0.28em] text-[#858585]">AXIS MARKERS</p>
              <div className="flex items-center gap-2 text-[10px] text-[#8d8d8d]">
                {axisTicks.map((tick) => (
                  <div key={tick} className="flex items-center gap-1">
                    <span className="inline-block h-2 w-px bg-[#b7b7b7]" />
                    <span>{tick}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>

  )
}

export default JoinMeeting