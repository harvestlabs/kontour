import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import GraphQLClient from "@gql/GraphQLClient";
import { createBreakpoints } from "@chakra-ui/theme-tools";
import { Provider } from "react-redux";
import { store } from "src/redux/store";
import theme from "src/theme";
import { NextPageWithLayout } from "types/next";
import Head from "next/head";
import Script from "next/script";

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Provider store={store}>
        <ApolloProvider client={GraphQLClient}>
          <ChakraProvider theme={theme}>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </ApolloProvider>
      </Provider>
    </>
  );
}

export default MyApp;
