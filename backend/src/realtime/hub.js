let socketServer;

export function registerSocketServer(io) {
  socketServer = io;
}

export function emitAdminEvent(event, payload) {
  socketServer?.to("admins").emit(event, payload);
}

export function emitStorefrontEvent(event, payload) {
  socketServer?.emit(event, payload);
}
