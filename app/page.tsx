// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { getPageBySlug } from "@/lib/wordpress";

// Next.js Imports
import Link from "next/link";

// Icons
import { AudioLines, Pen, Tag, Github, Send, Archive } from "lucide-react";

// This page is using the craft.tsx component and design system
export default function Home() {
  return (
    <Section>
      <Container>
        <HomeContent />
      </Container>
    </Section>
  );
}

const HomeContent = async () => {

    const page = await getPageBySlug('home');
  return (

    
    <main className="space-y-12">

      <Prose>
        <h1 class="max-w-3xl">
          <Balancer dangerouslySetInnerHTML={{ __html: page.title.rendered }} />
        </h1>

        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </Prose>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts"
        >
          <Pen size={32} />
          <span>
            Blog{" "}
            <span className="block text-sm text-muted-foreground">
              Read all of my blog posts
            </span>
          </span>
        </Link>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts/tags"
        >
          <Tag size={32} />
          <span>
            Tags{" "}
            <span className="block text-sm text-muted-foreground">
              Browse posts by tag
            </span>
          </span>
        </Link>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts/categories"
        >
          <Archive size={32} />
          <span>
            Categories{" "}
            <span className="block text-sm text-muted-foreground">
              Browse posts by category
            </span>
          </span>
        </Link>
        <a
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="https://github.com/tomhayes" target="_blank"
        >
          <Github size={32} />
          <span>
            GitHub{" "}
            <span className="block text-sm text-muted-foreground">
              Check out my GitHub profile
            </span>
          </span>
        </a>
        <a
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="https://open.spotify.com/artist/2BgPc7ntKZPIKjp1psPbAv" target="_blank"
        >
          <AudioLines size={32} />
          <span>
            Spotify{" "}
            <span className="block text-sm text-muted-foreground">
              Did I mention I (try to) make music too?
            </span>
          </span>
        </a>
        <Link
          className="border h-48 bg-accent/50 rounded-lg p-4 flex flex-col justify-between hover:scale-[1.02] transition-all"
          href="/posts/categories"
        >
          <Send size={32} />
          <span>
            Contact{" "}
            <span className="block text-sm text-muted-foreground">
              Get in touch with me
            </span>
          </span>
        </Link>
      </div>
    </main>
  );
};
