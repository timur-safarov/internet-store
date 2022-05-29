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
import { rules, isSignedIn } from '../access';

//https://keystonejs.com/docs/apis/schema
export const wb_product = list({

    //https://keystonejs.com/docs/guides/auth-and-access-control
    access: {
        operation: {
            create: isSignedIn,
            query: rules.canReadProducts,
            update: rules.canManageProducts,
            delete: rules.canManageProducts,
        }
    },

    fields: {
        name: text({ isRequired: true }),
        description: text({ ui: 
            {
                displayMode: 'textarea'
            }
        }),
        id_product_image: relationship({
            //Тут подрузамевается wb_product_image.id
            ref: 'wb_product_image.product',
            ui: {
                displayMode: 'cards',
                cardFields: ['image', 'alt_text'],
                inlineCreate: {fields: ['image', 'alt_text']},
                inlineEdit: {fields: ['image', 'alt_text']},
            }
        }),
        status: select({
            options: [
                { label: 'Draft', value: 'DRAFT' },
                { label: 'Available', value: 'AVAILABLE' },
                { label: 'Unavailable', value: 'UNAVAILABLE' },
            ],
            defaultValue: 'DRAFT',
            ui: {
                //Сделать вместо Select кнопочки
                displayMode: 'segmented-control',
                //Спрятать поле status
                //createView: { fieldMode: 'hidden' }
            }
        }),
        price: integer(),

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