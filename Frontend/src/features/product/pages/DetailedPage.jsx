import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct.js";

const DetailedPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const { handleGetProductById } = useProduct();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setError("");
        await handleGetProductById(id);
      } catch (err) {
        setError(err?.response?.data?.message || "Unable to load product.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const product = useMemo(() => {
    if (Array.isArray(products)) {
      return products.find((item) => item._id === id) || products[0];
    }

    return products?.product || null;
  }, [id, products]);

  const variants = product?.variants || [];
  const totalStock = variants.reduce(
    (sum, variant) => sum + (Number(variant?.stock) || 0),
    0,
  );
  const availableSizes = variants.map((variant) => variant.size).join(", ");
  const images = product?.images?.length
    ? product.images
    : [{ url: "/snitch_editorial_warm.png" }];

  const formatPrice = (price) => {
    if (!price?.amount || !price?.currency) return "Price unavailable";

    return new Intl.NumberFormat("en-IN", {
      currency: price.currency,
      style: "currency",
    }).format(price.amount);
  };

  const handleAddToCart = () => {
    setIsAdded(true);
  };

  const handleBuyNow = () => {
    setIsAdded(true);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap"
        rel="stylesheet"
      />

      <main
        className="min-h-screen bg-[#fbf9f6] text-[#1b1c1a]"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <section className="mx-auto max-w-5xl px-10 py-12 sm:px-14 lg:px-20 xl:px-24">
          <nav className="mb-14 flex items-center justify-between border-b border-[#E5DED4] pb-5">
            <button
              className="text-sm text-[#7A6E63] transition hover:text-[#1b1c1a]"
              onClick={() => navigate(-1)}
              type="button"
            >
              Back
            </button>

            <span
              className="text-xs font-medium uppercase tracking-[0.32em] text-[#C9A96E]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Snitch.
            </span>
          </nav>

          {isLoading && (
            <div className="grid gap-8 lg:grid-cols-[0.8fr_0.75fr]">
              <div className="aspect-[4/5] animate-pulse bg-[#f5f3f0]" />
              <div className="space-y-5 pt-4">
                <div className="h-4 w-28 animate-pulse bg-[#EEE8DF]" />
                <div className="h-12 w-3/4 animate-pulse bg-[#EEE8DF]" />
                <div className="h-4 w-36 animate-pulse bg-[#EEE8DF]" />
                <div className="h-24 w-full animate-pulse bg-[#EEE8DF]" />
              </div>
            </div>
          )}

          {!isLoading && error && (
            <div className="border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!isLoading && !error && product && (
            <div className="mx-auto grid w-full max-w-4xl gap-10 lg:grid-cols-[0.85fr_0.75fr] lg:gap-12">
              <div className="grid gap-3 md:grid-cols-[64px_1fr]">
                <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col">
                  {images.map((image, index) => (
                    <button
                      className={`h-14 w-12 shrink-0 overflow-hidden border bg-[#f5f3f0] transition ${
                        selectedImage === index
                          ? "border-[#1b1c1a]"
                          : "border-[#E5DED4]"
                      }`}
                      key={`${image.url}-${index}`}
                      onClick={() => setSelectedImage(index)}
                      type="button"
                    >
                      <img
                        alt={`${product.title} thumbnail ${index + 1}`}
                        className="h-full w-full object-cover"
                        src={image.url}
                      />
                    </button>
                  ))}
                </div>

                <div className="order-1 mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-[#f5f3f0] md:order-2">
                  <img
                    alt={product.title}
                    className="h-full w-full object-cover"
                    src={images[selectedImage]?.url}
                  />
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-[#C9A96E]">
                  Product Details
                </p>

                <div className="mt-4 flex items-start justify-between gap-6">
                  <h1
                    className="text-2xl font-light leading-tight text-[#1b1c1a] lg:text-3xl"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {product.title}
                  </h1>

                  <button
                    aria-label="Add to wishlist"
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base transition ${
                      isLiked
                        ? "border-[#1b1c1a] bg-[#1b1c1a] text-white"
                        : "border-[#E5DED4] bg-transparent text-[#1b1c1a] hover:border-[#1b1c1a]"
                    }`}
                    onClick={() => setIsLiked((current) => !current)}
                    type="button"
                  >
                    {isLiked ? "\u2665" : "\u2661"}
                  </button>
                </div>

                <p className="mt-4 text-sm font-medium text-[#1b1c1a]">
                  {formatPrice(product.price)}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.18em]">
                  <span className="border border-[#E5DED4] px-3 py-2 text-[#1b1c1a]">
                    {variants.length ? `${totalStock} in stock` : "Stock not added"}
                  </span>
                  <span className="border border-[#E5DED4] px-3 py-2 text-[#7A6E63]">
                    {availableSizes ? `Sizes ${availableSizes}` : "No sizes"}
                  </span>
                </div>

                <div className="mt-5 h-px w-14 bg-[#C9A96E]" />

                <p className="mt-6 text-xs leading-6 text-[#7A6E63]">
                  {product.description}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    className="border border-[#1b1c1a] px-4 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#1b1c1a] transition hover:bg-[#1b1c1a] hover:text-white"
                    onClick={handleAddToCart}
                    type="button"
                  >
                    {isAdded ? "Added" : "Add to Cart"}
                  </button>

                  <button
                    className="bg-[#1b1c1a] px-4 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                    onClick={handleBuyNow}
                    type="button"
                  >
                    Buy Now
                  </button>
                </div>

                <div className="mt-7 grid gap-3 border-t border-[#E5DED4] pt-5 text-[11px] leading-5 text-[#7A6E63] sm:grid-cols-3">
                  <span>Secure checkout</span>
                  <span>Quality checked</span>
                  <span>Easy returns</span>
                </div>

                <div className="mt-8 border-t border-[#E5DED4] pt-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-[#C9A96E]">
                        Variants
                      </p>
                      <h2
                        className="mt-2 text-xl font-light text-[#1b1c1a]"
                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                      >
                        Sizes and stock
                      </h2>
                    </div>
                    {variants.length > 0 && (
                      <span className="text-[10px] uppercase tracking-[0.18em] text-[#7A6E63]">
                        {variants.length} options
                      </span>
                    )}
                  </div>

                  {variants.length === 0 ? (
                    <p className="mt-4 border border-[#E5DED4] px-4 py-4 text-xs leading-6 text-[#7A6E63]">
                      Variant images, sizes, and stock will appear here when the
                      seller adds them.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-3">
                      {variants.map((variant, index) => {
                        const variantImage =
                          variant.images?.[0]?.url ||
                          product.images?.[0]?.url ||
                          "/snitch_editorial_warm.png";

                        return (
                          <article
                            className="grid gap-4 border border-[#E5DED4] p-3 sm:grid-cols-[88px_1fr]"
                            key={`${variant.size}-${index}`}
                          >
                            <div className="aspect-square overflow-hidden bg-[#f5f3f0]">
                              <img
                                alt={`${product.title} ${variant.size}`}
                                className="h-full w-full object-cover"
                                src={variantImage}
                              />
                            </div>

                            <div className="flex flex-col justify-center gap-2">
                              <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#7A6E63]">
                                <span className="border border-[#E5DED4] px-2 py-1 text-[#1b1c1a]">
                                  Size {variant.size}
                                </span>
                                <span>{variant.stock} in stock</span>
                              </div>
                              <p className="text-xs text-[#7A6E63]">
                                {variant.images?.length || 0} variant image
                                {variant.images?.length === 1 ? "" : "s"}
                              </p>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default DetailedPage;
