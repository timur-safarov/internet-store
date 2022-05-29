/*
Welcome to the schema! The schema is the heart of Keystone.

Here we define our 'lists', which will then be used both for the GraphQL
API definition, our database tables, and our Admin UI layout.

Some quick definitions to help out:
A list: A definition of a collection of fields with a name. For the starter
  we have `User`, `Post`, and `Tag` lists.
A field: The individual bits of data on your list, each with its own type.
  you can see some of the lists in what we use below.

*/

// Like the `config` function we use in keystone.ts, we use functions
// for putting in our config so we get useful errors. With typescript,
// we get these even before code runs.
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
  },
});
