import React, { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";

const QuantitySelector = ({ initialQty = 1, productId, type }) => {
  const { updateQty } = useCart();
  const [qty, setQty] = useState(initialQty);
  const [maxStock, setMaxStock] = useState(null);

  // Fetch stock based on type
  useEffect(() => {
    setQty(1);

    const fetchStock = async () => {
      
      try {
        const apiUrl =
          type === "box"
            ? `/api/stocktype/${productId}`
            : `/api/stock/${productId}`;

            
            

        const response = await fetch(apiUrl);
        const data = await response.json(); 
        console.log("data: ", data);
        
        if (response.ok && data.stock !== undefined) {
          setMaxStock(parseInt(data.stock, 10));
        }
      } catch (err) {
        console.error("Error fetching stock:", err);
      }
    };

    fetchStock();
  }, [productId, type]);

  // Decrease qty
  const decrease = () => {
    if (qty === 1) {
      updateQty(productId, 0);
      return;
    }
    setQty(qty - 1);
    updateQty(productId, qty - 1);
  };

  // Increase qty with max check
  const increase = () => {
    if (maxStock !== null && qty >= maxStock) return; // STOP at max
    setQty(qty + 1);
    updateQty(productId, qty + 1);
  };

  // Typing qty manually
  const handleInputChange = (e) => {
    let newQty = parseInt(e.target.value) || 0;

    if (maxStock !== null && newQty > maxStock) newQty = maxStock; // cap to stock
    if (newQty < 0) newQty = 0;

    setQty(newQty);
    updateQty(productId, newQty);
  };



  return (
    <div className="flex gap-4 items-center mt-3">

      {/* Minus button */}
      <button
        onClick={decrease}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl font-light"
        style={{ backgroundColor: "#215839" }}
      >
        -
      </button>

      {/* Quantity input */}
      <input
        className="w-14 text-center text-lg font-light outline-none border-none bg-transparent"
        value={qty}
        onChange={handleInputChange}
      />

      {/* Plus button */}
      <button
        onClick={increase}
        disabled={maxStock !== null && qty >= maxStock}
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-2xl font-light ${
          maxStock !== null && qty >= maxStock ? "opacity-40 cursor-not-allowed" : ""
        }`}
        style={{ backgroundColor: "#215839" }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
