const setupKey = "nova.setup.complete";
const passcodeKey = "nova.security.passcodeHash";

export function isSetupComplete() {
  return window.localStorage.getItem(setupKey) === "true" && Boolean(window.localStorage.getItem(passcodeKey));
}

export function completeSetup(passcode: string) {
  window.localStorage.setItem(passcodeKey, hashPasscode(passcode));
  window.localStorage.setItem(setupKey, "true");
}

export function verifyPasscode(passcode: string) {
  return window.localStorage.getItem(passcodeKey) === hashPasscode(passcode);
}

export function updatePasscode(passcode: string) {
  window.localStorage.setItem(passcodeKey, hashPasscode(passcode));
}

export function isValidPasscode(passcode: string) {
  return /^\d{6}$/.test(passcode);
}

function hashPasscode(passcode: string) {
  let hash = 2166136261;

  for (const character of `nova:${passcode}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16);
}
