import 'dotenv/config';
import { list } from "@keystone-6/core";
import { cloudinaryImage } from "@keystone-6/cloudinary";
import {
    text,
    relationship,
    password,
    timestamp,
    select,
  } from '@keystone-6/core/fields';

export const cloudinary = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: 'sickfits',
};

export const wb_product_image = list({

    fields: {
        image: cloudinaryImage({
            cloudinary,
            label: 'Source',
        }),
        alt_text: text(),
        //https://keystonejs.com/docs/guides/relationships
        //Связываемся с таблицей wb_product
        //Если many: true - тогда создасться доп таблица many to many
        //пОЯВИТЬСЯ foreign key ссылающийся на primary key в wb_product
        //id_product: relationship({ ref: 'wb_product', many: false, }),
        //Здесь мы просто указываем на талбицу wb_product
        //Поле product не будет создано
        product: relationship({ ref: 'wb_product.id_product_image' })
    },
    ui: {
        listView: {
            initialColumns: ['image', 'alt_text', 'product']
        }
    }

});