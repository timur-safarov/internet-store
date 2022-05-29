//https://keystonejs.com/docs/apis/config

import 'dotenv/config';
import { config } from '@keystone-6/core';
import { wb_user } from './schemas/User';
import { wb_product } from './schemas/Product';
import { wb_product_image } from './schemas/ProductImage';
import { wb_cart_item } from './schemas/CartItem';
import { withAuth, session } from './auth';
import { insertSeedData } from './seed-data';
import type { AdminUIConfig, GraphQLConfig } from '@keystone-6/core/types';
import { extendGraphqlSchema } from './mutations';
import { wb_order_item } from './schemas/OrderItem';
import { wb_order } from './schemas/Order';
import { wb_role } from './schemas/Role';

import {
  statelessSessions,
} from '@keystone-6/core/session';

// const { Keystone } = require('@keystonejs/keystone');
// const { GraphQLApp } = require('@keystonejs/app-graphql');
// const { AdminUIApp } = require('@keystonejs/app-admin-ui');

// const keystone = new Keystone();
// const authStrategy = keystone.createAuthStrategy();

// module.exports = {
//   Keystone,
//   apps: [
//     new GraphQLApp(),
//     new AdminUIApp({
//       maximumPageSize: 5
//     }),
//   ],
// };


const databaseURL = process.env.DATABASE_URL;

export default withAuth(
  config({
    server: {
      cors: { origin: ['http://localhost:7777'], credentials: true },
      port: 3000,
      maxFileSize: 200 * 1024 * 1024,
      healthCheck: true,
      extendExpressApp: (app, createContext) => {},
    },
    db: {
      //Тип бд
      provider: 'postgresql',
      //Строка с данными для подключения к БД
      url: databaseURL,
      //Тип id для всех таблиц в бд
      idField: { kind: 'autoincrement' },
      async onConnect(keystone){
        console.log('Connected Database...');
        //У нас в package.json есть команда seed-data
        //Провеуряем запущена она или нет!
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
        
      },
      onError(){
        console.log('Connected was aborted by faild!');
      }
    },
    graphql: {
      debug: process.env.ENV !== 'production',
      queryLimits: { 
        maxTotalResults: undefined
      },
      path: '/api/graphql',
      apolloConfig: {
        debug: true,
      },
    },
    //https://keystonejs.com/docs/apis/config#ui
    ui: {
      //Без сессий не пропускаем в Admin UI!
      isAccessAllowed: (context) => !!context.session?.data,
    },
    // maximumPageSize: 5,
    // defaultPageSize: 5,
    //Список данных для бд
    lists: ({
      wb_user,
      wb_product,
      wb_product_image,
      wb_cart_item,
      wb_order,
      wb_order_item,
      wb_role,
    }),
    extendGraphqlSchema,

    //Сессии нужны для авторизации - включаем их
    session,

  })
);
