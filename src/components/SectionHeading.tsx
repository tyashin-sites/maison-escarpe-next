interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  /** Use the masked word reveal (below-fold sections only — LCP law). */
  words?: boolean;
}

export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', words = false }: SectionHeadingProps) {
  const center = align === 'center';
  return (
    <div className={`mb-[clamp(2.5rem,5vw,4rem)] max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow mb-5 ${center ? 'eyebrow-center' : ''}`}>{eyebrow}</p>
      <h2 className="tt-1" {...(words ? { 'data-fx': 'words' } : { 'data-fx': 'rise' })}>
        {title}
      </h2>
      {subtitle && (
        <p className="lead mt-4" data-fx="rise">
          {subtitle}
        </p>
      )}
    </div>
  );
}
