"use client";

import {
  useEveAgent,
  type EveMessageData,
  type UseEveAgentHelpers,
} from "eve/react";
import {
  AlertCircleIcon,
  FileTextIcon,
  MoonStarIcon,
  SunIcon,
  UploadIcon,
} from "lucide-react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

import { AgentMessage } from "@/app/_components/agent-message";
import {
  PromptInput,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

const uploadPayloadSchema = z.object({
  extractedText: z.string(),
  fileName: z.string(),
  fileType: z.enum(["pdf", "docx"]),
});

type EveAgent = UseEveAgentHelpers<EveMessageData>;
type ReviewStatus =
  | { readonly state: "idle" }
  | { readonly state: "reviewing" }
  | { readonly state: "ready"; readonly fileName: string }
  | { readonly state: "error"; readonly message: string };
type ThemeMode = "light" | "dark";

export function ContractReviewApp() {
  const agent = useEveAgent();
  const [status, setStatus] = useState<ReviewStatus>({ state: "idle" });
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [hasHydratedTheme, setHasHydratedTheme] = useState(false);
  const isAgentBusy =
    agent.status === "submitted" || agent.status === "streaming";
  const isReviewing = status.state === "reviewing" || isAgentBusy;

  useEffect(() => {
    const storedTheme = localStorage.getItem("contract-review-theme");
    const mediaMatchesDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : mediaMatchesDark
        ? "dark"
        : "light";
    setThemeMode(theme);
    setHasHydratedTheme(true);
  }, []);

  useEffect(() => {
    if (!hasHydratedTheme) {
      return;
    }

    document.documentElement.setAttribute("data-theme", themeMode);
    localStorage.setItem("contract-review-theme", themeMode);
  }, [hasHydratedTheme, themeMode]);

  const toggleTheme = () => {
    setThemeMode((current) => (current === "light" ? "dark" : "light"));
  };

  const handleFollowUpSubmit = async (message: PromptInputMessage) => {
    const text = message.text.trim();
    if (!text || isReviewing) {
      return;
    }

    await agent.send({ message: text });
  };

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (
    event,
  ) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    agent.reset();
    setStatus({ state: "reviewing" });

    const response = await fetch("/api/review", { method: "POST", body: form });
    const payload: unknown = await response.json();

    if (!response.ok) {
      setStatus({ state: "error", message: getErrorMessage(payload) });
      return;
    }

    const parsed = uploadPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      setStatus({
        state: "error",
        message: "The upload response was not in the expected format.",
      });
      return;
    }

    setStatus({
      state: "ready",
      fileName: parsed.data.fileName,
    });
    try {
      await agent.send({
        message: `Review ${parsed.data.fileName} as a contract. Return the main risks, missing clauses, unusual terms, summary, and negotiation points.`,
        clientContext: [
          `Extracted contract text:\n${parsed.data.extractedText}`,
        ],
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not start the agent review stream.";
      setStatus({ state: "error", message });
    }
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden bg-[var(--geist-background-100)] px-4 pt-10 pb-32 text-foreground sm:px-6 lg:px-8">
      <section className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl space-y-2">
            <p className="label-13 text-[var(--geist-gray-900)]">
              Contract review
            </p>
            <h1 className="heading-40 sm:heading-48 text-[var(--geist-gray-1000)]">
              Don&apos;t sign a bad contract in 3 minutes.
            </h1>
            <p className="copy-16 max-w-2xl text-[var(--geist-gray-900)]">
              Upload a PDF or DOCX. The agent reads the extracted text and streams the review with tool calls.
            </p>
          </div>
          <Button
            className="shrink-0"
            onClick={toggleTheme}
            size="sm"
            variant="outline"
            aria-label={`Switch to ${themeMode === "light" ? "dark" : "light"} theme`}
          >
            {themeMode === "light" ? <MoonStarIcon /> : <SunIcon />}
            <span className="copy-14 whitespace-nowrap">
              {themeMode === "light" ? "Dark mode" : "Light mode"}
            </span>
          </Button>
        </header>

        <form
          className="grid min-w-0 gap-4 overflow-hidden rounded-sm border border-[var(--geist-gray-300)] bg-[var(--geist-background-100)] p-5 shadow-[var(--shadow-raised)] sm:grid-cols-[minmax(0,1fr)_auto]"
          onSubmit={handleSubmit}
        >
          <label className="grid min-w-0 gap-2">
            <span className="label-14 font-medium">Contract upload</span>
            <Input
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              disabled={isReviewing}
              name="contract"
              required
              type="file"
            />
          </label>
          <Button
            className="self-end"
            disabled={isReviewing}
            size="lg"
            type="submit"
          >
            {isReviewing ? <Spinner /> : <UploadIcon />}
            Review contract
          </Button>
        </form>

        {status.state === "error" ? (
          <ErrorMessage message={status.message} />
        ) : null}
        {status.state === "ready" ? (
          <AgentReview agent={agent} fileName={status.fileName} />
        ) : (
          <EmptyState />
        )}
      </section>
      <ProgressiveBottomBlur />
      {status.state === "ready" && agent.data.messages.length > 0 ? (
        <FollowUpComposer
          onStop={agent.stop}
          onSubmit={handleFollowUpSubmit}
          status={agent.status}
        />
      ) : null}
    </main>
  );
}

function ProgressiveBottomBlur() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-10"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--geist-background-100)] from-0% via-[var(--geist-background-100)]/65 via-45% to-transparent" />
    </div>
  );
}

function FollowUpComposer({
  onStop,
  onSubmit,
  status,
}: {
  readonly onStop: () => void;
  readonly onSubmit: (message: PromptInputMessage) => Promise<void>;
  readonly status: EveAgent["status"];
}) {
  const isBusy = status === "submitted" || status === "streaming";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <PromptInput
          className="relative rounded-sm border border-[var(--geist-gray-300)] bg-[var(--geist-background-100)] shadow-[var(--shadow-popover)]"
          onSubmit={onSubmit}
        >
          <PromptInputTextarea
            className="copy-14 min-h-14 pr-12"
            disabled={isBusy}
            placeholder="Ask a follow-up about this contract…"
          />
          <PromptInputSubmit onStop={onStop} status={status} />
        </PromptInput>
      </div>
    </div>
  );
}

function getErrorMessage(payload: unknown): string {
  if (typeof payload === "object" && payload !== null && "message" in payload) {
    return String(payload.message);
  }
  return "The contract could not be reviewed.";
}

function AgentReview({
  agent,
  fileName,
}: {
  readonly agent: EveAgent;
  readonly fileName: string;
}) {
  const isBusy = agent.status === "submitted" || agent.status === "streaming";

  return (
    <Panel subtitle={fileName} title="Agent review">
      {agent.error ? (
        <p className="break-words text-destructive copy-14">
          {agent.error.message}
        </p>
      ) : null}
      {agent.data.messages.length === 0 && !agent.error ? (
        <div className="flex items-center gap-2 copy-14 text-[var(--geist-gray-900)]">
          <Spinner />
          Agent is reviewing the extracted contract text.
        </div>
      ) : (
        <div className="grid min-w-0 gap-3 overflow-x-hidden pb-28">
          {agent.data.messages.map((message, index) => (
            <AgentMessage
              canRespond={!isBusy}
              isStreaming={isBusy && index === agent.data.messages.length - 1}
              key={message.id}
              message={message}
              onInputResponses={(inputResponses) =>
                agent.send({ inputResponses })
              }
            />
          ))}
        </div>
      )}
    </Panel>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-sm border border-[var(--geist-gray-300)] border-dashed bg-[var(--geist-background-200)] p-8 text-center">
      <FileTextIcon className="size-10 text-[var(--geist-gray-700)]" />
      <div>
        <h2 className="label-14 font-medium">Upload a contract</h2>
        <p className="copy-14 mt-1 max-w-md text-[var(--geist-gray-900)]">
          The review will stream from the agent with visible reasoning and tool
          calls.
        </p>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { readonly message: string }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-sm border border-[var(--geist-red-700)] bg-[var(--geist-red-700)]/10 p-4">
      <AlertCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
      <div className="min-w-0">
        <p className="copy-14 font-medium">Review failed</p>
        <p className="copy-14 break-words text-[var(--geist-gray-900)]">
          {message}
        </p>
      </div>
    </div>
  );
}

function Panel({
  children,
  subtitle,
  title,
}: {
  readonly children: ReactNode;
  readonly subtitle?: string;
  readonly title: string;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-sm border border-[var(--geist-gray-300)] bg-[var(--geist-background-100)] p-5 shadow-[var(--shadow-raised)]">
      <div className="mb-4 min-w-0">
        <h2 className="copy-16 font-medium text-[var(--geist-gray-1000)]">
          {title}
        </h2>
        {subtitle ? (
          <p className="copy-14 mt-1 truncate text-[var(--geist-gray-900)]">
            {subtitle}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
