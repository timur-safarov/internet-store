
import { useQuery } from '@apollo/client';
import { gql } from 'graphql-tag';

const CURRENT_USER_QUERY = gql`

    query{
        authenticatedItem {
        ... on wb_user {
                id
                email
                username,
                cart_item {
                    id
                    quantity
                    id_product {
                        id
                        price
                        name
                        description
                        id_product_image {
                            id
                            image {
                                publicUrlTransformed
                            }
                        }
                    }
                }

            }

        }
    }

`;

export function useUser(){

    const { data } = useQuery(CURRENT_USER_QUERY);
    return data?.authenticatedItem;

}

export { CURRENT_USER_QUERY };