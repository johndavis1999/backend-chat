import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const RETRY_EACH = 1000; // Intervalo en milisegundos entre los "pings"

@WebSocketGateway()
export class UserStatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private channels: Map<string, Set<Socket>> = new Map(); // Mapa de canales y clientes conectados
  private keepAliveIntervals: Map<string, NodeJS.Timeout> = new Map(); // Intervalos para mantener la conexión

  // Gestiona la conexión de un cliente
  handleConnection(client: Socket) {
    const channel = Array.isArray(client.handshake?.query?.channel)
      ? client.handshake.query.channel[0]
      : client.handshake?.query?.channel;

    if (!channel) {
      console.log('No se encontró un canal en la conexión.');
      client.disconnect();
      return;
    }

    console.log(`Cliente conectado: Canal=${channel}, Socket=${client.id}`);

    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }

    this.channels.get(channel)?.add(client);

    // Emitir el estado del usuario al canal correcto SOLO cuando se conecta
    this.server.to(channel).emit('user-status', {
      userId: channel.replace('contact-', ''), // Extrae el ID del canal
      status: 'online',
    });

    // Emitir el estado de conexión general (para monitoreo) solo al cliente conectado
    this.server.emit('connectionStatus', {
      channel,
      status: 'connected',
      socketId: client.id,
    });

    // Mantener la conexión activa con un "ping" periódico
    const interval = setInterval(() => {
      client.emit('keepAlive', client.id);
    }, RETRY_EACH);
    this.keepAliveIntervals.set(client.id, interval);
  }

  // Gestiona la desconexión de un cliente
  handleDisconnect(client: Socket) {
    const channelEntry = Array.from(this.channels.entries()).find(([_, clients]) =>
      clients.has(client),
    );

    if (channelEntry) {
      const [channel, clients] = channelEntry;

      // Eliminar al cliente del conjunto de clientes del canal
      clients.delete(client);

      // Si el canal ya no tiene clientes, eliminarlo del mapa
      if (clients.size === 0) {
        this.channels.delete(channel);
        console.log(`Canal ${channel} eliminado porque ya no tiene clientes.`);
      }

      console.log(`Cliente desconectado: Canal=${channel}, Socket=${client.id}`);

      // Emitir evento 'connectionStatus' para monitoreo general
      this.server.emit('connectionStatus', {
        channel,
        status: 'disconnected',
        socketId: client.id,
      });

      // Limpiar el intervalo de "keep-alive" para el cliente desconectado
      const interval = this.keepAliveIntervals.get(client.id);
      if (interval) {
        console.log(`Limpiando intervalo de keep-alive para el cliente: ${client.id}`);
        clearInterval(interval);
        this.keepAliveIntervals.delete(client.id);
      }
    } else {
      console.log(`El cliente ${client.id} no está en ningún canal conocido.`);
    }
  }

  // Maneja las solicitudes de verificación del estado de un usuario
  @SubscribeMessage('check-user-status')
  handleCheckUserStatus(client: Socket, payload: { userId: string }) {
    const channel = `${payload.userId}`;

    // Verifica si hay clientes en el canal para determinar si el usuario está online
    if (this.channels.has(channel) && this.channels.get(channel)?.size > 0) {
      // Emitir el estado 'online' al cliente que realizó la consulta
      client.emit('user-status', {
        userId: payload.userId,
        status: 'online',
      });
    } else {
      // Emitir el estado 'offline' si no hay clientes conectados al canal
      client.emit('user-status', {
        userId: payload.userId,
        status: 'offline',
      });
    }
  }
}
