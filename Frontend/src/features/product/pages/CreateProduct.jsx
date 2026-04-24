import { useEffect, useState } from "react";
import { useProduct } from "../hook/useProduct";

const CreateProduct = () => {
  const { handleCreateProduct } = useProduct();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const previewUrls = images.map((image) => URL.createObjectURL(image));
    setPreviews(previewUrls);

    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selectedImages = Array.from(event.target.files || []);
    const nextImages = [...images, ...selectedImages].slice(0, 6);

    setImages(nextImages);
    setStatus({
      type: selectedImages.length + images.length > 6 ? "error" : "",
      message:
        selectedImages.length + images.length > 6
          ? "You can upload up to 6 product images."
          : "",
    });
    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== indexToRemove),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    const productFormData = new FormData();
    productFormData.append("title", formData.title.trim());
    productFormData.append("description", formData.description.trim());
    productFormData.append("priceAmount", formData.priceAmount);
    productFormData.append("priceCurrency", formData.priceCurrency);
    images.forEach((image) => productFormData.append("images", image));

    try {
      await handleCreateProduct(productFormData);
      setFormData({
        title: "",
        description: "",
        priceAmount: "",
        priceCurrency: "INR",
      });
      setImages([]);
      setStatus({
        type: "success",
        message: "Product created successfully.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error?.response?.data?.message ||
          "Unable to create product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-stone-950 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="text-3xl font-medium tracking-normal text-stone-950">
            Create product
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-stone-500">
            Add the product details, price, and up to six images.
          </p>
        </div>

        <form className="grid gap-10 lg:grid-cols-[1fr_320px]" onSubmit={handleSubmit}>
          <div className="space-y-7">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-stone-800"
                htmlFor="title"
              >
                Title
              </label>
              <input
                className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900"
                id="title"
                name="title"
                onChange={handleChange}
                placeholder="Classic linen shirt"
                required
                type="text"
                value={formData.title}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-stone-800"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="min-h-40 w-full resize-y rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-stone-400 focus:border-stone-900"
                id="description"
                name="description"
                onChange={handleChange}
                placeholder="Describe the fit, fabric, color, and product details."
                required
                value={formData.description}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-stone-800"
                  htmlFor="priceAmount"
                >
                  Price amount
                </label>
                <input
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-stone-400 focus:border-stone-900"
                  id="priceAmount"
                  min="0"
                  name="priceAmount"
                  onChange={handleChange}
                  placeholder="2499"
                  required
                  step="0.01"
                  type="number"
                  value={formData.priceAmount}
                />
              </div>

              <div>
                <label
                  className="mb-2 block text-sm font-medium text-stone-800"
                  htmlFor="priceCurrency"
                >
                  Currency
                </label>
                <select
                  className="w-full rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-900"
                  id="priceCurrency"
                  name="priceCurrency"
                  onChange={handleChange}
                  required
                  value={formData.priceCurrency}
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="JPY">JPY</option>
                </select>
              </div>
            </div>

          </div>

          <aside className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label
                  className="block text-sm font-medium text-stone-800"
                  htmlFor="images"
                >
                  Product images
                </label>
                <span className="text-xs text-stone-500">
                  {images.length}/6 uploaded
                </span>
              </div>

              <label
                className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-stone-300 px-5 py-8 text-center transition hover:border-stone-900"
                htmlFor="images"
              >
                <span className="text-sm font-medium text-stone-900">
                  Upload images
                </span>
                <span className="mt-2 max-w-56 text-xs leading-5 text-stone-500">
                  Choose clear product photos. You can add up to six.
                </span>
                <input
                  accept="image/*"
                  className="sr-only"
                  disabled={images.length >= 6}
                  id="images"
                  multiple
                  name="images"
                  onChange={handleImagesChange}
                  type="file"
                />
              </label>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {previews.map((preview, index) => (
                  <div
                    className="group relative aspect-square overflow-hidden rounded-lg border border-stone-200 bg-stone-50"
                    key={preview}
                  >
                    <img
                      alt={`Product preview ${index + 1}`}
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

            {status.message && (
              <p
                className={`rounded-lg px-4 py-3 text-sm ${
                  status.type === "success"
                    ? "bg-stone-50 text-stone-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              className="w-full rounded-lg bg-stone-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Creating product..." : "Create product"}
            </button>
          </aside>
        </form>
      </section>
    </main>
  );
};

export default CreateProduct;
