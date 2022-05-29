import { list } from '@keystone-6/core';
import {
    text,
    relationship,
    password,
    timestamp,
    select,
    integer,
  } from '@keystone-6/core/fields';
import { wb_product } from './Product';

//https://keystonejs.com/docs/apis/schema
export const wb_cart_item = list({

    ui: {
        listView: {
            initialColumns: ['id_product', 'quantity'],
        },
    },

    fields: {
        quantity: integer({
            defaultValue: 1,
            validation: {
                isRequired: true,
                min: 1
            }
        }),
        id_product: relationship({
            ref: 'wb_product',

            //Для relationship isRequired не потдерживается
            //Эта не решённая проблема в 6-й версии
            //Используем хуки
            // validation: {
            //   isRequired: true
            // },
            many: false,

            hooks: {
                afterOperation: async ({
                  listKey,
                  fieldKey,
                  operation,
                  inputData,
                  originalItem,
                  item,
                  resolvedData,
                  context,
                }) => {
                    console.log('beforeOperation create!');
                    return false;
                },
            },
        }),

        id_user: relationship({
            ref: 'wb_user.cart_item',
            many: false,
        }),

    },

    hooks: {

        validateInput: ({ resolvedData, addValidationError }) => {

            //Выбираем нужное нам поле из данных
            const { id_product, id_user } = resolvedData;
            
            if (id_product === undefined) {
                addValidationError('Поле товар - обязательно к заполнению.');
            }

            if (id_user === undefined) {
                addValidationError('Поле пользователь - обязательно к заполнению.');
            }

        },

        beforeOperation: ({ operation, item }) => {
            console.log('beforeOperation create!');
            if (operation === 'create') {}
        },

        afterOperation: ({ operation, item }) => {
            console.log('afterOperation create!');
            if (operation === 'create') {}
        },

    },

});