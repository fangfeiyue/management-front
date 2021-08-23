const namespace = 'manager';

export default {
  setItem(key, val) {
    const storage = this.getStorage();
    storage[key] = val;
    localStorage.setItem(namespace, JSON.stringify(storage));
  },
  getItem(key) {
    this.getStorage()[key];
  },
  getStorage() {
    return JSON.parse(localStorage.getItem(namespace) || '{}');
  },
  clearItem(key) {
    const storage = this.getStorage();
    delete storage[key];
    localStorage.setItem(namespace, JSON.stringify(storage));
  },
  clear() {
    localStorage.clear();
  },
}