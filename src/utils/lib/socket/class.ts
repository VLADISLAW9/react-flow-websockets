export class Socket {
  private socket: WebSocket | null = null;
  private url: string;
  private eventListeners: Map<string, Array<(data: any) => void>> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  connect(callback?: (event: Event) => void) {
    if (this.socket) return;

    this.socket = new WebSocket(this.url);

    this.socket.onopen = (event: Event) => {
      callback?.(event);
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const listeners = this.eventListeners.get(data.type) || [];

      listeners.forEach((listener) => listener(data.payload));
    };
  }

  onerror(callback: (event: Event) => void) {
    if (!this.socket) return;

    this.socket.onerror = callback;
  }

  onclose(callback: (event: Event) => void) {
    if (!this.socket) return;

    this.socket.onclose = callback;
  }

  close(callback?: (event: Event) => void) {
    if (!this.socket) return;

    this.socket.onclose = (event) => callback?.(event);
    this.socket.close();

    this.socket = null;
  }

  send<Data>(data: Data) {
    if (!this.socket) return;
    if (this.socket.readyState !== WebSocket.OPEN) return;

    this.socket.send(JSON.stringify(data));
  }

  on<Data = unknown>(event: string, callback: (data: Data) => void) {
    if (!this.eventListeners.has(event)) this.eventListeners.set(event, []);

    this.eventListeners.get(event)?.push(callback);
  }
}
