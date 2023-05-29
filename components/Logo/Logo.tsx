import clsx from "clsx";
import Image from "next/image";
import { ComponentProps } from "react";
import favicon from "../../public/favicon.svg";
import styles from "./Logo.module.css";

export function Logo({ className, ...props }: ComponentProps<"div">) {
  return (
    <div className={clsx(className, styles["logo-container"])} {...props}>
      <Image src={favicon} alt="MAP-LAB Logo" className={styles["logo-img"]} />
      <span className={styles["logo-text"]}>MAP-LAB</span>
    </div>
  );
}
