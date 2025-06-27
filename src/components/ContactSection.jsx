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
      console.log('Form Submission Started:', formData);

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

      console.log('Payload to Send:', payload);
      const endpoint = `${import.meta.env.VITE_BACKEND_URL}/api/form/salesform`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server responded with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Success Response:', responseData);

      setIsSubmitted(true);
      resetForm();
    } catch (error) {
      console.error('Submission Error:', {
        message: error.message,
        stack: error.stack,
      });
      alert(`Submission failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const InputField = ({ id, label, type = 'text', placeholder, required = true, validation = {} }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
          errors[id] ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(id, {
          required: required && `${label} is required`,
          ...validation,
        })}
      />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>}
    </div>
  );

  const TextAreaField = ({ id, label, rows = 3, placeholder, required = true }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
          errors[id] ? 'border-red-500' : 'border-gray-300'
        }`}
        {...register(id, { required: required && `${label} is required` })}
      />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id].message}</p>}
    </div>
  );

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
                <Mail size={24} /> Drop Us a Message for Sale
              </h2>
              <button
                onClick={toggleForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-md">
                Thank you! We'll contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="farmerName" label="Farmer Name" placeholder="John Doe" />
                <InputField id="pattaNumber" label="PPB/ROFR Patta Number" placeholder="Enter Patta Number" />
                <InputField id="state" label="State" placeholder="Enter State" />
                <InputField id="mandal" label="Mandal" placeholder="Enter Mandal" />
                <InputField id="village" label="Revenue Village" placeholder="Enter Village" />
                <InputField
                  id="pincode"
                  label="Pincode"
                  placeholder="500001"
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
                  placeholder="9876543210"
                  validation={{
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Mobile number must be 10 digits',
                    },
                  }}
                />
                <InputField id="cropName" label="Crop Name" placeholder="Wheat" />
                <InputField id="farmingMethod" label="Farming Method" placeholder="Organic, Natural, etc." />
                <InputField
                  id="harvestDate"
                  label="Crop Harvesting Date"
                  type="date"
                  placeholder="Select Date"
                />
                <InputField id="productName" label="Product Name" placeholder="Wheat Grain" />
                <InputField id="productForm" label="Product Form" placeholder="Grain, Flour, etc." />
                <InputField id="productCondition" label="Product Condition" placeholder="Fresh, Dried, etc." />
                <InputField
                  id="quantity"
                  label="Quantity (in kg/MT)"
                  placeholder="1000"
                  type="number"
                  validation={{
                    min: { value: 0, message: 'Quantity must be positive' },
                  }}
                />
                <InputField
                  id="price"
                  label="Price (per kg)"
                  placeholder="50"
                  type="number"
                  validation={{
                    min: { value: 0, message: 'Price must be positive' },
                  }}
                />
              </div>
              <TextAreaField
                id="message"
                label="Message (Optional)"
                placeholder="Any additional information..."
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