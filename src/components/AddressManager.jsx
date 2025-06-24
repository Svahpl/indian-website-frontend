import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import UseTitle from "./UseTitle";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";

const initialAddresses = [
  {
    name: "",
    address: "",
    city: "",
    phone: "",
  },
];

// Skeleton Loader Component
const AddressSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-300 bg-white p-6 shadow-sm animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-5">
        <div className="h-6 w-20 bg-gray-300 rounded-md"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Address Information Grid skeleton */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Address Section skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-5 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
            </div>
          </div>

          {/* Location Section skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-28 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="h-4 w-10 bg-gray-300 rounded mr-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
              <div className="flex items-center">
                <div className="h-4 w-10 bg-gray-300 rounded mr-2"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information skeleton */}
        <div className="pt-4 border-t border-gray-200">
          <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="flex items-center">
            <div className="h-4 w-12 bg-gray-300 rounded mr-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      {/* Mobile Action Buttons skeleton */}
      <div className="flex gap-3 mt-5 pt-4 border-t border-gray-200 lg:hidden">
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
};

export default function AddressManager() {
  UseTitle("Your Addresses");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const userId = localStorage.getItem("uid");

  // State for addresses so we can update on edit
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    phone: "",
    pinCode: "",
    _id: "",
  });

  // Split the current URL path into segments
  const pathSegments = window.location.pathname.split("/").filter(Boolean);

  let accumulatedPath = "";

  // Open modal for adding new address
  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      phone: "",
      _id: "",
    });
    setIsModalOpen(true);
  };

  // Open modal and prefill form with address data
  const openEditModal = (index) => {
    setEditingIndex(index);
    setFormData(addresses[index]);
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateAddress = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/update-address/${userId}`,
        {
          addressId: formData._id,
          newAddress: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pinCode: formData.pinCode,
            phone: formData.phone,
          },
        }
      );
      toast("Address updated successfully!");
    } catch (error) {
      console.error(error);
      toast("Error updating address");
    }
  };

  // Save changes to address list
  const handleSave = async () => {
    if (editingIndex !== null) {
      // Edit existing address
      try {
        await updateAddress(); // Call API to update backend
        await fetchUsersAddress(); // Refetch updated addresses from backend

        setAddresses((prev) => {
          const updated = [...prev];
          updated[editingIndex] = formData;
          return updated;
        });

        toast.success("Address updated successfully!");
      } catch (err) {
        toast.error("Failed to update address.");
      }
    } else {
      // Add new address (just updating local state for now)
      setAddresses((prev) => [...prev, formData]);
    }
    setIsModalOpen(false);
  };

  const addAddress = async () => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/user/add-new-address/${userId}`,
        {
          newAddress: {
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pinCode: formData.pinCode,
            phone: formData.phone,
          },
        }
      );
      if (res.status === 200) toast("Added");
      await fetchUsersAddress();
    } catch (error) {
      console.log("Error adding address", error);
      toast("Error");
    }
  };

  const deleteAddress = async (id) => {
    console.log(id);
    try {
      const res = await axios.delete(
        `${backendUrl}/api/user/delete-user-address/${userId}/${id}`
      );
      if (res.status === 200) toast("Deleted");
      console.log(res);
    } catch (error) {
      console.log(error);
      toast("Error");
    }
  };

  // Delete address
  const handleDelete = async (index, addressId) => {
    await deleteAddress(addressId);
    setAddresses((prev) => prev.filter((_, i) => i !== index));
    await fetchUsersAddress();
  };

  // Close modal without saving
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchUsersAddress = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${backendUrl}/api/auth/get-user-address/${userId}`
      );
      setAddresses(res?.data?.address?.address);
      setPhoneNumber(res?.data?.address?.phoneNumber);
    } catch (error) {
      console.log("Error fetching users address", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersAddress();
  }, []);

  return (
    <>
      <Header />
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Your Addresses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Add address card */}
          <div
            className="flex items-center justify-center border-dashed border-2 border-gray-300 rounded h-50 cursor-pointer hover:bg-gray-50 transition"
            onClick={openAddModal}
          >
            <div className="text-center text-gray-500">
              <Plus className="mx-auto mb-2" size={24} />
              <p>Add address</p>
            </div>
          </div>

          {/* Show skeleton loaders while loading */}
          {isLoading ? (
            <>
              {[...Array(2)].map((_, idx) => (
                <AddressSkeleton key={idx} />
              ))}
            </>
          ) : (
            /* Existing addresses */
            addresses.map((addr, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-gray-300 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-green-700"
              >
                {/* Header with country and actions */}
                <div className="flex items-center justify-between mb-5">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-semibold bg-green-800 text-white uppercase tracking-wide">
                    {addr.country}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      className="p-2 cursor-pointer rounded-md bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 transition-colors duration-200"
                      type="button"
                      onClick={() => openEditModal(idx)}
                      title="Edit Address"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      className="p-2 cursor-pointer rounded-md bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors duration-200"
                      type="button"
                      onClick={() => handleDelete(idx, addr._id)}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Address Information Grid */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Address Section */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Street Address
                      </h4>
                      <div className="text-gray-900 leading-relaxed">
                        <div className="font-medium">{addr.addressLine1}</div>
                        {addr.addressLine2 && (
                          <div className="text-gray-600 mt-1">
                            {addr.addressLine2}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Location Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Location Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-gray-600 text-sm font-medium w-16">
                            City:
                          </span>
                          <span className="text-gray-900 font-medium capitalize">
                            {addr.city}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 text-sm font-medium w-16">
                            State:
                          </span>
                          <span className="text-gray-900 capitalize">
                            {addr.state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                      Contact Information
                    </h4>
                    <div className="flex items-center">
                      <span className="text-gray-600 text-sm font-medium w-16">
                        Phone:
                      </span>
                      <span className="text-gray-900 font-mono text-sm">
                        {addr.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-200 lg:hidden">
                  <button
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-green-800 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors duration-200"
                    type="button"
                    onClick={() => openEditModal(idx)}
                  >
                    <Pencil size={14} />
                    Edit Address
                  </button>
                  <button
                    className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors duration-200"
                    type="button"
                    onClick={() => handleDelete(idx, addr._id)}
                  >
                    <Trash2 size={14} />
                    Delete Address
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full relative overflow-hidden">
              {/* Header */}
              <div className="bg-green-800 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {editingIndex !== null
                        ? "Edit Address"
                        : "Add New Address"}
                    </h2>
                    <p className="text-green-100 text-sm mt-1">
                      {editingIndex !== null
                        ? "Update your address information"
                        : "Please enter your complete address details"}
                    </p>
                  </div>
                  <button
                    className="text-white hover:text-green-200 transition-colors duration-200 p-2 rounded-md hover:bg-green-700"
                    onClick={handleCancel}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Form content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                  }}
                  className="space-y-6"
                >
                  {/* Address Lines */}
                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="addressLine1"
                      >
                        Street Address <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="addressLine1"
                        name="addressLine1"
                        type="text"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                        placeholder="Enter street address"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="addressLine2"
                      >
                        Address Line 2
                      </label>
                      <input
                        id="addressLine2"
                        name="addressLine2"
                        type="text"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                        placeholder="Apartment, suite, building, etc. (optional)"
                      />
                    </div>
                  </div>

                  {/* City and State */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="city"
                      >
                        City <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="city"
                        name="city"
                        type="text"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                        placeholder="Enter city"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="state"
                      >
                        State/Province <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="state"
                        name="state"
                        type="text"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                        placeholder="Enter state or province"
                        required
                      />
                    </div>
                  </div>

                  {/* Country and Postal Code */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="country"
                      >
                        Country <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                        placeholder="Enter country"
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-2"
                        htmlFor="pinCode"
                      >
                        Postal Code <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="pinCode"
                        name="pinCode"
                        type="text"
                        value={formData.pinCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                        placeholder="Enter postal code"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-2"
                      htmlFor="phone"
                    >
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2.5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-colors duration-200 outline-none"
                      placeholder="Enter phone number with country code"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Footer with action buttons */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-2.5 rounded-md font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={
                    editingIndex !== null
                      ? () => handleSave()
                      : () => addAddress()
                  }
                  className="px-6 py-2.5 rounded-md font-medium text-white bg-green-800 hover:bg-green-900 transition-colors duration-200"
                >
                  {editingIndex !== null ? "Update Address" : "Save Address"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
