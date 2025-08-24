import { MessageRole } from "generated/prisma";
import { MessageType, type Fragment } from "generated/prisma";

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
