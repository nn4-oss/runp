import type { MessageRole, MessageType, Fragment } from "generated/prisma";

export interface FragmentBubbleProps {
  fragment: Fragment | null;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment | null) => void;
}

export interface BubbleProps extends FragmentBubbleProps {
  type: MessageType;
  content: string;
  createdAt: Date;
}

export interface MessageBubbleProps extends BubbleProps {
  role: MessageRole;
}

export type ViewProps = "preview" | "code" | "diagram";
export type FilesProps = Record<string, string>;
