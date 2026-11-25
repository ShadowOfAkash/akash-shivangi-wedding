import InvitationIntro from "./invitation-intro";
import "./styles.css";

export const viewport = { themeColor: "#344454" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <noscript><style>{`
          .invitation-intro, .invitation-placeholder { display: none !important; }
          html:has(.invitation-intro) { overflow: auto; }
          div[hidden]:has(main#top) { display: block !important; }
        `}</style></noscript>
        <InvitationIntro />
        <div id="invitation-page">{children}</div>
      </body>
    </html>
  );
}
