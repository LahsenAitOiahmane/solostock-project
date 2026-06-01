// Minimal SockJS client stub used when the real 'sockjs-client' package is unavailable.
// This stub implements the subset of the API used by the application (constructor and basic methods).

export default class SockJS {
  public url: string;
  public readyState: number = 0; // 0 - CONNECTING, 1 - OPEN, 2 - CLOSED
  public onopen?: () => void;
  public onmessage?: (event: { data: any }) => void;
  public onclose?: (event?: any) => void;

  constructor(url: string) {
    this.url = url;
    // Simulate async opening of connection.
    setTimeout(() => {
      this.readyState = 1;
      if (this.onopen) this.onopen();
    }, 0);
  }

  // Sends data over the virtual connection (no-op).
  send(data: any): void {
    // In a real SockJS client, this would transmit over WebSocket.
    // Here we simply log for debugging purposes.
    console.debug('[SockJS stub] send:', data);
  }

  // Closes the virtual connection.
  close(): void {
    this.readyState = 2;
    if (this.onclose) this.onclose();
  }
}
