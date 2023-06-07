import { HexColorPicker } from "react-colorful";
import { Input } from "../Input";
import styles from "./ColorPicker.module.css";
import { ChangeEvent } from "react";

interface Props {
  color: string | undefined;
  onPickerChange: (color: string) => void;
  onInputChange: (e: ChangeEvent<HTMLInputElement> | undefined) => void;
}

export function ColorPicker({ color, onPickerChange, onInputChange }: Props) {
  return (
    <div className={styles.container}>
      <HexColorPicker color={color} onChange={onPickerChange} />
      <Input
        required
        name="hex-color-picker-input"
        type="text"
        placeholder="hex"
        className={styles.input}
        value={color}
        onChange={onInputChange}
      />
    </div>
  );
}
