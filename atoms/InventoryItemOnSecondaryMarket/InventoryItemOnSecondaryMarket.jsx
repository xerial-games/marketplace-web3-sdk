import web3Functions from "@/functions/web3/web3";
import getActiveCurrency from "@/utils/getActiveCurrency";
import toastNotify from "@/utils/toastNotify";

const InventoryItemOnSecondaryMarket = ({ nft, activeChain }) => {
  async function onDelistNft() {
    try {
      await web3Functions.delistNftOnSecondaryMarket({ marketplaceNftId: nft.marketItemId, chain: activeChain });
    } catch (error) {
      console.error(error.message);
      toastNotify("Error: Delist NFT Failed", "error");
    }
  }

  return (
    <div className="inventory-items__container">
      <div className="inventory-items__projectContainer">
        <img src={nft.metadata.image} alt={nft.metadata.name} className="inventory-items__image" />
        <h1>Nft market itemId: {nft.marketItemId}</h1>
        <h2>NFT name: {nft.metadata.name}</h2>
        <p>collection address: {nft.metadata.contract.address}</p>
        <p>collection name: {nft.metadata.contract.name}</p>
        <p className="atom-item__generalText atom-item__priceMagenta">Price: {nft.price} {getActiveCurrency(activeChain)}</p>
      </div>
      <button className="inventory-items__buttonSell" type="submit" onClick={onDelistNft}>
        Delist
      </button>
    </div>
  );
};

export default InventoryItemOnSecondaryMarket;
