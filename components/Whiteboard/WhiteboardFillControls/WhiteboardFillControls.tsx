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
import styles from "./WhiteboardFillControls.module.css";

interface Props {
  noteId: string | undefined;
}

export function WhiteboardFillControls({ noteId }: Props) {
  const selectedNoteFillColor: string | undefined = useStorage(
    (root: ReadonlyStorage) => getNote(root, noteId)?.fillColor,
    shallow
  );

  const selectedNoteFillOpacity: number | undefined = useStorage(
    (root: ReadonlyStorage) => getNote(root, noteId)?.fillOpacity,
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
      handleUpdateNote(noteId, { fillColor: e.target.value });
    }
  }

  function handleSliderOnValueChange(value: number[]) {
    handleUpdateNote(noteId, { fillOpacity: value[0] });
  }

  return (
    <>
      <ColorPicker
        color={selectedNoteFillColor}
        onPickerChange={handleFillColorPickerOnChange}
        onInputChange={handleFillColorInputOnChange}
      />
      <div className={styles.container}>
        <span className={styles.label}>Opacity</span>
        <Slider
          step={0.1}
          min={0}
          max={1}
          value={[selectedNoteFillOpacity ?? 1]}
          onValueChange={handleSliderOnValueChange}
          aria-label="Fill Opacity"
        />
      </div>
    </>
  );
}
