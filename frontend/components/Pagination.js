import Head from 'next/head'; 
import PaginationStyles from './styles/PaginationStyles';
import NextLink from 'next/link';
import { gql } from 'graphql-tag';
import { useQuery } from '@apollo/client';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`

    query{
        wbProductsCount(where: {})
    }

`;

export default function Pagination({ page }){

    const {error, loading, data} = useQuery(PAGINATION_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <DisplayError error={error} />

    const {wbProductsCount} = data;
    const pageCount = Math.ceil(wbProductsCount / perPage);

    return (
        <PaginationStyles>

            <Head>
                <title>Sick fits - Page {page} of { pageCount }</title>
            </Head>
            <NextLink 
                href={`/products/${page - 1}`}
                data-cool="true"
            >
                <a aria-disabled={page <= 1}>⬅️Prev</a>
            </NextLink>
            
            <p>Page {page} of {pageCount}</p>
            <p>{wbProductsCount} total</p>
            <NextLink href={`/products/${page + 1}`}>

                <a aria-disabled={page >= pageCount}>Next➡️</a>

            </NextLink>

        </PaginationStyles>
    );

}

