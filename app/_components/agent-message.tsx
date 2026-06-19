"use client";

import type { EveDynamicToolPart, EveMessage, EveMessagePart } from "eve/react";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import {
  Tool,
  ToolContent,
  ToolHeader,
} from "@/components/ai-elements/tool";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

const toolStateCopy: Record<EveDynamicToolPart["state"], string> = {
  "input-streaming": "Tool call in progress…",
  "input-available": "Tool arguments captured.",
  "approval-requested": "Action requires your approval.",
  "approval-responded": "Approval received.",
  "output-available": "Tool call completed.",
  "output-denied": "Tool call denied.",
  "output-error": "Tool call returned an error.",
};

export type AgentInputResponse = {
  readonly optionId?: string;
  readonly requestId: string;
  readonly text?: string;
};

export function AgentMessage({
  canRespond,
  isStreaming,
  message,
  onInputResponses,
}: {
  readonly canRespond: boolean;
  readonly isStreaming: boolean;
  readonly message: EveMessage;
  readonly onInputResponses: (responses: readonly AgentInputResponse[]) => void | Promise<void>;
}) {
  const lastTextIndex = message.parts.reduce(
    (last, part, index) => (part.type === "text" ? index : last),
    -1,
  );

  return (
    <Message
      className="min-w-0 max-w-full overflow-hidden"
      data-optimistic={message.metadata?.optimistic ? "true" : undefined}
      from={message.role}
    >
      <MessageContent className="min-w-0 max-w-full overflow-hidden [overflow-wrap:anywhere]">
        {message.parts.map((part, index) => (
          <AgentMessagePart
            canRespond={canRespond}
            key={partKey(part, index)}
            onInputResponses={onInputResponses}
            part={part}
            showCaret={isStreaming && message.role === "assistant" && index === lastTextIndex}
          />
        ))}
      </MessageContent>
    </Message>
  );
}

function AgentMessagePart({
  canRespond,
  onInputResponses,
  part,
  showCaret,
}: {
  readonly canRespond: boolean;
  readonly onInputResponses: (responses: readonly AgentInputResponse[]) => void | Promise<void>;
  readonly part: EveMessagePart;
  readonly showCaret: boolean;
}) {
  switch (part.type) {
    case "step-start":
      return null;
      case "text":
        return (
          <MessageResponse
            caret="block"
            className="copy-14 min-w-0 max-w-full overflow-hidden [overflow-wrap:anywhere] [&_*]:max-w-full [&_li]:break-words [&_p]:break-words [&_pre]:overflow-x-auto [&_table]:block [&_table]:overflow-x-auto"
            isAnimating={showCaret}
          >
            {part.text}
          </MessageResponse>
      );
    case "reasoning":
        return (
          <Reasoning defaultOpen isStreaming={part.state === "streaming"}>
            <ReasoningTrigger />
            <ReasoningContent>{part.text}</ReasoningContent>
          </Reasoning>
        );
      case "dynamic-tool": {
        const needsResponse = Boolean(part.toolMetadata?.eve?.inputRequest);
        const stateCopy =
          stateCopyByToolState(part.state) ??
          `Tool execution: ${part.toolName || "tool"} (${part.state})`;

        return (
          <Tool defaultOpen className="overflow-hidden">
            <ToolHeader
              state={part.state}
              title={part.toolName}
              toolName={part.toolName}
              type="dynamic-tool"
            />
            <ToolContent className="space-y-3">
              <p className="copy-14 flex min-w-0 items-center gap-2 text-[var(--geist-gray-900)]">
                {part.state === "input-streaming" || part.state === "input-available" ? (
                  <Loader2Icon className="size-3 animate-spin shrink-0" />
                ) : null}
                <span className="leading-tight break-words">{stateCopy}</span>
              </p>
              {needsResponse ? (
                <InputRequestActions
                  canRespond={canRespond}
                  part={part}
                  onInputResponses={onInputResponses}
                />
              ) : null}
            </ToolContent>
          </Tool>
        );
      }
  }
}

function stateCopyByToolState(state: EveDynamicToolPart["state"]): string | undefined {
  return toolStateCopy[state];
}

function InputRequestActions({
  canRespond,
  onInputResponses,
  part,
}: {
  readonly canRespond: boolean;
  readonly onInputResponses: (responses: readonly AgentInputResponse[]) => void | Promise<void>;
  readonly part: EveDynamicToolPart;
}) {
  const inputRequest = part.toolMetadata?.eve?.inputRequest;
  if (!inputRequest) {
    return null;
  }

  const inputResponse = part.toolMetadata?.eve?.inputResponse;
  const selectedOption = inputRequest.options?.find(
    (option) => option.id === inputResponse?.optionId,
  );

  return (
      <div className="space-y-3 rounded-md border border-yellow-500/30 bg-yellow-500/5 p-3">
      <p className="copy-14 text-[var(--geist-gray-900)]">{inputRequest.prompt}</p>
      {inputResponse ? (
        <p className="copy-14 font-medium">
          Responded: {selectedOption?.label ?? inputResponse.text ?? inputResponse.optionId}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {inputRequest.options?.map((option) => (
            <Button
              disabled={!canRespond}
              key={option.id}
              onClick={() => {
                void onInputResponses([
                  {
                    optionId: option.id,
                    requestId: inputRequest.requestId,
                  },
                ]);
              }}
              size="sm"
              type="button"
              variant={option.style === "danger" ? "destructive" : "default"}
            >
              {option.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function partKey(part: EveMessagePart, index: number): string {
  switch (part.type) {
    case "dynamic-tool":
      return part.toolCallId;
    default:
      return `${part.type}:${index}`;
  }
}
