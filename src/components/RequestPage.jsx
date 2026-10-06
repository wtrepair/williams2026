import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import { contact } from "../content";
import "./RequestPage.css";

export default function RequestPage() {
  const frameRef = useRef(null);
  const [height, setHeight] = useState(2200);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (loaded) return;
    const timer = window.setTimeout(() => setSlow(true), 15000);
    return () => window.clearTimeout(timer);
  }, [loaded]);

  useEffect(() => {
    // Jobber's original embed posts its height as a pixel string. Only accept
    // messages from this form, so other embeds cannot resize or scroll it.
    const receiveMessage = (event) => {
      if (
        event.origin !== new URL(contact.requestEmbedUrl).origin ||
        event.source !== frameRef.current?.contentWindow
      )
        return;
      if (event.data === "scrolltop") {
        frameRef.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
        return;
      }
      const value = String(event.data);
      if (!/^\d+(?:\.\d+)?(?:px)?$/.test(value)) return;
      const nextHeight = Number.parseFloat(value);
      if (nextHeight >= 200 && nextHeight <= 20000) {
        setHeight(Math.ceil(nextHeight));
        setLoaded(true);
      }
    };
    window.addEventListener("message", receiveMessage);
    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  return (
    <section className="request-page wrap">
      <div className="request-heading">
        <div>
          <p className="eyebrow">YOUR NEXT PROJECT STARTS HERE.</p>
          <h1>
            LET’S GET TO <span>WORK.</span>
          </h1>
          <p>
            Tell us about your property and what you need. Send your request
            directly to the Williams team.
          </p>
        </div>
        <a className="request-phone" href={contact.tel}>
          <Phone size={19} />
          <span>
            Prefer to call?<strong>{contact.phone}</strong>
          </span>
        </a>
      </div>
      <div className="request-form-bar">
        <span>WILLIAMS / REQUEST FORM</span>
        <a href={contact.requestUrl} target="_blank" rel="noreferrer">
          Open form in a new tab <ArrowUpRight size={16} />
        </a>
      </div>
      <div className="request-form-shell">
        {slow && !loaded ? (
          <div className="request-loading" role="status">
            <p>The embedded form is taking longer to load.</p>
            <a
              className="button"
              href={contact.requestUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open the request form <ArrowUpRight size={17} />
            </a>
          </div>
        ) : (
          !loaded && (
            <p className="request-loading" role="status">
              Loading your request form…
            </p>
          )
        )}
        <iframe
          ref={frameRef}
          className="jobber-request-frame"
          title="Williams Solutions service request form"
          src={contact.requestEmbedUrl}
          style={{ height: loaded ? height : slow ? 0 : 600 }}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <p className="request-form-help">
        Having trouble with the form?{" "}
        <a href={contact.requestUrl} target="_blank" rel="noreferrer">
          Open it directly <ArrowUpRight size={13} />
        </a>{" "}
        or call <a href={contact.tel}>{contact.phone}</a>.
      </p>
    </section>
  );
}
