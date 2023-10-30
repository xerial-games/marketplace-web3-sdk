import marketplaceFunctions from "../utils/web3_functions/web3_functions";

const { callApi, errorsManager } = require("./call_api_functions");

const connectMetamaskWallet = async function (projectId) {
  try {
    const response = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/create_player_login_attempt`, { projectId });
    const resjson = await errorsManager(response);
    const { loginAttempt } = resjson;
    const { id: loginAttemptId } = loginAttempt;
    if (!loginAttemptId) throw Error("Create login attempt ID failed");
    const { signature, publicKey } = await marketplaceFunctions.signMessageWithLoginAttemptIdWithMetamask(loginAttemptId);
    // console.log("%c"+publicKey, "color: #ff00ff; font-size: 32px", "senderPubKey");
    // console.log(connectedInfo, "conectado"); //pub key and signature
    // console.log("%c"+signature, "color: green", "signature sign in");
    // console.log("%c"+loginAttemptId, "color:blue; font-size:20px");

    const sessionRes = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/create_player_session`, {
      signature: signature,
      loginAttemptId: loginAttemptId,
      address: publicKey,
      network: "polygon",
    });
    const sessionResjson = await errorsManager(sessionRes);
    const { id: loginAttemptIdFromCreateSession } = sessionResjson.loginAttempt;
   
    const responseCommitPlayerLoginAttempt = await callApi(`${process.env.NEXT_PUBLIC_API_HOST}/commit_player_login_attempt`, {
      loginAttemptId: loginAttemptIdFromCreateSession,
    });
    const responseCommitPlayerLoginAttemptJson = await errorsManager(responseCommitPlayerLoginAttempt);
    const { sessionToken } = responseCommitPlayerLoginAttemptJson.session;

    return { publicKey, signature, sessionToken }
  } catch (error) {
    // console.error(error, "this is an error");
    throw new Error(error.message);
  }
}

export default connectMetamaskWallet;