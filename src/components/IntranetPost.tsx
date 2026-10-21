import * as React from "react";
import { Heart, MessageCircle, Share2, Send, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import {
  type IntranetPostAuthor,
  type IntranetPostComment,
  type IntranetPostCurrentUser,
  INTRANET_DEFAULT_CURRENT_USER,
  INTRANET_DEFAULT_POST_COMMENTS,
  INTRANET_SAMPLE_POST,
} from "@/utils/intranetPost";
import { getIntranetInitials, getIntranetAvatarColor } from "@/utils/intranetCard";

export {
  type IntranetPostAuthor,
  type IntranetPostComment,
  type IntranetPostCurrentUser,
  INTRANET_DEFAULT_CURRENT_USER,
  INTRANET_DEFAULT_POST_COMMENTS,
  INTRANET_SAMPLE_POST,
};

export interface IntranetPostProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Dados do autor ou entidade que realizou a publicação */
  author?: IntranetPostAuthor;
  /** Nome do autor (alias caso não queira passar o objeto author completo) */
  authorName?: string;
  /** Subtítulo do autor com setor e tempo (ex: 'Comunicacao SMUL - ha 1h') */
  authorSubtitle?: string;
  /** Tag da publicação (ex: 'comunicado') */
  authorTag?: string;
  /** Iniciais do autor */
  authorInitials?: string;
  /** Cor de fundo do avatar do autor */
  authorColor?: string;
  /** URL da foto de perfil do autor */
  authorAvatar?: string;

  /** Texto principal da publicação */
  content?: string;
  /** Imagem / Banner ilustrativo do post */
  image?: string;
  /** Texto alternativo da imagem */
  imageAlt?: string;

  /** Número inicial ou atual de curtidas */
  likesCount?: number;
  /** Estado de curtida do usuário atual (modo controlado) */
  isLiked?: boolean;
  /** Callback acionado ao curtir / descurtir a postagem */
  onLikeToggle?: (liked: boolean, newCount: number) => void;

  /** Lista de comentários da postagem */
  comments?: IntranetPostComment[];
  /** Callback disparado ao submeter um novo comentário */
  onCommentSubmit?: (newComment: IntranetPostComment) => void;

  /** Dados do usuário logado que realiza comentários */
  currentUser?: IntranetPostCurrentUser;
  /** Placeholder do campo de comentário */
  commentPlaceholder?: string;

  /** Callback ao clicar em compartilhar */
  onShare?: () => void;
  /** Permite esconder a caixa de comentários */
  showComments?: boolean;
}

/**
 * Componente padrão de **Postagem da SMUL Intranet**.
 *
 * Características:
 * - **Cabeçalho Institucional**: Avatar colorido com iniciais ou foto, nome da coordenadoria/autor, tag em destaque (ex: `"comunicado"`) e tempo relativo.
 * - **Conteúdo & Mídia**: Texto fluido da notícia e banner visual integrado com cantos arredondados.
 * - **Barra de Interações**: Contadores táteis e reativos de **curtidas** (com animação de coração preenchido) e **comentários**.
 * - **Recepção de Comentários**: Área completa com lista de comentários e input interativo que adiciona novos comentários em tempo real e atualiza a contagem automaticamente.
 */
export const IntranetPost = React.forwardRef<HTMLElement, IntranetPostProps>(
  (
    {
      className,
      author = INTRANET_SAMPLE_POST.author,
      authorName,
      authorSubtitle,
      authorTag,
      authorInitials,
      authorColor,
      authorAvatar,
      content = INTRANET_SAMPLE_POST.content,
      image = INTRANET_SAMPLE_POST.image,
      imageAlt = INTRANET_SAMPLE_POST.imageAlt,
      likesCount: controlledLikesCount,
      isLiked: controlledIsLiked,
      onLikeToggle,
      comments = INTRANET_DEFAULT_POST_COMMENTS,
      onCommentSubmit,
      currentUser = INTRANET_DEFAULT_CURRENT_USER,
      commentPlaceholder = "Escreva um comentario...",
      onShare,
      showComments = true,
      children,
      ...props
    },
    ref,
  ) => {
    // --- Resolução dos dados do Autor ---
    const effectiveAuthorName = authorName || author?.name || "Coordenadoria de Comunicação";
    const effectiveAuthorSubtitle = authorSubtitle || author?.subtitle || "Comunicação SMUL - há 1h";
    const effectiveAuthorTag = authorTag || author?.tag || "comunicado";
    const effectiveAuthorInitials =
      authorInitials || author?.initials || getIntranetInitials(effectiveAuthorName);
    const effectiveAuthorColor =
      authorColor || author?.avatarColor || getIntranetAvatarColor(effectiveAuthorName);
    const effectiveAuthorAvatar = authorAvatar || author?.avatarSrc;

    // --- Estado de Curtidas ---
    const [internalIsLiked, setInternalIsLiked] = React.useState<boolean>(
      controlledIsLiked ?? false,
    );
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

    // --- Estado de Comentários ---
    const [internalComments, setInternalComments] =
      React.useState<IntranetPostComment[]>(comments);
    const [commentText, setCommentText] = React.useState<string>("");
    const [copiedShare, setCopiedShare] = React.useState<boolean>(false);

    React.useEffect(() => {
      setInternalComments(comments);
    }, [comments]);

    const commentsList = internalComments;
    const commentInputRef = React.useRef<HTMLInputElement>(null);

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
      onCommentSubmit?.(newComment);
    };

    const handleShareClick = () => {
      if (onShare) {
        onShare();
        return;
      }

      // Feedback visual ao copiar link
      if (typeof window !== "undefined" && navigator?.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2000);
      }
    };

    return (
      <article
        ref={ref}
        className={cn(
          "w-full max-w-2xl bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 transition-all duration-200 text-left",
          className,
        )}
        {...props}
      >
        {/* Cabeçalho do Post: Avatar + Autor + Tag + Subtítulo */}
        <div className="flex items-center gap-3">
          {/* Avatar do Autor */}
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-2xs select-none overflow-hidden"
            style={{
              backgroundColor: effectiveAuthorAvatar ? "transparent" : effectiveAuthorColor,
            }}
            aria-hidden="true"
          >
            {effectiveAuthorAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={effectiveAuthorAvatar}
                alt={effectiveAuthorName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{effectiveAuthorInitials}</span>
            )}
          </div>

          {/* Nome, Tag e Subtítulo */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug truncate">
                {effectiveAuthorName}
              </h3>

              {effectiveAuthorTag && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200/60 leading-none">
                  {effectiveAuthorTag}
                </span>
              )}
            </div>

            {effectiveAuthorSubtitle && (
              <p className="text-xs text-slate-500 font-normal mt-0.5 leading-tight">
                {effectiveAuthorSubtitle}
              </p>
            )}
          </div>
        </div>

        {/* Texto do Conteúdo */}
        {content && (
          <p className="text-sm text-slate-800 leading-relaxed mt-4 font-normal break-words">
            {content}
          </p>
        )}

        {/* Mídia / Imagem do Post */}
        {image && (
          <div className="mt-4 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-2xs bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={imageAlt || "Imagem da publicação"}
              className="w-full h-auto object-cover max-h-[420px] transition-transform duration-300 hover:scale-[1.01]"
              loading="lazy"
            />
          </div>
        )}

        {/* Conteúdo adicional inserido via children */}
        {children}

        {/* Barra de Ações: Curtir, Comentários e Compartilhar */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Botão de Curtida com Contador Interativo */}
            <button
              type="button"
              onClick={handleLikeClick}
              aria-label={`${isLiked ? "Descurtir" : "Curtir"} publicação. Atualmente com ${likes} curtidas.`}
              className={cn(
                "group flex items-center gap-1.5 font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] rounded-md px-1.5 py-1 -ml-1.5 select-none",
                isLiked ? "text-rose-600 font-semibold" : "text-slate-700 hover:text-rose-600",
              )}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-transform duration-200 group-hover:scale-110",
                  isLiked ? "text-rose-600 fill-rose-600 scale-105" : "text-slate-700",
                )}
                aria-hidden="true"
              />
              <span>
                {likes} {likes === 1 ? "curtida" : "curtidas"}
              </span>
            </button>

            {/* Botão de Comentários com Foco no Input */}
            <button
              type="button"
              onClick={() => commentInputRef.current?.focus()}
              aria-label={`Comentários da publicação. Total de ${commentsList.length} comentários.`}
              className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#0b3299] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] rounded-md px-1.5 py-1 select-none"
            >
              <MessageCircle
                className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-slate-700 group-hover:text-[#0b3299]"
                aria-hidden="true"
              />
              <span>
                {commentsList.length}{" "}
                {commentsList.length === 1 ? "comentario" : "comentarios"}
              </span>
            </button>
          </div>

          {/* Botão de Compartilhar */}
          <button
            type="button"
            onClick={handleShareClick}
            aria-label="Compartilhar publicação"
            className="group flex items-center gap-1.5 font-medium text-slate-700 hover:text-[#0b3299] transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299] rounded-md px-1.5 py-1 select-none"
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-600 font-semibold">Copiado!</span>
              </>
            ) : (
              <>
                <Share2
                  className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-slate-700 group-hover:text-[#0b3299]"
                  aria-hidden="true"
                />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>

        {/* Seção de Comentários */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            {/* Lista de Comentários Existentes */}
            {commentsList.length > 0 && (
              <ul className="space-y-3">
                {commentsList.map((comment) => {
                  const initial =
                    comment.authorInitials || getIntranetInitials(comment.authorName);
                  const color =
                    comment.authorColor || getIntranetAvatarColor(comment.authorName);

                  return (
                    <li key={comment.id} className="flex items-start gap-2.5 group">
                      {/* Avatar do Comentarista */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs select-none overflow-hidden mt-0.5"
                        style={{
                          backgroundColor: comment.authorAvatar ? "transparent" : color,
                        }}
                        aria-hidden="true"
                      >
                        {comment.authorAvatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{initial}</span>
                        )}
                      </div>

                      {/* Balão de Comentário */}
                      <div className="flex-1 bg-slate-100/70 hover:bg-slate-100 px-3.5 py-2.5 rounded-2xl max-w-[92%] transition-colors">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                            {comment.authorName}
                          </p>
                          {comment.createdAt && (
                            <span className="text-[11px] text-slate-400 font-normal leading-none shrink-0">
                              {comment.createdAt}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed mt-1 break-words">
                          {comment.content}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Campo de Inserção de Novo Comentário */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2.5 pt-1">
              {/* Avatar do Usuário Autenticado */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-2xs select-none overflow-hidden"
                style={{
                  backgroundColor: currentUser.avatarSrc
                    ? "transparent"
                    : currentUser.avatarColor || "#e11d48",
                }}
                aria-hidden="true"
              >
                {currentUser.avatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={currentUser.avatarSrc}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{currentUser.initials || getIntranetInitials(currentUser.name)}</span>
                )}
              </div>

              {/* Input com Placeholder e Botão de Envio */}
              <div className="flex-1 relative flex items-center">
                <input
                  ref={commentInputRef}
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={commentPlaceholder}
                  aria-label="Escrever um comentário para a publicação"
                  className="w-full text-xs sm:text-sm pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0b3299]/20 focus:border-[#0b3299] transition-all"
                />

                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  aria-label="Publicar comentário"
                  className="absolute right-1.5 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[#0b3299] hover:bg-blue-50 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b3299]"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </form>
          </div>
        )}
      </article>
    );
  },
);

IntranetPost.displayName = "IntranetPost";
