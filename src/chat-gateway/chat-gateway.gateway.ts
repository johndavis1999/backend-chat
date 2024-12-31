import {
  WebSocketGateway,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGatewayGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private users: Map<string, Set<string>> = new Map(); // channel => Set<clientIds>

  handleConnection(client: Socket) {
    console.log('User connected');
    const channel = client.handshake.query.channel as string;
    if (channel) {
      if (!this.users.has(channel)) {
        this.users.set(channel, new Set());
      }
      this.users.get(channel).add(client.id);
      console.log(`User connected to channel ${channel}`);
    }
  }

  handleDisconnect(client: Socket) {
    const channel = this.getChannelBySocketId(client.id);
    if (channel) {
      const clients = this.users.get(channel);
      clients.delete(client.id);
      if (clients.size === 0) {
        this.users.delete(channel);
      }
      console.log(`User disconnected from channel ${channel}`);
    }
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(@ConnectedSocket() client: Socket, @MessageBody() data: { channel: string }) {
    const { channel } = data;

    if (!channel) {
      client.emit('error', { message: 'No channel provided' });
      client.disconnect();
      return;
    }

    if (!this.users.has(channel)) {
      this.users.set(channel, new Set());
    }
    this.users.get(channel).add(client.id);
    console.log(`User connected to channel ${channel}`);
    client.emit('connected', { message: `Welcome to your channel, ${channel}!` });
  }

  @SubscribeMessage('sendMessage')
  handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const channel = this.getChannelBySocketId(client.id);
    if (channel) {
      console.log(`Message received in channel ${channel}: ${data}`);
      client.emit('receiveMessage', { message: data });
    }
  }

  @SubscribeMessage('checkChannelStatus')
  handleCheckChannelStatus(@MessageBody() data: { channel: string }, @ConnectedSocket() client: Socket) {
    const { channel } = data;
    console.log(`Checking status of channel ${channel}`);
    const isActive = this.users.has(channel) && this.users.get(channel).size > 0;
    client.emit('channelStatus', { channel, isActive });
  }

  @SubscribeMessage('isUserActive')
  handleIsUserActive(@MessageBody() data: { channel: string }, @ConnectedSocket() client: Socket) {
    const { channel } = data;
    console.log(`Checking if channel ${channel} is active`);
    const isActive = this.users.has(channel) && this.users.get(channel).size > 0;
    client.emit('userActiveStatus', { channel, isActive });
  }

  private getChannelBySocketId(clientId: string): string | null {
    for (const [channel, clients] of this.users.entries()) {
      if (clients.has(clientId)) {
        return channel;
      }
    }
    return null;
  }
}
