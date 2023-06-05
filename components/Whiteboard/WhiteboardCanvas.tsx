import { LiveObject, User, shallow } from "@liveblocks/client";
import clsx from "clsx";
import { nanoid } from "nanoid";
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
  LiveNote,
  Note,
  Presence,
  ReadonlyStorage,
  Storage,
  UserMeta,
  useCanRedo,
  useCanUndo,
  useHistory,
  useMutation,
  useSelf,
  useStorage,
} from "../../liveblocks.config";
import { Button } from "../../primitives/Button";
import { Popover } from "../../primitives/Popover";
import { Tooltip } from "../../primitives/Tooltip";
import { useBoundingClientRectRef } from "../../utils";
import { getRandomInt } from "../../utils/random";
import { Cursors } from "../Cursors";
import styles from "./WhiteboardCanvas.module.css";
import { WhiteBoardMap } from "./WhiteboardMap";
import { WhiteboardNote } from "./WhiteboardNote";

interface Props extends ComponentProps<"div"> {
  currentUser: UserMeta["info"] | null;
}

export function getNote(root: ReadonlyStorage, noteId: string): Note | null {
  return (
    Array.from(root.notes.values()).find((note) => {
      return note?.id === noteId;
    }) ?? null
  );
}

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
    fillColor: "",
    strokeColor: "",
  });

  storage.get("notes").set(note.get("id"), note);
}

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

export function getNoteFillColor(
  root: ReadonlyStorage,
  selectedId: string | null
): string | null {
  if (selectedId) {
    return getNote(root, selectedId)?.fillColor ?? null;
  }
  return null;
}

export function getNoteStrokeColor(
  root: ReadonlyStorage,
  selectedId: string | null
): string | null {
  if (selectedId) {
    return getNote(root, selectedId)?.strokeColor ?? null;
  }
  return null;
}

export function Canvas({ currentUser, className, style, ...props }: Props) {
  const history = useHistory();
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();

  const canvasRef = useRef(null);
  const rectRef = useBoundingClientRectRef(canvasRef);

  const isReadOnly = useSelf((me) => me.isReadOnly);

  const noteIds: string[] = useStorage(
    (root) => Array.from(root.notes.keys()),
    shallow
  );

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNoteFillColor: string | null = useStorage(
    (root: ReadonlyStorage) => getNoteFillColor(root, selectedNoteId),
    shallow
  );

  const selectedNoteStrokeColor: string | null = useStorage(
    (root: ReadonlyStorage) => getNoteStrokeColor(root, selectedNoteId),
    shallow
  );

  // Info about element being dragged
  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{
    element: Element;
    noteId: string;
    offset: { x: number; y: number };
  } | null>();

  const clearUsersSelectedNote = useMutation(({ storage, self }) => {
    const noteId = Array.from(storage.get("notes").values())
      .find((note) => {
        return note.get("selectedBy")?.name === currentUser?.name;
      })
      ?.get("id");
    if (noteId) {
      updateNote(storage, self, noteId, { selectedBy: null });
    }
  }, []);

  const handleAddNote = useMutation(({ storage, self }) => {
    addNote(storage, self);
  }, []);

  const handleUpdateNote = useMutation(
    ({ storage, self }, noteId, updates) =>
      updateNote(storage, self, noteId, updates),
    []
  );

  const handleDeleteNote = useMutation(
    ({ storage, self }, noteId) => deleteNote(storage, self, noteId),
    []
  );

  function handleNoteChange(
    e: ChangeEvent<HTMLTextAreaElement>,
    noteId: string
  ) {
    handleUpdateNote(noteId, { text: e.target.value, selectedBy: currentUser });
  }

  function handleNoteSelect(noteId: string) {
    clearUsersSelectedNote();
    setSelectedNoteId(noteId);
    handleUpdateNote(noteId, { selectedBy: currentUser });
  }

  // On note pointer down, pause history, set dragged note
  function handleNotePointerDown(
    e: PointerEvent<HTMLDivElement>,
    noteId: string
  ) {
    history.pause();
    e.stopPropagation();

    const element = document.querySelector(`[data-note="${noteId}"]`);
    if (!element) {
      return;
    }

    // Get position of cursor on note, to use as an offset when moving notes
    const rect = element.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    dragInfo.current = { noteId, element, offset };
    setIsDragging(true);
    document.documentElement.classList.add("grabbing");
  }

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

  // control note color in liveblocks
  const [fillColor, setFillColor] = useState("#D9D9D9");
  useEffect(
    () => handleUpdateNote(selectedNoteId, { fillColor: fillColor }),
    [fillColor]
  );

  // control note color in liveblocks
  const [strokeColor, setStrokeColor] = useState("#D9D9D9");
  useEffect(
    () => handleUpdateNote(selectedNoteId, { strokeColor: strokeColor }),
    [strokeColor]
  );

  useEffect(() => {
    if (selectedNoteFillColor) {
      setFillColor(selectedNoteFillColor);
    }

    if (selectedNoteStrokeColor) {
      setStrokeColor(selectedNoteStrokeColor);
    }
  }, [selectedNoteId]);

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
      <WhiteBoardMap />
      <Cursors element={canvasRef} />
      {noteIds.map((id: string) => (
        <WhiteboardNote
          dragged={id === dragInfo?.current?.noteId}
          id={id}
          key={id}
          onChange={(e) => handleNoteChange(e, id)}
          onDelete={() => handleDeleteNote(id)}
          onPointerDown={(e) => handleNotePointerDown(e, id)}
          onSelect={() => handleNoteSelect(id)}
        />
      ))}
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
