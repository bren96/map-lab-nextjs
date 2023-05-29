import clsx from "clsx";
import { useRouter } from "next/router";
import { ComponentProps, useMemo } from "react";
import { FileIcon, FolderIcon } from "../../icons";
import { LinkButton } from "../../primitives/Button";
import { Group } from "../../types";
import { normalizeTrailingSlash } from "../../utils";
import styles from "./DashboardSidebar.module.css";

interface Props extends ComponentProps<"div"> {
  groups: Group[];
}

interface SidebarLinkProps
  extends Omit<ComponentProps<typeof LinkButton>, "href"> {
  href: string;
}

function SidebarLink({
  href,
  children,
  className,
  ...props
}: SidebarLinkProps) {
  const router = useRouter();
  const isActive = useMemo(
    () =>
      normalizeTrailingSlash(router.asPath) === normalizeTrailingSlash(href),
    [router, href]
  );

  return (
    <LinkButton
      className={clsx(className, styles.sidebarLink)}
      data-active={isActive || undefined}
      href={href}
      variant="subtle"
      {...props}
    >
      {children}
    </LinkButton>
  );
}

export function DashboardSidebar({ className, groups, ...props }: Props) {
  return (
    <div className={clsx(className, styles.sidebar)} {...props}>
      <nav className={styles.navigation}>
        <div className={styles.category}>
          <ul className={styles.list}>
            <li>
              <SidebarLink href="/dashboard" icon={<FileIcon />}>
                All
              </SidebarLink>
            </li>
            <li>
              <SidebarLink href="/dashboard/drafts" icon={<FileIcon />}>
                Drafts
              </SidebarLink>
            </li>
          </ul>
        </div>
        <div className={styles.category}>
          <span className={styles.categoryTitle}>Groups</span>
          <ul className={styles.list}>
            {groups.map((group) => {
              return (
                <li key={group.id}>
                  <SidebarLink
                    href={`/dashboard/group/${group.id}`}
                    icon={<FolderIcon />}
                  >
                    {group.name}
                  </SidebarLink>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}
