import mitt from '/@/utils/mitt';
import { AdminMsgType } from '/@/enums/components';

const emitter = mitt();

export type WebScoketMessage = {
  class: string;
  action: string;
} & Recordable;

export type UserMessageType = {
  // 我是谁
  formId: number;
  formName: string;
  formAvatar?: string;
  // 发给谁
  toId: number | 'all';
  toName: string;
  toAvatar: string;
  // 什么操作
  type: AdminMsgType;
  message?: {
    content: string;
  };
  refresh?: {
    force: 0 | 1;
    content: string;
  };
  relogin?: {
    force: 0 | 1;
    content: string;
  };
};

type PartialUserMessageType = Partial<UserMessageType>;

// 监听发送websocket消息
const messageKey = Symbol('ws-message');
// 一对一发送消息
const userMessageKey = Symbol('ws-user-message');

export function removeMitt() {
  emitter.clear();
}

export function listenSend(callback: Fn) {
  emitter.on(messageKey, callback);
}

export function setSend(data) {
  emitter.emit(messageKey, data);
}

export function listenSendUserMessage(callback: Fn<PartialUserMessageType, any>) {
  emitter.on(userMessageKey, callback);
}

export function setSendUserMesage(data: PartialUserMessageType) {
  emitter.emit(userMessageKey, data);
}
