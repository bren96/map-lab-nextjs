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
  id: string;
  dragged: boolean;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDelete: () => void;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onSelect: () => void;
}

export const WhiteboardNote = memo(
  ({
    id,
    dragged,
    style,
    className,
    onPointerDown,
    onDelete,
    onChange,
    onSelect,
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

    return (
      <div
        className={clsx(className, styles.container)}
        data-note={id}
        onDoubleClick={handleDoubleClick}
        onPointerDown={handlePointerDown}
        style={{
          transform: `translate(${note.x}px, ${note.y}px)`,
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
            backgroundColor: note.fillColor,
            borderColor: note.strokeColor,
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
              {note.selectedBy ? (
                <Avatar
                  color={note.selectedBy.color}
                  name={note.selectedBy.name}
                  outline
                  src={note.selectedBy.avatar}
                />
              ) : null}
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.textAreaSize}>{note.text + " "}</div>
            <textarea
              className={styles.textArea}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Write note…"
              ref={textAreaRef}
              value={note.text}
            />
          </div>
        </div>
      </div>
    );
  }
);
