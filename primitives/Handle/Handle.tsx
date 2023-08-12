import clsx from "clsx";
import { ComponentProps, LegacyRef, forwardRef } from "react";
import { ResizeHandle } from "react-resizable";
import styles from "./Handle.module.css";

interface Props extends ComponentProps<"div"> {
  handleAxis: ResizeHandle;
  hide: boolean;
}

export const Handle = forwardRef(
  (props: Props, ref: LegacyRef<HTMLDivElement>) => {
    const { handleAxis, hide, className, ...restProps } = props;
    return (
      <div
        ref={ref}
        className={clsx(
          className,
          styles.handle,
          styles[`handle-${handleAxis}`]
        )}
        style={{
          display: hide ? "none" : undefined,
        }}
        {...restProps}
      />
    );
  }
);
