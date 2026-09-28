import PageFrame from '@/components/PageFrame';
import ContactForm from './ContactForm';
import { pageMetadata, SITE } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description:
    'Write to Maison Escarpe — join the house list, ask about an attar or a batch, or arrange a private allocation. Burlington, Ontario.',
  path: '/contact',
});

/**
 * Contact — the form is the only channel: no email address, phone or street
 * address has been supplied (docs/ASSET-DEBT.md #7) and none is invented.
 * Submissions land in the Tyashin lead inbox (contact-form plugin).
 */
export default function ContactPage() {
  return (
    <PageFrame>
        <section className="bg-paper">
          <div className="container-x pb-[clamp(2rem,4vw,3.5rem)] pt-[clamp(3rem,7vw,6rem)]">
            <p className="eyebrow">Contact</p>
            <h1 className="tt-1 mt-5 max-w-3xl text-ink">Write to the house.</h1>
            <p className="lead mt-4 max-w-2xl">
              Join the list, ask about an attar, or arrange a private allocation. We answer personally and never
              more than once a month unprompted.
            </p>
          </div>
        </section>
        <section className="section">
          <div className="container-x grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <dl className="space-y-8">
                <div>
                  <dt className="tt-caps text-brass-deep">Where</dt>
                  <dd className="mt-2 font-display text-2xl text-ink">
                    {SITE.city}, {SITE.region}, {SITE.country}
                  </dd>
                  <dd className="mt-1 text-sm text-muted-foreground">Composed at the foot of the Niagara Escarpment.</dd>
                </div>
                <div>
                  <dt className="tt-caps text-brass-deep">Shipping</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/85">
                    Courier across Canada and the United States. Oil is alcohol-free, so it travels as an ordinary
                    liquid.
                  </dd>
                </div>
                <div>
                  <dt className="tt-caps text-brass-deep">Allocations</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink/85">
                    Private Blend batches are offered to the list before they are listed. Tell us which attar you
                    are waiting for.
                  </dd>
                </div>
              </dl>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </PageFrame>
  );
}
