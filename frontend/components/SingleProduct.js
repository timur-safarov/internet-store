import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import DisplayError from './ErrorMessage';
import styled from 'styled-components';
import Head from 'next/head';

const ProductStyles = styled.div`

    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    max-width: var(--maxWidth);
    justify-content: center;
    align-items: top;
    gap: 2rem;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

`;

//Запрос на получение данных о товаре
const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!){
        wb_product(where: {
            id: $id
        }){
            id,
            name,
            description,
            price,
            id_product_image {
                id
                image {
                    publicUrlTransformed
                }
                alt_text
            }
        }
    }

`;

export default function SingleProduct({ id }) {
    const { data, loading, error } = useQuery(SINGLE_ITEM_QUERY, {
        variables: {
            id: id
        }
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <DisplayError error={error} />;

    const { wb_product } = data;

    console.log(wb_product);

    //Выводим заголовок на странице товара
    return <ProductStyles>
        <Head>
            <title>Product {wb_product.name}</title>
        </Head>
        <img src={wb_product?.id_product_image?.image?.publicUrlTransformed} alt={wb_product?.id_product_image?.alt_text} />
        <div className="details">
            <h2>{wb_product.name}</h2>
            <p>{wb_product.description}</p>
        </div>
    </ProductStyles>;
}