import styled from 'styled-components';
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Product from './Product';
import { perPage } from '../config';

//Выбираем товаров в колличестве $take, предварительно пропустив $skip товаров
export const ALL_WB_PRODUCTS_QUERY = gql`
query ALL_WB_PRODUCTS_QUERY($take: Int, $skip: Int = 1) {
    wbProducts(take: $take, skip: $skip, orderBy: { id: desc }) {
        id
        name
        price
        description
        id_product_image {
            id
            image {
                publicUrlTransformed
            }
        }
    }
}`;

const ProductsListStyles = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 60px;
`;

export default function Products({ page = 1 }) {

    //console.log(page);
    
    const { data, error, loading } = useQuery(ALL_WB_PRODUCTS_QUERY, {
        variables: {
            take: perPage,
            skip: page * perPage - perPage
        }
    });

    //console.log( data, error, loading);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error { error.message }</p>;

    return (
        <div>
            <ProductsListStyles>

                {data.wbProducts.map((product) => (
                    <Product key={product.id} product={product} />
                ))}

            </ProductsListStyles>
        </div>
    );

}