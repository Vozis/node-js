export class Handler {
  static send(payload) {
    return {
      type: "send request",
      payload: `Customer needs ${payload}`,
    };
  }
  static recieve(payload) {
    return {
      type: "recieve request",
      payload: `Customer needs ${payload}`,
    };
  }
  static sign(payload) {
    return {
      type: "sign request",
      payload: `Customer needs ${payload}`,
    };
  }
  static pay() {
    return {
      payload: "Customer needs to pay for the services",
    };
  }
}
