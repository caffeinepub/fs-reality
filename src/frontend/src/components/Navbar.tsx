import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useRouter } from "@tanstack/react-router";
import { Building2, LogIn, LogOut, Menu, Plus, User, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const router = useRouter();

  const navLinks = [
    { label: "Buy", href: "/listings?type=buy", ocid: "nav.buy_link" },
    { label: "Rent", href: "/listings?type=rent", ocid: "nav.rent_link" },
    {
      label: "Commercial",
      href: "/listings?propertyType=commercial",
      ocid: "nav.commercial_link",
    },
  ];

  function handleNavClick(href: string) {
    setMobileMenuOpen(false);
    router.navigate({ to: href } as never);
  }

  return (
    <header className="sticky top-0 z-50 nav-glass border-b border-border/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-foreground">
            FS <span className="text-brand">Realty</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              data-ocid={link.ocid}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link to="/post">
                <Button
                  size="sm"
                  className="bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand gap-2"
                  data-ocid="nav.post_button"
                >
                  <Plus className="w-4 h-4" />
                  Post Property
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    data-ocid="nav.user_menu"
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/my-listings" className="cursor-pointer">
                      My Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={clear}
                    className="text-destructive cursor-pointer"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/post">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 border-brand text-brand hover:bg-brand/10"
                  data-ocid="nav.post_button"
                >
                  <Plus className="w-4 h-4" />
                  Post Property
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                data-ocid="nav.login_button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Logging in..." : "Login"}
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-sm">
          <div className="container px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-ocid={link.ocid}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="block px-4 py-2.5 rounded-md text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/post" onClick={() => setMobileMenuOpen(false)}>
                    <Button
                      size="sm"
                      className="w-full bg-brand hover:bg-brand-dark text-white font-semibold gap-2"
                      data-ocid="nav.post_button"
                    >
                      <Plus className="w-4 h-4" />
                      Post Property
                    </Button>
                  </Link>
                  <Link
                    to="/my-listings"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <User className="w-4 h-4" />
                      My Listings
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      clear();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full gap-2 text-destructive border-destructive hover:bg-destructive/10"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    onClick={() => {
                      login();
                      setMobileMenuOpen(false);
                    }}
                    disabled={isLoggingIn}
                    className="w-full bg-primary text-primary-foreground gap-2"
                    data-ocid="nav.login_button"
                  >
                    <LogIn className="w-4 h-4" />
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
