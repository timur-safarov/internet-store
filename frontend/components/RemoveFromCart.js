import { useMutation } from '@apollo/client';
import styled from 'styled-components';
import { gql } from 'graphql-tag';

const BigButton = styled.button`

    font-size: 3rem;
    background: none;
    border: 0;
    &:hover {
        color: var(--red);
        cursor: pointer;
    }

`;

const REMOVE_FROM_CART_MUTATION = gql`

    mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
        deletewb_cart_item(where: { id: $id }) {
            id
        }
    }

`;

function update(cache, payload) {
    cache.evict(cache.identify(payload.data.deletewb_cart_item))
}

export default function RemoveFromCart({ id }) {

    const [removeFromCart, {loading}] = useMutation(REMOVE_FROM_CART_MUTATION, {
        variables: { id: id },
        update,
        //Для боле быстрого удаления используют это
        //Сейчас не работает
        // optimisticResponse: {
        //     deletewb_cart_item: {
        //         __typename: 'cart_item',
        //         id
        //     }
        // }
    });

    return (
        <BigButton
            onClick={removeFromCart}
            disabled={loading} 
            type="button"
            title="Remove This item from Cart"
        >
            &times;
        </BigButton>
    );

}