# Graph Report - syncquestra  (2026-07-15)

## Corpus Check
- 103 files · ~72,282 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 564 nodes · 971 edges · 89 communities (57 shown, 32 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9553ef77`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- UI Components
- Account Model
- Authentication Flow
- Eslint Tailwindcss
- App Components
- Question Model
- Next Dom
- Account Model
- Components Schema
- UI Components
- Sharp Unrs
- UI Components
- React Base
- Action Loginoauthparams
- Svg Chevron
- Interaction Model
- Answer Model
- Collection Model
- Tag Model
- Vote Model
- Graphify Knowledge
- App Components
- Agents Claude
- Bcryptjs Configuration
- Bright Configuration
- Card Configuration
- Class Variance
- Clsx Configuration
- Theme Material
- Eslint Config
- Eslint Plugin
- Hookform Resolvers
- Mongodb Configuration
- Mongoose Configuration
- Next Configuration
- Authentication Flow
- Next Config
- Next Mdx
- Next Themes
- Pino Configuration
- Pino Pretty
- Query String
- Radix React
- React Configuration
- React Dom
- React Hook
- Shadcn Configuration
- Slugify Configuration
- Sonner Configuration
- Tailwind Merge
- Animate Configuration
- Config Postcss
- Authentication Flow
- cn
- global.d.ts
- input-group.tsx
- utils.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 75 edges
2. `handleError()` - 37 edges
3. `ROUTES` - 25 edges
4. `connectToDatabase()` - 23 edges
5. `compilerOptions` - 16 edges
6. `serverAction()` - 14 edges
7. `ValidationError` - 12 edges
8. `Button()` - 11 edges
9. `RequestError` - 9 edges
10. `getQuestion()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `RootLayout()` --calls--> `cn()`  [EXTRACTED]
  app/layout.tsx → lib/utils.ts
- `Metric()` --calls--> `cn()`  [EXTRACTED]
  components/metric.tsx → lib/utils.ts
- `NavigationLinks()` --calls--> `cn()`  [EXTRACTED]
  components/navigation/navbar/navLinks.tsx → lib/utils.ts
- `DropdownMenuLabel()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts
- `DropdownMenuSubTrigger()` --calls--> `cn()`  [EXTRACTED]
  components/ui/dropdown-menu.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (89 total, 32 thin omitted)

### Community 0 - "UI Components"
Cohesion: 0.14
Nodes (17): AuthFormProps, Editor, Params, Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup() (+9 more)

### Community 1 - "Account Model"
Cohesion: 0.08
Nodes (45): DELETE(), GET(), PUT(), POST(), GET(), POST(), POST(), TODO: account part. (+37 more)

### Community 2 - "Authentication Flow"
Cohesion: 0.10
Nodes (18): EditQuestion(), QuestionDetails(), CardTags(), Props, Props, QuestionCard(), SocialAuthForm(), POPULAR_TAGS (+10 more)

### Community 3 - "Eslint Tailwindcss"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, @eslint/js, eslint-plugin-prettier, eslint-plugin-react, devDependencies (+25 more)

### Community 4 - "App Components"
Cohesion: 0.11
Nodes (20): Home(), SearchParams, Props, StateSkeletonProps, filters, HomeFilter(), LocalSearch(), Props (+12 more)

### Community 5 - "Question Model"
Cohesion: 0.15
Nodes (15): View(), QuestionForm(), IQuestion, IQuestionDoc, QuestionSchema, ITag, ITagDoc, TagSchema (+7 more)

### Community 6 - "Next Dom"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 7 - "Account Model"
Cohesion: 0.11
Nodes (17): geist, metadata, RootLayout(), shareTechMono, spaceMono, { handlers, signIn, signOut, auth }, TODO: we'll check if the login account type is credentials (password based) : if, TODO: acccount type is not credentials, then call it 'oauth-login' app and creat (+9 more)

### Community 8 - "Components Schema"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 9 - "UI Components"
Cohesion: 0.16
Nodes (13): NavigationLinks(), Button(), buttonVariants, Sheet(), SheetClose(), SheetContent(), SheetDescription(), SheetFooter() (+5 more)

### Community 10 - "Sharp Unrs"
Cohesion: 0.12
Nodes (18): allowScripts, msw, sharp, unrs-resolver, ignoreScripts, name, overrides, postcss (+10 more)

### Community 11 - "UI Components"
Cohesion: 0.12
Nodes (11): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 12 - "React Base"
Cohesion: 0.22
Nodes (9): @base-ui/react, lucide-react, @mdxeditor/editor, dependencies, @base-ui/react, lucide-react, @mdxeditor/editor, zod (+1 more)

### Community 13 - "Action Loginoauthparams"
Cohesion: 0.29
Nodes (7): AuthCredintials, CreateQuestionParams, EditQuestionParams, GetQuestionParams, GetTagQuestionParams, IncreaseViewCountParams, LoginOAuthParams

### Community 14 - "Svg Chevron"
Cohesion: 0.12
Nodes (11): 1. Prerequisites, 2. Installation, 3. Environment Configuration, 4. Running the Development Server, 5. Build for Production, 🧹 Code Quality & Linting, ✨ Features, 🚀 Getting Started (+3 more)

### Community 15 - "Interaction Model"
Cohesion: 0.50
Nodes (4): IInteraction, IInteractionDoc, InteractionActionEnums, InteractionSchema

### Community 16 - "Answer Model"
Cohesion: 0.67
Nodes (3): AnswerSchema, IAnswer, IAnswerDoc

### Community 17 - "Collection Model"
Cohesion: 0.67
Nodes (3): CollectionSchema, ICollection, ICollectionDoc

### Community 18 - "Tag Model"
Cohesion: 0.67
Nodes (3): ITagQuestion, ITagQuestionDoc, TagQuestionSchema

### Community 19 - "Vote Model"
Cohesion: 0.67
Nodes (3): IVote, IVoteDoc, VoteSchema

### Community 20 - "Graphify Knowledge"
Cohesion: 0.40
Nodes (3): graphify, graphify Knowledge Graph, Workflow: graphify

### Community 85 - "cn"
Cohesion: 0.20
Nodes (16): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Card(), CardAction() (+8 more)

### Community 86 - "global.d.ts"
Cohesion: 0.17
Nodes (11): getTagQuestions(), ActionResponse, APIErrorResponse, APISuccessResponse, Author, ErrorResponse, PaginationParams, Question (+3 more)

### Community 87 - "input-group.tsx"
Cohesion: 0.24
Nodes (9): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+1 more)

### Community 88 - "utils.ts"
Cohesion: 0.32
Nodes (4): Metric(), Props, techDescriptionMap, techMap

## Knowledge Gaps
- **171 isolated node(s):** `SearchParams`, `geist`, `spaceMono`, `shareTechMono`, `metadata` (+166 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **32 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `UI Components`, `Authentication Flow`, `App Components`, `Account Model`, `UI Components`, `UI Components`, `input-group.tsx`, `utils.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `ROUTES` connect `Authentication Flow` to `UI Components`, `Account Model`, `App Components`, `Question Model`, `Account Model`, `UI Components`, `cn`?**
  _High betweenness centrality (0.036) - this node is a cross-community bridge._
- **Why does `🚀 syncQuestra` connect `Svg Chevron` to `utils.ts`, `Authentication Flow`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `SearchParams`, `geist`, `spaceMono` to the rest of the system?**
  _171 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1422924901185771 - nodes in this community are weakly interconnected._
- **Should `Account Model` be split into smaller, more focused modules?**
  _Cohesion score 0.07997038134024435 - nodes in this community are weakly interconnected._
- **Should `Authentication Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._