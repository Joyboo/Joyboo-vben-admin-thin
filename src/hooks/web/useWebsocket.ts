import { h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { Space, notification, Button, Input, Avatar } from 'ant-design-vue';
import HeaderImg from '/@/assets/images/header.jpg';
import { useWebSocket, WebSocketOptions } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';
import { getToken } from '/@/utils/auth';
import { useUserStore } from '/@/store/modules/user';
import { isArray, isDef, isFunction } from '/@/utils/is';
import { useMessage, ModalOptionsEx } from '/@/hooks/web/useMessage';
import {
  listenSend,
  setSend,
  listenSendUserMessage,
  setSendUserMesage,
  UserMessageType,
} from '/@/logics/mitt/websocket';
import { deepMerge } from '/@/utils';
import { PageEnum } from '/@/enums/pageEnum';
import { Icon } from '/@/components/Icon';
import { AdminMsgType } from '/@/enums/components';

/**
 * 事件类型，务必与后端对应
 */
export enum Events {
  // 心跳
  EVENT_0 = 'EVENT_0',
  // 通知客户端关闭连接
  EVENT_1 = 'EVENT_1',
  // 更新版本
  EVENT_2 = 'EVENT_2',
  // 设备过多
  // EVENT_3 = 'EVENT_3',
  // 认证失败
  EVENT_4 = 'EVENT_4',
  // 续期token
  EVENT_5 = 'EVENT_5',
  // 给用户推送消息
  EVENT_6 = 'EVENT_6',
  // 更新某些数据
  EVENT_7 = 'EVENT_7',
  // 重新登录
  EVENT_8 = 'EVENT_8',
}

type ResponseType<T = any> = { msg: string; data: T; event: Events };

export function useWebsocket(props?: WebSocketOptions) {
  console.log('[WebSocket] 开始运行');
  const router = useRouter();
  const userStore = useUserStore();
  const { createConfirm, createMessage } = useMessage();

  const { WebSocketUrl = '' } = useGlobSetting();

  const options: WebSocketOptions = {
    autoReconnect: true,
    heartbeat: {
      interval: 10000,
      message: JSON.stringify({ action: 'heartbeat', message: 'ping' }),
    },
    // protocols: ['soap', 'wamp'], todo 自定义
    immediate: true,
    onConnected: (ws) => {
      console.log('[WebSocket] 连接成功 ', ws);
      // 发送一条认证信息，websocket.url一经传入，无法改变，如果token从url传，则无法自动续期，改为在连接后认证
      const auth = { action: 'auth', authorization: getToken() };
      // 断线重连时，如果在客户端断开期间有更新版本，防止客户端又不知道的情况，加上版本号
      // if (isObject(userConfig.sysinfo) && isObject(userConfig.sysinfo.versions)) {
      //   Object.assign(auth, { versions: userConfig.sysinfo.versions });
      // }
      console.log('[WebSocket] 开始认证 ', auth);
      send(JSON.stringify(auth));
    },
    onDisconnected: (ws) => {
      console.log('[WebSocket] 连接断开 ', ws);
    },
    onError: (ws: WebSocket, event: Event) => {
      console.log('[WebSocket] 发生错误 ', ws, event);
    },
    onMessage: (_: WebSocket, event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const { event: cmd } = data;
        if (cmd !== Events.EVENT_0) {
          console.log('[WebSocket] 接收消息 ', data);
        }
        if (isDef(WsCb[cmd]) && isFunction(WsCb[cmd])) {
          WsCb[cmd](data);
        } else {
          console.error(`[WebSocket] 找不到事件: ${cmd}`);
        }
      } catch (err) {
        console.error('[WebSocket] data解析失败：', err);
      }
    },
  };

  const { send, close } = useWebSocket(WebSocketUrl, deepMerge(options, props));

  // ======================================== websocket事件处理
  const WsCb: { [x: string]: Fn } = {
    [Events.EVENT_0]: (_) => {
      // console.log('[WebSocket] 心跳回复：', res);
    },
    [Events.EVENT_1]: close,

    [Events.EVENT_2]: (res: ResponseType<UserMessageType>) => {
      const { refresh = { force: 0, content: '' } } = res.data;
      const refreshForce = refresh.force === 1;
      createConfirm({
        title: () =>
          h(Space, {}, () => [
            h('div', null, '版本更新提示, 来自'),
            h(Avatar, { src: res.data.formAvatar || HeaderImg }),
            h('div', null, res.data.formName),
          ]),
        content: () => refresh.content,
        okText: () => '立即刷新',
        cancelText: () => '稍后刷新',
        closable: !refreshForce, // 是否显示右上角的关闭按钮
        keyboard: !refreshForce, // 是否支持键盘 esc 关闭
        maskClosable: !refreshForce, // 点击蒙层不关闭
        cancelButtonProps: {
          disabled: refreshForce,
        },
        onOk() {
          window.location.reload();
        },
      } as ModalOptionsEx);
    },

    [Events.EVENT_4]: (res: ResponseType) => {
      close();
      userStore.setToken(undefined);
      createConfirm({
        title: () => '认证失败',
        content: () => res.msg,
        onOk() {
          close();
          router.replace(PageEnum.BASE_LOGIN);
        },
      } as ModalOptionsEx);
    },

    [Events.EVENT_5]: (res: ResponseType) => {
      const { token } = res.data;
      userStore.setToken(token);
    },

    [Events.EVENT_6]: (res: ResponseType<UserMessageType>) => {
      const { message = { content: '' }, formId, formName = '', formAvatar = '' } = res.data;
      if (message) {
        const notifyKey = `ws-notify-${Date.now()}`;
        notification.success({
          message: h(Space, {}, () => [
            // h('div', { style: { color: 'rgb(135, 208, 104)' } }, '新消息 '),
            h(Avatar, { src: formAvatar || HeaderImg }),
            h('div', null, formName),
          ]),
          description: message.content,
          icon: h(Icon, {
            icon: 'ant-design:message-outlined',
            size: 25,
            color: 'rgb(135, 208, 104)',
          }),
          btn: h(
            Button,
            {
              // size: 'small',
              type: 'primary',
              onClick: () => {
                // 关闭
                notification.close(notifyKey);
                // 回复
                setSendUserMesage({
                  toId: formId,
                  toName: formName,
                  toAvatar: formAvatar,
                });
              },
            },
            () => '回复',
          ),
          key: notifyKey,
          duration: null,
          placement: 'bottomRight',
        });
      }
    },

    [Events.EVENT_7]: (res: ResponseType) => {
      // updateKey(res.data);
      console.log(res, Events.EVENT_7);
    },

    [Events.EVENT_8]: (res: ResponseType<UserMessageType>) => {
      const { relogin = { force: 0, title: '', content: '' } } = res.data;

      const reloginForce = relogin.force === 1;
      createConfirm({
        title: () =>
          h(Space, {}, () => [
            h('div', null, `${relogin.title || '版本更新提示'}, 来自 `),
            h(Avatar, { src: res.data.formAvatar || HeaderImg }),
            h('div', null, res.data.formName),
          ]),
        content: () => relogin.content,
        okText: () => '重新登录',
        cancelText: () => '稍后重登',
        closable: !reloginForce,
        keyboard: !reloginForce,
        maskClosable: !reloginForce,
        cancelButtonProps: {
          disabled: reloginForce,
        },
        onOk() {
          close();
          userStore.logout(true);
        },
      } as ModalOptionsEx);
    },
  };

  // ======================================== mitt事件处理
  // 监听发送消息
  listenSend((val) => {
    const does = (param: Recordable) => send(JSON.stringify(param));
    if (isArray(val)) {
      val.forEach((item) => does(item));
    } else {
      does(val);
    }
  });

  // 监听单独给玩家发送消息
  listenSendUserMessage((val) => {
    const review = ref('');
    createConfirm({
      width: 500,
      iconType: 'info',
      title: () => '发送消息',
      content: () => {
        return h(Space, { direction: 'vertical', class: ['w-full', 'pr-4'] }, () => [
          h(Space, {}, () => [
            h('div', { style: { color: 'red' } }, '发送给  '),
            h(Avatar, { src: val.toAvatar || HeaderImg }),
            h('div', null, val.toName),
          ]),
          h('div', null, '不会保存您的聊天记录，请放心使用'),
          h(Input.TextArea, {
            rows: 5,
            showCount: true,
            value: review.value,
            'onUpdate:value': (val) => (review.value = val),
          }),
        ]);
      },
      onOk() {
        if (review.value) {
          const { id: formId, realname: formName, avatar: formAvatar } = userStore.getUserInfo;
          setSend({
            class: 'Admin\\Admin',
            action: 'message',
            formId: val.formId || formId,
            formName: val.formName || formName,
            formAvatar: val.formAvatar || formAvatar,
            type: AdminMsgType.Message,
            message: { content: review.value },
            toId: val.toId,
            toName: val.toName,
            toAvatar: val.toAvatar,
          });
          createMessage.success('发送成功');
        }
      },
      onCancel() {
        review.value = '';
      },
    });
  });
}
