import Layout from '@/components/Layouts/Layout';
import '@/styles/globals.scss';
import { store } from '@/utils/redux/store';
import type { AppProps } from 'next/app';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/lara-light-teal/theme.css";
import { Provider } from 'react-redux';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <PrimeReactProvider>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </PrimeReactProvider>
        </Provider>
    );
}
