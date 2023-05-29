import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ComponentProps, MouseEventHandler } from "react";
import { CrossIcon, MenuIcon } from "../../icons";
import { Avatar } from "../../primitives/Avatar";
import { Popover } from "../../primitives/Popover";
import { Logo } from "../Logo";
import { DashboardAccountMenu } from "./DashboardAccountMenu";
import styles from "./DashboardHeader.module.css";

interface Props extends ComponentProps<"header"> {
  isOpen: boolean;
  onMenuClick: MouseEventHandler<HTMLButtonElement>;
}

export function DashboardHeader({
  isOpen,
  onMenuClick,
  className,
  ...props
}: Props) {
  const { data: session } = useSession();

  return (
    <header className={clsx(className, styles.header)} {...props}>
      <div className={styles.menu}>
        <button className={styles.menuToggle} onClick={onMenuClick}>
          {isOpen ? <CrossIcon /> : <MenuIcon />}
        </button>
      </div>
      <div className={styles.logo}>
        <Link href="/" className={styles.logoLink}>
          <Logo />
        </Link>
      </div>
      <div className={styles.profile}>
        {session && (
          <Popover
            align="end"
            alignOffset={-6}
            content={<DashboardAccountMenu />}
            side="bottom"
            sideOffset={6}
          >
            <button className={styles.profileButton}>
              <Avatar
                className={styles.profileAvatar}
                name={session.user.info.name}
                size={32}
                src={session.user.info.avatar}
              />
            </button>
          </Popover>
        )}
      </div>
    </header>
  );
}
