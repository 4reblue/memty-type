
import React from 'react';

export function Footer() {
  return (
    <footer className="border-t border-border py-4 mt-auto">
      <div className="container max-w-screen-2xl flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
        <p>© {new Date().getFullYear()} Memty - Learn through typing</p>
        <div className="flex gap-4">
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Help</a>
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Privacy</a>
          <a href="#" className="text-foreground/70 hover:text-primary transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
