// localStorage can throw (private mode, blocked storage) — never let it break the UI.
export const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value === null ? fallback : JSON.parse(value)
  } catch {
    return fallback
  }
}

export const writeStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}
