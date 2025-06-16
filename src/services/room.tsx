import { GetRecordingResponse, JoinRoomRequest } from "@/api/pb/room"
import { getAccessToken } from "./auth"
import client from "@/commun/rooms"
import { Metadata } from "nice-grpc-web"
import type { RichClientError } from "nice-grpc-error-details"

export const joinRoom = async (meetingID: string) : Promise<[ string | null, RichClientError | Error | null]>  => {
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

export const recordRoom = async (meetingID: string): Promise<RichClientError | Error | null> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return  new Error("Access token is not available. Please log in.");
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }

    try {
        await client.recordRoom({ meetingId: meetingID }, {
            metadata: metadata,
        });
        return null;
    } catch (error: any) {
        return error as RichClientError;
    }
};

export const stopRecordingRoom = async (meetingID: string): Promise<RichClientError | Error | null> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return new Error("Access token is not available. Please log in.");
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }

    try {
        await client.stopRecording({ meetingId: meetingID }, {
            metadata: metadata,
        });
        return null;
    } catch (error: any) {
        return error as RichClientError;
    }
};

export const getRecodrings = async (meetingID: string): Promise<[GetRecordingResponse | null, RichClientError | Error | null]> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return [null, new Error("Access token is not available. Please log in.")];
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }

    try {
        const response = await client.getRecording({ meetingId: meetingID }, {
            metadata: metadata,
        });

        return [response, null];
    } catch (error: any) {
        return [null, error as RichClientError];
    }
}

export const generateGuestRoomJoinToken = async (meetingID: string): Promise<[string | null, Error | null]> => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return [null, new Error("Access token is not available. Please log in.")];
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }

    try {
        const response = await client.generateGuestJoinRoomToken({ meetingId: meetingID }, {
            metadata: metadata,
        });
        if (response.token) {
            return [response.token, null];
        } else {
            return [null, new Error("Failed to generate guest room join token.")];
        }
    } catch (error: any) {
        return [null, error as Error];
    }
}