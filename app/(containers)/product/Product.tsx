"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { fetchProductsList, fetchSearchProducts } from "@/app/services/product";

interface Product {
  url: string;
  name: string;
  desc: string;
  price: string;
}

interface CartItem extends Product {
  quantity: number;
}

const Product = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<number[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const data: Product[] = await fetchProductsList();
      setProducts(data);
      setQuantities(Array(data.length).fill(0));
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  }

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const results: Product[] = await fetchSearchProducts(searchTerm);
      setProducts(results);
      setQuantities(Array(results.length).fill(0));
    } catch (err) {
      console.error("Search failed:", err);
    }
  }

  const increment = (index: number) => {
    const updated = [...quantities];
    updated[index]++;
    setQuantities(updated);
  };

  const decrement = (index: number) => {
    const updated = [...quantities];
    if (updated[index] > 0) {
      updated[index]--;
      setQuantities(updated);
    }
  };

  const addToCart = (product: Product, quantity: number) => {
    if (quantity <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...product, quantity }];
      }
    });

    // Reset quantity for this product
    const index = products.findIndex((p) => p.name === product.name);
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = 0;
    setQuantities(updatedQuantities);
  };

  const removeOneFromCart = (name: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.name === name ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItemFromCart = (name: string) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="border border-gray-300 p-2 rounded w-64"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Products Grid */}
      <div className="grid grid-cols-3 gap-4 w-[800px]">
        {products.map((product, index) => (
          <motion.div
            key={product.name}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <Zoom>
                <img
                  src={product.url}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-4 cursor-zoom-in"
                />
              </Zoom>
              <p>{product.desc}</p>
              <p className="text-green-600 font-bold">AED: {product.price}</p>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => decrement(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  –
                </button>
                <span className="font-medium">{quantities[index]}</span>
                <button
                  onClick={() => increment(index)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  +
                </button>
              </div>

              {/* Total and Add to Cart */}
              {quantities[index] > 0 && (
                <>
                  <p className="mt-2 text-blue-600 font-semibold">
                    Total: AED {Number(product.price) * quantities[index]}
                  </p>
                  <button
                    onClick={() => addToCart(product, quantities[index])}
                    className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  >
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-4">🛒 Cart Summary</h2>
          <ul className="space-y-2">
            {cart.map((item) => (
              <li
                key={item.name}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <div className="flex items-center space-x-4">
                  <span className="font-medium">
                    AED {Number(item.price) * item.quantity}
                  </span>
                  <button
                    onClick={() => removeOneFromCart(item.name)}
                    className="text-yellow-600 hover:underline text-sm"
                  >
                    Remove One
                  </button>
                  <button
                    onClick={() => removeItemFromCart(item.name)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove All
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-right mt-4 text-lg font-bold text-green-700">
            Total: AED {getTotal()}
          </p>
        </div>
      )}
    </div>
  );
};

export default Product;
