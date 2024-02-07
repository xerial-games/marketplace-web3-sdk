import { getApiCodeAndSignCodeWithMetamask } from "@/helpers/web3";
import { SessionHelper } from "@/helpers/session";
import { callApi, errorsManager, callWalletApi } from "@/functions/call_api";
const sessionHelper = new SessionHelper();

const loginWithMetamask = async function ({ projectId }) {
  try {
    const { publicKey, signature } = await getApiCodeAndSignCodeWithMetamask();
    const resAuth = await callWalletApi(
      `${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/metamask`,
      {
        address: publicKey,
        signature,
        projectId,
      },
      {
        method: "POST",
      }
    );
    const resjsonAuth = await errorsManager(resAuth);
    if (resjsonAuth.refresh && resjsonAuth.access) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${resjsonAuth.access.token}`,
        },
      });
      const userResjson = await response.json();
      sessionHelper.setSession({ tokens: resjsonAuth, loguedWith: "metamask" });
      return {
        sessionToken: resjsonAuth.access.token,
        tokens: resjsonAuth,
        player: userResjson.user,
        wallets: userResjson.wallets,
        loguedWith: "metamask",
      };
    } else throw new Error("Auth Tokens Not Found");
  } catch (error) {
    console.error("Error in loginWithMetamask function. Reason: " +  error.message);
  }
};

const loadSession = async function () {
  const sessionData = sessionHelper.getSession();
  if (!sessionData) return;
  const { tokens, loguedWith } = sessionData;
  if (!tokens || !loguedWith) {
    const missingParamsError = "tokens and loguedWith not found in loadSession function"
    console.error(missingParamsError);
    return null;
  };
  if (loguedWith !== "metamask") return null;
  const dateRef = new Date(tokens.access.expires);
  const now = new Date();
  
  if (dateRef < now) {
    return null;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
      method: "GET",
      headers: {
        "Content-Type": "Application/json",
        Authorization: `Bearer ${tokens.access.token}`,
      },
    });

    const userResjson = await response.json();
    if (response.status.toString()[0] != "2") throw userResjson;
    return { loguedWith, player: userResjson.user, sessionToken: tokens.access.token, tokens, wallets: userResjson.wallets };
  } catch (error) {
    console.error("Error in loadSession function. Reason: " +  error.message);
    return null;
  }
}

const logout = async function () {
  const sessionData = sessionHelper.getSession();
  if (!sessionData) {
    console.log("You are not logged in");
    return;
  }
  const refreshToken = sessionData.tokens.refresh.token;
  const raw = JSON.stringify({ refreshToken })
  const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/logout`, {
    method: "POST",
    body: raw,
    headers: {
      "Content-Type": "Application/json"
    }
  });

  if (response.status.toString()[0] != '2') throw new Error("Error to logout");
  sessionHelper.deleteSession();
}

export { loginWithMetamask, loadSession, logout };
