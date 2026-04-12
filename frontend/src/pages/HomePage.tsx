import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
	{
		title: "Video Meetings",
		description: "Stable real-time sessions for distributed teams.",
	},
	{
		title: "AI Assistant",
		description: "Live guidance and contextual support during calls.",
	},
	{
		title: "Smart Whiteboard",
		description: "Shared visual space with synchronized updates.",
	},
];

const flowMetrics = [
	"MEDIA PIPELINE STABLE",
	"SPEECH INDEX: 0.92",
	"COLLAB STREAM ACTIVE",
	"LATENCY WINDOW: 24MS",
];

const workflowSteps = ["Start Session", "Collaborate", "AI Assists"];

const commandExamples = ["Explain this", "Summarize meeting", "Generate notes"];

const HomePage = () => {
	const navigate = useNavigate();
	const featuresRef = useRef<HTMLElement | null>(null);
	const explainRef = useRef<HTMLElement | null>(null);
	const stepsRef = useRef<HTMLElement | null>(null);
	const aiRef = useRef<HTMLElement | null>(null);
	const liveRef = useRef<HTMLElement | null>(null);
	const [isFeaturesVisible, setIsFeaturesVisible] = useState(false);
	const [isExplainVisible, setIsExplainVisible] = useState(false);
	const [isStepsVisible, setIsStepsVisible] = useState(false);
	const [isAiVisible, setIsAiVisible] = useState(false);
	const [isLiveVisible, setIsLiveVisible] = useState(false);
	const [scrollProgress, setScrollProgress] = useState(0);
	const [parallaxOffset, setParallaxOffset] = useState(0);
	const [theme, setTheme] = useState<"light" | "dark">("light");

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

	useEffect(() => {
		const onScroll = () => {
			const currentY = window.scrollY;
			const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
			const ratio = maxScroll > 0 ? currentY / maxScroll : 0;
			setScrollProgress(Math.min(100, Math.max(0, ratio * 100)));
			setParallaxOffset(Math.min(20, currentY * 0.06));
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const revealEntries = [
			{ ref: featuresRef, reveal: setIsFeaturesVisible },
			{ ref: explainRef, reveal: setIsExplainVisible },
			{ ref: stepsRef, reveal: setIsStepsVisible },
			{ ref: aiRef, reveal: setIsAiVisible },
			{ ref: liveRef, reveal: setIsLiveVisible },
		];

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				const match = revealEntries.find((item) => item.ref.current === entry.target);
				if (match) {
					match.reveal(true);
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.22 });

		revealEntries.forEach((entry) => {
			if (entry.ref.current) {
				observer.observe(entry.ref.current);
			}
		});

		return () => observer.disconnect();
	}, []);

	return (
		<main className="diagnostic-grid min-h-screen bg-[#f5f5f5] px-6 py-24 text-gray-900 transition-colors duration-300 ease-in-out dark:bg-[#0f1115] dark:text-gray-100 sm:px-10 lg:px-14">
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

			<div
				className="fixed top-0 left-0 z-20 h-px bg-gray-400/70 transition-[width] duration-150 dark:bg-white/25"
				style={{ width: `${scrollProgress}%` }}
				aria-hidden="true"
			/>

			<div className="mx-auto max-w-5xl">
				<section
					className="hero-stagger max-w-3xl lg:ml-8"
					style={{ transform: `translateY(${parallaxOffset}px)` }}
				>
					<h1 className="hero-step text-4xl leading-tight font-light tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
						Real-time collaboration. Powered by intelligence.
					</h1>
					<p className="hero-step mt-5 text-sm font-normal text-gray-600 dark:text-gray-400">
						Precision communication, shared context, and adaptive assistance in one interface.
					</p>

					<div className="hero-step mt-10 flex flex-col gap-3 sm:flex-row">
						<button
							type="button"
							onClick={() => navigate("/signin")}
							className="border border-gray-300 bg-white px-6 py-3 text-sm font-normal tracking-wide text-gray-900 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
						>
							Sign In
						</button>
						<button
							type="button"
							onClick={() => navigate("/signup")}
							className="border border-gray-300 bg-transparent px-6 py-3 text-sm font-normal tracking-wide text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
						>
							Create Account
						</button>
					</div>
				</section>

				<section ref={featuresRef} className="mt-24 lg:ml-8">
					<div className="grid grid-cols-1 gap-12 border-t border-gray-200 pt-10 dark:border-white/10 md:grid-cols-3 md:gap-10">
						{features.map((feature, index) => (
							<article
								key={feature.title}
								className={`feature-reveal space-y-3 ${isFeaturesVisible ? "feature-reveal-visible" : ""}`}
								style={{ transitionDelay: `${index * 100}ms` }}
							>
								<span className="feature-icon block h-4 w-4 rounded-full border border-gray-400 dark:border-white/30" aria-hidden="true" />
								<h2 className="text-base font-normal text-gray-900 dark:text-gray-200">{feature.title}</h2>
								<p className="max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-500">{feature.description}</p>
							</article>
						))}
					</div>
				</section>

				<section ref={explainRef} className="section-space lg:ml-8">
					<div className="grid grid-cols-1 gap-12 border-t border-gray-200 pt-12 dark:border-white/10 md:grid-cols-2 md:gap-16">
						<div className={`section-reveal-left ${isExplainVisible ? "section-reveal-visible" : ""}`}>
							<p className="text-xs tracking-[0.18em] text-gray-400 uppercase dark:text-white/20">System Explanation</p>
							<h2 className="mt-4 text-3xl leading-tight font-light text-gray-900 dark:text-gray-100 sm:text-4xl">
								A synchronized workspace designed for live operational clarity.
							</h2>
							<p className="mt-5 max-w-md text-sm leading-7 text-gray-600 dark:text-gray-400">
								Video, shared context, and AI support run in a single session state so teams can reason,
								annotate, and decide without switching tools.
							</p>
						</div>

						<div className={`section-reveal-right ${isExplainVisible ? "section-reveal-visible" : ""}`}>
							<div className="grid gap-3 border border-gray-200 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5">
								<div className="h-10 border border-gray-200 bg-[#f7f7f7] dark:border-white/10 dark:bg-white/5" />
								<div className="grid grid-cols-[2fr_1fr] gap-3">
									<div className="h-24 border border-gray-200 bg-[#f7f7f7] dark:border-white/10 dark:bg-white/5" />
									<div className="h-24 border border-gray-200 bg-[#f3f3f3] dark:border-white/10 dark:bg-white/5" />
								</div>
								<div className="h-12 border border-gray-200 bg-[#f8f8f8] dark:border-white/10 dark:bg-white/5" />
							</div>
						</div>
					</div>
				</section>

				<section ref={stepsRef} className="section-space lg:ml-8">
					<div className="border-t border-gray-200 pt-12 dark:border-white/10">
						<p className="text-xs tracking-[0.18em] text-gray-400 uppercase dark:text-white/20">How It Works</p>
						<div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
							{workflowSteps.map((step, index) => (
								<div
									key={step}
									className={`step-reveal relative ${isStepsVisible ? "step-reveal-visible" : ""}`}
									style={{ transitionDelay: `${index * 120}ms` }}
								>
									<div className="flex items-center gap-3">
										<span className="block h-5 w-5 rounded-full border border-gray-400 dark:border-white/30" aria-hidden="true" />
										<p className="text-base font-normal text-gray-900 dark:text-gray-200">{step}</p>
									</div>
									<p className="mt-3 max-w-xs text-sm leading-6 text-gray-600 dark:text-gray-500">
										{index === 0 && "Initialize room state and identity checks."}
										{index === 1 && "Exchange media, context, and annotations in real time."}
										{index === 2 && "Receive adaptive summaries and action proposals."}
									</p>
									{index < workflowSteps.length - 1 && (
										<span className="step-line hidden md:block" aria-hidden="true" />
									)}
								</div>
							))}
						</div>
					</div>
				</section>

				<section ref={aiRef} className="section-space">
					<div className={`section-reveal-center border-t border-gray-200 pt-14 text-center dark:border-white/10 ${isAiVisible ? "section-reveal-visible" : ""}`}>
						<p className="text-xs tracking-[0.2em] text-gray-400 uppercase dark:text-white/20">AI Capabilities</p>
						<h2 className="mt-4 text-3xl font-light text-gray-900 dark:text-gray-100">Command Interface</h2>
						<div className="mx-auto mt-8 max-w-2xl border border-gray-200 bg-white/35 px-5 py-4 text-left dark:border-white/10 dark:bg-white/5">
							{commandExamples.map((command, index) => (
								<p
									key={command}
									className={`terminal-line text-sm leading-7 text-gray-600 dark:text-gray-400 ${index === 0 ? "typing-line" : ""}`}
								>
									&gt; {command}
								</p>
							))}
						</div>
					</div>
				</section>

				<section ref={liveRef} className="section-space lg:ml-8">
					<div className={`section-reveal-left border-t border-gray-200 pt-10 dark:border-white/10 ${isLiveVisible ? "section-reveal-visible" : ""}`}>
						<p className="text-xs tracking-[0.18em] text-gray-400 uppercase dark:text-white/20">Live System Stream</p>
						<div className="ticker-track mt-6 overflow-hidden border-y border-gray-200 py-3 dark:border-white/10">
							<div className="ticker-flow text-[10px] tracking-[0.28em] text-gray-400 dark:text-white/20">
								{flowMetrics.map((metric) => (
									<span key={`a-${metric}`}>{metric}</span>
								))}
								{flowMetrics.map((metric) => (
									<span key={`b-${metric}`}>{metric}</span>
								))}
							</div>
						</div>
						<div className="system-lines mt-5">
							<span />
							<span />
							<span />
						</div>
					</div>
				</section>

				<section className="section-space text-center">
					<div className="border-t border-gray-200 pt-14 dark:border-white/10">
						<h2 className="text-4xl leading-tight font-light text-gray-900 dark:text-gray-100 sm:text-5xl">Start your first session</h2>
						<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<button
								type="button"
								onClick={() => navigate("/signin")}
								className="border border-gray-300 bg-white px-8 py-4 text-base font-normal tracking-wide text-gray-900 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95 dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10"
							>
								Sign In
							</button>
							<button
								type="button"
								onClick={() => navigate("/signup")}
								className="border border-gray-300 bg-transparent px-8 py-4 text-base font-normal tracking-wide text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-100 active:scale-95 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/10"
							>
								Create Account
							</button>
						</div>
					</div>
				</section>

				<footer className="mt-24 border-t border-gray-200 pt-8 pb-8 text-center dark:border-white/10">
					<p className="text-xs text-gray-400/80 dark:text-white/20">Built for real-time systems</p>
					<p className="mt-2 text-[11px] tracking-[0.14em] text-gray-400/70 uppercase dark:text-white/20">
						Distributed collaboration interface v1.0
					</p>
				</footer>
			</div>
		</main>
	);
};

export default HomePage;
