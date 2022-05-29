
import CartStyles from './styles/CartStyles';
import { useUser } from './User';
import Supreme from './styles/Supreme';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import calcTotalPrice from '../lib/calcTotalPrice';
import { useCart } from '../lib/cartState';
import CloseButton from './styles/CloseButton';
import RemoveFromCart from './RemoveFromCart';
import { gql } from 'graphql-tag';
import { Checkout } from './Checkout';

const CartItemStyles = styled.li`
    
    padding: 1rem 0;
    border-bottom: 1px solid var(--lightGray);
    display: grid;
    grid-template-columns: auto 1fr auto;
    img {
        margin-right: 10px;
    }
    h3,
    p {
        margin: 0;
    }

`;

function CartItem({ cartItem }) {

    const { id_product } = cartItem;
    if (!id_product) return null;
    
    return (
        <CartItemStyles>

            <img
                width="100"
                src={id_product.id_product_image.image.publicUrlTransformed}
                alt={id_product.name}
            />
            <div>
                <h3>{id_product.name}</h3>
                <p>
                {formatMoney(id_product.price * cartItem.quantity)}-
                <em>
                    {cartItem.quantity} &times; {formatMoney(id_product.price)} each
                </em>
                </p>
            </div>

            <RemoveFromCart id={cartItem.id} />

        </CartItemStyles>
    );

}

export default function Cart() {

    const me = useUser();
    const { cartOpen, closeCart } = useCart();
    if (!me) return null;

    // console.log(me.cart_item);

    return (
        <CartStyles open={cartOpen}>

            <header>
                <Supreme>{me.username}`s Cart</Supreme>
            </header>

            <CloseButton onClick={closeCart}>&times;</CloseButton>

            <ul>
                {me.cart_item.map(cartItem => (
                    <CartItem key={cartItem.id} cartItem={cartItem} />
                ))}
            </ul>

            <footer>
                <p>{formatMoney(calcTotalPrice(me.cart_item))}</p>
                <Checkout />
            </footer>

        </CartStyles>
    );
}