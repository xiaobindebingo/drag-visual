const componentHash = () => {
  const hash = {};
  return {
    register: (key, val) => {
      hash[key] = val;
    },
    getHash: (key?) => {
      if(!key) return hash;
      return hash[key];
    }
  }
}

export default componentHash();