import { LiveObject, User } from "@liveblocks/client";
import {
  LiveNote,
  Presence,
  Storage,
  UserMeta,
} from "../../../liveblocks.config";
import { nanoid } from "nanoid";
import { getRandomInt } from "../../../utils/random";

export function addNote(
  storage: LiveObject<Storage>,
  self: User<Presence, UserMeta>
): void {
  if (self.isReadOnly) {
    return;
  }

  const note: LiveNote = new LiveObject({
    id: nanoid(),
    x: getRandomInt(300),
    y: getRandomInt(300),
    text: "",
    selectedBy: null,
    fillColor: "#ffffff",
    strokeColor: "#000",
    strokeWidth: 3,
  });

  storage.get("notes").set(note.get("id"), note);
}
