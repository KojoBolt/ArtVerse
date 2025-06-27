import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Note {
  'id' : bigint,
  'title' : string,
  'content' : string,
  'owner' : Principal,
  'created_at' : bigint,
}
export type Result = { 'Ok' : bigint } |
  { 'Err' : string };
export interface _SERVICE {
  'create_note' : ActorMethod<[string, string], Result>,
  'get_note_by_id' : ActorMethod<[bigint], [] | [Note]>,
  'get_notes' : ActorMethod<[], Array<Note>>,
}
