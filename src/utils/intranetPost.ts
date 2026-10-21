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
