import mitt from '/@/utils/mitt';

export type WebScoketMessage = {
  class: string;
  action: string;
} & Recordable;

export type UserMessageType = {
  // 我是谁
  formId: number;
  // 我叫啥
  formName: string;
  // 发给谁
  toId: number;
  // 他叫啥
  toName: string;
  // 发什么
  message: string;
};

type PartialUserMessageType = Partial<UserMessageType>;

const emitter = mitt();

// 监听发送websocket消息
const messageKey = Symbol('ws-message');
// 一对一发送消息
const userMessageKey = Symbol('ws-user-message');

export function removeMitt() {
  emitter.clear();
}

export function listenSend(callback: Fn<WebScoketMessage | WebScoketMessage[], any>) {
  emitter.on(messageKey, callback);
}

export function setSend(data: WebScoketMessage | WebScoketMessage[]) {
  emitter.emit(messageKey, data);
}

export function listenSendUserMessage(callback: Fn<PartialUserMessageType, any>) {
  emitter.on(userMessageKey, callback);
}

export function setSendUserMesage(data: PartialUserMessageType) {
  emitter.emit(userMessageKey, data);
}
