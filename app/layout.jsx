import "./styles.css";

export const viewport = { themeColor: "#f4f0e7" };

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
