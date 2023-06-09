import { ChangeEvent } from "react";
import { HexColorPicker } from "react-colorful";
import { Input } from "../Input";
import styles from "./ColorPicker.module.css";

interface Props {
  color: string | undefined;
  onPickerChange: (color: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement> | undefined) => void;
}

export function ColorPicker({ color, onPickerChange, onInputChange }: Props) {
  const defaultColor = "#000";

  return (
    <div className={styles.container}>
      <HexColorPicker color={color ?? defaultColor} onChange={onPickerChange} />
      <Input
        required
        name="hex-color-picker-input"
        type="text"
        placeholder="hex"
        className={styles.input}
        value={color ?? defaultColor}
        onChange={onInputChange}
      />
    </div>
  );
}
