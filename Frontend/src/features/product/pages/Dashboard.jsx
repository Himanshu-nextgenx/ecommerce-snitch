import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct";

const Dashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const navigate = useNavigate();
  const sellerProductsData = useSelector((state) => state.product.sellerProducts);
  const sellerProducts = sellerProductsData?.products || sellerProductsData || [];
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        setError("");
        await handleGetSellerProducts();
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load your products right now.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSellerProducts();
  }, []);

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
        <section className="mx-auto max-w-7xl px-8 lg:px-16 xl:px-24">
          <div className="flex items-center gap-5 pb-0 pt-10">
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

          <header className="flex flex-col justify-between gap-6 overflow-hidden pb-10 pt-10 md:flex-row md:items-end">
            <div>
              <h1
                className="text-4xl font-light leading-tight text-[#1b1c1a] lg:text-5xl"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Your Vault
              </h1>
              <div className="mt-4 h-px w-14 bg-[#C9A96E]" />
            </div>

            <button
              className="w-full bg-[#1b1c1a] px-8 py-4 text-center text-[11px] font-medium uppercase tracking-[0.3em] text-[#fbf9f6] transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1b1c1a] md:w-auto"
              onClick={() => navigate("/seller/create-product")}
              type="button"
            >
              New Listing
            </button>
          </header>

        {isLoading && (
          <div className="grid auto-rows-fr grid-cols-1 gap-x-8 gap-y-16 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                className="aspect-[4/5] animate-pulse bg-[#f5f3f0]"
                key={index}
              />
            ))}
          </div>
        )}

        {!isLoading && error && (
          <div className="border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && sellerProducts.length === 0 && (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-[#C9A96E]">
              Empty Vault
            </span>
            <p
              className="mx-auto max-w-md text-lg leading-relaxed text-[#7A6E63]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              You haven't added any curated pieces to your archive yet. Begin by
              creating a new listing.
            </p>
            <button
              className="mt-8 bg-[#1b1c1a] px-8 py-4 text-[11px] font-medium uppercase tracking-[0.3em] text-[#fbf9f6] transition-all duration-300 hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
              onClick={() => navigate("/seller/create-product")}
              type="button"
            >
              New Listing
            </button>
          </div>
        )}

        {!isLoading && !error && sellerProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-x-8 gap-y-16 pb-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sellerProducts.map((product) => {
              const imageUrl = product.images?.[0]?.url || "/snitch_editorial_warm.png";
              const variants = product.variants || [];
              const totalStock = variants.reduce(
                (sum, variant) => sum + (Number(variant?.stock) || 0),
                0,
              );
              const sizeLabel = variants.length
                ? variants.map((variant) => variant.size).join(", ")
                : "No sizes";

              return (
                <article
                  className="group flex h-full cursor-pointer flex-col"
                  key={product._id}
                  onClick={() => navigate(`/seller/product/${product._id}`)}
                >
                  <div className="mb-6 aspect-[4/5] overflow-hidden bg-[#f5f3f0]">
                    <img
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      src={imageUrl}
                    />
                  </div>

                  <div className="flex min-h-[8.5rem] flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-4">
                      <h2
                        className="line-clamp-2 min-h-[3.4rem] text-xl leading-snug text-[#1b1c1a] transition-colors duration-300 group-hover:text-[#C9A96E]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        {product.title}
                      </h2>
                    </div>

                    <p className="line-clamp-2 min-h-[2.4rem] text-[12px] leading-relaxed text-[#7A6E63]">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 text-[10px] font-medium uppercase tracking-[0.18em]">
                      <span className="border border-[#E5DED4] px-2 py-1 text-[#1b1c1a]">
                        {variants.length ? `${totalStock} in stock` : "No stock data"}
                      </span>
                      <span className="border border-[#E5DED4] px-2 py-1 text-[#7A6E63]">
                        {sizeLabel}
                      </span>
                    </div>

                    <div className="mt-auto pt-2">
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#1b1c1a]">
                        {product.price?.currency}{" "}
                        {product.price?.amount?.toLocaleString()}
                      </span>
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

export default Dashboard;
