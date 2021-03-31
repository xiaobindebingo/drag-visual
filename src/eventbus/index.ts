
class Events {
  public events: object;
  constructor() {
    this.events = {};
  }
  
  on = (name, func) => {
    if (this.events[name]) {
      this.events[name].push(func);
    } else {
      this.events[name] = [func];
    }
  }

  emit = (name, args?) => {
    this.events[name] && this.events[name].forEach(func => {
      if(args) {
        func.call(null, ...args);
      }
      else {
        func.call(null,);
      }

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
