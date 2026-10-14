import * as React from "react";
import { cn } from "./cn";

export interface IntranetNotification {
  /** Identificador único da notificação */
  id: string;
  /** Conteúdo textual ou JSX da notificação */
  message: React.ReactNode;
  /** Tempo relativo ou data exibida (ex: 'há 20 min', 'há 2h', 'ontem') */
  time: string;
  /** Indicador de notificação já lida */
  read?: boolean;
  /** Cor do ponto identificador à esquerda ('pink' | 'blue' | 'gray' | 'green') */
  dotColor?: "pink" | "blue" | "gray" | "green";
  /** Rota ou URL externa se a notificação redirecionar para um link */
  href?: string;
  /** Ação customizada ao clicar na notificação */
  onClick?: () => void;
}

export type IntranetTheme = "light" | "dark" | "system";

export interface IntranetThemeOption {
  id: IntranetTheme;
  label: string;
}

export interface IntranetUser {
  /** Nome principal do usuário (ex: 'Voce' ou 'Maria Silva') */
  name: string;
  /** Cargo ou função exibida abaixo do nome (ex: 'Analista de Sistemas - TI') */
  role: string;
  /** E-mail corporativo exibido no card de perfil */
  email: string;
  /** Iniciais para o avatar circular (ex: 'VV') */
  initials?: string;
  /** URL de imagem personalizada para o avatar */
  avatarUrl?: string;
  /** Cor de fundo hexadecimal ou classe para o círculo do avatar */
  avatarBg?: string;
}

export interface IntranetUserMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  danger?: boolean;
}

export type IntranetDropdownType = "notifications" | "theme" | "profile" | null;

/**
 * Notificações padrão fiéis ao modelo do print da SMUL Intranet.
 */
export const INTRANET_DEFAULT_NOTIFICATIONS: IntranetNotification[] = [
  {
    id: "notif-1",
    message: React.createElement(
      "span",
      null,
      React.createElement("strong", null, "Ingrid Jesus Costa e mais 4 pessoas"),
      " parabenizaram ",
      React.createElement("strong", null, "Mieco Miyazato"),
      " pelo aniversário.",
    ),
    time: "há 20 min",
    read: false,
    dotColor: "pink",
  },
  {
    id: "notif-2",
    message: React.createElement(
      "span",
      null,
      React.createElement(
        "strong",
        null,
        "Novo comunicado oficial: Atualização cadastral obrigatória.",
      ),
    ),
    time: "há 2h",
    read: false,
    dotColor: "blue",
  },
  {
    id: "notif-3",
    message: React.createElement(
      "span",
      null,
      React.createElement("strong", null, "Rogério do N. Gonçalves"),
      " comentou no seu post.",
    ),
    time: "ontem",
    read: true,
    dotColor: "gray",
  },
  {
    id: "notif-4",
    message: React.createElement(
      "span",
      null,
      React.createElement(
        "strong",
        null,
        "Vaga interna aberta na Coordenadoria de Licenciamento.",
      ),
    ),
    time: "há 2 dias",
    read: true,
    dotColor: "gray",
  },
];

/**
 * Opções padrão de tema disponíveis no dropdown de tema.
 */
export const INTRANET_THEME_OPTIONS: IntranetThemeOption[] = [
  { id: "light", label: "Claro" },
  { id: "dark", label: "Escuro" },
  { id: "system", label: "Sistema" },
];

/**
 * Dados padrão de usuário autenticado exibido no header.
 */
export const INTRANET_DEFAULT_USER: IntranetUser = {
  name: "Voce",
  role: "Analista de Sistemas - TI",
  email: "voce@prefeitura.sp.gov.br",
  initials: "VV",
  avatarBg: "#f43f5e",
};

/**
 * Retorna as classes de cor para a bolinha indicadora da notificação.
 */
export function getNotificationDotClass(
  dotColor: "pink" | "blue" | "gray" | "green" = "gray",
  read = false,
): string {
  if (read) {
    return "bg-slate-400";
  }

  switch (dotColor) {
    case "pink":
      return "bg-[#f43f5e]";
    case "blue":
      return "bg-[#0b3299]";
    case "green":
      return "bg-emerald-500";
    case "gray":
    default:
      return "bg-slate-400";
  }
}

/**
 * Retorna a classe padrão para o container flutuante do IntranetHeader.
 */
export function getIntranetHeaderContainerClass(className?: string): string {
  return cn(
    "w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs px-4 py-2.5 sm:px-6 sm:py-3 transition-all",
    className,
  );
}

/**
 * Retorna as classes para os containers flutuantes de cada dropdown do Header.
 */
export function getIntranetDropdownMenuClass(extraClass?: string): string {
  return cn(
    "absolute right-0 top-full mt-2.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 origin-top-right",
    extraClass,
  );
}

export interface UseIntranetHeaderStateParams {
  defaultOpenDropdown?: IntranetDropdownType;
  notifications?: IntranetNotification[];
  onNotificationReadChange?: (id: string, read: boolean) => void;
  onMarkAllAsRead?: () => void;
  defaultTheme?: IntranetTheme;
  onThemeChange?: (theme: IntranetTheme) => void;
}

/**
 * Hook para isolar o controle de abertura dos dropdowns, clique fora, atalhos de teclado e contagem de notificações.
 */
export function useIntranetHeaderState({
  defaultOpenDropdown = null,
  notifications: initialNotifications = INTRANET_DEFAULT_NOTIFICATIONS,
  onNotificationReadChange,
  onMarkAllAsRead,
  defaultTheme = "light",
  onThemeChange,
}: UseIntranetHeaderStateParams = {}) {
  const [activeDropdown, setActiveDropdown] = React.useState<IntranetDropdownType>(
    defaultOpenDropdown,
  );
  const [notificationsList, setNotificationsList] = React.useState<IntranetNotification[]>(
    initialNotifications,
  );
  const [currentTheme, setCurrentTheme] = React.useState<IntranetTheme>(defaultTheme);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    setActiveDropdown(defaultOpenDropdown);
  }, [defaultOpenDropdown]);

  React.useEffect(() => {
    setNotificationsList(initialNotifications);
  }, [initialNotifications]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Alterna ou fecha dropdown
  const toggleDropdown = React.useCallback(
    (type: NonNullable<IntranetDropdownType>) => {
      setActiveDropdown((prev) => (prev === type ? null : type));
    },
    [],
  );

  const closeDropdown = React.useCallback(() => {
    setActiveDropdown(null);
  }, []);

  // Fechar dropdown ao clicar fora ou ao pressionar Escape
  React.useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeDropdown, closeDropdown]);

  // Contagem de notificações não lidas
  const unreadCount = React.useMemo(() => {
    return notificationsList.filter((n) => !n.read).length;
  }, [notificationsList]);

  // Marcar todas como lidas
  const handleMarkAllAsRead = React.useCallback(() => {
    setNotificationsList((prev) =>
      prev.map((n) => ({ ...n, read: true })),
    );
    onMarkAllAsRead?.();
  }, [onMarkAllAsRead]);

  // Marcar uma notificação individual como lida
  const handleNotificationClick = React.useCallback(
    (item: IntranetNotification) => {
      if (!item.read) {
        setNotificationsList((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
        );
        onNotificationReadChange?.(item.id, true);
      }
      item.onClick?.();
    },
    [onNotificationReadChange],
  );

  // Selecionar tema
  const handleSelectTheme = React.useCallback(
    (themeId: IntranetTheme) => {
      setCurrentTheme(themeId);
      onThemeChange?.(themeId);
      closeDropdown();
    },
    [onThemeChange, closeDropdown],
  );

  return {
    containerRef,
    activeDropdown,
    setActiveDropdown,
    toggleDropdown,
    closeDropdown,
    notificationsList,
    unreadCount,
    handleMarkAllAsRead,
    handleNotificationClick,
    currentTheme,
    handleSelectTheme,
    searchQuery,
    setSearchQuery,
  };
}
