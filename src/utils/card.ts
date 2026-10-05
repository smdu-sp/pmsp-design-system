import * as React from "react";
import { cva } from "class-variance-authority";

export const cardVariants = cva(
  "rounded-2xl border border-slate-200/80 bg-slate-50/80 text-slate-900 transition-all p-5 sm:p-6 md:p-7 shadow-xs w-full max-w-full sm:max-w-md",
  {
    variants: {
      variant: {
        text: "flex flex-col justify-center text-left",
        file: "flex flex-col items-center justify-center",
        "quick-access":
          "group flex flex-col justify-start text-left hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 no-underline",
        media: "group flex flex-col justify-start text-left p-4 sm:p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  },
);

export type CardVariant = "text" | "file" | "quick-access" | "media";
export type CardListType = "ul" | "ol";

export interface ResolveCardStylesParams {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

/**
 * Converte variáveis CSS, cores hexadecimais e raios de borda em estilos inline para o Card.
 */
export function resolveCardStyles({
  backgroundColor,
  textColor,
  borderRadius,
  style,
}: ResolveCardStylesParams): React.CSSProperties | undefined {
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

  return Object.keys(dynamicStyles).length > 0 ? dynamicStyles : undefined;
}

export interface ResolveCardLinkParams {
  variant?: CardVariant;
  href?: string;
  route?: string;
  rel?: string;
  target?: string;
}

/**
 * Resolve se o card deve se comportar como link de navegação e formata href e rel de segurança.
 */
export function resolveCardLink({
  variant,
  href,
  route,
  rel,
  target,
}: ResolveCardLinkParams): {
  isLink: boolean;
  linkHref: string;
  resolvedRel?: string;
} {
  const isLink = variant === "quick-access" || (Boolean(href) && variant !== "file");
  const linkHref = href || route || "/";
  const resolvedRel = rel ?? (target === "_blank" ? "noopener noreferrer" : undefined);

  return { isLink, linkHref, resolvedRel };
}

/**
 * Gera IDs semânticos para acessibilidade (WCAG) nos cards (título, subtítulo, input de arquivo e status).
 */
export function resolveCardAriaIds(id: string, title?: string, subtitle?: string) {
  return {
    titleId: title ? `card-title-${id}` : undefined,
    subtitleId: subtitle ? `card-subtitle-${id}` : undefined,
    fileInputId: `card-file-input-${id}`,
    uploadStatusId: `card-upload-status-${id}`,
  };
}

export interface UseCardUploadParams {
  uploadText?: string;
  onUploadTextChange?: (newText: string) => void;
  controlledFile?: File | string | null;
  onFileSelect?: (file: File | null) => void;
}

/**
 * Hook utilitário que isola toda a lógica de upload de arquivo, drag-and-drop,
 * preview de imagem e edição inline de texto de orientação da área de upload do Card.
 */
export function useCardUpload({
  uploadText = "Arraste aqui o cartaz do mês",
  onUploadTextChange,
  controlledFile,
  onFileSelect,
}: UseCardUploadParams) {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const textInputRef = React.useRef<HTMLInputElement | null>(null);
  const [internalFile, setInternalFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const [currentUploadText, setCurrentUploadText] = React.useState(uploadText);
  const [isEditingUploadText, setIsEditingUploadText] = React.useState(false);
  const [tempUploadText, setTempUploadText] = React.useState(uploadText);

  React.useEffect(() => {
    setCurrentUploadText(uploadText);
    if (!isEditingUploadText) {
      setTempUploadText(uploadText);
    }
  }, [uploadText, isEditingUploadText]);

  React.useEffect(() => {
    if (isEditingUploadText) {
      textInputRef.current?.focus();
      textInputRef.current?.select();
    }
  }, [isEditingUploadText]);

  const handleSaveUploadText = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsEditingUploadText(false);
    setCurrentUploadText(tempUploadText);
    onUploadTextChange?.(tempUploadText);
  };

  const handleCancelUploadText = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsEditingUploadText(false);
    setTempUploadText(currentUploadText);
  };

  const activeFile = controlledFile !== undefined ? controlledFile : internalFile;
  const fileName = typeof activeFile === "string" ? "Imagem carregada" : activeFile?.name;

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

  const removeFile = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    handleFileChosen(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return {
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
  };
}
