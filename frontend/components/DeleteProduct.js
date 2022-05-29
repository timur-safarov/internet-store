import { gql } from 'graphql-tag';
import { useMutation } from '@apollo/client';

const DELETE_PRODUCT_MUTATION = gql`

    mutation DELETE_PRODUCT_MUTATION($id: ID!){
        deletewb_product(where: {
            id: $id
        }) {
            id
            name
        }
    }

`;

//Эта функция будет запущена после удаления товара, чтобы обновить список товаров!
function update(cache, payload){
    cache.evict(cache.identify(payload.data.deletewb_product));
}

export default function DeleteProduct({ id, children }){

    const [deletewb_product, { loading, error }] = useMutation(DELETE_PRODUCT_MUTATION, {
        variables: {
            id: id
        },
        update: update
    });

    return <button 
            disabled={loading} 
            type="button" 
            onClick={() => {
                if (confirm('Are you sure you want to delete this product?')) {
                    deletewb_product().catch((err) => alert(err.message));
                }
            }
        }>{children}</button>;

}