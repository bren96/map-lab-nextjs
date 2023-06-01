import { LiveObject, User, shallow } from "@liveblocks/client";
import {
  ChangeEvent,
  ComponentProps,
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Note,
  Presence,
  ReadonlyStorage,
  Storage,
  UserMeta,
  useHistory,
  useMutation,
  useStorage,
} from "../../liveblocks.config";
import { WhiteboardNote } from "./WhiteboardNote";

interface Props extends ComponentProps<"div"> {
  currentUser: UserMeta["info"] | null;
  onCanvasMove: () => void;
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

export function getNote(root: ReadonlyStorage, noteId: string): Note | null {
  return (
    Array.from(root.notes.values()).find((note) => {
      return note?.id === noteId;
    }) ?? null
  );
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

export function WhiteBoardNotes({
  currentUser,
  onCanvasMove,
  ...props
}: Props) {
  onCanvasMove = () => {
    e.preventDefault();
    if (isDragging && dragInfo.current) {
      handleUpdateNote(dragInfo.current.noteId, {
        x: e.clientX - rectRef.current.x - dragInfo.current.offset.x,
        y: e.clientY - rectRef.current.y - dragInfo.current.offset.y,
      });
    }
  };

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

  const [isDragging, setIsDragging] = useState(false);
  const dragInfo = useRef<{
    element: Element;
    noteId: string;
    offset: { x: number; y: number };
  } | null>();

  const history = useHistory();

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

  return noteIds.map((id: string) => (
    <WhiteboardNote
      dragged={id === dragInfo?.current?.noteId}
      id={id}
      key={id}
      onChange={(e) => handleNoteChange(e, id)}
      onDelete={() => handleDeleteNote(id)}
      onPointerDown={(e) => handleNotePointerDown(e, id)}
      onSelect={() => handleNoteSelect(id)}
    />
  ));
}
