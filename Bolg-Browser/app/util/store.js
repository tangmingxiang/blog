export default {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get(key) {
    let value = localStorage.getItem(key)
    if(!value){
      return value
    }
    value = value.slice(1, value.length - 1)
    return value
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  clear(){
    localStorage.clear()
  }
}