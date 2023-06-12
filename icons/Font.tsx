import { ComponentProps } from "react";

export function FontIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="16"
      width="16"
      viewBox="0 -960 960 960"
      fill={props.fill ?? "#D9D9D9"}
      {...props}
    >
      <path d="M290-160v-540H80v-100h520v100H390v540H290Zm360 0v-340H520v-100h360v100H750v340H650Z" />
    </svg>
  );
}
