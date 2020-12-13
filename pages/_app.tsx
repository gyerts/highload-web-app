import {useEffect} from "react";
import '../styles/global.css'
import { AppProps } from 'next/app'
import {useRouter} from "next/router";


export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const lang = pathname.startsWith("/de") ? "de" : "en";
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <Component {...pageProps} />
}
