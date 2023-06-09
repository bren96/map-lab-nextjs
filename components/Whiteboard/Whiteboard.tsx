import { ClientSideSuspense } from "@liveblocks/react";
import { useSession } from "next-auth/react";
import { Spinner } from "../../primitives/Spinner";
import styles from "./Whiteboard.module.css";
import { Canvas } from "./WhiteboardCanvas";

export function Whiteboard() {
  const { data: session } = useSession();

  const loading = (
    <div className={styles.loading}>
      <Spinner size={24} />
    </div>
  );

  return (
    <ClientSideSuspense fallback={loading}>
      {() => <Canvas currentUser={session?.user.info ?? null} />}
    </ClientSideSuspense>
  );
}
