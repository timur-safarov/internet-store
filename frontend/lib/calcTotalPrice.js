export default function calcTotalPrice(cart) {

    return cart.reduce((tally, cartItem) => {
        
        if (!cartItem.id_product) return tally;
        
        return tally + cartItem.quantity + cartItem.id_product.price;
        
    }, 0);

}