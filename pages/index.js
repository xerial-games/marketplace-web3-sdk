import Head from 'next/head'
import web3Functions from '@/utils/web3_functions/web3_functions';
import { useEffect, useState } from 'react'
import web2Functions from '@/utils/web2_functions/web2_functions';
import Item from '@/atoms/Item/Item';
import { useRouter } from 'next/router';
import SecondaryMarketItem from '@/atoms/SecondaryMarketItem/SecondaryMarketItem';

export default function Home() {
  const [hostname, setHostname] = useState("");
  const [project, setProject] = useState({});
  const [listedNfts, setListedNfts] = useState([]);
  const [listedNftsOnSecondaryMarket, setListedNftsOnSecondaryMarket] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setHostname(window.location.hostname);
  }, []);

  useEffect(() => {
    if (hostname) {
      load();
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
  
  return (
    <>
      <Head>
        <title>SDK Xerial</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <button onClick={goToInventory}>Go to inventory</button>
        <button onClick={refreshListedItems}>Refresh listed items</button>
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
                return <Item key={nft.id} nft={nft} />;
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
                return <SecondaryMarketItem key={nft.marketItemId} nft={nft}/>
              })
            )}
          </div>
        </div>
      </div>
    </>
  )
}
