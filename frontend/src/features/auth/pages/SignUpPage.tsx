import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignUpPage = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [error, setError] = useState("");
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const { handleRegister, loading } = useAuth();
	const navigate = useNavigate();

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
			setError("All fields are required.");
			return;
		}

		const emailPattern = /^\S+@\S+\.\S+$/;
		if (!emailPattern.test(email.trim())) {
			setError("Please enter a valid email address.");
			return;
		}

		if (password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			await handleRegister({
				username: username.trim(),
				email: email.trim(),
				password,
			});
			navigate("/meeting");
		} catch {
			setError("Sign-up failed. Please try again.");
		}
	};

	return (
		<main className="diagnostic-grid relative min-h-screen overflow-hidden bg-[#f4f5f4] px-6 py-10 text-[#2e3532] transition-colors duration-300 ease-in-out dark:bg-[#0f1115] dark:text-gray-100 sm:px-10">
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

			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="diagnostic-blur left-[6%] top-[10%] h-52 w-52" />
				<div className="diagnostic-blur right-[10%] top-[24%] h-60 w-60" />
				<div className="diagnostic-blur bottom-[10%] left-[40%] h-36 w-36" />
			</div>

			<section className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
				<aside className="border border-[#d6dbd7] bg-[#f7f8f7]/80 p-8 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:p-10">
					<p className="text-[10px] tracking-[0.32em] text-[#61706a] dark:text-gray-400">SYNEX ONBOARDING</p>
					<h1 className="mt-5 max-w-md text-4xl leading-tight font-light text-[#27312d] dark:text-gray-100 sm:text-5xl">
						Create your secure workspace identity.
					</h1>
					<p className="mt-6 max-w-md text-sm leading-relaxed text-[#5f6a66] dark:text-gray-400">
						Register once and continue with protected sessions, persistent context, and AI-enhanced collaboration.
					</p>

					<div className="mt-10 space-y-3 border-t border-[#dce2de] pt-6 text-[11px] tracking-[0.14em] text-[#68736e] dark:border-white/10 dark:text-gray-500">
						<p>ENCRYPTED AUTH FLOW</p>
						<p>PERSISTENT USER PROFILE</p>
						<p>INSTANT SESSION ACCESS</p>
					</div>
				</aside>

				<div className="border border-[#d0d8d3] bg-[#f9faf9]/90 p-7 shadow-[0_14px_40px_rgba(35,45,41,0.06)] dark:border-white/10 dark:bg-[#12161a]/85 dark:shadow-none sm:p-9">
					<div className="mb-8 border-b border-[#dbe1dd] pb-4 dark:border-white/10">
						<p className="text-[10px] tracking-[0.28em] text-[#6f7b75] dark:text-gray-400">CREATE ACCOUNT</p>
						<p className="mt-2 text-sm text-[#5f6a66] dark:text-gray-400">Set your profile details to get started.</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-5" noValidate>
						<div>
							<label htmlFor="username" className="mb-2 block text-[11px] tracking-[0.18em] text-[#5d6964] uppercase dark:text-gray-400">
								Username
							</label>
							<input
								id="username"
								type="text"
								autoComplete="username"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Your display name"
								className="w-full border border-[#c8d2cc] bg-white px-3 py-3 text-sm text-[#303835] outline-none transition-colors duration-200 placeholder:text-[#96a19c] focus:border-[#7b8f85] dark:border-white/15 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-white/30"
							/>
						</div>

						<div>
							<label htmlFor="email" className="mb-2 block text-[11px] tracking-[0.18em] text-[#5d6964] uppercase dark:text-gray-400">
								Email
							</label>
							<input
								id="email"
								type="email"
								autoComplete="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@company.com"
								className="w-full border border-[#c8d2cc] bg-white px-3 py-3 text-sm text-[#303835] outline-none transition-colors duration-200 placeholder:text-[#96a19c] focus:border-[#7b8f85] dark:border-white/15 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-white/30"
							/>
						</div>

						<div>
							<label htmlFor="password" className="mb-2 block text-[11px] tracking-[0.18em] text-[#5d6964] uppercase dark:text-gray-400">
								Password
							</label>
							<div className="relative">
								<input
									id="password"
									type={showPassword ? "text" : "password"}
									autoComplete="new-password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Minimum 8 characters"
									className="w-full border border-[#c8d2cc] bg-white px-3 py-3 pr-12 text-sm text-[#303835] outline-none transition-colors duration-200 placeholder:text-[#96a19c] focus:border-[#7b8f85] dark:border-white/15 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-white/30"
								/>
								<button
									type="button"
									onClick={() => setShowPassword((prev) => !prev)}
									aria-label={showPassword ? "Hide password" : "Show password"}
									className="absolute top-1/2 right-3 -translate-y-1/2 text-xs tracking-wide text-[#5d6964] transition-colors hover:text-[#2f3a35] dark:text-gray-400 dark:hover:text-gray-200"
								>
									{showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="mb-2 block text-[11px] tracking-[0.18em] text-[#5d6964] uppercase dark:text-gray-400">
								Confirm Password
							</label>
							<div className="relative">
								<input
									id="confirmPassword"
									type={showConfirmPassword ? "text" : "password"}
									autoComplete="new-password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Re-enter password"
									className="w-full border border-[#c8d2cc] bg-white px-3 py-3 pr-12 text-sm text-[#303835] outline-none transition-colors duration-200 placeholder:text-[#96a19c] focus:border-[#7b8f85] dark:border-white/15 dark:bg-white/5 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-white/30"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((prev) => !prev)}
									aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
									className="absolute top-1/2 right-3 -translate-y-1/2 text-xs tracking-wide text-[#5d6964] transition-colors hover:text-[#2f3a35] dark:text-gray-400 dark:hover:text-gray-200"
								>
									{showConfirmPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{error ? (
							<p className="border border-[#e4c8c0] bg-[#fff5f2] px-3 py-2 text-sm text-[#9a4b3a] dark:border-[#5a2f2a] dark:bg-[#2a1b1a] dark:text-[#f5b7aa]">{error}</p>
						) : null}

						<button
							type="submit"
							disabled={loading}
							className="w-full border border-[#3e5148] bg-[#43584f] px-4 py-3 text-[11px] tracking-[0.22em] text-[#f4f7f5] uppercase transition-colors duration-200 hover:bg-[#3b4d45] disabled:cursor-not-allowed disabled:border-[#9ca8a2] disabled:bg-[#aeb9b4]"
						>
							{loading ? "Creating Account..." : "Create Account"}
						</button>
					</form>

					<p className="mt-5 text-sm text-[#5f6a66] dark:text-gray-400">
						Already have an account?{" "}
						<Link to="/signin" className="text-[#3f5f50] underline decoration-[#8ca79b] underline-offset-4 dark:text-[#9dc6b0] dark:decoration-[#5f8d75]">
							Sign in
						</Link>
					</p>
				</div>
			</section>
		</main>
	);
};

export default SignUpPage;
