import { Link } from "wouter";
import { Twitter, Github, Linkedin, Send } from "lucide-react";
import { SiDiscord } from "react-icons/si";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#020617] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/">
              <span className="font-display text-2xl font-bold tracking-tight cursor-pointer">
                Cetra<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-sm">
              The visual automation builder for crypto workflows. 
              Stop grinding. Start scaling.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://x.com/Cetra_official" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-discord">
                <SiDiscord className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com/in/cetra-company-8b69533b0/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-linkedin">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://t.me/Cetra_official" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors" data-testid="link-telegram">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a></li>
              <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Reference</a></li>
              <li><Link href="/blog" className="hover:text-primary transition-colors" data-testid="link-footer-blog">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2026 Cetra. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
