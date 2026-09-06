/*
 * English-only tutorials page with the extension download placed first.
 */
import { useEffect, useState } from "react";
import { ChevronDown, Download, ExternalLink, FileArchive } from "lucide-react";

const extensionFile = "/assets/Extension.zip";
const kiwiBrowserUrl = "https://kiwi-browser.br.uptodown.com/android";
function notifyExtensionDownload() {
  const payload = new Blob(["{}"], { type: "application/json" });

  if (typeof navigator !== "undefined" && navigator.sendBeacon?.("/api/download", payload)) {
    return;
  }

  void fetch("/api/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
    keepalive: true,
  }).catch(() => undefined);
}

const tutorials = [
  {
    number: "01",
    title: "Add on PC",
    description:
      "Learn how to add the extension on your computer, from downloading the file to enabling it in your browser.",
    image: "/manus-storage/portal-verde-tutorial-01_f2235159.jpg",
    video: "/assets/tutorial-pc.mp4",
    tag: "PC extension",
    steps: [
      "Download the extension file to your computer.",
      "Open your browser's extensions page and turn on Developer mode.",
      "Choose the option to add or load the extension, then follow the video to finish.",
    ],
  },
  {
    number: "02",
    title: "Add on mobile",
    description:
      "Learn how to add the extension on your phone using Kiwi Browser, following the process shown in the video.",
    image: "/manus-storage/portal-verde-tutorial-02_1d2cd875.jpg",
    video: "/assets/tutorial-mobile.mp4",
    tag: "Kiwi Browser · mobile",
    steps: [
      "Open Kiwi Browser on your phone and go to the extensions menu.",
      "Find the option to add or load an extension, as shown in the video.",
      "Select the indicated file and check that the extension is active in the browser.",
    ],
  },
];

export default function Home() {
  const [openTutorial, setOpenTutorial] = useState<string | null>("01");

  useEffect(() => {
    void fetch("/api/visit", {
      method: "POST",
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  const toggleTutorial = (number: string) => {
    setOpenTutorial((current) => (current === number ? null : number));
  };

  return (
    <div className="site-shell tutorials-page">
      <main>
        <section className="extension-download" aria-labelledby="extension-title">
          <div className="extension-copy">
            <span className="kicker">Extension package</span>
            <h1 id="extension-title">Get the extension.</h1>
            <p>
              Download the extension package first, then choose the tutorial for your computer or mobile device. The same file is ready for both installation paths.
            </p>
            <a
              className="extension-download-button"
              href={extensionFile}
              download="Extension.zip"
              onClick={notifyExtensionDownload}
            >
              <Download size={18} strokeWidth={2.6} />
              Download Extension.zip
            </a>
          </div>
          <div className="extension-card" aria-label="Extension package details">
            <FileArchive size={34} strokeWidth={1.7} />
            <strong>Extension.zip</strong>
            <span>Ready to download</span>
            <small>Use the video below for your device.</small>
          </div>
        </section>

        <section className="content-section tutorials-only" id="tutoriais">
          <div className="tutorial-list">
            {tutorials.map((tutorial, index) => {
              const isOpen = openTutorial === tutorial.number;
              return (
                <article className={`tutorial-card ${index % 2 === 1 ? "reverse" : ""}`} key={tutorial.number}>
                  <div className="step-number" aria-label={`Tutorial ${tutorial.number}`}>
                    {tutorial.number}
                  </div>
                  <div className="tutorial-copy">
                    <span className="kicker">Tutorial {tutorial.number}</span>
                    <h3>{tutorial.title}</h3>
                    <p>{tutorial.description}</p>
                    <button
                      className="tutorial-toggle"
                      type="button"
                      data-open={isOpen}
                      onClick={() => toggleTutorial(tutorial.number)}
                      aria-expanded={isOpen}
                      aria-controls={`tutorial-${tutorial.number}`}
                    >
                      {isOpen ? "Hide steps" : "Show steps"}
                      <ChevronDown size={17} className={isOpen ? "rotate-180" : ""} />
                    </button>
                    <div className="tutorial-details" id={`tutorial-${tutorial.number}`} data-open={isOpen}>
                      <div>
                        <ol className="tutorial-steps">
                          {tutorial.steps.map((step, stepIndex) => (
                            <li key={step}>
                              <strong>{stepIndex + 1}</strong>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                  <div className="tutorial-visual">
                    <video
                      src={tutorial.video}
                      poster={tutorial.image}
                      controls
                      playsInline
                      preload="metadata"
                      className={`tutorial-video tutorial-video-${tutorial.number.toLowerCase()}`}
                      aria-label={`Video for ${tutorial.title}`}
                    />
                    <span className="visual-tag">{tutorial.tag}</span>
                    {tutorial.number === "02" && (
                      <a
                        className="kiwi-download-card"
                        href={kiwiBrowserUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label="Download Kiwi Browser for Android"
                      >
                        <span className="kiwi-download-copy">
                          <strong>Need Kiwi Browser?</strong>
                          <small>Download the Android browser to follow the mobile tutorial.</small>
                        </span>
                        <span className="kiwi-download-action">
                          Download <ExternalLink size={16} strokeWidth={2.5} />
                        </span>
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
