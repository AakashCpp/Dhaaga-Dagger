import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, Search, ShoppingBag, TrendingUp, User, X } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  currentPage: string;
  onNavigate: (page: string, category?: string) => void;
}

export default function Header({ cartCount, onCartClick, currentPage, onNavigate }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    ['HOME', undefined],
    ['ALL DROPS', 'ALL'],
    ['FLASH SALE', 'ALL'],
    ['NEW DROPS', 'NEW'],
    ['DENIMS', 'DENIMS'],
    ['CARGOS', 'CARGOS'],
    ['BAGGY', 'BAGGY'],
    ['BOOTCUT', 'BOOTCUT'],
    ['STRAIGHT', 'STRAIGHT'],
    ['WIDE', 'WIDE'],
    ['TOPS', 'TOPS'],
    ['ACCESSORIES', 'ACCESSORIES'],
    ['JEAN CHAINS', 'ACCESSORIES'],
  ] as const;

  const go = (page: string, category?: string) => {
    setMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
    onNavigate(page, category);
  };

  const goContact = () => {
    setMenuOpen(false);
    document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const isOriginals = currentPage === 'originals';
  const showShopNav = currentPage === 'collections';

  return (
    <>
      <motion.header
        initial={{ y: -18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className={`sticky top-0 z-50 border-b ${isOriginals ? 'border-white/25 bg-black text-white' : 'border-[#dedede] bg-white text-black'}`}
      >
        <div className="grid h-[68px] grid-cols-[minmax(4rem,1fr)_auto_minmax(4rem,1fr)] items-center px-3 md:px-5">
          <button onClick={() => setMenuOpen(true)} className="justify-self-start p-2 -ml-2 hover:opacity-60" aria-label="Open menu">
            <Menu size={25} strokeWidth={1.8} />
          </button>

          <button onClick={() => go('originals')} className="justify-self-center px-2" aria-label="Go home">
            <h1 className="brand-logo text-[24px] md:text-[30px] leading-none">
              blurg
              <span>village</span>
            </h1>
          </button>

          <div className="justify-self-end flex items-center gap-3 md:gap-5">
            <button onClick={() => setSearchOpen(true)} className="p-1 hover:opacity-60" aria-label="Search">
              <Search size={24} strokeWidth={1.9} />
            </button>
            <button className="hidden sm:block p-1 hover:opacity-60" aria-label="Account">
              <User size={24} strokeWidth={1.8} />
            </button>
            <button onClick={onCartClick} className="relative p-1 hover:opacity-60" aria-label="Cart">
              <ShoppingBag size={24} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-black px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className={`border-t ${isOriginals ? 'border-white/25 bg-black' : 'border-[#dedede] bg-white'}`}>
          <div className="grid grid-cols-2">
            <button
              onClick={() => go('originals')}
              className={`nav-strip-link px-8 py-3.5 text-[13px] md:text-[14px] uppercase tracking-[1px] ${isOriginals ? 'is-active text-white' : ''}`}
            >
              Blurg-Originals
            </button>
            <button
              onClick={() => go('collections', 'ALL')}
              className={`nav-strip-link border-l px-8 py-3.5 text-[13px] md:text-[14px] uppercase tracking-[1px] ${isOriginals ? 'border-white/25 text-white' : 'is-active border-[#dedede]'}`}
            >
              Blurg-Selects
            </button>
          </div>
        </nav>

        {showShopNav && <nav className="hidden border-t border-[#eeeeee] bg-white md:block">
          <div className="mx-auto max-w-[1600px] px-10">
            <div className="flex h-[39px] items-center justify-between border-b border-[#d7d7d7]">
              {navItems.map(([label, category]) => (
                <button
                  key={label}
                  onClick={() => (category ? go('collections', category) : go('originals'))}
                  data-active={label === 'ALL DROPS' && currentPage === 'collections'}
                  className="h-full px-2 text-[11px] uppercase tracking-[0.03em] text-black/60 hover:text-black data-[active=true]:border-b-2 data-[active=true]:border-black data-[active=true]:font-bold data-[active=true]:text-black"
                >
                  {label === 'FLASH SALE' ? <>FLASH SALE <span className="text-orange-500">⚡</span></> : label}
                </button>
              ))}
            </div>
          </div>
        </nav>}
      </motion.header>

      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.42 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black" onClick={() => setSearchOpen(false)} />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.32 }}
              className="fixed right-0 top-0 z-[71] h-full w-full max-w-[460px] bg-white text-black shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#e4e4e4] px-8 py-5">
                <h2 className="font-inter text-[22px]">Search</h2>
                <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="grid h-11 w-11 place-items-center rounded-full bg-[#e8e8e8]" aria-label="Close search">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8">
                <div className="flex h-16 items-center gap-4 rounded-md border border-black/55 px-6">
                  <Search size={24} strokeWidth={1.8} />
                  <input
                    type="text"
                    placeholder="Search ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-black/55"
                    autoFocus
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3">
                  {['Baggy', 'Bootcut', 'Bracelet', 'Denim'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => go('collections', tag === 'Bracelet' ? 'ACCESSORIES' : tag.toUpperCase())}
                      className="flex items-center gap-2 text-[13px] text-black hover:underline"
                    >
                      <TrendingUp size={15} strokeWidth={1.8} />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[55] bg-black" onClick={() => setMenuOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.32 }}
              className="fixed left-0 top-0 z-[56] h-full w-full max-w-[425px] bg-white text-black"
            >
              <div className="p-4">
                <button onClick={() => setMenuOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-[#eeeeee]" aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>
              <nav className="px-4 pt-2">
                <button onClick={() => go('originals')} className="block w-full py-3 text-left text-[14px] font-medium uppercase hover:opacity-60">Home</button>
                <button onClick={() => go('originals')} className="block w-full py-3 text-left text-[14px] font-medium uppercase hover:opacity-60">Blurg Originals</button>
                <button onClick={() => go('collections', 'ALL')} className="flex w-full items-center justify-between py-3 text-left text-[14px] font-medium uppercase hover:opacity-60">
                  Blurg Selects
                  <ChevronDown size={15} />
                </button>
                <button onClick={goContact} className="block w-full py-3 text-left text-[14px] font-medium uppercase hover:opacity-60">Contact</button>
              </nav>
              <div className="absolute bottom-0 left-0 right-0 border-t border-dashed border-[#dddddd] p-4">
                <button className="flex items-center gap-3 text-[14px] hover:opacity-60">
                  <User size={20} strokeWidth={1.8} />
                  My Account
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
