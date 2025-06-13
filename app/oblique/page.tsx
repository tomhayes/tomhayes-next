import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import ObliqueGenerator from "./oblique-generator";

export const metadata: Metadata = {
  title: "Cool stuff > Oblique",
  description: "AI-generated creative prompts in the style of Brian Eno's Oblique Strategies."
};

export default function Oblique() {
  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>Oblique</h2>
          <p>After thinking about how AI could be used to assist creativity rather than replace it, I created this simple AI-based tool to generate creative prompts similar to Brian Eno&apos;s <a href="https://en.wikipedia.org/wiki/Oblique_Strategies">Oblique Strategies</a>,
          a card-based system for self-imposing restraints and limitations in order to foster creativity and eliminate creative block.</p>

          <p>This is purely an experiment for myself in using AI, but if you find it interesting (or even useful), please <a href="/contact">let me know</a>!</p>
        </Prose>
        
        <ObliqueGenerator />
        
        <BackButton />
      </Container>
    </Section>
  );
}