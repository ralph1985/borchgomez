const UNLOCKED_STORAGE_KEY = "borjaDevToolsUnlocked";
const ENABLED_STORAGE_KEY = "borjaDevToolsEnabled";
const REQUIRED_FOOTER_CLICKS = 10;
const CLICK_SEQUENCE_TIMEOUT = 4000;

export function initDevTools() {
  const footer = document.querySelector(".footer");
  const menuItem = document.querySelector("[data-dev-tools-menu-item]");
  const toggle = document.querySelector("[data-dev-tools-toggle]");

  if (!(toggle instanceof HTMLButtonElement)) return;

  let clickCount = 0;
  let resetTimer = 0;

  function readStoredBoolean(key) {
    try {
      return window.localStorage.getItem(key) === "true";
    } catch {
      return false;
    }
  }

  function writeStoredBoolean(key, value) {
    try {
      window.localStorage.setItem(key, String(value));
    } catch {
      // Storage can be unavailable in private or locked-down browsing modes.
    }
  }

  function isUnlocked() {
    return readStoredBoolean(UNLOCKED_STORAGE_KEY);
  }

  function isEnabled() {
    return isUnlocked() && readStoredBoolean(ENABLED_STORAGE_KEY);
  }

  function setMenuUnlocked(unlocked) {
    if (menuItem instanceof HTMLElement) {
      menuItem.hidden = !unlocked;
    }

    document.documentElement.classList.toggle("dev-tools-unlocked", unlocked);
  }

  function setEnabled(enabled) {
    const nextEnabled = isUnlocked() && enabled;

    writeStoredBoolean(ENABLED_STORAGE_KEY, nextEnabled);
    document.documentElement.classList.toggle("dev-tools-enabled", nextEnabled);
    toggle.setAttribute("aria-pressed", String(nextEnabled));
  }

  function unlock() {
    writeStoredBoolean(UNLOCKED_STORAGE_KEY, true);
    setMenuUnlocked(true);
  }

  function resetClickSequence() {
    clickCount = 0;
    window.clearTimeout(resetTimer);
    resetTimer = 0;
  }

  setMenuUnlocked(isUnlocked());
  setEnabled(isEnabled());

  toggle.addEventListener("click", () => {
    setEnabled(!isEnabled());
  });

  if (!(footer instanceof HTMLElement)) return;

  footer.addEventListener("click", () => {
    window.clearTimeout(resetTimer);
    clickCount += 1;

    if (clickCount >= REQUIRED_FOOTER_CLICKS) {
      unlock();
      resetClickSequence();
      return;
    }

    resetTimer = window.setTimeout(resetClickSequence, CLICK_SEQUENCE_TIMEOUT);
  });
}
