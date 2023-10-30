### 1 - changeTokenPrices:
Enables you to modify token prices within the marketplace.

### 2 - delistNft:
Allows you to remove a token from the marketplace.

### 3 - getListedNfts:
Retrieve the tokens listed in the primary and secondary marketplaces.

**Example:**

```json
[
    {
        <!-- Collection address -->
        "0x89fDe0eF0d26469406544f2e162B13d5813e660F": {
            "tokensListedPrimaryMarket": [],
            "tokensListedSecundaryMarket": []
        }
    },
    {
        <!-- Collection Address -->
        "0xC5008C17dc337500A59a7999818a07f2F98CF744": {
            "tokensListedPrimaryMarket": [
                <!-- tokenIds -->
                "4",
                "2"
            ],
            "tokensListedSecundaryMarket": []
        }
    }
]
```

4 - getNftPrice:
Retrieve and return the price of an NFT.
Examples:

* 1
* 2
* 100
* 150

### 5 - loadListedNftsOnSecondaryMarket: retrieve token listeds in the secondary market.
**Example:**

```json
[
    {  
        <!-- Collection address -->
        "0x4Ee540daA6ecA698B2dDd25373784594B8f82949": {
            "tokensListedSecondaryMarket": [
                <!-- tokenIds -->
                "5"
            ]
        }
    },
    {
        "0x69d15af4AbdEE837462A05c71Ba1466033dcE6d6": {
            "tokensListedSecondaryMarket": []
        }
    },
    {
        "0xf561bD83E7f49Ef6bFD9704e258Ee34f5b83026b": {
            "tokensListedSecondaryMarket": []
        }
    },
]
```

### 6 - listings:
Retrieve specific information about a token listing.
**Example:**

```json
[
    <!-- listed in the marketplace -->
    listed: true,
    owner: "0x556139fBB639d5716F76489988cD22f794920e76",
    price: {
    "type": "BigNumber",
    "hex": "0x05f5e100"
    },
    <!-- listed in primary market. Posible values: true || false -->
    primarySale: false
]
```

### 7 - purchaseNft:
Allows you to buy an NFT.

### 8 - sellNft:
Allows you to sell an NFT.

### 9 - signMessageWithLoginAttemptIdWithMetamask:
Allows you to sign any loginAttemptId with metamask and return you publicKey and signature.
**Example:**

```json
{
    <!-- The address of the user who signs the message. -->
    publicKey,
    <!-- The signature of the user who signs the message. -->
    signature
}
```