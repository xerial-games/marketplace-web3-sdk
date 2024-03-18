# Introduction

Welcome to the `Xerial Marketplace SDK` this repository was essentially created to help developers implement the Xerial Marketplace functions in the personal Marketplaces of each `Game Studio`.

## SDK functions
- [web3](functions/web2/WEB2-FUNCTIONS.md) It's necesary use your MetaMask to use.
- [web2](functions/web3/WEB3-FUNCTIONS.md) This section includes some web3-related functions, but you don't need use MetaMask to use them. Only web2 interaction.

## Important information

- Essential files for implementing `Marketplace` functions can be found in the /utils folder.
- The /pages folder includes some implementation examples.

### Differences between tokenId and tokenTypeId

- `tokenId`: identifies a specific unique NFT within a collection.
- `tokenTypeId`: identifies the type to which that NFT belongs within the same collection.

## Install dependencies

- Using `npm`:

```bash
npm ci
```

## Run project

- Run the development server:

```bash
# with npm
npm run dev
# with yarn
yarn dev
```

- You can now go to this URL in your browser and see your code running locally: `http://localhost:3000`

# Frontend details

The `@` in paths works as a form of remapping, this helps us to use short and precise paths, thus making the code neater.

## Environment variables

To run your project smoothly, you must have the acrode environment variables, as described here at [.env.example](.env.example) we suggest you use the address of our Marketplace contract that we have already deployed on Polygon Test Network `(Mumbai)` and Telos Test Network:

```bash
NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT=0x72e2dbd5A48DdA0151A715aBD82A020e99Cb604b
NEXT_PUBLIC_TELOS_MARKETPLACE_CONTRACT=0x7f5281824A855bcEf5f976170A5e668Ba156Ee14
```

## GitBook documentation

You can find more complete documentation about the Marketplace and ohter interesting services here: [Xerial GitBook docs](https://xerial.gitbook.io/xerial-doc/intro/introduction)

## Wallet interaction

To interact with the `Xerial Wallet` and tokens, you can buy `MATIC` with fiat money through our service.
You can pay with TDC, banks, neobanks and more!

## Blockchain features

1. Fiat payments: we offer users to buy their NFTs through fiat payments without the need to interact with cryptocurrencies, eliminating all the friction.

2. Dynamic NFTs: we provide an interface to allow updating NFTs, this is only done by the `Game Studio`, the player can see if his NFT has changes and can buy the evolution it has had over time.

## Infrastructure partnerships

we focus on speed and security for end-user interaction, that's why we choose the best in the market:

- [Polygon](https://polygon.technology/)
- [AWS](https://aws.amazon.com/)
- [Ramp](https://ramp.com/)

## Contributions ✨

- We appreciate any contribution. If you find a bug or have any suggestions, feel free to open an issue or submit a pull request on [GitHub](https://github.com/xerial-games/marketplace-web3-sdk).

- When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. You can learn more about how you can contribute to this project in the [Contribution Guide](docs/CONTRIBUTING.md).

Thank you for using the Xerial Marketplace SDK! 💫

Made with ❤️ by [Xerial Team](https://github.com/xerial-games)