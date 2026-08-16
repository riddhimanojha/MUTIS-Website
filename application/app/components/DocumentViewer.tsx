import { Download } from "lucide-react";

interface DocumentViewerProps {
  url: string;
  title: string;
  height?: number;
}

/**
 * Native browser PDF rendering via <object>, rather than pulling in
 * pdf.js/react-pdf: it works everywhere without a bundler-side worker-file
 * setup, and falls back to a plain link automatically wherever inline PDF
 * rendering isn't supported.
 */
export function DocumentViewer({ url, title, height = 640 }: DocumentViewerProps) {
  return (
    <div className="document-viewer">
      <object data={url} type="application/pdf" className="document-viewer-frame" style={{ height }}>
        <p className="document-viewer-fallback">
          Your browser can&apos;t preview this PDF inline.{" "}
          <a href={url} target="_blank" rel="noreferrer">Open {title} in a new tab</a>.
        </p>
      </object>
      <a
        href={url}
        download
        target="_blank"
        rel="noreferrer"
        className="btn btn-ghost document-viewer-download"
        style={{ textDecoration: "none" }}
      >
        <Download size={15} strokeWidth={1.8} aria-hidden="true" />
        Download {title}
      </a>
    </div>
  );
}
