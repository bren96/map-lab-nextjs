import { LiveObject, User, shallow } from "@liveblocks/client";
import clsx from "clsx";
import { nanoid } from "nanoid";
import {
  ChangeEvent,
  ComponentProps,
  PointerEvent,
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
  UserInfo,
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
import { WhiteboardMap } from "./WhiteboardMap";
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
    fillColor: "#ffffff",
    strokeColor: "#000",
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
  selectedId: string | undefined
): string | undefined {
  if (selectedId) {
    return getNote(root, selectedId)?.fillColor;
  }
  return undefined;
}

export function isNoteSelectedByUser(
  note: Note,
  userInfo: UserInfo | null
): boolean {
  return note.selectedBy === userInfo;
}

export function isLiveNoteSelectedByUser(
  liveNote: LiveNote,
  userInfo: UserInfo | null
): boolean {
  return liveNote.get("selectedBy") === userInfo;
}

export function getNoteStrokeColor(
  root: ReadonlyStorage,
  selectedId: string | undefined
): string | undefined {
  if (selectedId) {
    return getNote(root, selectedId)?.strokeColor;
  }
  return undefined;
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

  const selectedNoteId: string | undefined = useStorage((root) => {
    return Array.from(root.notes.values()).find((note) =>
      isNoteSelectedByUser(note, currentUser)
    )?.id;
  }, shallow);

  const selectedNoteFillColor: string | undefined = useStorage(
    (root: ReadonlyStorage) => getNoteFillColor(root, selectedNoteId),
    shallow
  );

  const selectedNoteStrokeColor: string | undefined = useStorage(
    (root: ReadonlyStorage) => getNoteStrokeColor(root, selectedNoteId),
    shallow
  );

  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{
    element: Element;
    noteId: string;
    offset: { x: number; y: number };
  } | null>();

  const clearUsersSelectedNote = useMutation(({ storage, self }) => {
    const noteId = Array.from(storage.get("notes").values())
      .find((note) => isLiveNoteSelectedByUser(note, currentUser))
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

  function handleNoteTextChange(
    e: ChangeEvent<HTMLTextAreaElement>,
    noteId: string
  ) {
    handleUpdateNote(noteId, { text: e.target.value, selectedBy: currentUser });
  }

  function handleNoteSelect(noteId: string) {
    clearUsersSelectedNote();
    handleUpdateNote(noteId, { selectedBy: currentUser });
  }

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

    const rect = element.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    dragInfo.current = { noteId, element, offset };
    setIsDragging(true);
    document.documentElement.classList.add("grabbing");
  }

  function handleCanvasPointerUp() {
    setIsDragging(false);
    dragInfo.current = null;
    document.documentElement.classList.remove("grabbing");
    history.resume();
  }

  function handleCanvasPointerMove(e: PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    if (isDragging && dragInfo.current) {
      handleUpdateNote(dragInfo.current.noteId, {
        x: e.clientX - rectRef.current.x - dragInfo.current.offset.x,
        y: e.clientY - rectRef.current.y - dragInfo.current.offset.y,
      });
    }
  }

  function handleMapPointerDown() {
    history.pause();
    clearUsersSelectedNote();
  }

  function handleMapPointerUp() {
    history.resume();
  }

  function handleFillColorOpenChange(open: boolean) {
    open ? history.pause() : history.resume();
  }

  function handleStrokeColorOpenChange(open: boolean) {
    open ? history.pause() : history.resume();
  }

  function handleFillColorPickerOnChange(color: string | undefined) {
    handleUpdateNote(selectedNoteId, { fillColor: color });
  }

  function handleStrokeColorPickerOnChange(color: string | undefined) {
    handleUpdateNote(selectedNoteId, { strokeColor: color });
  }

  return (
    <div
      ref={canvasRef}
      className={clsx(className, styles.canvas)}
      style={{ pointerEvents: isReadOnly ? "none" : undefined, ...style }}
      onPointerMove={handleCanvasPointerMove}
      onPointerUp={handleCanvasPointerUp}
      {...props}
    >
      <WhiteboardMap
        onPointerDown={handleMapPointerDown}
        onPointerUp={handleMapPointerUp}
      />
      <Cursors element={canvasRef} />
      {noteIds.map((id: string) => (
        <WhiteboardNote
          id={id}
          key={id}
          dragged={id === dragInfo?.current?.noteId}
          onChange={(e) => handleNoteTextChange(e, id)}
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
            side="top"
            sideOffset={24}
            disabled={!selectedNoteFillColor}
            onOpenChange={handleFillColorOpenChange}
            content={
              <HexColorPicker
                color={selectedNoteFillColor}
                onChange={handleFillColorPickerOnChange}
              />
            }
          >
            <div>
              <Tooltip content="Fill" sideOffset={16}>
                <Button
                  variant="subtle"
                  disabled={!selectedNoteFillColor}
                  icon={
                    <ColorFillIcon fill={selectedNoteFillColor ?? "#444"} />
                  }
                />
              </Tooltip>
            </div>
          </Popover>
          <Popover
            align="center"
            side="top"
            sideOffset={24}
            disabled={!selectedNoteStrokeColor}
            onOpenChange={handleStrokeColorOpenChange}
            content={
              selectedNoteFillColor && (
                <HexColorPicker
                  color={selectedNoteStrokeColor}
                  onChange={handleStrokeColorPickerOnChange}
                />
              )
            }
          >
            <div>
              <Tooltip content="Stroke" sideOffset={16}>
                <Button
                  variant="subtle"
                  disabled={!selectedNoteStrokeColor}
                  icon={
                    <ColorStrokeIcon
                      stroke={selectedNoteStrokeColor ?? "#444"}
                    />
                  }
                />
              </Tooltip>
            </div>
          </Popover>
        </div>
      )}
    </div>
  );
}
