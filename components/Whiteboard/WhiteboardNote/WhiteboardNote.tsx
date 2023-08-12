import clsx from "clsx";
import React, {
  ChangeEventHandler,
  ComponentProps,
  KeyboardEvent,
  PointerEvent,
  PointerEventHandler,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Resizable, ResizeCallbackData } from "react-resizable";
import { CrossIcon } from "../../../icons";
import { updateNote } from "../../../lib/client/notes";
import { useMutation, useStorage } from "../../../liveblocks.config";
import { Avatar } from "../../../primitives/Avatar";
import { Button } from "../../../primitives/Button";
import { Handle } from "../../../primitives/Handle";
import { applyOpacityToHex } from "../../../utils/colors";
import styles from "./WhiteboardNote.module.css";
import { debounce, throttle } from "lodash";

interface Props
  extends Omit<
    ComponentProps<"div">,
    "id" | "onBlur" | "onChange" | "onFocus" | "onPointerDown" | "onResize"
  > {
  id: string;
  dragged: boolean;
  onTextAreaChange: ChangeEventHandler<HTMLTextAreaElement>;
  onDelete: () => void;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onSelect: () => void;
  onResize: (data: ResizeCallbackData) => void;
  onResizeStart: () => void;
  onResizeStop: () => void;
}

interface ResizeState {
  height: number;
  width: number;
}

export const WhiteboardNote = memo(
  ({
    id,
    dragged,
    style,
    onPointerDown,
    onDelete,
    onTextAreaChange,
    onSelect,
    onResize,
    onResizeStart,
    onResizeStop,
    ...props
  }: Props) => {
    const note = useStorage((root) => root.notes.get(id));

    if (!note) {
      return null;
    }

    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const [hovering, setHovering] = useState<boolean>(false);

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

    const handleMouseEnter = useCallback(() => {
      if (hovering === false) {
        setHovering(true);
      }
    }, [hovering]);

    const handleMouseLeave = useCallback(() => {
      if (hovering) {
        setHovering(false);
      }
    }, [hovering]);

    function handlePointerDown(e: PointerEvent<HTMLDivElement>) {
      onPointerDown(e);
      onSelect();
    }

    const handleUpdateNote = useMutation(
      ({ storage, self }, noteId, updates) =>
        updateNote(storage, self, noteId, updates),
      []
    );

    const [resizeState, setResizeState] = useState<ResizeState>({
      height: 100,
      width: 200,
    });

    useEffect(() => {
      handleUpdateNote(id, resizeState);
    }, [onResizeStop]);

    function handleOnResize(
      _e: React.SyntheticEvent<Element, Event>,
      data: ResizeCallbackData
    ) {
      onResize(data);
      if (data.size.width && data.size.height) {
        setResizeState({
          width: data.size.width,
          height: data.size.height,
        });
      }
    }

    function handleOnResizeStart() {
      onResizeStart();
    }

    function handleOnResizeStop() {
      onResizeStop();
    }

    return (
      <Resizable
        width={resizeState.width}
        height={resizeState.height}
        minConstraints={[100, 100]}
        onResize={handleOnResize}
        onResizeStart={handleOnResizeStart}
        onResizeStop={handleOnResizeStop}
        handle={<Handle handleAxis="se" hide={!hovering} />}
      >
        <div
          data-note={id}
          className={clsx(styles.container, note.fontClassName)}
          onDoubleClick={handleDoubleClick}
          onPointerDown={handlePointerDown}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
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
              width: resizeState.width + "px",
              height: resizeState.height + "px",
              backgroundColor:
                applyOpacityToHex(note.fillColor, note.fillOpacity) ??
                note.fillColor,
              borderColor:
                applyOpacityToHex(note.strokeColor, note.strokeOpacity) ??
                note.strokeColor,
              borderWidth: note.strokeWidth,
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
                onChange={onTextAreaChange}
                onKeyDown={handleKeyDown}
                placeholder="Write note…"
                ref={textAreaRef}
                value={note.text}
              />
            </div>
          </div>
        </div>
      </Resizable>
    );
  }
);
