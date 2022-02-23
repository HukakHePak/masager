export class SocketHandler {
    constructor(onmessage, onerror) {
        this.onmessage = onmessage;
        this.onerror = onerror;
    }

    get socket() {
        return this._socket;
    }

    open(url) {
        if(this.socket) return;

        const socket = new WebSocket(url);

        socket.onerror = this.onerror;
        socket.onmessage = this.onmessage;

        this._socket = socket;
    }

    close(options) {
        this.socket?.close(options?.code, options?.reason);
        this._socket = undefined;
    }
}