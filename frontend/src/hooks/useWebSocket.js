import { useEffect } from 'react';
import webSocketService from '../services/websocketService';

const useWebSocket = (onMessage) => {
    useEffect(() => {
        webSocketService.connect(onMessage);

        return () => {
            webSocketService.disconnect();
        };
    }, [onMessage]);
};

export default useWebSocket;
