# PMSP Design System

Biblioteca de componentes unificada e reutilizável desenvolvida com **Next.js (Pages Router)**, **TypeScript**, **Tailwind CSS v4** e documentada com **Storybook** via `@storybook/nextjs-vite`.

O projeto atende a diferentes ecossistemas institucionais com suporte nativo a variantes, polimorfismo e controle granular de temas (como **CIPA**, **Sistema-CAF** e **Intranet**).

---

## 🛠️ Stack Tecnológica

- **Framework**: [Next.js](https://nextjs.org/) (Pages Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) com PostCSS (`@tailwindcss/postcss`)
- **Documentação de Componentes**: [Storybook](https://storybook.js.org/) com `@storybook/nextjs-vite`
- **Utilitários de UI e Primitivas**:
  - `@radix-ui/react-slot` (Polimorfismo com `asChild`)
  - `class-variance-authority` (Gerenciamento type-safe de variantes CVA)
  - `clsx` + `tailwind-merge` (Mesclagem inteligente de classes CSS sem conflitos)
  - `lucide-react` (Conjunto consistente de ícones)

---

## 📁 Estrutura de Diretórios

```text
psmp-design-system/
├── .storybook/               # Configuração do Storybook (Vite, preview, estilos)
│   ├── main.ts
│   └── preview.tsx
├── src/
│   ├── components/           # Componentes base do Design System
│   │   ├── Button.tsx        # Componente Button e variantes CVA
│   │   └── index.ts          # Barrel exports
│   ├── pages/                # Next.js Pages Router
│   │   ├── _app.tsx          # Importação de estilos globais
│   │   └── index.tsx         # Showcase interativo dos componentes
│   ├── stories/              # Stories organizadas por projeto
│   │   ├── cipa/             # Projeto CIPA (CIPA/Button)
│   │   ├── intranet/         # Projeto Intranet (Intranet/Button)
│   │   └── sistema-caf/      # Projeto Sistema-CAF (Sistema-CAF/Button)
│   ├── styles/
│   │   └── globals.css       # Configuração Tailwind CSS v4 (@import "tailwindcss")
│   └── utils/
│       └── cn.ts             # Utilitário cn (clsx + tailwind-merge)
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── next.config.mjs
```

---

## 🚀 Começando

### Pré-requisitos

- **Node.js**: v20+ ou v24+
- **npm**: v10+ ou v11+

### Instalação

```bash
git clone https://github.com/smdu-sp/pmsp-design-system.git
cd pmsp-design-system
npm install
```

### Scripts Disponíveis

| Comando                   | Descrição                                                               |
| :------------------------ | :---------------------------------------------------------------------- |
| `npm run dev`             | Inicia o servidor de desenvolvimento Next.js em `http://localhost:3000` |
| `npm run build`           | Compila a aplicação Next.js para produção                               |
| `npm run start`           | Inicia o servidor Next.js compilado                                     |
| `npm run storybook`       | Inicia o Storybook na porta `6006` (`http://localhost:6006`)            |
| `npm run build-storybook` | Gera a versão estática do Storybook na pasta `storybook-static/`        |

---

## 🧩 Componente Base: `Button`

O componente `Button` suporta variantes flexíveis, tamanhos, bordas arredondadas e composição polimórfica com elementos como `<a>` ou links do Next.js via `asChild`.

### Exemplo de Uso Básico

```tsx
import { Button } from "@/components/Button";

export default function Exemplo() {
  return (
    <div className="flex gap-4">
      {/* Botão Primário */}
      <Button variant="primary" size="md">
        Salvar Alterações
      </Button>

      {/* Botão Secundário */}
      <Button variant="secondary" size="md">
        Cancelar
      </Button>

      {/* Botão com Borda Totalmente Arredondada (Pill) */}
      <Button variant="primary" rounded="full">
        Confirmar
      </Button>
    </div>
  );
}
```

### Polimorfismo com `asChild`

Com a propriedade `asChild`, o botão delega sua renderização para o elemento filho imediato (utilizando o `@radix-ui/react-slot`), preservando todas as classes de estilo e acessibilidade:

```tsx
import Link from "next/link";
import { Button } from "@/components/Button";

export default function LinkButton() {
  return (
    <Button asChild variant="secondary">
      <Link href="/relatorios">
        Acessar Relatórios
      </Link>
    </Button>
  );
}
```

## 🎨 Utilitário `cn`

Localizado em `src/utils/cn.ts`, combina `clsx` e `tailwind-merge` para permitir a passagem de classes condicionais e sobrescrita segura de utilitários Tailwind:

```ts
import { cn } from "@/utils/cn";

// Exemplo:
cn("bg-slate-900 text-white", isPending && "opacity-50", customClassName);
```

---

## 📚 Multi-Projeto no Storybook

As stories estão organizadas em diretórios independentes dentro de `src/stories/` para permitir que cada projeto mantenha seus casos de uso contextualizados:

1. **CIPA (`src/stories/cipa/`)**:
   - Título: `CIPA/Button`
   - Exemplos: `Primary` (Inspeção de segurança), `Secondary` (Atas e normas), `CustomStyle` (Alerta de risco).

2. **Sistema-CAF (`src/stories/sistema-caf/`)**:
   - Título: `Sistema-CAF/Button`
   - Exemplos: `Primary` (Aprovação de pedido), `Secondary` (Filtros), `CustomStyle` (Comprovante financeiro).

3. **Intranet (`src/stories/intranet/`)**:
   - Título: `Intranet/Button`
   - Exemplos: `Primary` (Portal do colaborador), `Secondary` (Contracheque), `CustomStyle` (Comunicados).

---

## 🤝 Padrões de Contribuição

1. **Novos Componentes**: Devem ser criados em `src/components/`, exportados pelo barrel `src/components/index.ts` e utilizar o `cn()` com CVA.
2. **Polimorfismo**: Sempre que aplicável, utilize `@radix-ui/react-slot` com `asChild`.
3. **Novas Stories**: Adicione as stories contextuais na pasta do projeto correspondente em `src/stories/<projeto>/`.
