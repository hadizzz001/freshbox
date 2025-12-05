import React, { useState, useEffect } from 'react';
import { useCart } from '../app/context/CartContext';
import { useBooleanValue } from '../app/context/CartBoolContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import CarCard5 from '../components/CarCard5';
import { X } from "lucide-react";   // ⭐ Lucide Close Icon

const Cart = () => {
    const { cart, removeFromCart, quantities, subtotal, addToCart } = useCart();
    const [localQuantities, setLocalQuantities] = useState({});
    const { isBooleanValue, setBooleanValue } = useBooleanValue();
    const [errors, setErrors] = useState({});
    const [allTemp2, setAllTemps2] = useState();
    const [maxStock, setMaxStock] = useState({});

    const handleRemoveFromCart = (itemId) => {
        removeFromCart(itemId);
    };

    useEffect(() => {
        const q = {};
        cart.forEach(item => {
            q[item._id] = item.quantity;
        });
        setLocalQuantities(q);
    }, [cart]);

    const handleClickc = () => {
        var cartb = document.getElementById("cartid");
        var cartb2 = document.getElementById("cartid2");
        setBooleanValue(!isBooleanValue);
        if (cartb && cartb2) {
            if (isBooleanValue) {
                cartb2.className += " MiniCart_Cart-visible";
            } else {
                cartb2.classList.remove("MiniCart_Cart-visible");
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`api/products`);
                const data = await response.json();
                setAllTemps2(data.slice(0, 5));
            } catch (error) {
                console.error("Error fetching the description:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchStock = async () => {
            const updatedStock = {};
            for (const item of cart) {
                try {
                    const response = await fetch(`/api/stock/${item._id}`);
                    const data = await response.json();
                    updatedStock[item._id] = parseInt(data.stock, 10);
                } catch (error) {
                    console.error("Error fetching stock:", error);
                    updatedStock[item._id] = 1;
                }
            }
            setMaxStock(updatedStock);
        };
        fetchStock();
    }, [cart]);

    const handleQuantityChange = (itemId, quantity) => {
        let newQuantity = parseInt(quantity, 10);

        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        } else if (newQuantity > (maxStock[itemId] || 1)) {
            newQuantity = maxStock[itemId];
        }

        addToCart(
            cart.find((item) => item._id === itemId),
            newQuantity
        );

        setLocalQuantities((prevQuantities) => ({
            ...prevQuantities,
            [itemId]: newQuantity,
        }));
    };


    const getItemPrice = (item) => {
        // CASE 1 — BOX
        if (item.unit === "box") {
            return parseFloat(item.costBox?.price || item.price || 0);
        }

        // CASE 2 — GRAMS
        if (item.unit === "grams") {
            return parseFloat(item.discount || item.price || 0);
        }

        // DEFAULT
        return parseFloat(item.discount || item.price || 0);
    };


    return (
        <>
            <div>
                <div className="MiniCart_Slider_Overlay" id="cartid" />
                <div className="MiniCart_Slider">
                    <div className="MiniCart_Slider_CloseButton">
                        <slot name="close-button" />
                    </div>
                    <slot />
                </div>
            </div>

            <div className="Checkout">
                <div id="cartid2" className="MiniCart_Cart" style={{ zIndex: "99999999" }}>

                    {/* ⭐⭐⭐ HEADER FIXED ⭐⭐⭐ */}
                    <div
                        className="MiniCart_Cart_Heading br_text-grey-500 mt-10  "
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                        }}
                    >
                        {/* Centered Text */}
                        <span
                            className="myGray"
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                position: "absolute",
                                left: "50%",
                                transform: "translateX(-50%)"
                            }}
                        >
                            Your shopping bag
                        </span>

                        {/* Right-Aligned Close Button */}
                        <button
                            slot="close-button"
                            className="MiniCart_Cart_CloseButton"
                            aria-label="Close"
                            id="cartid"
                            onClick={handleClickc}
                            style={{
                                position: "absolute",
                                right: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            <X size={24} color='black' strokeWidth={1.5} />
                        </button>
                    </div>
                    {/* ⭐⭐⭐ END HEADER ⭐⭐⭐ */}

                    <div data-render-if="!cart-is-empty" className="MiniCart_Cart_CheckoutCart mt-20">
                        <div className="Checkout_Cart_Wrapper Checkout_Cart_Wrapper--All">
                            <div className="Checkout_Cart_TableHeading">
                                <span className="Checkout_Cart_TableHeading_Quantity">Qty</span>
                                <span className="Checkout_Cart_TableHeading_Total">Total price</span>
                            </div>

                            <div className="Checkout_Cart_LineItems">
                                {cart && cart.length > 0 ? (
                                    cart.map((obj) => (
                                        <div key={obj._id}>
                                            <div className="Checkout_Cart_LineItems_LineItem">
                                                <div className="Checkout_Cart_LineItems_LineItem_Thumb">
                                                    <img src={obj.img[0]} alt={obj.title} />
                                                </div>
                                                <div className="Checkout_Cart_LineItems_LineItem_Details myGray">
                                                    {obj.title}

                                                    <div>
                                                        <span className="myGray">Category:</span>
                                                        <span className="myGray">{obj.category}</span>
                                                    </div>
                                                    <div>
                                                        <span className="myGray">Type:</span>
                                                        <span className="myGray">{obj.unit}</span>
                                                    </div>

                                                    <div className="Checkout_Cart_LineItems_LineItem_Details_Quantity">
                                                        <span className="myGray">Qty:</span>

                                                        <input
                                                            type="number"
                                                            className="myGray"
                                                            value={localQuantities?.[obj._id] ?? 1}
                                                            onChange={(e) => handleQuantityChange(obj._id, e.target.value)}
                                                            min="1"
                                                            max={maxStock[obj._id] || 1}
                                                        />
                                                    </div>

                                                    <div className="Checkout_Cart_LineItems_LineItem_Price">
                                                        <span className="Currency">
                                                            <span className="Currency_Monetary myGray">
                                                                {getItemPrice(obj) * (localQuantities[obj._id] || 1)}

                                                            </span>
                                                            <span className="Currency_Code myGray">USD</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    className="Checkout_Cart_LineItems_LineItem_Remove"
                                                    onClick={() => handleRemoveFromCart(obj._id)}
                                                >
                                                    <span className="Checkout_Cart_LineItems_LineItem_Remove_Cross">
                                                        <span />
                                                        <span />
                                                    </span>
                                                    <span className="Checkout_Cart_LineItems_LineItem_Remove_Spinner">
                                                        <span />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div data-render-if="cart-is-empty" className="MiniCart_Cart_EmptyCart">
                                        <span className="myGray">You have no items in your shopping bag.</span>
                                    </div>
                                )}

                                <div>
                                    <div className="Checkout_Cart_LineItems_LineItem Checkout_Cart_LineItems_LineItem-SalesPromotion Checkout_Cart_LineItems_LineItem-SalesPromotion-Custom">
                                        <div className="Checkout_Cart_LineItems_LineItem_Details">
                                            <div className="Checkout_Cart_LineItems_LineItem_Price">
                                                <span className="Currency">
                                                    <span className="Currency_Monetary">Total: ${subtotal.toFixed(2)}</span>
                                                    <span className="Currency_Code">USD</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a className="Common_Button Common_Button--short MiniCart_Cart_CtaButton" href="/checkout" rel="nofollow">
                                <span>Go to checkout</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
