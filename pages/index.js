import Head from "next/head";
import { useEffect, useState } from "react";
import web2Functions from "@/functions/web2/web2";
import Item from "@/atoms/Item/Item";
import { useRouter } from "next/router";
import SecondaryMarketItem from "@/atoms/SecondaryMarketItem/SecondaryMarketItem";
import { xerialWalletViewmodelInstance } from "@/viewmodels/instances";
import XerialWallet from "@/atoms/XerialWallet/XerialWallet";
import { GoogleLogin } from "@react-oauth/google";
const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;
const projectDomain = process.env.NEXT_PUBLIC_PROJECT_DOMAIN;

export default function Home() {
  const [project, setProject] = useState({});
  const [listedNfts, setListedNfts] = useState([]);
  const [listedNftsOnSecondaryMarket, setListedNftsOnSecondaryMarket] = useState([]);
  const [loguedWith, setLoguedWith] = useState("");
  const [loadingProject, setLoadingProject] = useState(false);
  const [activeXerialWallet, setActiveXerialWallet] = useState(false);
  const router = useRouter();

  useEffect(() => {
    xerialWalletViewmodelInstance.observer.observe(() => {
      setLoguedWith(xerialWalletViewmodelInstance.loguedWith || "");
    }, []);
    xerialWalletViewmodelInstance.loadProject();
    load();
  }, []);

  useEffect(() => {
    if (project && JSON.stringify(project) != "{}") {
      loadListedNfts();
      loadListedNftsOnSecondaryMarket();
    }
  }, [project]);

  async function load() {
    setLoadingProject(true);
    const getProjectForDomainResponse = await web2Functions.getProjectForDomain({ projectDomain: projectDomain });
    setProject(getProjectForDomainResponse.project);
    setLoadingProject(false);
  }

  async function loadListedNfts() {
    const getListedNftsResponse = await web2Functions.getListedNfts({
      chain: "polygon",
      projectId: project.id,
    });

    setListedNfts(getListedNftsResponse);
  }

  async function loadListedNftsOnSecondaryMarket() {
    const getListedNftsOnSecondaryMarket = await web2Functions.getListedNftsOnSecondaryMarket({
      chain: "polygon",
      projectAddress: project.address,
    });

    setListedNftsOnSecondaryMarket(getListedNftsOnSecondaryMarket);
  }

  function goToInventory() {
    router.push("inventory");
  }

  function refreshListedItems() {
    if (project && JSON.stringify(project) != "{}") {
      loadListedNfts();
      loadListedNftsOnSecondaryMarket();
    } else console.error("Project Not Found");
  }

  async function connectWithGoogle(credentialResponse) {
    try {
      await xerialWalletViewmodelInstance.login({
        credential: credentialResponse.credential,
        clientId,
      });
    } catch (error) {
      console.error(error);
      console.error("Error: Login Failed.");
    }
  }

  function RenderContent() {
    if (loadingProject) {
      return <div className="home__loaderContainer">Loading...</div>;
    }

    return (
      <div className="home__principalContainer">
        <div className="home__buttonsContainer">
          {!loguedWith && (
            <button className="home__button" onClick={goToInventory}>
              Go to Inventory
            </button>
          )}
          <button className="home__button" onClick={refreshListedItems}>
            Refresh Listed Items
          </button>
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
              <button>You logued with {loguedWith}</button>
            )}
            {loguedWith === "google" && activeXerialWallet && (
              <div className="home__xerialWalletContainer">
                <XerialWallet XerialWalletViewmodel={xerialWalletViewmodelInstance} />
              </div>
            )}
          </div>
        </div>
        {/* {loguedWith && <div className="home__noListedNftsMessage" style={{marginBottom: 20, marginTop: 20}}>Logued with: {loguedWith}</div>} */}
        {project && (
          <div className="home__projectDataContainer">
            <div className="home__projectLogoAndTitleContainer">
              <h2 className="home__projectTitle">Project Information</h2>
              <img className="home__projectLogo" src={project.logo} alt="project logo" />
            </div>
            <div className="home__projectBannerContainer">
              <img className="home__projectBanner" src={project.userBanner} />
            </div>
            <div className="home__projectDataSubcontainer">
              <div className="home__projectData">ID: {project.id}</div>
              <div className="home__projectData">Name: {project.name}</div>
              <div className="home__projectData">Description: {project.description}</div>
              <div className="home__projectData">Project domain: {project.domain}</div>
              <a className="home__projectDownloadLink" href={project.downloadLink} about="download link" target="_blank">
                Click to open the game download page
              </a>
              <div className="home__noListedNftsMessage">There is more information about your project available in the documentation</div>
            </div>
          </div>
        )}
        <section className="home__marketplaceSection">
          <h1 className="home__title">Primary Market</h1>
          <div className="home__itemsContainer">
            {listedNfts && listedNfts.length === 0 ? (
              <div className="home__noListedNftsMessage">There are no listed NFTs</div>
            ) : (
              listedNfts?.map((nft) => {
                return <Item key={nft.id} nft={nft} sellerAddress={project.address} XerialWalletViewmodel={xerialWalletViewmodelInstance} />;
              })
            )}
          </div>
          <h1 className="home__title">Secondary Market</h1>
          <div className="home__itemsContainer">
            {listedNftsOnSecondaryMarket && listedNftsOnSecondaryMarket.length === 0 ? (
              <div className="home__noListedNftsMessage">There are no listed NFTs</div>
            ) : (
              listedNftsOnSecondaryMarket?.map((nft) => {
                return <SecondaryMarketItem key={nft.marketItemId} nft={nft} XerialWalletViewmodel={xerialWalletViewmodelInstance} />;
              })
            )}
          </div>
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
