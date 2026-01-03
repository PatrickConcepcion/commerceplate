"use client";

import { Cart } from "@/lib/shopify/types";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import Price from "@/layouts/components/Price";
import { Country, State, City } from "country-state-city";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  zip: string;
  country: string;
}

export default function CheckoutClient({ cart }: { cart: Cart | undefined }) {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "",
  });

  const countries = useMemo(() => Country.getAllCountries(), []);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>("");
  const [selectedStateCode, setSelectedStateCode] = useState<string>("");

  const states = useMemo(() => {
    return selectedCountryCode ? State.getStatesOfCountry(selectedCountryCode) : [];
  }, [selectedCountryCode]);

  const cities = useMemo(() => {
    return (selectedCountryCode && selectedStateCode) 
      ? City.getCitiesOfState(selectedCountryCode, selectedStateCode) 
      : [];
  }, [selectedCountryCode, selectedStateCode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "country") {
      const country = countries.find((c) => c.isoCode === value);
      setSelectedCountryCode(value);
      setSelectedStateCode(""); // Reset state code on country change
      setFormData((prev) => ({
        ...prev,
        country: country?.name || "",
        province: "",
        city: "",
      }));
    } else if (name === "province") {
      const state = states.find((s) => s.isoCode === value);
      setSelectedStateCode(value);
      setFormData((prev) => ({
        ...prev,
        province: state?.name || "",
        city: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement PayPal integration
    alert("Checkout submitted! (Placeholder - PayPal integration pending)");
  };

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p>Your cart is empty. <Link href="/products" className="text-blue-500">Go shopping</Link></p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div className="bg-white dark:bg-darkmode-body p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul className="space-y-4">
            {cart.lines.map((item) => (
              <li key={item.id} className="flex items-center space-x-4">
                {item.merchandise.product.featuredImage?.url && (
                  <Image
                    src={item.merchandise.product.featuredImage.url}
                    alt={item.merchandise.product.title}
                    width={80}
                    height={80}
                    className="rounded"
                  />
                )}
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.merchandise.product.title} - {item.merchandise.title} x {item.quantity}
                  </p>
                  <Price
                    amount={item.cost.totalAmount.amount}
                    currencyCode={item.cost.totalAmount.currencyCode}
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <Price
                amount={cart.cost.subtotalAmount.amount}
                currencyCode={cart.cost.subtotalAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <Price
                amount={cart.cost.totalTaxAmount.amount}
                currencyCode={cart.cost.totalTaxAmount.currencyCode}
              />
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <Price
                amount={cart.cost.totalAmount.amount}
                currencyCode={cart.cost.totalAmount.currencyCode}
              />
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <div className="bg-white dark:bg-darkmode-body p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="address1" className="block text-sm font-medium mb-1">Address Line 1</label>
              <input
                type="text"
                name="address1"
                id="address1"
                value={formData.address1}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="address2" className="block text-sm font-medium mb-1">Address Line 2</label>
              <input
                type="text"
                name="address2"
                id="address2"
                value={formData.address2}
                onChange={handleChange}
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
              <select
                name="country"
                id="country"
                value={selectedCountryCode}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="province" className="block text-sm font-medium mb-1">Province/State</label>
                <select
                  name="province"
                  id="province"
                  value={selectedStateCode}
                  onChange={handleChange}
                  required
                  disabled={!selectedCountryCode}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.isoCode} value={state.isoCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                <select
                  name="city"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={!selectedStateCode && cities.length === 0}
                  className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
              <input
                type="text"
                name="zip"
                id="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>

            {/* Payment Placeholder */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded">
              <h3 className="font-semibold mb-2">Payment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                PayPal integration pending. Payment processing will be added here.
              </p>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary"
            >
              Complete Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
