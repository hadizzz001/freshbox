'use client';

import { useState,useEffect } from "react";
import { TempProps } from "../types";
import QuantitySelector from "./QuantitySelector";
import { useCart } from "../app/context/CartContext"; // import your cart context



interface CarCardProps {
    temp: TempProps;
}

const CarCard = ({ temp }: CarCardProps) => {
    const { _id, title, price, discount, img, type, stock, color } = temp;
    const [quantity, setQuantity] = useState(1);
    const [showQty, setShowQty] = useState(false);
    const [unit, setUnit] = useState<'grams' | 'box'>('grams');
const { cart, addToCart } = useCart();

    const inCartItem = cart.find((i) => i._id === _id);

useEffect(() => {
  if (inCartItem) {
    setShowQty(true);
    setQuantity(inCartItem.quantity);
    if (inCartItem.unit) setUnit(inCartItem.unit);   // ← RESTORE UNIT
  } else {
    setShowQty(false);
    setQuantity(1);
    setUnit("grams"); // default when not in cart
  }
}, [inCartItem]);


 



    const isOutOfStock =
        (type === "single" && parseInt(stock) === 0) ||
        (type === "collection" &&
            color?.every(c => parseInt(c.qty) === 0));

    const discountPercentage = Math.round(((price - discount) / price) * 100);


    
    // Handle add to cart
    const handleSubmit = (e?: React.MouseEvent) => {
        if (e) e.preventDefault();
       addToCart(temp, quantity, "", "", unit);
        setShowQty(true);  
    };



    return (
        <div className="flex flex-col items-center w-full sm:w-[300px] mb-6 sm:mb-8">
            {/* Image clickable only */}
            <a href={`/product?id=${_id}`} className="relative w-full">
                <div className="w-full aspect-square overflow-hidden rounded-lg">
                    <img
                        src={img[0]}
                        alt={title}
                        className="w-full h-full object-cover object-center"
                    />

                    {/* Discount flag */}
                    {discount > 0 && (
                        <div
                            className="absolute top-2 left-2 bg-[#222] text-white text-xs font-regular px-3 py-1 z-20"
                            style={{
                                clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
                            }}
                        >
                            {discountPercentage}% OFF
                        </div>
                    )}

                    {/* Out of stock overlay */}
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-gray-600 bg-opacity-70 text-white flex items-center justify-center text-lg font-bold z-10 rounded">
                            Out of Stock
                        </div>
                    )}
                </div>
            </a>

            {/* Text under image */}
            <div className="flex flex-col items-center mt-3 w-full">
                <h2 className="myGrayTP uppercase py-1 text-center">{title}</h2>
{/* PRICE SECTION (CHANGES WHEN TOGGLE CHANGES) */}
<div className="price-container inline-flex flex-wrap gap-x-2 items-baseline text-white justify-center">

    {unit === "box" ? (
        <>
            {/* BOX PRICE */}
            <span className="py-1 myRed1">
                ${parseFloat(temp.costBox?.price || 0).toFixed(2)}
            </span>

            {/* KG PER BOX */}
            <span className="text-[13px] text-gray-600 ml-1">
                ({temp.costBox?.kg} kg / box)
            </span>
        </>
    ) : (
        <>
            {/* GRAMS PRICE (DISCOUNT) */}
            <span className="py-1 myRed1">
                ${parseFloat(discount).toFixed(2)}
            </span>

            {/* Original price if discount exists */}
            {discount && discount > 0 && (
                <span className="font-light text-[13px] py-1 line-through text-gray-400">
                    ${parseFloat(price).toFixed(2)}
                </span>
            )}
        </>
    )}

</div>



 
{type !== "single" && (
    <div className="flex items-center justify-center gap-4 mt-4 opacity-100">
        <span
            className={`text-sm font-medium ${
                unit === "grams" ? "text-[#215839]" : "text-gray-500"
            } ${showQty ? "opacity-40" : ""}`}
        >
            Grams
        </span>

        <div
            className={`
                relative w-20 h-10 rounded-full shadow-inner transition-colors duration-300 
                ${unit === "grams" ? "bg-gray-300" : "bg-[#215839]"}
                ${showQty ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={() =>
                !showQty && setUnit((prev) => (prev === "grams" ? "box" : "grams"))
            }
        >
            <div
                className={`
                    absolute top-1 w-8 h-8 bg-white rounded-full shadow-md transition-transform duration-300 transform 
                    ${unit === "box" ? "translate-x-[40px]" : "translate-x-1"}
                `}
            ></div>
        </div>

        <span
            className={`text-sm font-medium ${
                unit === "box" ? "text-[#215839]" : "text-gray-500"
            } ${showQty ? "opacity-40" : ""}`}
        >
            Box
        </span>
    </div>
)}



 
{!showQty && !isOutOfStock && (
  <button
    onClick={handleSubmit}
    className="mt-4 w-full bg-[#215839] text-white py-2 rounded-lg font-medium shadow-lg hover:bg-[#1a492f] transition-colors"
  >
    Add to Bag
  </button>
)}

 
{showQty && inCartItem && (
  <QuantitySelector
    initialQty={inCartItem.quantity}
    productId={_id}
    type={unit}
  />
)}
 
 
            </div>
        </div>
    );
};

export default CarCard;
