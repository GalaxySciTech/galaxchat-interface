import "../styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { argentWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { themeChange } from "theme-change";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { zkSync, zkSyncTestnet } from "wagmi/chains";
import { SearchProvider } from "../components/context/search";

const { chains, provider, webSocketProvider } = configureChains(
  [zkSync, zkSyncTestnet],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "Project",
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [argentWallet({ chains }), trustWallet({ chains })],
  },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div
      className="bg-cover bg-center min-h-screen"
      style={{ backgroundColor: "#FFF0F5" }}
    >
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <SearchProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </SearchProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
};

export default MyApp;
