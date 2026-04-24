import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_VARIANT_FORM = {
  size: "M",
  stock: "",
  variantPriceAmount: "",
  variantPriceCurrency: "INR",
  attributeKey: "",
  attributeValue: "",
};

const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const CURRENCY_OPTIONS = ["INR", "USD", "EUR", "GBP", "JPY"];
const MAX_IMAGES = 6;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

const formatPrice = (price) => {
  if (!price?.amount || !price?.currency) return "Price unavailable";
  return new Intl.NumberFormat("en-IN", {
    currency: price.currency,
    style: "currency",
  }).format(price.amount);
};

const attributesToObject = (attributes) =>
  attributes.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

// ─── Shared style helpers ─────────────────────────────────────────────────────

const inputCls =
  "w-full rounded-lg border border-stone-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900";
const labelCls = "mb-2 block text-sm font-medium text-stone-800";

// ─── Sub-components ───────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
    <div className="h-96 animate-pulse rounded-2xl bg-stone-200" />
    <div className="space-y-4">
      <div className="h-6 w-32 animate-pulse rounded bg-stone-200" />
      <div className="h-14 w-full animate-pulse rounded bg-stone-200" />
      <div className="h-24 w-full animate-pulse rounded bg-stone-200" />
    </div>
  </div>
);

const StatusMessage = ({ status, className = "" }) => {
  if (!status.message) return null;
  return (
    <p
      className={`rounded-xl px-4 py-3 text-sm ${
        status.type === "success"
          ? "bg-stone-100 text-stone-700"
          : "bg-red-50 text-red-700"
      } ${className}`}
    >
      {status.message}
    </p>
  );
};

const VariantCard = ({ variant, productTitle, fallbackImage }) => {
  const previewImage =
    variant.images?.[0]?.url || fallbackImage || "/snitch_editorial_warm.png";
  const variantAttributes = Object.entries(variant.attribute || {});

  return (
    <article className="overflow-hidden rounded-[1.25rem] border border-stone-200 bg-stone-50">
      <div className="aspect-[4/3] bg-stone-200">
        <img
          alt={`${productTitle} ${variant.size}`}
          className="h-full w-full object-cover"
          src={previewImage}
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
            Size {variant.size}
          </span>
          <span className="text-sm font-medium text-stone-900">
            Stock {variant.stock}
          </span>
        </div>
        <p className="text-sm font-semibold text-stone-900">
          {formatPrice(variant.price)}
        </p>
        {variantAttributes.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {variantAttributes.map(([key, value]) => (
              <span
                className="rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] text-stone-600"
                key={key}
              >
                {key}: {value}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-stone-500">
          {variant.images?.length || 0} variant image
          {variant.images?.length === 1 ? "" : "s"}
        </p>
      </div>
    </article>
  );
};

const VariantForm = ({ productId, onSuccess, onClose }) => {
  const { handleAddProductVariant } = useProduct();
  const [form, setForm] = useState(INITIAL_VARIANT_FORM);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync image previews whenever images change
  useEffect(() => {
    const urls = images.map((img) => URL.createObjectURL(img));
    setImagePreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleInputChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleImagesChange = ({ target }) => {
    const selected = Array.from(target.files || []);
    const merged = [...images, ...selected].slice(0, MAX_IMAGES);
    setImages(merged);
    if (selected.length + images.length > MAX_IMAGES) {
      setStatus({ type: "error", message: `You can upload up to ${MAX_IMAGES} variant images.` });
    }
    target.value = "";
  };

  const removeImage = (index) =>
    setImages((prev) => prev.filter((_, i) => i !== index));

  const addAttribute = () => {
    const key = form.attributeKey.trim();
    const value = form.attributeValue.trim();
    if (!key || !value) {
      setStatus({ type: "error", message: "Add both an attribute key and value." });
      return;
    }
    setAttributes((prev) => [
      ...prev.filter((a) => a.key.toLowerCase() !== key.toLowerCase()),
      { key, value },
    ]);
    setForm((prev) => ({ ...prev, attributeKey: "", attributeValue: "" }));
    setStatus({ type: "", message: "" });
  };

  const removeAttribute = (key) =>
    setAttributes((prev) => prev.filter((a) => a.key !== key));

  const reset = () => {
    setForm(INITIAL_VARIANT_FORM);
    setImages([]);
    setAttributes([]);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData();
    formData.append("size", form.size);
    formData.append("stock", form.stock);
    formData.append("variantPriceAmount", form.variantPriceAmount);
    formData.append("variantPriceCurrency", form.variantPriceCurrency);
    formData.append("attributes", JSON.stringify(attributesToObject(attributes)));
    images.forEach((img) => formData.append("variantImages", img));

    try {
      await handleAddProductVariant(productId, formData);
      reset();
      onSuccess?.("Variant created successfully.");
      onClose?.();
    } catch (err) {
      const validationMsg = err?.response?.data?.errors?.[0]?.msg;
      setStatus({
        type: "error",
        message: validationMsg || err?.response?.data?.message || "Unable to create variant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="mt-5 grid gap-5 rounded-[1.25rem] bg-stone-50 p-4"
      onSubmit={handleSubmit}
    >
      {/* Size / Stock / Price / Currency */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className={labelCls} htmlFor="size">Size</label>
          <select
            className={inputCls}
            id="size"
            name="size"
            onChange={handleInputChange}
            required
            value={form.size}
          >
            {SIZE_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelCls} htmlFor="stock">Stock</label>
          <input
            className={inputCls}
            id="stock"
            min="0"
            name="stock"
            onChange={handleInputChange}
            placeholder="12"
            required
            type="number"
            value={form.stock}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="variantPriceAmount">Variant price</label>
          <input
            className={inputCls}
            id="variantPriceAmount"
            min="0"
            name="variantPriceAmount"
            onChange={handleInputChange}
            placeholder="2499"
            required
            step="0.01"
            type="number"
            value={form.variantPriceAmount}
          />
        </div>

        <div>
          <label className={labelCls} htmlFor="variantPriceCurrency">Currency</label>
          <select
            className={inputCls}
            id="variantPriceCurrency"
            name="variantPriceCurrency"
            onChange={handleInputChange}
            required
            value={form.variantPriceCurrency}
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attributes */}
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelCls} htmlFor="attributeKey">Attribute key</label>
            <input
              className={inputCls}
              id="attributeKey"
              name="attributeKey"
              onChange={handleInputChange}
              placeholder="Color"
              type="text"
              value={form.attributeKey}
            />
          </div>
          <div>
            <label className={labelCls} htmlFor="attributeValue">Attribute value</label>
            <input
              className={inputCls}
              id="attributeValue"
              name="attributeValue"
              onChange={handleInputChange}
              placeholder="Black"
              type="text"
              value={form.attributeValue}
            />
          </div>
        </div>
        <button
          className="self-end rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
          onClick={addAttribute}
          type="button"
        >
          Add attribute
        </button>
      </div>

      {attributes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {attributes.map((attr) => (
            <button
              className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-700"
              key={attr.key}
              onClick={() => removeAttribute(attr.key)}
              type="button"
            >
              {attr.key}: {attr.value} ×
            </button>
          ))}
        </div>
      )}

      {/* Image upload */}
      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <label className={labelCls} htmlFor="variantImages">Variant images</label>
          <span className="text-xs text-stone-500">{images.length}/{MAX_IMAGES} uploaded</span>
        </div>
        <label
          className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-4 py-6 text-center transition hover:border-stone-900"
          htmlFor="variantImages"
        >
          <span className="text-sm font-medium text-stone-900">Upload variant images</span>
          <span className="mt-2 text-xs leading-5 text-stone-500">
            Add close-ups or color-specific images for this variant.
          </span>
          <input
            accept="image/*"
            className="sr-only"
            disabled={images.length >= MAX_IMAGES}
            id="variantImages"
            multiple
            name="variantImages"
            onChange={handleImagesChange}
            type="file"
          />
        </label>
      </div>

      {imagePreviews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {imagePreviews.map((preview, index) => (
            <div
              className="group relative aspect-square overflow-hidden rounded-xl border border-stone-200 bg-white"
              key={preview}
            >
              <img
                alt={`Variant preview ${index + 1}`}
                className="h-full w-full object-cover"
                src={preview}
              />
              <button
                className="absolute right-2 top-2 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-stone-900 opacity-0 shadow-sm transition group-hover:opacity-100"
                onClick={() => removeImage(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <StatusMessage status={status} />

      <div className="flex justify-end gap-3">
        <button
          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:border-red-300 hover:bg-red-50"
          onClick={reset}
          type="button"
        >
          Delete fields
        </button>
        <button
          className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-stone-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating variant..." : "Save variant"}
        </button>
      </div>
    </form>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const SellerProductDetailed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const products = useSelector((state) => state.product.products);
  const { handleGetProductById } = useProduct();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);

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

  const product = useMemo(() => {
    if (Array.isArray(products)) {
      return products.find((item) => item._id === id) || products[0] || null;
    }
    return products?.product || null;
  }, [products, id]);

  const variants = product?.variants || [];
  const totalStock = variants.reduce((sum, v) => sum + (Number(v?.stock) || 0), 0);
  const sizeLabel = variants.length
    ? variants.map((v) => v.size).join(", ")
    : "No variants";

  const handleVariantSuccess = (message) => setSuccessMessage(message);

  const toggleForm = () => {
    setSuccessMessage("");
    setIsVariantFormOpen((prev) => !prev);
  };

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-6 text-stone-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
          <button
            className="text-sm text-stone-600 transition hover:text-stone-900"
            onClick={() => navigate(-1)}
            type="button"
          >
            Back
          </button>
          <span className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-500">
            Seller View
          </span>
        </div>

        {isLoading && <LoadingSkeleton />}

        {!isLoading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {!isLoading && !error && product && (
          <div className="space-y-6">
            {/* Product summary */}
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-4 shadow-sm">
              <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-start">
                <div className="overflow-hidden rounded-[1.25rem] bg-stone-100">
                  <img
                    alt={product.title}
                    className="aspect-[4/5] h-full w-full object-cover"
                    src={product.images?.[0]?.url || "/snitch_editorial_warm.png"}
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                      Seller Product
                    </p>
                    <h1 className="mt-2 text-2xl font-semibold leading-snug text-stone-900">
                      {product.title}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">
                      {product.description}
                    </p>
                    <p className="mt-4 text-lg font-semibold text-stone-900">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Variants", value: variants.length },
                      { label: "Total Stock", value: totalStock },
                      { label: "Sizes", value: sizeLabel, small: true },
                    ].map(({ label, value, small }) => (
                      <div
                        key={label}
                        className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4"
                      >
                        <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                          {label}
                        </p>
                        <p className={`mt-2 font-semibold text-stone-900 ${small ? "text-sm" : "text-xl"}`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Variant actions */}
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 border-b border-stone-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                    Variant Actions
                  </p>
                  <h2 className="mt-1.5 text-xl font-semibold text-stone-900">
                    Manage product variants
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">
                    Add a new size, stock, price, and images only when needed.
                  </p>
                </div>
                <button
                  className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    isVariantFormOpen
                      ? "bg-stone-900 text-white"
                      : "border border-stone-300 bg-white text-stone-900 hover:border-stone-900"
                  }`}
                  onClick={toggleForm}
                  type="button"
                >
                  {isVariantFormOpen ? "Close variant form" : "Add variant"}
                </button>
              </div>

              {successMessage && !isVariantFormOpen && (
                <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-700">
                  {successMessage}
                </p>
              )}

              {isVariantFormOpen && (
                <VariantForm
                  productId={id}
                  onSuccess={handleVariantSuccess}
                  onClose={() => setIsVariantFormOpen(false)}
                />
              )}
            </div>

            {/* Variant inventory */}
            <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5 shadow-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                  Variant Inventory
                </p>
                <h2 className="mt-1.5 text-xl font-semibold text-stone-900">
                  Sizes, stock, price, and attributes
                </h2>
              </div>

              {variants.length === 0 ? (
                <p className="mt-6 rounded-2xl bg-stone-100 px-4 py-5 text-sm text-stone-600">
                  No variant data is available for this product yet.
                </p>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {variants.map((variant, index) => (
                    <VariantCard
                      key={`${variant.size}-${index}`}
                      variant={variant}
                      productTitle={product.title}
                      fallbackImage={product.images?.[0]?.url}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default SellerProductDetailed;
