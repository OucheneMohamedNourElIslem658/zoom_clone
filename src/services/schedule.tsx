import { Timestamp } from "google-protobuf/google/protobuf/timestamp_pb";
import { CreateMeetingRequest, MeetingType, SearchMeetingsRequest, SearchParticipantsRequest, UpdateMeetingRequest } from "@/api/pb/schedule_pb";
import client from "@/commun/meetings";

const createMeeting = async (
    title: string,
    description: string,
    startTimeUnix: number,
    type: MeetingType = MeetingType.VIDEO,
    participantsIDs: string[] = []
) => {
    const request = new CreateMeetingRequest();
    request.setTitle(title);
    request.setType(type)
    request.setParticipantIdsList(participantsIDs)
    request.setDescription(description);
    const startTimestamp = new Timestamp();
    startTimestamp.setSeconds(Math.floor(startTimeUnix / 1000));
    startTimestamp.setNanos((startTimeUnix % 1000) * 1e6);
    request.setStartTime(startTimestamp);

    await client.createMeeting(request);

    // npm install nice-grpc-error-details [to handle errors]
};

const updateMeeting = async (
    id: number,
    newTitle: string,
    newDescription: string,
    newStartTimeUnix: number,
    newType: MeetingType,
    newParticipantsIDs: string[] = [],
    setIsparticipantidsempty : boolean = false,
    isCanceled : boolean = false
) => {
    const request = new UpdateMeetingRequest()
    request.setId(id)
    request.setTitle(newTitle)
    request.setType(newType)
    request.setParticipantIdsList(newParticipantsIDs)
    request.setIsparticipantidsempty(setIsparticipantidsempty)
    request.setDescription(newDescription);
    const newStartTimestamp = new Timestamp();
    newStartTimestamp.setSeconds(Math.floor(newStartTimeUnix / 1000));
    newStartTimestamp.setNanos((newStartTimeUnix % 1000) * 1e6);
    request.setStartTime(newStartTimestamp);
    request.setIsCancelled(isCanceled)

    await client.updateMeeting(request)
}

const getMeetings = async (
    query : string,
    category : SearchMeetingsRequest.MeetingCategory,
    lastID : number,
    pageSize : number = 10
) => {
    const request = new SearchMeetingsRequest()
    request.setQuery(query)
    request.setCategory(category)
    request.setLastId(lastID)
    request.setPageSize(pageSize)
    
    const reponse = await client.searchMeetings(request)
    return reponse.getMeetingsList()
}

const getUsers = async (
    emailQuery : string,
    lastID : string,
    pageSize : number = 10
) => {
    const request = new SearchParticipantsRequest()
    request.setEmailquery(emailQuery)
    request.setLastId(lastID)
    request.setPageSize(pageSize)
    
    const reponse = await client.searchParticipants(request)
    return reponse.getParticipantsList()
}


export default { createMeeting, updateMeeting, getMeetings, getUsers }