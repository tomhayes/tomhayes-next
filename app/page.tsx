// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import Balancer from "react-wrap-balancer";
import { getPageBySlug } from "@/lib/wordpress";

// Next.js Imports
import Link from "next/link";

// Icons
import { AudioLines, Pen, Tag, Github, Send, Archive } from "lucide-react";
import { WordPressIcon } from "@/components/icons/wordpress";
import { NextJsIcon } from "@/components/icons/nextjs";

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

    
    <main className="space-y-6">

      <Prose>
        <h1>
          <Balancer>{page.title.rendered}</Balancer>
        </h1>

        <div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
      </Prose>

      <div className="flex justify-between items-center gap-4">
        {/* Vercel Clone Starter */}
        <div className="flex items-center gap-3">
          <a
            className="h-auto block"
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME&envDescription=Add%20WordPress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%20abd%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev"
          >
            {/* eslint-disable-next-line */}
            <img
              className="not-prose my-4"
              src="https://vercel.com/button"
              alt="Deploy with Vercel"
              width={105}
              height={32.62}
            />
          </a>
          <p className="!text-sm sr-only sm:not-sr-only text-muted-foreground">
            Deploy with Vercel in seconds.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <WordPressIcon className="text-foreground" width={32} height={32} />
          <NextJsIcon className="text-foreground" width={32} height={32} />
        </div>
      </div>

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
