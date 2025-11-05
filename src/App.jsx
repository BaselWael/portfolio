// src/App.jsx
import React, { useEffect, useMemo, useState, useRef, createContext, useContext, memo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import {
  Github, Linkedin, Mail, Phone, MapPin, ExternalLink,
  Languages, Download, Menu, X, Sparkles, CheckCircle2, Monitor, Bot,
  Code2, LayoutDashboard, ShoppingCart, Quote, ChevronLeft, ChevronRight, Smartphone
} from "lucide-react";


/* ================ Utils ================ */
function cn(...a) { return a.filter(Boolean).join(" "); }

/* ================ Button (Motion + Ripple + Lift) ================ */
function Button(props) {
  const {
    children, asChild = false, href, onClick,
    variant = "solid", size = "md", className = "",
    type = "button", title, ...rest
  } = props;

  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - r.left}px`);
    el.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  const base = "relative overflow-hidden group inline-flex items-center justify-center rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2", lg: "px-5 py-2.5 text-base" };
  const variants = {
    solid: "bg-indigo-600 text-white hover:bg-indigo-600/90 border-transparent shadow-sm",
    outline: "bg-white text-slate-900 border-slate-300 hover:bg-slate-100/70",
    ghost: "bg-transparent text-slate-700 border-transparent hover:bg-slate-100/70",
    secondary: "bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200/80"
  };
  const cls = cn(base, sizes[size], variants[variant], className);

  const ripple = (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{
        background: "radial-gradient(140px 140px at var(--x) var(--y), rgba(99,102,241,.18), transparent 60%)"
      }}
    />
  );

  if (asChild && href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        onMouseMove={onMove}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cls}
        title={title}
        {...rest}
      >
        {ripple}
        <span className="relative z-10">{children}</span>
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cls}
      title={title}
      {...rest}
    >
      {ripple}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

/* ================ Card (Motion + Shine) ================ */
const Card = ({ className = "", children, interactive = true }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={interactive ? onMove : undefined}
      whileHover={interactive ? { y: -4 } : undefined}
      whileTap={interactive ? { y: -1 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={cn("group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", className)}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "radial-gradient(220px 220px at var(--mx) var(--my), rgba(99,102,241,.12), transparent 60%)"
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
const CardHeader = ({ children, className = "" }) => <div className={cn("px-6 pt-6", className)}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
const CardContent = ({ children, className = "" }) => <div className={cn("px-6 pb-6", className)}>{children}</div>;
const Badge = ({ children, className = "" }) => (
  <motion.span
    whileHover={{ scale: 1.05 }}
    className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs bg-white border-slate-200", className)}
  >
    {children}
  </motion.span>
);

/* ================ Tabs ================ */
const TabsCtx = createContext(null);
function Tabs({ defaultValue, children }) {
  const [value, setValue] = useState(defaultValue);
  return <TabsCtx.Provider value={{ value, setValue }}>{children}</TabsCtx.Provider>;
}
const TabsList = ({ children, className = "" }) => (
  <div className={cn("inline-flex rounded-xl border border-slate-200 bg-white p-1", className)}>{children}</div>
);
function TabsTrigger({ value, children }) {
  const ctx = useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <motion.button
      type="button"
      onClick={() => ctx.setValue(value)}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "px-4 py-2 rounded-lg text-sm transition-colors",
        active ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
      )}
    >
      {children}
    </motion.button>
  );
}
function TabsContent({ value, children }) {
  const ctx = useContext(TabsCtx);
  if (ctx.value !== value) return null;
  return <div className="mt-4">{children}</div>;
}

/* ================ Data (filled) ================ */
const profile = {
  name: "Basel Wael",
  role: "Full-Stack Developer",
  taglineAr: "Full-Stack (Laravel) — APIs قوية، أداء عالي، وواجهات React/Next أنيقة بحركة سلسة.",
  taglineEn: "Full-Stack (Laravel) — robust APIs, high performance, and elegant React/Next UIs with smooth motion.",
  location: "Cairo, Egypt",
  email: "bslwael@gmail.com",
  phone: "+20 155 912 9550",
  photo: "/me.png",
  cvUrl: "/cv.pdf",
  socials: {
    github: "https://github.com/BaselWael",
    linkedin: "https://www.linkedin.com/in/basel-wael-039b60166/",
  },
};

/* Projects */
const projects = [
  {
    id: 1,
    title: "Siasi — Social Network (Web + Mobile)",
    descAr:
      "مدير مشروع + Backend Dev: تحليل وإعادة تصميم بعض الخوارزميات وبنية البيانات، بناء API كاملة لتطبيق الموبايل مع تماثل وظائف الموقع، إدارة فريق التطوير والتسليم.",
    descEn:
      "Project Manager + Backend Dev: refined algorithms/DB design, delivered full mobile APIs mirroring the site, led the team end-to-end.",
    tech: ["Laravel", "MySQL", "REST API", "JWT"],
    live: "https://play.google.com/store/apps/details?id=com.app.siasi",
    repo: null,
    img: "https://images.unsplash.com/photo-1520975922371-b0e0a3ed9f75?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Tehama — News Platform (Web + Mobile)",
    descAr:
      "مدير مشروع + Backend Dev: نظام محتوى متعدد اللغات مع مقالات وتصنيفات وأدوار وإشعارات وAdSense ومقاطع يوتيوب من اللوحة. دعم اختياري بسيط لاستيراد RSS، بينما المصدر الأساسي للأخبار باحثون سياسيون يضيفون المحتوى يدويًا بجودة عالية.",
    descEn:
      "PM + Backend Dev: multilingual news CMS (articles, categories, roles, notifications, AdSense, curated YouTube). RSS import is only a small optional module; core content is curated by political researchers.",
    tech: ["Laravel", "MySQL", "Notifications", "Admin Panel"],
    live: "https://play.google.com/store/apps/details?id=com.ncodeslab.TehamaNews",
    repo: null,
    img: "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Kidflix — Kids VOD (Mobile + Admin)",
    descAr:
      "مدير مشروع + Backend Dev: API ولوحة تحكم لمكتبة مرئية للأطفال مع تصنيفات عمرية وخطط مشاهدة وضبط أبوي.",
    descEn:
      "PM + Backend Dev: APIs + admin for age-appropriate video library with parental controls and plans.",
    tech: ["Laravel", "MySQL", "Admin Panel", "Parental Control"],
    live: "#",
    repo: null,
    img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "FormsHub — منصة أسئلة (بديلة Google Forms)",
    descAr:
      "مدير مشروع + Full-Stack: نماذج قابلة للتخصيص (اختيارات/نص/مصفوفات)، روابط عامة/خاصة، لوحة نتائج، تصدير CSV/Excel، Webhooks.",
    descEn:
      "PM + Full-Stack: customizable forms (MCQ/text/matrix), public/private links, analytics dashboard, CSV/Excel export, webhooks.",
    tech: ["React", "Laravel", "MySQL", "File Export"],
    live: "#",
    repo: null,
    img: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "BeesBus — Freelance Marketplace",
    descAr:
      "مدير مشروع: ملفات شخصية، عروض/مناقصات، محفظة ومدفوعات، مراسلات، تقييمات، وإدارة نزاعات أساسية.",
    descEn:
      "Project Manager: profiles, bids/proposals, wallet & payments, messaging, ratings, basic disputes.",
    tech: ["Next.js", "Node.js", "Payments", "Notifications"],
    live: "#",
    repo: null,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 6,
    title: "ERP Platform — Operations Suite",
    descAr:
      "مدير مشروع: تحليلات، إدارة مخازن وموارد ورواتب وفواتير، صلاحيات، تقارير ولوحات قيادة، تكاملات دفع وبريد.",
    descEn:
      "Project Manager: analytics, inventory/HR/payroll/invoicing, RBAC, dashboards/reports, payment/email integrations.",
    tech: ["Laravel", "MySQL", "RBAC", "Reports"],
    live: "#",
    repo: null,
    img: "https://images.unsplash.com/photo-1551281044-8a6b5995f16a?q=80&w=1400&auto=format&fit=crop",
  },
];
// تايل مهارة بشكل مستطيل + أنيميشن خفيفة
const SkillTile = ({ label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ delay, duration: 0.35, ease: "easeOut" }}
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="rounded-lg border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/70 px-3 py-2 text-sm shadow-sm hover:shadow-md overflow-hidden"
  >
    <span className="relative block">
      {label}
      {/* لمعة خفيفة على الهوفر */}
      <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity [background:linear-gradient(110deg,transparent,rgba(255,255,255,.7),transparent)] [background-size:200%_100%] group-hover:[animation:sheen_1.2s_linear]"></span>
    </span>
  </motion.div>
);
// شارة مهارة خفيفة
const SkillChip = ({ label, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, y: 6 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ delay, duration: 0.25, ease: "easeOut" }}
    whileHover={{ scale: 1.04, y: -1 }}
    className="justify-self-start inline-flex items-center gap-2 rounded-full
               border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700
               shadow-sm hover:shadow transition"
  >
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
    {label}
  </motion.span>
);

// Tabs للمهارات
const SkillsTabs = ({ lang, groups, labels }) => {
  const keys = Object.keys(groups);
  const [active, setActive] = useState(keys.includes("backend") ? "backend" : keys[0]);

  return (
    <div className="space-y-5">
      {/* شريط التابات */}
      <div className="relative flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/70 p-2">
        {keys.map((k) => {
          const isActive = k === active;
          const label = labels?.[k]?.[lang] ?? k;
          return (
            <button
              key={k}
              onClick={() => setActive(k)}
              className={`relative overflow-hidden rounded-full px-4 py-1.5 border transition
              ${isActive ? "border-indigo-600" : "border-slate-200 hover:border-slate-300"}`}
            >
              {isActive && (
                <motion.span
                  layoutId="skills-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600/95"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className={`relative z-10 text-sm ${isActive ? "text-white" : "text-slate-700"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* محتوى التاب */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-slate-200 bg-white/80 p-4"
        >
          {/* شيبس صغيرة لا تتمدّد؛ صفوف ملتفة بدل جريد */}
          <div className="flex flex-wrap gap-2">
            {groups[active].map((item, i) => (
              <SkillChip key={item} label={item} delay={i * 0.02} />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};




/* Skills */
const skills = {
  frontend: [
    "React", "Next.js", "TailwindCSS", "Framer Motion", "Vite"
  ],
  backend: [
    "Laravel", "PHP", "REST", "Sanctum/JWT",
    "MySQL", "Redis", "SQL Server", "SQLite",
    "Queues", "Caching", "PHPUnit"
  ],
  mobile: [
    "Android", "iOS", "Push Notifications", "Deep Links", "Offline Sync"
  ],
  desktop: [
    "C#", "VB.NET", ".NET", "WinForms", "WPF", "SQL Server", "Reporting/Printing"
  ],
  automation: [
    "Python", "Requests", "BeautifulSoup", "Selenium", "Pandas", "Schedulers"
  ],
  security: [
    "Input Validation", "Hashing", "Rate Limiting", "Logging", "OWASP Basics"
  ],
  devops: [
    "Nginx", "Docker", "CI/CD", "Linux", "Cloudflare"
  ],
  tools: [
    "Git", "Postman", "Stripe", "Figma"
  ]
};
const skillLabels = {
  frontend: { ar: "الواجهة", en: "Frontend" },
  backend: { ar: "الخلفية (Laravel/PHP)", en: "Backend (Laravel/PHP)" },
  mobile: { ar: "موبايل", en: "Mobile" },
  desktop: { ar: "تطبيقات سطح المكتب", en: "Desktop Apps" },
  automation: { ar: "أتمتة & Scraping (Python)", en: "Automation & Scraping (Python)" },
  security: { ar: "أساسيات الأمن", en: "Security Basics" },
  devops: { ar: "DevOps", en: "DevOps" },
  tools: { ar: "أدوات", en: "Tools" },
};



/* Experience */
const experience = [
  { year: "Aug 2023–Present", titleAr: "Freelance — Project Manager & Consultant", titleEn: "Freelance — Project Manager & Consultant", detailsAr: "إدارة وتسليم منتجات ويب وموبايل (Siasi, Tehama, Kidflix, FormsHub, BeesBus, ERP). تخطيط، تنسيق فرق، نشر على السيرفرات، إدارة الدومينات والتكاملات.", detailsEn: "Managed deliveries (Siasi, Tehama, Kidflix, FormsHub, BeesBus, ERP). Planning, team coordination, server deploys, domains and integrations." },
  { year: "Jan 2022–Jul 2022", titleAr: "Software Engineer — Smartly", titleEn: "Software Engineer — Smartly", detailsAr: "مهام Backend/Frontend والتخطيط والتنفيذ ومعالجة الأخطاء.", detailsEn: "Backend/Frontend tasks, planning, implementation, debugging." },
  { year: "May 2021–Nov 2021", titleAr: "Software Engineer — SBT", titleEn: "Software Engineer — SBT", detailsAr: "نظم ERP/Payroll/Supermarket/Inventory من التحليل للتسليم.", detailsEn: "ERP/Payroll/Supermarket/Inventory systems end-to-end." },
  { year: "Jul 2020–Oct 2020", titleAr: "Web Scraping Intern — Esours", titleEn: "Web Scraping Intern — Esours", detailsAr: "استخراج بيانات وأتمتة إدراجها في Excel باستخدام Python.", detailsEn: "Scraped and automated data embedding into Excel with Python." },
];

/* ================ Helpers / Animations ================ */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  viewport: { once: true, amount: 0.15 },
});

const Avatar = ({ name, photo }) =>
  photo ? (
    <img src={photo} alt={name} className="h-48 w-48 rounded-3xl object-cover border border-slate-200 shadow-xl" />
  ) : (
    <motion.div
      initial={{ rotate: -2 }}
      whileHover={{ rotate: 0 }}
      className="h-48 w-48 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-content-center text-5xl font-extrabold shadow-xl"
    >
      {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
    </motion.div>
  );

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: .3 });
  return <motion.div style={{ scaleX }} className="fixed left-0 right-0 top-0 h-[3px] origin-left z-[70] bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500" />;
}

function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: .4, y: 0 }} transition={{ duration: 0.8 }} className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: .4, x: 0 }} transition={{ duration: 0.8, delay: .1 }} className="absolute top-1/3 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-500" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: .3, y: 0 }} transition={{ duration: 0.8, delay: .2 }} className="absolute bottom-0 left-1/2 -translate-x-1/2 h-96 w-[36rem] rounded-[40%] blur-3xl bg-gradient-to-tr from-yellow-400 via-orange-500 to-rose-500" />
    </div>
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const rx = useMotionValue(0), ry = useMotionValue(0), tz = useMotionValue(0);
  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx.set(-py * 12); ry.set(px * 12); tz.set(1);
    ref.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => { rx.set(0); ry.set(0); tz.set(0); }}
      style={{ rotateX: rx, rotateY: ry, translateZ: tz }}
      className={cn("relative transition-transform will-change-transform [perspective:1000px]", className)}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "radial-gradient(220px 220px at var(--mx) var(--my), rgba(99,102,241,.18), transparent 60%)" }}
      />
      {children}
    </motion.div>
  );
}

const Marquee = ({ items }) => (
  <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white">
    <motion.div
      initial={{ x: 0 }}
      animate={{ x: ["0%", "-33.333%", "-66.666%", "0%"] }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      className="flex gap-6 py-3 whitespace-nowrap"
    >
      {[...items, ...items, ...items].map((i, idx) => (
        <Badge key={idx} className="px-3 py-1">{i}</Badge>
      ))}
    </motion.div>
  </div>
);

/* ================ Testimonials ================ */
const Testimonials = memo(function Testimonials({ lang }) {
  const testimonials = [
    { name: "Omar Ali", role: "Product Manager", textAr: "تنفيذ سريع وجودة عالية. فهم المطلوب وعمل تحسينات إضافية بدون ما نطلب!", textEn: "Fast delivery and high quality. Understood the brief and added smart improvements!" },
    { name: "Lina Saeed", role: "Founder @ Boutique", textAr: "الواجهة طلعت شيك وسريعة، والمبيعات زادت بعد الإطلاق 👌", textEn: "The UI looks classy and fast; sales improved after launch 👌" },
    { name: "Youssef N.", role: "CTO", textAr: "تكامل ممتاز مع المدفوعات وCI/CD. التواصل كان احترافي جدًا.", textEn: "Great payment integration and CI/CD. Super professional communication." },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);
  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 grid place-content-center">
              <Quote className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={prev} title="Prev"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="secondary" size="sm" onClick={next} title="Next"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="min-h-[150px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.45 }}
                className="space-y-4"
              >
                <p className="text-lg leading-relaxed">
                  “{lang === "ar" ? testimonials[idx].textAr : testimonials[idx].textEn}”
                </p>
                <div className="text-sm text-slate-600">
                  <span className="font-semibold">{testimonials[idx].name}</span> — {testimonials[idx].role}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={cn("h-2.5 w-2.5 rounded-full transition-all",
                  i === idx ? "bg-indigo-600 w-6" : "bg-slate-300 hover:bg-slate-400")}
                aria-label={`Slide ${i + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
});

/* ================ App ================ */
export default function App() {
  const [lang, setLang] = useState("ar");
  const [menuOpen, setMenuOpen] = useState(false);

  const t = useMemo(() =>
    lang === "ar"
      ? {
        nav: { about: "نبذة", work: "الأعمال", skills: "المهارات", services: "الخدمات", testimonials: "آراء", contact: "تواصل" },
        hero: { title: profile.name, role: profile.role, tagline: profile.taglineAr, cta1: "تواصل معي", cta2: "حمّل السيرة الذاتية" },
        about: {
          header: "من أنا",
          paragraphs: [
            "أنا مطوّر Full-Stack أبني منتجات ويب/موبايل متينة وسريعة بواجهة نظيفة وحركة سلسة. أعمل على الواجهة بـ React/Next.js وTailwind + Framer Motion، وعلى الخادم بـ Laravel/PHP مع MySQL وRedis.",
            "أركّز على تصميم نماذج بيانات واضحة وبناء REST APIs موثّقة، مع مصادقة وصلاحيات (Sanctum/JWT) وتحسين الأداء بالتخزين المؤقت والصفوف (Queues).",
            "أحافظ على جودة الكود بالاختبارات، وأنشر عبر Nginx/Docker مع CI/CD، وأتابع المراقبة والتحسينات بعد الإطلاق لضمان تجربة مستقرة وسريعة."
          ],
          bullets: [
            "Laravel APIs & هيكلة نظيفة",
            "تصميم وتحسين قواعد البيانات",
            "Auth & Permissions (Sanctum/JWT)",
            "Caching & Queues",
            "اختبارات وجودة الكود",
            "Performance & Motion UX",
            "CI/CD & Monitoring"
          ],
          facts: [
            { k: "مشاريع مُطلَقة", v: "10+" },
            { k: "مكتبات وتقنيات", v: "20+" },
            { k: "فرق تعاونت معها", v: "3+" },
            { k: "دول مستهدفة", v: "5+" }
          ],
        },


        work: { header: "أعمال مميزة" },
        skills: { header: "المهارات" },
        services: { header: "الخدمات" },
        testi: { header: "آراء العملاء" },
        exp: { header: "الخبرات" },
        contact: { header: "تواصل", labelName: "الاسم", labelEmail: "البريد الإلكتروني", labelMsg: "رسالتك", send: "إرسال" },
        footer: `© ${new Date().getFullYear()} ${profile.name} — كل الحقوق محفوظة`,
      }
      : {
        nav: { about: "About", work: "Work", skills: "Skills", services: "Services", testimonials: "Testimonials", contact: "Contact" },
        hero: { title: profile.name, role: profile.role, tagline: profile.taglineEn, cta1: "Contact Me", cta2: "Download CV" },
        about: {
          header: "About Me",
          paragraphs: [
            "I’m a Full-Stack Developer building fast, production-ready web/mobile products with clean motion and polished UX. I work with React/Next.js + Tailwind/Framer on the front and Laravel/PHP with MySQL/Redis on the back.",
            "I focus on clear data models and well-documented REST APIs, with auth/permissions (Sanctum/JWT) and performance via caching and queues.",
            "I maintain code quality with testing, deploy through Nginx/Docker and CI/CD, and monitor post-launch to keep the experience stable and fast."
          ],
          bullets: [
            "Laravel APIs & Clean Architecture",
            "Database design & optimization",
            "Auth & Permissions (Sanctum/JWT)",
            "Caching & Queues",
            "Testing & Code Quality",
            "Performance & Motion UX",
            "CI/CD & Monitoring"
          ],
          facts: [
            { k: "Prod launches", v: "10+" },
            { k: "Libs & tools", v: "20+" },
            { k: "Teams collaborated", v: "3+" },
            { k: "Target countries", v: "5+" }
          ],
        },


        work: { header: "Featured Work" },
        skills: { header: "Skills" },
        services: { header: "Services" },
        testi: { header: "Testimonials" },
        exp: { header: "Experience" },
        contact: { header: "Get in Touch", labelName: "Name", labelEmail: "Email", labelMsg: "Message", send: "Send" },
        footer: `© ${new Date().getFullYear()} ${profile.name} — All rights reserved`,
      }
    , [lang]);

  const dir = lang === "ar" ? "rtl" : "ltr";
  useEffect(() => { document.title = `${profile.name} — Portfolio`; }, []);

  const Section = ({ id, children }) => <section id={id} className="scroll-mt-24 py-20 md:py-28">{children}</section>;

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 400], [0, -40]);

  return (
    <div>
      <style>{`
        @keyframes gradientMove { to { background-position: 200% 0; } }
      `}</style>

      <ScrollProgressBar />

      <div dir={dir} className="relative min-h-screen bg-[#f6f7fb] text-slate-900 overflow-x-clip">
        <AnimatedBackground />

        {/* Navbar */}
        <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-slate-200">
          <nav className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="#home" className="font-semibold tracking-tight text-lg">{profile.name}</a>
            <div className="hidden md:flex items-center gap-4">
              {[
                { href: "#about", label: t.nav.about },
                { href: "#work", label: t.nav.work },
                { href: "#skills", label: t.nav.skills },
                { href: "#services", label: t.nav.services },
                { href: "#testimonials", label: t.nav.testimonials },
                { href: "#contact", label: t.nav.contact },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="relative py-1 px-2 text-slate-700 hover:text-slate-900
                    bg-gradient-to-r from-slate-900 to-slate-900 bg-no-repeat bg-[length:0%_2px] bg-left-bottom
                    hover:bg-[length:100%_2px] transition-[background-size,color] duration-300"
                >
                  {l.label}
                </a>
              ))}
              <div className="w-px h-5 bg-slate-300" />
              <Button variant="ghost" size="sm" type="button" onClick={() => setLang(v => v === "ar" ? "en" : "ar")} title="Language">
                <Languages className="h-4 w-4" />
              </Button>
            </div>
            <Button className="md:hidden" variant="ghost" size="sm" type="button" onClick={() => setMenuOpen(o => !o)} title="Menu">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </nav>

          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-slate-200 bg-white/90 backdrop-blur"
            >
              <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-3">
                <a href="#about" className="py-2" onClick={() => setMenuOpen(false)}>{t.nav.about}</a>
                <a href="#work" className="py-2" onClick={() => setMenuOpen(false)}>{t.nav.work}</a>
                <a href="#skills" className="py-2" onClick={() => setMenuOpen(false)}>{t.nav.skills}</a>
                <a href="#services" className="py-2" onClick={() => setMenuOpen(false)}>{t.nav.services}</a>
                <a href="#testimonials" className="py-2" onClick={() => setMenuOpen(false)}>{t.nav.testimonials}</a>
                <a href="#contact" className="py-2" onClick={() => setMenuOpen(false)}>{t.nav.contact}</a>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setLang(v => v === "ar" ? "en" : "ar")} title="Language"><Languages className="h-4 w-4" /></Button>
                </div>
              </div>
            </motion.div>
          )}
        </header>

        {/* Main */}
        <main id="home" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <Section id="home">
            <div className="grid items-center gap-10 md:grid-cols-2">
              <motion.div {...fadeUp(0)} className="space-y-6">
                <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm inline-flex items-center gap-1">
                  <Sparkles className="h-4 w-4" /> {profile.role}
                </Badge>

                <h1 className="text-4xl md:text-6xl font-black leading-[1.1]">
                  <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#6366f1,#a855f7,#06b6d4,#22c55e)] bg-[length:200%_100%] animate-[gradientMove_8s_linear_infinite]">
                    {t.hero.title}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-700 max-w-prose">{t.hero.tagline}</p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild href="#contact" title="Contact">
                    <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{t.hero.cta1}</span>
                  </Button>
                  <Button variant="outline" asChild href={profile.cvUrl} download title="Download CV">
                    <span className="inline-flex items-center gap-2"><Download className="h-4 w-4" />{t.hero.cta2}</span>
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-2 text-slate-600">
                  <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" /> {profile.location}</span>
                  <a className="inline-flex items-center gap-2 hover:opacity-80" href={profile.socials.github} target="_blank" rel="noreferrer"><Github className="h-4 w-4" /> GitHub</a>
                  <a className="inline-flex items-center gap-2 hover:opacity-80" href={profile.socials.linkedin} target="_blank" rel="noreferrer"><Linkedin className="h-4 w-4" /> LinkedIn</a>
                </div>
              </motion.div>

              <motion.div style={{ y: parallaxY }} {...fadeUp(0.1)} className="flex justify-center md:justify-end">
                <TiltCard className="group">
                  <div className="relative">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-500/30 via-fuchsia-500/20 to-cyan-500/30 blur-2xl" />
                    <Card interactive={false} className="relative rounded-3xl p-2 bg-white border border-slate-200 backdrop-blur">
                      <Avatar name={profile.name} photo={profile.photo} />
                    </Card>
                  </div>
                </TiltCard>
              </motion.div>
            </div>

            <div className="mt-10">
              <Marquee items={[...skills.frontend, ...skills.backend, ...skills.devops, ...skills.tools]} />
            </div>
          </Section>

          {/* About — استخدم فقرات متعددة */}
          <Section id="about">
            <motion.div {...fadeUp(0)} className="relative">
              <div className="absolute -inset-x-4 -inset-y-2 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-cyan-500/10 blur-2xl rounded-3xl" />
              <Card className="relative overflow-hidden">
                <CardHeader><CardTitle className="text-2xl md:text-3xl">{t.about.header}</CardTitle></CardHeader>
                <CardContent className="grid gap-8 md:grid-cols-2">
                  <div className="space-y-3 text-slate-700 leading-relaxed">
                    {t.about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    <ul className="grid grid-cols-2 gap-2 pt-2">
                      {t.about.bullets.map((b, i) => (
                        <li key={i} className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" />{b}</li>
                      ))}
                    </ul>
                    <div className="pt-3 flex gap-3">
                      <Button asChild href="#contact" title="Contact"><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{t.hero.cta1}</span></Button>
                      <Button variant="outline" asChild href={profile.cvUrl} download title="Download CV"><span className="inline-flex items-center gap-2"><Download className="h-4 w-4" />{t.hero.cta2}</span></Button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="grid grid-cols-3 gap-3">
                      {t.about.facts.map((f, i) => (
                        <Card key={i} className="p-4 text-center">
                          <div className="text-xl font-bold">{f.v}</div>
                          <div className="text-xs mt-1 text-slate-500">{f.k}</div>
                        </Card>
                      ))}
                    </div>
                    <Card className="p-4">
                      <div className="text-sm font-semibold mb-3">{lang === "ar" ? "التقنيات الرئيسية" : "Core tech"}</div>
                      <div className="flex flex-wrap gap-2">{[...skills.frontend.slice(0, 4), ...skills.backend.slice(0, 3)].map(s => <Badge key={s}>{s}</Badge>)}</div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Section>

          {/* Work */}
          <Section id="work">
            <motion.h2 {...fadeUp(0)} className="text-2xl md:text-3xl font-bold mb-6">{t.work.header}</motion.h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
              {projects.map((p, i) => (
                <motion.div key={p.id} {...fadeUp(0.05 * i)} className="h-full">
                  <TiltCard className="group h-full">
                    <Card interactive={true} className="overflow-hidden hover:shadow-2xl transition-all h-[480px] flex flex-col">
                      <motion.div className="relative h-48 overflow-hidden" whileHover={{ scale: 1.01 }} transition={{ duration: 0.35 }}>
                        <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.div>

                      <div className="flex-1 flex flex-col">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between gap-2">
                            <span className="line-clamp-1">{p.title}</span>
                            <span className="flex items-center gap-2 shrink-0">
                              {p.live && <motion.a whileHover={{ scale: 1.1 }} href={p.live} target="_blank" rel="noreferrer" title="Live" className="opacity-80 hover:opacity-100"><ExternalLink className="h-4 w-4" /></motion.a>}
                              {p.repo && <motion.a whileHover={{ scale: 1.1 }} href={p.repo} target="_blank" rel="noreferrer" title="Repo" className="opacity-80 hover:opacity-100"><Github className="h-4 w-4" /></motion.a>}
                            </span>
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="text-slate-700 flex-1 flex flex-col">
                          <p className="mb-3 line-clamp-3">{lang === "ar" ? p.descAr : p.descEn}</p>
                          <div className="mt-auto flex flex-wrap gap-2">
                            {p.tech.map(t => <Badge key={t}>{t}</Badge>)}
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Services */}
          {/* Services — equal height on all cards */}
          {/* Services — 6 cards, equal height, stronger copy */}
          <Section id="services">
            <motion.h2 {...fadeUp(0)} className="text-2xl md:text-3xl font-bold mb-2">
              {t.services.header}
            </motion.h2>
            <p className="text-slate-600 mb-6">
              {lang === "ar"
                ? "حلول إنتاجية جاهزة للتوسّع: مواقع سريعة، لوحات تحكّم قوية، متاجر إلكترونية، تطبيقات موبايل، تطبيقات سطح مكتب، وأتمتة/Scraping بالبايثون."
                : "Production-ready at scale: fast websites, powerful dashboards, e-commerce, mobile apps, desktop apps, and Python automation/scraping."}
            </p>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-stretch">
              {[
                {
                  icon: <Code2 className="h-5 w-5" />,
                  titleAr: "مواقع سريعة ومحسّنة",
                  titleEn: "Blazing & Optimized Websites",
                  subAr: "صفحات هبوط سريعة ومهيّأة للزحف.",
                  subEn: "Lightning-fast landing pages with solid technical SEO.",
                  pointsAr: [
                    "هندسة نظيفة + SSR/SPA حسب الحاجة",
                    "SEO تقني + OG/Twitter tags",
                    "Responsive كامل وحركة أنيقة",
                    "تسليم إنتاجي مع CDN وCaching",
                  ],
                  pointsEn: [
                    "Clean architecture (SSR/SPA when needed)",
                    "Technical SEO + OG/Twitter tags",
                    "Fully responsive with smooth motion",
                    "Production delivery with CDN & caching",
                  ],
                },
                {
                  icon: <LayoutDashboard className="h-5 w-5" />,
                  titleAr: "لوحات تحكّم تفاعلية",
                  titleEn: "Interactive Dashboards",
                  subAr: "إدارة بيانات حقيقية بمؤشرات واضحة.",
                  subEn: "Data operations with clear KPIs and insights.",
                  pointsAr: [
                    "Auth & RBAC وصلاحيات دقيقة",
                    "Charts + Filters تفاعلية",
                    "جداول وCRUD محسّنة",
                    "أداء سريع وShortcuts",
                  ],
                  pointsEn: [
                    "Auth & RBAC with granular permissions",
                    "Interactive charts & filters",
                    "Optimized tables & CRUD",
                    "Snappy UX with keyboard shortcuts",
                  ],
                },
                {
                  icon: <ShoppingCart className="h-5 w-5" />,
                  titleAr: "متاجر إلكترونية",
                  titleEn: "E-Commerce Stores",
                  subAr: "بيع بدون تعقيد على الويب والموبايل.",
                  subEn: "Sell without friction across web & mobile.",
                  pointsAr: [
                    "بوابات دفع موثوقة",
                    "منتجات/عربات/طلبات + كوبونات",
                    "شحن/ضرائب وسلّة مهجورة",
                    "تقارير تحويل ورسائل بريدية",
                  ],
                  pointsEn: [
                    "Trusted payment gateways",
                    "Products/Carts/Orders + coupons",
                    "Shipping/tax & abandoned cart",
                    "Conversion reports & emailing",
                  ],
                },
                {
                  icon: <Smartphone className="h-5 w-5" />,
                  titleAr: "تطبيقات موبايل (Android / iOS)",
                  titleEn: "Mobile Apps (Android / iOS)",
                  subAr: "Cross-platform حديث متكامل مع Laravel APIs.",
                  subEn: "Modern cross-platform integrated with Laravel APIs.",
                  pointsAr: [
                    "واجهات سريعة ومتوافقة",
                    "Push Notifications & Deep Links",
                    "Auth + مزامنة بيانات Offline",
                    "نشر المتاجر + Analytics/Crashlytics",
                  ],
                  pointsEn: [
                    "Fast, device-friendly UIs",
                    "Push notifications & deep links",
                    "Auth + offline data sync",
                    "Store publishing + analytics/crashlytics",
                  ],
                },
                {
                  icon: <Monitor className="h-5 w-5" />,
                  titleAr: "تطبيقات سطح مكتب (C# / VB.NET)",
                  titleEn: "Desktop Apps (C# / VB.NET)",
                  subAr: "أنظمة Windows Forms/WPF مع قواعد بيانات محلية أو شبكية.",
                  subEn: "Windows Forms/WPF with local or network databases.",
                  pointsAr: [
                    "SQL Server / SQLite + نسخ احتياطي",
                    "تقارير/طباعة وواجهات عربية/إنجليزية",
                    "Installers وتحديثات تلقائية",
                    "تكامل مع أجهزة قارئ باركود/طابعات",
                  ],
                  pointsEn: [
                    "SQL Server / SQLite + backups",
                    "Reporting/printing + AR/EN UI",
                    "Installers & auto-updates",
                    "Barcode readers/printers integrations",
                  ],
                },
                {
                  icon: <Bot className="h-5 w-5" />,
                  titleAr: "أتمتة وWeb-Scraping (Python)",
                  titleEn: "Automation & Web-Scraping (Python)",
                  subAr: "استخلاص بيانات موثوق وتغذية CSV/Excel/DB مع جداول زمنية.",
                  subEn: "Reliable scraping into CSV/Excel/DB with schedulers.",
                  pointsAr: [
                    "Requests/BeautifulSoup/Selenium",
                    "مكافحة البلوك: Delay/Headers/Proxies",
                    "تنظيف بيانات وPandas",
                    "Security basics: hashing/validation/logs",
                  ],
                  pointsEn: [
                    "Requests/BeautifulSoup/Selenium",
                    "Anti-block: delays/headers/proxies",
                    "Data cleaning with Pandas",
                    "Security basics: hashing/validation/logs",
                  ],
                },
              ].map((s, i) => (
                <motion.div key={i} {...fadeUp(0.05 * i)} className="group h-full">
                  <div className="h-full rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-fuchsia-500/40 to-cyan-500/40 group-hover:via-indigo-500/70 transition">
                    <Card interactive={true} className="h-full flex">
                      <div className="p-6 flex h-full flex-col grow">
                        <motion.div whileHover={{ rotate: 8 }} className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 grid place-content-center mb-4">
                          {s.icon}
                        </motion.div>

                        <h3 className="text-lg font-semibold">{lang === "ar" ? s.titleAr : s.titleEn}</h3>
                        <p className="text-slate-600 text-sm mb-3">{lang === "ar" ? s.subAr : s.subEn}</p>

                        {/* توحيد الارتفاع */}
                        <div className={cn("mb-4 space-y-1.5 text-slate-700", lang === "ar" ? "min-h-[240px]" : "min-h-[200px]")}>
                          {(lang === "ar" ? s.pointsAr : s.pointsEn).map((p, idx) => (
                            <div key={idx} className="inline-flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-indigo-500" />
                              <span>{p}</span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-auto pt-2">
                          <Button asChild href="#contact" size="sm" className="w-full justify-center">
                            <span>{lang === "ar" ? "اطلب الخدمة" : "Get it"}</span>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>






          {/* Testimonials */}
          <Section id="testimonials">
            <motion.h2 {...fadeUp(0)} className="text-2xl md:text-3xl font-bold mb-6">{lang === "ar" ? "آراء العملاء" : "Testimonials"}</motion.h2>
            <Testimonials lang={lang} />
          </Section>

          {/* Skills */}
          <Section id="skills">
            <motion.h2 {...fadeUp(0)} className="text-2xl md:text-3xl font-bold mb-2">
              {lang === "ar" ? "المهارات" : "Skills"}
            </motion.h2>
            <p className="text-slate-600 mb-6">
              {lang === "ar"
                ? "واجهة React/Next، خلفية Laravel/PHP، موبايل، سطح المكتب، أتمتة Python، أساسيات أمن، وDevOps."
                : "React/Next front-end, Laravel/PHP back-end, mobile, desktop, Python automation, security basics, and DevOps."}
            </p>

            <SkillsTabs lang={lang} groups={skills} labels={skillLabels} />
          </Section>




          {/* Experience */}
          <Section id="experience">
            <motion.h2 {...fadeUp(0)} className="text-2xl md:text-3xl font-bold mb-6">{t.exp.header}</motion.h2>
            <div className="relative pl-4 md:pl-8">
              <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-full" />
              <div className="space-y-5">
                {experience.map((ex, i) => (
                  <motion.div key={i} {...fadeUp(0.05 * i)} className="relative">
                    <div className="absolute -left-[10px] top-2 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20" />
                    <Card><CardContent className="pt-6">
                      <p className="text-sm text-slate-500">{ex.year}</p>
                      <p className="font-semibold">{lang === "ar" ? ex.titleAr : ex.titleEn}</p>
                      <p className="text-slate-700">{lang === "ar" ? ex.detailsAr : ex.detailsEn}</p>
                    </CardContent></Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </Section>

          {/* Contact */}
          <Section id="contact">
            <motion.h2 {...fadeUp(0)} className="text-2xl md:text-3xl font-bold mb-6">{t.contact.header}</motion.h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="h-full">
                <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />{t.contact.header}</CardTitle></CardHeader>
                <CardContent className="text-slate-700 space-y-3">
                  <p className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{profile.email}</p>
                  <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />{profile.phone}</p>
                  <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{profile.location}</p>
                  <div className="flex gap-3 pt-2">
                    <Button variant="secondary" asChild href={profile.socials.github} title="GitHub"><span className="inline-flex items-center gap-2"><Github className="h-4 w-4" />GitHub</span></Button>
                    <Button variant="secondary" asChild href={profile.socials.linkedin} title="LinkedIn"><span className="inline-flex items-center gap-2"><Linkedin className="h-4 w-4" />LinkedIn</span></Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,rgba(99,102,241,.15),transparent,rgba(6,182,212,.15))] [mask-image:radial-gradient(closest-side,white,transparent)]" />
                <CardHeader><CardTitle>Form</CardTitle></CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); const f = new FormData(e.currentTarget);
                      const subject = encodeURIComponent(`Portfolio Message from ${f.get("name")}`);
                      const body = encodeURIComponent(`${f.get("message")}\n\nFrom: ${f.get("name")} (${f.get("email")})`);
                      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="mb-1 block text-sm">{t.contact.labelName}</label>
                      <input name="name" required placeholder={lang === "ar" ? "اسمك" : "Your name"} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm">{t.contact.labelEmail}</label>
                      <input type="email" name="email" required placeholder="you@example.com" className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm">{t.contact.labelMsg}</label>
                      <textarea name="message" rows={4} required placeholder={lang === "ar" ? "رسالتك هنا..." : "Your message..."} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="solid" size="md" type="submit" title="Send"><span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{t.contact.send}</span></Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </Section>
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 text-sm text-slate-500 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p>{t.footer}</p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" type="button" onClick={() => setLang(v => v === "ar" ? "en" : "ar")} title="Language">
                <Languages className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
