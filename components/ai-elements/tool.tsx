"use client";

import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { DynamicToolUIPart, ToolUIPart } from "ai";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    className={cn(
      "group not-prose mb-4 w-full min-w-0 overflow-hidden rounded-sm border border-[var(--geist-gray-400)] bg-[var(--geist-background-100)] shadow-sm",
      className,
    )}
    {...props}
  />
);

export type ToolPart = ToolUIPart | DynamicToolUIPart;

export type ToolHeaderProps = {
  title?: string;
  className?: string;
} & (
  | { type: ToolUIPart["type"]; state: ToolUIPart["state"]; toolName?: never }
  | {
      type: DynamicToolUIPart["type"];
      state: DynamicToolUIPart["state"];
      toolName: string;
    }
);

const statusLabels: Record<ToolPart["state"], string> = {
  "approval-requested": "Awaiting Approval",
  "approval-responded": "Responded",
  "input-available": "Running",
  "input-streaming": "Pending",
  "output-available": "Completed",
  "output-denied": "Denied",
  "output-error": "Error",
};

const statusIcons: Record<ToolPart["state"], ReactNode> = {
  "approval-requested": <ClockIcon className="size-4 text-[var(--geist-amber-700)]" />,
  "approval-responded": <CheckCircleIcon className="size-4 text-[var(--geist-blue-700)]" />,
  "input-available": <ClockIcon className="size-4 animate-pulse" />,
  "input-streaming": <CircleIcon className="size-4" />,
  "output-available": <CheckCircleIcon className="size-4 text-[var(--geist-green-700)]" />,
  "output-denied": <XCircleIcon className="size-4 text-[var(--geist-amber-700)]" />,
  "output-error": <XCircleIcon className="size-4 text-red-600" />,
};

export const getStatusBadge = (status: ToolPart["state"]) => (
  <Badge className="copy-14 shrink-0 gap-1.5 rounded-full border border-[var(--geist-gray-300)] bg-[var(--geist-blue-100)] text-[var(--geist-blue-1000)]" variant="outline">
    {statusIcons[status]}
    {statusLabels[status]}
  </Badge>
);

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  toolName,
  ...props
}: ToolHeaderProps) => {
  const derivedName = type === "dynamic-tool" ? toolName : type.split("-").slice(1).join("-");

  return (
    <CollapsibleTrigger
      className={cn("flex w-full min-w-0 items-center justify-between gap-4 overflow-hidden p-3", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
        <WrenchIcon className="size-4 shrink-0 text-[var(--geist-gray-900)]" />
        <span className="copy-14 truncate font-medium text-[var(--geist-gray-1000)]">{title ?? derivedName}</span>
        {getStatusBadge(state)}
      </div>
      <ChevronDownIcon className="size-4 shrink-0 text-[var(--geist-gray-900)] transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
    </CollapsibleTrigger>
  );
};

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    className={cn(
      "min-w-0 space-y-4 overflow-hidden p-4 text-popover-foreground outline-none",
      className,
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolPart["input"];
};

export const ToolInput = ({ className, ...props }: ToolInputProps) => (
  <div className={cn("min-w-0 space-y-2 overflow-hidden", className)} {...props}>
    <p className="copy-14 text-[var(--geist-gray-900)]">
      Tool inputs were captured and are now processed by the agent.
    </p>
  </div>
);

export type ToolOutputProps = ComponentProps<"div"> & {
  output?: ToolPart["output"];
  errorText: ToolPart["errorText"];
};

export const ToolOutput = ({ className, errorText, ...props }: ToolOutputProps) => {
  return (
    <div className={cn("min-w-0 space-y-2 overflow-hidden", className)} {...props}>
      {errorText ? (
        <p className="copy-14 text-destructive">Tool execution returned an error.</p>
      ) : (
        <p className="copy-14 text-[var(--geist-gray-900)]">Tool result returned to the agent.</p>
      )}
      <div className="sr-only">{errorText ? errorText : "Tool output available"}</div>
    </div>
  );
};
