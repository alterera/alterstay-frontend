import type { LegalSection } from "@/components/legal/legal-page-shell";

export const termsSections: LegalSection[] = [
  {
    heading: "1. About Alterstay",
    paragraphs: [
      "Alterstay operates an online platform that helps guests discover and book hotel and resort stays across India. By accessing our website or app, creating an account, or completing a booking, you agree to these Terms & Conditions.",
    ],
  },
  {
    heading: "2. Eligibility",
    paragraphs: [
      "You must be at least 18 years old and capable of entering into a binding contract to book a stay. You confirm that the information you provide during registration and checkout is accurate and complete.",
    ],
  },
  {
    heading: "3. Bookings and payments",
    bullets: [
      "A booking is confirmed only after successful payment confirmation from our payment partner.",
      "Prices shown include applicable taxes unless stated otherwise at checkout.",
      "Room availability and rates can change until payment is completed.",
      "You are responsible for reviewing property rules, check-in times, and guest limits before booking.",
    ],
  },
  {
    heading: "4. Guest responsibilities",
    paragraphs: [
      "Guests must carry valid government-issued ID for check-in as required by the property. Alterstay is not responsible for denial of check-in due to incomplete or invalid identification, late arrival, or failure to follow property policies.",
    ],
  },
  {
    heading: "5. Membership and coins",
    paragraphs: [
      "Membership benefits, discounts, and Alterstay coins are governed by the membership plan terms shown at purchase. Coins earned after completed stays may be redeemed subject to the rules displayed at checkout. Membership purchases are generally non-refundable once activated.",
    ],
  },
  {
    heading: "6. Cancellations and refunds",
    paragraphs: [
      "Cancellation and refund eligibility depend on the rate plan and cancellation policy attached to your booking. See our Cancellation Policy for details. Refund timelines may vary based on your bank or payment method.",
    ],
  },
  {
    heading: "7. Platform role",
    paragraphs: [
      "Alterstay facilitates bookings between guests and partner properties. The stay itself is provided by the property. We work with partners to resolve issues, but property-level services, amenities, and on-site experiences remain the partner’s responsibility.",
    ],
  },
  {
    heading: "8. Prohibited use",
    bullets: [
      "Do not misuse the platform for fraudulent bookings or chargebacks without cause.",
      "Do not attempt unauthorised access to accounts, payments, or systems.",
      "Do not scrape, reverse engineer, or disrupt the service.",
    ],
  },
  {
    heading: "9. Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, Alterstay is not liable for indirect, incidental, or consequential damages arising from bookings, property services, or temporary unavailability of the platform. Our total liability for any claim related to a booking is limited to the amount you paid to Alterstay for that booking.",
    ],
  },
  {
    heading: "10. Changes",
    paragraphs: [
      "We may update these terms from time to time. Continued use of Alterstay after changes are posted means you accept the revised terms.",
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    heading: "1. Information we collect",
    bullets: [
      "Account details such as name, phone number, email, and profile preferences.",
      "Booking details including stay dates, guests, payment references, and GST information when provided.",
      "Device and usage data such as browser type, pages viewed, and approximate location for service improvement.",
      "Support communications when you contact us for help.",
    ],
  },
  {
    heading: "2. How we use your information",
    bullets: [
      "To create and manage your account and bookings.",
      "To process payments and send booking confirmations or updates.",
      "To provide customer support and resolve disputes.",
      "To personalise offers, membership benefits, and relevant recommendations.",
      "To detect fraud, secure our platform, and meet legal obligations.",
    ],
  },
  {
    heading: "3. Sharing of information",
    paragraphs: [
      "We share booking information with the selected property so they can honour your stay. Payment details are processed by regulated payment partners and are not stored as full card numbers on Alterstay systems. We may share data with service providers who help us operate the platform under confidentiality obligations, or when required by law.",
    ],
  },
  {
    heading: "4. Data retention",
    paragraphs: [
      "We retain account and booking records for as long as needed to provide the service, handle refunds, resolve disputes, and comply with tax or legal requirements. You may request account deletion subject to pending bookings and statutory retention needs.",
    ],
  },
  {
    heading: "5. Security",
    paragraphs: [
      "We use industry-standard safeguards such as encrypted transport, access controls, and monitoring. No method of transmission over the internet is completely secure, so please protect your login credentials.",
    ],
  },
  {
    heading: "6. Your choices",
    bullets: [
      "Update profile details from your account settings.",
      "Opt out of non-essential marketing communications where available.",
      "Request access, correction, or deletion of personal data by contacting support.",
    ],
  },
  {
    heading: "7. Children’s privacy",
    paragraphs: [
      "Alterstay is not directed to children under 18. We do not knowingly collect personal information from minors without appropriate consent from a parent or guardian.",
    ],
  },
  {
    heading: "8. Contact",
    paragraphs: [
      "For privacy requests, email support@alterstay.com with the subject line “Privacy request”. We will respond within a reasonable timeframe.",
    ],
  },
];

export const cancellationSections: LegalSection[] = [
  {
    heading: "1. Policy overview",
    paragraphs: [
      "Every booking on Alterstay is linked to a cancellation policy from the property’s rate plan. The policy shown at checkout and on your booking confirmation is the policy that applies to that stay.",
    ],
  },
  {
    heading: "2. Free cancellation windows",
    paragraphs: [
      "If your rate includes free cancellation, you may cancel without charge until the deadline displayed for your booking. After that deadline, cancellation fees or full charges may apply as stated in the booking policy text.",
    ],
  },
  {
    heading: "3. Non-refundable rates",
    paragraphs: [
      "Some discounted rates are non-refundable. These bookings generally cannot be cancelled for a refund after confirmation. Please review the policy carefully before paying.",
    ],
  },
  {
    heading: "4. How to cancel",
    bullets: [
      "Open My Bookings and select the upcoming booking.",
      "Follow the cancellation option if available for that reservation.",
      "If you need assistance, use Help and choose the booking, or contact support with your booking ID.",
    ],
  },
  {
    heading: "5. Refunds",
    paragraphs: [
      "Eligible refunds are initiated to the original payment method. Banks and UPI apps may take additional business days to reflect the credit. Membership fees and consumed coins are handled according to membership terms and are separate from room booking refunds.",
    ],
  },
  {
    heading: "6. No-shows and early checkout",
    paragraphs: [
      "If you do not check in as scheduled (no-show), or leave early, refunds follow the property policy for that rate. Alterstay cannot guarantee refunds for unused nights unless the policy or property expressly allows it.",
    ],
  },
  {
    heading: "7. Alterstay-initiated cancellations",
    paragraphs: [
      "In rare cases such as property unavailability or payment confirmation failures after capture, Alterstay may cancel a booking and process a refund or offer an alternative. We will notify you using the contact details on your account.",
    ],
  },
];
