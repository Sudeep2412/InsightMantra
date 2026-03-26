const Heading = ({ className, title, text, tag }) => {
  return (
    <div className={`${className || ""} max-w-2xl mx-auto mb-12 lg:mb-16 text-center`}>
      {tag && <span className="inline-block text-brand-500 text-sm font-semibold tracking-wide uppercase mb-3">{tag}</span>}
      {title && <h2 className="text-3xl lg:text-4xl font-bold text-surface-900 leading-tight">{title}</h2>}
      {text && <p className="mt-4 text-surface-500 text-lg leading-relaxed">{text}</p>}
    </div>
  );
};

export default Heading;
