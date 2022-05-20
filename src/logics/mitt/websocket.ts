import mitt from '/@/utils/mitt';

export type WebScoketMessage = {
  class: string;
  action: string;
} & Recordable;

const emitter = mitt();

// 监听发送websocket消息
const messageKey = Symbol('ws-message');

export function removeMitt() {
  emitter.clear();
}

export function listenSend(callback: Fn<WebScoketMessage | WebScoketMessage[], any>) {
  emitter.on(messageKey, callback);
}

export function setSend(data: WebScoketMessage | WebScoketMessage[]) {
  emitter.emit(messageKey, data);
}
