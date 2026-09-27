import Link from 'next/link';

/**
 * Closing band — the house list. Batches are allocated to the list first;
 * the newsletter plugin owns the actual signup (platform-served). Until it is
 * configured, the CTA goes to the contact page (a real destination — no ghost
 * links).
 */
export default function ReserveBand() {
  return (
    <section className="dusk on-dark grain bg-stone">
      <div className="container-x py-[clamp(5.5rem,11vw,9.5rem)] text-center">
        <p className="eyebrow eyebrow-center">The list</p>
        <h2 className="tt-1 mx-auto mt-6 max-w-2xl text-paper" data-fx="words">
          Batches go to the list before they go anywhere else.
        </h2>
        <p className="lead mx-auto mt-6 max-w-xl" data-fx="rise">
          Leave your name. You will hear about a pour before it is announced, and never more than once a month.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4" data-fx="rise">
          <Link href="/contact" className="btn btn-primary">
            Join the list
          </Link>
          <Link href="/category/discovery" className="btn btn-ghost">
            Start with the discovery set
          </Link>
        </div>
      </div>
    </section>
  );
}
