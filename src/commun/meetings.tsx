import { ScheduleServiceDefinition } from '@/api/pb/schedule';
import {createChannel, createClient} from 'nice-grpc-web';

const channel = createChannel('http://localhost:8080');

const client = createClient(
    ScheduleServiceDefinition,
    channel,
);

export default client