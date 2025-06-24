import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Mail } from 'lucide-react';
import { countries } from '../data/countries';

const ContactSection = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formType, setFormType] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
  } = useForm();

  const resetForm = () => {
    reset();
    setSelectedCountry(null);
    clearErrors();
  };

  const handleButtonClick = (type) => {
    if (formType === type) {
      setIsFormVisible(!isFormVisible);
    } else {
      setFormType(type);
      setIsFormVisible(true);
      setIsSubmitted(false);
      resetForm();
    }
  };

 const handleCountryChange = (option) => {
  setSelectedCountry(option);
  setValue('country', option?.value || '');
  if (option) {
    clearErrors('country');
  } 
};

const onSubmit = async (formData) => {
  setIsLoading(true);
  try {
    console.log('Form Submission Started:', {
      formType,
      formData,
      selectedCountry,
    });

    if (!selectedCountry || !selectedCountry.value || !selectedCountry.phoneCode) {
      throw new Error('Please select a valid country with value and phone code');
    }

    const payload = {
      fullName: formData.fullName,
      companyName: formData.companyName,
      companyEmail: formData.companyEmail,
      country: selectedCountry.value,
      companyAddress: formData.companyAddress,
      websiteLink: formData.websiteLink || undefined,
      code: selectedCountry.phoneCode,
      number: formData.mobileNumber,
      additionalMessage: formData.message || undefined,
      ...(formType === 'sales'
        ? { SalesDetails: formData.requirements }
        : { requirements: formData.requirements }),
    };
    
    
    console.log('Payload to Send:', payload);
    const endpoint = formType === 'sales'
      ? `${import.meta.env.VITE_BACKEND_URL}/api/form/salseform`
      : `${import.meta.env.VITE_BACKEND_URL}/api/form/requirementform`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.log('Error Response Data:', errorData);
      } catch (jsonError) {
        console.error('Failed to parse error response:', jsonError);
        errorData = { message: 'No error details available' };
      }
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
      name: error.name,
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
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => handleButtonClick('requirements')}
            className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 ${
              formType === 'requirements'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-600 border border-emerald-600'
            }`}
          >
            <Mail size={18} /> Requirements Form
          </button>

          <button
            type="button"
            onClick={() => handleButtonClick('sales')}
            className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 ${
              formType === 'sales'
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-emerald-600 border border-emerald-600'
            }`}
          >
            <Mail size={18} /> Sales Form
          </button>
        </div>

        <div className={`transition-all duration-300 ${
          isFormVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {formType === 'sales' ? 'Sales Inquiry' : 'Requirements Form'}
            </h2>

            {isSubmitted && (
              <div className="mb-6 p-4 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-md">
                Thank you! We'll contact you soon.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="fullName" label="Full Name" placeholder="John Doe" />
                <InputField id="companyName" label="Company Name" placeholder="Acme Inc." />
                <InputField
                  id="companyEmail"
                  label="Company Email"
                  type="email"
                  placeholder="contact@company.com"
                  validation={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={countries}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    placeholder="Select country"
                    isSearchable
                    classNamePrefix="select"
                  />
                  {!selectedCountry && errors.country && (
                    <p className="mt-1 text-sm text-red-600">Country is required</p>
                  )}
                </div>
              </div>

              <TextAreaField
                id="companyAddress"
                label="Company Address"
                placeholder="123 Business Rd, City, Country"
              />

              <InputField
                id="websiteLink"
                label="Website (Optional)"
                placeholder="https://company.com"
                required={false}
                type="url"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedCountry?.phoneCode || ''}
                      readOnly
                      className="w-1/4 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                    />
                    <input
                      type="tel"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="9876543210"
                      {...register('mobileNumber', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\d{7,15}$/,
                          message: 'Invalid phone number format',
                        },
                      })}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNumber.message}</p>
                  )}
                </div>
              </div>

              <TextAreaField
                id="requirements"
                label={formType === 'sales' ? 'SalesDetails' : 'Requirements'}
                rows={4}
                placeholder={formType === 'sales' ? 'Describe your sales inquiry...' : 'Describe your requirements...'}
              />

              <TextAreaField
                id="message"
                label="Additional Message (Optional)"
                placeholder="Any additional information..."
                required={false}
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
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
