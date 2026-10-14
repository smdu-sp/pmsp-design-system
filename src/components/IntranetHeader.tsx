import * as React from "react";
import { Search, Bell, Sun, ChevronsUpDown, User as UserIcon } from "lucide-react";
import {
  type IntranetNotification,
  type IntranetTheme,
  type IntranetThemeOption,
  type IntranetUser,
  type IntranetUserMenuItem,
  type IntranetDropdownType,
  INTRANET_DEFAULT_NOTIFICATIONS,
  INTRANET_THEME_OPTIONS,
  INTRANET_DEFAULT_USER,
  getIntranetHeaderContainerClass,
  getIntranetDropdownMenuClass,
  getNotificationDotClass,
  useIntranetHeaderState,
} from "@/utils/intranetHeader";

export {
  type IntranetNotification,
  type IntranetTheme,
  type IntranetThemeOption,
  type IntranetUser,
  type IntranetUserMenuItem,
  type IntranetDropdownType,
  INTRANET_DEFAULT_NOTIFICATIONS,
  INTRANET_THEME_OPTIONS,
  INTRANET_DEFAULT_USER,
  getIntranetHeaderContainerClass,
  getIntranetDropdownMenuClass,
  getNotificationDotClass,
  useIntranetHeaderState,
};

export interface IntranetHeaderProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onSelect"> {
  /** Logo customizado ou elemento exibido à esquerda */
  logo?: React.ReactNode;
  /** Título principal exibido ao lado do logo (padrão: 'SMUL Intranet') */
  title?: string;
  /** Subtítulo institucional (padrão: 'Urbanismo e Licenciamento') */
  subtitle?: string;
  /** Placeholder do campo de busca (padrão: 'Buscar pessoas, comunicados, posts...') */
  searchPlaceholder?: string;
  /** Valor de busca controlado */
  searchValue?: string;
  /** Callback acionado ao alterar o termo de busca */
  onSearchChange?: (value: string) => void;
  /** Callback acionado ao submeter a busca */
  onSearchSubmit?: (query: string) => void;
  /** Lista de notificações exibidas no dropdown */
  notifications?: IntranetNotification[];
  /** Contagem explícita de notificações não lidas (calculado automaticamente se omitido) */
  unreadCount?: number;
  /** Callback acionado ao clicar em 'Marcar como lidas' */
  onMarkAllAsRead?: () => void;
  /** Callback acionado ao clicar em uma notificação individual */
  onNotificationClick?: (notification: IntranetNotification) => void;
  /** Tema ativo ('light' | 'dark' | 'system') */
  theme?: IntranetTheme;
  /** Opções de tema disponíveis */
  themeOptions?: IntranetThemeOption[];
  /** Callback acionado ao alterar o tema */
  onThemeChange?: (theme: IntranetTheme) => void;
  /** Dados do usuário logado exibido no perfil e dropdown */
  user?: IntranetUser;
  /** Itens de menu do dropdown de perfil */
  userMenuItems?: IntranetUserMenuItem[];
  /** Dropdown inicialmente aberto em modo controlado/storybook ('notifications' | 'theme' | 'profile' | null) */
  defaultOpenDropdown?: IntranetDropdownType;
  /** Callback acionado ao alterar o dropdown aberto */
  onDropdownChange?: (dropdown: IntranetDropdownType) => void;
  /** Ocultar a barra de busca central */
  hideSearch?: boolean;
}

export const INTRANET_DEFAULT_USER_MENU_ITEMS: IntranetUserMenuItem[] = [
  {
    id: "profile",
    label: "Meu perfil",
    icon: <UserIcon className="w-4 h-4" />,
  },
];

/**
 * Componente Header da **SMUL Intranet (Secretaria Municipal de Urbanismo e Licenciamento)**.
 *
 * Apresenta:
 * - Identidade visual com logo azul, título "SMUL Intranet" e subtítulo institucional.
 * - Campo central arredondado de busca rápida para pessoas, comunicados e posts.
 * - Três menus dropdown independentes à direita:
 *   1. **Notificações**: Lista de alertas com indicadores coloridos (rosa/azul/cinza), horário relativo e botão "Marcar como lidas".
 *   2. **Tema**: Seletor rápido de aparência (Claro, Escuro, Sistema).
 *   3. **Perfil**: Card com avatar com iniciais ('VV'), e-mail institucional e link "Meu perfil".
 */
export const IntranetHeader = React.forwardRef<HTMLElement, IntranetHeaderProps>(
  (
    {
      logo,
      title = "SMUL Intranet",
      subtitle = "Urbanismo e Licenciamento",
      searchPlaceholder = "Buscar pessoas, comunicados, posts...",
      searchValue,
      onSearchChange,
      onSearchSubmit,
      notifications = INTRANET_DEFAULT_NOTIFICATIONS,
      unreadCount: explicitUnreadCount,
      onMarkAllAsRead,
      onNotificationClick,
      theme = "light",
      themeOptions = INTRANET_THEME_OPTIONS,
      onThemeChange,
      user = INTRANET_DEFAULT_USER,
      userMenuItems = INTRANET_DEFAULT_USER_MENU_ITEMS,
      defaultOpenDropdown = null,
      onDropdownChange,
      hideSearch = false,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const {
      containerRef,
      activeDropdown,
      setActiveDropdown,
      toggleDropdown,
      closeDropdown,
      notificationsList,
      unreadCount: calculatedUnreadCount,
      handleMarkAllAsRead,
      handleNotificationClick,
      currentTheme,
      handleSelectTheme,
      searchQuery,
      setSearchQuery,
    } = useIntranetHeaderState({
      defaultOpenDropdown,
      notifications,
      onMarkAllAsRead,
      defaultTheme: theme,
      onThemeChange,
    });

    // Notifica consumidor sobre alteração no dropdown
    React.useEffect(() => {
      onDropdownChange?.(activeDropdown);
    }, [activeDropdown, onDropdownChange]);

    const activeUnreadCount =
      explicitUnreadCount !== undefined ? explicitUnreadCount : calculatedUnreadCount;

    const currentSearchValue = searchValue !== undefined ? searchValue : searchQuery;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (searchValue === undefined) {
        setSearchQuery(val);
      }
      onSearchChange?.(val);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearchSubmit?.(currentSearchValue);
    };

    return (
      <header
        ref={ref}
        role="banner"
        className={getIntranetHeaderContainerClass(className)}
        style={style}
        {...props}
      >
        <div
          ref={containerRef}
          className="w-full flex items-center justify-between gap-3 sm:gap-4 relative"
        >
          {/* Logo e Identificação Institucional à Esquerda */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {logo ? (
              logo
            ) : (
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0b3299] flex items-center justify-center shrink-0 shadow-2xs select-none"
                aria-hidden="true"
              >
                <div className="w-4 h-4 rounded-sm bg-white/20 border border-white/40" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base text-[#0b3299] leading-snug">
                {title}
              </span>
              <span className="text-[11px] sm:text-xs text-slate-500 font-normal leading-tight">
                {subtitle}
              </span>
            </div>
          </div>

          {/* Campo Central de Busca */}
          {!hideSearch && (
            <form
              role="search"
              onSubmit={handleFormSubmit}
              className="grow max-w-xs md:max-w-md lg:max-w-lg hidden sm:flex items-center"
            >
              <div className="w-full flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 bg-slate-50/90 hover:bg-slate-100/70 focus-within:bg-white rounded-full border border-slate-200/90 focus-within:border-[#0b3299] focus-within:ring-2 focus-within:ring-[#0b3299]/15 transition-all">
                <Search className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
                <input
                  type="search"
                  value={currentSearchValue}
                  onChange={handleInputChange}
                  placeholder={searchPlaceholder}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
            </form>
          )}

          {/* Área de Ações e Dropdowns à Direita */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Dropdown de Notificações */}
            <div className="relative">
              <button
                type="button"
                id="intranet-notifications-trigger"
                onClick={() => toggleDropdown("notifications")}
                aria-expanded={activeDropdown === "notifications"}
                aria-haspopup="true"
                aria-label={`Notificações (${activeUnreadCount} não lidas)`}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-[#0b3299] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299]"
              >
                <Bell className="w-5 h-5 stroke-[1.75]" />
                {activeUnreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center ring-2 ring-white">
                    {activeUnreadCount}
                  </span>
                )}
              </button>

              {activeDropdown === "notifications" && (
                <div
                  role="menu"
                  aria-labelledby="intranet-notifications-trigger"
                  className={getIntranetDropdownMenuClass("w-[320px] sm:w-[360px] p-0")}
                >
                  {/* Cabeçalho do Dropdown */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
                    <span className="text-sm font-bold text-slate-900">Notificacoes</span>
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs font-semibold text-[#0b3299] hover:text-blue-800 hover:underline transition-colors cursor-pointer"
                    >
                      Marcar como lidas
                    </button>
                  </div>

                  {/* Lista de Notificações */}
                  <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto bg-white">
                    {notificationsList.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        Nenhuma notificação no momento.
                      </div>
                    ) : (
                      notificationsList.map((notif) => (
                        <div
                          key={notif.id}
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => {
                            handleNotificationClick(notif);
                            onNotificationClick?.(notif);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleNotificationClick(notif);
                              onNotificationClick?.(notif);
                            }
                          }}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50/90 transition-colors cursor-pointer text-left select-none outline-none focus-visible:bg-slate-50"
                        >
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getNotificationDotClass(
                              notif.dotColor,
                              notif.read,
                            )}`}
                            aria-hidden="true"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs text-slate-800 leading-snug font-normal">
                              {notif.message}
                            </div>
                            <span className="block text-[11px] text-slate-400 mt-1">
                              {notif.time}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Dropdown de Tema (Claro / Escuro / Sistema) */}
            <div className="relative">
              <button
                type="button"
                id="intranet-theme-trigger"
                onClick={() => toggleDropdown("theme")}
                aria-expanded={activeDropdown === "theme"}
                aria-haspopup="true"
                aria-label="Selecionar tema visual"
                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-[#0b3299] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299]"
              >
                <Sun className="w-5 h-5 stroke-[1.75]" />
              </button>

              {activeDropdown === "theme" && (
                <div
                  role="menu"
                  aria-labelledby="intranet-theme-trigger"
                  className={getIntranetDropdownMenuClass("w-[140px] p-1.5")}
                >
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      role="menuitem"
                      onClick={() => handleSelectTheme(opt.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                        currentTheme === opt.id
                          ? "bg-[#0b3299]/10 text-[#0b3299] font-medium"
                          : "text-slate-800 hover:bg-slate-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {currentTheme === opt.id && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0b3299]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Dropdown de Perfil do Usuário */}
            <div className="relative">
              <button
                type="button"
                id="intranet-user-trigger"
                onClick={() => toggleDropdown("profile")}
                aria-expanded={activeDropdown === "profile"}
                aria-haspopup="true"
                aria-label={`Menu de usuário: ${user.name}`}
                className="flex items-center gap-2.5 p-1 sm:p-1.5 sm:pr-2 rounded-xl hover:bg-slate-100/80 cursor-pointer transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299]"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs select-none"
                  style={{ backgroundColor: user.avatarBg || "#f43f5e" }}
                >
                  {user.initials || "VV"}
                </div>
                <div className="hidden md:block text-left min-w-0">
                  <div className="font-semibold text-xs text-slate-900 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                    {user.role}
                  </div>
                </div>
                <ChevronsUpDown className="w-3.5 h-3.5 text-slate-400 ml-0.5 shrink-0" />
              </button>

              {activeDropdown === "profile" && (
                <div
                  role="menu"
                  aria-labelledby="intranet-user-trigger"
                  className={getIntranetDropdownMenuClass("w-[260px] p-0")}
                >
                  {/* Cabeçalho de Perfil com Avatar e E-mail */}
                  <div className="flex items-center gap-3 p-3.5 border-b border-slate-100 bg-white">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs"
                      style={{ backgroundColor: user.avatarBg || "#f43f5e" }}
                    >
                      {user.initials || "VV"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-slate-900 leading-tight">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate leading-tight mt-0.5">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Itens do Menu de Usuário */}
                  <div className="p-1.5 bg-white">
                    {userMenuItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          item.onClick?.();
                          closeDropdown();
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-xl transition-colors cursor-pointer text-left ${
                          item.danger
                            ? "text-rose-600 hover:bg-rose-50"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {item.icon && (
                          <span className="shrink-0 text-slate-500" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  },
);

IntranetHeader.displayName = "IntranetHeader";
