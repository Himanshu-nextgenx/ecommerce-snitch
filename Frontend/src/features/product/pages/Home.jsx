import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct.js";
import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const user = useSelector((state) => state.auth.user);
  const authLoading = useSelector((state) => state.auth.loading);
  const { handleGetAllProducts } = useProduct();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setError("");
        await handleGetAllProducts();
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productList = useMemo(() => {
    if (Array.isArray(products)) return products;
    return products?.products || [];
  }, [products]);

  const formatPrice = (price) => {
    if (!price?.amount || !price?.currency) return "Price unavailable";

    return new Intl.NumberFormat("en-IN", {
      currency: price.currency,
      style: "currency",
    }).format(price.amount);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main
        className="min-h-screen selection:bg-[#C9A96E]/30"
        style={{ backgroundColor: "#fbf9f6", fontFamily: "'Inter', sans-serif" }}
      >
        <section className="mx-auto max-w-7xl px-6 py-8 lg:px-12 xl:px-20">
          <nav className="flex items-center justify-between border-b border-[#E5DED4] pb-6">
            <span
              className="text-xs font-medium uppercase tracking-[0.32em] text-[#C9A96E]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Snitch.
            </span>

            {user ? (
              <div className="flex items-center gap-3 text-sm text-[#7A6E63]">
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A96E]">
                  Welcome
                </span>
                <span className="font-medium text-[#1b1c1a]">
                  {user.fullname || user.email}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-5 text-sm text-[#7A6E63]">
                {authLoading ? (
                  <span className="text-[#B5ADA3]">Checking...</span>
                ) : (
                  <>
                    <Link className="transition hover:text-[#1b1c1a]" to="/login">
                      Login
                    </Link>
                    <Link
                      className="transition hover:text-[#1b1c1a]"
                      to="/register"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </nav>

          <header className="flex flex-col justify-between gap-6 py-12 md:flex-row md:items-end">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#C9A96E]">
                New Collection
              </p>
              <h1
                className="mt-4 text-5xl font-light leading-tight text-[#1b1c1a] lg:text-6xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Explore products
              </h1>
              <div className="mt-5 h-px w-14 bg-[#C9A96E]" />
            </div>

            <p className="max-w-md text-sm leading-6 text-[#7A6E63]">
              Browse clean, curated pieces from sellers. Simple details, clear
              pricing, and product-first cards.
            </p>
          </header>

          {isLoading && (
            <div className="grid grid-cols-1 gap-x-8 gap-y-14 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="animate-pulse" key={index}>
                  <div className="aspect-[4/5] bg-[#f5f3f0]" />
                  <div className="mt-5 h-5 w-2/3 bg-[#EEE8DF]" />
                  <div className="mt-3 h-3 w-full bg-[#EEE8DF]" />
                  <div className="mt-2 h-3 w-1/2 bg-[#EEE8DF]" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && productList.length === 0 && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#C9A96E]">
                No products
              </p>
              <p
                className="mt-4 max-w-md text-xl leading-relaxed text-[#7A6E63]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Products will appear here once sellers create listings.
              </p>
            </div>
          )}

          {!isLoading && !error && productList.length > 0 && (
            <div className="grid auto-rows-fr grid-cols-1 gap-x-8 gap-y-14 pb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productList.map((product) => {
                const imageUrl =
                  product.images?.[0]?.url || "/snitch_editorial_warm.png";
                const variants = product.variants || [];
                const totalStock = variants.reduce(
                  (sum, variant) => sum + (Number(variant?.stock) || 0),
                  0,
                );
                const sizeLabel = variants.length
                  ? variants.map((variant) => variant.size).join(", ")
                  : "No sizes";

                return (
                  <article onClick={() => navigate(`/product/${product._id}`)}
                    className="group flex h-full flex-col cursor-pointer" key={product._id}>
                    <div
                      className="aspect-[4/5] overflow-hidden bg-[#f5f3f0]">
                      <img
                        alt={product.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        src={imageUrl}
                      />
                    </div>

                    <div className="flex min-h-[9rem] flex-1 flex-col pt-5">
                      <h2
                        className="line-clamp-2 min-h-[3.2rem] text-2xl font-light leading-tight text-[#1b1c1a]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {product.title}
                      </h2>

                      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-[#7A6E63]">
                        {product.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.18em]">
                        <span className="border border-[#E5DED4] px-2 py-1 text-[#1b1c1a]">
                          {variants.length ? `${totalStock} in stock` : "No stock data"}
                        </span>
                        <span className="border border-[#E5DED4] px-2 py-1 text-[#7A6E63]">
                          {sizeLabel}
                        </span>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-4">
                        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#1b1c1a]">
                          {formatPrice(product.price)}
                        </span>
                        <button
                          className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#C9A96E] transition hover:text-[#1b1c1a]"
                          type="button"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default Home;
