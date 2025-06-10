import client from "@/commun/meetings";
import { CreateMeetingRequest, GetMeetingRequest, MeetingType, SearchMeetingsRequest, SearchMeetingsRequest_MeetingCategory, SearchParticipantsRequest, UpdateMeetingRequest } from "@/api/pb/schedule";
import { RichClientError } from "nice-grpc-error-details";
import type { Empty } from "@/api/pb/google/protobuf/empty";
import { Metadata } from "nice-grpc-web";
import { getAccessToken } from "./auth";

interface CreateMeetingParams {
    title: string;
    description: string;
    startTime: Date;
    participantsIDs?: string[];
    type?: MeetingType;
}

export const createMeeting = async ({
    title,
    description,
    startTime,
    participantsIDs,
    type
}: CreateMeetingParams): Promise<[ Empty | null, RichClientError | null]> => {
    try {
        const request = CreateMeetingRequest.create({
            title: title,
            description: description,
            startTime: startTime,
            type: type,
            participantIds: participantsIDs || []
        });

        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is not available. Please log in.");
        }
        
        let metadata: any = undefined;
        if (accessToken) {
            metadata = new Metadata();
            metadata.set("Authorization", `Bearer ${accessToken}`);
        }

        const response = await client.createMeeting(request, {
            metadata: metadata
        });

        return [response, null];
    } catch (error) {
        if (error instanceof RichClientError) {
            return [null, error];
        }
        throw error;
    }
};

interface UpdateMeetingParams {
    id: number;
    newTitle?: string;
    newDescription?: string;
    newStartTime?: Date;
    newType?: MeetingType;
    newParticipantsIDs?: string[];
    setIsparticipantidsempty?: boolean;
    isCanceled?: boolean;
}

export const updateMeeting = async (
    {
        id,
        newTitle,
        newDescription,
        newStartTime,
        newType,
        newParticipantsIDs,
        setIsparticipantidsempty = false,
        isCanceled = false
    }: UpdateMeetingParams
) : Promise<[ Empty | null, RichClientError | null]> => {
    try {
        const request = UpdateMeetingRequest.create({
            id: id,
            title: newTitle,
            description: newDescription,
            startTime: newStartTime,
            type: newType,
            participantIds: newParticipantsIDs,
            isParticipantIdsEmpty: setIsparticipantidsempty,
            isCancelled: isCanceled
        })

        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error("Access token is not available. Please log in.");
        }

        let metadata: any = undefined;
        if (accessToken) {
            metadata = new Metadata();
            metadata.set("Authorization", `Bearer ${accessToken}`);
        }

        const reponse = await client.updateMeeting(request, {
            metadata: metadata
        })

        return [reponse, null];
    } catch (error) {
        if (error instanceof RichClientError) {
            return [null, error];
        }
        return [null, error as RichClientError];
    }
}

interface GetMeetParams {
    id: number;
}

export const getMeeting = async ({ id }: GetMeetParams) => {
    const request = GetMeetingRequest.create({
        id: id
    });

    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error("Access token is not available. Please log in.");
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }

    const meeting = await client.getMeeting(request, {
        metadata: metadata
    });

    return meeting;
}

interface GetMeetingsParams {
    query: string;
    category: SearchMeetingsRequest_MeetingCategory;
    lastID: number;
    pageSize?: number;
}

export const getMeetings = async ({
    query, category, lastID, pageSize
} : GetMeetingsParams) => {
    const request = SearchMeetingsRequest.create({
        query: query,
        category: category,
        lastId: lastID,
        pageSize: pageSize
    })

    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error("Access token is not available. Please log in.");
    }

    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }
    
    const reponse = await client.searchMeetings(request, {
        metadata: metadata
    })
    return reponse.meetings;
}

interface GetUsersParams {
    emailQuery: string;
    lastID?: string;
    pageSize?: number;
}

export const getUsers = async ({
    emailQuery, lastID, pageSize
} : GetUsersParams) => {
    const request = SearchParticipantsRequest.create({
        emailQuery: emailQuery,
        lastId: lastID,
        pageSize: pageSize
    })

    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error("Access token is not available. Please log in.");
    }
    
    let metadata: any = undefined;
    if (accessToken) {
        metadata = new Metadata();
        metadata.set("Authorization", `Bearer ${accessToken}`);
    }
    
    const reponse = await client.searchParticipants(request, {
        metadata: metadata
    })
    return reponse.participants
}