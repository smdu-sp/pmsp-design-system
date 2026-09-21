import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Image as ImageIcon, X, FileText, Pencil, Check } from "lucide-react";
import { cn } from "@/utils/cn";

export const cardVariants = cva(
  "rounded-2xl border border-slate-200/80 bg-slate-50/80 text-slate-900 transition-all p-5 sm:p-6 md:p-7 shadow-xs w-full max-w-full sm:max-w-md",
  {
    variants: {
      variant: {
        text: "flex flex-col justify-center text-left",
        file: "flex flex-col items-center justify-center",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Alterna entre o modo textual com lista e o modo de upload de arquivo.
   * Padrão: "text".
   */
  variant?: "text" | "file";

  // --- Modo Texto ---
  /** Texto principal em destaque (título) */
  title?: string;
  /** Subtexto descritivo explicativo */
  subtitle?: string;
  /** Lista opcional de textos/tópicos */
  items?: string[];
  /** Tipo de lista para os itens: 'ul' (marcadores) ou 'ol' (ordenada/numerada) */
  listType?: "ul" | "ol";

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
      title,
      subtitle,
      items,
      listType = "ul",
      uploadText = "Arraste aqui o cartaz do mês",
      editableUploadText = false,
      onUploadTextChange,
      fileIcon,
      accept = "image/*",
      file: controlledFile,
      onFileSelect,
      backgroundColor,
      textColor,
      borderRadius,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const titleId = title ? `card-title-${generatedId}` : undefined;
    const subtitleId = subtitle ? `card-subtitle-${generatedId}` : undefined;
    const fileInputId = `card-file-input-${generatedId}`;
    const uploadStatusId = `card-upload-status-${generatedId}`;

    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const [internalFile, setInternalFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [isDragging, setIsDragging] = React.useState(false);

    // Estado e handlers para edição do texto de upload
    const [currentUploadText, setCurrentUploadText] = React.useState(uploadText);
    const [isEditingUploadText, setIsEditingUploadText] = React.useState(false);
    const [tempUploadText, setTempUploadText] = React.useState(uploadText);

    React.useEffect(() => {
      setCurrentUploadText(uploadText);
      setTempUploadText(uploadText);
    }, [uploadText]);

    const handleSaveUploadText = (e?: React.SyntheticEvent) => {
      e?.stopPropagation();
      setIsEditingUploadText(false);
      setCurrentUploadText(tempUploadText);
      onUploadTextChange?.(tempUploadText);
    };

    const handleCancelUploadText = (e?: React.SyntheticEvent) => {
      e?.stopPropagation();
      setIsEditingUploadText(false);
      setTempUploadText(currentUploadText);
    };

    const activeFile = controlledFile !== undefined ? controlledFile : internalFile;
    const fileName = typeof activeFile === "string" ? "Imagem carregada" : activeFile?.name;

    // Gerar URL de preview para imagens
    React.useEffect(() => {
      if (!activeFile) {
        setPreviewUrl(null);
        return;
      }

      if (typeof activeFile === "string") {
        setPreviewUrl(activeFile);
        return;
      }

      if (activeFile.type.startsWith("image/")) {
        const objectUrl = URL.createObjectURL(activeFile);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    }, [activeFile]);

    const handleFileChosen = (selectedFile: File | null) => {
      if (controlledFile === undefined) {
        setInternalFile(selectedFile);
      }
      onFileSelect?.(selectedFile);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] || null;
      handleFileChosen(selected);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const droppedFile = e.dataTransfer.files[0];
        handleFileChosen(droppedFile);
      }
    };

    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

    const handleDropzoneKeyDown = (e: React.KeyboardEvent) => {
      if (isEditingUploadText) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        triggerFileInput();
      }
    };

    const removeFile = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      handleFileChosen(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };

    // Resolução de cores e borda dinâmicos
    const resolvedBg = backgroundColor
      ? backgroundColor.startsWith("--")
        ? `var(${backgroundColor})`
        : backgroundColor
      : undefined;

    const resolvedTextColor = textColor
      ? textColor.startsWith("--")
        ? `var(${textColor})`
        : textColor
      : undefined;

    const resolvedBr =
      typeof borderRadius === "number"
        ? `${borderRadius}px`
        : borderRadius
        ? borderRadius.startsWith("--")
          ? `var(${borderRadius})`
          : borderRadius
        : undefined;

    const dynamicStyles: React.CSSProperties = {
      ...(resolvedBg ? { backgroundColor: resolvedBg } : {}),
      ...(resolvedTextColor ? { color: resolvedTextColor } : {}),
      ...(resolvedBr ? { borderRadius: resolvedBr } : {}),
      ...style,
    };

    return (
      <article
        ref={ref as React.Ref<HTMLElement>}
        className={cn(cardVariants({ variant, className }))}
        style={Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined}
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        {...props}
      >
        {variant === "file" ? (
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
              {activeFile
                ? `Arquivo ${fileName} carregado com sucesso.`
                : "Nenhum arquivo selecionado. Pressione Enter para selecionar um arquivo ou arraste um arquivo para esta área."}
            </span>

            <div
              role="button"
              tabIndex={isEditingUploadText ? -1 : 0}
              aria-label={
                activeFile
                  ? `Arquivo ${fileName} selecionado. Clique ou pressione Enter para substituir.`
                  : `${currentUploadText}. Clique ou pressione Enter para selecionar um arquivo.`
              }
              aria-describedby={uploadStatusId}
              onClick={triggerFileInput}
              onKeyDown={handleDropzoneKeyDown}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "group relative w-full border-2 border-dashed rounded-xl p-5 sm:p-7 md:p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer text-center select-none",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                isDragging
                  ? "border-blue-500 bg-blue-50/80 scale-[0.99]"
                  : "border-slate-300 hover:border-slate-400 bg-white/60 hover:bg-white"
              )}
            >
              {activeFile ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  {previewUrl ? (
                    <div className="relative group/preview w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt={`Pré-visualização do arquivo ${fileName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"
                      aria-hidden="true"
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="text-center px-2 max-w-full">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate max-w-[220px] sm:max-w-[260px]">
                      {fileName}
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Clique ou arraste para substituir
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeFile}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        removeFile(e);
                      }
                    }}
                    aria-label={`Remover arquivo ${fileName}`}
                    className="mt-1 inline-flex items-center justify-center gap-1.5 min-h-[36px] sm:min-h-[40px] px-3 py-1.5 text-xs sm:text-sm text-rose-600 hover:text-rose-700 font-medium rounded-lg hover:bg-rose-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-1"
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
                    <div
                      className="flex items-center gap-2 w-full max-w-xs z-10"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <input
                        type="text"
                        value={tempUploadText}
                        onChange={(e) => setTempUploadText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveUploadText(e);
                          if (e.key === "Escape") handleCancelUploadText(e);
                        }}
                        autoFocus
                        aria-label="Editar texto de orientação para upload"
                        className="w-full text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-blue-400 bg-white shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-slate-800 text-center"
                        placeholder="Digite o texto de upload..."
                      />
                      <button
                        type="button"
                        onClick={handleSaveUploadText}
                        aria-label="Confirmar alteração de texto"
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelUploadText}
                        aria-label="Cancelar alteração de texto"
                        className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-1"
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1.5 group/uploadtext max-w-full">
                      <p
                        className={cn(
                          "text-xs sm:text-sm font-medium text-slate-700 leading-snug break-words px-1",
                          editableUploadText && "hover:text-blue-600 cursor-text"
                        )}
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
                          className="min-w-[32px] min-h-[32px] flex items-center justify-center opacity-70 hover:opacity-100 text-slate-500 hover:text-blue-600 transition-all rounded-md hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
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
              <h3
                id={titleId}
                className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words"
              >
                {title}
              </h3>
            )}

            {subtitle && (
              <p
                id={subtitleId}
                className="mt-2 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed break-words"
              >
                {subtitle}
              </p>
            )}

            {items && items.length > 0 && (
              listType === "ol" ? (
                <ol className="mt-4 list-decimal pl-5 space-y-1.5 text-xs sm:text-sm md:text-base text-slate-600">
                  {items.map((item, index) => (
                    <li key={index} className="leading-relaxed break-words">
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="mt-4 list-disc pl-5 space-y-1.5 text-xs sm:text-sm md:text-base text-slate-600">
                  {items.map((item, index) => (
                    <li key={index} className="leading-relaxed break-words">
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )
            )}

            {children}
          </div>
        )}
      </article>
    );
  }
);

Card.displayName = "Card";
