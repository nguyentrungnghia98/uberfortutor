import socketIOClient from 'socket.io-client';
import Config from '../config';

const socket = socketIOClient(Config.url.API_URL);

export default socket;