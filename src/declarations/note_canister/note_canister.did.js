export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'Ok' : IDL.Nat64, 'Err' : IDL.Text });
  const Note = IDL.Record({
    'id' : IDL.Nat64,
    'title' : IDL.Text,
    'content' : IDL.Text,
    'owner' : IDL.Principal,
    'created_at' : IDL.Nat64,
  });
  return IDL.Service({
    'create_note' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'get_note_by_id' : IDL.Func([IDL.Nat64], [IDL.Opt(Note)], ['query']),
    'get_notes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
