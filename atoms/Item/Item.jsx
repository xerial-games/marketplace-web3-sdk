import web3Functions from "@/utils/web3_functions/web3_functions";
import { useEffect, useState } from "react";

const Item = ({ id, allNftsMetadata, collectionAddress, onClickBuyButton }) => {
  const [metadata, setMetadata] = useState({});
  const [price, setPrice] = useState("");
  useEffect(() => {
    if (allNftsMetadata.length > 0) {
      const result = allNftsMetadata.find((data) => {
        if (data.nftId === id && data.metadata.contract.address === collectionAddress.toLowerCase()) {
          return true
        };
      });

      if (result) {
        setMetadata(result);
      }
    }
  }, [allNftsMetadata]);

  useEffect(() => {
    loadPrice();
  }, []);

  
  async function loadPrice() {
    const nftPrice = await web3Functions.getNftPrice(id, collectionAddress);
    setPrice(nftPrice);
  }

  return (
    <div className="atom-item__box">
      <h1 className="global-style__textWithDots">Token Id: {id}</h1>
      <h2 className="global-style__textWithDots">Token name: {!metadata || !metadata?.metadata ? "loading..." : metadata.metadata.name}</h2>
      <img className="atom-item__itemImage" src={!metadata || !metadata?.metadata ? "" : metadata.metadata.image} alt="nft img" />
      <p className="atom-item__generalText">collectionAddress: {collectionAddress}</p>
      <p className="atom-item__generalText">price: {!price ? "loading..." : price}</p>
      <button className="atom-item__button" onClick={onClickBuyButton}>Buy</button>
    </div>
  )
}

export default Item;