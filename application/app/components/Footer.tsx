export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div>© {year} MUTIS · University of Manchester</div>
      <div className="links">
        <a href="https://instagram.com/mutisfinancesoc" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/company/manchester-university-trading-&-investment-society/"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a href="mailto:mutis@manchesterstudentsunion.com">Email</a>
      </div>
    </footer>
  );
}
