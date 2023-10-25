import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import styles from '@/styles/Home.module.css'
import marketplaceFunctions from '@/web3_functions'
import { useEffect, useState } from 'react'
import web2Functions from '@/web2_functions'
import Item from '@/atoms/Item/Item'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [items, setItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [allNftsMetadata, setAllNftsMetadata] = useState([]);
  useEffect(() => {
    renderNftsFlowFunction();
    // Muestra la info de un NFT por tokenId y contractAddress. Te menciona si se encuentra listado o no en el marketplace primario.
    // marketplaceFunctions.listings("4", "0x4Ee540daA6ecA698B2dDd25373784594B8f82949");
  }, []);

  useEffect(() => {
    if (items && collections && items.length > 0) {
      web2Functions.loadAllMetadata(items, collections, setAllNftsMetadata);
    }
  }, [items]);

  async function executeAsyncFunctions(fnArray) {
    await Promise.all(
      fnArray.map(async (fn) => {
        await fn();
      })
    );
  }

  const renderNftsFlowFunction = async () => {
    try {
      const collectionsFromGameStudio = await web2Functions.getGameStudioCollections("0xD3A7EF9D79214D5989d9A5AD5BE6604780617d36");
      setCollections(collectionsFromGameStudio.collections);

      const collectionAddresses = collectionsFromGameStudio.collections.map((collection) => collection.collectionAddress);
      if (!collectionAddresses || collectionAddresses.length <= 0) {
        console.error("No se encontraron las collections de este Game Studio");
        return;
      }
      
      const listedNfts = await marketplaceFunctions.getListedNfts(collectionAddresses);
      setItems(listedNfts);
    } catch (error) {
      console.error("Error: ", error.message);
    }
  };

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
          {items?.map((collection) => {
              const collectionAddr = Object.keys(collection)[0];
              const { tokensListedPrimaryMarket, tokensListedSecundaryMarket } = collection[collectionAddr];
              return tokensListedPrimaryMarket?.map((nftId, index) => {
                return (
                  <Item
                    key={index}
                    id={nftId}
                    collectionAddress={collectionAddr}
                    allNftsMetadata={allNftsMetadata}
                    // onClickBuyButton={() => {
                    //   setBuyModalActive(!buyModalActive)
                    // }}
                  />
                );
              })
            })}
            <hr/>
            <hr/>
            <hr/>
            <h2>Secondary market</h2>
            <div>
            {items?.map((collection) => {
              const collectionAddr = Object.keys(collection)[0];
              const { tokensListedPrimaryMarket, tokensListedSecundaryMarket } = collection[collectionAddr];
              return tokensListedSecundaryMarket?.map((nftId, index) => {
                return (
                  <Item
                    key={index}
                    id={nftId}
                    collectionAddress={collectionAddr}
                    allNftsMetadata={allNftsMetadata}
                    // onClickBuyButton={() => {
                    //   setBuyModalActive(!buyModalActive)
                    // }}
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
