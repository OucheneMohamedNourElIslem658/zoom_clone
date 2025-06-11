import { JoinRoomRequest } from "@/api/pb/room"
import { getAccessToken } from "./auth"
import client from "@/commun/rooms"
import { Metadata } from "nice-grpc-web"
import type { RichClientError } from "nice-grpc-error-details"

export const joinRoom = async (meetingID: number) : Promise<[ string | null, RichClientError | Error | null]>  => {
    const request = JoinRoomRequest.create({
        meetingId: meetingID,
    })

    const accessToken = await getAccessToken()
    if (!accessToken) {
        return [null, new Error("Access token is not available. Please log in.")];
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }

    try {
        const response = await client.joinRoom(request, {
            metadata: metadata,
        });
        return [response.token, null];
    } catch (error: any) {
        return [null, error as RichClientError];
    }
}