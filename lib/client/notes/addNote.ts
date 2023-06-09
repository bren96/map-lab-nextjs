import { LiveObject, User } from "@liveblocks/client";
import { nanoid } from "nanoid";
import {
  LiveNote,
  Presence,
  Storage,
  UserMeta,
} from "../../../liveblocks.config";
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
    fillOpacity: 1,
    strokeColor: "#000",
    strokeWidth: 3,
    strokeOpacity: 1,
  });

  storage.get("notes").set(note.get("id"), note);
}
