import { LiveObject, User, shallow } from "@liveblocks/client";
import clsx from "clsx";
import {
  ChangeEvent,
  ComponentProps,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { HexColorPicker } from "react-colorful";
import {
  ColorFillIcon,
  ColorStrokeIcon,
  PlusIcon,
  RedoIcon,
  UndoIcon,
} from "../../icons";
import {
  Note,
  Presence,
  Storage,
  ReadonlyStorage,
  UserMeta,
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
  useStorage,
  LiveNote,
} from "../../liveblocks.config";
import { Button } from "../../primitives/Button";
import { Popover } from "../../primitives/Popover";
import { Tooltip } from "../../primitives/Tooltip";
import { useBoundingClientRectRef } from "../../utils";
import { Cursors } from "../Cursors";
import styles from "./WhiteboardCanvas.module.css";
import { WhiteboardNote } from "./WhiteboardNote";
import { nanoid } from "nanoid";
import { getRandomInt } from "../../utils/random";
import { WhiteBoardNotes } from "./WhiteboardNotes";

interface Props extends ComponentProps<"div"> {
  currentUser: UserMeta["info"] | null;
}

// export function addNote(
//   storage: LiveObject<Storage>,
//   self: User<Presence, UserMeta>
// ): void {
//   if (self.isReadOnly) {
//     return;
//   }

//   const note: LiveNote = new LiveObject({
//     id: nanoid(),
//     x: getRandomInt(300),
//     y: getRandomInt(300),
//     text: "",
//     selectedBy: null,
//     fillColor: "",
//     strokeColor: "",
//   });

//   storage.get("notes").set(note.get("id"), note);
// }

// export function updateNote(
//   storage: LiveObject<Storage>,
//   self: User<Presence, UserMeta>,
//   noteId: string,
//   updates: any
// ): void {
//   if (self.isReadOnly) {
//     return;
//   }

//   const note = storage.get("notes").get(noteId);
//   if (note) {
//     note.update(updates);
//   }
// }

// export function deleteNote(
//   storage: LiveObject<Storage>,
//   self: User<Presence, UserMeta>,
//   noteId: string
// ): void {
//   if (self.isReadOnly) {
//     return;
//   }
//   storage.get("notes").delete(noteId);
// }

export function Canvas({ currentUser, className, style, ...props }: Props) {
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const canvasRef = useRef(null);
  const rectRef = useBoundingClientRectRef(canvasRef);

  const isReadOnly = useSelf((me) => me.isReadOnly);

  // Info about element being dragged
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{
    element: Element;
    noteId: string;
    offset: { x: number; y: number };
  } | null>();

  // On canvas pointer up, remove dragged element, resume history
  function handleCanvasPointerUp() {
    setIsDragging(false);
    dragInfo.current = null;
    document.documentElement.classList.remove("grabbing");
    history.resume();
  }

  function handleCanvasPointerDown() {
    clearUsersSelectedNote();
  }

  // If dragging on canvas pointer move, move element and adjust for offset
  function handleCanvasPointerMove(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    if (isDragging && dragInfo.current) {
      handleUpdateNote(dragInfo.current.noteId, {
        x: e.clientX - rectRef.current.x - dragInfo.current.offset.x,
        y: e.clientY - rectRef.current.y - dragInfo.current.offset.y,
      });
    }
  }

  return (
    <div
      className={clsx(className, styles.canvas)}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      onPointerDown={handleCanvasPointerDown}
      ref={canvasRef}
      style={{ pointerEvents: isReadOnly ? "none" : undefined, ...style }}
      {...props}
    >
      <Cursors element={canvasRef} />
      <WhiteBoardNotes onCanvasMove={} currentUser={currentUser} />
      {!isReadOnly && (
        <div className={styles.toolbar}>
          <Tooltip content="Add note" sideOffset={16}>
            <Button
              icon={<PlusIcon />}
              onClick={handleAddNote}
              variant="subtle"
            />
          </Tooltip>
          <Tooltip content="Undo" sideOffset={16}>
            <Button
              disabled={!canUndo}
              icon={<UndoIcon />}
              onClick={history.undo}
              variant="subtle"
            />
          </Tooltip>
          <Tooltip content="Redo" sideOffset={16}>
            <Button
              disabled={!canRedo}
              icon={<RedoIcon />}
              onClick={history.redo}
              variant="subtle"
            />
          </Tooltip>
          <Popover
            align="center"
            content={
              <HexColorPicker color={fillColor} onChange={setFillColor} />
            }
            side="top"
            sideOffset={24}
          >
            <div>
              <Tooltip content="Fill" sideOffset={16}>
                <Button
                  icon={<ColorFillIcon fill={fillColor} />}
                  variant="subtle"
                />
              </Tooltip>
            </div>
          </Popover>
          <Popover
            align="center"
            content={
              <HexColorPicker color={strokeColor} onChange={setStrokeColor} />
            }
            side="top"
            sideOffset={24}
          >
            <div>
              <Tooltip content="Stroke" sideOffset={16}>
                <Button
                  icon={<ColorStrokeIcon stroke={strokeColor} />}
                  variant="subtle"
                />
              </Tooltip>
            </div>
          </Popover>
        </div>
      )}
    </div>
  );
}
