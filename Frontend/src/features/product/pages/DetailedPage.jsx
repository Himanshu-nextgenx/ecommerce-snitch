import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct.js";

// ───────── HELPERS ─────────

const FALLBACK_IMAGE = "/snitch_editorial_warm.png";

const formatPrice = (price) => {
  if (!price?.amount || !price?.currency) return "Price unavailable";
  return new Intl.NumberFormat("en-IN", {
    currency: price.currency,
    style: "currency",
  }).format(price.amount);
};

const getAttributes = (variant) =>
  variant?.attributes ?? variant?.attribute ?? {};

const getColorValue = (variant) => {
  const attrs = getAttributes(variant);
  for (const key of Object.keys(attrs)) {
    if (key.toLowerCase() === "color" || key.toLowerCase() === "colour") {
      return attrs[key];
    }
  }
  return "";
};

const getNonColorAttributes = (variant) => {
  const attrs = getAttributes(variant);
  return Object.entries(attrs).filter(
    ([key]) =>
      key.toLowerCase() !== "color" && key.toLowerCase() !== "colour",
  );
};

const getProductFromState = (products, id) => {
  if (Array.isArray(products)) {
    return products.find((item) => item._id === id) || products[0];
  }
  return products?.product || null;
};

// ───────── COMPONENT ─────────

const DetailedPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const { handleGetProductById } = useProduct();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
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
  }, [id]);

  const product = useMemo(
    () => getProductFromState(products, id),
    [id, products],
  );

  const variants = product?.variants || [];

  const totalStock = variants.reduce(
    (sum, v) => sum + (Number(v?.stock) || 0),
    0,
  );

  // Images: show variant images if a variant is selected and has images,
  // otherwise fall back to product images
  const activeVariant = variants[selectedVariant] || null;

  const images = useMemo(() => {
    if (activeVariant?.images?.length) return activeVariant.images;
    if (product?.images?.length) return product.images;
    return [{ url: FALLBACK_IMAGE }];
  }, [activeVariant, product?.images]);

  // Reset image index when images source changes
  useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  const displayPrice = activeVariant?.price?.amount
    ? activeVariant.price
    : product?.price;

  const availableSizes = [
    ...new Set(variants.map((v) => v.size).filter(Boolean)),
  ];

  const availableColors = [
    ...new Set(variants.map((v) => getColorValue(v)).filter(Boolean)),
  ];

  const handleAddToCart = () => setIsAdded(true);
  const handleBuyNow = () => setIsAdded(true);

  const handleSelectVariant = (index) => {
    setSelectedVariant(index);
    setIsAdded(false);
  };

  // ───── RENDER ─────

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
          {/* NAV */}
          <nav className="mb-14 flex items-center justify-between border-b border-[#E5DED4] pb-5">
            <button
              className="text-sm text-[#7A6E63] transition hover:text-[#1b1c1a]"
              onClick={() => navigate(-1)}
              type="button"
            >
              ← Back
            </button>

            <span
              className="text-xs font-medium uppercase tracking-[0.32em] text-[#C9A96E]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Snitch.
            </span>
          </nav>

          {/* LOADING SKELETON */}
          {isLoading && (
            <div className="grid gap-8 lg:grid-cols-[0.8fr_0.75fr]">
              <div className="grid gap-3 md:grid-cols-[64px_1fr]">
                <div className="flex gap-2 md:flex-col">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-14 w-12 shrink-0 animate-pulse bg-[#f0ece7]"
                    />
                  ))}
                </div>
                <div className="aspect-[4/5] animate-pulse bg-[#f0ece7]" />
              </div>
              <div className="space-y-5 pt-4">
                <div className="h-4 w-28 animate-pulse bg-[#EEE8DF]" />
                <div className="h-12 w-3/4 animate-pulse bg-[#EEE8DF]" />
                <div className="h-4 w-36 animate-pulse bg-[#EEE8DF]" />
                <div className="h-px w-14 bg-[#EEE8DF]" />
                <div className="h-24 w-full animate-pulse bg-[#EEE8DF]" />
                <div className="flex gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-28 w-32 animate-pulse bg-[#f0ece7]"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ERROR */}
          {!isLoading && error && (
            <div className="border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* PRODUCT NOT FOUND */}
          {!isLoading && !error && !product && (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#C9A96E]">
                Not Found
              </p>
              <p
                className="mt-4 max-w-md text-xl leading-relaxed text-[#7A6E63]"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                This product could not be found.
              </p>
            </div>
          )}

          {/* MAIN CONTENT */}
          {!isLoading && !error && product && (
            <>
              {/* ─── TOP GRID: IMAGES & VARIANTS + INFO ─── */}
              <div className="mx-auto grid w-full max-w-4xl gap-10 lg:grid-cols-[0.85fr_0.75fr] lg:gap-12 items-start">
                {/* ─── LEFT COLUMN: IMAGES + VARIANTS ─── */}
                <div className="flex flex-col gap-10 overflow-hidden">
                  {/* IMAGE GALLERY (thumbnails left) */}
                  <div className="grid gap-3 md:grid-cols-[64px_1fr]">
                    {/* Thumbnails */}
                    <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2 md:pb-0">
                      {images.map((image, index) => (
                        <button
                          className={`h-14 w-12 shrink-0 overflow-hidden border bg-[#f5f3f0] transition ${selectedImage === index
                            ? "border-[#1b1c1a]"
                            : "border-[#E5DED4] hover:border-[#C9A96E]"
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

                    {/* Main Image */}
                    <div className="order-1 mx-auto aspect-[4/5] w-full max-w-[360px] overflow-hidden bg-[#f5f3f0] md:order-2 group">
                      <img
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={images[selectedImage]?.url}
                      />
                    </div>
                  </div>

                  {/* ─── VARIANTS SECTION (horizontal scroll) ─── */}
                  <div className="w-full border-t border-[#E5DED4] pt-8">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-[#C9A96E]">
                          Variants
                        </p>
                        <h2
                          className="mt-1 text-lg font-light text-[#1b1c1a]"
                          style={{ fontFamily: "'Cormorant Garamond', serif" }}
                        >
                          Available options
                        </h2>
                      </div>
                      {variants.length > 0 && (
                        <span className="text-[9px] uppercase tracking-[0.18em] text-[#7A6E63]">
                          {variants.length} option{variants.length !== 1 && "s"}
                        </span>
                      )}
                    </div>

                    {variants.length === 0 ? (
                      <p className="border border-[#E5DED4] px-3 py-3 text-[11px] leading-5 text-[#7A6E63]">
                        Variant details will appear here when added.
                      </p>
                    ) : (
                      <div
                        className="flex gap-3 overflow-x-auto pb-3"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#C9A96E #f0ece7",
                        }}
                      >
                        {variants.map((variant, index) => {
                          const variantImage =
                            variant.images?.[0]?.url ||
                            product.images?.[0]?.url ||
                            FALLBACK_IMAGE;

                          const color = getColorValue(variant);
                          const otherAttrs = getNonColorAttributes(variant);
                          const isSelected = selectedVariant === index;
                          const stock = Number(variant.stock) || 0;
                          const variantPrice = variant.price?.amount
                            ? variant.price
                            : product.price;

                          return (
                            <button
                              key={`${variant.size || "v"}-${index}`}
                              onClick={() => handleSelectVariant(index)}
                              type="button"
                              className={`flex-shrink-0 w-[110px] overflow-hidden border text-left transition-all duration-300 flex flex-col ${isSelected
                                ? "border-[#1b1c1a] shadow-sm"
                                : "border-[#E5DED4] hover:border-[#C9A96E]"
                                }`}
                            >
                              {/* Variant image */}
                              <div className="aspect-square w-full overflow-hidden bg-[#f5f3f0]">
                                <img
                                  alt={`${product.title} – ${variant.size || "variant"}`}
                                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                  src={variantImage}
                                />
                              </div>

                              {/* Variant info */}
                              <div className="p-2 flex flex-col flex-grow gap-1.5 bg-white">
                                {/* Size + Stock row */}
                                <div className="flex items-center justify-between gap-1">
                                  {variant.size ? (
                                    <span className="border border-[#E5DED4] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#1b1c1a] bg-[#fbf9f6]">
                                      {variant.size}
                                    </span>
                                  ) : <span />}
                                  <span
                                    className="text-[9px] uppercase tracking-wider whitespace-nowrap"
                                    style={{
                                      color: stock > 0 ? "#7A6E63" : "#C47070",
                                    }}
                                  >
                                    {stock > 0 ? `${stock} left` : "Sold out"}
                                  </span>
                                </div>

                                {/* Price */}
                                <p className="text-[11px] font-medium text-[#1b1c1a]">
                                  {formatPrice(variantPrice)}
                                </p>

                                {/* Color swatch – only if this variant has a color */}
                                {color && (
                                  <div className="flex items-center gap-1.5 mt-auto pt-1">
                                    <span
                                      className="inline-block h-3 w-3 rounded-full border border-[#d5cfc7] shrink-0"
                                      style={{ backgroundColor: color.toLowerCase() }}
                                      title={color}
                                    />
                                    <span className="text-[8px] capitalize text-[#7A6E63] truncate">
                                      {color}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* ─── RIGHT COLUMN: PRODUCT INFO ─── */}
                <div className="flex flex-col">
                  <p className="text-[9px] font-medium uppercase tracking-[0.26em] text-[#C9A96E]">
                    Product Details
                  </p>

                  {/* Title + Wishlist */}
                  <div className="mt-3 flex items-start justify-between gap-6">
                    <h1
                      className="text-2xl font-light leading-tight text-[#1b1c1a] lg:text-3xl"
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {product.title}
                    </h1>

                    <button
                      aria-label="Add to wishlist"
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-base transition ${isLiked
                        ? "border-[#1b1c1a] bg-[#1b1c1a] text-white"
                        : "border-[#E5DED4] bg-transparent text-[#1b1c1a] hover:border-[#1b1c1a]"
                        }`}
                      onClick={() => setIsLiked((c) => !c)}
                      type="button"
                    >
                      {isLiked ? "♥" : "♡"}
                    </button>
                  </div>

                  {/* Price */}
                  <p className="mt-3 text-sm font-medium text-[#1b1c1a]">
                    {formatPrice(displayPrice)}
                  </p>

                  {/* Stock + Sizes badges */}
                  <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-[0.18em]">
                    <span className="border border-[#E5DED4] px-3 py-2 text-[#1b1c1a]">
                      {variants.length
                        ? `${totalStock} in stock`
                        : "Stock not added"}
                    </span>

                    {availableSizes.length > 0 && (
                      <span className="border border-[#E5DED4] px-3 py-2 text-[#7A6E63]">
                        Sizes: {availableSizes.join(", ")}
                      </span>
                    )}

                    {getColorValue(activeVariant) && (
                      <span className="flex items-center gap-1.5 border border-[#E5DED4] px-3 py-2 text-[#7A6E63]">
                        <span
                          className="inline-block h-3.5 w-3.5 rounded-full border border-[#d5cfc7] shrink-0"
                          style={{ backgroundColor: getColorValue(activeVariant).toLowerCase() }}
                          title={getColorValue(activeVariant)}
                        />
                        <span className="capitalize">{getColorValue(activeVariant)}</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-5 h-px w-14 bg-[#C9A96E]" />

                  {/* Description */}
                  <p className="mt-6 text-xs leading-6 text-[#7A6E63]">
                    {product.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    <button
                      className="border border-[#1b1c1a] px-4 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#1b1c1a] transition hover:bg-[#1b1c1a] hover:text-white"
                      onClick={handleAddToCart}
                      type="button"
                    >
                      {isAdded ? "✓ Added" : "Add to Cart"}
                    </button>

                    <button
                      className="bg-[#1b1c1a] px-4 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-[#C9A96E] hover:text-[#1b1c1a]"
                      onClick={handleBuyNow}
                      type="button"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Trust bar */}
                  <div className="mt-7 grid gap-3 border-t border-[#E5DED4] pt-5 text-[11px] leading-5 text-[#7A6E63] sm:grid-cols-3">
                    <span>🔒 Secure checkout</span>
                    <span>✓ Quality checked</span>
                    <span>↩ Easy returns</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
};

export default DetailedPage;