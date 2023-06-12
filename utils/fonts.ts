import {
  Caveat,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Open_Sans,
  PT_Serif,
  Pacifico,
  Roboto,
  Roboto_Mono,
} from "@next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans",
});
const ibmPlexMono = IBM_Plex_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});
const robotoMono = Roboto_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});
const openSans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});
const ptSerif = PT_Serif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
});
const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pacifico",
});
const caveat = Caveat({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

interface FontFamilyOption {
  label: string;
  fontClassName: string;
}

export const FONT_OPTIONS: FontFamilyOption[] = [
  { label: "IBM Plex Sans", fontClassName: ibmPlexSans.className },
  { label: "IBM Plex Mono", fontClassName: ibmPlexMono.className },
  { label: "Roboto", fontClassName: roboto.className },
  { label: "Roboto Mono", fontClassName: robotoMono.className },
  { label: "Open Sans", fontClassName: openSans.className },
  { label: "PT Serif", fontClassName: ptSerif.className },
  { label: "Pacifico", fontClassName: pacifico.className },
  { label: "Caveat", fontClassName: caveat.className },
];
