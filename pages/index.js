import Head from 'next/head';
import { useEffect, useState } from 'react';
import web2Functions from '@/utils/web2_functions/web2_functions';
import Item from '@/atoms/Item/Item';
import { useRouter } from 'next/router';
import SecondaryMarketItem from '@/atoms/SecondaryMarketItem/SecondaryMarketItem';
import { xerialWalletViewmodelInstance } from '@/viewmodels/instances';
import XerialWallet from '@/atoms/XerialWallet/XerialWallet';
import { GoogleLogin } from '@react-oauth/google';
const clientId = process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID;

export default function Home() {
  const [hostname, setHostname] = useState("");
  const [project, setProject] = useState({});
  const [listedNfts, setListedNfts] = useState([]);
  const [listedNftsOnSecondaryMarket, setListedNftsOnSecondaryMarket] = useState([]);
  const [loguedWith, setLoguedWith] = useState("");
  const router = useRouter();

  useEffect(() => {
    setHostname(window.location.hostname);
    xerialWalletViewmodelInstance.observer.observe(() => {
      setLoguedWith(xerialWalletViewmodelInstance.loguedWith || "");
    }, []);
  }, []);

  useEffect(() => {
    if (hostname) {
      load();
      xerialWalletViewmodelInstance.loadProject();
    }
  }, [hostname]);

  useEffect(() => {
    if (project && JSON.stringify(project) != "{}") {
      loadListedNfts();
      loadListedNftsOnSecondaryMarket();
    }
  }, [project]);

  async function load () {
    const getProjectForDomainResponse = await web2Functions.getProjectForDomain({ projectDomain: hostname });
    setProject(getProjectForDomainResponse.project);
  }

  async function loadListedNfts () {
    const getListedNftsResponse = await web2Functions.getListedNfts({
      chain: "polygon",
      projectId: project.id,
    });

    setListedNfts(getListedNftsResponse);
  }

  async function loadListedNftsOnSecondaryMarket () {
    const getListedNftsOnSecondaryMarket = await web2Functions.getListedNftsOnSecondaryMarket({
      chain: "polygon",
      projectAddress: project.address
    });

    setListedNftsOnSecondaryMarket(getListedNftsOnSecondaryMarket);
  }

  function goToInventory () {
    router.push("inventory");
  }

  function refreshListedItems () {
    if (project && JSON.stringify(project) != "{}") {
      loadListedNfts();
      loadListedNftsOnSecondaryMarket();
    } else console.error("Project not found.")
  }

  async function connectWithGoogle(credentialResponse) {
    try {
      const { loguedWith, player, sessionToken, tokens, wallets } =
      await xerialWalletViewmodelInstance.login({
        credential: credentialResponse.credential,
        clientId
      });
    } catch (error) {
      console.error(error)
      console.error("Error: Login Failed.");
    }
  }
  
  return (
    <>
      <Head>
        <title>SDK Xerial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="home__buttonsContainer">
          <button className="home__button" onClick={goToInventory}>Go to inventory</button>
          <button className="home__button" onClick={refreshListedItems}>Refresh listed items</button>
          <GoogleLogin
            theme='outline'
            width='335px'
            onSuccess={connectWithGoogle}
          
            onError={() => {
              console.error('Login Failed');
            }}
          />
          {loguedWith && <div>Logued with: {loguedWith}</div>}
          <XerialWallet XerialWalletViewmodel={xerialWalletViewmodelInstance}/>
        </div>
        {project && (
          <div>
            <div>Your project is: {project.name}</div>
            <div>ID: {project.id}</div>
            <div>Description: {project.description}</div>
          </div>
        )}
        <div>
          <h1>Primary Market</h1>
          <div className='home__itemsContainer'>
            {listedNfts && listedNfts.length === 0 ? (
                <div>There are no listed NFTs.</div>
              ) : (
              listedNfts?.map((nft) => {
                return <Item key={nft.id} nft={nft} XerialWalletViewmodel={xerialWalletViewmodelInstance}/>;
              })
            )}
          </div>
          <hr/>
          <hr/>
          <hr/>
          <h1>Secondary market</h1>
          <div className='home__itemsContainer'>
            {listedNftsOnSecondaryMarket && listedNftsOnSecondaryMarket.length === 0 ? (
              <div>There are no listed NFTs.</div>
            ) : (
              listedNftsOnSecondaryMarket?.map((nft) => {
                return <SecondaryMarketItem key={nft.marketItemId} nft={nft} XerialWalletViewmodel={xerialWalletViewmodelInstance}/>
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
