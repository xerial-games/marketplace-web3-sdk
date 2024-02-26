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

To run your project smoothly, you must have the acrode environment variables, as described here at [.env.example](.env.example) we suggest you use the address of our Marketplace and USDC contracts that we have already deployed on Polygon's Test Network `(Mumbai)`:

```bash
NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT=0x729BdBbef17E3DaCC6dD8EB325E1bce40699Ab27
NEXT_PUBLIC_POLYGON_USDC_CONTRACT=0x940fd6321c0fF00BB8459367B953170811711f8B
```

## GitBook documentation

You can find more complete documentation about the Marketplace and ohter interesting services here: [Xerial GitBook docs](https://xerial.gitbook.io/xerial-doc/intro/introduction)

## Wallet interaction

To interact with the `Xerial Wallet` you need to send `MATIC` or `USDC` to your address. At the moment it is manual process.

`Coming soon`: we are in the process of adding payment gateways that allow the user to buy any currency through any `TDC, Banks and/or Neobanks`.

## Blockchain features

1. Gasless Transactions: we use `Paymaster`, `Account Abstraction ERC-4337` and `Gas Tank` to perform transactions and sponsoring the gas of users, with each user having their own Smart Account.

2. Dynamic NFTs: we provide an interface to allow updating NFTs, this is only done by the `Game Studio`, the player can see if his NFT has changes and can buy the evolution it has had over time.

`Coming soon`: we will add `Multichain` purchases with a single sign, i.e. you will be able to make purchases in different chains at the same time wrapped in one sign.

## Infrastructure partnerships

we focus on speed and security for end-user interaction, that's why we choose the best in the market:

- [Biconomy](https://biconomy.io/)
- [Quicknode](https://www.quicknode.com/)
- [AWS](https://aws.amazon.com/)

## Contributions ✨

- We appreciate any contribution. If you find a bug or have any suggestions, feel free to open an issue or submit a pull request on [GitHub](https://github.com/xerial-games/marketplace-web3-sdk).

- When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. You can learn more about how you can contribute to this project in the [Contribution Guide](CONTRIBUTING.md).

Thank you for using the Xerial Marketplace SDK! 💫

Made with ❤️ by [Xerial Team](https://github.com/xerial-games)