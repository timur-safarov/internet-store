import type { KeystoneContext, SessionStore } from '@keystone-6/core/types';
import { wb_cart_itemCreateInput } from '@keystone-6/core/types';
import { Session } from '../types';
import { wb_cart_item } from '../schemas/CartItem';



async function addToCart(
    root: any, 
    { productId }: { productId: string },
    context: KeystoneContext
): Promise<wb_cart_itemCreateInput> {

    console.log("Adding to Cart!!!");

    //Query current user If he is signed in
    const sesh = context.session as Session;

    if (!sesh.itemId) {
        throw new Error("You must be login in to do this!")
    }

    //Query the current users cart
    //GraphQl query for that request
    /*mutation {
        addToCart(productId: 2){
            id,
            quantity,
            id_user: id_user {
                id: id
            },
            id_product: id_product {
                    id: id
            }
        }
    }*/
    const allCartItems = await context.query.wb_cart_item.findMany({
        where: {
            id_user: { id: { equals: sesh.itemId } },
            id_product: { id: { equals: productId } }
        },
        orderBy: [{ id: 'asc' }],
        //Fields that we'll get
        query: 'id,quantity'
    });

    //console.log(allCartItems);

    const [existingCartItem] = allCartItems;

    //Here is first one id
    //existingCartItem.id

    //If the entry exist
    if (existingCartItem) {

        console.log(`There are already ${existingCartItem.quantity} in the cart, increment by 1.`);

        //wb_cart_itemUpdateInput
        //GraphQl query for that request
        /*mutation {
            addToCart(productId: 2){
                id,
                quantity
            }
        }*/
        return await context.query.wb_cart_item.updateOne({
            where: { id: existingCartItem.id },
            data: { 
                id_user: { 
                    connect: {
                        id: sesh.itemId,
                    },
                },
                id_product: { 
                    connect: {
                        id: productId,
                    },
                },
                quantity: existingCartItem.quantity + 1
            },
            query: 'id quantity'
        });

    }

    //If new itemCart then create new entry.
    return await context.query.wb_cart_item.createOne({
        data: {
            quantity: 1,
            id_user: {
                connect: {
                    id: sesh.itemId
                }
            },
            id_product: {
                connect: {
                    id: productId
                }
            }
        },
        query: 'id quantity'
    });

}

export default addToCart;
