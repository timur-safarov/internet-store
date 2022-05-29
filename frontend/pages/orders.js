import { gql } from 'graphql-tag';
import ErrorMessage from '../components/ErrorMessage';
import OrderStyles from '../components/styles/OrderStyles';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import OrderItemStyles from '../components/styles/OrderItemStyles';
import Link from 'next/link';

const USER_ORDERS_QUERY = gql`

  query USER_ORDERS_QUERY {
      
    wbOrders(orderBy: { id: desc })  {
      id
      charge
      total
      user {
        id
      }
      order_item {
        id
        name
        description
        price
        quantity
        id_product_image {
          image {
            publicUrlTransformed
          }
        }
      }
    }

  }

`;

const OrderUl = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  grid-gap: 4rem;
`;

function countItemsInAnOrder(order) {
  return order.order_item.reduce((tally, item) => tally + item.quantity, 0);
}

export default function OrdersPage() {

    const { data, error, loading } = useQuery(USER_ORDERS_QUERY);

    if (loading) return <p>Loading...</p>
    if (error) return <ErrorMessage error={error} />

    console.dir(data, { depth: 'null' });

    const { wbOrders } = data;

    return(
        <div>
        <Head>
          <title>Your Orders ({wbOrders.length})</title>
        </Head>
        <h2>You have {wbOrders.length} orders!</h2>
        <OrderUl>
          {wbOrders.map((order) => (
            <OrderItemStyles>
              <Link href={`/order/${order.id}`}>
                <a>
                  <div className="order-meta">
                    <p>{countItemsInAnOrder(order)} Items</p>
                    <p>
                      {order.order_item.length} Product
                      {order.order_item.length === 1 ? '' : 's'}
                    </p>
                    <p>{formatMoney(order.total)}</p>
                  </div>
                  <div className="images">
                    {order.order_item.map((item) => (
                      <img
                        key={`image-${item.id}`}
                        src={item.id_product_image?.image?.publicUrlTransformed}
                        alt={item.name}
                      />
                    ))}
                  </div>
                </a>
              </Link>
            </OrderItemStyles>
          ))}
        </OrderUl>
      </div>
    );
}