import clsx from "clsx";
import {
  ChangeEventHandler,
  ComponentProps,
  KeyboardEvent,
  PointerEvent,
  PointerEventHandler,
  memo,
  useCallback,
  useRef,
} from "react";
import { CrossIcon } from "../../icons";
import { useStorage } from "../../liveblocks.config";
import { Avatar } from "../../primitives/Avatar";
import { Button } from "../../primitives/Button";
import styles from "./WhiteboardNote.module.css";

interface Props
  extends Omit<
    ComponentProps<"div">,
    "id" | "onBlur" | "onChange" | "onFocus" | "onPointerDown"
  > {
  dragged: boolean;
  id: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDelete: () => void;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onSelect: () => void;
}

export const WhiteboardNote = memo(
  ({
    id,
    dragged,
    onPointerDown,
    onDelete,
    onChange,
    onSelect,
    style,
    className,
    ...props
  }: Props) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const note = useStorage((root) => root.notes.get(id));

    const handleDoubleClick = useCallback(() => {
      textAreaRef.current?.focus();
    }, []);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Escape") {
          textAreaRef.current?.blur();
        }
      },
      []
    );

    const handlePointerDown = useCallback(
      (event: PointerEvent<HTMLDivElement>) => {
        onPointerDown(event);
        onSelect();
      },
      []
    );

    if (!note) {
      return null;
    }

    const { x, y, text, selectedBy, fillColor, strokeColor } = note;

    return (
      <div
        className={clsx(className, styles.container)}
        data-note={id}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        style={{
          transform: `translate(${x}px, ${y}px)`,
          transition: dragged ? "none" : undefined,
          zIndex: dragged ? 1 : 0,
          cursor: dragged ? "grabbing" : "grab",
          ...style,
        }}
        {...props}
      >
        <div
          className={styles.note}
          style={{
            backgroundColor: fillColor,
            borderColor: strokeColor,
            ...style,
          }}
        >
          <div className={styles.header}>
            <Button
              className={styles.deleteButton}
              icon={<CrossIcon />}
              onClick={onDelete}
              variant="subtle"
            />
            <div className={styles.presence}>
              {selectedBy ? (
                <Avatar
                  color={selectedBy.color}
                  name={selectedBy.name}
                  outline
                  src={selectedBy.avatar}
                />
              ) : null}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.textAreaSize}>{text + " "}</div>
            <textarea
              className={styles.textArea}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Write note…"
              ref={textAreaRef}
              value={text}
            />
          </div>
        </div>
      </div>
    );
  }
);
