import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/continuewithgoogle.jsx";

const inputBaseClass =
  "w-full border border-[#E5DED4] bg-[#fbf9f6] px-3.5 py-2 text-sm text-[#1b1c1a] outline-none transition-all duration-200 placeholder:text-[#B5ADA3] focus:border-[#C9A96E] focus:bg-white focus:ring-1 focus:ring-[#C9A96E]";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value.trimStart(),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const user =await handleLogin({
        email: formData.email,
        password: formData.password,
      });

      console.log(user)
      
      if(user.role==="buyer"){
        navigate("/", { replace: true });
      }

      if(user.role==="seller"){
        navigate("/seller/Dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{
          backgroundColor: "#fbf9f6",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <section className="mx-auto grid min-h-screen max-w-7xl px-5 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 xl:px-16">
          <div className="flex flex-col justify-between py-4 lg:pr-12">
            <div className="flex items-center gap-5">
              <button
                aria-label="Go back"
                className="text-lg leading-none text-[#B5ADA3] transition-colors duration-200 hover:text-[#C9A96E]"
                onClick={() => navigate(-1)}
                type="button"
              >
                &larr;
              </button>
              <span
                className="text-xs font-medium uppercase tracking-[0.32em] text-[#C9A96E]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Snitch.
              </span>
            </div>

            <div className="py-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A96E]">
                Account Access
              </p>

              <h1
                className="mt-2 text-4xl font-light leading-tight text-[#1b1c1a] lg:text-[2.7rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Welcome back
              </h1>

              <div className="mt-3 h-px w-12 bg-[#C9A96E]" />

              <p className="mt-3 max-w-md text-sm leading-5 text-[#7A6E63]">
                Sign in to continue managing your Snitch account, listings, and
                curated pieces.
              </p>

              <div className="mt-4 w-full border-t border-[#E5DED4] pt-4">
                <form className="grid gap-3" onSubmit={handleSubmit}>
                  {/* EMAIL */}
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#1b1c1a]"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className={inputBaseClass}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-medium uppercase tracking-[0.18em] text-[#1b1c1a]"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className={inputBaseClass}
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* OPTIONS */}
                  <div className="flex items-center justify-between gap-4 text-sm text-[#7A6E63]">
                    <label className="flex items-center gap-2">
                      <input
                        className="h-4 w-4 accent-[#C9A96E]"
                        type="checkbox"
                      />
                      <span>Remember me</span>
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-[#C9A96E] hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* ERROR */}
                  {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                  )}

                  {/* BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 text-[11px] font-medium uppercase tracking-[0.3em] transition-all duration-300 
                    ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#1b1c1a] text-[#fbf9f6] hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                    }`}
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </button>
                </form>

                {/* DIVIDER */}
                <div className="my-4 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#E5DED4]" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#B5ADA3]">
                    or
                  </span>
                  <span className="h-px flex-1 bg-[#E5DED4]" />
                </div>

                {/* GOOGLE */}
                <ContinueWithGoogle
                  className="rounded-none border-[#E5DED4] shadow-none"
                  label="Sign in with Google"
                />

                {/* SIGNUP */}
                <p className="mt-4 text-center text-sm text-[#7A6E63]">
                  New to Snitch?{" "}
                  <Link className="font-medium text-[#C9A96E]" to="/register">
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden py-4 lg:block">
            <div className="relative h-full min-h-[470px] overflow-hidden bg-[#1b1c1a] ring-1 ring-[#C9A96E]/25">
              <img
                alt="Snitch editorial fashion"
                className="h-full w-full object-cover object-center opacity-95"
                src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/55 via-[#1b1c1a]/5 to-transparent" />

              <div className="absolute bottom-8 left-8 max-w-sm">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A96E]">
                  Curated Fits
                </p>

                <p
                  className="mt-3 text-3xl font-light leading-tight text-[#fbf9f6]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Step back in. Own your look.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;