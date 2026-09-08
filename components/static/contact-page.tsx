import Link from "next/link";
import { MailIcon, MessageCircleIcon, PhoneIcon } from "lucide-react";

import { SubpageHeader } from "@/components/common/subpage-header";
import { Container } from "@/components/common/container";
import { ROUTES } from "@/constants/routes";

const SUPPORT_PHONE = "+91 1800 000 0000";
const SUPPORT_EMAIL = "support@alterstay.com";

export function ContactPage() {
  return (
    <>
      <SubpageHeader title="Contact Us" backHref={ROUTES.home} />
      <section className="bg-background pb-16 pt-6 sm:pt-8">
        <Container className="max-w-lg">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Questions about a booking, membership, or partnership? Our team is
            ready to help.
          </p>

          <div className="mt-8 space-y-3">
            <a
              href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}
              className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                <PhoneIcon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Call us</span>
                <span className="block text-xs text-muted-foreground">
                  {SUPPORT_PHONE}
                </span>
              </span>
            </a>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                <MailIcon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Email</span>
                <span className="block text-xs text-muted-foreground">
                  {SUPPORT_EMAIL}
                </span>
              </span>
            </a>

            <Link
              href={ROUTES.help.root}
              className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-colors hover:bg-muted/40"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <MessageCircleIcon className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold">Help centre</span>
                <span className="block text-xs text-muted-foreground">
                  Find a booking and get support
                </span>
              </span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
