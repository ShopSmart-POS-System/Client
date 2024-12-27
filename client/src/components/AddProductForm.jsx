import { X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const INITIAL_FORM_STATE = {
  pName: "",
  unitPrice: "",
  inStockCount: "",
  lowStockCount: "",
  categoryID: "",
};

const INPUT_FIELDS = [
  {
    id: "pName",
    label: "Product Name",
    type: "text",
    validate: (value) =>
      !value.trim()
        ? "Product name is required"
        : value.length > 100
        ? "Product name cannot exceed 100 characters"
        : "",
  },
  {
    id: "unitPrice",
    label: "Unit Price",
    type: "number",
    min: "0",
    step: "0.01",
    validate: (value) => {
      const price = parseFloat(value);
      return !value
        ? "Unit price is required"
        : isNaN(price) || price < 0
        ? "Please enter a valid positive price"
        : price > 999999.99
        ? "Price is too high"
        : "";
    },
  },
  {
    id: "inStockCount",
    label: "Current Stock Count",
    type: "number",
    min: "0",
    validate: (value) => {
      const count = parseInt(value);
      return !value
        ? "Stock count is required"
        : isNaN(count) || count < 0
        ? "Please enter a valid positive number"
        : count > 2147483647
        ? "Stock count is too high"
        : "";
    },
  },
  {
    id: "lowStockCount",
    label: "Low Stock Alert Threshold",
    type: "number",
    min: "0",
    validate: (value, formData) => {
      const count = parseInt(value);
      return !value
        ? "Low stock threshold is required"
        : isNaN(count) || count < 0
        ? "Please enter a valid positive number"
        : count > parseInt(formData.inStockCount)
        ? "Low stock alert cannot be higher than current stock"
        : "";
    },
  },
  {
    id: "categoryID",
    label: "Category ID (4 digits)",
    type: "number",
    min: "1000",
    max: "9999",
    placeholder: "1000-9999",
    validate: (value) => {
      const categoryId = parseInt(value);
      return !value
        ? "Category ID is required"
        : isNaN(categoryId) || categoryId < 1000 || categoryId > 9999
        ? "Please enter a valid 4-digit category ID (1000-9999)"
        : "";
    },
  },
];

export const AddProductForm = ({ onClose }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Log the changed field and its value
    console.log(`Field ${name} changed to:`, value);

    const field = INPUT_FIELDS.find((f) => f.id === name);
    const error = field.validate(value, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log current form data before validation
    console.log("Current form data before validation:", formData);

    // Validate all fields
    const newErrors = {};
    let isValid = true;

    INPUT_FIELDS.forEach((field) => {
      const error = field.validate(formData[field.id], formData);
      if (error) {
        newErrors[field.id] = error;
        isValid = false;
      }
    });

    // Log validation results
    console.log("Validation errors:", newErrors);
    console.log("Form is valid:", isValid);

    setErrors(newErrors);
    if (!isValid) {
      toast.error("Please fix the form errors before submitting");
      return;
    }

    setIsSubmitting(true);

    // Log the processed data that will be sent to the API
    const processedData = {
      ...formData,
      unitPrice: parseFloat(formData.unitPrice),
      inStockCount: parseInt(formData.inStockCount),
      lowStockCount: parseInt(formData.lowStockCount),
      categoryID: parseInt(formData.categoryID),
    };
    console.log("Processed data being sent to API:", processedData);

    // Show loading toast
    toast.loading("Adding product...", {
      id: "addProduct",
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/api/products/add",
        processedData
      );

      // Log successful response
      console.log("API Response:", response.data);

      // Update loading toast to success
      toast.success("Successfully added the product!", {
        id: "addProduct",
        duration: 3000,
      });

      // Reset form and close
      setFormData(INITIAL_FORM_STATE);
      onClose();
    } catch (error) {
      // Log error details
      console.error("API Error:", error.response?.data || error.message);

      // Handle error with axios error object
      const errorMessage =
        error.response?.data?.message || "Failed to add product";
      toast.error(errorMessage, {
        id: "addProduct",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Add New Product</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {INPUT_FIELDS.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={handleChange}
                min={field.min}
                max={field.max}
                step={field.step}
                placeholder={field.placeholder}
                disabled={isSubmitting}
                className={`mt-1 block w-full rounded-md p-2 border ${
                  errors[field.id] ? "border-red-500" : "border-gray-300"
                } focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              />
              {errors[field.id] && (
                <p className="mt-1 text-sm text-red-600">{errors[field.id]}</p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px] transition-all duration-200 ease-in-out"
          >
            {isSubmitting ? (
              <>
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white transition-all duration-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="animate-pulse">Adding...</span>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span>Add Product</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;
