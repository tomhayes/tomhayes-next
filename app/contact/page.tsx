import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me."
};

export default function Contact() {
  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>Get in touch</h2>
            <p>You can reach me at <a href="mailto:hello@tomhay.es">hello@tomhay.es</a>.</p>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}