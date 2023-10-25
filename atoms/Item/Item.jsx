import { useEffect, useState } from "react";

const Item = ({ id, allNftsMetadata, collectionAddress }) => {
  const [metadata, setMetadata] = useState({});
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

  return (
    <div>
      <h1>Token Id: {id}</h1>
      <h2>Token name: {!metadata ? "loading..." : metadata.metadata.name}</h2>
      <p>collectionAddress: {collectionAddress}</p>
    </div>
  )
}

export default Item;