// Simple STOMP client stub to replace @stomp/stompjs in environments where the package is unavailable.
// Provides minimal interface used by messagingService.

export class Client {
  public active: boolean = false;
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  // Activate the client (no-op for stub, but sets active flag)
  activate() {
    this.active = true;
    // In a real implementation, you would establish a WebSocket connection here.
    // For the stub, we simply mark as active.
  }

  // Subscribe to a destination. Returns an object with unsubscribe method.
  subscribe(destination: string, callback: (msg: any) => void) {
    // Stub does not receive real messages. It returns a dummy subscription.
    return {
      unsubscribe: () => {
        // No cleanup needed for stub.
      },
    };
  }

  // Additional methods can be added as needed.
}
