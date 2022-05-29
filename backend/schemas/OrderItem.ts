import { list } from '@keystone-6/core';
import {
    text,
    relationship,
    password,
    timestamp,
    select,
    integer,
  } from '@keystone-6/core/fields';
import { wb_product_image } from './ProductImage';
import { wb_order } from './Order';

//https://keystonejs.com/docs/apis/schema
export const wb_order_item = list({

    fields: {
        name: text({ isRequired: true }),
        description: text({ ui: 
            {
                displayMode: 'textarea'
            }
        }),
        id_product_image: relationship({
            //Тут подрузамевается wb_product_image.id
            ref: 'wb_product_image',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'alt_text'],
                inlineCreate: {fields: ['image', 'alt_text']},
                inlineEdit: {fields: ['image', 'alt_text']},
            }
        }),
        price: integer(),
        quantity: integer(),
        id_order: relationship({
            //Тут подрузамевается wb_order_item.id
            ref: 'wb_order.order_item'
        }),

    },
    ui: {
        // labelField: 'name',
        // searchFields: ['name', 'alternativeName'],
        // description: '...',
        // isHidden: ({ session, context }) => false,
        // hideCreate: ({ session, context }) => false,
        // hideDelete: ({ session, context }) => false,
        // createView: {
        //   defaultFieldMode: ({ session, context }) => 'edit',
        // },
        // itemView: {
        //   defaultFieldMode: ({ session, context, item }) => 'edit',
        // },
        listView: {
            defaultFieldMode: ({ session, context }) => 'read',
            initialColumns: ['name'],
            initialSort: { field: 'name', direction: 'ASC' },
            pageSize: 5,
        },
    }


});