import clsx from "clsx";
import { ComponentProps, ReactNode } from "react";
import styles from "./MarketingFeature.module.css";

interface FeatureProps extends Omit<ComponentProps<"div">, "title"> {
  description: ReactNode;
  title: ReactNode;
}

export function Feature({
  title,
  description,
  className,
  ...props
}: FeatureProps) {
  return (
    <div className={clsx(className, styles.featuresFeature)} {...props}>
      <h4 className={styles.featuresFeatureTitle}>{title}</h4>
      <p className={styles.featuresFeatureDescription}>{description}</p>
    </div>
  );
}
