const Item = ({ nft }) => {
  return (
    <div className="atom-item__box">
      <h1 className="global-style__textWithDots">Token typeId: {nft.typeId}</h1>
      <h2 className="global-style__textWithDots">Token name: {nft.metadata.name}</h2>
      <img className="atom-item__itemImage" src={nft.metadata.image} alt="nft img" />
      <p className="atom-item__generalText">collectionAddress: {nft.metadata.contract.address}</p>
      <p className="atom-item__generalText">price: {nft.price}</p>
      <button className="atom-item__button" onClick={() => { alert("Buying nft...") }}>Buy</button>
    </div>
  )
}

export default Item;