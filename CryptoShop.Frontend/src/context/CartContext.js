import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (product, quantity=1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product.id === product.id);
            if (existingItem){
                return prevItems.map(item => item.product.id === product.id ? {...item, quantity: item.quantity+quantity} : item);
            }

            return [...prevItems, {product, quantity}];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity<1){
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems => prevItems.map(item => item.product.id === productId ? {...item, quantity} : item));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total+(item.product.price*item.quantity), 0);
    }

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count+item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartProvider;
