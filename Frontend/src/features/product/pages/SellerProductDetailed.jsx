import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { useProduct } from "../hook/useProduct.js";

const INITIAL_FORM = {
  sizes: [],
  stock: "",
  priceAmount: "",
  attributeKey: "",
  attributeValue: "",
};

const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const MAX_IMAGES = 6;

const formatPrice = (price) => {
  if (!price?.amount) return "Price unavailable";

  return new Intl.NumberFormat("en-IN", {
    currency: price.currency || "INR",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(price.amount);
};

const attributesToObject = (attributes) =>
  attributes.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

const getProductFromState = (products, id) => {
  if (Array.isArray(products)) {
    return products.find((product) => product._id === id) || null;
  }

  return products?.product || products || null;
};

const isColorKey = (key) =>
  ["color", "colour"].includes(key?.toLowerCase()?.trim());

/* ------------------------------------------------------------------ */
/* Attribute renderer – color key → swatch, others → chip             */
/* ------------------------------------------------------------------ */
const AttributeChip = ({ attrKey, value }) => {
  if (isColorKey(attrKey)) {
    return (
      <span
        title={`${attrKey}: ${value}`}
        style={{ backgroundColor: value }}
        className="inline-block h-4 w-4 rounded-full border border-stone-300 flex-shrink-0"
      />
    );
  }

  return (
    <span className="inline-flex items-center rounded border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] leading-none text-stone-600">
      <span className="font-medium text-stone-500">{attrKey}:&nbsp;</span>
      {value}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Form attribute chip – with × remove button                         */
/* ------------------------------------------------------------------ */
const FormAttributeChip = ({ attrKey, value, onRemove }) => {
  if (isColorKey(attrKey)) {
    return (
      <button
        type="button"
        onClick={onRemove}
        title={`Remove ${attrKey}: ${value}`}
        className="group inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2 py-1 text-xs text-stone-600 hover:border-red-300 hover:bg-red-50"
      >
        <span
          style={{ backgroundColor: value }}
          className="h-3 w-3 rounded-full border border-stone-300 flex-shrink-0"
        />
        <span className="font-medium">{value}</span>
        <span className="text-stone-400 group-hover:text-red-500">×</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onRemove}
      className="group inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-[11px] text-stone-600 hover:border-red-300 hover:bg-red-50"
    >
      <span className="font-medium text-stone-500">{attrKey}:&nbsp;</span>
      {value}
      <span className="ml-0.5 text-stone-400 group-hover:text-red-500">×</span>
    </button>
  );
};

const FieldLabel = ({ children, htmlFor }) => (
  <label
    className="mb-1 block text-xs font-medium text-stone-600"
    htmlFor={htmlFor}
  >
    {children}
  </label>
);

/* ------------------------------------------------------------------ */
/* Variant Card – compact, consistent height                           */
/* ------------------------------------------------------------------ */
const VariantCard = ({ variant, fallbackImage, fallbackPrice }) => {
  const image = variant.images?.[0]?.url || fallbackImage || "/fallback.png";
  const attributes = Object.entries(variant.attributes || variant.attribute || {});
  const price = variant.price?.amount ? variant.price : fallbackPrice;

  const colorAttrs = attributes.filter(([k]) => isColorKey(k));
  const otherAttrs = attributes.filter(([k]) => !isColorKey(k));

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white">
      {/* Image – reduced from aspect-[4/3] */}
      <div className="relative h-32 flex-shrink-0 bg-stone-100">
        <img
          alt={`Variant ${variant.size || "one size"}`}
          className="h-full w-full object-cover"
          src={image}
        />
        {/* Size badge overlaid on image */}
        <span className="absolute left-2 top-2 rounded bg-white/90 px-1.5 py-0.5 text-[11px] font-semibold text-stone-900 shadow-sm backdrop-blur-sm">
          {variant.size || "One"}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <div className="flex items-center justify-between gap-1">
          <p className="text-sm font-semibold text-stone-900">
            {formatPrice(price)}
          </p>
          <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-500">
            Stock&nbsp;{Number(variant.stock) || 0}
          </span>
        </div>

        {/* Attributes */}
        {attributes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {colorAttrs.map(([k, v]) => (
              <AttributeChip key={k} attrKey={k} value={v} />
            ))}
            {otherAttrs.map(([k, v]) => (
              <AttributeChip key={k} attrKey={k} value={v} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

/* ------------------------------------------------------------------ */
/* Variant Form                                                         */
/* ------------------------------------------------------------------ */
const VariantForm = ({ productId, onSuccess, onClose }) => {
  const { handleAddProductVariant, handleGetProductById } = useProduct();
  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const setField = (name, value) =>
    setForm((current) => ({ ...current, [name]: value }));

  const toggleSize = (size) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size],
    }));
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    setImages((current) => [...current, ...files].slice(0, MAX_IMAGES));
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };

  const addAttribute = () => {
    const key = form.attributeKey.trim();
    const value = form.attributeValue.trim();

    if (!key || !value) {
      setStatus({ type: "error", message: "Add both attribute key and value." });
      return;
    }

    setAttributes((current) => [
      ...current.filter((item) => item.key.toLowerCase() !== key.toLowerCase()),
      { key, value },
    ]);
    setField("attributeKey", "");
    setField("attributeValue", "");
    setStatus({ type: "", message: "" });
  };

  const removeAttribute = (key) =>
    setAttributes((current) => current.filter((item) => item.key !== key));

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setImages([]);
    setAttributes([]);
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.sizes.length === 0) {
      setStatus({ type: "error", message: "Select at least one size." });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      await handleAddProductVariant(productId, {
        attributes: attributesToObject(attributes),
        images: images.map((file) => ({ file })),
        price: form.priceAmount,
        sizes: form.sizes,
        stock: form.stock,
      });

      await handleGetProductById(productId);
      resetForm();
      onSuccess("Variant added successfully.");
      onClose();
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to add variant. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="mt-4 space-y-4 border-t border-stone-200 pt-4"
      onSubmit={handleSubmit}
    >
      {/* ── Sizes ───────────────────────────────────────────── */}
      <div>
        <p className="mb-1.5 text-xs font-medium text-stone-600">Sizes</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZE_OPTIONS.map((size) => {
            const active = form.sizes.includes(size);
            return (
              <button
                className={`h-8 w-8 rounded-lg border text-xs font-semibold transition ${active
                    ? "border-stone-950 bg-stone-950 text-white"
                    : "border-stone-300 bg-white text-stone-900 hover:border-stone-900"
                  }`}
                key={size}
                onClick={() => toggleSize(size)}
                type="button"
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Stock & Price ────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="stock">Stock</FieldLabel>
          <input
            className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-900"
            id="stock"
            min="0"
            onChange={(event) => setField("stock", event.target.value)}
            placeholder="0"
            type="number"
            value={form.stock}
          />
        </div>
        <div>
          <FieldLabel htmlFor="priceAmount">Variant price</FieldLabel>
          <input
            className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-900"
            id="priceAmount"
            min="0"
            onChange={(event) => setField("priceAmount", event.target.value)}
            placeholder="Leave empty for product price"
            step="0.01"
            type="number"
            value={form.priceAmount}
          />
        </div>
      </div>

      {/* ── Attributes ──────────────────────────────────────── */}
      <div>
        <p className="mb-1.5 text-xs font-medium text-stone-600">Attributes</p>
        <div className="flex gap-2">
          <input
            className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-900"
            id="attributeKey"
            onChange={(event) => setField("attributeKey", event.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttribute())}
            placeholder="Key (e.g. Color)"
            type="text"
            value={form.attributeKey}
          />
          <input
            className="min-w-0 flex-1 rounded-lg border border-stone-300 px-3 py-1.5 text-sm outline-none focus:border-stone-900"
            id="attributeValue"
            onChange={(event) => setField("attributeValue", event.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAttribute())}
            placeholder="Value (e.g. Black)"
            type="text"
            value={form.attributeValue}
          />
          <button
            className="flex-shrink-0 rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium text-stone-900 hover:border-stone-900"
            onClick={addAttribute}
            type="button"
          >
            Add
          </button>
        </div>

        {attributes.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {attributes.map((attr) => (
              <FormAttributeChip
                key={attr.key}
                attrKey={attr.key}
                value={attr.value}
                onRemove={() => removeAttribute(attr.key)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Images ──────────────────────────────────────────── */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <FieldLabel htmlFor="variantImages">Images</FieldLabel>
          <span className="text-xs text-stone-400">
            {images.length}/{MAX_IMAGES}
          </span>
        </div>

        {images.length < MAX_IMAGES && (
          <input
            accept="image/*"
            className="block w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-600 file:mr-3 file:rounded file:border-0 file:bg-stone-100 file:px-2 file:py-0.5 file:text-xs file:font-medium file:text-stone-700"
            id="variantImages"
            multiple
            onChange={handleFiles}
            type="file"
          />
        )}

        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:grid-cols-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-50"
              >
                <img
                  src={URL.createObjectURL(img)}
                  alt={img.name}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100"
                  title="Remove"
                >
                  <span className="text-base font-bold text-white leading-none">×</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Status ──────────────────────────────────────────── */}
      {status.message && (
        <p
          className={`rounded-lg px-3 py-2 text-xs ${status.type === "error"
              ? "bg-red-50 text-red-700"
              : "bg-stone-100 text-stone-700"
            }`}
        >
          {status.message}
        </p>
      )}

      {/* ── Actions ─────────────────────────────────────────── */}
      <div className="flex justify-end gap-2 pt-1">
        <button
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:border-stone-500"
          onClick={resetForm}
          type="button"
        >
          Reset
        </button>
        <button
          className="rounded-lg border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:border-stone-500"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
        <button
          className="rounded-lg bg-stone-950 px-4 py-1.5 text-xs font-medium text-white disabled:bg-stone-300"
          disabled={loading}
          type="submit"
        >
          {loading ? "Saving…" : "Add variant"}
        </button>
      </div>
    </form>
  );
};

/* ================================================================== */
/* Main page                                                           */
/* ================================================================== */
const SellerProductDetailed = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();
  const products = useSelector((state) => state.product.products);

  const [formOpen, setFormOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setError("");
        await handleGetProductById(id);
      } catch (loadError) {
        setError(
          loadError?.response?.data?.message || "Unable to load product.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const product = useMemo(
    () => getProductFromState(products, id),
    [products, id],
  );

  const variants = product?.variants || [];
  const totalStock = variants.reduce(
    (sum, variant) => sum + (Number(variant?.stock) || 0),
    0,
  );
  const fallbackImage = product?.images?.[0]?.url;

  /* ── Loading / error states ──────────────────────────────── */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-400">Loading product…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm text-stone-400">Product not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-50 px-4 py-5 text-stone-950">
      <section className="mx-auto max-w-4xl space-y-4">

        {/* ── Top bar ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-950"
            onClick={() => navigate(-1)}
            type="button"
          >
            ← Back
          </button>
          <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">
            Seller View
          </span>
        </div>

        {/* ── Product info card ────────────────────────────────── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="grid gap-4 md:grid-cols-[160px_1fr]">
            <div className="overflow-hidden rounded-xl bg-stone-100">
              <img
                alt={product.title}
                className="aspect-[3/4] h-full w-full object-cover"
                src={fallbackImage || "/fallback.png"}
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <div>
                <h1 className="text-xl font-semibold leading-tight">{product.title}</h1>
                <p className="mt-1 max-w-prose text-sm leading-5 text-stone-500">
                  {product.description}
                </p>
              </div>
              <p className="text-base font-semibold">{formatPrice(product.price)}</p>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-stone-50 px-3 py-2">
                  <p className="text-[10px] text-stone-400">Variants</p>
                  <p className="text-lg font-semibold">{variants.length}</p>
                </div>
                <div className="rounded-lg bg-stone-50 px-3 py-2">
                  <p className="text-[10px] text-stone-400">Total stock</p>
                  <p className="text-lg font-semibold">{totalStock}</p>
                </div>
                <div className="rounded-lg bg-stone-50 px-3 py-2">
                  <p className="text-[10px] text-stone-400">Sizes</p>
                  <p className="text-sm font-semibold leading-tight">
                    {variants.map((v) => v.size).filter(Boolean).join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Manage variants card ─────────────────────────────── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold">Manage variants</h2>
              <p className="text-xs text-stone-500">
                Add stock, size, attributes, and optional variant images.
              </p>
            </div>
            <button
              className="flex-shrink-0 rounded-full border border-stone-300 px-3 py-1.5 text-xs font-medium hover:border-stone-950"
              onClick={() => {
                setMessage("");
                setFormOpen((current) => !current);
              }}
              type="button"
            >
              {formOpen ? "Close" : "Add variant"}
            </button>
          </div>

          {message && !formOpen && (
            <p className="mt-3 rounded-lg bg-stone-100 px-3 py-2 text-xs text-stone-700">
              {message}
            </p>
          )}

          {formOpen && (
            <VariantForm
              productId={id}
              onClose={() => setFormOpen(false)}
              onSuccess={setMessage}
            />
          )}
        </div>

        {/* ── All variants card ────────────────────────────────── */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <h2 className="mb-3 text-base font-semibold">
            All variants
            {variants.length > 0 && (
              <span className="ml-2 text-xs font-normal text-stone-400">
                ({variants.length})
              </span>
            )}
          </h2>

          {variants.length === 0 ? (
            <p className="rounded-xl bg-stone-50 px-4 py-5 text-center text-sm text-stone-400">
              No variants yet. Add one above.
            </p>
          ) : (
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {variants.map((variant, index) => (
                <VariantCard
                  fallbackImage={fallbackImage}
                  fallbackPrice={product.price}
                  key={`${variant.size || "variant"}-${index}`}
                  variant={variant}
                />
              ))}
            </div>
          )}
        </div>

      </section>
    </main>
  );
};

export default SellerProductDetailed;
