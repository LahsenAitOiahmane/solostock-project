declare module '@stomp/stompjs' {
  // Minimal client for STOMP over SockJS
  export class Client {
    constructor(config: any);
    activate(): void;
    deactivate(): void;
    subscribe(destination: string, callback: (msg: any) => any): { unsubscribe(): void };
    // Additional properties can be any
    [key: string]: any;
  }

  export interface IMessage {
    body: string;
    headers: any;
    ack(): void;
    nack(): void;
    // Additional properties optional
    [key: string]: any;
  }

  // Export Stomp for completeness (any type)
  export const Stomp: any;
}
