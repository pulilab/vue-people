export const connect = jest.fn();
export const listen = jest.fn().mockImplementation(fn => {
  if (fn) {
    fn();
  }
});
export const close = jest.fn();

const socket = { close };
export const WebSocketBridge = jest.fn().mockImplementation(() => {
  return {
    connect, listen, socket
  };
});
const mock = jest.fn().mockImplementation(() => {
  return { WebSocketBridge, connect, listen, close };
});

export default mock;
