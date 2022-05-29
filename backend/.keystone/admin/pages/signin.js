import { getSigninPage } from '@keystone-6/auth/pages/SigninPage'

export default getSigninPage({"identityField":"email","secretField":"password","mutationName":"authenticatewb_userWithPassword","successTypename":"wb_userAuthenticationWithPasswordSuccess","failureTypename":"wb_userAuthenticationWithPasswordFailure"});
