import * as React from "react";
import { getIntranetInitials, getIntranetAvatarColor } from "./intranetCard";

export interface IntranetPostAuthor {
  /** Nome do autor ou coordenadoria que publicou o post */
  name: string;
  /** Iniciais para o avatar colorido (ex: 'CC', 'SMUL') */
  initials?: string;
  /** URL da foto de perfil do autor */
  avatarSrc?: string;
  /** Cor de fundo para o avatar com iniciais */
  avatarColor?: string;
  /** Subtítulo com departamento e tempo relativo (ex: 'Comunicacao SMUL - ha 1h') */
  subtitle?: string;
  /** Tag ou categoria do post exibida ao lado do nome (ex: 'comunicado', 'aviso', 'evento') */
  tag?: string;
}

export interface IntranetPostComment {
  /** Identificador único do comentário */
  id: string;
  /** Nome do autor do comentário */
  authorName: string;
  /** Iniciais para o avatar do autor do comentário */
  authorInitials?: string;
  /** URL da foto de perfil do autor do comentário */
  authorAvatar?: string;
  /** Cor de fundo do avatar de iniciais */
  authorColor?: string;
  /** Conteúdo textual do comentário */
  content: string;
  /** Tempo relativo de envio (ex: 'Agora', 'ha 10min') */
  createdAt?: string;
}

export interface IntranetPostCurrentUser {
  name: string;
  initials?: string;
  avatarSrc?: string;
  avatarColor?: string;
}

/**
 * Usuário autenticado padrão da Intranet (compatível com IntranetHeader).
 */
export const INTRANET_DEFAULT_CURRENT_USER: IntranetPostCurrentUser = {
  name: "Vinicius Vieira",
  initials: "VV",
  avatarColor: "#e11d48",
};

/**
 * Comentários padrão fiéis ao modelo da foto.
 */
export const INTRANET_DEFAULT_POST_COMMENTS: IntranetPostComment[] = [
  {
    id: "comment-1",
    authorName: "Sandra Maria Coelho Cruz",
    authorInitials: "SC",
    authorColor: "#7c3aed",
    content: "Feito! Muito importante essa atualizacao.",
    createdAt: "ha 45min",
  },
];

export interface IntranetPostSampleData {
  author: IntranetPostAuthor;
  content: string;
  image?: string;
  imageAlt?: string;
  likesCount: number;
  comments: IntranetPostComment[];
}

/**
 * Dados padrão da postagem fiéis à foto de referência da SMUL Intranet.
 */
export const INTRANET_SAMPLE_POST: IntranetPostSampleData = {
  author: {
    name: "Coordenadoria de Comunicacao",
    initials: "CC",
    avatarColor: "#1e3a8a",
    subtitle: "Comunicacao SMUL - ha 1h",
    tag: "comunicado",
  },
  content:
    "Ja conferiu se o seu cadastro esta atualizado? Atualize seus dados de contato no portal do servidor para mantermos uma comunicacao assertiva. E simples e rapido!",
  image: "/intranet_post_banner.jpg",
  imageAlt: "O novo site da INTRANET está no ar!",
  likesCount: 34,
  comments: INTRANET_DEFAULT_POST_COMMENTS,
};

export interface ResolveIntranetPostAuthorParams {
  author?: IntranetPostAuthor;
  authorName?: string;
  authorSubtitle?: string;
  authorTag?: string;
  authorInitials?: string;
  authorColor?: string;
  authorAvatar?: string;
}

/**
 * Normaliza os dados do autor da publicação (nome, subtítulo, tag, iniciais, cor e foto).
 */
export function resolveIntranetPostAuthor({
  author,
  authorName,
  authorSubtitle,
  authorTag,
  authorInitials,
  authorColor,
  authorAvatar,
}: ResolveIntranetPostAuthorParams) {
  const effectiveAuthorName = authorName || author?.name || "Coordenadoria de Comunicação";
  const effectiveAuthorSubtitle = authorSubtitle || author?.subtitle || "Comunicação SMUL - há 1h";
  const effectiveAuthorTag = authorTag || author?.tag || "comunicado";
  const effectiveAuthorInitials = authorInitials || author?.initials || getIntranetInitials(effectiveAuthorName);
  const effectiveAuthorColor = authorColor || author?.avatarColor || getIntranetAvatarColor(effectiveAuthorName);
  const effectiveAuthorAvatar = authorAvatar || author?.avatarSrc;

  return {
    effectiveAuthorName,
    effectiveAuthorSubtitle,
    effectiveAuthorTag,
    effectiveAuthorInitials,
    effectiveAuthorColor,
    effectiveAuthorAvatar,
  };
}

export interface UseIntranetPostStateParams {
  controlledLikesCount?: number;
  controlledIsLiked?: boolean;
  onLikeToggle?: (liked: boolean, newCount: number) => void;
  comments?: IntranetPostComment[];
  onCommentSubmit?: (newComment: IntranetPostComment) => void;
  currentUser?: IntranetPostCurrentUser;
  onShare?: () => void;
}

/**
 * Hook utilitário que isola o estado e as ações da publicação da Intranet (curtidas, comentários e compartilhamento).
 */
export function useIntranetPostState({
  controlledLikesCount,
  controlledIsLiked,
  onLikeToggle,
  comments = INTRANET_DEFAULT_POST_COMMENTS,
  onCommentSubmit,
  currentUser = INTRANET_DEFAULT_CURRENT_USER,
  onShare,
}: UseIntranetPostStateParams) {
  // --- Estado de Curtidas ---
  const [internalIsLiked, setInternalIsLiked] = React.useState<boolean>(controlledIsLiked ?? false);
  const [internalLikesCount, setInternalLikesCount] = React.useState<number>(
    controlledLikesCount ?? INTRANET_SAMPLE_POST.likesCount,
  );

  React.useEffect(() => {
    if (controlledIsLiked !== undefined) {
      setInternalIsLiked(controlledIsLiked);
    }
  }, [controlledIsLiked]);

  React.useEffect(() => {
    if (controlledLikesCount !== undefined) {
      setInternalLikesCount(controlledLikesCount);
    }
  }, [controlledLikesCount]);

  const isLiked = controlledIsLiked !== undefined ? controlledIsLiked : internalIsLiked;
  const likes = controlledLikesCount !== undefined ? controlledLikesCount : internalLikesCount;

  const handleLikeClick = () => {
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likes + 1 : Math.max(0, likes - 1);

    if (controlledIsLiked === undefined) {
      setInternalIsLiked(nextLiked);
    }
    if (controlledLikesCount === undefined) {
      setInternalLikesCount(nextCount);
    }

    onLikeToggle?.(nextLiked, nextCount);
  };

  // --- Estado de Comentários e Compartilhamento ---
  const [internalComments, setInternalComments] = React.useState<IntranetPostComment[]>(comments);
  const [commentText, setCommentText] = React.useState<string>("");
  const [copiedShare, setCopiedShare] = React.useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string>("");
  const commentInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setInternalComments(comments);
  }, [comments]);

  const commentsList = internalComments;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentText.trim();
    if (!trimmed) return;

    const newComment: IntranetPostComment = {
      id: `comment-${Date.now()}`,
      authorName: currentUser.name,
      authorInitials: currentUser.initials || getIntranetInitials(currentUser.name),
      authorAvatar: currentUser.avatarSrc,
      authorColor: currentUser.avatarColor || getIntranetAvatarColor(currentUser.name),
      content: trimmed,
      createdAt: "Agora",
    };

    setInternalComments((prev) => [...prev, newComment]);
    setCommentText("");
    setFeedbackMessage("Comentário publicado com sucesso.");
    setTimeout(() => setFeedbackMessage(""), 3000);
    onCommentSubmit?.(newComment);
  };

  const handleShareClick = () => {
    if (onShare) {
      onShare();
      return;
    }

    if (typeof window !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setFeedbackMessage("Link copiado para a área de transferência.");
      setTimeout(() => {
        setCopiedShare(false);
        setFeedbackMessage("");
      }, 2000);
    }
  };

  return {
    isLiked,
    likes,
    handleLikeClick,
    commentsList,
    commentText,
    setCommentText,
    copiedShare,
    feedbackMessage,
    commentInputRef,
    handleCommentSubmit,
    handleShareClick,
  };
}

/**
 * Resolve as iniciais e a cor de avatar para um comentário individual da postagem.
 */
export function resolveCommentAuthor(comment: IntranetPostComment) {
  const initial = comment.authorInitials || getIntranetInitials(comment.authorName);
  const color = comment.authorColor || getIntranetAvatarColor(comment.authorName);
  return { initial, color };
}

/**
 * Resolve as iniciais e a cor de avatar do usuário atual logado.
 */
export function resolveCurrentUserAvatar(currentUser: IntranetPostCurrentUser) {
  const initial = currentUser.initials || getIntranetInitials(currentUser.name);
  const color = currentUser.avatarColor || getIntranetAvatarColor(currentUser.name);
  return { initial, color };
}


