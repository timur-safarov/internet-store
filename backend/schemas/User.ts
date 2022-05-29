import { list } from '@keystone-6/core';

// We're using some common fields in the starter. Check out https://keystonejs.com/docs/apis/fields#fields-api
// for the full list of fields.
import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-6/core/fields';
// The document field is a more complicated field, so it's in its own package
// Keystone aims to have all the base field types, but you can make your own
// custom ones.
import { document } from '@keystone-6/fields-document';
import { wb_order } from './Order';


export const wb_user = list({
  fields: {
    username: text({ isRequired: true }),
    // Added an email and password pair to be used with authentication
    // The email address is going to be used as the identity field, so it's
    // important that we set both isRequired and isUnique
    email: text({ isRequired: true, isUnique: true, isIndexed: 'unique' }),
    // The password field stores a hash of the supplied password, and
    // we want to ensure that all people have a password set, so we use
    // the isRequired flag.
    password: password({ isRequired: true }),

    cart_item: relationship({
      ref: 'wb_cart_item.id_user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),

    orders: relationship({
      ref: 'wb_order.user',
      many: true
    }),

    id_role: relationship({
      ref: 'wb_role'
    }),

  },
});
