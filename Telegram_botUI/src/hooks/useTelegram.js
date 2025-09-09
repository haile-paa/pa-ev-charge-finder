import { useWebApp } from "@vkruglikov/react-telegram-web-app";

export const useTelegram = () => {
  const webApp = useWebApp();

  return {
    themeParams: webApp?.themeParams || {},
    expand: webApp?.expand,
    showPopup: webApp?.showPopup,
    MainButton: webApp?.MainButton,
    BackButton: webApp?.BackButton,
    sendData: webApp?.sendData,
    ready: webApp?.ready,
    initData: webApp?.initData,
    initDataUnsafe: webApp?.initDataUnsafe,
    version: webApp?.version,
    platform: webApp?.platform,
    colorScheme: webApp?.colorScheme,
    themeParams: webApp?.themeParams,
    isExpanded: webApp?.isExpanded,
    viewportHeight: webApp?.viewportHeight,
    viewportStableHeight: webApp?.viewportStableHeight,
    headerColor: webApp?.headerColor,
    backgroundColor: webApp?.backgroundColor,
    setHeaderColor: webApp?.setHeaderColor,
    setBackgroundColor: webApp?.setBackgroundColor,
    enableClosingConfirmation: webApp?.enableClosingConfirmation,
    disableClosingConfirmation: webApp?.disableClosingConfirmation,
    onEvent: webApp?.onEvent,
    offEvent: webApp?.offEvent,
  };
};
