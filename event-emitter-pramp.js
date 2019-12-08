class EventEmitter {
  constructor() {
    // name: [cb, cb2, cb3, ...]
    this.events = {};
  }

  // subscribe
  on(name, cb) {
    if (!this.events[name]) {
      this.events[name] = [];
    }

    this.events[name].push(cb);
  }

  // add to the events and remove itself after its called.
  once(name, cb) {
    const wrappedCB = (...args) => {
      cb(...args);
      this.off(name, cb);
    };

    this.on(name, wrappedCB);
  }

  // Call all the callbacks linked to a name
  emit(name, ...args) {
    if (!this.events[name]) {
      return;
    }

    for (let cb of this.events[name]) {
      cb(...args);
    }
  }

  // unsubscribe callback from the event
  off(name, cb) {
    if (!this.events[name]) {
      return;
    }

    this.events[name] = this.events[name].filter(callback => callback !== cb);
  }
}
// Add your implementation here, and initialize eventEmitter with an actual value;
var eventEmitter = new EventEmitter();

function responseToEvent(msg) {
  console.log(msg);
}

eventEmitter.on("pramp", responseToEvent);
eventEmitter.once("pramp", function(msg) {
  console.log(msg + " just once!");
});
eventEmitter.emit("pramp", "1st", "2nd");
eventEmitter.emit("pramp", "2nd");

eventEmitter.off("pramp", responseToEvent);
eventEmitter.emit("pramp", "3rd");
eventEmitter.emit("pramp", "1st");
