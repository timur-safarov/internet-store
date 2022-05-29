import NProgress from 'nprogress';
import Router from 'next/router';
import Page from "../components/Page";
//Этот css даст крастную подсветку для прелоадера страниц
import '../components/styles/nprogress.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import withData from '../lib/withData';
import { CartStateProvider } from '../lib/cartState';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

//Apollo client setup - Example
// const apollo = new ApolloClient({
//   uri: 'http://localhost:3000/api/graphql',
//   cache: new InMemoryCache( ),
// });

function MyApp({ Component, pageProps, apollo}) {

  //console.log(apollo);

  return (
    <ApolloProvider client={apollo}>
      <CartStateProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartStateProvider>
    </ApolloProvider>
  );

}

MyApp.getInitialProps = async function({ Component, ctx }) {

  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  pageProps.query = ctx.query;

  return { pageProps };

}


export default withData(MyApp);
