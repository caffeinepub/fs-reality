import { Link } from "@tanstack/react-router";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
                <Building2 className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight">
                FS <span className="text-brand">Realty</span>
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              India's trusted real estate marketplace. Find your dream home
              across the country's top cities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Buy Property", href: "/listings?type=buy" },
                { label: "Rent Property", href: "/listings?type=rent" },
                {
                  label: "Commercial",
                  href: "/listings?propertyType=commercial",
                },
                { label: "Post Property", href: "/post" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-brand transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Cities */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand">
              Top Cities
            </h4>
            <ul className="space-y-2">
              {[
                "Mumbai",
                "Delhi",
                "Bangalore",
                "Chennai",
                "Hyderabad",
                "Pune",
              ].map((city) => (
                <li key={city}>
                  <a
                    href={`/listings?city=${city}`}
                    className="text-sm text-primary-foreground/70 hover:text-brand transition-colors flex items-center gap-1.5"
                  >
                    <MapPin className="w-3 h-3" />
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-brand">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone className="w-4 h-4 text-brand shrink-0" />
                <span>+916398071796</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail className="w-4 h-4 text-brand shrink-0" />
                <span>faisalbiba1@gmail.com</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                <span>Nariman Point, Mumbai - 400021</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-primary-foreground/10 flex items-center justify-center">
          <p className="text-sm text-primary-foreground/60">
            © {currentYear} Faisal Property. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
