import { getApiCodeAndSignCodeWithMetamask } from "@/helpers/web3";

const { callApi, errorsManager, callWalletApi } = require("./call_api_functions");

const loginWithMetamask = async function () {
  try {
    const { publicKey, signature } = await getApiCodeAndSignCodeWithMetamask();
    const resAuth = await callWalletApi(
      `${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/metamask`,
      {
        address: publicKey,
        signature,
      },
      {
        method: "POST"
      }
    );
    const resjsonAuth = await errorsManager(resAuth);
    if (resjsonAuth.refresh && resjsonAuth.access) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${resjsonAuth.access.token}`
        }
      });
      const userResjson = await response.json();
      return {
        sessionToken: resjsonAuth.access.token,
        tokens: resjsonAuth,
        player: userResjson.user,
        wallets: userResjson.wallets,
        loguedWith: "metamask",
      };
    } else throw new Error("Auth tokens not found.");
  } catch (error) {
    console.error(error);
  }
}

export default loginWithMetamask;