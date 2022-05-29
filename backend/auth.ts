/*
Welcome to the auth file! Here we have put a config to do basic auth in Keystone.

`createAuth` is an implementation for an email-password login out of the box.
`statelessSessions` is a base implementation of session logic.

For more on auth, check out: https://keystonejs.com/docs/apis/auth#authentication-api
*/

import { createAuth } from '@keystone-6/auth';
import { sendPasswordResetEmail } from './lib/mail';

//https://keystonejs.com/docs/apis/session#session-api
import { statelessSessions } from '@keystone-6/core/session';

//sessionSecret - минимум 32 символа
let sessionSecret = process.env.SESSION_SECRET;

// Here is a best practice! It's fine to not have provided a session secret in dev,
// however it should always be there in production.
if (!sessionSecret) {
  if (process.env.ENV === 'production') {
    throw new Error(
      sessionSecret = process.env.COOKIE_SECRET,
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

// Here we define how auth relates to our schemas.
// What we are saying here is that we want to use the list `User`, and to log in
// we will need their email and password.
const { withAuth } = createAuth({
  listKey: 'wb_user',
  identityField: 'email',
  sessionData: 'username',
  secretField: 'password',
  initFirstItem: {
    // If there are no items in the database, keystone will ask you to create
    // a new user, filling in these fields.
    fields: ['username', 'email', 'password'],
  },
  //Метод для формирования временной ссылки для сменыпароля
  //https://keystonejs.com/docs/apis/auth
  passwordResetLink: {
    sendToken: async ({ itemId, identity, token, context }) => {
      //Вывести в консоль Ubuntu данные об генерируемой ссылке
      console.log('identity = ' + identity + '; token = ' + token);
      //Отправляем наше письмо
      await sendPasswordResetEmail(token, identity);
    },
    tokensValidForMins: 60,
  },
  magicAuthLink: {
    sendToken: async ({ itemId, identity, token, context }) => {},
    tokensValidForMins: 60,
  },

});

//https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
  maxAge: 60 * 60 * 24 * 360, // How long they stay signed in?
  secret: sessionSecret,
  // ironOptions: { /* ... */ },
  // secure: true,
  // path: '/',
  // domain: 'localhost',
  // sameSite: 'lax',
});

export { withAuth, session };
