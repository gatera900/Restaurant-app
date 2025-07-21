import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useApp } from "@/context/app-context";

export default function Header() {
  const [location] = useLocation();
  const { cart, currentUser } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Orders", href: "/orders" },
    { name: "Farm Stats", href: "/farm-stats" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-3xl font-bold text-sage" style={{ fontFamily: 'Dancing Script, cursive' }}>
              Bite
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-200 font-medium ${
                  isActive(item.href)
                    ? "text-sage"
                    : "text-charcoal hover:text-sage"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-sage hover:bg-sage/90"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* User Button */}
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>

            {/* Admin Link (if user is admin) */}
            {currentUser?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <h2 className="text-2xl font-bold text-sage mb-4" style={{ fontFamily: 'Dancing Script, cursive' }}>
                    Menu
                  </h2>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
                        isActive(item.href)
                          ? "bg-sage/10 text-sage"
                          : "hover:bg-sage/10 text-charcoal"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {currentUser?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-lg hover:bg-sage/10 transition-colors duration-200 font-medium text-charcoal"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
