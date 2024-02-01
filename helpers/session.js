function SessionHelper() {
  const helper = {};

  helper.setSession = function (session) {
    localStorage.setItem("session", JSON.stringify(session));
  };

  helper.getSession = function () {
    const data = localStorage.getItem("session");
    if (!data) return null;
    return JSON.parse(data);
  };

  helper.deleteSession = function () {
    localStorage.removeItem("session");
  }

  return helper;
};

export { SessionHelper };