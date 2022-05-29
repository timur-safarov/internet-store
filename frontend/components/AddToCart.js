import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`

    mutation ADD_TO_CART_MUTATION($id: ID!){
        addToCart(productId: $id){
            id
        }
    }

`;

export default function AddToCart({ id }) {

    const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
        //Поля которые будут отправяться
        variables: {
            id
        },
        //Обновление данных о товаре в выподающей корзине
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
    });

    return <button disabled={loading} type="button" onClick={addToCart}>
        Add{loading && 'ing'} To Cart 🛒
    </button>

}