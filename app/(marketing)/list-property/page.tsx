import { Container } from "@/components/common/container";
import { SubpageHeader } from "@/components/common/subpage-header";

export default function ListPropertyPage() {
  return (
    <>
      <SubpageHeader title="List your property" variant="brand" />
      <Container className="py-10">
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
          We&apos;re building a simple way for hotels and hosts to list on
          Alterstay. This page is a placeholder — check back soon.
        </p>
      </Container>
    </>
  );
}
