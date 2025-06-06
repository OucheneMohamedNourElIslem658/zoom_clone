import { ScheduleServiceClient } from "@/api/pb/ScheduleServiceClientPb";

const serverURL = import.meta.env.VITE_MEETINGS_SERVER_URL
const client = new ScheduleServiceClient(serverURL);

export default client