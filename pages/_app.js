import '@/styles/globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
export default function App({ Component, pageProps }) {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Component {...pageProps} />
   </ GoogleOAuthProvider>
  );
}
