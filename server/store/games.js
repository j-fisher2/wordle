// convert to centralized DB/KV store for scalability

const store = new Map();

module.exports = {
  get: (key) => store.get(key),
  set: (key, value) => store.set(key, value),
  delete: (key) => store.delete(key),
  has: (key) => store.has(key),
  keys: () => Array.from(store.keys()),
};