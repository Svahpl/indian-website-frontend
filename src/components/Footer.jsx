import React from "react";
import { Mail, Instagram, Youtube } from "lucide-react";
import GoogleTranslate from "./GoogleTranslate";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Data for footer sections
  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/About" },
    { label: "Contact", href: "/contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Shipping Policy", href: "/shipping-policy" },
  ];

  const contactItems = [
    {
      icon: <Mail size={20} className="text-green-400 flex-shrink-0 mt-0.5" />,
      label: "Official Mail",
      email: "srivenkateswaraagrosandherbs@gmail.com",
    },
    {
      icon: <Mail size={20} className="text-green-400 flex-shrink-0 mt-0.5" />,
      label: "For Requirements",
      email: "Svahpl1@gmail.com",
    },
    {
      icon: <Mail size={20} className="text-green-400 flex-shrink-0 mt-0.5" />,
      label: "For Sales",
      email: "svaherbs@gmail.com",
    },
  ];

  const socialLinks = [
    {
      icon: <Instagram size={20} className="text-green-400" />,
      label: "Instagram",
      links: [
        {
          handle: "svah.2021",
          url: "https://www.instagram.com/svah.2021?utm_source=qr&igsh=MTZrbGswaXE4dXhqeA%3D%3D",
        },
        {
          handle: "svah_nurseries",
          url: "https://www.instagram.com/svah_nurseries?utm_source=qr&igsh=N2Jpb3JwdmJmdmpk",
        },
      ],
    },
    {
      icon: <Youtube size={20} className="text-green-400" />,
      label: "YouTube",
      links: [
        { handle: "@svah-2021", url: "https://www.youtube.com/@svah-2021" },
      ],
    },
  ];

  // Reusable Link Component
  const FooterLink = ({ href, label }) => (
    <li>
      <a
        href={href}
        className="hover:text-green-400 transition-colors duration-200 focus:text-green-400 focus:outline-none"
        aria-label={`Navigate to ${label}`}
      >
        {label}
      </a>
    </li>
  );

  // Contact Item Component
  const ContactItem = ({ icon, label, email }) => (
    <li className="flex items-start gap-3 mb-3">
      {icon}
      <div className="min-w-0 flex-1">
        <span className="text-gray-400 block text-xs uppercase font-medium mb-1">
          {label}
        </span>
        <a
          href={`mailto:${email}`}
          className="text-white hover:text-green-400 transition-colors duration-200 focus:text-green-400 focus:outline-none break-all text-sm"
          aria-label={`Send email to ${email}`}
        >
          {email}
        </a>
      </div>
    </li>
  );

  // Social Links Component
  const SocialItem = ({ icon, label, links }) => (
    <li className="flex items-start gap-3 mb-3">
      {icon}
      <div className="min-w-0 flex-1">
        <span className="text-gray-400 block text-xs uppercase font-medium mb-1">
          {label}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link, index) => (
            <React.Fragment key={link.handle}>
              <a
                href={link.url}
                className="text-white hover:text-green-400 transition-colors duration-200 focus:text-green-400 focus:outline-none text-sm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${label} page ${link.handle}`}
              >
                {link.handle}
              </a>
              {index < links.length - 1 && (
                <span className="text-gray-500 text-sm">|</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </li>
  );

  return (
    <footer className="bg-gray-900 text-gray-200 pt-12 pb-6 mt-10" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 border-b border-gray-700 pb-8">
          {/* Quick Links */}
          <nav className="flex flex-col" aria-labelledby="quick-links-heading">
            <h4
              id="quick-links-heading"
              className="text-lg text-white font-semibold mb-4"
            >
              QUICK LINKS
            </h4>
            <ul className="space-y-3 text-sm" role="list">
              {quickLinks.map((link) => (
                <FooterLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav className="flex flex-col" aria-labelledby="legal-heading">
            <h4
              id="legal-heading"
              className="text-lg text-white font-semibold mb-4"
            >
              LEGAL
            </h4>
            <ul className="space-y-3 text-sm" role="list">
              {legalLinks.map((link) => (
                <FooterLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                />
              ))}
            </ul>
          </nav>

          {/* Contact Info */}
          <div
            className="flex flex-col sm:col-span-2 lg:col-span-1"
            aria-labelledby="contact-heading"
          >
            <h4
              id="contact-heading"
              className="text-lg text-white font-semibold mb-4"
            >
              CONTACT
            </h4>

            {/* Email Contacts */}
            <div className="mb-6">
              <ul className="space-y-1" role="list">
                {contactItems.map((item, index) => (
                  <ContactItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    email={item.email}
                  />
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <ul className="space-y-1" role="list">
                {socialLinks.map((item, index) => (
                  <SocialItem
                    key={index}
                    icon={item.icon}
                    label={item.label}
                    links={item.links}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>

        <GoogleTranslate />

        {/* Bottom Footer */}
        <div className="pt-6 text-sm text-gray-400 text-center sm:text-left">
          <p>
            © {currentYear} SRI VENKATESWARA AGROS AND HERBS. ALL RIGHTS
            RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
