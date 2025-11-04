const noopStorage = {
  getItem() {
    return Promise.resolve(null);
  },
  setItem(_key, _value) {
    return Promise.resolve();
  },
  removeItem() {
    return Promise.resolve();
  },
};

const clientStorage = {
  getItem: (key) => 
    Promise.resolve(typeof window !== 'undefined' ? window.localStorage.getItem(key) : null),

  setItem: (key, value) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },

  removeItem: (key) => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

const storage = typeof window !== 'undefined' ? clientStorage : noopStorage;

export default storage;
