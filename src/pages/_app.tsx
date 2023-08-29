import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

import { CacheProvider, EmotionCache } from '@emotion/react';
import createEmotionCache from '../utility/createEmotionCache';

import MainLayout from '../layouts/Main';
import ThemeComponent from '../theme/ThemeComponent';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../app/globals.css';

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();

const getFaviconPath = (isDarkMode = false) => {
  return `/favicon-${isDarkMode ? 'dark' : 'light'}.svg`;
};

export default function App(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const [faviconHref, setFaviconHref] = useState('/favicon-light.svg');

  useEffect(() => {
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    setFaviconHref(getFaviconPath(matcher.matches));
    matcher.onchange = () => setFaviconHref(getFaviconPath(matcher.matches));
  }, [faviconHref]);

  return (
    <>
      <Head>
        <meta name='viewport' content='width=320,initial-scale=1.0,maximum-scale=1' />
        <link rel='icon' href={faviconHref} sizes='any' type='image/svg+xml' />
      </Head>

      <CacheProvider value={emotionCache}>
        <ThemeComponent>
          <MainLayout>
            <Component {...pageProps} />
            <ToastContainer />
          </MainLayout>
        </ThemeComponent>
      </CacheProvider>
    </>
  );
}
