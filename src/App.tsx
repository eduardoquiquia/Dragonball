import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Zap, Star, Clock, Shield, Flame, ChevronRight, Menu, X,
  Play, Users, Tv, Award, Globe, Code2, Video,
  Camera, ArrowUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink,
} from '@/components/ui/navigation-menu'

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRANSFORMATIONS = [
  {
    name: 'Super Saiyan',
    abbr: 'SSJ',
    color: 'from-yellow-400 to-amber-500',
    glow: 'shadow-yellow-500/40',
    power: 50,
    desc: 'La transformación que marcó una era. Con cabello dorado y ki eléctrico, el poder de Goku se multiplicó por 50.',
    multiplier: '×50',
    img: 'https://images.alphacoders.com/133/thumbbig-1336543.webp',
    badge: 'Legendaria',
    badgeVariant: 'power' as const,
  },
  {
    name: 'Super Saiyan 2',
    abbr: 'SSJ2',
    color: 'from-yellow-300 to-cyan-300',
    glow: 'shadow-cyan-400/40',
    power: 65,
    desc: 'El despertar de Gohan contra Cell. Electricidad salvaje y una aura que hace temblar la tierra.',
    multiplier: '×100',
    img: 'https://images.alphacoders.com/133/thumbbig-1336545.webp',
    badge: 'Épica',
    badgeVariant: 'default' as const,
  },
  {
    name: 'Super Saiyan 3',
    abbr: 'SSJ3',
    color: 'from-yellow-200 to-yellow-500',
    glow: 'shadow-yellow-300/40',
    power: 75,
    desc: 'Cabello hasta la cintura y poder que sacude los cielos. La transformación más intimidante de la saga Z.',
    multiplier: '×400',
    img: 'https://images.alphacoders.com/133/thumbbig-1336546.webp',
    badge: 'Extrema',
    badgeVariant: 'destructive' as const,
  },
  {
    name: 'Super Saiyan God',
    abbr: 'SSG',
    color: 'from-red-400 to-rose-600',
    glow: 'shadow-red-500/40',
    power: 85,
    desc: 'Poder divino canalizado a través del ki de cinco Saiyans puros. Delgado, ágil y devastadoramente poderoso.',
    multiplier: 'Divino',
    img: 'https://images.alphacoders.com/133/thumbbig-1336548.webp',
    badge: 'Divina',
    badgeVariant: 'outline' as const,
  },
  {
    name: 'Super Saiyan Blue',
    abbr: 'SSJB',
    color: 'from-blue-400 to-cyan-500',
    glow: 'shadow-blue-500/40',
    power: 92,
    desc: 'Ki divino combinado con la transformación Super Saiyan. Calma absoluta en el ojo del huracán.',
    multiplier: 'Divino+',
    img: 'https://images.alphacoders.com/133/thumbbig-1336549.webp',
    badge: 'Divina',
    badgeVariant: 'blue' as const,
  },
  {
    name: 'Ultra Instinct',
    abbr: 'UI',
    color: 'from-slate-300 to-violet-400',
    glow: 'shadow-violet-400/50',
    power: 100,
    desc: 'El esquive de los Ángeles. Movimiento independiente de la voluntad. El poder definitivo del universo.',
    multiplier: '∞',
    img: 'https://images.alphacoders.com/133/thumbbig-1336550.webp',
    badge: 'Suprema',
    badgeVariant: 'blue' as const,
  },
]

const WARRIORS = [
  {
    name: 'Goku',
    role: 'Guerrero Z / Saiyan',
    power: 99,
    desc: 'El Saiyan más poderoso del Universo 7. Su sed de combate no tiene límites.',
    img: 'https://images4.alphacoders.com/133/thumb-1920-1336540.webp',
    color: 'from-orange-400 to-yellow-400',
    initials: 'GK',
  },
  {
    name: 'Vegeta',
    role: 'Príncipe Saiyan',
    power: 97,
    desc: 'El orgullo del Príncipe de los Saiyans. Indomable, feroz y en constante evolución.',
    img: 'https://images4.alphacoders.com/133/thumb-1920-1336541.webp',
    color: 'from-blue-400 to-indigo-500',
    initials: 'VG',
  },
  {
    name: 'Gohan',
    role: 'Guerrero Z / Híbrido',
    power: 93,
    desc: 'El hijo de Goku esconde un potencial ilimitado. Cuando despierta, no hay nadie más poderoso.',
    img: 'https://images4.alphacoders.com/133/thumb-1920-1336542.webp',
    color: 'from-yellow-400 to-orange-500',
    initials: 'GH',
  },
  {
    name: 'Piccolo',
    role: 'Namekiano / Mentor',
    power: 88,
    desc: 'El Dios Naranja. Estratega implacable y el maestro que forjó a los guerreros Z.',
    img: 'https://images4.alphacoders.com/133/thumb-1920-1336543.webp',
    color: 'from-green-400 to-emerald-600',
    initials: 'PC',
  },
  {
    name: 'Trunks',
    role: 'Guerrero del Futuro',
    power: 90,
    desc: 'Hijo de Vegeta y Bulma. Llegó del futuro portando una espada y un corazón determinado a salvar el presente.',
    img: 'https://images4.alphacoders.com/133/thumb-1920-1336544.webp',
    color: 'from-purple-400 to-violet-600',
    initials: 'TR',
  },
  {
    name: 'Broly',
    role: 'Saiyan Legendario',
    power: 98,
    desc: 'El Super Saiyan Legendario. Nacido con un poder descontrolado y una furia sin precedentes.',
    img: 'https://images4.alphacoders.com/133/thumb-1920-1336545.webp',
    color: 'from-green-300 to-lime-500',
    initials: 'BR',
  },
]

const TIMELINE = [
  {
    year: '1986',
    title: 'Dragon Ball',
    desc: 'Todo comenzó aquí. Goku niño, las Esferas del Dragón y las aventuras que definieron una generación.',
    episodes: '153 eps',
    color: 'bg-orange-500',
    icon: Star,
  },
  {
    year: '1989',
    title: 'Dragon Ball Z',
    desc: 'Los Saiyans llegan a la Tierra. Villanos míticos, transformaciones legendarias y batallas épicas.',
    episodes: '291 eps',
    color: 'bg-yellow-500',
    icon: Zap,
  },
  {
    year: '1996',
    title: 'Dragon Ball GT',
    desc: 'Goku niño de nuevo en una aventura galáctica para encontrar las Esferas del Dragón Negro.',
    episodes: '64 eps',
    color: 'bg-red-500',
    icon: Globe,
  },
  {
    year: '2015',
    title: 'Dragon Ball Super',
    desc: 'El multiverso se abre. Dioses, Ángeles y la Lucha por la Supervivencia del Universo 7.',
    episodes: '131 eps',
    color: 'bg-blue-500',
    icon: Flame,
  },
  {
    year: '2023',
    title: 'Dragon Ball Daima',
    desc: 'Un nuevo capítulo del universo. Goku y los suyos se enfrentan a misterios del Más Allá.',
    episodes: '20 eps',
    color: 'bg-violet-500',
    icon: Shield,
  },
]

const STATS = [
  { value: 500, suffix: '+', label: 'Episodios', icon: Tv, color: 'text-orange-400' },
  { value: 38, suffix: ' años', label: 'De historia', icon: Clock, color: 'text-yellow-400' },
  { value: 20, suffix: '+', label: 'Transformaciones', icon: Zap, color: 'text-blue-400' },
  { value: 50, suffix: '+', label: 'Villanos icónicos', icon: Flame, color: 'text-red-400' },
  { value: 180, suffix: 'M+', label: 'Fans mundiales', icon: Users, color: 'text-violet-400' },
  { value: 12, suffix: '+', label: 'Películas', icon: Award, color: 'text-green-400' },
]

const GALLERY = [
  { src: 'https://images.alphacoders.com/133/thumbbig-1336540.webp', alt: 'Goku Ultra Instinct', span: 'col-span-2 row-span-2' },
  { src: 'https://images.alphacoders.com/133/thumbbig-1336541.webp', alt: 'Vegeta Super Saiyan Blue', span: '' },
  { src: 'https://images.alphacoders.com/133/thumbbig-1336542.webp', alt: 'Gohan Beast', span: '' },
  { src: 'https://images.alphacoders.com/133/thumbbig-1336543.webp', alt: 'Piccolo', span: '' },
  { src: 'https://images.alphacoders.com/133/thumbbig-1336544.webp', alt: 'Trunks', span: '' },
  { src: 'https://images.alphacoders.com/133/thumbbig-1336545.webp', alt: 'Broly Legendario', span: 'col-span-2' },
]

const FAQ = [
  { q: '¿Dónde puedo ver Dragon Ball?', a: 'Dragon Ball Super está disponible en Crunchyroll. Las sagas clásicas de DBZ están en plataformas como Netflix y Prime Video dependiendo de tu región.' },
  { q: '¿Qué orden debo seguir para ver la saga completa?', a: 'El orden canónico es: Dragon Ball → Dragon Ball Z → Dragon Ball Super. GT es una historia alternativa no canónica. Daima es la más reciente.' },
  { q: '¿Ultra Instinct es la transformación más poderosa?', a: 'Actualmente, Ultra Instinct Dominado es considerado el pico del poder de Goku. Sin embargo, Vegeta con Ultra Ego también alcanza niveles comparables.' },
  { q: '¿Quién es el personaje más fuerte del universo?', a: 'Zeno-sama, el Omni-Rey, es el ser más poderoso en términos de autoridad. En términos de combate, Whis y los Ángeles superan a los Dioses de la Destrucción.' },
]

const NAV_LINKS = ['Transformaciones', 'Guerreros', 'Timeline', 'Galería']

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useAnimatedCounter(target: number, inView: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])
  return count
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionTitle({ tag, title, subtitle }: { tag: string; title: string; subtitle: string }) {
  return (
    <div className="text-center mb-14">
      <Badge variant="outline" className="mb-4 text-orange-400 border-orange-500/50 uppercase tracking-widest text-xs">
        {tag}
      </Badge>
      <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{title}</h2>
      <p className="text-white/60 max-w-xl mx-auto text-lg">{subtitle}</p>
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-950/90 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-xl tracking-tight">
            <span className="text-orange-400">DRAGON</span>
            <span className="text-white"> BALL</span>
          </span>
        </motion.div>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {NAV_LINKS.map((link) => (
              <NavigationMenuItem key={link}>
                <NavigationMenuLink href={`#${link.toLowerCase()}`}>{link}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          <Button size="sm" className="hidden md:flex">Empezar ahora</Button>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="text-orange-400 text-xl font-black">DRAGON BALL</SheetTitle>
              </SheetHeader>
              <ScrollArea className="mt-8 h-[calc(100vh-120px)]">
                <div className="flex flex-col gap-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      className="block px-4 py-3 rounded-lg text-white/80 hover:text-orange-400 hover:bg-white/5 transition-colors font-medium"
                    >
                      {link}
                    </a>
                  ))}
                  <Separator className="my-4" />
                  <Button className="w-full">Empezar ahora</Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 120])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-blue-950/40 to-orange-950/30" />

      {/* Animated energy orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/5 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-orange-500/10 pointer-events-none"
      />

      {/* Dragon Ball stars */}
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-orange-400"
          style={{ top: `${15 + i * 10}%`, left: `${10 + i * 12}%` }}
          animate={{ y: [-10, 10, -10], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Badge variant="power" className="mb-6 text-sm px-4 py-1.5 uppercase tracking-widest">
            ✦ El universo más épico del anime
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-6"
        >
          <span className="block text-white drop-shadow-2xl">DRAGON</span>
          <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-500 bg-clip-text text-transparent drop-shadow-2xl">
            BALL
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Más de tres décadas de batallas legendarias, transformaciones épicas y guerreros que desafían los límites del poder.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="xl"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold shadow-2xl shadow-orange-500/30 border-0 group"
            >
              <Zap className="w-5 h-5 mr-1 group-hover:animate-bounce" />
              Explorar Guerreros
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="xl"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              <Play className="w-5 h-5 mr-2" />
              Ver Transformaciones
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute -bottom-20 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-orange-400" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Transformations() {
  return (
    <section id="transformaciones" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-blue-950/10 to-gray-950" />
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <SectionTitle
            tag="Poder sin límites"
            title="Las Transformaciones Legendarias"
            subtitle="Desde el primer Super Saiyan hasta Ultra Instinct. Cada forma, una revolución en el poder de Goku."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRANSFORMATIONS.map((t, i) => (
            <FadeIn key={t.name} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group h-full"
              >
                <Card className={`h-full overflow-hidden border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:${t.glow}`}>
                  <div className="relative h-52 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-full h-full object-cover object-top opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      onError={(e) => {
                        const el = e.currentTarget
                        el.style.display = 'none'
                        el.parentElement!.classList.add(`bg-gradient-to-br`, ...t.color.split(' '))
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <Badge variant={t.badgeVariant}>{t.badge}</Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <span className={`text-3xl font-black bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>
                        {t.multiplier}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{t.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs font-mono">{t.abbr}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CardDescription className="text-sm leading-relaxed">{t.desc}</CardDescription>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Nivel de poder</span>
                        <span className="text-white/80 font-bold">{t.power}%</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${t.power}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full bg-gradient-to-r ${t.color}`}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function Warriors() {
  const [active, setActive] = useState(0)

  return (
    <section id="guerreros" className="py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-orange-950/10 to-gray-950" />
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <SectionTitle
            tag="Los Elegidos"
            title="Guerreros Z"
            subtitle="Los defensores del universo. Cada uno forjado en el fuego de las batallas más intensas."
          />
        </FadeIn>

        <Tabs defaultValue="grid" className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="grid">Vista Cuadrícula</TabsTrigger>
              <TabsTrigger value="detail">Vista Detalle</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {WARRIORS.map((w, i) => (
                <FadeIn key={w.name} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    onClick={() => setActive(i)}
                    className="cursor-pointer group"
                  >
                    <Card className="overflow-hidden border-white/5 hover:border-orange-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                      <div className="relative h-60 overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${w.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
                        <img
                          src={w.img}
                          alt={w.name}
                          className="w-full h-full object-cover object-top opacity-85 group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
                      </div>
                      <CardContent className="pt-4 pb-5">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar className="w-10 h-10 border-2 border-orange-500/30">
                            <AvatarImage src={w.img} alt={w.name} />
                            <AvatarFallback>{w.initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-white">{w.name}</p>
                            <p className="text-xs text-white/50">{w.role}</p>
                          </div>
                        </div>
                        <p className="text-sm text-white/60 mb-4 leading-relaxed">{w.desc}</p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-white/40">
                            <span>Poder de combate</span>
                            <span className="text-orange-400 font-bold">{w.power}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${w.power}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.2, delay: i * 0.1 }}
                              className={`h-full rounded-full bg-gradient-to-r ${w.color}`}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </FadeIn>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="detail">
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-2">
                {WARRIORS.map((w, i) => (
                  <motion.button
                    key={w.name}
                    onClick={() => setActive(i)}
                    whileHover={{ x: 4 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      active === i ? 'bg-orange-500/20 border border-orange-500/30' : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={w.img} alt={w.name} />
                      <AvatarFallback>{w.initials}</AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-bold text-sm text-white">{w.name}</p>
                      <p className="text-xs text-white/50">{w.role}</p>
                    </div>
                    {active === i && <ChevronRight className="ml-auto w-4 h-4 text-orange-400" />}
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="lg:col-span-2"
                >
                  <Card className="overflow-hidden border-white/10 h-full">
                    <div className="relative h-72">
                      <div className={`absolute inset-0 bg-gradient-to-br ${WARRIORS[active].color} opacity-20`} />
                      <img
                        src={WARRIORS[active].img}
                        alt={WARRIORS[active].name}
                        className="w-full h-full object-cover object-top opacity-80"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-3xl font-black text-white">{WARRIORS[active].name}</h3>
                          <p className="text-orange-400">{WARRIORS[active].role}</p>
                        </div>
                        <Badge variant="power" className="text-base px-3 py-1">
                          {WARRIORS[active].power}%
                        </Badge>
                      </div>
                      <p className="text-white/70 leading-relaxed">{WARRIORS[active].desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

function Timeline() {
  return (
    <section id="timeline" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-violet-950/10 to-gray-950" />
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn>
          <SectionTitle
            tag="La Historia"
            title="Evolución del Universo"
            subtitle="Cuatro décadas de leyendas. Cada saga, un capítulo épico en la historia del anime."
          />
        </FadeIn>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-blue-500 to-violet-500 -translate-x-1/2 hidden md:block" />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const Icon = item.icon
              const isRight = i % 2 === 0
              return (
                <FadeIn key={item.title} delay={i * 0.1}>
                  <div className={`flex items-center gap-6 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Card */}
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Card className="border-white/5 hover:border-white/15 transition-colors">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <Badge variant="secondary" className="text-xs mb-1">{item.year}</Badge>
                                <h3 className="font-black text-white text-lg leading-tight">{item.title}</h3>
                              </div>
                            </div>
                            <p className="text-white/60 text-sm leading-relaxed mb-3">{item.desc}</p>
                            <Badge variant="outline" className="text-xs">
                              <Tv className="w-3 h-3 mr-1" />
                              {item.episodes}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    {/* Center dot */}
                    <div className="hidden md:flex shrink-0 w-10 h-10 rounded-full border-4 border-gray-950 items-center justify-center relative z-10"
                      style={{ background: `linear-gradient(135deg, ${item.color.replace('bg-', '')}, transparent)` }}
                    >
                      <div className={`w-4 h-4 rounded-full ${item.color}`} />
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                </FadeIn>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const count = useAnimatedCounter(stat.value, inView)
  const Icon = stat.icon

  return (
    <FadeIn delay={index * 0.08}>
      <motion.div ref={ref} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card className="text-center p-6 border-white/5 hover:border-white/15 transition-all hover:shadow-xl group">
          <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
            <Icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className={`text-4xl font-black mb-1 ${stat.color}`}>
            {count}{stat.suffix}
          </div>
          <p className="text-white/50 text-sm font-medium">{stat.label}</p>
        </Card>
      </motion.div>
    </FadeIn>
  )
}

function Stats() {
  return (
    <section className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950" />
      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          <SectionTitle
            tag="En números"
            title="El Legado en Cifras"
            subtitle="Décadas de historia condensadas en estadísticas que demuestran por qué Dragon Ball es único."
          />
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STATS.map((stat, i) => <StatCard key={stat.label} stat={stat} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function Gallery() {
  return (
    <section id="galería" className="py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-yellow-950/5 to-gray-950" />
      <div className="max-w-7xl mx-auto relative z-10">
        <FadeIn>
          <SectionTitle
            tag="Universo Visual"
            title="Galería Épica"
            subtitle="Los momentos más icónicos del universo Dragon Ball capturados en imágenes que no olvidarás."
          />
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[200px]">
          {GALLERY.map((img, i) => (
            <FadeIn key={i} delay={i * 0.06}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${img.span}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    const el = e.currentTarget
                    el.style.display = 'none'
                    el.parentElement!.style.background = 'linear-gradient(135deg, #1e293b, #0f172a)'
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-semibold">{img.alt}</p>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <FadeIn>
          <SectionTitle
            tag="Preguntas"
            title="Preguntas Frecuentes"
            subtitle="Todo lo que necesitas saber sobre el universo Dragon Ball."
          />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-white/5 rounded-xl px-4 border border-white/5">
                <AccordionTrigger className="text-left font-semibold text-white/90 hover:text-orange-400">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-950/40 via-gray-950 to-blue-950/40" />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-3xl pointer-events-none"
      />
      <div className="max-w-3xl mx-auto relative z-10 text-center">
        <FadeIn>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-7xl mb-6 select-none"
          >
            ⚡
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            El poder está en{' '}
            <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
              tu interior
            </span>
          </h2>
          <p className="text-xl text-white/60 mb-10 leading-relaxed">
            Únete a millones de fans que ya viven la experiencia definitiva del universo Dragon Ball. La aventura no termina, apenas comienza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="xl"
                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black font-bold shadow-2xl shadow-orange-500/40 border-0"
              >
                <Zap className="w-5 h-5 mr-2" />
                Comenzar la aventura
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button size="xl" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Ver episodios
              </Button>
            </motion.div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

function Footer() {
  const links = {
    Universo: ['Personajes', 'Transformaciones', 'Saga Z', 'Saga Super', 'Villanos'],
    Contenido: ['Episodios', 'Películas', 'Manga', 'Videojuegos', 'Noticias'],
    Comunidad: ['Foro', 'Discord', 'Teorías', 'Fan Art', 'Concursos'],
  }
  const socials = [
    { icon: X, label: 'Twitter / X', href: '#' },
    { icon: Video, label: 'YouTube', href: '#' },
    { icon: Camera, label: 'Instagram', href: '#' },
    { icon: Code2, label: 'GitHub', href: '#' },
  ]

  return (
    <footer className="border-t border-white/10 bg-gray-950 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-400 flex items-center justify-center">
                <Zap className="w-4 h-4 text-black" />
              </div>
              <span className="font-black text-xl">
                <span className="text-orange-400">DRAGON</span>
                <span className="text-white"> BALL</span>
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-6 max-w-xs">
              La enciclopedia definitiva del universo Dragon Ball. Explora personajes, transformaciones y la rica historia de esta saga legendaria.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => {
                const Icon = s.icon
                return (
                  <motion.a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    whileHover={{ scale: 1.15, y: -2 }}
                    className="w-9 h-9 rounded-lg bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/30 flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-white/60 hover:text-orange-400" />
                  </motion.a>
                )
              })}
            </div>
          </div>

          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{section}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/50 hover:text-orange-400 text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator />

        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-sm">
            © 2025 Dragon Ball Universe. Fan site — no oficial. Dragon Ball es propiedad de Toei Animation & Akira Toriyama.
          </p>
          <div className="flex gap-6">
            {['Privacidad', 'Términos', 'Cookies'].map((link) => (
              <a key={link} href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 text-black flex items-center justify-center shadow-2xl shadow-orange-500/30 transition-colors"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Hero />
      <Transformations />
      <Warriors />
      <Timeline />
      <Stats />
      <Gallery />
      <FaqSection />
      <CTA />
      <Footer />
      <ScrollToTop />
    </div>
  )
}
