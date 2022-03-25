import { watch } from 'vue';
import { useWebSocket, WebSocketOptions } from '@vueuse/core';
import { useGlobSetting } from '/@/hooks/setting';
import { getToken } from '/@/utils/auth';
import { useMessage, ModalOptionsEx } from '/@/hooks/web/useMessage';
import { useUserStore } from '/@/store/modules/user';
// mitt分发事件
// import {} from '/@/logics/mitt/websocket';
import { deepMerge } from '/@/utils';
import { SessionTimeoutProcessingEnum } from '/@/enums/appEnum';
import projectSetting from '/@/settings/projectSetting';

export enum WsEvent {
  // 关闭连接
  CLOSE = 'event_1',
  // 客户端版本更新
  SYSTEM_VERSION_UPDATE = 'event_2',
  // 踢下线
  KICK = 'event_3',
}

export function useWebsocket(props?: WebSocketOptions) {
  console.log('start run useWebsocket.ts');
  const { createMessage, createConfirm } = useMessage();
  const userStore = useUserStore();

  const { WebSocketUrl } = useGlobSetting();

  const url = `${WebSocketUrl}?authorization=${getToken()}`;
  const options: WebSocketOptions = {
    autoReconnect: true,
    heartbeat: { interval: 5000, message: 'ping' },
    immediate: true,
    onConnected: (ws) => {
      console.log('onConnected ', ws);
    },
    onDisconnected: (ws) => {
      console.log('onDisconnected ', ws);
    },
  };

  const { data, send, close, open } = useWebSocket(url, deepMerge(options, props));

  watch(
    () => data.value,
    (val) => {
      if (val) {
        if (val === 'pong') {
          // 心跳
          return;
        }
        console.log(val, '------ watch data client');
        try {
          const res = JSON.parse(val);
          switch (res.event) {
            case WsEvent.CLOSE:
              createMessage.info(res.message);
              close();
              break;
            case WsEvent.SYSTEM_VERSION_UPDATE:
              const force = res.data.force === 1;
              checkVersionConfirm(!force);
              break;
            case WsEvent.KICK:
              close();
              kick(res.message);
              break;
            default:
              break;
          }
        } catch (error) {
          console.log('json error', error);
        }
      }
    },
  );

  function checkVersionConfirm(force: boolean) {
    // 是否允许其他骚操作来关闭Modal窗口，强制操作的时候禁止
    const disableClose = !force;
    createConfirm({
      title: () => '版本更新提示',
      content: () => (force ? '发现新版本，请刷新后继续使用' : '发现新版本，是否现在刷新？'),
      okText: () => '立即刷新',
      cancelText: () => '稍后刷新',
      closable: disableClose, // 是否显示右上角的关闭按钮
      keyboard: disableClose, // 是否支持键盘 esc 关闭
      maskClosable: disableClose, // 点击蒙层不关闭
      cancelButtonProps: {
        disabled: disableClose,
      },
      onOk() {
        window.location.reload();
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onCancel() {},
    } as ModalOptionsEx);
  }

  function kick(msg) {
    createConfirm({
      title: () => '提示',
      content: () => msg,
      closable: false,
      keyboard: false,
      maskClosable: false,
      okText: () => '确定',
      cancelButtonProps: { disabled: true },
      onOk() {
        userStore.setToken(undefined);
        if (
          projectSetting.sessionTimeoutProcessing === SessionTimeoutProcessingEnum.PAGE_COVERAGE
        ) {
          userStore.setSessionTimeout(true);
        } else {
          userStore.logout(true);
        }
      },
    } as ModalOptionsEx);
  }

  return {
    openWebsocket: open,
    closeWebsocket: close,
    sendWebsocket: send,
  };
}
