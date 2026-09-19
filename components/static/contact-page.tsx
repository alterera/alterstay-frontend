import Link from "next/link";
import {
  ClockIcon,
  HeadphonesIcon,
  MailIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
} from "lucide-react";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

const SUPPORT_PHONE = "+91 1800 000 0000";
const SUPPORT_EMAIL = "support@alterstay.com";

const CONTACT_CHANNELS = [
  {
    id: "phone",
    title: "Call us",
    description: "Speak with our support team for urgent booking help.",
    value: SUPPORT_PHONE,
    href: `tel:${SUPPORT_PHONE.replace(/\s/g, "")}`,
    icon: PhoneIcon,
    accent: "bg-brand/10 text-brand",
  },
  {
    id: "email",
    title: "Email support",
    description: "We usually respond within one business day.",
    value: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    icon: MailIcon,
    accent: "bg-sky-50 text-sky-700",
  },
  {
    id: "help",
    title: "Help centre",
    description: "Find a booking and get step-by-step assistance.",
    value: "Browse help topics",
    href: ROUTES.help.root,
    icon: HeadphonesIcon,
    accent: "bg-emerald-50 text-emerald-700",
  },
] as const;

export function ContactPage() {
  return (
    <>
      <SubpageHeader title="Contact Us" backHref={ROUTES.home} mobileOnly />
      <section className="bg-background pb-16 pt-6 sm:pt-10 lg:pt-12">
        <Container className="max-w-5xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand">
                We&apos;re here to help
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Contact Alterstay
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Questions about a booking, membership, or partnership? Choose
                the channel that works best for you and our team will guide you
                through the next step.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {CONTACT_CHANNELS.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <a
                      key={channel.id}
                      href={channel.href}
                      className="group rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-md"
                    >
                      <span
                        className={`inline-flex size-11 items-center justify-center rounded-xl ${channel.accent}`}
                      >
                        <Icon className="size-5" />
                      </span>
                      <p className="mt-4 text-base font-semibold text-foreground">
                        {channel.title}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {channel.description}
                      </p>
                      <p className="mt-3 text-sm font-medium text-brand">
                        {channel.value}
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border bg-gradient-to-br from-brand/8 via-white to-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white">
                    <MessageCircleIcon className="size-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Need booking help?</p>
                    <p className="text-xs text-muted-foreground">
                      Start with your reservation details
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  If you already have a stay with us, the fastest path is through
                  the Help Centre where you can pick a booking or enter your
                  booking ID.
                </p>
                <Button
                  render={<Link href={ROUTES.help.root} />}
                  className="mt-5 w-full rounded-xl"
                >
                  Go to Help Centre
                </Button>
              </div>

              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <ClockIcon className="mt-0.5 size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">Support hours</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Monday to Sunday, 9:00 AM – 9:00 PM IST
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3">
                  <MapPinIcon className="mt-0.5 size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-semibold">Head office</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Guwahati, Assam, India
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
