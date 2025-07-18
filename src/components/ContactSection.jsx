import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { countries } from "../data/countries";

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
    setValue("country", option?.value || "");
    if (option) {
      clearErrors("country");
    }
  };

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (
        !selectedCountry ||
        !selectedCountry.value ||
        !selectedCountry.phoneCode
      ) {
        throw new Error("Please select a valid country");
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
        ...(formType === "sales"
          ? { SalesDetails: formData.requirements }
          : { requirements: formData.requirements }),
      };

      const endpoint =
        formType === "sales"
          ? `${import.meta.env.VITE_BACKEND_URL}/api/form/salesform`
          : `${import.meta.env.VITE_BACKEND_URL}/api/form/requirementform`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Submission failed");
      }

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
    type = "text",
    required = true,
    validation = {},
  }) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
          errors[id] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        }`}
        {...register(id, {
          required: required && `${label} is required`,
          ...validation,
        })}
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[id].message}
        </p>
      )}
    </div>
  );

  const TextAreaField = ({ id, label, rows = 3, required = true }) => (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
          errors[id] ? "border-red-500" : "border-gray-300 dark:border-gray-600"
        }`}
        {...register(id, { required: required && `${label} is required` })}
      />
      {errors[id] && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errors[id].message}
        </p>
      )}
    </div>
  );

  // Dark mode styles for react-select
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgb(55 65 81)", // dark:bg-gray-700
      borderColor: state.isFocused ? "rgb(16 185 129)" : "rgb(75 85 99)", // emerald-500 : gray-600
      color: "white",
      "&:hover": {
        borderColor: "rgb(16 185 129)",
      },
      boxShadow: state.isFocused ? "0 0 0 1px rgb(16 185 129)" : "none",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(55 65 81)", // dark:bg-gray-700
      border: "1px solid rgb(75 85 99)", // dark:border-gray-600
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "rgb(16 185 129)"
        : state.isFocused
        ? "rgb(75 85 99)"
        : "transparent",
      color: "white",
      "&:hover": {
        backgroundColor: "rgb(75 85 99)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgb(156 163 175)", // text-gray-400
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
  };

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900 relative">
      {/* Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Thank you!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                One of our representatives will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => handleButtonClick("requirements")}
            className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors ${
              formType === "requirements"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400"
            }`}
          >
            Drop us a message for requirement
          </button>

          <button
            type="button"
            onClick={() => handleButtonClick("sales")}
            className={`px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-colors ${
              formType === "sales"
                ? "bg-emerald-600 text-white"
                : "bg-white dark:bg-gray-800 text-emerald-600 dark:text-emerald-400 border border-emerald-600 dark:border-emerald-400"
            }`}
          >
            Drop us a message for sale
          </button>
        </div>

        <div
          className={`transition-all duration-300 ${
            isFormVisible
              ? "max-h-[2000px] opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="fullName" label="Enter full name" />
                <InputField id="companyName" label="Enter company name" />
                <InputField
                  id="companyEmail"
                  label="Enter company email"
                  type="email"
                  validation={{
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select country <span className="text-red-500">*</span>
                  </label>
                  <div className="dark:hidden">
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Select country"
                      isSearchable
                      classNamePrefix="select"
                    />
                  </div>
                  <div className="hidden dark:block">
                    <Select
                      options={countries}
                      value={selectedCountry}
                      onChange={handleCountryChange}
                      placeholder="Select country"
                      isSearchable
                      classNamePrefix="select"
                      styles={selectStyles}
                    />
                  </div>
                  {!selectedCountry && errors.country && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      Country is required
                    </p>
                  )}
                </div>
              </div>

              <TextAreaField
                id="companyAddress"
                label="Enter company address"
              />

              <InputField
                id="websiteLink"
                label="Enter website link"
                required={false}
                type="url"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Enter mobile number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={selectedCountry?.phoneCode || ""}
                      readOnly
                      className="w-1/4 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600 dark:text-white"
                    />
                    <input
                      type="number"
                      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                        errors.mobileNumber
                          ? "border-red-500"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      {...register("mobileNumber", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{7,15}$/,
                          message: "Invalid phone number format",
                        },
                      })}
                    />
                  </div>
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.mobileNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <TextAreaField
                id="requirements"
                label={
                  formType === "sales"
                    ? "Please provide your sales details"
                    : "Please describe your requirements"
                }
                rows={4}
              />

              <TextAreaField id="message" label="Message" required={false} />

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white font-medium bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 transition-colors ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Submitting..." : "Submit"}
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
