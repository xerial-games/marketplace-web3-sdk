# Xerial Marketplace SDK

This repository was essentially created to help developers implement the `Xerial Marketplace` functions in the personal Marketplaces of each `Game Studios`.

#### SDK functions
- [web3](functions/web2/WEB2-FUNCTIONS.md) It's necesary use your MetaMask to use.
- [web2](functions/web3/WEB3-FUNCTIONS.md) This section includes some web3-related functions, but you don't need use MetaMask to use them. Only web2 interaction.

## Important information

- Essential files for implementing `Marketplace` functions can be found in the /utils folder.
- The /pages folder includes some implementation examples.

# Install dependencies

- Using `npm`:

```bash
npm install
```

- Using `yarn`:

```bash
yarn install
```

## Run project

- Run the development server:

```bash
# with npm
npm run dev
# with yarn
yarn dev
```

## Project dependencies

The following dependency is required for other developers to implement the functionality in their own repositories, by copying and incorporating the functional parts of this repository and installing `ethers` as well. We are currently using this version `"ethers": "5.7"` as it is the stable version at the moment:

- Use the following commmand to install it:
```bash
npm i ethers@5.7
```

## Environment variables

To run your project smoothly, you must have the acrode environment variables, as described here at [.env.example](.env.example) we suggest you use the address of our Marketplace and USDC contracts that we have already deployed on Polygon's Test Network `(Mumbai)`:

```bash
NEXT_PUBLIC_POLYGON_MARKETPLACE_CONTRACT=0x729BdBbef17E3DaCC6dD8EB325E1bce40699Ab27
NEXT_PUBLIC_POLYGON_USDC_CONTRACT=0x940fd6321c0fF00BB8459367B953170811711f8B
```

## Contributions ✨

- We appreciate any contribution. If you find a bug or have any suggestions, feel free to open an issue or submit a pull request on [GitHub](https://github.com/xerial-games/marketplace-web3-sdk).

- When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change. You can learn more about how you can contribute to this project in the [Contribution Guide](CONTRIBUTING.md).

Thank you for using the Xerial Marketplace SDK! 💫

Made with ❤️ by [Xerial Team](https://github.com/xerial-games)