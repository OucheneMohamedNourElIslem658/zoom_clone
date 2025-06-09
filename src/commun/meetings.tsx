import { ScheduleServiceDefinition } from '@/api/pb/schedule';
import {createChannel, createClientFactory} from 'nice-grpc-web';
import {errorDetailsClientMiddleware} from 'nice-grpc-error-details';

const channel = createChannel('http://localhost:8080');

const client = createClientFactory()
    .use(errorDetailsClientMiddleware)
    .create(ScheduleServiceDefinition, channel);

export default client