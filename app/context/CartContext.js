"use client";

import React, { createContext, useContext, useEffect, useReducer, useState } from "react";

const CartContext = createContext();

// ------------------ REDUCER ------------------
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.find((item) => item._id === action.payload._id);

      if (existing) {
        // Increase quantity if already exists
        return state.map((item) =>
          item._id === action.payload._id
          ? { 
    ...item, 
    quantity: item.quantity + action.payload.quantity,
    unit: action.payload.unit ?? item.unit  // ← preserve or update unit
  }

            : item
        );
      }

      // Add new item to cart
      return [...state, { ...action.payload }];
    }

    case "UPDATE_QTY": {
      return state.map((item) =>
        item._id === action.payload._id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item._id !== action.payload);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

// ------------------ PROVIDER ------------------
const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], (initial) => {
    if (typeof window !== "undefined") {
      try {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : initial;
      } catch (error) {
        console.error("Error parsing cart:", error);
        return initial;
      }
    }
    return initial;
  });

  const [quantities, setQuantities] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("quantities");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const [selectedColors, setSelectedColors] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedColors");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const [selectedSizes, setSelectedSizes] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selectedSizes");
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });

  const [subtotal, setSubtotal] = useState(0);

  // --------------- SYNC STORAGE ---------------
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("quantities", JSON.stringify(quantities));
  }, [quantities]);

  useEffect(() => {
    localStorage.setItem("selectedColors", JSON.stringify(selectedColors));
  }, [selectedColors]);

  useEffect(() => {
    localStorage.setItem("selectedSizes", JSON.stringify(selectedSizes));
  }, [selectedSizes]);

// ---------------- SUBTOTAL CALC -----------------
useEffect(() => {
  const newSubtotal = cart.reduce((acc, item) => {
    const q = item.quantity ?? 1;
    let price = 0;

    // 1️⃣ UNIT CHECK (box or grams)
    if (item.unit === "box") {
      // If item is box → use costBox price
      price = Number(item.costBox?.price ?? 0);
    } else {
      // If grams → use discount, fallback to price
      price = Number(item.discount ?? item.price ?? 0);
    }

    // 2️⃣ COLOR & SIZE PRICE OVERRIDE
    if (item.selectedColor && item.selectedSize && Array.isArray(item.color)) {
      const colorMatch = item.color.find((c) => c.color === item.selectedColor);
      if (colorMatch && Array.isArray(colorMatch.sizes)) {
        const sizeMatch = colorMatch.sizes.find((s) => s.size === item.selectedSize);
        if (sizeMatch) price = Number(sizeMatch.price);
      }
    }

    return acc + price * q;
  }, 0);

  setSubtotal(newSubtotal);
}, [cart]);


const addToCart = (
  item,
  quantity = 1,
  selectedColor = "",
  selectedSize = "",
  unit = "grams"
) => {
  dispatch({
    type: "ADD_TO_CART",
    payload: {
      ...item,
      quantity,
      selectedColor,
      selectedSize,
      unit, // ← safe to use because defined here
    },
  });
};


  // ---------------- REMOVE -----------------
  const removeFromCart = (itemId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  // ---------------- CLEAR -----------------
  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  // ---------------- UPDATE QTY (SMART) -----------------
  const updateQty = (_id, quantity) => {
    if (quantity <= 0) {
      dispatch({ type: "REMOVE_FROM_CART", payload: _id });
      return;
    }

    dispatch({
      type: "UPDATE_QTY",
      payload: { _id, quantity },
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        updateQty,
        subtotal,
            quantities,  
    setQuantities, 
        selectedColors,
        selectedSizes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export { CartProvider, useCart };
