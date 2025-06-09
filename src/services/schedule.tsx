import client from "@/commun/meetings";
import { CreateMeetingRequest, MeetingType } from "@/api/pb/schedule";
import { RichClientError } from "nice-grpc-error-details";
import type { Empty } from "@/api/pb/google/protobuf/empty";
import { Metadata } from "nice-grpc-web";
import { getAccessToken, getCurrentUser } from "./auth";

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

// const updateMeeting = async (
//     id: number,
//     newTitle: string,
//     newDescription: string,
//     newStartTimeUnix: number,
//     newType: MeetingType,
//     newParticipantsIDs: string[] = [],
//     setIsparticipantidsempty : boolean = false,
//     isCanceled : boolean = false
// ) => {
//     const request = new UpdateMeetingRequest()
//     request.setId(id)
//     request.setTitle(newTitle)
//     request.setType(newType)
//     request.setParticipantIdsList(newParticipantsIDs)
//     request.setIsparticipantidsempty(setIsparticipantidsempty)
//     request.setDescription(newDescription);
//     const newStartTimestamp = new Timestamp();
//     newStartTimestamp.setSeconds(Math.floor(newStartTimeUnix / 1000));
//     newStartTimestamp.setNanos((newStartTimeUnix % 1000) * 1e6);
//     request.setStartTime(newStartTimestamp);
//     request.setIsCancelled(isCanceled)

//     await client.updateMeeting(request)
// }

// const getMeetings = async (
//     query : string,
//     category : SearchMeetingsRequest.MeetingCategory,
//     lastID : number,
//     pageSize : number = 10
// ) => {
//     const request = new SearchMeetingsRequest()
//     request.setQuery(query)
//     request.setCategory(category)
//     request.setLastId(lastID)
//     request.setPageSize(pageSize)
    
//     const reponse = await client.searchMeetings(request)
//     return reponse.getMeetingsList()
// }

// const getUsers = async (
//     emailQuery : string,
//     lastID : string,
//     pageSize : number = 10
// ) => {
//     const request = new SearchParticipantsRequest()
//     request.setEmailquery(emailQuery)
//     request.setLastId(lastID)
//     request.setPageSize(pageSize)
    
//     const reponse = await client.searchParticipants(request)
//     return reponse.getParticipantsList()
// }