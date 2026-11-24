import { Fragment } from "react";
import Script from "next/script";
import { WeddingRings } from "./loading";
import { getWeddingContent } from "./content";

export const dynamic = "force-dynamic";

const timezone = { timeZone: "Asia/Kolkata" };
const shortDate = new Intl.DateTimeFormat("en-GB", { ...timezone, dateStyle: "long" });
const longDate = new Intl.DateTimeFormat("en-GB", { ...timezone, dateStyle: "full" });
const clock = new Intl.DateTimeFormat("en-IN", { ...timezone, hour: "numeric", minute: "2-digit", hour12: true });

export async function generateMetadata() {
  const content = await getWeddingContent();
  return { title: content.siteTitle, description: content.siteDescription };
}

export default async function WeddingPage() {
  const content = await getWeddingContent();
  const eventDate = (event) => content[event + "At"] + ":00+05:30";
  const eventTime = (event) => clock.format(new Date(eventDate(event)));

  return (
    <>
      <a className="skip-link" href="#details">Skip to wedding details</a>
      <main id="top">
        <section className="journey" aria-labelledby="couple">
          <span id="flight" className="flight-marker" aria-hidden="true"></span>
          <div className="stage">
            <div className="scenery">
              <div className="hero-loading"><WeddingRings /></div>
              <picture>
                <source media="(max-aspect-ratio: 4/5)" srcSet="/assets/mandap-portrait.webp" />
                <img className="mandap-scene" src="/assets/mandap-wide.webp" fetchPriority="high" decoding="async"
                  alt="A flower-lined meadow path leading to a distant mandap where the bride follows the groom around the havan fire." />
              </picture>
              <video className="mandap-film" preload="none" muted playsInline aria-hidden="true"></video>
              <div className="clouds" aria-hidden="true">
                <div className="cloud cloud-near"></div>
                <div className="cloud cloud-far"></div>
              </div>
              <div className="sky-wash"></div>
              <div className="arrival-shade"></div>
            </div>

            <header className="masthead">
              <a className="monogram" href="#top" aria-label="Back to the invitation">{Array.from(content.firstName)[0]} <i>&amp;</i> {Array.from(content.secondName)[0]}</a>
              <img className="masthead-ganesh" src="/assets/ganesh-masthead.png" width="192" height="192" alt="Ganesh Ji" />
              <a className="header-rsvp" href="#rsvp">RSVP</a>
            </header>

            <div className="invitation">
              <p className="eyebrow invocation" lang="hi"><span aria-hidden="true">॥</span>{" "}{content.invocation}{" "}<span aria-hidden="true">॥</span></p>
              <h1 id="couple">{content.firstName}{" "}<i className="names-joiner">&amp;</i>{" "}{content.secondName}</h1>
              <p className="hero-date"><time dateTime={content.weddingAt.slice(0, 10)}>{shortDate.format(new Date(eventDate("wedding")))}</time></p>
              <p className="hero-city">{content.city}</p>
            </div>

            <p className="invitation-message">
              {content.invitation.split(/\r?\n/).map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {line.trim().split(/\s+/).map((word, wordIndex) => (
                    <Fragment key={wordIndex}>
                      {wordIndex > 0 && " "}
                      <span className="invitation-word">{word}</span>
                    </Fragment>
                  ))}
                </Fragment>
              ))}
            </p>

            <a className="scroll-cue animated-label" href="#flight">
              <span className="scroll-icon" aria-hidden="true"></span>
              Scroll to explore
            </a>
          </div>
        </section>

        <nav className="wedding-nav" aria-label="Wedding guide">
          <div className="wedding-nav-links">
            <a href="#details">Schedule</a>
            <a href="#story">Couple</a>
            <a href="#travel">Travel</a>
          </div>
          <a className="header-rsvp" href="#rsvp">RSVP</a>
        </nav>

        <section className="photo-scene story-scene" id="story" aria-label="The couple and their families">
          <div className="photo-stage">
            <div className="story-landscape">
              <div className="story-image-plane">
                <img src="/assets/meadow/couple.webp" width="1200" height="1200" alt="A bride and groom walking through a flower meadow toward a mandap" loading="lazy" decoding="async" />
                <div className="story-copy">
                  <div>
                    <h2>{content.firstFullName}</h2>
                    <p><span>Son of</span> {content.firstParentOne}<br />and {content.firstParentTwo}</p>
                  </div>
                  <i className="story-joiner">and</i>
                  <div>
                    <h2>{content.secondFullName}</h2>
                    <p><span>Daughter of</span> {content.secondParentOne}<br />and {content.secondParentTwo}</p>
                  </div>
                </div>
                <time className="story-date" dateTime={content.weddingAt.slice(0, 10)}>{shortDate.format(new Date(eventDate("wedding")))}</time>
                <img className="story-foreground" src="/assets/meadow/couple.webp" width="1200" height="1200" alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section id="details" aria-labelledby="schedule-heading">
          <header className="schedule-intro">
            <h2 id="schedule-heading">Wedding schedule</h2>
            <nav aria-label="Ceremonies">
              <a href="#haldi">{content.haldiName}</a>
              <a href="#mehndi">{content.mehndiName}</a>
              <a href="#wedding">{content.weddingName}</a>
            </nav>
          </header>
          <article className="photo-scene event-scene haldi-scene" id="haldi" aria-labelledby="haldi-heading">
            <div className="photo-stage">
              <img className="scene-photo" src="/assets/meadow/haldi-yellow.webp" width="1600" height="900" alt="" loading="lazy" decoding="async" />
              <div className="scene-copy content-width">
                <div className="event-body">
                  <h2 id="haldi-heading">{content.haldiName}</h2>
                  <p className="event-date"><time dateTime={eventDate("haldi")}>{longDate.format(new Date(eventDate("haldi")))}</time> · {eventTime("haldi")} IST</p>
                  <p className="event-venue">{content.haldiVenue}</p>
                  <p>{content.haldiDetails}</p>
                </div>
              </div>
            </div>
          </article>
          <article className="photo-scene event-scene mehndi-scene" id="mehndi" aria-labelledby="mehndi-heading">
            <div className="photo-stage">
              <picture className="scene-photo">
                <source media="(max-aspect-ratio: 4/5)" srcSet="/assets/meadow/mehndi-hands-portrait.webp" width="900" height="1600" />
                <img src="/assets/meadow/mehndi-hands.webp" width="1600" height="900" alt="Left and right hands decorated with mehndi, resting beside green flowers and a dholak" loading="lazy" decoding="async" />
              </picture>
              <div className="scene-copy content-width">
                <div className="event-body">
                  <h2 id="mehndi-heading">{content.mehndiName}</h2>
                  <p className="event-date"><time dateTime={eventDate("mehndi")}>{longDate.format(new Date(eventDate("mehndi")))}</time> · {eventTime("mehndi")} IST</p>
                  <p className="event-venue">{content.mehndiVenue}</p>
                  <p>{content.mehndiDetails}</p>
                </div>
              </div>
            </div>
          </article>
          <article className="photo-scene event-scene wedding-scene" id="wedding" aria-labelledby="wedding-heading">
            <div className="photo-stage">
              <img className="scene-photo" src="/assets/meadow/wedding-roses.webp" width="1600" height="900" alt="" loading="lazy" decoding="async" />
              <div className="scene-copy content-width">
                <div className="event-body">
                  <h2 id="wedding-heading">{content.weddingName}</h2>
                  <p className="event-date"><time id="wedding-date" dateTime={eventDate("wedding")}>{longDate.format(new Date(eventDate("wedding")))}</time> · {eventTime("wedding")} IST</p>
                  <p className="event-venue">{content.weddingVenue}</p>
                  <p>{content.weddingDetails}</p>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section className="travel section-space" id="travel" aria-labelledby="travel-heading">
          <div className="travel-layout content-width">
            <header className="travel-destination">
              <img src="/assets/meadow/kanpur-riverfront.webp" width="1200" height="800" alt="Illustration of the Ganga riverfront at sunrise" loading="lazy" decoding="async" />
              <h2 id="travel-heading">Getting to <span>{content.city}</span></h2>
            </header>
            <div className="travel-guide">
              <dl className="travel-options">
                <div>
                  <dt>By train</dt>
                  <dd><strong>{content.trainName}</strong><span>{content.trainDetails}</span></dd>
                </div>
                <div>
                  <dt>By air</dt>
                  <dd><strong>{content.airportName}</strong><span>{content.airportDetails}</span></dd>
                </div>
                <div>
                  <dt>By road</dt>
                  <dd><strong>{content.roadName}</strong><span>{content.roadDetails}</span></dd>
                </div>
              </dl>
              <aside className="travel-note">
                <h3>{content.travelNoteTitle}</h3>
                <p>{content.travelNote}</p>
              </aside>
            </div>
          </div>
        </section>

        <section className="countdown" aria-labelledby="countdown-heading">
          <h2 id="countdown-heading">Counting the days</h2>
          <p className="countdown-time" hidden><strong></strong> <span></span></p>
          <p>Until the wedding on {shortDate.format(new Date(eventDate("wedding")))} at {eventTime("wedding")} IST</p>
        </section>

        <section className="rsvp" id="rsvp" aria-labelledby="rsvp-heading">
          <img className="rsvp-background" src="/assets/meadow/rsvp-namaste.webp" width="1600" height="1600" alt="Illustration of the couple and their parents greeting guests with namaste in a flower meadow" loading="lazy" decoding="async" />
          <div className="rsvp-intro">
            <h2 id="rsvp-heading">RSVP</h2>
            <noscript><p>Please reply to your wedding invitation contact with your name, guest count and the events you’ll attend.</p></noscript>
          </div>
          <form className="rsvp-form" aria-labelledby="rsvp-heading" hidden>
            <p className="rsvp-instructions">Send your RSVP directly to the couple.</p>
            <label htmlFor="guest-name">Your name</label>
            <input name="guest-name" id="guest-name" autoComplete="name" maxLength="120" required />
            <div className="rsvp-details">
              <label>Wedding side
                <select name="side" defaultValue="" required>
                  <option value="" disabled>Select a side</option>
                  <option value="Groom">Groom’s side</option>
                  <option value="Bride">Bride’s side</option>
                  <option value="Both">Both sides</option>
                </select>
              </label>
              <label>How do you know the couple?
                <select name="relationship" defaultValue="" required>
                  <option value="" disabled>Select a relationship</option>
                  {["Family", "Friend", "Colleague", "Other"].map(value => <option key={value}>{value}</option>)}
                </select>
              </label>
              <label>Mobile number (required)
                <input type="tel" name="phone" autoComplete="tel" maxLength="30" required />
              </label>
              <label>Email (optional)
                <input type="email" name="email" autoComplete="email" maxLength="254" />
              </label>
            </div>
            <fieldset>
              <legend>Will you be there?</legend>
              <label><input type="radio" name="attendance" value="yes" required /> Yes, I’ll be there</label>
              <label><input type="radio" name="attendance" value="no" /> Sending love from afar</label>
            </fieldset>
            <fieldset className="attending-fields" hidden disabled>
              <legend>Which events will you attend?</legend>
              <label><input type="checkbox" name="event" value="haldi" defaultChecked /> {content.haldiName}</label>
              <label><input type="checkbox" name="event" value="mehndi" defaultChecked /> {content.mehndiName}</label>
              <label><input type="checkbox" name="event" value="wedding" defaultChecked /> {content.weddingName}</label>
              <div className="rsvp-details">
                <label>Adults (including you)
                  <input type="number" name="adults" defaultValue="1" min="1" max="50" required />
                </label>
                <label>Children
                  <input type="number" name="children" defaultValue="0" min="0" max="49" required />
                </label>
                <label>Meal preference
                  <select name="food" defaultValue="" required>
                    <option value="" disabled>Select a preference</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Veg">Non-vegetarian</option>
                    <option>Jain</option>
                    <option>Vegan</option>
                    <option>Other</option>
                  </select>
                </label>
                <label>Do you need accommodation?
                  <select name="stay" defaultValue="" required>
                    <option value="" disabled>Select an option</option>
                    <option value="No need of stay">No, I’m all set</option>
                    <option>Hotel</option>
                    <option>Home Stay</option>
                  </select>
                </label>
              </div>
              <label>Dietary or accessibility requests (optional)
                <textarea name="requirements" rows="2" maxLength="500" />
              </label>
            </fieldset>
            <button className="primary-button" type="submit">Send RSVP</button>
            <p className="rsvp-status" role="status"></p>
          </form>
        </section>
      </main>
      <footer className="footer">
        <p>{content.firstFullName} and {content.secondFullName}</p>
        <a href="#top">Back to the invitation</a>
      </footer>
      <audio id="wedding-flute" src="/assets/wedding-flute.mp3" preload="none" loop></audio>
      <button className="music-toggle" type="button" aria-label="Play flute music" hidden>
        <span className="music-icon" aria-hidden="true">♪</span>
        <span className="music-label" aria-hidden="true">Play flute</span>
      </button>
      <Script src="/wedding.js" strategy="afterInteractive" />
      <Script src="/guest-guide.js" strategy="afterInteractive" />
    </>
  );
}
