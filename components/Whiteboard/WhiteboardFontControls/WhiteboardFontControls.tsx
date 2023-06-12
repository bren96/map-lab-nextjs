import { shallow } from "@liveblocks/client";
import { useEffect, useState } from "react";
import { getNote, updateNote } from "../../../lib/client/notes";
import {
  ReadonlyStorage,
  useMutation,
  useStorage,
} from "../../../liveblocks.config";
import { Select } from "../../../primitives/Select";
import { FONT_OPTIONS } from "../../../utils/fonts";
import style from "./WhiteboardFontControls.module.css";

interface Props {
  noteId: string | undefined;
  onOpenChange: (open: boolean) => void;
}

export function WhiteboardFontControls({ noteId, onOpenChange }: Props) {
  const [hidden, updateHidden] = useState<boolean>(true);
  useEffect(() => {
    updateHidden(!noteId);
  }, [noteId]);

  const selectedNoteFontClassName: string | undefined = useStorage(
    (root: ReadonlyStorage) => {
      const option = FONT_OPTIONS.find(
        (font) => font.fontClassName === getNote(root, noteId)?.fontClassName
      );
      return option?.label;
    },
    shallow
  );

  const handleUpdateNote = useMutation(
    ({ storage, self }, noteId, updates) =>
      updateNote(storage, self, noteId, updates),
    []
  );

  function handleFontSelectOnChange(selection: string) {
    handleUpdateNote(noteId, {
      fontClassName: FONT_OPTIONS.find((font) => font.label === selection)
        ?.fontClassName,
    });
  }

  return (
    <>
      <div style={{ display: hidden ? "none" : undefined }}>
        <Select
          className={style.select}
          value={selectedNoteFontClassName}
          items={FONT_OPTIONS.map((option) => {
            return { value: option.label };
          })}
          onChange={handleFontSelectOnChange}
          onOpenChange={onOpenChange}
        />
      </div>
    </>
  );
}
