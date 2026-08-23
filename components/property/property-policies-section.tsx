import type {
  PropertyPolicyDetail,
  PropertyRestriction,
} from "@/types/property-detail";

type PropertyPoliciesSectionProps = {
  policies: PropertyPolicyDetail[];
  restrictions: PropertyRestriction[];
  checkInTime: string | null;
  checkOutTime: string | null;
};

export function PropertyPoliciesSection({
  policies,
  restrictions,
  checkInTime,
  checkOutTime,
}: PropertyPoliciesSectionProps) {
  const checkInPolicies = policies.filter(
    (policy) =>
      policy.policyType.toUpperCase().includes("CHECK") ||
      policy.policyType.toUpperCase().includes("REQUIRE"),
  );
  const otherPolicies = policies.filter(
    (policy) => !checkInPolicies.some((item) => item.id === policy.id),
  );

  const defaultBullets = [
    checkInTime ? `Check-in from ${checkInTime}` : null,
    checkOutTime ? `Check-out until ${checkOutTime}` : null,
    "Valid government ID required at check-in",
    "Primary guest must be at least 18 years of age",
  ].filter(Boolean) as string[];

  return (
    <section id="policies" className="scroll-mt-36 space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Policies
        </p>
        <h2 className="mt-1 text-xl font-semibold">What you must know</h2>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Check-in Requirements</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          {defaultBullets.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>{item}</span>
            </li>
          ))}
          {checkInPolicies.map((policy) => (
            <li key={policy.id} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>
                {policy.title}
                {policy.description ? `: ${policy.description}` : ""}
              </span>
            </li>
          ))}
          {otherPolicies.map((policy) => (
            <li key={policy.id} className="flex gap-2">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
              <span>
                {policy.title}
                {policy.description ? `: ${policy.description}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Restrictions
          </p>
          <h3 className="mt-1 text-lg font-semibold">What to follow</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {restrictions.map((restriction) => (
            <div
              key={restriction.id}
              className="rounded-xl border bg-white px-4 py-3 text-sm shadow-sm"
            >
              {restriction.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
