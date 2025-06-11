import {createChannel, createClientFactory} from 'nice-grpc-web';
import {errorDetailsClientMiddleware} from 'nice-grpc-error-details';
import { RoomServiceDefinition } from '@/api/pb/room';

const channel = createChannel('http://localhost:8080');

const client = createClientFactory()
    .use(errorDetailsClientMiddleware)
    .create(RoomServiceDefinition, channel);

export default client