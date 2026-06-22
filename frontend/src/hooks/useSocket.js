import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';

/**
 * Custom hook to manage a Socket.IO connection.
 * Automatically connects on mount and disconnects on unmount.
 *
 * @param {function} onDishUpdated - Callback called when 'dish:updated' event is received
 * @returns {{ isConnected: boolean }} - connection status (via ref, doesn't cause re-render)
 */
function useSocket(onDishUpdated) {
  const socketRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket.IO disconnected:', reason);
    });

    // Listen for real-time dish updates from the backend
    socket.on('dish:updated', (updatedDish) => {
      console.log('📡 Real-time update received:', updatedDish);
      if (onDishUpdated) {
        onDishUpdated(updatedDish);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []); // only run once

  return socketRef;
}

export default useSocket;
