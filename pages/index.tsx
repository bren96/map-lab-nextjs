import { GetServerSideProps } from "next";
import { signIn } from "next-auth/react";
import { Feature } from "../components/Marketing";
import { SignInIcon } from "../icons";
import { MarketingLayout } from "../layouts/Marketing";
import * as Server from "../lib/server";
import { Button, LinkButton } from "../primitives/Button";
import { Container } from "../primitives/Container";
import styles from "./index.module.css";

export default function Index() {
  return (
    <MarketingLayout>
      <Container className={styles.section}>
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitle}>Make maps with your team</h1>
          <p className={styles.heroLead}>
            MAP-LAB is a real-time collaborative web mapping application,
            empowering teams to use maps and geospatial data to solve complex
            problems.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Button icon={<SignInIcon />} onClick={() => signIn()}>
            Sign in
          </Button>
          <LinkButton href="/#features" variant="secondary">
            Learn more
          </LinkButton>
        </div>
      </Container>
      <Container className={styles.section}>
        <h2 id="features" className={styles.sectionTitle}>
          Features
        </h2>
        <div className={styles.featuresGrid}>
          <Feature
            title="Collaborative"
            description={
              <>
                A collaborative-first web mapping application. Build, edit, and
                share maps with others in real-time.
              </>
            }
          />
          <Feature
            title="Geospatial IDE"
            description={
              <>
                Access a wide variety of advanced geospatial and statistical
                tools from GeoPandas and TurfJS.
              </>
            }
          />
          <Feature
            title="Powerful map editor"
            description={
              <>
                Style, draw, and annotate your maps. Design data-driven and
                interactive visualizations.
              </>
            }
          />
          <Feature
            title="Built for the web"
            description={<>No installation, no headaches.</>}
          />
          <Feature
            title="Developer friendly"
            description={<>Open Source. View the project on GitHub.</>}
          />
          <Feature
            title="Transparent pricing"
            description={
              <>
                $30 per month per user.{" "}
                <a href="mailto:brendan@map-lab.app">Contact Us</a>.
              </>
            }
          />
        </div>
      </Container>
    </MarketingLayout>
  );
}

// If logged in, redirect to dashboard
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await Server.getServerSession(req, res);

  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/dashboard",
      },
    };
  }

  return {
    props: {},
  };
};
