import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const navigation = {
    main: [
      { name: "Home", href: "/" },
      { name: "Blog", href: "/blog" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Categories", href: "/categories" },
    ],
    social: [
      { name: "GitHub", href: "#", icon: Github },
      { name: "Twitter", href: "#", icon: Twitter },
      { name: "LinkedIn", href: "#", icon: Linkedin },
      { name: "Email", href: "#", icon: Mail },
    ],
  };

  return (
    <footer className="bg-royal-950 dark:bg-black text-royal-100 border-t border-royal-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold bg-gradient-to-r from-royal-300 to-brown-300 bg-clip-text text-transparent">
              CoBlog
            </h3>
            <p className="text-royal-400 text-sm leading-relaxed">
              A luxurious blogging platform where elegance meets functionality.
              Create, share, and inspire with our premium writing experience.
            </p>
          </div>

          {/* Navigation links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-royal-200">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-royal-400 hover:text-royal-200 transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-royal-200">
              Connect With Us
            </h4>
            <div className="flex space-x-4">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-royal-400 hover:text-royal-200 transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-royal-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-royal-400">
            <p>
              &copy; {new Date().getFullYear()} CoBlog. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-royal-200 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-royal-200 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
