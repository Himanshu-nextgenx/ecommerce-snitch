import { useState } from "react";
import { useAuth } from "../hook/useAuth";
import { Link, useNavigate } from "react-router";
import ContinueWithGoogle from "../components/continuewithgoogle.jsx";

const inputBaseClass =
  "w-full border border-[#E5DED4] bg-[#fbf9f6] px-3.5 py-2 text-sm text-[#1b1c1a] outline-none transition placeholder:text-[#B5ADA3] focus:border-[#C9A96E] focus:bg-white";

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
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: "#fbf9f6", fontFamily: "'Inter', sans-serif" }}
      >
        <section className="mx-auto grid min-h-screen max-w-7xl px-8 lg:grid-cols-[1.04fr_0.96fr] lg:px-16 xl:px-24">
          <div className="hidden py-10 lg:block">
            <div className="relative h-full min-h-[calc(100vh-5rem)] overflow-hidden bg-[#1b1c1a] ring-1 ring-[#C9A96E]/25">
              <img
                alt="Snitch seller editorial"
                className="h-full w-full object-cover object-[center_32%] opacity-95"
                src="https://images.unsplash.com/photo-1627292441194-0280c19e74e4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1a]/55 via-[#1b1c1a]/5 to-transparent" />
              <div className="absolute bottom-8 left-8 max-w-sm">
                <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A96E]">
                  Seller Studio
                </p>
                <p
                  className="mt-3 text-3xl font-light leading-tight text-[#fbf9f6]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Wear confidence. Sell with style.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center py-8 lg:pl-14">
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

            <div className="pt-10 pb-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A96E]">
                New Account
              </p>
              <h1
                className="mt-2 text-4xl font-light leading-tight text-[#1b1c1a] lg:text-[2.7rem]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Join Snitch
              </h1>
              <div className="mt-3 h-px w-12 bg-[#C9A96E]" />
              <p className="mt-3 max-w-md text-sm leading-5 text-[#7A6E63]">
                Create your profile and choose whether you are entering as a
                shopper or building your seller vault.
              </p>

              <div className="mt-5 w-full border-t border-[#E5DED4] pt-5">
                <form
                  className="grid gap-3 sm:grid-cols-2"
                  onSubmit={handleSubmit}
                >
                  <div className="sm:col-span-2">
                    <label
                      className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#1b1c1a]"
                      htmlFor="fullname"
                    >
                      Full Name
                    </label>
                    <input
                      className={inputBaseClass}
                      id="fullname"
                      name="fullname"
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      type="text"
                      value={formData.fullname}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#1b1c1a]"
                      htmlFor="contact"
                    >
                      Contact
                    </label>
                    <input
                      className={inputBaseClass}
                      id="contact"
                      name="contact"
                      onChange={handleChange}
                      placeholder="Phone number"
                      required
                      type="tel"
                      value={formData.contact}
                    />
                  </div>

                  <div>
                    <label
                      className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#1b1c1a]"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className={inputBaseClass}
                      id="email"
                      name="email"
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      type="email"
                      value={formData.email}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      className="mb-1 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#1b1c1a]"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      className={inputBaseClass}
                      id="password"
                      name="password"
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      type="password"
                      value={formData.password}
                    />
                  </div>

                  <fieldset className="sm:col-span-2">
                    <legend className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-[#1b1c1a]">
                      Account Type
                    </legend>
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="flex cursor-pointer items-start gap-2.5 border border-[#E5DED4] bg-[#fbf9f6] px-3 py-2.5 transition hover:border-[#C9A96E]">
                        <input
                          checked={formData.isSeller === "yes"}
                          className="mt-1 h-4 w-4 accent-[#C9A96E]"
                          name="isSeller"
                          onChange={handleChange}
                          type="radio"
                          value="yes"
                        />
                        <span>
                          <span className="block text-sm font-medium text-[#1b1c1a]">
                            Seller
                          </span>
                          <span className="text-[11px] leading-4 text-[#7A6E63]">
                            Create listings and manage your vault.
                          </span>
                        </span>
                      </label>

                      <label className="flex cursor-pointer items-start gap-2.5 border border-[#E5DED4] bg-[#fbf9f6] px-3 py-2.5 transition hover:border-[#C9A96E]">
                        <input
                          checked={formData.isSeller === "no"}
                          className="mt-1 h-4 w-4 accent-[#C9A96E]"
                          name="isSeller"
                          onChange={handleChange}
                          type="radio"
                          value="no"
                        />
                        <span>
                          <span className="block text-sm font-medium text-[#1b1c1a]">
                            Buyer
                          </span>
                          <span className="text-[11px] leading-4 text-[#7A6E63]">
                            Discover and save curated pieces.
                          </span>
                        </span>
                      </label>
                    </div>
                  </fieldset>

                  <button
                    className="bg-[#1b1c1a] px-8 py-3 text-[11px] font-medium uppercase tracking-[0.3em] text-[#fbf9f6] transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1b1c1a] sm:col-span-2"
                    type="submit"
                  >
                    Create Account
                  </button>
                </form>

                <div className="my-4 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[#E5DED4]" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#B5ADA3]">
                    or
                  </span>
                  <span className="h-px flex-1 bg-[#E5DED4]" />
                </div>

                <ContinueWithGoogle className="rounded-none border-[#E5DED4] shadow-none" />

                <p className="mt-4 text-center text-sm text-[#7A6E63]">
                  Already part of Snitch?{" "}
                  <Link className="font-medium text-[#C9A96E]" to="/login">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Register;
