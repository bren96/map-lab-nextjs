import { LiveObject, User } from "@liveblocks/client";
import { Presence, UserMeta, Storage } from "../../../liveblocks.config";

export function deleteNote(
  storage: LiveObject<Storage>,
  self: User<Presence, UserMeta>,
  noteId: string
): void {
  if (self.isReadOnly) {
    return;
  }
  storage.get("notes").delete(noteId);
}
