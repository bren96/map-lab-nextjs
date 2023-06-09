import { LiveObject, User } from "@liveblocks/client";
import { UserMeta, Storage, Presence } from "../../../liveblocks.config";

export function updateNote(
  storage: LiveObject<Storage>,
  self: User<Presence, UserMeta>,
  noteId: string,
  updates: any
): void {
  if (self.isReadOnly) {
    return;
  }

  const note = storage.get("notes").get(noteId);
  if (note) {
    note.update(updates);
  }
}
