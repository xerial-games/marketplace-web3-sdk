import { SessionHelper } from "@/helpers/session";
import { defaultPolygonChainValue, defaultTelosChainValue } from "@/utils/defaultChainValues";

const projectDomain = process.env.NEXT_PUBLIC_PROJECT_DOMAIN;
const sessionHelper = new SessionHelper();

export default function XerialWalletViewmodel(helpers) {
  const vm = {};

  vm.observer = helpers.observer;

  vm.sessionToken = "";
  vm.activeChain = defaultPolygonChainValue;

  vm.setActiveChain = function (newActiveChain) {
    vm.activeChain = newActiveChain;
    vm.observer.notifyAll();
  }

  vm.loadProject = async function () {
    const result = await helpers.getProjectForMarketplace({
      projectDomain: projectDomain
    });
    if (!result.project) throw new Error("Project not found.")
    vm.setProject(result.project);
  }

  vm.setProject = function (newProject) {
    vm.project = newProject;
    vm.observer.notifyAll();
  }

  vm.setSessionToken = function (newSessionToken) {
    vm.sessionToken = newSessionToken;
    vm.observer.notifyAll();
  }

  vm.setTokens = function (newTokens) {
    vm.tokens = newTokens;
    vm.observer.notifyAll();
  }

  vm.setPlayer = function (newPlayer) {
    vm.player = newPlayer;
    vm.observer.notifyAll();
  }

  vm.setWallets = function (newWallets) {
    vm.wallets = newWallets;
    vm.observer.notifyAll();
  }

  // Posible values metamask || google
  vm.setLoguedWith = function (newValue) {
    vm.loguedWith = newValue;
    vm.observer.notifyAll();
  }

  vm.authPlayerRequest = async function ({ token, clientId, projectId }) {
    const raw = JSON.stringify({ token, clientId, projectId });
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/google`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response;
  };

  vm.login = async function ({ credential, clientId }) {
    try {
      if (!vm.project.id) throw new Error("Project not found.")
      const res = await vm.authPlayerRequest({
        token: credential,
        clientId,
        projectId: vm.project.id
      });
      const resjsonAuth = await res.json();
      if (resjsonAuth.refresh && resjsonAuth.access) {
        vm.setSessionToken(resjsonAuth.access.token);
        vm.setTokens(resjsonAuth);
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${vm.sessionToken}`
          },
        });
        const userResjson = await response.json();
        sessionHelper.setSession({ tokens: resjsonAuth, loguedWith: "google" });
        vm.setPlayer(userResjson.user);
        vm.setWallets(userResjson.wallets);
        vm.setLoguedWith("google");
      } else throw new Error("Auth player failed")
    } catch (error) {
      console.error("Error: Login Failed");
      console.error("Error in login function. Reason: " +  error.message);
      throw new Error("Error to login");
    }
  }

  vm.loadSession = async function () {
    try {
      const sessionResponse = sessionHelper.getSession();
      if (!sessionResponse) return;
      const { tokens, loguedWith } = sessionResponse;
      if (!tokens || !loguedWith) {
        const missingParamsError = "please send tokens and loguedWith params for chargeSession function."
        console.error(missingParamsError);
        throw new Error(missingParamsError);
      };
      if (loguedWith !== "google") return;

      const dateRef = new Date(tokens.access.expires);
      const now = new Date();
      
      if (dateRef < now) {
        sessionHelper.deleteSession();
        return null;
      }
      
      vm.setSessionToken(tokens.access.token);
      vm.setTokens(tokens);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`,
        {
          method: "GET",
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${vm.sessionToken}`,
          },
        }
      );
      const userResjson = await response.json();
      if (response.status.toString()[0] != "2") throw userResjson;
      vm.setPlayer(userResjson.user);
      vm.setWallets(userResjson.wallets);
      vm.setLoguedWith(loguedWith);
    } catch (error) {
      console.error("Error in load session function. Reason: " +  error.message);
      return null;
    }
  }

  vm.authenticateWithGoogleAndGetTokens = async function ({ credential, clientId }) {
    try {
      const loginAttemptId = helpers.dom.getLoginAttemptIdFromQuery();
      if (!loginAttemptId) throw new Error("Login attempt id not found in URL.");
      const res = await vm.authPlayerRequest({
        token: credential,
        clientId,
      });
      const resjson = await res.json();
      if (resjson.refresh && resjson.access) {
        const raw = JSON.stringify({ refreshToken: resjson.refresh.token, accessToken: resjson.access.token });
        const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/login-attempt/${loginAttemptId}/set-session`, {
          method: "POST",
          body: raw,
          headers: {
            "Content-Type": "Application/json",
          }
        });

        if (response.status === 204) console.log("Set session done.");
        vm.logued = true;
        vm.observer.notifyAll();
      } else throw new Error("Error to login.");
    } catch (error) {
      console.error("Error in authenticateWithGoogleAndGetTokens function. Reason: " +  error.message);
    }
  }

  vm.authenticateWithMetamaskAndGetTokens = async function ({ credential, clientId }) {
    try {
      const loginAttemptId = helpers.dom.getLoginAttemptIdFromQuery();
      if (!loginAttemptId) throw new Error("Login attempt id not found in URL.");
      const { publicKey, signature } = await helpers.web3.getApiCodeAndSignCodeWithMetamask();
      const raw = JSON.stringify({ address: publicKey, signature });
      const resAuth = await fetch(
        `${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/metamask`,
        {
          method: "POST",
          body: raw,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resjsonAuth = await resAuth.json();
      if (resjsonAuth.refresh && resjsonAuth.access) {
        const raw = JSON.stringify({ refreshToken: resjsonAuth.refresh.token, accessToken: resjsonAuth.access.token });
        const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/login-attempt/${loginAttemptId}/set-session`, {
          method: "POST",
          body: raw,
          headers: {
            "Content-Type": "Application/json",
          }
        });

        const sessionResponseJson = await response.json();
      } else throw new Error("Error to login.");
    } catch (error) {
      console.error("Error in authenticateWithMetamaskAndGetTokens function. Reason: " +  error.message);
    }
  }

  vm.logout = async function () {
    const refreshToken = vm.tokens.refresh.token;
    const raw = JSON.stringify({ refreshToken })
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/logout`, {
      method: "POST",
      body: raw,
      headers: {
        "Content-Type": "Application/json"
      }
    });
    if (response.status.toString()[0] != '2') throw new Error("Error to logout.");
    sessionHelper.deleteSession();
    vm.setSessionToken("");
    vm.setLoguedWith("");
    vm.setTokens({});
    vm.setPlayer({});
    vm.setWallets([]);
    vm.setInventory([]);
  }

  vm.loadCollections = async function (studioAddress) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/get_venly_collections_from_project`, {
      method: "POST",
      body: JSON.stringify({
        studioAddress
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
  
    const resjson = await response.json();
    vm.setCollections(resjson.collections);
  }

  vm.getNftMetadata = async function (tokenId, collectionId) {
    if (collectionId) {
      return fetch(`${process.env.NEXT_PUBLIC_API_HOST}/get_nft_metadata`, {
        method: "POST",
        body: JSON.stringify(
          {
            collectionId,
            nftId: tokenId
          }
        ),
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then((res) => {
          if (res.status.toString()[0] != '2') throw res.json();
          return res.json();
        })
        .then((resjson) => resjson);
    }
    return null;
  }
  
  vm.loadInventory = async function () {
    const userAddress = vm.getUserAddress({ chain: vm.activeChain });
    if (!userAddress) throw new Error("User wallet not found.");
    if (!vm.project.address) throw new Error("Project not found.");
    vm.loadingNfts = true;
    vm.observer.notifyAll();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/get_inventory`, {
      method: "POST",
      body: JSON.stringify({
        studioAddress: vm.project.address,
        address: userAddress,
        chain: "polygon"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const resjson = await response.json();
    if (resjson) {
      vm.setInventory(resjson);
    } else throw new Error("Error to get inventory");
    vm.loadingNfts = false;
    vm.observer.notifyAll();
  }

  vm.setCollections = function (newCollections) {
    vm.collections = newCollections;
    vm.observer.notifyAll();
  }

  vm.setInventory = function (newInventory) {
    vm.inventory = newInventory;
    vm.observer.notifyAll();
  }  

  vm.loginWithMetamask = async function () {
    try {
      const { publicKey, signature } = await helpers.web3.getApiCodeAndSignCodeWithMetamask();
      const raw = JSON.stringify({ address: publicKey, signature, projectId: vm.project.id });
      const resAuth = await fetch(
        `${process.env.NEXT_PUBLIC_WALLET_API_HOST}/auth/metamask`,
        {
          method: "POST",
          body: raw,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const resjsonAuth = await resAuth.json();
      if (resjsonAuth.refresh && resjsonAuth.access) {
        vm.setSessionToken(resjsonAuth.access.token);
        vm.setTokens(resjsonAuth);
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/user`, {
          method: "GET",
          headers: {
            "Content-Type": "Application/json",
            Authorization: `Bearer ${vm.sessionToken}`
          }
        });
        const userResjson = await response.json();
        vm.setPlayer(userResjson.user);
        vm.setWallets(userResjson.wallets);
        vm.setLoguedWith("metamask");
      } else throw new Error("Auth tokens not found.");
    } catch (error) {
      console.error("Error in loginWithMetamask function. Reason: " +  error.message);
    }
  }

  vm.loadMaticBalance = async function () {
    vm.loadingBalance = true;
    vm.observer.notifyAll();
    const userAddress = vm.getUserAddress({ chain: vm.activeChain });
    if (!userAddress) throw new Error("User wallet not found.");
    const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/${vm.activeChain}/eth`);
    const resjson = await response.json();
    if (!resjson.balance) throw new Error("Error to get matic balance.");
    vm.setMatic(Number(resjson.balance));
    vm.loadingBalance = false;
    vm.observer.notifyAll();
  }

  vm.loadUsdcBalance = async function () {
    vm.loadingBalance = true;
    vm.observer.notifyAll();
    const userAddress = vm.getUserAddress({ chain: vm.activeChain });
    if (!userAddress) throw new Error("User wallet not found.");

    const resTokens = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/tokens`);
    const resjsonTokens = await resTokens.json();
    if (!resjsonTokens.balances) throw new Error("Error to get USDC balance.");
    vm.setUsdc(Number(resjsonTokens.balances.usdc));
    vm.loadingBalance = false;
    vm.observer.notifyAll();
  }

  vm.setMatic = function (newBalance) {
    vm.matic =  newBalance;
    vm.observer.notifyAll();
  }

  vm.setUsdc = function (newBalance) {
    vm.usdc = newBalance;
    vm.observer.notifyAll();
  }

  vm.transferNft = async function ({ collectionAddress, tokenId, to }) {
    try {
      const userAddress = vm.getUserAddress({ chain: vm.activeChain });
      if (!userAddress) throw new Error("User wallet not found.");
      vm.loading = true;
      vm.loadingMessage = "Transferring your asset";
      vm.observer.notifyAll();
      const raw = JSON.stringify({ collectionAddress, tokenId, to});
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/transfer-nft`, {
        method: "POST",
        body: raw,
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${vm.sessionToken}`
        }
      });
      if (response.status.toString()[0] != '2') throw response;
      vm.loading = false;
      vm.loadingMessage = "";
      vm.setTransferedNft(true);
      vm.observer.notifyAll();
      return response;
    } catch (error) {
      vm.loading = false;
      vm.loadingMessage = "";
      vm.setErrorMessageModal("Error to transfer nft. Please try again later");
      console.error("Error in transferNft function. Reason: " +  error.message);
      vm.observer.notifyAll();
    }
  }

  vm.setTransferedNft = function (boolean) {
    vm.transferedNft = boolean;
    vm.observer.notifyAll();
  }

  vm.listNft = async function ({ collectionAddress, tokenId, price }) {
    try {
      const userAddress = vm.getUserAddress({ chain: vm.activeChain });
      if (!userAddress) throw new Error("User wallet not found.");
      vm.loading = true;
      vm.loadingMessage = "Publishing your asset";
      vm.observer.notifyAll();
      const raw = JSON.stringify({ collectionAddress, tokenId, price});
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/list-nft`, {
        method: "POST",
        body: raw,
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${vm.sessionToken}`
        }
      });
      if (response.status.toString()[0] != '2') throw response;
      vm.loading = false;
      vm.loadingMessage = "";
      vm.setListedNft(true);
      vm.observer.notifyAll();
      return response;
    } catch (error) {
      vm.loading = false;
      vm.loadingMessage = "";
      vm.setErrorMessageModal("Your asset could not be published. Please try again later");
      console.error("Error in listNft function. Reason: " +  error.message);
      vm.observer.notifyAll();
      console.error("List nft failed.");
    }
  }

  vm.setListedNft = function (boolean) {
    if (typeof boolean !== "boolean") throw new Error("setListedNft failed. Param isn't a boolean.");
    vm.listedNft = boolean;
    vm.observer.notifyAll();
  }

  vm.delist = async function ({ marketItemId }) {
    try {
      const userAddress = vm.getUserAddress({ chain: vm.activeChain });
      if (!userAddress) throw new Error("User wallet not found.");
      vm.loading = true;
      vm.loadingMessage = "Delisting your asset";
      vm.observer.notifyAll();
      const raw = JSON.stringify({ marketItemId });
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/delist-nft`, {
        method: "POST",
        body: raw,
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${vm.sessionToken}`
        }
      });
      if (response.status.toString()[0] != '2') throw response;
      vm.loading = false;
      vm.loadingMessage = "";
      vm.setDelistedNft(true);
      vm.observer.notifyAll();
      return response;
    } catch (error) {
      vm.loading = false;
      vm.loadingMessage = "";
      vm.setErrorMessageModal("Your asset could not be delisted. Please try again later");
      vm.observer.notifyAll();
      console.error("Error in delist function. Reason: " +  error.message);
    }
  }

  vm.setDelistedNft = function (boolean) {
    if (typeof boolean !== "boolean") throw new Error("setListedNft failed. Param isn't a boolean.");
    vm.delistedNft = boolean;
    vm.observer.notifyAll();
  }

  vm.setErrorMessageModal = function (message) {
    vm.errorMessageModal = message;
    vm.observer.notifyAll();
  }

  vm.purchaseNfts = async function ({ tokenTypeId, quantity, collectionAddress }) {
    try {
      const userAddress = vm.getUserAddress({ chain: vm.activeChain });
      if (!userAddress) throw new Error("User wallet not found.");
      vm.loading = true;
      vm.loadingMessage = "Purchasing NFT";
      vm.observer.notifyAll();
      const raw = JSON.stringify({ purchases: [{ typeId: tokenTypeId, quantity, collectionAddress }] });
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/primary-purchase`, {
        method: "POST",
        body: raw,
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${vm.sessionToken}`
        }
      });
      if (response.status.toString()[0] != '2') throw response;
      const resjson = await response.json();
      vm.loading = false;
      vm.loadingMessage = "";
      vm.observer.notifyAll();
      return resjson;
    } catch (error) {
      vm.loading = false;
      vm.loadingMessage = "";
      vm.observer.notifyAll();
      console.error("Error in purchaseNfts function. Reason: " +  error.message);
    }
  }

  vm.secondaryPurchase = async function ({ marketItemId }) {
    try {
      const userAddress = vm.getUserAddress({ chain: vm.activeChain });
      if (!userAddress) throw new Error("User wallet not found.");
      vm.loading = true;
      vm.loadingMessage = "Purchasing NFT";
      vm.observer.notifyAll();
      const raw = JSON.stringify({ marketItemId });
      const response = await fetch(`${process.env.NEXT_PUBLIC_WALLET_API_HOST}/wallet/${userAddress}/polygon/secondary-purchase`, {
        method: "POST",
        body: raw,
        headers: {
          "Content-Type": "Application/json",
          Authorization: `Bearer ${vm.sessionToken}`
        }
      });
      if (response.status.toString()[0] != '2') throw response;
      const resjson = await response.json();
      vm.loading = false;
      vm.loadingMessage = "";
      vm.observer.notifyAll();
      return resjson;
    } catch (error) {
      vm.loading = false;
      vm.loadingMessage = "";
      vm.observer.notifyAll();
      console.error("Error in secondaryPurchase function. Reason: " +  error.message);
    }
  }

  vm.loadPlayerItemsOnSecondaryMarket = async function ({ chain }) {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/get_market_items`;
    const raw = JSON.stringify({
      seller: vm.getUserAddress({ chain: vm.activeChain }),
      chain,
      studioAddress: vm.project.address
    });
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: raw
    });
    const resjson = await response.json();
    vm.setPlayerItemsOnSecondaryMarket(resjson);
  }

  vm.setPlayerItemsOnSecondaryMarket = function (newPlayerItemsOnSecondaryMarket) {
    vm.newPlayerItemsOnSecondaryMarket = newPlayerItemsOnSecondaryMarket;
    vm.observer.notifyAll();
  }

  vm.restartViewmodel = function () {
    vm.setSessionToken("");
    vm.setLoguedWith(null);
    vm.setTokens({});
    vm.setPlayer({});
    vm.setWallets([]);
    vm.setInventory([]);
    vm.setCollections([]);
    vm.setPlayerItemsOnSecondaryMarket([]);
    vm.setDelistedNft(false);
    vm.setTransferedNft(false);
    vm.setErrorMessageModal("");
    vm.setPlayer({});
    vm.setUsdc(null);
    vm.setMatic(null);
  }

  vm.getUserAddress = function ({ chain }) {
    if (chain === defaultPolygonChainValue && vm.loguedWith === "metamask") return vm.wallets[0].address;
    if (chain === defaultPolygonChainValue) return vm.wallets[0].smartAccount;
    if (chain === defaultTelosChainValue) return vm.wallets[0].address;
    return null;
  }

  return vm;
};