import { useState } from "react";
import { Link } from "react-router";

const inputBaseClass =
  "w-full rounded-xl border border-yellow-500/20 bg-black/35 px-4 py-2.5 text-sm text-stone-100 outline-none transition duration-200 placeholder:text-stone-500 focus:border-yellow-400 focus:bg-black/50 focus:ring-2 focus:ring-yellow-400/30 sm:rounded-2xl sm:py-3";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="min-h-screen bg-[#050505] text-stone-100">
      <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-4">
        <div
          className="absolute inset-0 -z-30 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80')",
          }}
        />
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(135deg,_rgba(5,5,5,0.95)_0%,_rgba(8,8,8,0.9)_42%,_rgba(24,18,7,0.92)_100%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(234,179,8,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(202,138,4,0.2),_transparent_24%)]" />
        <div className="absolute left-[-10%] top-6 -z-10 h-40 w-40 rounded-full bg-yellow-500/10 blur-3xl sm:h-52 sm:w-52" />
        <div className="absolute bottom-0 right-[-8%] -z-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl sm:h-64 sm:w-64" />

        <section className="grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-yellow-500/15 bg-black/55 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex items-center p-3 sm:p-4 lg:p-4.5">
            <div className="mx-auto flex w-full max-w-xl flex-col justify-center">
              <div className="mb-3 lg:hidden">
                <span className="inline-flex items-center rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.35em] text-yellow-300">
                  Snitch
                </span>
              </div>

              <div className="mb-2 sm:mb-2.5">
                <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80 sm:text-sm">
                  Login
                </p>
                <h2 className="mt-1 text-[1.4rem] font-semibold text-white sm:mt-1.5 sm:text-[1.72rem]">
                  Welcome back
                </h2>
                <p className="mt-1 max-w-lg text-sm leading-5 text-stone-400 sm:mt-1 sm:leading-5.5">
                  Enter your email and password to access your Snitch account.
                </p>
              </div>

              <form className="grid gap-2 sm:gap-3" onSubmit={handleSubmit}>
                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-stone-200 sm:mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    className={inputBaseClass}
                    id="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={formData.email}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-stone-200 sm:mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className={inputBaseClass}
                    id="password"
                    name="password"
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    type="password"
                    value={formData.password}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 pt-1 text-sm text-stone-400">
                  <label className="flex items-center gap-2">
                    <input
                      className="h-4 w-4 accent-yellow-400"
                      type="checkbox"
                    />
                    <span>Remember me</span>
                  </label>
                  <span className="text-yellow-300">Forgot password?</span>
                </div>

                <button
                  className="mt-0.5 w-full rounded-xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(234,179,8,0.25)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(234,179,8,0.35)] sm:rounded-2xl sm:py-2.5"
                  type="submit"
                >
                  Sign In To Snitch
                </button>
              </form>

              <p className="mt-1 text-center text-sm text-stone-500 sm:mt-2.5">
                New to Snitch?{" "}
                <Link className="font-medium text-yellow-300" to="/register">
                  Create new account
                </Link>
              </p>
            </div>
          </div>

          <div className="relative hidden overflow-hidden border-l border-yellow-500/10 p-5 lg:flex lg:flex-col lg:justify-between lg:p-6">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80')",
              }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.18)_0%,_rgba(0,0,0,0.74)_100%)]" />

            <div className="relative">
              <span className="inline-flex items-center rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.35em] text-yellow-300">
                Snitch
              </span>
              <h1 className="mt-2.5 max-w-md font-serif text-4xl leading-tight text-white lg:text-[2.45rem]">
                Step back in.
                <span className="block text-yellow-300">Own your look.</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-5 text-stone-300 lg:text-[14px]">
                Sign in to your Snitch account to continue exploring elevated
                fits, manage your profile, and keep your fashion journey moving.
              </p>
            </div>

            <div className="relative mt-2.5 grid gap-2.5 lg:grid-cols-2">
              <div className="rounded-2xl border border-yellow-500/15 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">
                  Sharp Style
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  Return to curated menswear with bold silhouettes and premium
                  everyday essentials.
                </p>
              </div>
              <div className="rounded-2xl border border-yellow-500/15 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">
                  Faster Access
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  Pick up where you left off with your saved looks, account
                  details, and store access.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
