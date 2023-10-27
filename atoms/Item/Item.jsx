import marketplaceFunctions from "@/web3_functions";
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
    const nftPrice = await marketplaceFunctions.getNftPrice(id, collectionAddress);
    setPrice(nftPrice);
  }

  return (
    <div>
      <h1>Token Id: {id}</h1>
      <h2>Token name: {!metadata || !metadata?.metadata ? "loading..." : metadata.metadata.name}</h2>
      <p>collectionAddress: {collectionAddress}</p>
      <p>price: {!price ? "loading..." : price}</p>
      <button onClick={onClickBuyButton}>Buy</button>
    </div>
  )
}

export default Item;