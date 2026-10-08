type PropertyMobileAboutSectionProps = {
  description: string | null;
};

export function PropertyMobileAboutSection({
  description,
}: PropertyMobileAboutSectionProps) {
  const about = description?.trim() ?? "";
  if (!about) return null;

  return (
    <section className="scroll-mt-36 space-y-2 lg:hidden">
      <h2 className="text-base font-semibold">About this property</h2>
      <p className="text-sm leading-relaxed text-muted-foreground">{about}</p>
    </section>
  );
}
