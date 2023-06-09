import { Note, ReadonlyStorage } from "../../../liveblocks.config";

export function getNote(
  root: ReadonlyStorage,
  noteId: string | undefined
): Note | null {
  return noteId
    ? Array.from(root.notes.values()).find((note) => {
        return note?.id === noteId;
      }) ?? null
    : null;
}
