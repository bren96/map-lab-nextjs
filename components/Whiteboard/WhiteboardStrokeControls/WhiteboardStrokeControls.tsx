import { shallow } from "@liveblocks/client";
import { ChangeEvent } from "react";
import { getNote, updateNote } from "../../../lib/client/notes";
import {
  ReadonlyStorage,
  useMutation,
  useStorage,
} from "../../../liveblocks.config";
import { Slider } from "../../../primitives/BasicSlider";
import { ColorPicker } from "../../../primitives/ColorPicker";
import styles from "./WhiteboardStrokeControls.module.css";

interface Props {
  noteId: string | undefined;
}

export function WhiteboardStrokeControls({ noteId, ...props }: Props) {
  const handleUpdateNote = useMutation(
    ({ storage, self }, noteId, updates) =>
      updateNote(storage, self, noteId, updates),
    []
  );

  const noteStrokeColor: string | undefined = useStorage(
    (root: ReadonlyStorage) => getNote(root, noteId)?.strokeColor,
    shallow
  );

  const noteStrokeWidth: number | undefined = useStorage(
    (root: ReadonlyStorage) => getNote(root, noteId)?.strokeWidth,
    shallow
  );

  function handleColorPickerOnChange(color: string | undefined) {
    handleUpdateNote(noteId, { strokeColor: color });
  }

  function handleColorInputOnChange(
    e: ChangeEvent<HTMLInputElement> | undefined
  ) {
    if (e?.target.value) {
      handleUpdateNote(noteId, { strokeColor: e.target.value });
    }
  }

  function handleSliderOnValueChange(value: number[]) {
    handleUpdateNote(noteId, { strokeWidth: value[0] });
  }

  return (
    <>
      <ColorPicker
        color={noteStrokeColor}
        onPickerChange={handleColorPickerOnChange}
        onInputChange={handleColorInputOnChange}
      />
      <div className={styles.container}>
        <span className={styles.label}>Width</span>
        <Slider
          step={1}
          min={0}
          max={10}
          value={noteStrokeWidth ? [noteStrokeWidth] : [0]}
          onValueChange={(e) => handleSliderOnValueChange(e)}
          aria-label="Stroke Width"
        />
      </div>
    </>
  );
}
