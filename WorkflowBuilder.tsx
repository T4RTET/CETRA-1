import { motion } from "framer-motion";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";

interface BlogArticle {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
}

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center">
        <div className="w-40 flex-shrink-0">
          <Link href="/">
            <img
              src="/assets/logo.png"
              alt="Cetra Logo"
              className="h-16 w-auto invert brightness-0"
              data-testid="img-blog-logo"
            />
          </Link>
        </div>
        <div className="hidden md:flex items-center justify-center gap-8 text-sm font-medium text-muted-foreground flex-1">
          <Link href="/" className="hover:text-white transition-colors" data-testid="link-nav-home">Home</Link>
          <Link href="/blog" className="text-white transition-colors" data-testid="link-nav-blog">Blog</Link>
          <Link href="/about" className="hover:text-white transition-colors" data-testid="link-nav-about">About</Link>
          <Link href="/docs" className="hover:text-white transition-colors" data-testid="link-nav-docs">Docs</Link>
        </div>
        <div className="w-40 flex-shrink-0 flex justify-end">
          <Link href="/login">
            <Button variant="outline" className="hidden sm:flex border-white/10" data-testid="button-login">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function BlogList() {
  const { data: articles, isLoading } = useQuery<BlogArticle[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      <NavBar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-blog-heading">
              Blog
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto" data-testid="text-blog-subtitle">
              Insights on crypto automation, workflow strategies, and scaling your operations.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white/[0.02] border-white/5 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-white/5 rounded w-1/3 mb-4" />
                    <div className="h-6 bg-white/5 rounded w-3/4 mb-3" />
                    <div className="h-4 bg-white/5 rounded w-full mb-2" />
                    <div className="h-4 bg-white/5 rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map((article, index) => (
                <motion.div
                  key={article.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${article.slug}`} data-testid={`link-blog-${article.slug}`}>
                    <Card
                      className="group bg-white/[0.02] border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 cursor-pointer h-full hover-elevate"
                      data-testid={`card-blog-${article.slug}`}
                    >
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                          <Calendar className="w-3.5 h-3.5" />
                          <time data-testid={`text-date-${article.slug}`}>
                            {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                          </time>
                        </div>
                        <h2 className="font-display text-xl font-semibold mb-3 group-hover:text-primary transition-colors" data-testid={`text-title-${article.slug}`}>
                          {article.title}
                        </h2>
                        <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-4" data-testid={`text-desc-${article.slug}`}>
                          {article.description}
                        </p>
                        <div className="flex items-center gap-1 text-sm text-primary font-medium">
                          Read more
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BlogArticlePage() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const { data: article, isLoading } = useQuery<BlogArticle>({
    queryKey: ["/api/blog", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <NavBar />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 max-w-3xl animate-pulse">
            <div className="h-4 bg-white/5 rounded w-1/4 mb-8" />
            <div className="h-10 bg-white/5 rounded w-3/4 mb-4" />
            <div className="h-4 bg-white/5 rounded w-1/3 mb-12" />
            <div className="space-y-3">
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-5/6" />
              <div className="h-4 bg-white/5 rounded w-full" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#020617] text-white">
        <NavBar />
        <main className="pt-32 pb-20 text-center">
          <h1 className="text-2xl font-bold mb-4" data-testid="text-not-found">Article not found</h1>
          <Link href="/blog">
            <Button variant="outline" className="border-white/10" data-testid="button-back-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-primary/30 overflow-x-hidden">
      <NavBar />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/blog">
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-white transition-colors cursor-pointer mb-8 block" data-testid="link-back-blog">
                <ArrowLeft className="w-4 h-4" />
                Back to Blog
              </span>
            </Link>

            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4" data-testid="text-article-title">
              {article.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-12">
              <Calendar className="w-4 h-4" />
              <time data-testid="text-article-date">
                {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </div>

            <article
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-display prose-headings:tracking-tight
                prose-h1:text-3xl prose-h1:mb-6
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-ul:text-muted-foreground
                prose-li:text-muted-foreground
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: article.content }}
              data-testid="article-content"
            />
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export { BlogList, BlogArticlePage };
