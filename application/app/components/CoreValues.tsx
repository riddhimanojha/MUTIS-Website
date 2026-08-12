interface CoreValue {
  title: string;
  description: string;
}

const CORE_VALUES: CoreValue[] = [
  {
    title: "Stewardship",
    description:
      "Ensuring the long-term sustainability of our community and the responsible management of our partnership resources.",
  },
  {
    title: "Meritocracy",
    description:
      "We uphold a culture where talent and performance drive opportunity, ensuring the best minds are in the spotlight.",
  },
  {
    title: "Integrity",
    description:
      "We strive to maintain the highest ethical standards in all events and professional interactions.",
  },
  {
    title: "Initiative",
    description:
      "Fostering a proactive mindset that drives students to lead, innovate and create value in an ever-changing industry.",
  },
];

export function CoreValues() {
  return (
    <section className="page-section" style={{ borderTop: "1px solid var(--hair)" }}>
      <div className="inner">
        <div className="page-eyebrow"><span className="bar" />Our Principles</div>
        <h2 className="r-up">Core Values</h2>
        <div className="core-values-grid r-up">
          {CORE_VALUES.map((value) => (
            <div className="core-value-card" key={value.title}>
              <div className="core-value-title">{value.title}</div>
              <p className="core-value-desc">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
