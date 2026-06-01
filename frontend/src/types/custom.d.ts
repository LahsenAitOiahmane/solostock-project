// TypeScript module declarations for missing packages
declare module 'sockjs-client' {
  const SockJS: any;
  export default SockJS;
}

declare module '@stomp/stompjs' {
  // Re-export existing types from the package's own declarations if present
  export * from 'stompjs';
}
