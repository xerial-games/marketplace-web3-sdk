import web3Functions from "@/utils/web3_functions/web3_functions";
import { useEffect, useState } from "react";

const SecondaryMarketItem = ({ nft, XerialWalletViewmodel }) => {
  const [loguedWith, setLoguedWith] = useState("");

  useEffect(() => {
    XerialWalletViewmodel.observer.observe(() => {
      setLoguedWith(XerialWalletViewmodel.loguedWith || "");
    }, []);
  }, []);

  return (
    <form
      className="atom-item__box"
      onSubmit={async (event) => {
        event.preventDefault();
      }}
    >
      <h1 className="global-style__textWithDots">Token typeId: {nft.typeId}</h1>
      <h2 className="global-style__textWithDots">
        Token name: {nft.metadata.name}
      </h2>
      <img
        className="atom-item__itemImage"
        src={nft.metadata.image}
        alt="nft img"
      />
      <p className="atom-item__generalText">
        collectionAddress: {nft.metadata.contract.address}
      </p>
      <p className="atom-item__generalText">supply: 1</p>
      <p className="atom-item__generalText">price: {nft.price}</p>
      <button
        className="atom-item__button"
        onClick={async () => {
          if (loguedWith === "google") {
            await XerialWalletViewmodel.secondaryPurchase({
              marketItemId: nft.marketItemId.toString(),
            });
          } else
            await web3Functions.secondaryMarketPurchase({
              marketplaceNftId: nft.marketItemId.toString(),
            });
        }}
      >
        Buy
      </button>
    </form>
  );
}

export default SecondaryMarketItem;