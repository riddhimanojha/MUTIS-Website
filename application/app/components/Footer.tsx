import { Link } from "react-router";
import { useSiteSettings } from "@/app/hooks/useSiteSettings";

export function Footer() {
  const year = new Date().getFullYear();
  const { settings } = useSiteSettings();
  return (
    <footer className="footer">
      <div>© {year} MUTIS · University of Manchester</div>
      <div className="links">
        <a href={settings.instagram_url} target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href={settings.linkedin_url} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={`mailto:${settings.contact_email}`}>Email</a>
        <Link to="/privacy">Privacy</Link>
      </div>
    </footer>
  );
}
