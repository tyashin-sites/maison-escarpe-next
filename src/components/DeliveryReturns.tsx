import Link from 'next/link';
import { Truck, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPriceExplicit } from '@/lib/format';

/**
 * "Delivery & returns" on the PDP. Shipping facts come from
 * storeInfo.shippingZones, the returns sentence from storeInfo.returnPolicy —
 * the same structured facts that drive the Offer JSON-LD, so what Google
 * reads and what the visitor reads cannot disagree. Renders nothing it
 * cannot back with data.
 */
export default async function DeliveryReturns() {
  let info;
  try {
    const res = await api.getStoreInfo();
    info = res.data;
  } catch {
    return null;
  }
  const zones = Array.isArray(info?.shippingZones) ? info.shippingZones : [];
  const rp = info?.returnPolicy;
  if (zones.length === 0 && !rp) return null;
  const currency = info?.currency || 'CAD';

  let returnsSentence: string | null = null;
  if (rp?.category === 'not-permitted') {
    returnsSentence = `All sales are final once an order has shipped. Anything damaged, leaking or not as ordered is replaced or refunded when reported within ${rp.defectiveItemWindowDays ?? 7} days of delivery.`;
  } else if (rp?.category === 'finite' && rp.merchantReturnDays) {
    returnsSentence = `Unopened, sealed flacons may be returned within ${rp.merchantReturnDays} days of delivery${rp.returnFees === 'free' ? ' with return shipping covered' : ''}.`;
  }

  return (
    <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {zones.slice(0, 2).map((zone, i) => (
        <div key={i} className="flex items-start gap-3 bg-paper p-5">
          <Truck className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-ink">{zone.name || 'Delivery'}: </span>
            {typeof zone.rate === 'number' && zone.rate > 0 ? `${formatPriceExplicit(zone.rate, currency)} courier` : 'complimentary courier'}
            {zone.estimatedDays ? `, ${zone.estimatedDays.replace(/\s*days?\s*$/i, '')} days` : ''}
          </p>
        </div>
      ))}
      {returnsSentence && (
        <div className="flex items-start gap-3 bg-paper p-5 sm:col-span-2">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground">
            {returnsSentence}{' '}
            <Link href="/return-policy" className="text-brass-deep underline underline-offset-2">
              Full policy
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
