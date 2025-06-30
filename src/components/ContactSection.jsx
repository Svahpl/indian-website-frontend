import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';

const ContactSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm();

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    if (!isFormOpen) {
      resetForm();
    }
  };

  const resetForm = () => {
    reset();
    clearErrors();
    setIsSubmitted(false);
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const payload = {
        farmerName: formData.farmerName,
        pattaNumber: formData.pattaNumber,
        state: formData.state,
        mandal: formData.mandal,
        village: formData.village,
        pincode: formData.pincode,
        mobileNumber: formData.mobileNumber,
        cropName: formData.cropName,
        farmingMethod: formData.farmingMethod,
        harvestDate: formData.harvestDate,
        productName: formData.productName,
        productForm: formData.productForm,
        productCondition: formData.productCondition,
        quantity: formData.quantity,
        price: formData.price,
        message: formData.message || undefined,
      };

      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/form/salesform`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server responded with status ${response.status}`
        );
      }

      await response.json();
      setIsSubmitted(true);
      resetForm();
    } catch (error) {
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({
    id,
    label,
    type = 'text',
    required = true,
    validation = {},
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
          errors[id] ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(id, {
          required: required && `${label} is required`,
          ...validation,
        })}
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
      )}
    </div>
  );

  const SelectField = ({ id, label, options }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      <select
        id={id}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
          errors[id] ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(id, { required: `${label} is required` })}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
      )}
    </div>
  );

  const TextAreaField = ({ id, label, rows = 3, required = true }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
          errors[id] ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(id, { required: required && `${label} is required` })}
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>
      )}
    </div>
  );

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Lakshadweep',
    'Puducherry',
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {!isFormOpen ? (
          <div className="text-center">
            <button
              onClick={toggleForm}
              className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Drop us a message for sale
            </button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              </h2>
              <button
                onClick={toggleForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-md">
                Thank you. One of our representative will get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="farmerName" label="Farmer Name" />
                <InputField id="pattaNumber" label="PPB/ROFR Patta Number" />
                <SelectField id="state" label="Select State" options={indianStates} />
                <InputField id="district " label="District " />
                <InputField id="mandal" label="Mandal" />
                <InputField id="village" label="Revenue Village" />
                <InputField
                  id="pincode"
                  label="Pincode"
                  validation={{
                    pattern: {
                      value: /^\d{6}$/,
                      message: 'Pincode must be 6 digits',
                    },
                  }}
                />
                <InputField
                  id="mobileNumber"
                  label="Mobile Number"
                  validation={{
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Mobile number must be 10 digits',
                    },
                  }}
                />
                <InputField id="cropName" label="Crop Name" />
                <SelectField
                  id="farmingMethod"
                  label="Farming Method"
                  options={['Organic', 'Natural Farming', 'Inorganic']}
                />
                <InputField
                  id="harvestDate"
                  label="Crop Harvesting Date"
                  type="date"
                />
                <InputField id="productName" label="Product Name" />
                <InputField id="productForm" label="Product Form" />
                <SelectField
                  id="productCondition"
                  label="Product Condition"
                  options={['Fresh', 'Dried']}
                />
                <InputField
                  id="quantity"
                  label="Quantity (MT)"
                  type="number"
                  validation={{
                    min: { value: 0, message: 'Quantity must be positive' },
                  }}
                />
                <InputField
                  id="price"
                  label="Price (per MT)"
                  type="number"
                  validation={{
                    min: { value: 0, message: 'Price must be positive' },
                  }}
                />
              </div>
              <TextAreaField
                id="message"
                label="Message (Optional)"
                required={false}
                rows={4}
              />
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
