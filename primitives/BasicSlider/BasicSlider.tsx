import * as RadixSlider from "@radix-ui/react-slider";
import { RefAttributes } from "react";
import styles from "./BasicSlider.module.css";
import React from "react";

type Props = RadixSlider.SliderProps & RefAttributes<HTMLSpanElement>;

export function Slider(props: Props) {
  return (
    <RadixSlider.Root className={styles.SliderRoot} {...props}>
      <RadixSlider.Track className={styles.SliderTrack}>
        <RadixSlider.Range className={styles.SliderRange} />
      </RadixSlider.Track>
      <RadixSlider.Thumb className={styles.SliderThumb} />
    </RadixSlider.Root>
  );
}
