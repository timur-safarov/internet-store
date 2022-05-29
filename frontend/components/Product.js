import NextLink from 'next/link';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';

export default function Product( {product} ) {
    return <ItemStyles>
        
        <img src={product?.id_product_image?.image?.publicUrlTransformed} alt={product.name} />
        <Title>
            <NextLink href={`/product/${product.id}`}>{product.name}</NextLink>
        </Title>
        <PriceTag>{formatMoney(product.price / 100)}</PriceTag>
        <p>{product.description}</p>

        <div className="buttonList">

            <NextLink href={{
                pathname: '/update',
                query: {
                    id: product.id
                }
            }}>Edit ✏️ </NextLink>

            <AddToCart id={product.id}></AddToCart>

            <DeleteProduct id={product.id}>Delete...</DeleteProduct>

        </div>

    </ItemStyles>
}