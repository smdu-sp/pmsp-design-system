import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { Image as ImageIcon, X, FileText, Pencil, Check, MessageCircle, Play, Plus } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  cardVariants,
  type CardVariant,
  type CardListType,
  resolveCardStyles,
  resolveCardLink,
  resolveCardAriaIds,
  useCardUpload,
} from "@/utils/card";

export { cardVariants };
export type { CardVariant, CardListType };

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, "title">, VariantProps<typeof cardVariants> {
  /**
   * Permite renderizar como componente customizado usando o Radix Slot.
   */
  asChild?: boolean;

  /**
   * Alterna entre o modo textual com lista, modo de upload de arquivo, acesso rápido e mídia/vídeo.
   * Padrão: "text".
   */
  variant?: CardVariant;

  // --- Modo Mídia / Vídeo ---
  /** Imagem da miniatura do vídeo/mídia (URL ou componente). Caso não seja fornecida, exibe o fallback tracejado */
  image?: string | React.ReactNode;
  /** Texto alternativo para a imagem da miniatura */
  imageAlt?: string;
  /** Imagem ou URL da miniatura (alias compatível com a prop image) */
  thumbnail?: string | React.ReactNode;
  /** Texto exibido no fallback quando não houver imagem fornecida (padrão: "Miniatura do vídeo") */
  thumbnailText?: string;
  /** Ícone customizado no centro do fallback da miniatura */
  thumbnailIcon?: React.ReactNode;
  /** Indicador ou badge de status exibido no card de mídia (ex: "Em breve") */
  status?: string;

  // --- Modo Acesso Rápido / Navegação ---
  /** Rota ou URL para onde o card direciona (ex: '/fale-conosco', '/cipa/atas', 'https://...') */
  route?: string;
  /** Link de destino alternativo (mesmo efeito que route) */
  href?: string;
  /** Ícone exibido no topo (utilizado principalmente na variante 'quick-access') */
  icon?: React.ReactNode;
  /** Identificador ou chave do ícone selecionado (evita vazamento de prop para o DOM) */
  selectedIcon?: string;
  /** Destino do link (ex: '_blank', '_self') */
  target?: string;
  /** Relação do link para segurança contra tabnabbing (ex: 'noopener noreferrer') */
  rel?: string;

  // --- Modo Texto ---
  /** Texto principal em destaque (título) */
  title?: string;
  /** Subtexto descritivo explicativo */
  subtitle?: string;
  /** Alias descritivo para subtitle */
  description?: string;
  /** Lista opcional de textos/tópicos */
  items?: string[];
  /** Tipo de lista para os itens: 'ul' (marcadores) ou 'ol' (ordenada/numerada) */
  listType?: CardListType;

  // --- Modo Arquivo ---
  /** Texto orientativo exibido na área de upload */
  uploadText?: string;
  /** Permite editar o texto de upload diretamente no card */
  editableUploadText?: boolean;
  /** Callback acionado quando o texto de upload for alterado pelo usuário */
  onUploadTextChange?: (newText: string) => void;
  /** Ícone customizado da área de upload */
  fileIcon?: React.ReactNode;
  /** Tipos de arquivos aceitos pelo input (ex: 'image/*', '.pdf', etc.) */
  accept?: string;
  /** Arquivo atualmente selecionado (ou URL de imagem para preview) */
  file?: File | string | null;
  /** Callback disparado quando um arquivo é selecionado ou removido */
  onFileSelect?: (file: File | null) => void;

  // --- Customização de Estilos ---
  /** Cor de fundo customizada (hexadecimal '#...' ou variável CSS 'var(--...)') */
  backgroundColor?: string;
  /** Cor do texto customizada (hexadecimal '#...' ou variável CSS 'var(--...)') */
  textColor?: string;
  /** Raio de borda customizado (ex: '16px', '1rem', '9999px' ou número) */
  borderRadius?: string | number;
}

export const Card = React.forwardRef<HTMLElement, CardProps>(
  (
    {
      className,
      variant = "text",
      asChild = false,
      route = "/",
      href,
      icon,
      selectedIcon,
      target,
      rel,
      title,
      subtitle,
      description,
      items,
      listType = "ul",
      uploadText = "Arraste aqui o cartaz do mês",
      editableUploadText = false,
      onUploadTextChange,
      fileIcon,
      accept = "image/*",
      file: controlledFile,
      onFileSelect,
      image,
      imageAlt,
      thumbnail,
      thumbnailText = "Miniatura do vídeo",
      thumbnailIcon,
      status,
      backgroundColor,
      textColor,
      borderRadius,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const effectiveSubtitle = subtitle || description;
    const { titleId, subtitleId, fileInputId, uploadStatusId } = resolveCardAriaIds(generatedId, title, effectiveSubtitle);

    const { isLink, linkHref, resolvedRel } = resolveCardLink({
      variant,
      href,
      route,
      rel,
      target,
    });

    const {
      fileInputRef,
      textInputRef,
      activeFile,
      fileName,
      previewUrl,
      isDragging,
      currentUploadText,
      isEditingUploadText,
      setIsEditingUploadText,
      tempUploadText,
      setTempUploadText,
      handleSaveUploadText,
      handleCancelUploadText,
      handleInputChange,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      triggerFileInput,
      handleDropzoneKeyDown,
      removeFile,
    } = useCardUpload({
      uploadText,
      onUploadTextChange,
      controlledFile,
      onFileSelect,
    });

    const commonStyles = resolveCardStyles({
      backgroundColor,
      textColor,
      borderRadius,
      style,
    });

    const content = (
      <>
        {variant === "media" ? (
          <div className="w-full flex flex-col items-start">
            {image || thumbnail ? (
              typeof (image || thumbnail) === "string" ? (
                <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(image || thumbnail) as string}
                    alt={imageAlt || title || "Miniatura do vídeo"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/95 text-slate-800 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110">
                      <Play className="w-4 h-4 ml-0.5 fill-current text-slate-800" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              ) : React.isValidElement(image || thumbnail) ? (
                <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">{image || thumbnail}</div>
              ) : null
            ) : (
              <div className="relative w-full h-36 sm:h-40 rounded-xl border border-dashed border-slate-300/90 bg-slate-50/50 overflow-hidden flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:border-slate-400 group-hover:bg-slate-100/60 transition-all select-none">
                <div className="text-slate-400 group-hover:text-slate-500 transition-colors" aria-hidden="true">
                  {thumbnailIcon ?? <ImageIcon className="w-7 h-7 stroke-[1.25]" />}
                </div>
                <span className="text-xs sm:text-sm text-slate-500 font-normal">{thumbnailText}</span>
              </div>
            )}

            <div className="mt-4 sm:mt-5 w-full">
              {title && (
                <h3 id={titleId} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug wrap-break-word group-hover:text-blue-600 transition-colors">
                  {title}
                </h3>
              )}

              {(subtitle || status) && (
                <p id={subtitleId} className="mt-1.5 text-xs sm:text-sm italic text-slate-500 leading-relaxed wrap-break-word">
                  {subtitle ?? status}
                </p>
              )}

              {children}
            </div>
          </div>
        ) : variant === "quick-access" ? (
          <div className="w-full flex flex-col items-start">
            {icon !== null && (
              <div className="mb-3 text-slate-700 transition-transform duration-200 group-hover:scale-110" aria-hidden="true">
                {icon ?? <MessageCircle className="w-6 h-6 stroke-[1.75]" />}
              </div>
            )}

            {title && (
              <h3 id={titleId} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug wrap-break-word group-hover:text-blue-600 transition-colors">
                {title}
              </h3>
            )}

            {subtitle && (
              <p id={subtitleId} className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed wrap-break-word">
                {subtitle}
              </p>
            )}

            {children}
          </div>
        ) : variant === "caf" ? (
          <div className="w-full flex items-center gap-4 sm:gap-5">
            <div
              className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200/90 bg-white flex items-center justify-center text-slate-800 shadow-2xs group-hover:border-slate-300 group-hover:bg-slate-50 group-hover:scale-105 transition-all duration-200"
              aria-hidden="true"
            >
              {icon ?? <Plus className="w-5 h-5 stroke-[2] text-slate-800" />}
            </div>
            <div className="flex flex-col justify-center min-w-0">
              {title && (
                <h3 id={titleId} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug group-hover:text-[#0b3299] transition-colors">
                  {title}
                </h3>
              )}
              {effectiveSubtitle && (
                <p id={subtitleId} className="mt-1 text-xs sm:text-sm text-slate-500 leading-normal sm:leading-relaxed">
                  {effectiveSubtitle}
                </p>
              )}
              {children}
            </div>
          </div>
        ) : variant === "file" ? (
          <div className="w-full">
            {/* Input nativo com label acessível para leitores de tela */}
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="sr-only"
              tabIndex={-1}
              aria-label={currentUploadText || "Selecionar arquivo para upload"}
            />

            {/* Região ao vivo para anunciar alterações no status do upload a leitores de tela */}
            <span id={uploadStatusId} className="sr-only" aria-live="polite" aria-atomic="true">
              {activeFile ? `Arquivo ${fileName} carregado com sucesso.` : "Nenhum arquivo selecionado. Pressione Enter para selecionar um arquivo ou arraste um arquivo para esta área."}
            </span>

            <div
              role="button"
              tabIndex={isEditingUploadText ? -1 : 0}
              aria-label={activeFile ? `Arquivo ${fileName} selecionado. Clique ou pressione Enter para substituir.` : `${currentUploadText}. Clique ou pressione Enter para selecionar um arquivo.`}
              aria-describedby={uploadStatusId}
              onClick={triggerFileInput}
              onKeyDown={handleDropzoneKeyDown}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "group relative w-full border-2 border-dashed rounded-xl p-5 sm:p-7 md:p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer text-center select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                isDragging ? "border-blue-500 bg-blue-50/80 scale-[0.99]" : "border-slate-300 hover:border-slate-400 bg-white/60 hover:bg-white",
              )}
            >
              {activeFile ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  {previewUrl ? (
                    <div className="relative group/preview w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt={`Pré-visualização do arquivo ${fileName}`} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500" aria-hidden="true">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="text-center px-2 max-w-full">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate max-w-55 sm:max-w-55">{fileName}</p>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">Clique ou arraste para substituir</p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    aria-label={`Remover arquivo ${fileName}`}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 min-h-9 sm:min-h-10 px-3 py-1.5 text-xs sm:text-sm text-rose-600 hover:text-rose-700 font-medium rounded-lg hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                    <span>Remover</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-slate-400 group-hover:text-slate-500 transition-colors" aria-hidden="true">
                    {fileIcon ?? <ImageIcon className="w-9 h-9 sm:w-10 sm:h-10 stroke-[1.5]" />}
                  </div>

                  {isEditingUploadText ? (
                    <div className="flex items-center gap-2 w-full max-w-xs z-10" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                      <input
                        ref={textInputRef}
                        type="text"
                        value={tempUploadText}
                        onChange={(e) => setTempUploadText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveUploadText(e);
                          if (e.key === "Escape") handleCancelUploadText(e);
                        }}
                        aria-label="Editar texto de orientação para upload"
                        className="w-full text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-blue-400 bg-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-slate-800 text-center"
                        placeholder="Digite o texto de upload..."
                      />
                      <button
                        type="button"
                        onClick={handleSaveUploadText}
                        aria-label="Confirmar alteração de texto"
                        className="min-w-9 min-h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelUploadText}
                        aria-label="Cancelar alteração de texto"
                        className="min-w-9 min-h-9 flex items-center justify-center rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-1"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 group/uploadtext max-w-full">
                      <p
                        className={cn("text-xs sm:text-sm font-medium text-slate-700 leading-snug wrap-break-word px-1", editableUploadText && "hover:text-blue-600 cursor-text")}
                        title={editableUploadText ? "Duplo clique para editar o texto" : undefined}
                        onDoubleClick={(e) => {
                          if (editableUploadText) {
                            e.stopPropagation();
                            setIsEditingUploadText(true);
                          }
                        }}
                      >
                        {currentUploadText}
                      </p>
                      {editableUploadText && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditingUploadText(true);
                          }}
                          aria-label={`Editar texto: ${currentUploadText}`}
                          className="min-w-8 min-h-8 flex items-center justify-center opacity-70 hover:opacity-100 text-slate-500 hover:text-blue-600 transition-all rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
            {children}
          </div>
        ) : (
          <div className="w-full">
            {title && (
              <h3 id={titleId} className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-snug wrap-break-word">
                {title}
              </h3>
            )}

            {subtitle && (
              <p id={subtitleId} className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed wrap-break-word">
                {subtitle}
              </p>
            )}

            {items &&
              items.length > 0 &&
              (listType === "ol" ? (
                <ol className="mt-4 list-decimal pl-5 space-y-1.5 text-xs sm:text-sm md:text-base text-slate-600">
                  {items.map((item, index) => (
                    <li key={`${item}-${index}`} className="leading-relaxed wrap-break-word">
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-4 list-disc pl-5 space-y-1.5 text-xs sm:text-sm md:text-base text-slate-600">
                  {items.map((item, index) => (
                    <li key={`${item}-${index}`} className="leading-relaxed wrap-break-word">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ))}

            {children}
          </div>
        )}
      </>
    );

    const commonClasses = cn(cardVariants({ variant, className }));

    if (asChild) {
      return (
        <Slot ref={ref} className={commonClasses} style={commonStyles} {...props}>
          {content}
        </Slot>
      );
    }

    if (isLink) {
      return (
        <Link
          href={linkHref}
          target={target}
          rel={resolvedRel}
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={commonClasses}
          style={commonStyles}
          aria-labelledby={titleId}
          aria-describedby={subtitleId}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <article
        ref={ref}
        className={commonClasses}
        style={commonStyles}
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        role={props.onClick ? "button" : props.role}
        tabIndex={props.onClick ? (props.tabIndex ?? 0) : props.tabIndex}
        onKeyDown={(e) => {
          if (props.onClick && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            props.onClick(e as any);
          }
          props.onKeyDown?.(e);
        }}
        {...props}
      >
        {content}
      </article>
    );
  },
);

Card.displayName = "Card";
