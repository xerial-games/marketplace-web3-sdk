### 1 - getGameStudioCollections:
Obtain the collections from the Game Studio.

| Param     | Description                                             |
|-----------|---------------------------------------------------------|
| projectId | The project ID associated with your project.            |

**Response structure:**
```json
{
  "projectId": "6564b4f3fa203b9Klsa2Ju7d0",
  "project": {
    "address": "0x7d78B5a8b04151E0741875c2d6e3Cb6A82098Ac5",
    "network": "polygon",
    "name": "ProyectM",
    "description": "Desc",
    "category": "MMORPG",
    "tokenName": "",
    "tokenLogo": "",
    "logo": "https:///your_project_image.jpg",
    "trailer": "http://www.google.com",
    "downloadLink": "http://www.google.com",
    "userBanner": "https://your_banner.jpg",
    "domain": "your.domain.example",
    "symbol": "NEZ",
    "socialMedias": {
      "_id": "658c2ae20c24dd5e00161a1a"
    },
    "id": "6564b4f3fa203b9Klsa2Ju7d0"
  },
  "collections": [
    {
      "address": "0x8a63860fF851bb1391a295dF717a3bD210eB2170",
      "name": "Desc",
      "symbol": "123",
      "description": "LL",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
      "externalUrl": "http://external-url.com",
      "chain": "polygon",
      "txHash": "0x11bb4d5fadbb9f6ab1b0d1be1bb50c52a5ac997c495e8e29131629e21774e06a",
      "project": "6564b4f3fa203b9Klsa2Ju7d0",
      "id": "6585de73487f1429cb10bcb9"
    },
    {
      "address": "0x11FF517B5e01fd22148F085FcA04F707d5b6e4DC",
      "name": "DS",
      "symbol": "23",
      "description": "Description",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/2940477b2bead3482008d9be12f37a6b0c4f2372d47104a322be3e7e59f31e18-tanjiro.jpg",
      "externalUrl": "http://external-url.com",
      "chain": "polygon",
      "txHash": "0x83a2d2ec69755693cc98766cd3ac1c9a697beec45aa8496a2bddba3d27ee7f7c",
      "project": "6564b4f3fa203b9Klsa2Ju7d0",
      "id": "6585deb8487f1429cb10bcdc"
    }
  ]
}
```


### 2 - getInventory:

Obtain the user's inventory.

| Param          | Description                                 |
|----------------|---------------------------------------------|
| address        | The address of the user.                    |
| studioAddress  | The address of the Game Studio to get NFTs. |
| chain          | Can be "polygon" or "telos".                |

**Response structure:**
```json
[
  {
    "collection": {
      "id": "6585de73487f1429cb10bcb9",
      "txHash": "0x11bb4d5fadbb9f6ab1b0d1be1bb50c52a5ac997c495e8e29131629e21774e06a"
    },
    "quantity": 1,
    "metadata": {
      "name": "Tanjiro",
      "description": "Desc",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
      "externalUrl": "https://www.google.com",
      "animationUrls": [],
      "attributes": [
        {
          "type": "boost",
          "name": "magical damage",
          "value": "2000"
        }
      ],
      "contract": {
        "address": "0x8a63860fF851bb1391a295dF717a3bD210eB2170",
        "name": "Desc",
        "symbol": "123",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
        "description": "LL",
        "externalUrl": "https://xerial.io/"
      },
      "maxSupply": "3",
      "edition": 1
    },
    "tokens": [
      {
        "0": {
          "type": "BigNumber",
          "hex": "0x01"
        },
        "1": "https://purple-jealous-spoonbill-384.mypinata.cloud/ipfs/QmS2ErVJV7tp9YFGmSVahEjEzP5uzpub6MTRawnXpJDYJc",
        "tokenId": 1,
        "metadataURI": "https://purple-jealous-spoonbill-384.mypinata.cloud/ipfs/QmS2ErVJV7tp9YFGmSVahEjEzP5uzpub6MTRawnXpJDYJc"
      }
    ]
  }
]
```

### 3 - getListedNfts:

Obtain the NFTs listed in the primary market.

| Param       | Description                                           |
|-------------|-------------------------------------------------------|
| projectId   | The project ID associated with your project.          |
| chain       | Can be "polygon" or "telos". 													|

**Response structure:**
```json
[
  {
    "id": "6585de99487f1429cb10bcc8",
    "typeId": 1,
    "supply": 3,
    "price": 1,
    "inSale": true,
    "metadata": {
      "name": "Tanjiro",
      "description": "NFT description",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
      "externalUrl": "https://www.google.com",
      "animationUrls": [],
      "attributes": [
        {
          "type": "boost",
          "name": "magical damage",
          "value": "222"
        }
      ],
      "contract": {
        "address": "0x8a63860fF851bb1391a295dF717a3bD210eB2170",
        "name": "NFT description",
        "symbol": "NZH",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/287b86e8de6d472910015e048b04d08bc4a721aabb3e20651442c3a3c7946f94-anime%20armor.jpg",
        "description": "Contract description",
        "externalUrl": "https://www.youtube.com/"
      },
      "maxSupply": "3",
      "edition": 1
    },
    "mintedTokens": 1
  },
  {
    "id": "6585dedd487f1429cb10bcf1",
    "typeId": 1,
    "supply": 23,
    "price": 1,
    "inSale": true,
    "metadata": {
      "name": "First NFT",
      "description": "Description",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/450ebc6038f65cb00973c284b893eec10c09cde7a1fd05edce21fa06493c9412-nezuko.jpg",
      "externalUrl": "https://www.youtube.com/",
      "animationUrls": [],
      "attributes": [
        {
          "type": "property",
          "name": "armor",
          "value": "200"
        }
      ],
      "contract": {
        "address": "0x11FF517B5e01fd22148F085FcA04F707d5b6e4DC",
        "name": "DS",
        "symbol": "23",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/2940477b2bead3482008d9be12f37a6b0c4f2372d47104a322be3e7e59f31e18-tanjiro.jpg",
        "description": "Contract description.",
        "externalUrl": "https://www.youtube.com/"
      },
      "maxSupply": "23",
      "edition": 1
    },
    "mintedTokens": 0
  }
]

```

### 4 - getListedNftsOnSecondaryMarket

Obtain the NFTs listed in the secondary market.

| Param            | Description                                           |
|------------------|-------------------------------------------------------|
| projectAddress   | The project address associated with your project.     |
| chain            | Can be "polygon" or "telos". 												 |

**Response structure:**

```json
[
  {
    "tokenId": 1,
    "price": 1,
    "seller": "0x7d78B5a8b04151E0741875c2d6e3Cb6A82098Ac5",
    "marketItemId": 38,
    "metadata": {
      "name": "NFt",
      "description": "des",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/46935ee6d252d9510a71cd7452dadcb06aa6ad73433f4c3e642c541c138a436e-game%20banner.jpg",
      "externalUrl": "http://ultra-super-game/dashboard/items/new",
      "animationUrls": [],
      "attributes": [
        {
          "type": "property",
          "name": "Condition",
          "value": "Fairly Worn (FW)"
        },
        {
          "type": "property",
          "name": "Rarity",
          "value": "Legendary"
        }
      ],
      "contract": {
        "address": "0x8007604a4787E127952C275dcAcc0dAEDb2a3B97",
        "name": "collection name",
        "symbol": "cn",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/450ebc6038f65cb00973c284b893eec10c09cde7a1fd05edce21fa06493c9412-nezuko.jpg",
        "description": "collection description",
        "externalUrl": "http://ultra-super-game/dashboard/items/new"
      },
      "maxSupply": "4",
      "edition": 1
    }
  }
]
```

### 5 - getPlayerItemsOnSecondaryMarket

Obtain the specific player NFTs listed in the secondary market.

| Param            | Description                                                            |
|------------------|------------------------------------------------------------------------|
| userAddress      | The address of the user listing NFTs on the secondary market. |
| chain            | Specifies the blockchain network (e.g., "polygon" or "telos").         |

**Response structure:**

```json
[
  {
    "tokenId": 4,
    "price": 1,
    "seller": "0x7d78B5a8b04151E0741875c2d6e3Cb6A82098Ac5",
    "marketItemId": 25,
    "metadata": {
      "name": "One Katowice",
      "description": "This is the description for the One Katowice Sticker Item. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.",
      "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/e5a89abbc880d212f91e051e66e1743c14982e14bd997cf70680e8e6d888e3c1-sticker-01.png",
      "externalUrl": "https://mp-alt.vercel.app/collections/stickers",
      "animationUrls": [],
      "attributes": [
        {
          "type": "property",
          "name": "Condition",
          "value": "Fairly Worn (FW)"
        },
        {
          "type": "property",
          "name": "Rarity",
          "value": "Legendary"
        },
        {
          "type": "property",
          "name": "Pattern",
          "value": "787"
        },
        {
          "type": "property",
          "name": "Float",
          "value": "0.18201123"
        },
        {
          "type": "stat",
          "name": "Rare Stickers",
          "value": "+ $13.2"
        },
        {
          "type": "stat",
          "name": "Rare Float",
          "value": "+ $731.95"
        },
        {
          "type": "stat",
          "name": "AVG Price",
          "value": "$6,785.94"
        }
      ],
      "contract": {
        "address": "0xA091c91B8D36f1D28fF4F0D30E71C9f7BbAd90ec",
        "name": "Stickers",
        "symbol": "stc",
        "image": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/eb784d6ccffe547c4830fdfa623902e3d88e780c7fc22a12e03de6f46aa884f5-stickers.png",
        "description": "This is the parent Stickers collection. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        "externalUrl": "https://mp-alt.vercel.app/collections/stickers"
      },
      "maxSupply": "500",
      "edition": 1
    }
  }
]
```

### 6 - getProjectForDomain:

Obtain information about your project using the configured project domain in the Dashboard.

| Param           | Description                                           |
|-----------------|-------------------------------------------------------|
| projectDomain   | The project domain associated with your project.  		|

**Response structure:**

```json
{
  "project": {
    "id": "6564b4f3fa203b318f65da05",
    "address": "0x7d78B5a8b04151E0741875c2d6e3Cb6A8207jK8a",
    "name": "Special project",
    "description": "Project description",
    "category": "MMORPG",
    "tokenName": "",
    "tokenLogo": "",
    "userBanner": "https://xerial-main-bucket.s3.us-east-1.amazonaws.com/46935ee6d252d9510a71cd7452dadcb06aa6ad73433f4c3e642c541c138a436e-game%20banner.jpg",
    "logo": "https://xerial-main-bucket.s3.amazonaws.com/450ebc6038f65cb00973c284b893eec10c09cde7a1fd05edce21fa06493c9412-nezuko.jpg",
    "trailer": "http://www.google.com",
    "downloadLink": "http://www.google.com",
    "socialMedias": {
      "twitter": "https://twitter.com/xerial",
      "instagram": "https://instagram.com/xerial",
      "discord": "https://discord.gg/r9s9cz",
      "linkedin": "https://linkedin.com/in/xerial",
      "_id": "658c3cc10c24dd5e00161a34"
    },
    "symbol": "SPJ",
    "domain": "xerial.io"
  }
}
```

### 7 - loginWithGoogle:

Obtain all the necessary data for authentication.

| Param           | Description                                                                                                      |
|-----------------|------------------------------------------------------------------------------------------------------------------|
| credential     | The GoogleLogin `credentialResponse.credential`. Image at the bottom.                                             |
| clientId        | The client ID obtained from the Google Cloud Console (https://cloud.google.com/) associated with the credential. |
| projectId       | The project ID associated with your project.                                                                     |

_Function ConnectWithGoogle example applied with React:_

![ConnectWithGoogle function](./images/ConnectWithGoogleFunction.png)

_GoogleLogin import example:_

```js
import { GoogleLogin } from '@react-oauth/google';
```

_Function Applied in GoogleLogin Component example:_

![GoogleLogin Component](./images/GoogleLoginComponent.png)

**Object structure obtained:**

```js
{
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTk2YzQzZTU2YTVhODFlMWMwZDNkMjMiLCJpYXQiOjE3MDUwNzI0NzUsIm9Ka78j6d8a6D7s8927d9ajSnjudsI6ImFjY2VzcyJ9.Hvans4Rycp2m73uF14qGCy-47xHEAHUtcHSE1H2_GhY",
  "tokens": {
    "access": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTk2YzQzZTU2YTVhODFlMWMwZDNkMjMiLCJpYXQiOjE3MDUwNzI0NzUsIm9Ka78j6d8a6D7s8927d9ajSnjudsI6ImFjY2VzcyJ9.Hvans4Rycp2m73uF14qGCy-47xHEAHUtcHSE1H2_GhY",
      "expires": "2024-01-12T17:34:35.725Z"
    },
    "refresh": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTd2AdfQzZTU2YTVhODFlMWMwZDNkMjMiLCJpYXQiOjE3MDUwNzI0D2gaDsaFcCI6MTgyOT4ODQ3NSwidHlwZSI6InJlZnJlc2gifQ.CfjdmCxl7NbIB43dp72B-h2fSvx_olN-GszkwyXt0s",
      "expires": "2027-12-22T15:14:35.726Z"
    }
  },
  "player": {
    "username": "xerial_eri_2023@gmail.com",
    "project": "6564b4f3fa203b318f65da05",
    "id": "6596c43e56a5a81e1c0d3d23"
  },
  "wallets": [
    {
      "user": "6596c43e56a5a81e1c0d3d23",
      "address": "0x0f1366Jac14E17c49D928377D10dA2635A24da22",
      "custodial": true,
      "id": "6596c44056a5a81e1c0d3d26"
    }
  ],
  "loguedWith": "google"
}
```

### 8 - primaryPurchaseWithXerialWallet:

Allows the player to buy NFTs on the Primary Market with Xerial Wallet.

| Param             | Description                                       |
|-------------------|---------------------------------------------------|
| tokenTypeId       | The typeId of the NFT to be purchased.            |
| quantity          | The quantity of NFTs the player wants to purchase.|
| collectionAddress | The collection address of the NFT.                |
| userAddress       | The player's address.                             |
| sessionToken      | The player's sessionToken.                        |

**Response structure:**

```json
{
  "transactionHash": "0x1a9d0af42bca5be340e48843a2f7d540087d04afc19486695642d40c0ac45e11"
}
```

### 9 - secondaryPurchaseWithXerialWallet

Allow the player to buy NFTs on Secondary Market with Xerial Wallet.

| Param             | Description                                       |
|-------------------|---------------------------------------------------|
| marketItemId      | The marketItemId of the NFT to be purchased.      |
| userAddress       | The player's address.                             |
| sessionToken      | The player's sessionToken.                        |

**Response structure:**

```json
{
  "transactionHash": "0x1a9d0af42bca5be340e48843a2f7d540087d04afc19486695642d40c0ac45e11"
}
```

### 10 - delistNftOnSecondaryMarket

Allow the player to delist NFTs on Secondary Market with Xerial Wallet.

| Param             | Description                                       |
|-------------------|---------------------------------------------------|
| marketItemId      | The marketItemId of the NFT to be delisted.       |
| userAddress       | The player's address.                             |
| sessionToken      | The player's sessionToken.                        |

**Response structure:**

```json
{
  "transactionHash": "0x1a9d0af42bca5be340e48843a2f7d540087d04afc19486695642d40c0ac45e11"
}
```

### 11 - listNftOnSecondaryMarket

Allow the player to list NFTs on Secondary Market with Xerial Wallet.

| Param             | Description                                       |
|-------------------|---------------------------------------------------|
| collectionAddress | The collection address of the NFT.                |
| tokenId           | The tokenId of the NFT to be listed.              |
| price             | The price of the NFT to be listed.                |
| userAddress       | The player's address.                             |
| sessionToken      | The player's sessionToken.                        |

**Response structure:**

```json
{
  "transactionHash": "0x1a9d0af42bca5be340e48843a2f7d540087d04afc19486695642d40c0ac45e11"
}
```

### 12 - transferNft

Allow the player to list NFTs on Secondary Market with Xerial Wallet.

| Param             | Description                                            |
|-------------------|--------------------------------------------------------|
| collectionAddress | The collection address of the NFT.                     |
| tokenId           | The tokenId of the NFT to be transferred.              |
| to                | The player address to whom the NFT will be transferred.|
| userAddress       | The player's address.                                  |

**Response structure:**

```json
{
  "transactionHash": "0x1a9d0af42bca5be340e48843a2f7d540087d04afc19486695642d40c0ac45e11"
}
```

### 13 - getMaticBalance

Obtain Matic balance of the specific user.

| Param             | Description                                            |
|-------------------|--------------------------------------------------------|
| userAddress       | The player's address.                                  |

**Response structure:**

```json
"0.053353126320360021"
```