import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router";
import ContinueWithGoogle from "../components/continuewithgoogle.jsx";

const inputBaseClass =
  "w-full rounded-xl border border-yellow-500/20 bg-black/35 px-4 py-2.5 text-sm text-stone-100 outline-none transition duration-200 placeholder:text-stone-500 focus:border-yellow-400 focus:bg-black/50 focus:ring-2 focus:ring-yellow-400/30 sm:rounded-2xl sm:py-3";

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: "",
    contact: "",
    email: "",
    password: "",
    isSeller: "no",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    await handleRegister({
      email: formData.email,
      contact: formData.contact,
      fullname: formData.fullname,
      password: formData.password,
      isSeller: formData.isSeller === "yes",
    });

    navigate("/");
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

        <section className="grid w-full max-w-6xl overflow-hidden rounded-[1.75rem] border border-yellow-500/15 bg-black/55 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl lg:min-h-[520px] lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative hidden overflow-hidden border-r border-yellow-500/10 p-5 lg:flex lg:flex-col lg:justify-between lg:p-6">
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
                Wear confidence.
                <span className="block text-yellow-300">Sell with style.</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm leading-5 text-stone-300 lg:text-[14px]">
                Create your Snitch account to discover statement fashion, save
                your favorites, and choose whether you are joining as a customer
                or a seller.
              </p>
            </div>

            <div className="relative mt-2.5 grid gap-2.5 lg:grid-cols-2">
              <div className="rounded-2xl border border-yellow-500/15 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">
                  Modern Fits
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  Minimal luxury inspired by bold tailoring and elevated
                  streetwear.
                </p>
              </div>
              <div className="rounded-2xl border border-yellow-500/15 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-300/80">
                  Premium Access
                </p>
                <p className="mt-3 text-sm leading-6 text-stone-300">
                  Join the Snitch community with a smooth, fashion-first
                  onboarding experience.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center p-3 sm:p-4 lg:p-4.5">
            <div className="mx-auto flex w-full max-w-xl flex-col justify-center">
              <div className="mb-3 lg:hidden">
                <span className="inline-flex items-center rounded-full border border-yellow-400/25 bg-yellow-400/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.35em] text-yellow-300">
                  Snitch
                </span>
              </div>

              <div className="mb-2 sm:mb-2.5">
                <p className="text-xs uppercase tracking-[0.35em] text-yellow-300/80 sm:text-sm">
                  Register
                </p>
                <h2 className="mt-1 text-[1.4rem] font-semibold text-white sm:mt-1.5 sm:text-[1.72rem]">
                  Create your account
                </h2>
                <p className="mt-1 max-w-lg text-sm leading-5 text-stone-400 sm:mt-1 sm:leading-5.5">
                  Fill in the required details to start your Snitch journey.
                </p>
              </div>

              <form className="grid gap-2 sm:grid-cols-2 sm:gap-3" onSubmit={handleSubmit}>
                <div className="sm:col-span-2">
                  <label
                    className="mb-1 block text-sm font-medium text-stone-200 sm:mb-2"
                    htmlFor="fullname"
                  >
                    Full Name
                  </label>
                  <input
                    className={inputBaseClass}
                    id="fullname"
                    name="fullname"
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    type="text"
                    value={formData.fullname}
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-medium text-stone-200 sm:mb-2"
                    htmlFor="contact"
                  >
                    Contact Number
                  </label>
                  <input
                    className={inputBaseClass}
                    id="contact"
                    name="contact"
                    onChange={handleChange}
                    placeholder="Enter your contact number"
                    required
                    type="tel"
                    value={formData.contact}
                  />
                </div>

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

                <div className="sm:col-span-2">
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
                    placeholder="Create a secure password"
                    required
                    type="password"
                    value={formData.password}
                  />
                </div>

                <fieldset className="sm:col-span-2">
                  <legend className="mb-1.5 block text-sm font-medium text-stone-200 sm:mb-3">
                    Are you a seller?
                  </legend>
                  <div className="grid gap-2.5 md:grid-cols-2 sm:gap-3">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-yellow-500/15 bg-white/5 px-3.5 py-2 transition hover:border-yellow-400/40 hover:bg-yellow-400/5 sm:rounded-2xl sm:px-4 sm:py-3">
                      <input
                        checked={formData.isSeller === "yes"}
                        className="h-4 w-4 accent-yellow-400"
                        name="isSeller"
                        onChange={handleChange}
                        type="radio"
                        value="yes"
                      />
                      <span>
                        <span className="block text-sm font-medium text-stone-100">
                          Yes, I am a seller
                        </span>
                        <span className="text-xs text-stone-400">
                          I want to sell on Snitch
                        </span>
                      </span>
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-yellow-500/15 bg-white/5 px-3.5 py-2 transition hover:border-yellow-400/40 hover:bg-yellow-400/5 sm:rounded-2xl sm:px-4 sm:py-3">
                      <input
                        checked={formData.isSeller === "no"}
                        className="h-4 w-4 accent-yellow-400"
                        name="isSeller"
                        onChange={handleChange}
                        type="radio"
                        value="no"
                      />
                      <span>
                        <span className="block text-sm font-medium text-stone-100">
                          No, I am a buyer
                        </span>
                        <span className="text-xs text-stone-400">
                          I want to shop the collection
                        </span>
                      </span>
                    </label>
                  </div>
                </fieldset>

                <button
                  className="sm:col-span-2 mt-0.5 w-full rounded-xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(234,179,8,0.25)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_18px_40px_rgba(234,179,8,0.35)] sm:rounded-2xl sm:py-2.5"
                  type="submit"
                >
                  Create Snitch Account
                </button>
              </form>

              <div className="mt-3">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-yellow-500/15" />
                  <span className="text-xs uppercase tracking-[0.3em] text-stone-500">
                    or
                  </span>
                  <span className="h-px flex-1 bg-yellow-500/15" />
                </div>

                <div className="mt-3">
                  <ContinueWithGoogle />
                </div>
              </div>

              <p className="mt-1 text-center text-sm text-stone-500 sm:mt-2.5">
                Already part of Snitch?{" "}
                <Link className="font-medium text-yellow-300" to="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;
