import { ClientProviderOptions, Transport } from '@nestjs/microservices';

export const ConnectRMQ = (serviceName: string): ClientProviderOptions => ({
  name: serviceName,
  transport: Transport.RMQ,
  options: {
    noAck: true,
    urls: [process.env.RMQ_URL],
    queue: serviceName,
    queueOptions: {
      durable: false,
    },
  },
});

export const ConnectUserTCP = (serviceName: string): ClientProviderOptions => ({
  name: serviceName,
  transport: Transport.TCP,
  options: {
    host: 'locahost',
    port: parseInt(process.env.TCP_PORT_USERS),
  },
});

export const ConnectBooksTCP = (
  serviceName: string,
): ClientProviderOptions => ({
  name: serviceName,
  transport: Transport.TCP,
  options: {
    host: 'locahost',
    port: parseInt(process.env.TCP_PORT_BOOKS),
  },
});
