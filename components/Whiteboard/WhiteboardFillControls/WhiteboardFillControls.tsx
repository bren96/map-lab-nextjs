import { shallow } from "@liveblocks/client";
import { ChangeEvent } from "react";
import { getNote, updateNote } from "../../../lib/client/notes";
import {
  ReadonlyStorage,
  useMutation,
  useStorage,
} from "../../../liveblocks.config";
import { ColorPicker } from "../../../primitives/ColorPicker";

interface Props {
  noteId: string | undefined;
}

export function WhiteboardFillControls({ noteId }: Props) {
  const selectedNoteFillColor: string | undefined = useStorage(
    (root: ReadonlyStorage) => getNote(root, noteId)?.fillColor,
    shallow
  );

  const handleUpdateNote = useMutation(
    ({ storage, self }, noteId, updates) =>
      updateNote(storage, self, noteId, updates),
    []
  );

  function handleFillColorPickerOnChange(color: string | undefined) {
    handleUpdateNote(noteId, { fillColor: color });
  }

  function handleFillColorInputOnChange(
    e: ChangeEvent<HTMLInputElement> | undefined
  ) {
    if (e?.target.value) {
      handleUpdateNote(noteId, { strokeColor: e.target.value });
    }
  }

  return (
    <ColorPicker
      color={selectedNoteFillColor}
      onPickerChange={handleFillColorPickerOnChange}
      onInputChange={handleFillColorInputOnChange}
    />
  );
}
