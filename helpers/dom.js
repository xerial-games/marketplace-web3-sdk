export function DomHelper () {
	const helper = {};
	helper.getDomain = function () {
    if (!globalThis.location) return;
    return globalThis.location.hostname;
  }

	helper.getLoginAttemptIdFromQuery = function () {
    if (!globalThis.location) return;
    const urlParams = new URLSearchParams(globalThis.location.search);
    const loginAttemptId = urlParams.get('login-attempt-id');
    return loginAttemptId;
  }

	return helper;
}