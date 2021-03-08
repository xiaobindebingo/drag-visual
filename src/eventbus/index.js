class Events {
  constructor(props) {
    this.events = {};
  }
  
  on = (name, func) => {
    if (this.events[name]) {
      this.events[name].push(func);
    } else {
      this.events[name] = [func];
    }
  }

  emit = (name, args) => {
    this.events[name].forEach(func => {
      func.call(null, ...args);
    })
  }

  once = (name, func) => {
    const wrapFunc = (...args) => {
      func.apply(null, args);
      this.remove(name, wrapFunc);
    }
    this.on(name, wrapFunc);
  }

  remove = (name, func) => {
    this.events[name].filter(item => {
      return item !== func
    })
  }

}

export default new Events();