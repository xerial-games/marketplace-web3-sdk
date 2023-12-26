import Head from 'next/head'
import web3Functions from '@/utils/web3_functions/web3_functions';
import { useEffect, useState } from 'react'
import web2Functions from '@/utils/web2_functions/web2_functions';
import Item from '@/atoms/Item/Item';

export default function Home() {
  const [hostname, setHostname] = useState("");
  const [project, setProject] = useState({});
  const [listedNfts, setListedNfts] = useState([]);

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
    }
  }, [project]);

  async function load () {
    const getProjectForDomainResponse = await web2Functions.getProjectForDomain(hostname);
    setProject(getProjectForDomainResponse.project);
  }

  async function loadListedNfts () {
    const getListedNftsResponse = await web2Functions.getListedNfts({
      chain: "polygon",
      projectId: project.id,
    });

    setListedNfts(getListedNftsResponse);
  }

  // marketCategory need values: primary || secondary
  async function purchaseNft (tokenId, collectionAddress, marketCategory) {
    try {
      await web3Functions.purchaseNft(tokenId, collectionAddress, marketCategory);
      alert("NFT purchased.")
    } catch (error) {
      console.error(error.message);
      // console.error("Error: Failed to purchase NFT.")
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
            {listedNfts?.map((nft) => {
              return <Item key={nft.id} nft={nft} />;
            })}
          </div>
          <hr/>
          <hr/>
          <hr/>
          <h1>Secondary market</h1>
          <div className='home__itemsContainer'>
            
          </div>
        </div>
      </div>
    </>
  )
}
