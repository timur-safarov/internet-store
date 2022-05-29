import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import { wb_order_CreateInput, wb_cart_itemCreateInput } from '@keystone-6/core/types';
import { Session } from '../types';
import stripeConfig from '../lib/stripe'
import { wb_order } from '../schemas/Order';
import { wb_order_item } from '../schemas/OrderItem';
import { wb_cart_item } from '../schemas/CartItem';

const graphql = String.raw;

interface Arguments {
    token: string
}

async function checkout(
    root: any, 
    { token }: Arguments,
    context: KeystoneContext
): Promise<wb_order_CreateInput> {

    //1. Make sure they are signed in
    //Query current user If he is signed in
    const sesh = context.session as Session;
    const userId = sesh.itemId;

    if (!userId) {
        throw new Error('Sorry! You must be sign in to create an order.');
    }

    //2. Query the current user

    //https://keystonejs.com/docs/apis/query
    const user = await context.query.wb_user.findOne({
        where: { id: userId },
        query: graphql`id username email cart_item { 
            id
            quantity
            id_product {
                id
                name
                description
                price
                id_product_image {
                    id
                    image {
                        id
                        publicUrlTransformed
                    }
                }
            }
        }`,
    });

    //Выведем в терминал объект пользователя включая вложенные поля
    //console.dir(user, { depth: null });

    //3. Calculate the price for they wb_order_CreateInput
    const cartItems = user.cart_item.filter(cartItem => cartItem.id_product);

    const amount = cartItems.reduce(function(tally: number, cartItem: wb_cart_itemCreateInput) {
        return tally + cartItem.quantity * cartItem.id_product.price;
    }, 0);
    
    //console.log(amount);

    //4. Create the payment with the stripe library
    const charge = await stripeConfig.paymentIntents.create({
        amount,
        currency: 'USD',
        confirm: true,
        payment_method: token,
    }).catch(err => {
        console.log(err);
        throw new Error(err.message);
    });

    console.dir(charge, { depth: null });

    //5. МСОЗДАЁМ Заказ в базе
    //Используем context.db а не context.query
    //Потому как у нас есть поле order.order_item с many: true
    //И оно не пропустит context.query без order_item
    const order = await context.db.wb_order.createOne({
        data: {
          total: charge.amount,
          charge: charge.id,
          user: { connect: { id: userId }}
        }
    });

    console.log('gonna create the order');
    console.dir(order, { depth: null });

    //6. Получаем список товаров из корзины, который добавим к заказу
    const orderItemsList = cartItems.map(cartItem => {
        const orderItem = {
          name: cartItem.id_product.name,
          description: cartItem.id_product.description,
          price: cartItem.id_product.price,
          quantity: cartItem.quantity,
          id_product_image: { connect: { id: cartItem.id_product.id_product_image.id }},
          id_order: { connect: { id: order.id }}
        }
        return orderItem;
    });
    
    console.log('gonna create the order items');
    console.dir(orderItemsList, { depth: null });

    //7. Добавляем товары к заказу
    const orderItems = await context.query.wb_order_item.createMany({
        data: orderItemsList
    });

    //8. Очищаем корзину
    var cartItemIds = Array();

    user.cart_item.forEach(function(cartItem, index){
        let cartItemId = {id: cartItem.id};
        cartItemIds[index] = cartItemId;
    });

    //console.dir(cartItemIds, { depth: null });

    await context.query.wb_cart_item.deleteMany({
        //cartItemIds = [ { id: '21' }, { id: '27' }, { id: '28' } ]
        where: cartItemIds
    });

    //9. Возвращаем наш заказ
    const queryOrder = await context.db.wb_order.findOne({
        where: { id: order.id.toString() }
    });

    console.dir(queryOrder, { depth: null });

    return queryOrder;

}

export default checkout;
