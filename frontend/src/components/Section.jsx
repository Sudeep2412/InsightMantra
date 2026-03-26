const Section = ({ className, id, children }) => {
  return (
    <section
      id={id}
      className={`relative py-16 lg:py-24 ${className || ""}`}
    >
      {children}
    </section>
  );
};

export default Section;
