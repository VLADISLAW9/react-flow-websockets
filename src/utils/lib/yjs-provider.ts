import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export const yDoc = new Y.Doc();
export const yProvider = new WebsocketProvider('ws://localhost:9000', 'room-1', yDoc);
export const yAwareness = yProvider.awareness;
