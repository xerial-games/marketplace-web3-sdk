### 1 - purchaseNfts:

Allows the player to buy multiple NFTs on the Primary Market.

| Param             | Object                  | Description                                      |
|-------------------|-------------------------|--------------------------------------------------|
| nfts[]            | nft [tokenTypeId,       | The typeId of the NFT.                           |
| chain             | quantity,               | The quantity the player wants to purchase.       |
|                   | collectionAddress,      | The collection address of the NFT.               |
|                   | price]                  | The price of the NFT.                            |

### 2 - purchaseNft:

Allows the player to buy a single NFT on the Primary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| tokenTypeId       | The typeId of the NFT.                           |
| quantity          | The quantity the player wants to purchase.       |
| collectionAddress | The collection address of the NFT.               |
| chain             | The blockchain where the NFT is being purchased. |
| price             | The price of the NFT.                            |

### 3 - secondaryMarketPurchase:

Allows the player to buy NFTs on the Secondary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| marketplaceNftId  | The marketplaceNftId of the NFT to be purchased. |
| chain             | The blockchain where the NFT is being purchased. |
| price             | The price of the NFT to be purchased.            |

### 4 - sellNftOnSecondaryMarket:

Allows the player to list NFT on the Secondary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| collectionAddress | The collection address of the NFT.               |
| tokenId           | The tokenId of the NFT to be listed.             |
| price             | The price of the NFT to be listed.               |
| chain             | The blockchain where the NFT is being purchased. |

### 5 - delistNftOnSecondaryMarket:

Allows the player to delist NFT on the Secondary Market.

| Param             | Description                                      |
|-------------------|--------------------------------------------------|
| marketplaceNftId  | The marketplaceNftId of the NFT to be purchased. |
| chain             | The blockchain where the NFT is being purchased. |