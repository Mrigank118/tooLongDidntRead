// frontend/src/components/Header.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';
import { Menu, X, CircleDot, LayoutDashboard, Users, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { useTranslation } from 'react-i18next';
import LanguageToggle from './LanguageToggle';

const Header = () => {
  const { t } = useTranslation();
  const [activePage, setActivePage] = useState('features');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  }, [isDarkMode]);

  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage(page);
    const element = document.getElementById(page);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };
  
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="sticky top-0 z-50 pt-10 px-6 bg-background/80">
      <header className="w-full max-w-7xl mx-auto py-4 px-6 md:px-8 flex items-center justify-between">
        <div className="p-4">
          <Logo />
        </div>

        <button
          className="md:hidden p-4 rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
          <div className="rounded-full px-2 py-2 backdrop-blur-md bg-background/80 border border-border shadow-lg">
            <ToggleGroup type="single" value={activePage} onValueChange={(value) => value && setActivePage(value)}>
              <ToggleGroupItem
                value="features"
                className={cn(
                  "px-5 py-3 rounded-full transition-colors relative text-lg",
                  activePage === 'features' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('features')}
              >
                <CircleDot size={18} className="inline-block mr-2" /> {t('nav.features')}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="dashboard"
                className={cn(
                  "px-5 py-3 rounded-full transition-colors relative text-lg",
                  activePage === 'dashboard' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('dashboard')}
              >
                <LayoutDashboard size={18} className="inline-block mr-2" /> {t('nav.platform')}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="pricing"
                className={cn(
                  "px-5 py-3 rounded-full transition-colors relative text-lg",
                  activePage === 'pricing' ? 'text-accent-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={handleNavClick('pricing')}
              >
                <Users size={18} className="inline-block mr-2" /> {t('nav.team')}
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-24 left-4 right-4 bg-background/95 backdrop-blur-md py-6 px-6 border border-border rounded-2xl shadow-lg z-50">
            <div className="flex flex-col gap-5 text-lg">
              <a
                href="#features"
                className={`px-4 py-3 rounded-md transition-colors ${
                  activePage === 'features' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('features')}
              >
                <CircleDot size={18} className="inline-block mr-2" /> {t('nav.features')}
              </a>
              <a
                href="#dashboard"
                className={`px-4 py-3 rounded-md transition-colors ${
                  activePage === 'dashboard' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('dashboard')}
              >
                <LayoutDashboard size={18} className="inline-block mr-2" /> {t('nav.platform')}
              </a>
              <a
                href="#testimonials"
                className={`px-4 py-3 rounded-md transition-colors ${
                  activePage === 'pricing' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                onClick={handleNavClick('testimonials')}
              >
                <Users size={18} className="inline-block mr-2" /> {t('nav.pricing')}
              </a>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base text-muted-foreground">{t('theme.label')}</span>
                <div className="flex items-center gap-3">
                  <Moon size={18} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                  <Switch
                    checked={!isDarkMode}
                    onCheckedChange={toggleTheme}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Sun size={18} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
              </div>

              {/* Desktop language toggle */}
<div className="text-lg px-4 py-2 rounded-full border flex justify-center items-center">
  <LanguageToggle />
</div>
            </div>
          </div>
        )}

        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-3 rounded-full px-4 py-2">
            <Moon size={20} className={`${isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
              checked={!isDarkMode}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
            <Sun size={20} className={`${!isDarkMode ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>

          <LanguageToggle />
        </div>
      </header>
    </div>
  );
};

export default Header;
