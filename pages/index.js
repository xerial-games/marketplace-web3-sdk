import Head from "next/head";
import { useEffect, useState } from "react";
import web2Functions from "@/functions/web2/web2";
import Item from "@/atoms/Item/Item";
import { useRouter } from "next/router";
import SecondaryMarketItem from "@/atoms/SecondaryMarketItem/SecondaryMarketItem";
import XerialWallet from "@/atoms/XerialWallet/XerialWallet";
import { GoogleLogin } from "@react-oauth/google";
import { loadSession, loginWithMetamask, logout } from "@/functions/login";
import { defaultPolygonChainValue, defaultTelosChainValue } from "@/utils/defaultChainValues";
const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
const projectDomain = process.env.NEXT_PUBLIC_PROJECT_DOMAIN;

export default function Home({ XerialWalletViewmodel, activeChain, handleActiveChain }) {
  const [project, setProject] = useState({});
  const [listedNfts, setListedNfts] = useState([]);
  const [listedNftsInTelos, setListedNftsInTelos] = useState([]);
  const [listedNftsOnSecondaryMarket, setListedNftsOnSecondaryMarket] = useState([]);
  const [listedNftsOnSecondaryMarketInTelos, setListedNftsOnSecondaryMarketInTelos] = useState([]);
  const [loguedWith, setLoguedWith] = useState("");
  const [loadingProject, setLoadingProject] = useState(false);
  const [activeXerialWallet, setActiveXerialWallet] = useState(false);
  const [wallets, setWallets] = useState([]);
  const [sessionToken, setSessionToken] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const router = useRouter();
  useEffect(() => {
    XerialWalletViewmodel.observer.restart();
    XerialWalletViewmodel.observer.observe(() => {
      setLoguedWith(XerialWalletViewmodel.loguedWith || "");
    }, []);
    XerialWalletViewmodel.loadProject();
    load();
    loadMetamaskSessionInUI();
    XerialWalletViewmodel.loadSession();
  }, []);

  useEffect(() => {
    if (project && JSON.stringify(project) != "{}") {
      loadListedNfts();
      loadListedNftsInTelos();
      loadListedNftsOnSecondaryMarket();
      loadListedNftsOnSecondaryMarketInTelos();
    }
  }, [project]);

  async function loadMetamaskSessionInUI () {
    const response = await loadSession();
    if (!response) return;
    const { loguedWith, player, sessionToken, wallets } = response;
    setWallets(wallets);
    setSessionToken(sessionToken);
    setUserAddress(userAddress);
    setLoguedWith(loguedWith);
  }

  async function logoutAndClearUI () {
    try {
      await logout();
      setWallets([]);
      setSessionToken("");
      setUserAddress("");
      setLoguedWith("");
    } catch (error) {
      console.error("Error in logoutAndClearUI function. Reason: " +  error.message);
    }
  }

  
  async function connectWallet() {
    try {
      const { loguedWith, player, sessionToken, tokens, wallets } = await loginWithMetamask({ projectId: project.id });
      const userAddress = wallets[0].address;
      if (!userAddress) throw new Error("User Address Not Found");
      setWallets(wallets);
      setSessionToken(sessionToken);
      setUserAddress(userAddress);
      setLoguedWith(loguedWith);
    } catch (error) {
      console.error("Error: Login Failed");
      console.error("Error in connectWallet function. Reason: " +  error.message);
    }
  }

  async function load() {
    setLoadingProject(true);
    const getProjectForDomainResponse = await web2Functions.getProjectForDomain({ projectDomain: projectDomain });
    setProject(getProjectForDomainResponse);
    setLoadingProject(false);
  }

  async function loadListedNfts() {
    const getListedNftsResponse = await web2Functions.getListedNfts({
      chain: defaultPolygonChainValue,
      projectId: project.id,
    });

    setListedNfts(getListedNftsResponse);
  }

  async function loadListedNftsInTelos() {
    const getListedNftsResponse = await web2Functions.getListedNfts({
      chain: defaultTelosChainValue,
      projectId: project.id,
    });

    setListedNftsInTelos(getListedNftsResponse);
  }

  async function loadListedNftsOnSecondaryMarket() {
    const getListedNftsOnSecondaryMarket = await web2Functions.getListedNftsOnSecondaryMarket({
      chain: defaultPolygonChainValue,
      projectId: project.id,
    });

    setListedNftsOnSecondaryMarket(getListedNftsOnSecondaryMarket);
  }

  async function loadListedNftsOnSecondaryMarketInTelos() {
    const getListedNftsOnSecondaryMarket = await web2Functions.getListedNftsOnSecondaryMarket({
      chain: defaultTelosChainValue,
      projectId: project.id,
    });

    setListedNftsOnSecondaryMarketInTelos(getListedNftsOnSecondaryMarket);
  }

  function goToInventory() {
    router.push("inventory");
  }

  function refreshListedItems() {
    if (project && JSON.stringify(project) != "{}") {
      setLoadingProject(true);
      loadListedNfts();
      loadListedNftsInTelos();
      loadListedNftsOnSecondaryMarket();
      loadListedNftsOnSecondaryMarketInTelos();
      setLoadingProject(false);
    } else console.error("Project Not Found");
  }

  async function connectWithGoogle(credentialResponse) {
    try {
      await XerialWalletViewmodel.login({
        credential: credentialResponse.credential,
        clientId,
      });
    } catch (error) {
      console.error("Error in connectWithGoogle function. Reason ", error.message);
    }
  }

  function RenderContent() {
    if (loadingProject) {
      return <div className="home__loaderContainer">Loading...</div>;
    }

    return (
      <div className="home__principalContainer">
        <nav className="global-styles__menu">
          <ul>
            <li>
              <button className="global-styles__home__menuOption" onClick={goToInventory}>
                Go to Inventory
              </button>
            </li>
            <li>
              <button className="global-styles__home__menuOption" onClick={refreshListedItems}>
                Refresh listed Items
              </button>
            </li>
            <li>
              <button className="global-styles__home__menuOption">Active chain: {activeChain}</button>
              <ul class="global-styles__home__subMenus">
                <li>
                  <button className="global-styles__button__sub-menu__option" onClick={() => handleActiveChain(defaultTelosChainValue)}>
                    Change to Telos
                  </button>
                </li>
                <li>
                  <button className="global-styles__button__sub-menu__option" onClick={() => handleActiveChain(defaultPolygonChainValue)}>
                    Change to Polygon
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>

        <div className="home__buttonsContainer">
          <div className="home__loginWithGoogleContainer">
            {!loguedWith ? (
              <GoogleLogin
                theme="outline"
                width="335px"
                onSuccess={connectWithGoogle}
                onError={() => {
                  console.error("Login Failed");
                }}
              />
            ) : loguedWith === "google" ? (
              <button className="home__button" onClick={() => setActiveXerialWallet(!activeXerialWallet)}>
                {activeXerialWallet ? "Close xerial wallet" : "Open xerial wallet"}
              </button>
            ) : (
              <button className="inventory__button">You logued with {loguedWith}</button>
            )}
            {loguedWith === "google" && activeXerialWallet && (
              <div className="home__xerialWalletContainer">
                <XerialWallet XerialWalletViewmodel={XerialWalletViewmodel} />
              </div>
            )}
          </div>
          {!loguedWith && (
            <button className="inventory__button" onClick={connectWallet}>
              Connect with MetaMask
            </button>
          )}
          {loguedWith === "metamask" && (
            <button className="inventory__button" onClick={logoutAndClearUI}>
              Logout
            </button>
          )}
        </div>
        {project && (
          <div className="home__projectDataContainer">
            <div className="home__projectLogoAndTitleContainer">
              <h2 className="home__projectTitle">Project Information</h2>
              <img className="home__projectLogo" src={project.logo} alt="project logo" />
            </div>
            <div className="home__projectBannerContainer">
              <img className="home__projectBanner" src={project.banner} />
            </div>
            <div className="home__projectDataSubcontainer">
              <div className="home__projectData">ID: {project.id}</div>
              <div className="home__projectData">Name: {project.name}</div>
              <div className="home__projectData">Project domain: {project.domain}</div>
              <a className="home__projectDownloadLink" href={project.downloadLink} about="download link" target="_blank">
                Click to open the game download page
              </a>
              <div className="home__noListedNftsMessage">There is more information about your project available in the documentation</div>
            </div>
          </div>
        )}
        <section className="home__marketplaceSection">
          {activeChain === defaultPolygonChainValue && (
            <>
              <h1 className="home__title">Primary Market</h1>
              <div className="home__itemsContainer">
                {listedNfts && listedNfts.length === 0 ? (
                  <div className="home__noListedNftsMessage">There are no listed NFTs</div>
                ) : (
                  listedNfts?.map((nft) => {
                    return <Item key={nft.id} nft={nft} sellerAddress={project.address} XerialWalletViewmodel={XerialWalletViewmodel} activeChain={activeChain} />;
                  })
                )}
              </div>
              <h1 className="home__title">Secondary Market</h1>
              <div className="home__itemsContainer">
                {listedNftsOnSecondaryMarket && listedNftsOnSecondaryMarket.length === 0 ? (
                  <div className="home__noListedNftsMessage">There are no listed NFTs</div>
                ) : (
                  listedNftsOnSecondaryMarket?.map((nft) => {
                    return <SecondaryMarketItem key={nft.marketItemId} nft={nft} XerialWalletViewmodel={XerialWalletViewmodel} activeChain={activeChain} />;
                  })
                )}
              </div>
            </>
          )}
          {activeChain === defaultTelosChainValue && (
            <>
              <h1 className="home__title">Primary Market</h1>
              <div className="home__itemsContainer">
                {listedNftsInTelos && listedNftsInTelos.length === 0 ? (
                  <div className="home__noListedNftsMessage">There are no listed NFTs</div>
                ) : (
                  listedNftsInTelos?.map((nft) => {
                    return <Item key={nft.id} nft={nft} sellerAddress={project.address} XerialWalletViewmodel={XerialWalletViewmodel} activeChain={activeChain} />;
                  })
                )}
              </div>
              <h1 className="home__title">Secondary Market</h1>
              <div className="home__itemsContainer">
                {listedNftsOnSecondaryMarketInTelos && listedNftsOnSecondaryMarketInTelos.length === 0 ? (
                  <div className="home__noListedNftsMessage">There are no listed NFTs</div>
                ) : (
                  listedNftsOnSecondaryMarketInTelos?.map((nft) => {
                    return <SecondaryMarketItem key={nft.marketItemId} nft={nft} XerialWalletViewmodel={XerialWalletViewmodel} activeChain={activeChain} />;
                  })
                )}
              </div>
            </>
          )}
        </section>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>SDK Xerial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RenderContent />
    </>
  );
}
