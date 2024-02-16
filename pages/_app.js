import "@/styles/globals.css";
import { defaultPolygonChainValue } from "@/utils/defaultChainValues";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { xerialWalletViewmodelInstance } from "@/viewmodels/instances";

const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
export default function App({ Component, pageProps }) {
  const [activeChain, setActiveChain] = useState(xerialWalletViewmodelInstance.activeChain || defaultPolygonChainValue);
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Component
        {...pageProps}
        XerialWalletViewmodel={xerialWalletViewmodelInstance}
        activeChain={activeChain}
        handleActiveChain={(newChain) => {
          xerialWalletViewmodelInstance.setActiveChain(newChain);
          setActiveChain(newChain);
        }}
      />
    </GoogleOAuthProvider>
  );
}
