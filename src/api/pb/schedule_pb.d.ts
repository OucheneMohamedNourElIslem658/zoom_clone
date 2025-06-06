import * as jspb from 'google-protobuf'

import * as buf_validate_validate_pb from './buf/validate/validate_pb'; // proto import: "buf/validate/validate.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class Meeting extends jspb.Message {
  getId(): number;
  setId(value: number): Meeting;

  getTitle(): string;
  setTitle(value: string): Meeting;

  getDescription(): string;
  setDescription(value: string): Meeting;

  getType(): MeetingType;
  setType(value: MeetingType): Meeting;

  getStartTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartTime(value?: google_protobuf_timestamp_pb.Timestamp): Meeting;
  hasStartTime(): boolean;
  clearStartTime(): Meeting;

  getParticipantsCount(): number;
  setParticipantsCount(value: number): Meeting;

  getHost(): MeetParticipant | undefined;
  setHost(value?: MeetParticipant): Meeting;
  hasHost(): boolean;
  clearHost(): Meeting;

  getIsCancelled(): boolean;
  setIsCancelled(value: boolean): Meeting;

  getFirstThreeParticipantsList(): Array<MeetParticipant>;
  setFirstThreeParticipantsList(value: Array<MeetParticipant>): Meeting;
  clearFirstThreeParticipantsList(): Meeting;
  addFirstThreeParticipants(value?: MeetParticipant, index?: number): MeetParticipant;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Meeting.AsObject;
  static toObject(includeInstance: boolean, msg: Meeting): Meeting.AsObject;
  static serializeBinaryToWriter(message: Meeting, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Meeting;
  static deserializeBinaryFromReader(message: Meeting, reader: jspb.BinaryReader): Meeting;
}

export namespace Meeting {
  export type AsObject = {
    id: number,
    title: string,
    description: string,
    type: MeetingType,
    startTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    participantsCount: number,
    host?: MeetParticipant.AsObject,
    isCancelled: boolean,
    firstThreeParticipantsList: Array<MeetParticipant.AsObject>,
  }
}

export class MeetParticipant extends jspb.Message {
  getId(): string;
  setId(value: string): MeetParticipant;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): MeetParticipant;

  getName(): string;
  setName(value: string): MeetParticipant;

  getEmail(): string;
  setEmail(value: string): MeetParticipant;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MeetParticipant.AsObject;
  static toObject(includeInstance: boolean, msg: MeetParticipant): MeetParticipant.AsObject;
  static serializeBinaryToWriter(message: MeetParticipant, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MeetParticipant;
  static deserializeBinaryFromReader(message: MeetParticipant, reader: jspb.BinaryReader): MeetParticipant;
}

export namespace MeetParticipant {
  export type AsObject = {
    id: string,
    avatarUrl: string,
    name: string,
    email: string,
  }
}

export class CreateMeetingRequest extends jspb.Message {
  getTitle(): string;
  setTitle(value: string): CreateMeetingRequest;

  getDescription(): string;
  setDescription(value: string): CreateMeetingRequest;

  getStartTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartTime(value?: google_protobuf_timestamp_pb.Timestamp): CreateMeetingRequest;
  hasStartTime(): boolean;
  clearStartTime(): CreateMeetingRequest;

  getType(): MeetingType;
  setType(value: MeetingType): CreateMeetingRequest;

  getParticipantIdsList(): Array<string>;
  setParticipantIdsList(value: Array<string>): CreateMeetingRequest;
  clearParticipantIdsList(): CreateMeetingRequest;
  addParticipantIds(value: string, index?: number): CreateMeetingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateMeetingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateMeetingRequest): CreateMeetingRequest.AsObject;
  static serializeBinaryToWriter(message: CreateMeetingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateMeetingRequest;
  static deserializeBinaryFromReader(message: CreateMeetingRequest, reader: jspb.BinaryReader): CreateMeetingRequest;
}

export namespace CreateMeetingRequest {
  export type AsObject = {
    title: string,
    description: string,
    startTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    type: MeetingType,
    participantIdsList: Array<string>,
  }
}

export class UpdateMeetingRequest extends jspb.Message {
  getId(): number;
  setId(value: number): UpdateMeetingRequest;

  getTitle(): string;
  setTitle(value: string): UpdateMeetingRequest;
  hasTitle(): boolean;
  clearTitle(): UpdateMeetingRequest;

  getDescription(): string;
  setDescription(value: string): UpdateMeetingRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateMeetingRequest;

  getStartTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartTime(value?: google_protobuf_timestamp_pb.Timestamp): UpdateMeetingRequest;
  hasStartTime(): boolean;
  clearStartTime(): UpdateMeetingRequest;

  getType(): MeetingType;
  setType(value: MeetingType): UpdateMeetingRequest;
  hasType(): boolean;
  clearType(): UpdateMeetingRequest;

  getIsparticipantidsempty(): boolean;
  setIsparticipantidsempty(value: boolean): UpdateMeetingRequest;

  getParticipantIdsList(): Array<string>;
  setParticipantIdsList(value: Array<string>): UpdateMeetingRequest;
  clearParticipantIdsList(): UpdateMeetingRequest;
  addParticipantIds(value: string, index?: number): UpdateMeetingRequest;

  getIsCancelled(): boolean;
  setIsCancelled(value: boolean): UpdateMeetingRequest;
  hasIsCancelled(): boolean;
  clearIsCancelled(): UpdateMeetingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMeetingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMeetingRequest): UpdateMeetingRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMeetingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMeetingRequest;
  static deserializeBinaryFromReader(message: UpdateMeetingRequest, reader: jspb.BinaryReader): UpdateMeetingRequest;
}

export namespace UpdateMeetingRequest {
  export type AsObject = {
    id: number,
    title?: string,
    description?: string,
    startTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    type?: MeetingType,
    isparticipantidsempty: boolean,
    participantIdsList: Array<string>,
    isCancelled?: boolean,
  }

  export enum TitleCase { 
    _TITLE_NOT_SET = 0,
    TITLE = 2,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 3,
  }

  export enum StartTimeCase { 
    _START_TIME_NOT_SET = 0,
    START_TIME = 4,
  }

  export enum TypeCase { 
    _TYPE_NOT_SET = 0,
    TYPE = 5,
  }

  export enum IsCancelledCase { 
    _IS_CANCELLED_NOT_SET = 0,
    IS_CANCELLED = 8,
  }
}

export class UpdateMeetingResponse extends jspb.Message {
  getMeeting(): Meeting | undefined;
  setMeeting(value?: Meeting): UpdateMeetingResponse;
  hasMeeting(): boolean;
  clearMeeting(): UpdateMeetingResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMeetingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMeetingResponse): UpdateMeetingResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateMeetingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMeetingResponse;
  static deserializeBinaryFromReader(message: UpdateMeetingResponse, reader: jspb.BinaryReader): UpdateMeetingResponse;
}

export namespace UpdateMeetingResponse {
  export type AsObject = {
    meeting?: Meeting.AsObject,
  }
}

export class SearchMeetingsRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): SearchMeetingsRequest;

  getCategory(): SearchMeetingsRequest.MeetingCategory;
  setCategory(value: SearchMeetingsRequest.MeetingCategory): SearchMeetingsRequest;

  getLastId(): number;
  setLastId(value: number): SearchMeetingsRequest;
  hasLastId(): boolean;
  clearLastId(): SearchMeetingsRequest;

  getPageSize(): number;
  setPageSize(value: number): SearchMeetingsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMeetingsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMeetingsRequest): SearchMeetingsRequest.AsObject;
  static serializeBinaryToWriter(message: SearchMeetingsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMeetingsRequest;
  static deserializeBinaryFromReader(message: SearchMeetingsRequest, reader: jspb.BinaryReader): SearchMeetingsRequest;
}

export namespace SearchMeetingsRequest {
  export type AsObject = {
    query: string,
    category: SearchMeetingsRequest.MeetingCategory,
    lastId?: number,
    pageSize: number,
  }

  export enum MeetingCategory { 
    ALL = 0,
    PASSED = 1,
    UPCOMING = 2,
  }

  export enum LastIdCase { 
    _LAST_ID_NOT_SET = 0,
    LAST_ID = 5,
  }
}

export class SearchMeetingsResponse extends jspb.Message {
  getMeetingsList(): Array<Meeting>;
  setMeetingsList(value: Array<Meeting>): SearchMeetingsResponse;
  clearMeetingsList(): SearchMeetingsResponse;
  addMeetings(value?: Meeting, index?: number): Meeting;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMeetingsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMeetingsResponse): SearchMeetingsResponse.AsObject;
  static serializeBinaryToWriter(message: SearchMeetingsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMeetingsResponse;
  static deserializeBinaryFromReader(message: SearchMeetingsResponse, reader: jspb.BinaryReader): SearchMeetingsResponse;
}

export namespace SearchMeetingsResponse {
  export type AsObject = {
    meetingsList: Array<Meeting.AsObject>,
  }
}

export class SearchParticipantsRequest extends jspb.Message {
  getEmailquery(): string;
  setEmailquery(value: string): SearchParticipantsRequest;

  getLastId(): string;
  setLastId(value: string): SearchParticipantsRequest;
  hasLastId(): boolean;
  clearLastId(): SearchParticipantsRequest;

  getPageSize(): number;
  setPageSize(value: number): SearchParticipantsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchParticipantsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchParticipantsRequest): SearchParticipantsRequest.AsObject;
  static serializeBinaryToWriter(message: SearchParticipantsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchParticipantsRequest;
  static deserializeBinaryFromReader(message: SearchParticipantsRequest, reader: jspb.BinaryReader): SearchParticipantsRequest;
}

export namespace SearchParticipantsRequest {
  export type AsObject = {
    emailquery: string,
    lastId?: string,
    pageSize: number,
  }

  export enum LastIdCase { 
    _LAST_ID_NOT_SET = 0,
    LAST_ID = 2,
  }
}

export class SearchParticipantsResponse extends jspb.Message {
  getParticipantsList(): Array<MeetParticipant>;
  setParticipantsList(value: Array<MeetParticipant>): SearchParticipantsResponse;
  clearParticipantsList(): SearchParticipantsResponse;
  addParticipants(value?: MeetParticipant, index?: number): MeetParticipant;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchParticipantsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchParticipantsResponse): SearchParticipantsResponse.AsObject;
  static serializeBinaryToWriter(message: SearchParticipantsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchParticipantsResponse;
  static deserializeBinaryFromReader(message: SearchParticipantsResponse, reader: jspb.BinaryReader): SearchParticipantsResponse;
}

export namespace SearchParticipantsResponse {
  export type AsObject = {
    participantsList: Array<MeetParticipant.AsObject>,
  }
}

export enum MeetingType { 
  VIDEO = 0,
  AUDIO = 1,
}
