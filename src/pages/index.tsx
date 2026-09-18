import Head from "next/head";
import { useState } from "react";
import { Button } from "@/components/Button";
import {
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertTriangle,
  ReceiptText,
  Megaphone,
  BookOpen,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const [clickedAction, setClickedAction] = useState<string | null>(null);

  const handleAction = (name: string) => {
    setClickedAction(name);
    setTimeout(() => setClickedAction(null), 2500);
  };

  return (
    <>
      <Head>
        <title>PSMP Design System</title>
        <meta
          name="description"
          content="Biblioteca de componentes Design System com Next.js, Tailwind CSS v4 e Storybook"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {/* Background gradient decorative glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-sky-500/15 to-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="border-b border-slate-800/80 pb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Design System Core &bull; Tailwind CSS v4 &bull; Storybook</span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
              PSMP Component Library
            </h1>
            <p className="mt-2 text-base sm:text-lg text-slate-400 max-w-2xl">
              Biblioteca de componentes unificada para os ecossistemas{" "}
              <strong className="text-emerald-400">CIPA</strong>,{" "}
              <strong className="text-sky-400">Sistema-CAF</strong> e{" "}
              <strong className="text-teal-400">Intranet</strong> construída com Next.js (Pages Router) e TypeScript.
            </p>

            {clickedAction && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300 transition-all animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>Ação disparada: <strong>{clickedAction}</strong></span>
              </div>
            )}
          </header>

          {/* Section 1: Base Component Showcase */}
          <section className="mt-12 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Componente Base: Button</h2>
                <p className="text-sm text-slate-400">
                  Suporte nativo a variantes, tamanhos, formato arredondado (rounded) e polimorfismo com Radix Slot (asChild).
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Variants & Sizes */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Variantes Padrão (Primary &amp; Secondary)
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="primary"
                    onClick={() => handleAction("Primary Button")}
                  >
                    Primary Button
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleAction("Secondary Button")}
                  >
                    Secondary Button
                  </Button>
                  <Button
                    variant="primary"
                    disabled
                  >
                    Disabled
                  </Button>
                </div>

                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mt-6 mb-4">
                  Tamanhos (sm, md, lg)
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" onClick={() => handleAction("Size SM")}>
                    Small (sm)
                  </Button>
                  <Button size="md" onClick={() => handleAction("Size MD")}>
                    Medium (md)
                  </Button>
                  <Button size="lg" onClick={() => handleAction("Size LG")}>
                    Large (lg)
                  </Button>
                </div>
              </div>

              {/* Rounded & asChild Slot */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  Bordas Arredondadas (rounded)
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button rounded="none" size="sm">
                    none
                  </Button>
                  <Button rounded="sm" size="sm">
                    sm
                  </Button>
                  <Button rounded="md" size="sm">
                    md
                  </Button>
                  <Button rounded="lg" size="sm">
                    lg
                  </Button>
                  <Button rounded="full" size="sm">
                    full
                  </Button>
                </div>

                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mt-6 mb-4">
                  Polimorfismo (asChild com &lt;a&gt;)
                </h3>
                <div>
                  <Button asChild variant="secondary" rounded="full">
                    <a
                      href="#storybook"
                      className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-100"
                    >
                      <span>Link estilizado como botão</span>
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Multi-project Ecosystem Showcase */}
          <section className="mt-14 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <BookOpen className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Ecossistema Multi-Projeto Storybook</h2>
                <p className="text-sm text-slate-400">
                  Estruturação dedicada em <code className="text-slate-300">src/stories/</code> com stories contextualizadas para cada projeto.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* CIPA Card */}
              <div className="group rounded-xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/80 p-6 transition-all hover:border-emerald-700/60">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    CIPA/Button
                  </span>
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Comissão CIPA</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Prevenção de acidentes, vistorias e notificações de risco.
                </p>
                <div className="mt-6 space-y-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("CIPA: Registrar Inspeção")}
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>Registrar Inspeção</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("CIPA: Consultar Atas")}
                  >
                    <span>Consultar Atas e Normas</span>
                  </Button>
                  <Button
                    size="sm"
                    rounded="full"
                    className="w-full justify-start bg-amber-600 hover:bg-amber-700 text-white border border-amber-500"
                    onClick={() => handleAction("CIPA: Emitir Alerta")}
                  >
                    <AlertTriangle className="h-4 w-4 text-amber-200" />
                    <span>Emitir Alerta</span>
                  </Button>
                </div>
              </div>

              {/* Sistema-CAF Card */}
              <div className="group rounded-xl border border-sky-900/40 bg-gradient-to-b from-sky-950/20 to-slate-900/80 p-6 transition-all hover:border-sky-700/60">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-sky-500/10 px-2 py-1 text-xs font-semibold text-sky-400 border border-sky-500/20">
                    Sistema-CAF/Button
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-sky-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Sistema CAF</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Administração, finanças, pedidos e processos contratuais.
                </p>
                <div className="mt-6 space-y-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("CAF: Aprovar Pedido")}
                  >
                    <CheckCircle2 className="h-4 w-4 text-sky-400" />
                    <span>Aprovar Pedido CAF</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("CAF: Filtrar Lançamentos")}
                  >
                    <span>Filtrar Lançamentos</span>
                  </Button>
                  <Button
                    size="sm"
                    rounded="lg"
                    className="w-full justify-start bg-indigo-600 hover:bg-indigo-700 text-white ring-1 ring-indigo-400/40"
                    onClick={() => handleAction("CAF: Gerar Comprovante")}
                  >
                    <ReceiptText className="h-4 w-4 text-indigo-200" />
                    <span>Comprovante Fiscal</span>
                  </Button>
                </div>
              </div>

              {/* Intranet Card */}
              <div className="group rounded-xl border border-teal-900/40 bg-gradient-to-b from-teal-950/20 to-slate-900/80 p-6 transition-all hover:border-teal-700/60">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-teal-500/10 px-2 py-1 text-xs font-semibold text-teal-400 border border-teal-500/20">
                    Intranet/Button
                  </span>
                  <Users className="h-5 w-5 text-teal-400" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-white">Portal Intranet</h3>
                <p className="mt-1 text-xs text-slate-400">
                  Comunicação institucional, contracheques e RH.
                </p>
                <div className="mt-6 space-y-3">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("Intranet: Portal")}
                  >
                    <Users className="h-4 w-4 text-teal-400" />
                    <span>Portal do Colaborador</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => handleAction("Intranet: Contracheque")}
                  >
                    <span>Consultar Contracheque</span>
                  </Button>
                  <Button
                    size="sm"
                    rounded="full"
                    className="w-full justify-start bg-teal-600 hover:bg-teal-700 text-white ring-1 ring-teal-400/40"
                    onClick={() => handleAction("Intranet: Novo Comunicado")}
                  >
                    <Megaphone className="h-4 w-4 text-teal-200" />
                    <span>Novo Comunicado</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Storybook Instructions */}
          <section id="storybook" className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-indigo-400" />
                  Como executar o Storybook
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Execute o comando abaixo no terminal para abrir o Storybook no navegador:
                </p>
              </div>
              <div className="rounded-lg bg-black/60 border border-slate-700/80 px-4 py-2 font-mono text-xs text-indigo-300">
                npm run storybook
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
