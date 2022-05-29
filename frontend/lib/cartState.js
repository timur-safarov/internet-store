import { createContext, useContext, useState } from "react";


const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {

    //По умолчанию блок с корзиной скрыт = false
    const [cartOpen, setCartOpen] = useState(false);

    function toogleCart() {
        setCartOpen(!cartOpen);
    }

    function closeCart() {
        setCartOpen(false);
    }

    function openCart() {
        setCartOpen(true);
    }

    return (
        <LocalStateProvider 
            value={{ 
                cartOpen,
                setCartOpen,
                toogleCart,
                closeCart,
                openCart
            }}
        >
            { children }
        </LocalStateProvider>
    );

}

function useCart() {
    //We use a consumer here to access to local state
    const all = useContext(LocalStateContext);
    return all;
}

export { CartStateProvider, useCart };