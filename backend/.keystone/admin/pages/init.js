import { getInitPage } from '@keystone-6/auth/pages/InitPage';

const fieldPaths = ["username","email","password"];

export default getInitPage({"listKey":"wb_user","fieldPaths":["username","email","password"],"enableWelcome":true});
