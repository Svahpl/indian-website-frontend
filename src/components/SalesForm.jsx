import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const farmingMethods = [
  { value: 'organic', label: 'Organic' },
  { value: 'natural', label: 'Natural Farming' },
  { value: 'inorganic', label: 'Inorganic' }
];

const productConditions = [
  { value: 'fresh', label: 'Fresh' },
  { value: 'dried', label: 'Dried' }
];

const SalesForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFarmingMethod, setSelectedFarmingMethod] = useState(null);
  const [selectedProductCondition, setSelectedProductCondition] = useState(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  
  const onSubmit = (data) => {
    console.log({ 
      ...data,
      farmingMethod: selectedFarmingMethod?.value,
      productCondition: selectedProductCondition?.value
    });
    
    setIsSubmitted(true);
    reset();
    setSelectedFarmingMethod(null);
    setSelectedProductCondition(null);
    
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-heading font-semibold text-primary-800 mb-4">Drop Us a Message For Sale</h3>
      
      {isSubmitted ? (
        <div className="bg-success-50 border border-success-200 text-success-800 rounded-md p-4 mb-4 animate-fade-in">
          <p>Thank you. One of our representatives will get back to you within 24 hours.</p>
        </div>
      ) : null}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Farmer Name */}
        <div>
          <label htmlFor="farmerName" className="block text-sm font-medium text-neutral-700 mb-1">Farmer Name</label>
          <input
            id="farmerName"
            type="text"
            className={`w-full px-3 py-2 border ${errors.farmerName ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Your name"
            {...register('farmerName', { required: 'Farmer name is required' })}
          />
          {errors.farmerName && <p className="mt-1 text-sm text-error-600">{errors.farmerName.message}</p>}
        </div>
        
        {/* Patta Number */}
        <div>
          <label htmlFor="pattaNumber" className="block text-sm font-medium text-neutral-700 mb-1">PPB/ROFR Patta Number</label>
          <input
            id="pattaNumber"
            type="text"
            className={`w-full px-3 py-2 border ${errors.pattaNumber ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Your patta number"
            {...register('pattaNumber', { required: 'Patta number is required' })}
          />
          {errors.pattaNumber && <p className="mt-1 text-sm text-error-600">{errors.pattaNumber.message}</p>}
        </div>
        
        {/* State (now a text input) */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-neutral-700 mb-1">State</label>
          <input
            id="state"
            type="text"
            className={`w-full px-3 py-2 border ${errors.state ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Enter your state"
            {...register('state', { required: 'State is required' })}
          />
          {errors.state && <p className="mt-1 text-sm text-error-600">{errors.state.message}</p>}
        </div>
        
        {/* Mandal (now a text input) */}
        <div>
          <label htmlFor="mandal" className="block text-sm font-medium text-neutral-700 mb-1">Mandal</label>
          <input
            id="mandal"
            type="text"
            className={`w-full px-3 py-2 border ${errors.mandal ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Enter your mandal"
            {...register('mandal', { required: 'Mandal is required' })}
          />
          {errors.mandal && <p className="mt-1 text-sm text-error-600">{errors.mandal.message}</p>}
        </div>
        
        {/* Village (now a text input) */}
        <div>
          <label htmlFor="village" className="block text-sm font-medium text-neutral-700 mb-1">Revenue Village</label>
          <input
            id="village"
            type="text"
            className={`w-full px-3 py-2 border ${errors.village ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Enter your village"
            {...register('village', { required: 'Village is required' })}
          />
          {errors.village && <p className="mt-1 text-sm text-error-600">{errors.village.message}</p>}
        </div>
        
        {/* Pincode */}
        <div>
          <label htmlFor="pincode" className="block text-sm font-medium text-neutral-700 mb-1">Pincode</label>
          <input
            id="pincode"
            type="text"
            className={`w-full px-3 py-2 border ${errors.pincode ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Your pincode"
            {...register('pincode', { 
              required: 'Pincode is required',
              pattern: {
                value: /^[0-9]{6}$/,
                message: 'Please enter a valid 6-digit pincode'
              }
            })}
          />
          {errors.pincode && <p className="mt-1 text-sm text-error-600">{errors.pincode.message}</p>}
        </div>
        
        {/* Mobile Number */}
<div className="flex flex-col space-y-2">
  <label htmlFor="countryCode" className="block text-sm font-medium text-neutral-700 mb-1">Country Code</label>
  <div className="flex items-center space-x-2">
    <select
      id="countryCode"
      className={`w-24 px-3 py-2 border ${
        errors.countryCode ? 'border-error-500' : 'border-neutral-300'
      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm`}
      {...register('countryCode', {
        required: 'Country code is required',
      })}
    >
      <option value="">Select</option>
      <option value="+1">+1 (US)</option>
      <option value="+44">+44 (UK)</option>
      <option value="+91">+91 (India)</option>
      <option value="+61">+61 (Australia)</option>
      <option value="+81">+81 (Japan)</option>
      {/* Add more country codes as needed */}
    </select>

    <div className="flex-1">
      <label htmlFor="mobileNumber" className="block text-sm font-medium text-neutral-700 mb-1">Mobile Number</label>
      <input
        id="mobileNumber"
        type="tel"
        className={`w-full px-3 py-2 border ${
          errors.mobileNumber ? 'border-error-500' : 'border-neutral-300'
        } rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
        placeholder="Your mobile number"
        {...register('mobileNumber', {
          required: 'Mobile number is required',
          pattern: {
            value: /^[0-9]{10}$/,
            message: 'Please enter a valid 10-digit mobile number',
          },
        })}
      />
    </div>
  </div>

  <div className="flex space-x-4">
    {errors.countryCode && (
      <p className="mt-1 text-sm text-error-600">{errors.countryCode.message}</p>
    )}
    {errors.mobileNumber && (
      <p className="mt-1 text-sm text-error-600">{errors.mobileNumber.message}</p>
    )}
  </div>
</div>

        
        {/* Crop Name */}
        <div>
          <label htmlFor="cropName" className="block text-sm font-medium text-neutral-700 mb-1">Crop Name</label>
          <input
            id="cropName"
            type="text"
            className={`w-full px-3 py-2 border ${errors.cropName ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Name of your crop"
            {...register('cropName', { required: 'Crop name is required' })}
          />
          {errors.cropName && <p className="mt-1 text-sm text-error-600">{errors.cropName.message}</p>}
        </div>
        
        {/* Farming Method (still a dropdown) */}
        <div>
          <label htmlFor="farmingMethod" className="block text-sm font-medium text-neutral-700 mb-1">Farming Method</label>
          <Select
            id="farmingMethod"
            options={farmingMethods}
            value={selectedFarmingMethod}
            onChange={setSelectedFarmingMethod}
            placeholder="Select farming method"
            className="text-base"
            classNames={{
              control: (state) => 
                `!border ${state.isFocused ? '!border-primary-500 !shadow-md !ring-2 !ring-primary-200' : '!border-neutral-300'} !rounded-md !bg-white`,
            }}
          />
        </div>
        
        {/* Product Name */}
        <div>
          <label htmlFor="productName" className="block text-sm font-medium text-neutral-700 mb-1">Product Name</label>
          <input
            id="productName"
            type="text"
            className={`w-full px-3 py-2 border ${errors.productName ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Name of your product"
            {...register('productName', { required: 'Product name is required' })}
          />
          {errors.productName && <p className="mt-1 text-sm text-error-600">{errors.productName.message}</p>}
        </div>
        
        {/* Product Form */}
        <div>
          <label htmlFor="productForm" className="block text-sm font-medium text-neutral-700 mb-1">Product Form</label>
          <input
            id="productForm"
            type="text"
            className={`w-full px-3 py-2 border ${errors.productForm ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Form of your product"
            {...register('productForm', { required: 'Product form is required' })}
          />
          {errors.productForm && <p className="mt-1 text-sm text-error-600">{errors.productForm.message}</p>}
        </div>
        
        {/* Product Condition (still a dropdown) */}
        <div>
          <label htmlFor="productCondition" className="block text-sm font-medium text-neutral-700 mb-1">Product Condition</label>
          <Select
            id="productCondition"
            options={productConditions}
            value={selectedProductCondition}
            onChange={setSelectedProductCondition}
            placeholder="Select product condition"
            className="text-base"
            classNames={{
              control: (state) => 
                `!border ${state.isFocused ? '!border-primary-500 !shadow-md !ring-2 !ring-primary-200' : '!border-neutral-300'} !rounded-md !bg-white`,
            }}
          />
        </div>
        
        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-neutral-700 mb-1">Quantity (MT)</label>
          <input
            id="quantity"
            type="number"
            step="0.01"
            className={`w-full px-3 py-2 border ${errors.quantity ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Quantity available"
            {...register('quantity', { 
              required: 'Quantity is required',
              min: {
                value: 0.01,
                message: 'Quantity must be greater than 0'
              }
            })}
          />
          {errors.quantity && <p className="mt-1 text-sm text-error-600">{errors.quantity.message}</p>}
        </div>
        
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-neutral-700 mb-1">Price (per kg)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            className={`w-full px-3 py-2 border ${errors.price ? 'border-error-500' : 'border-neutral-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500`}
            placeholder="Price per kg"
            {...register('price', { 
              required: 'Price is required',
              min: {
                value: 0.01,
                message: 'Price must be greater than 0'
              }
            })}
          />
          {errors.price && <p className="mt-1 text-sm text-error-600">{errors.price.message}</p>}
        </div>
        
        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1">Message</label>
          <textarea
            id="message"
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Additional message"
            {...register('message')}
          />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary-600 text-white font-medium py-2 px-4 rounded-md hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default SalesForm;