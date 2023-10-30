import Head from 'next/head'
import web3Functions from '@/utils/web3_functions/web3_functions';
import { useEffect, useState } from 'react'
import web2Functions from '@/utils/web2_functions/web2_functions';
import Item from '@/atoms/Item/Item';

export default function Home() {
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [allNftsMetadata, setAllNftsMetadata] = useState([]);
  useEffect(() => {
    renderNftsFlowFunction();
  }, []);

  useEffect(() => {
    if (items && collections && items.length > 0) {
      web2Functions.loadAllMetadata(items, collections, setAllNftsMetadata);
    }
  }, [items]);

  useEffect(() => {
    
  }, [collections, items])

  async function executeAsyncFunctions(fnArray) {
    await Promise.all(
      fnArray.map(async (fn) => {
        await fn();
      })
    );
  }

  const renderNftsFlowFunction = async () => {
    try {
      const collectionsFromGameStudio = await web2Functions.getGameStudioCollections(process.env.NEXT_PUBLIC_STUDIO_ADDRESS);
      setCollections(collectionsFromGameStudio.collections);
      const collectionAddresses = collectionsFromGameStudio.collections.map((collection) => collection.collectionAddress);
      if (!collectionAddresses || collectionAddresses.length <= 0) {
        console.error("No se encontraron las collections de este Game Studio");
        return;
      }
      
      const listedNfts = await web3Functions.getListedNfts(collectionAddresses);
      setItems(listedNfts);
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

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
        <div>
          <h1>Primary Market</h1>
          <div className='home__itemsContainer'>
            {items?.map((collection) => {
              const collectionAddress = Object.keys(collection)[0];
              const { tokensListedPrimaryMarket, tokensListedSecundaryMarket } = collection[collectionAddress];
              return tokensListedPrimaryMarket?.map((nftId, index) => {
                return (
                  <Item
                    key={index}
                    id={nftId}
                    collectionAddress={collectionAddress}
                    allNftsMetadata={allNftsMetadata}
                    onClickBuyButton={async () => {
                      await purchaseNft(nftId, collectionAddress, "primary");
                    }}
                  />
                );
              })
            })}
          </div>
          <hr/>
          <hr/>
          <hr/>
          <h1>Secondary market</h1>
          <div className='home__itemsContainer'>
            {items?.map((collection) => {
              const collectionAddress = Object.keys(collection)[0];
              const { tokensListedPrimaryMarket, tokensListedSecundaryMarket } = collection[collectionAddress];
              return tokensListedSecundaryMarket?.map((nftId, index) => {
                return (
                  <Item
                    key={index}
                    id={nftId}
                    collectionAddress={collectionAddress}
                    allNftsMetadata={allNftsMetadata}
                    onClickBuyButton={async () => {
                      await purchaseNft(nftId, collectionAddress, "secondary")
                    }}
                  />
                );
              })
            })}
          </div>
        </div>
      </div>
    </>
  )
}
