CREATE TABLE "reading_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"kind" varchar(20) NOT NULL,
	"title" varchar(500) NOT NULL,
	"summary" jsonb NOT NULL,
	"url" varchar(2000) NOT NULL,
	"source" varchar(255) NOT NULL,
	"image" varchar(2000),
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);

--> statement-breakpoint
INSERT INTO "reading_entries" ("id", "kind", "title", "summary", "url", "source", "image", "sort_order") VALUES ('effective-red-teaming-policy-adherent-agents', 'paper', 'Effective Red-Teaming of Policy-Adherent Agents', '{"zh":"当 AI 客服需要遵守退款、取消订单等业务规则时，如何抵御用户的诱导？这篇论文提出多智能体红队系统 CRAFT，以及基于 τ-bench 的 τ-break 基准，评估智能体在对抗性对话中遵守规则的能力，并探索防御策略的局限。","en":"How can customer-service agents uphold refund and cancellation policies under manipulation? This paper introduces CRAFT, a multi-agent red-teaming system, and τ-break, a benchmark built on τ-bench, to evaluate policy adherence under adversarial conversations and explore the limits of defensive strategies."}', 'https://arxiv.org/abs/2506.09600', 'arXiv · 2025', '/images/reading/craft.svg', 0) ON CONFLICT ("id") DO NOTHING;
