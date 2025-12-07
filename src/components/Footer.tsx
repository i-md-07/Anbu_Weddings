import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const footerLinks = {
    company: [
      { label: "About Us", action: () => onNavigate("home") },
      { label: "Careers", action: () => onNavigate("home") },
      { label: "Press", action: () => onNavigate("home") },
      { label: "Blog", action: () => onNavigate("home") }
    ],
    help: [
      { label: "Contact Support", action: () => onNavigate("home") },
      { label: "FAQ", action: () => onNavigate("home") },
      { label: "Safety Tips", action: () => onNavigate("home") },
      { label: "Trust & Safety", action: () => onNavigate("home") }
    ],
    legal: [
      { label: "Privacy Policy", action: () => onNavigate("home") },
      { label: "Terms of Service", action: () => onNavigate("home") },
      { label: "Cookie Policy", action: () => onNavigate("home") },
      { label: "Community Guidelines", action: () => onNavigate("home") }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Instagram, href: "#instagram", label: "Instagram" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Mail, href: "#email", label: "Email" }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <h3 
              className="mb-4 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: '#8E001C' }}
            >
              VOWS
            </h3>
            <p 
              className="text-[#717182] mb-6 leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
            >
              India's most trusted premium matrimonial platform for the modern generation.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-[#F9F9F9] hover:bg-[#8E001C] text-[#1A1A1A] hover:text-white flex items-center justify-center transition-all"
                >
                  <social.icon className="w-4 h-4" strokeWidth={2} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 
              className="mb-4 text-[#1A1A1A]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-[#717182] hover:text-[#8E001C] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 
              className="mb-4 text-[#1A1A1A]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}
            >
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-[#717182] hover:text-[#8E001C] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 
              className="mb-4 text-[#1A1A1A]"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '16px' }}
            >
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-[#717182] hover:text-[#8E001C] transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p 
              className="text-[#717182] text-center md:text-left"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
            >
              © 2025 VOWS Inc. All rights reserved. Made with ❤️ in India.
            </p>
            <div className="flex gap-6">
              <button 
                onClick={() => onNavigate("home")}
                className="text-[#717182] hover:text-[#8E001C] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
              >
                Privacy
              </button>
              <button 
                onClick={() => onNavigate("home")}
                className="text-[#717182] hover:text-[#8E001C] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
              >
                Terms
              </button>
              <button 
                onClick={() => onNavigate("home")}
                className="text-[#717182] hover:text-[#8E001C] transition-colors"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '14px' }}
              >
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}