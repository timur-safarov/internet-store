import { config, graphql, list } from '@keystone-6/core';
import {
    text,
    relationship,
    password,
    timestamp,
    select,
    integer,
    virtual
  } from '@keystone-6/core/fields';
import { wb_product_image } from './ProductImage';
import { wb_order_item } from './OrderItem';
import { wb_user } from './User';
import formatMoney from '../lib/formatMoney';

//https://keystonejs.com/docs/apis/schema
export const wb_order = list({

    fields: {
        //пРОСТО ВИРУАЛЬНОЕ ПОЛЕ которое будет видно в списке записей
        label: virtual({
            field: graphql.field({
            type: graphql.String,
                resolve(item) {
                    return `${formatMoney(item.total)}`;
                },
            }),
        }),

        total: integer(),
        order_item: relationship({
            //Тут подрузамевается wb_order.id
            ref: 'wb_order_item.id_order',
            many: true
        }),
        user: relationship({
            ref: 'wb_user.orders'
        }),
        charge: text()

    }


});