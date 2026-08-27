import { redirect } from "next/navigation";

type BookingLoginRoutePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookingLoginRoutePage({
  params,
  searchParams,
}: BookingLoginRoutePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const qs = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      value.forEach((item) => qs.append(key, item));
    } else if (value !== undefined) {
      qs.set(key, value);
    }
  }

  const suffix = qs.toString();
  redirect(`/properties/${slug}/checkout/login${suffix ? `?${suffix}` : ""}`);
}
