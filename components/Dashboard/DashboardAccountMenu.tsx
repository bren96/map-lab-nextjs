import { signOut, useSession } from "next-auth/react";
import { SignOutIcon } from "../../icons";
import { Button } from "../../primitives/Button";
import styles from "./DashboardAccountMenu.module.css";

export function DashboardAccountMenu() {
  const { data: session } = useSession();

  return (
    <div className={styles.profilePopover}>
      <div className={styles.profilePopoverInfo}>
        <span className={styles.profilePopoverName}>
          {session?.user.info.name}
        </span>
        <span className={styles.profilePopoverId}>{session?.user.info.id}</span>
      </div>
      <div className={styles.profilePopoverActions}>
        <Button
          className={styles.profilePopoverButton}
          icon={<SignOutIcon />}
          onClick={() => signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
