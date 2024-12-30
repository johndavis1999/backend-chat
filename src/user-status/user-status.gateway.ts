import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

const RETRY_EACH = 30000;  // Intervalo en milisegundos entre los "pings"
const TIMEOUT_DURATION = 10000;  // Tiempo de espera para que el cliente responda con 'keepAlive'

@WebSocketGateway()
export class UserStatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private channels: Map<string, Set<Socket>> = new Map();
  private keepAliveInterval: NodeJS.Timeout;

  // Gestiona la conexión de un cliente
  handleConnection(client: Socket) {
    const channel = Array.isArray(client.handshake?.query?.channel)
      ? client.handshake.query.channel[0]
      : client.handshake?.query?.channel;

    if (!channel) {
      console.log('No se encontró un canal en la conexión.');
      client.disconnect(); // Desconectar si no hay un canal
      return;
    }

    console.log(`Cliente conectado: Canal=${channel}, Socket=${client.id}`);

    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }

    this.channels.get(channel)?.add(client);
    this.server.emit('connectionStatus', { channel, status: 'connected', socketId: client.id });

    // Emitir el evento 'isAvailable' periódicamente
    this.keepAliveInterval = setInterval(() => {
      client.emit('isAvailable');
    }, RETRY_EACH); // Emite cada 30 segundos
  }

  // Gestiona la desconexión de un cliente
  handleDisconnect(client: Socket) {
    const channelEntry = Array.from(this.channels.entries()).find(([_, clients]) =>
      clients.has(client),
    );

    if (channelEntry) {
      const [channel, clients] = channelEntry;
      clients.delete(client);

      if (clients.size === 0) {
        this.channels.delete(channel);
      }

      console.log(`Cliente desconectado: Canal=${channel}, Socket=${client.id}`);
      this.server.emit('connectionStatus', { channel, status: 'disconnected', socketId: client.id });

      // Limpiar intervalo cuando el cliente se desconecta
      clearInterval(this.keepAliveInterval);
    }
  }

  // Maneja el evento keepAlive del cliente
  @SubscribeMessage('keepAlive')
  handleKeepAlive(client: Socket, userUid: string) {
    console.log(`Cliente con userUid ${userUid} está activo`);
    // Puedes actualizar el estado de disponibilidad del cliente si es necesario
  }
}
