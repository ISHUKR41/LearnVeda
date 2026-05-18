# MCP For The Education, Coding, Events, Community, And Skill-Competition Platform

Version: 1.0  
Prepared on: 10 May 2026  
Language: English  
Important technology decision: The project must use the approved TypeScript and Node.js implementation direction.  
Important document rule: This file contains planning, architecture, product logic, folder strategy, feature design, and technology recommendations only. It does not contain implementation code.

---

## 1. Product Vision

This platform should become a minimal, clean, highly engaging learning and competition website for Indian students and engineering learners.

The core idea is:

- Students from Class 9, Class 10, Class 11, Class 12, and Engineering can learn through structured daily plans.
- Every subject, chapter, topic, subtopic, coding language, test, dashboard area, community area, event area, and auth area should have separate folders and separate files during implementation.
- Every folder should contain an easy-to-understand explanation file.
- Every source file should contain clear English comments explaining its purpose.
- Learning should feel like a mix of LeetCode, GitHub streaks, BGMI-style progression, and a serious study platform.
- Students should learn theory, attempt questions, earn points, increase level, maintain streaks, unlock achievements, join matches, participate in events, and discuss inside communities.
- The UI should be modern, minimal, clean, eye-catching, and confusion-free.
- The platform should support safe competitions for colleges and institutions.
- The platform should avoid illegal betting, hidden gambling, or misleading wallet naming. Real-money features must be legally reviewed and converted into compliant skill contests, subscriptions, credits, or sponsor-funded rewards.

---

## 2. Main Platform Sections

The website should contain these top-level sections:

| Section | Purpose |
|---|---|
| Home | First screen of the platform, showing learning paths, daily streak, top contests, and quick access. |
| Class 9 | Dedicated learning area for Class 9 subjects. |
| Class 10 | Dedicated learning area for Class 10 subjects. |
| Class 11 | Dedicated learning area for Class 11 streams and subjects. |
| Class 12 | Dedicated learning area for Class 12 streams and subjects. |
| Engineering | Dedicated coding, computer science, and engineering skill area. |
| Dashboard | Personal progress, points, levels, streaks, wallet/credits, certificates, and activity. |
| Test | Practice tests, chapter tests, mock tests, competitions, and safe exams. |
| Sign In | Login, passkey login, OTP login, and secure session start. |
| Sign Up | Student onboarding, class selection, skill selection, and profile setup. |
| Community | Class-wise, subject-wise, language-wise, and event-wise discussion spaces. |
| Events | College competitions, hackathons, coding battles, quizzes, and institutional portals. |
| Matching | BGMI-inspired skill matching for same class/subject/chapter/level range. |
| Wallet / Credits | Learning credits, subscription status, rewards, limits, and compliant payouts where legally allowed. |
| Admin | Platform management, content management, users, reports, events, fraud review, and analytics. |
| Organizer Portal | College/event organizer dashboard for creating competitions and managing participants. |

---

## 3. Target Users

### 3.1 Students

- Class 9 students preparing school subjects.
- Class 10 students preparing board-level subjects.
- Class 11 students in Science, Commerce, Arts/Humanities, or optional skill subjects.
- Class 12 students preparing board exams, entrance exams, and career paths.
- Engineering students learning programming, DSA, web development, system design, AI, cybersecurity, cloud, and databases.
- Beginner coders who need a 30-day, 60-day, or 90-day guided plan.

### 3.2 Parents

- Parents who want to see progress, streaks, test results, and learning discipline.
- Parents who want safe payments and subscription transparency.

### 3.3 Teachers And Mentors

- Teachers who create subject content.
- Mentors who prepare coding paths.
- Doubt solvers who help in community sections.

### 3.4 Colleges And Institutions

- Colleges that want to run coding competitions.
- Schools that want to run safe quizzes.
- Training institutes that want to host events.

### 3.5 Platform Admin Team

- Content reviewers.
- Fraud reviewers.
- Payment reviewers.
- Event moderators.
- Community moderators.
- Technical administrators.

---

## 4. Key Product Principles

### 4.1 Minimal But Powerful

The UI must stay simple:

- Clear navigation.
- Clear page titles.
- Clear progress indicators.
- No unnecessary popups.
- No confusing menus.
- No heavy visual clutter.
- Important actions should always be visible.

### 4.2 Learning First

The platform should never become only a game. Game mechanics should support learning, not replace learning.

### 4.3 Separate Everything Properly

Every major feature should have a separate folder. Every class should have a separate folder. Every subject should have a separate folder. Every engineering language should have a separate folder. Every community category should have a separate folder. Every event feature should have a separate folder.

### 4.4 Comment Everything Clearly

Implementation rule:

- Every folder should have a `README.md` explaining what belongs inside that folder.
- Every major source file should start with a short English purpose comment.
- Every complex function should have a clear comment explaining why it exists.
- Comments should explain business logic, not obvious syntax.
- Comments should be simple enough for a beginner developer to understand.

### 4.5 Fair Competition

Competition should be based on skill, accuracy, time, and verified identity. Cheating prevention should be designed from the start.

### 4.6 Legal And Ethical Money System

Do not hide real-money betting by changing its name. That creates legal and trust risk.

Instead, use one of these compliant models:

- Subscription model.
- Learning credits model.
- Sponsor-funded prize model.
- Institution-funded contest model.
- Skill-contest model after legal review.
- Virtual points and non-cash rewards.
- Cash rewards only with proper legal, tax, KYC, age, and payment compliance.

---

## 5. Recommended Modern Technology Stack

This stack is fully aligned with the approved TypeScript and Node.js direction.

### 5.1 Main Frontend

| Technology | Recommendation |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI Library | React |
| Styling | Tailwind CSS |
| Components | shadcn/ui or custom design system based on Radix primitives |
| Icons | lucide-react |
| Animations | Framer Motion, Lottie, Rive, CSS transitions |
| Charts | Recharts or Tremor-style chart components |
| State | TanStack Query for server state, Zustand for lightweight client state |
| Forms | React Hook Form with Zod validation |
| Testing | Playwright, Vitest, Testing Library |

### 5.2 Backend

| Technology | Recommendation |
|---|---|
| Runtime | Node.js Active LTS |
| Language | TypeScript |
| API Framework | NestJS for large modular backend or Fastify for lightweight services |
| API Style | REST for simple modules, GraphQL only if query flexibility becomes necessary |
| Realtime | WebSockets through Socket.IO, uWebSockets.js, or managed realtime service |
| Validation | Zod or class-validator depending on framework |
| Background Jobs | BullMQ with Redis |
| Scheduled Jobs | Cloud scheduler, cron service, or queue-based scheduler |

### 5.3 Database And Storage

| Need | Technology |
|---|---|
| Main database | PostgreSQL |
| ORM/query layer | Prisma or Drizzle |
| Realtime leaderboard cache | Redis / Valkey |
| Search | PostgreSQL full-text search first, then OpenSearch/Meilisearch if scale grows |
| File storage | S3-compatible object storage |
| Video metadata | Database records connected to YouTube links and internal videos |
| Analytics warehouse | ClickHouse, BigQuery, or managed analytics later |

### 5.4 Authentication

| Feature | Technology |
|---|---|
| Email/password | Clerk, Auth.js, or custom secure auth |
| OTP | Phone/email OTP provider |
| Passkeys | WebAuthn/passkey support |
| Session security | Secure HTTP-only cookies |
| Role-based access | RBAC with student, parent, teacher, organizer, admin, super-admin |
| Sensitive operations | Step-up authentication |

### 5.5 Payments For India

| Need | Technology |
|---|---|
| UPI/card/netbanking payments | Razorpay or Cashfree |
| Subscriptions | Razorpay subscriptions or equivalent |
| Invoices | Payment provider invoices plus platform billing records |
| Refunds | Provider refund API plus internal refund workflow |
| KYC | Payment provider/KYC partner if rewards become real money |
| Taxes | GST and TDS review with accountant/legal advisor |

### 5.6 Safe Competition Browser

Use a layered strategy:

- For normal practice, use browser-based anti-cheat signals.
- For official competitions, integrate with Safe Exam Browser or a dedicated secure exam client.
- For high-stakes events, use managed devices or institution labs where possible.
- Use proctoring only with clear consent and privacy policy.

Normal websites cannot fully stop OS-level tab switching, screen recording, second-device cheating, or external tools. A secure exam mode must combine client controls, server checks, identity checks, and post-event fraud review.

### 5.7 AI And Content Assistance

| Need | Technology |
|---|---|
| Doubt explanation | LLM-assisted tutor with guardrails |
| Question generation support | AI draft generation, human review mandatory |
| Personalized revision | Recommendation engine |
| Plagiarism detection | Similarity scoring and behavioral analysis |
| Code feedback | Sandbox execution plus AI explanation |
| Voice explanation | Text-to-speech later |
| OCR for uploaded notes | Document AI later |

### 5.8 Deployment

| Layer | Recommendation |
|---|---|
| Frontend hosting | Vercel or equivalent |
| Backend hosting | Render, Railway, Fly.io, AWS ECS, GCP Cloud Run, or Kubernetes later |
| Database | Managed PostgreSQL |
| Redis | Managed Redis/Valkey |
| CDN | Vercel/Cloudflare |
| Monitoring | Sentry, OpenTelemetry, Grafana/Prometheus, Logtail-style logging |
| CI/CD | GitHub Actions |
| Feature flags | LaunchDarkly, Statsig, or open-source alternative |

---

## 6. Technology Decisions To Avoid

| Avoid | Reason |
|---|---|
| Rejected backend-language direction | User has clearly rejected it for this project. |
| Overcomplicated microservices in MVP | Slows development and creates deployment complexity. |
| Hidden gambling mechanics | Legal and ethical risk. |
| Copy-paste prevention as the only anti-cheat method | Easy to bypass without deeper controls. |
| Unreviewed AI-generated questions | Wrong answers can damage trust. |
| Too many animations everywhere | Can distract from learning. |
| One single folder for everything | User wants strong separation and maintainability. |

---

## 7. Main Folder Architecture

This is a recommended monorepo-style structure. It is not implementation code. It is a planning structure.

| Folder | Purpose |
|---|---|
| `frontend` | All user-facing web pages, layouts, UI components, animations, and client-side screens. |
| `backend` | APIs, services, business logic, authentication, matching, payments, content delivery, events, and admin services. |
| `content` | Structured learning content for classes, subjects, chapters, topics, subtopics, quizzes, solutions, and YouTube links. |
| `class-9` | Class 9 content, subjects, chapters, tests, simulations, and community mapping. |
| `class-10` | Class 10 content, subjects, chapters, tests, simulations, and community mapping. |
| `class-11` | Class 11 stream-wise and subject-wise content. |
| `class-12` | Class 12 stream-wise and subject-wise content. |
| `engineering` | Coding languages, DSA, development skills, CS fundamentals, and engineering roadmaps. |
| `dashboard` | User dashboard logic, widgets, analytics, streaks, levels, wallet, and certificates. |
| `test` | Test engine, question delivery, timers, scoring, safe exam mode, and result review. |
| `auth` | Sign in, sign up, sessions, OTP, passkeys, roles, and account security. |
| `community` | Community pages, discussion categories, moderation, reporting, and class/language groups. |
| `events` | College event portal, organizer tools, event registrations, brackets, leaderboards, and certificates. |
| `matching` | Student matching, opponent selection, level range logic, contest rooms, and result logic. |
| `wallet` | Learning credits, payment records, subscription status, limits, rewards, and compliance records. |
| `admin` | Admin panel, moderation tools, content review, fraud review, user management, and platform settings. |
| `safe-browser` | Safe exam browser integration documents, competition lockdown policies, and event security settings. |
| `printables` | Printable worksheets, PDFs, certificates, report cards, and downloadable study material. |
| `shared` | Common types, constants, validation schemas, design tokens, and utility logic. |
| `docs` | Product documents, technical documents, user manuals, architecture notes, and operating procedures. |
| `scripts` | Build, import, migration, backup, and content-processing scripts. |
| `tests` | Automated tests, QA checklists, browser tests, API tests, and security tests. |

---

## 8. Folder Comment And Documentation Standard

Every folder should contain a `README.md`.

Each folder README should include:

- What this folder contains.
- Who owns this folder.
- What should not be placed inside this folder.
- Important business rules.
- Naming rules.
- Testing rules.
- Content update rules if it stores educational content.
- Example file naming pattern without code.

Every implementation file should contain:

- A top comment explaining the file purpose.
- A short comment for complex business decisions.
- A comment for scoring logic, matching logic, wallet logic, safe exam logic, and fraud logic.
- No unnecessary comments for obvious syntax.

Example comment style in future implementation:

- "This file calculates student level progress from earned points."
- "This service prevents users above the daily challenge cap from entering paid skill contests."
- "This module stores chapter-wise learning content for Class 9 Mathematics."

---

## 9. Page-Level MCP

### 9.1 Home Page

Purpose:

- Show the platform identity immediately.
- Help the user start learning in one click.
- Show daily progress.
- Show recommended class or engineering path.
- Show streak, current level, and next target.
- Show upcoming events.
- Show active matches if unlocked.
- Show safe competitions if available.

Home page sections:

- Top navigation.
- Continue learning card.
- Class shortcuts.
- Engineering shortcut.
- Daily challenge.
- Streak calendar preview.
- Recommended test.
- Upcoming event.
- Community highlights.
- Subscription/credit notice only when relevant.

Home page should not feel like a marketing landing page. It should feel like a useful learning dashboard from the first screen.

### 9.2 Class 9 Page

Purpose:

- Give Class 9 students a simple subject-wise learning area.
- Show chapter progress and tests.
- Show weak topics.
- Offer YouTube support links under unsolved/attempted questions.
- Offer animations and simulations for science and mathematics.

Recommended Class 9 subjects:

- Mathematics
- Science
- Social Science
- English
- Hindi
- Sanskrit or regional language
- Computer Applications
- Artificial Intelligence or IT optional
- General Knowledge optional

### 9.3 Class 10 Page

Purpose:

- Board-focused study path.
- Chapter-wise practice.
- Previous year question style.
- Timed tests.
- Revision plans.
- Safe test mode for school/college events if required.

Recommended Class 10 subjects:

- Mathematics Standard
- Mathematics Basic
- Science
- Social Science
- English
- Hindi
- Sanskrit or regional language
- Computer Applications
- Information Technology
- Artificial Intelligence optional

### 9.4 Class 11 Page

Purpose:

- Stream-based learning.
- Subject selection during onboarding.
- Chapter-wise mastery.
- Practical/project support.
- Entrance exam foundations.

Recommended Class 11 streams:

- Science PCM
- Science PCB
- Science PCMB
- Commerce
- Arts/Humanities
- Computer Science
- Skill subjects

Recommended Class 11 subjects:

- Physics
- Chemistry
- Mathematics
- Biology
- English
- Computer Science
- Informatics Practices
- Accountancy
- Business Studies
- Economics
- History
- Political Science
- Geography
- Psychology
- Sociology
- Entrepreneurship
- Physical Education

### 9.5 Class 12 Page

Purpose:

- Board exam preparation.
- Competitive exam support.
- Subject-wise practice.
- Project/practical guidance.
- Revision timetable.
- Mock tests and performance analytics.

Recommended Class 12 subjects:

- Physics
- Chemistry
- Mathematics
- Biology
- English
- Computer Science
- Informatics Practices
- Accountancy
- Business Studies
- Economics
- History
- Political Science
- Geography
- Psychology
- Sociology
- Entrepreneurship
- Physical Education

### 9.6 Engineering Page

Purpose:

- Give learners a language-wise and skill-wise roadmap.
- Support beginner to advanced paths.
- Provide day-wise plans such as 30-day C language, 45-day Python, 60-day DSA, 90-day full-stack.
- Each language should have its own folder and learning plan.
- Every problem should include a YouTube explanation link below it.
- Every topic should include theory, simulation where useful, examples, questions, and points.

Recommended engineering language folders:

- C
- C++
- Java
- Python
- JavaScript
- TypeScript
- HTML
- CSS
- SQL
- Rust
- C Sharp
- Kotlin
- Swift
- PHP
- Ruby
- R
- MATLAB
- Bash
- PowerShell
- Dart

Recommended engineering skill folders:

- Data Structures And Algorithms
- Web Development
- Backend Development
- Frontend Development
- Mobile App Development
- Database Systems
- Operating Systems
- Computer Networks
- DBMS
- Object-Oriented Programming
- System Design
- Cloud Computing
- DevOps
- Cybersecurity
- Artificial Intelligence
- Machine Learning
- Data Science
- Blockchain Basics
- Competitive Programming
- Git And GitHub
- Interview Preparation

### 9.7 Dashboard Page

Purpose:

- Personal command center.
- Show learning progress, points, level, streak, badges, wallet/credits, upcoming tests, event registrations, and community activity.

Dashboard widgets:

- Current level.
- Points to next level.
- Daily streak.
- Weekly activity.
- Current learning path.
- Completed days.
- Weak topics.
- Recommended revision.
- Recent test scores.
- Leaderboard rank.
- Match unlock status.
- Wallet/credit balance.
- Subscription status.
- Certificates.
- Event registrations.
- Community replies.

### 9.8 Test Page

Purpose:

- Practice tests.
- Chapter tests.
- Timed mock tests.
- Safe competition tests.
- Match questions.
- Result review.

Test types:

- Topic quiz.
- Chapter test.
- Mixed test.
- Daily challenge.
- Weekly test.
- Board-style test.
- Coding problem test.
- Debugging test.
- MCQ battle.
- Short answer battle.
- Event competition.
- Safe browser contest.

### 9.9 Sign In Page

Purpose:

- Simple secure login.

Methods:

- Email and password.
- Phone OTP.
- Email OTP.
- Google login if desired.
- Passkey login.
- Institution login later.

Security:

- Rate limit login attempts.
- Device trust system.
- Suspicious login warning.
- Session management.
- Logout from all devices.

### 9.10 Sign Up Page

Purpose:

- Convert a new user into a properly configured learner.

Required onboarding:

- Name.
- Email or phone.
- Class or Engineering selection.
- Board/stream if school student.
- Subjects.
- Target exams.
- Skill level.
- Language preference.
- Parent contact optional.
- College/institution optional.

After signup:

- Recommend first learning path.
- Set Day 1.
- Set default streak start.
- Create dashboard.
- Create community memberships.

### 9.11 Community Page

Purpose:

- Give learners a moderated discussion space.
- Keep communities separated by class, subject, chapter, and engineering language.
- Encourage doubt solving, peer learning, and event discussion.

Community folders should exist for:

- Class 9
- Class 10
- Class 11
- Class 12
- Engineering
- Each Class 9 subject
- Each Class 10 subject
- Each Class 11 subject
- Each Class 12 subject
- Each engineering language
- Each major event
- Announcements
- Doubts
- Study groups
- Contest discussions

Community features:

- Ask doubt.
- Answer doubt.
- Upvote helpful answers.
- Mark solved.
- Attach screenshot.
- Link question.
- Link YouTube explanation.
- Report abuse.
- Moderator review.
- Student reputation.
- Verified mentor badge.
- Class-only rooms.
- Language-only rooms.
- Event-only rooms.

---

## 10. Content Hierarchy

The learning system should follow this hierarchy:

| Level | Example |
|---|---|
| Program | Class 9, Class 10, Engineering |
| Subject / Language | Mathematics, Science, C Language |
| Chapter / Module | Number Systems, Motion, Pointers |
| Topic | Variables, Loops, Trigonometry |
| Subtopic | For loop syntax, Right triangle ratios |
| Lesson | Short theory section |
| Visual | Animation, simulation, diagram, chart |
| Question Set | MCQ, short answer, long answer, coding problem |
| Hint | First hint, second hint, concept hint |
| Solution | Text explanation and optional video |
| YouTube Link | Help video shown below problem |
| Points | Awarded after correct solution |
| Mastery | Topic progress score |

Every class, subject, chapter, topic, and subtopic should have its own content records and folder representation.

---

## 11. Class Folder Structure MCP

### 11.1 Class 9 Folder

Class 9 should include folders for:

- Mathematics
- Science
- Social Science
- English
- Hindi
- Sanskrit or regional language
- Computer Applications
- Artificial Intelligence optional
- Tests
- Worksheets
- Simulations
- YouTube links
- Community mapping
- Progress rules

Each subject folder should include:

- Chapters
- Topics
- Subtopics
- Theory
- Questions
- Hints
- Solutions
- Videos
- Tests
- Revision
- Notes
- Printable worksheets

### 11.2 Class 10 Folder

Class 10 should include folders for:

- Mathematics Standard
- Mathematics Basic
- Science
- Social Science
- English
- Hindi
- Sanskrit or regional language
- Computer Applications
- Information Technology
- Artificial Intelligence optional
- Board practice
- Previous year style questions
- Tests
- Worksheets
- Simulations
- YouTube links
- Community mapping

### 11.3 Class 11 Folder

Class 11 should include stream folders:

- Science PCM
- Science PCB
- Science PCMB
- Commerce
- Arts/Humanities
- Skill Subjects

Subject folders should include:

- Physics
- Chemistry
- Mathematics
- Biology
- Computer Science
- Informatics Practices
- English
- Accountancy
- Business Studies
- Economics
- History
- Political Science
- Geography
- Psychology
- Sociology
- Entrepreneurship
- Physical Education

### 11.4 Class 12 Folder

Class 12 should include:

- Board exam roadmaps.
- Stream-wise subjects.
- Practical/project folders.
- Revision folders.
- Mock test folders.
- Previous year question folders.
- Competitive exam bridge folders.
- YouTube help link folders.
- Community mapping folders.

---

## 12. Engineering Folder Structure MCP

Each language should have:

- Overview
- Why learn this language
- Setup guide
- Syntax basics
- Variables
- Data types
- Operators
- Control flow
- Loops
- Functions
- Arrays or collections
- Strings
- Memory concepts where relevant
- Object-oriented concepts where relevant
- Error handling
- File handling
- Standard library
- Beginner problems
- Intermediate problems
- Advanced problems
- Debugging challenges
- Mini projects
- Interview questions
- YouTube solution links
- Roadmap days
- Tests
- Match question pools
- Community folder

### 12.1 Recommended Language Priority

For the first launch, build these engineering languages first:

| Priority | Language | Why |
|---|---|---|
| 1 | C | Best for fundamentals, memory, pointers, and beginner college syllabus. |
| 2 | Python | Best beginner-friendly language and useful for AI/data. |
| 3 | Java | Common in college, OOP, DSA, and placements. |
| 4 | C++ | Strong for DSA and competitive programming. |
| 5 | JavaScript | Essential for web development. |
| 6 | TypeScript | Modern professional web development. |
| 7 | SQL | Required for databases and backend jobs. |
| 8 | HTML/CSS | Required for frontend basics. |
| 9 | Rust | Modern systems language, optional advanced path. |
| 10 | Kotlin | Android development and modern JVM path. |

### 12.2 Best Languages By Goal

| Goal | Best Languages |
|---|---|
| First programming language | Python or C |
| College fundamentals | C, C++, Java |
| DSA and placements | C++, Java, Python |
| Web development | JavaScript, TypeScript, HTML, CSS, SQL |
| Backend development | TypeScript, Python, Java |
| AI/ML | Python, SQL |
| Android | Kotlin, Java |
| iOS | Swift |
| Systems programming | C, C++, Rust |
| Data analysis | Python, SQL, R |
| Scripting/automation | Python, Bash, PowerShell |

---

## 13. Example 30-Day Language Plan Logic

When a user clicks Engineering, then clicks C Language, the platform should show a complete learning plan.

Example C Language 30-day structure:

| Day | Focus |
|---|---|
| Day 1 | Introduction, compiler, first program, output, basic syntax |
| Day 2 | Variables, constants, data types |
| Day 3 | Input and output |
| Day 4 | Operators |
| Day 5 | Conditional statements |
| Day 6 | Loops part 1 |
| Day 7 | Loops part 2 and pattern basics |
| Day 8 | Functions |
| Day 9 | Arrays part 1 |
| Day 10 | Arrays part 2 |
| Day 11 | Strings |
| Day 12 | Pointers introduction |
| Day 13 | Pointers with arrays |
| Day 14 | Recursion |
| Day 15 | Structures |
| Day 16 | Unions and enums |
| Day 17 | File handling |
| Day 18 | Dynamic memory allocation |
| Day 19 | Sorting basics |
| Day 20 | Searching basics |
| Day 21 | Debugging and common errors |
| Day 22 | Mini project 1 |
| Day 23 | Problem-solving set 1 |
| Day 24 | Problem-solving set 2 |
| Day 25 | MCQ and concept test |
| Day 26 | Coding challenge test |
| Day 27 | Mini project 2 |
| Day 28 | Revision |
| Day 29 | Final mock test |
| Day 30 | Certification challenge |

For every day:

- Show theory first.
- Show visual explanation if possible.
- Show subtopics one by one.
- Ask questions after each subtopic.
- Award points after correct answers.
- Show hints when stuck.
- Show YouTube link below the problem.
- Unlock next subtopic after minimum attempt or completion rule.
- Save time spent, accuracy, points, and mastery score.

---

## 14. Lesson Flow

Every lesson should follow this flow:

1. Short introduction.
2. Clear learning objective.
3. Theory in simple language.
4. Visual, animation, or simulation where useful.
5. Mini example.
6. First question.
7. Feedback after answer.
8. More questions with rising difficulty.
9. YouTube link below each question.
10. Summary.
11. Points awarded.
12. Streak update.
13. Next subtopic unlock.

---

## 15. Question Types

The platform should support:

- MCQ.
- Multiple select.
- Fill in the blank.
- True/false.
- Short answer.
- Long answer.
- Numerical answer.
- Match the following.
- Drag and drop.
- Diagram labeling.
- Coding problem.
- Debugging problem.
- Output prediction.
- SQL query problem.
- Case study question.
- Assertion-reason question.
- Timed challenge.
- Audio/visual question later.

---

## 16. Points System

Points should depend on question difficulty, length, topic importance, speed, and attempt count.

Recommended base point logic:

| Question Type | Base Points |
|---|---|
| Very easy MCQ | 1 |
| Easy short question | 2 |
| Medium concept question | 4 |
| Hard question | 7 |
| Long answer | 8 |
| Coding easy | 5 |
| Coding medium | 10 |
| Coding hard | 18 |
| Debugging challenge | 8 |
| Timed battle question | 5 to 20 |
| Final challenge | 25+ |

Modifiers:

- First attempt correct: bonus.
- Solved without hint: bonus.
- Solved quickly: small bonus.
- Used many hints: reduced points.
- Repeated same question: reduced points.
- Suspicious behavior: points held for review.

---

## 17. Level System

The level system should be simple and motivating.

Example level milestones:

| Level | Required Total Points | Unlock |
|---|---|
| 1 | 25 | Basic profile badge |
| 2 | 75 | Daily challenge access |
| 3 | 150 | Community answer badge |
| 4 | 300 | Chapter mastery badge |
| 5 | 500 | Weekly leaderboard |
| 6 | 800 | Advanced tests |
| 7 | 1200 | Mini competitions |
| 8 | 1700 | Mentor-recommended challenges |
| 9 | 2300 | Pre-match training |
| 10 | 3000 | Matching and compliant challenge credits unlock |
| 15 | 6000 | Advanced leaderboard |
| 20 | 10000 | Expert badge |
| 30 | 20000 | Elite badge |

Level 10 unlock should include:

- Matching mode.
- Advanced competitions.
- Wallet/learning-credit features.
- Subscription options.
- Skill challenge access only if legally compliant.

---

## 18. Streak System

Streak should work like LeetCode/GitHub style:

- A day counts if the user completes minimum learning activity.
- Minimum activity can be points earned, lesson completed, or test attempted.
- Streak freezes can be earned, not abused.
- Streak calendar should show activity intensity.
- Streak should not encourage unhealthy usage.

Daily streak examples:

- Light activity: 10 points.
- Normal activity: 25 points.
- Strong activity: 50 points.
- Excellent activity: 100 points.

Streak rewards:

- Badges.
- XP boost.
- Profile border.
- Community reputation.
- Revision reminders.
- Non-cash rewards.

---

## 19. Matching System MCP

The matching system should be inspired by BGMI-style matchmaking but applied to education.

### 19.1 Matching Eligibility

User can enter matching only after:

- Level 10 or above.
- Verified account.
- No active cheating restriction.
- Daily challenge limit available.
- Same class or same engineering category selected.

### 19.2 Matching Criteria

Match users based on:

- Same class or same engineering language.
- Same subject.
- Same chapter.
- Same selected topic if possible.
- Similar level range.
- Similar recent accuracy.
- Similar response speed.
- Same contest mode.
- Same language preference if available.

Example:

- User A is Class 9, Mathematics, Chapter Algebra, Level 10.
- User B is Class 9, Mathematics, Chapter Algebra, Level 9 or 11.
- Matching can start because class, subject, chapter, and level range are close.

### 19.3 Matching Modes

- 1v1 quick match.
- 1v1 chapter battle.
- 2v2 team battle later.
- 5-player quiz room.
- Class leaderboard sprint.
- Coding duel.
- Debugging duel.
- Event match.
- Practice-only match.
- Credit-based skill challenge only after legal approval.

### 19.4 Match Result Logic

Winner should be decided by:

- Correct answers.
- Total points.
- Time taken.
- Difficulty solved.
- Accuracy.
- Penalties for wrong answers.
- Anti-cheat confidence.

Tie-breakers:

- Higher accuracy.
- Faster final correct submission.
- Fewer hints.
- Higher difficulty solved.
- Sudden-death question.

### 19.5 Match Safety

- Do not allow Class 9 users to match with Class 10 users in class-specific modes.
- Do not allow large level gaps.
- Do not allow suspicious repeated matching between the same two users.
- Do not allow users to intentionally lose for transferring value.
- Do not allow paid challenge access for minors unless legal and guardian rules are satisfied.

---

## 20. Wallet, Credits, Subscription, And Rewards MCP

### 20.1 Important Legal Boundary

Do not design a hidden betting system. Do not rename betting to avoid law. The platform should be transparent and compliant.

Recommended model:

- Use "Learning Credits" for platform features.
- Use subscription for premium learning.
- Use sponsor-funded rewards for events.
- Use real-money skill contests only after lawyer approval, KYC, age checks, tax handling, and payment compliance.

### 20.2 Subscription After Level 10

At Level 10, offer:

- Continue with ads: user watches limited ads, such as one ad per day.
- Premium plan: example ₹200/month.
- Student yearly plan later.
- Institution-sponsored plan later.

Premium benefits:

- Fewer ads.
- Advanced analytics.
- Extra tests.
- Deeper solutions.
- More simulations.
- Priority events.
- Extra streak protection.

### 20.3 ₹100 Skill Pack Concept

The ₹100 pack should not be described as betting.

Safer alternatives:

- ₹100 Learning Credit Pack for premium tests and workshops.
- ₹100 Event Entry Pack for institution-approved contests.
- ₹100 Skill Arena Pack with non-cash rewards unless legal approval exists.
- ₹100 Practice Pack with certificate tests.

### 20.4 Daily Cap

The user requested a daily cap of ₹50 to ₹100 after Level 10. Keep this as a responsible-play and risk-control limit.

Rules:

- Daily paid challenge exposure maximum: ₹50 to ₹100.
- Platform should allow stricter caps for minors.
- Users should be able to self-limit.
- Parents should control minor accounts.
- Admin can lower caps for risk.
- No borrowing.
- No credit line.
- No negative wallet.

### 20.5 Reward Multiplier

The requested 1.7x reward should be treated carefully.

Recommended safe design:

- Use 1.7x as XP multiplier or virtual coin multiplier first.
- Do not use 1.7x cash payout until legal approval.
- For official events, use fixed sponsor-funded prizes instead of player-funded payout.
- Keep full audit logs.

---

## 21. Events And College Competition Portal

### 21.1 Event Portal Purpose

Colleges and institutions should be able to use the platform to organize competitions.

Event types:

- C language competition.
- Python competition.
- DSA contest.
- Web development quiz.
- Debugging contest.
- Class subject quiz.
- Aptitude competition.
- Hackathon.
- College coding league.
- School quiz league.

### 21.2 Organizer Features

Organizer should be able to:

- Create event.
- Select event type.
- Add college name.
- Add logo.
- Add date and time.
- Add eligibility.
- Add class/department/year restrictions.
- Create registration form.
- Collect participant details.
- Add rules.
- Add prize details.
- Select safe browser requirement.
- Select question pool.
- Invite participants.
- Download participant list.
- Monitor live competition.
- View leaderboard.
- Resolve disputes.
- Publish results.
- Generate certificates.

### 21.3 Participant Features

Participant should be able to:

- Register for event.
- Verify identity.
- Read rules.
- Join waiting room.
- Complete device check.
- Enter safe browser mode if required.
- Attempt competition.
- See result if allowed.
- Download certificate.
- Join event community.

### 21.4 Event Security

Event should support:

- Safe Exam Browser integration.
- Event access code.
- Time window.
- Device fingerprint.
- Identity check.
- Copy-paste restriction inside test area.
- Tab switch detection where browser allows it.
- Fullscreen warning.
- Randomized questions.
- Randomized options.
- Server-side timer.
- Submission audit log.
- Suspicious activity flags.
- Manual review before final rewards.

---

## 22. Safe Browser And Anti-Cheat MCP

### 22.1 Normal Practice Mode

For normal learning:

- Disable copy-paste inside answer boxes where reasonable.
- Detect focus loss.
- Warn on repeated tab switching.
- Randomize questions.
- Use plagiarism checks.
- Track answer timing.
- Track suspicious repeated behavior.

### 22.2 Competition Mode

For official competitions:

- Use Safe Exam Browser or dedicated exam client.
- Restrict allowed URLs.
- Require secure exam start link.
- Verify browser/exam key if supported.
- Use fullscreen locked mode where supported.
- Block external navigation inside controlled client.
- Use server-side anti-cheat.
- Use human moderation for high-stakes events.

### 22.3 Limitations

No normal website can fully stop:

- A user using another phone.
- OS-level screen recording.
- External notes.
- Another person helping.
- Virtual machines in every condition.
- Remote desktop in every condition.

Therefore the platform should combine:

- Technical restrictions.
- Identity verification.
- Question randomization.
- Time pressure.
- Behavioral analysis.
- Post-contest review.
- Clear rules.
- Human moderation.

---

## 23. Copy-Paste Rules

User requested that copy-paste should not be allowed.

Recommended implementation policy:

- Disable paste in competition answer editors.
- Disable copy from question text in competitions.
- Allow accessibility exceptions where legally required.
- Log paste attempts.
- Show warning after suspicious attempt.
- Auto-flag repeated attempts.
- In normal learning mode, allow copying for notes where it helps learning.
- In coding practice, allow typing only during official competition.
- Use plagiarism detection instead of relying only on paste blocking.

---

## 24. YouTube Link System

Every problem should have a YouTube help link below it.

This applies to:

- Class 9.
- Class 10.
- Class 11.
- Class 12.
- Engineering.
- Coding problems.
- Theory questions.
- Numerical problems.
- Long answer problems.
- Debugging problems.

### 24.1 YouTube Link Rules

- Show the link below the problem.
- Do not show it before the first attempt if the goal is challenge mode.
- In learning mode, show it as "Need help? Watch explanation."
- In test mode, hide it until after submission.
- In competition mode, do not show help videos during the match.
- After result, show explanation videos.
- Content team should verify every video.
- Prefer official platform-created videos over random external videos.
- If using external YouTube, check quality, language, accuracy, and ads/safety.

### 24.2 Video Metadata

Each video should store:

- Title.
- Language.
- Teacher/channel.
- Duration.
- Difficulty.
- Related class.
- Related subject.
- Related chapter.
- Related topic.
- Related question.
- Verified status.
- Last reviewed date.

---

## 25. Animations And Simulations

Animations should help understanding, not distract.

Recommended areas:

- Science experiments.
- Physics motion.
- Chemistry reactions.
- Biology diagrams.
- Mathematics graphs.
- Geometry construction.
- Coding memory model.
- Pointer visualization.
- Stack and queue visualization.
- Sorting algorithms.
- Recursion call stack.
- Network packets.
- Database query flow.

Recommended tools:

- Framer Motion for UI transitions.
- Rive for interactive animations.
- Lottie for lightweight explainers.
- Three.js for 3D simulations where needed.
- p5.js for math and science interactive visualizations.
- Mermaid-style diagrams for internal docs only.

---

## 26. Sounds And Feedback

Every correct and wrong answer should have separate sound feedback.

Rules:

- Correct answer: pleasant short sound.
- Wrong answer: soft error sound, not harsh.
- Level up: celebratory sound.
- Streak extended: warm success sound.
- Match found: energetic sound.
- Timer warning: subtle urgent sound.
- User should be able to mute all sounds.
- Respect browser autoplay restrictions.
- Do not play sounds in silent mode.
- Accessibility: provide visual feedback also.

---

## 27. Community MCP In Detail

### 27.1 Class-Based Communities

Each class should have:

- General room.
- Subject rooms.
- Chapter rooms.
- Doubt rooms.
- Test discussion room.
- Event discussion room.
- Announcement room.

### 27.2 Engineering Communities

Each language should have:

- Beginner doubts.
- Syntax help.
- Problem discussion.
- Debugging help.
- Project showcase.
- Interview questions.
- Match discussion.
- Event room.

### 27.3 Moderation

Community must include:

- Report button.
- Spam detection.
- Abuse detection.
- Link safety check.
- Moderator queue.
- Student reputation.
- Verified mentor role.
- Auto-lock for heated threads.
- Event-only restricted rooms.

### 27.4 Community Gamification

Users can earn:

- Helpful answer points.
- Mentor badge.
- Doubt solver badge.
- Weekly helper rank.
- Subject expert badge.
- Language expert badge.

Community points should not overpower learning points.

---

## 28. Admin MCP

Admin panel should manage:

- Users.
- Roles.
- Classes.
- Subjects.
- Chapters.
- Topics.
- Questions.
- Solutions.
- YouTube links.
- Tests.
- Events.
- Communities.
- Reports.
- Payments.
- Subscriptions.
- Wallet/credits.
- Rewards.
- Fraud flags.
- Safe browser settings.
- Certificates.
- Notifications.
- Analytics.

Admin roles:

- Super admin.
- Content admin.
- Event admin.
- Finance admin.
- Moderator.
- Teacher.
- Mentor.
- Support agent.
- Fraud reviewer.

---

## 29. Data Model MCP

This is a no-code conceptual data model.

Main entities:

- User.
- Student profile.
- Parent profile.
- Teacher profile.
- Organizer profile.
- Admin profile.
- Class.
- Stream.
- Subject.
- Chapter.
- Topic.
- Subtopic.
- Lesson.
- Question.
- Question option.
- Hint.
- Solution.
- YouTube video.
- Test.
- Test attempt.
- Answer submission.
- Points transaction.
- Level progress.
- Streak record.
- Badge.
- Achievement.
- Match room.
- Match participant.
- Match question.
- Match result.
- Event.
- Event registration.
- Event leaderboard.
- Community.
- Post.
- Comment.
- Report.
- Wallet account.
- Credit transaction.
- Payment order.
- Subscription.
- Reward.
- Fraud flag.
- Audit log.
- Certificate.
- Notification.

Important rule:

- Every point, payment, reward, level update, match result, and competition submission should have an audit log.

---

## 30. API Module MCP

Recommended backend modules:

- Auth module.
- User module.
- Profile module.
- Curriculum module.
- Content module.
- Question module.
- Test module.
- Scoring module.
- Level module.
- Streak module.
- Matching module.
- Realtime match module.
- Leaderboard module.
- Community module.
- Events module.
- Organizer module.
- Safe exam module.
- Wallet/credits module.
- Payment module.
- Subscription module.
- Reward module.
- Notification module.
- Search module.
- Admin module.
- Moderation module.
- Fraud detection module.
- Analytics module.
- Certificate module.

Each module should have:

- Clear folder.
- README.
- Business rules.
- API documentation.
- Tests.
- Logging.
- Security checks.

---

## 31. UI/UX Design MCP

### 31.1 Visual Style

The platform should be:

- Minimal.
- Clean.
- Fast.
- Student-friendly.
- Premium but not overdecorated.
- Bright enough for younger users.
- Calm enough for serious study.
- Easy to scan.

### 31.2 Navigation

Recommended navigation:

- Home.
- Learn.
- Engineering.
- Tests.
- Matches.
- Events.
- Community.
- Dashboard.

On mobile:

- Bottom navigation for Home, Learn, Tests, Community, Profile.
- Match and Events can be prominent buttons inside dashboard.

### 31.3 Important UX Rules

- Do not overload students with too many options.
- Show one recommended next action.
- Use progress bars.
- Use simple labels.
- Keep tests distraction-free.
- Keep competition mode strict and focused.
- Keep wallet/credit information transparent.
- Use readable fonts.
- Use strong contrast.
- Avoid large confusing hero sections.

---

## 32. Learning Personalization

The platform should recommend:

- Next topic.
- Weak topic revision.
- Test based on recent mistakes.
- YouTube explanation.
- Easier question if user is stuck.
- Harder question if user is performing well.
- Match opponent with similar skill.
- Community thread related to current doubt.

Inputs:

- Accuracy.
- Time per question.
- Hint usage.
- Repeated mistakes.
- Streak history.
- Level.
- Test scores.
- Subject preference.
- Chapter completion.

---

## 33. Notifications MCP

Notification types:

- Daily learning reminder.
- Streak reminder.
- Test reminder.
- Event reminder.
- Match invite.
- Community reply.
- Level up.
- Subscription reminder.
- Payment success.
- Certificate ready.
- Fraud review update.
- Organizer announcement.

Channels:

- In-app.
- Email.
- SMS/WhatsApp later if compliant.
- Push notifications later.

---

## 34. Certificates MCP

Certificates should be available for:

- Completing a language path.
- Completing a class subject path.
- Winning an event.
- Participating in an event.
- Completing a mock series.
- Becoming a community mentor.

Certificate should include:

- Student name.
- Course/event name.
- Date.
- Score or rank if allowed.
- Unique certificate ID.
- QR verification link.
- Issuer name.
- Organizer logo for college events.

---

## 35. Analytics MCP

Student analytics:

- Accuracy.
- Speed.
- Topic mastery.
- Weak chapters.
- Strong chapters.
- Time spent.
- Streak.
- Level.
- Match performance.
- Test performance.

Admin analytics:

- Daily active users.
- Weekly active users.
- Retention.
- Course completion.
- Most difficult questions.
- Most skipped questions.
- Video usage.
- Event participation.
- Fraud flags.
- Payment conversion.

Organizer analytics:

- Registrations.
- Attendance.
- Drop-off.
- Average score.
- Leaderboard.
- Suspicious attempts.
- Certificate downloads.

---

## 36. Search MCP

Search should support:

- Search by question.
- Search by topic.
- Search by chapter.
- Search by YouTube video.
- Search by community post.
- Search by event.
- Search by language.
- Search by user in admin.

Start with PostgreSQL search. Move to dedicated search engine only when needed.

---

## 37. AI Feature MCP

AI should be used carefully.

Possible features:

- Explain my mistake.
- Generate similar practice question.
- Summarize topic.
- Create revision plan.
- Suggest YouTube video.
- Detect weak areas.
- Code feedback.
- Natural language doubt answer.
- Teacher content assistant.
- Admin fraud summary assistant.

Rules:

- AI answers should be reviewed for critical educational content.
- Do not blindly publish AI questions.
- Show confidence or "verify with teacher" where needed.
- Keep student privacy protected.
- Do not expose answer during live competition.

---

## 38. Security MCP

Security must include:

- Secure sessions.
- Password hashing if custom auth is used.
- OTP rate limits.
- Login rate limits.
- Role-based access control.
- Admin action audit logs.
- Payment webhook verification.
- Input validation.
- File upload scanning.
- Content Security Policy.
- CSRF protection where needed.
- XSS protection.
- SQL injection protection through safe query layer.
- API rate limits.
- Abuse detection.
- Secure secrets management.
- Regular dependency updates.

---

## 39. Privacy MCP

Privacy requirements:

- Clear privacy policy.
- Minimal data collection.
- Guardian controls for minors.
- Consent for camera/mic/proctoring.
- Consent for event monitoring.
- Option to delete account where legally allowed.
- Data retention policy.
- Secure storage of personal data.
- No unnecessary public exposure of student details.
- Leaderboard display names should be safe.

---

## 40. Compliance MCP

The platform must be reviewed for:

- Indian payment rules.
- GST requirements.
- Tax reporting for rewards.
- KYC/AML if real money rewards exist.
- Minor user protection.
- Advertising rules for students.
- Skill contest legality by Indian state.
- Consumer protection.
- Data privacy.
- School/college event consent.
- Accessibility requirements.

Important:

- Do not call a betting system by another name to avoid law.
- Do not allow minors into real-money challenge systems without legal clearance.
- Keep wallet and reward terms transparent.
- Keep daily caps and self-exclusion features.

---

## 41. Accessibility MCP

The platform should support:

- Keyboard navigation.
- Screen reader labels.
- High contrast.
- Font size options.
- Captions for videos.
- Text alternative for diagrams.
- Reduced motion mode.
- Mute sound option.
- Colorblind-safe status indicators.
- Accessible tests where possible.

Competition mode should balance security and accessibility.

---

## 42. Performance MCP

Performance goals:

- Fast first load.
- Fast lesson navigation.
- Smooth test experience.
- Realtime match latency as low as possible.
- Optimized images.
- Lazy-loaded simulations.
- Cached content.
- CDN for static assets.
- Database indexes for progress, leaderboard, and questions.

Critical pages:

- Test page.
- Match page.
- Event live page.
- Dashboard.
- Lesson page.

---

## 43. Testing MCP

Testing should include:

- Unit tests.
- API tests.
- Browser tests.
- Mobile responsive tests.
- Payment webhook tests.
- Matching tests.
- Scoring tests.
- Level tests.
- Streak tests.
- Safe exam tests.
- Admin permission tests.
- Event load tests.
- Security tests.
- Accessibility tests.

High-risk logic needing strong tests:

- Points calculation.
- Level update.
- Daily cap.
- Wallet/credit transaction.
- Match result.
- Event ranking.
- Anti-cheat flags.
- Subscription status.
- Payment confirmation.

---

## 44. MVP Scope

First version should not try to build everything at once.

Recommended MVP:

- Home.
- Sign in/sign up.
- Dashboard.
- Class 9 basic structure.
- Class 10 basic structure.
- Engineering C language 30-day plan.
- Basic lesson flow.
- Basic questions.
- Points.
- Level.
- Streak.
- YouTube link under questions.
- Basic community.
- Basic admin content manager.
- Basic tests.

MVP should exclude:

- Real-money challenges.
- Full safe browser integration.
- Complex matching.
- Advanced AI.
- Every subject fully completed.
- Every language fully completed.

---

## 45. Phase 2 Scope

Add:

- Class 11 and Class 12 deeper content.
- More engineering languages.
- Better dashboard analytics.
- Chapter tests.
- Weekly leaderboards.
- Event portal beta.
- Organizer registration forms.
- More community moderation.
- Subscription plan.
- Ads-supported mode.
- Better animations.
- More YouTube mapping.

---

## 46. Phase 3 Scope

Add:

- Matching mode.
- Realtime battles.
- Advanced anti-cheat.
- Safe browser integration.
- College event live competitions.
- Certificates.
- Sponsor-funded rewards.
- AI doubt assistant.
- Personalized recommendations.
- Parent dashboard.
- Teacher dashboard.

---

## 47. Phase 4 Scope

Add:

- Mobile app.
- Offline downloads.
- Institutional dashboards.
- Advanced simulations.
- AI voice tutor.
- Multilingual content.
- National leaderboard.
- Placement preparation.
- Hackathon management.
- Legally approved skill contest model if permitted.

---

## 48. Detailed Feature Improvement Ideas

Extra features that can make the platform stronger:

- Daily mission.
- Weekly mission.
- Chapter mastery badge.
- Weak topic repair mode.
- Mistake notebook.
- Formula notebook.
- Code snippet notebook.
- Flashcards.
- Revision calendar.
- Pomodoro study timer.
- Focus mode.
- Parent weekly report.
- Teacher assignment mode.
- College private event rooms.
- Public contest pages.
- Certificate verification.
- Mentor office hours.
- Doubt bounty with non-cash points.
- Student portfolio.
- GitHub integration for engineering learners.
- Code replay for competitions.
- Typing speed tracker for coding.
- Plagiarism similarity report.
- AI-generated hints after failed attempts.
- Adaptive difficulty.
- Skill map.
- Career roadmap.
- Placement readiness score.
- Board readiness score.
- Event sponsor pages.
- Institution white-label pages.

---

## 49. Naming Suggestions

Possible platform names:

- SkillArena
- LearnBattle
- CodeShastra
- RankMind
- EduArena
- LevelUp Learn
- StudyClash
- BrainArena
- PathRank
- SkillStreak

Avoid names that sound like gambling or betting.

---

## 50. Content Quality Rules

Every question should have:

- Correct answer.
- Difficulty level.
- Points.
- Topic mapping.
- Explanation.
- Hint.
- YouTube link.
- Review status.
- Created by.
- Reviewed by.
- Last updated date.

Every lesson should have:

- Clear objective.
- Simple theory.
- Examples.
- Practice.
- Summary.
- Next step.

Content should be reviewed by teachers or subject experts before publishing.

---

## 51. Event Fairness Rules

Events should be fair:

- Same question difficulty for all users.
- Randomized order.
- Clear timing.
- Clear rules.
- Practice round if needed.
- No hidden scoring.
- Result review window.
- Dispute process.
- Organizer approval before final result.
- Fraud flags before certificate/reward release.

---

## 52. Daily User Journey

Ideal daily student flow:

1. User opens app.
2. Dashboard shows today's recommended task.
3. User starts lesson.
4. User reads short theory.
5. User solves questions.
6. Correct/wrong sound plays.
7. Points are awarded.
8. Streak is updated.
9. Weak mistakes are saved.
10. YouTube help appears when needed.
11. User completes daily goal.
12. User sees next level progress.
13. User can join community or test.

---

## 53. Match User Journey

Ideal match flow:

1. User reaches Level 10.
2. User opens Matching.
3. User selects class or engineering path.
4. User selects subject/language.
5. User selects chapter/topic.
6. System finds similar-level user.
7. Both users enter ready room.
8. Anti-cheat rules are shown.
9. Match starts.
10. Questions appear.
11. Users answer quickly and accurately.
12. Points update in realtime.
13. Match ends.
14. Winner is shown.
15. Result is saved.
16. Suspicious result may be held for review.

---

## 54. College Event User Journey

Ideal event flow:

1. College contacts platform.
2. Organizer account is created.
3. Organizer creates event.
4. Organizer creates registration form.
5. Students register.
6. Admin reviews event.
7. Question pool is selected.
8. Safe browser requirement is configured if needed.
9. Students complete device check.
10. Competition starts.
11. Live leaderboard updates.
12. Anti-cheat flags are monitored.
13. Event ends.
14. Results are reviewed.
15. Certificates are generated.
16. Organizer downloads reports.

---

## 55. Recommended Build Team

For serious development:

- Product manager.
- UI/UX designer.
- Frontend developer.
- Backend developer.
- Database engineer.
- DevOps engineer.
- Content manager.
- Subject teachers.
- Coding mentors.
- QA engineer.
- Security reviewer.
- Legal/accounting advisor for payments and rewards.

For early MVP:

- One full-stack developer.
- One UI designer.
- One content creator.
- One subject reviewer.

---

## 56. Risk Register

| Risk | Mitigation |
|---|---|
| Too many features at once | Build MVP first. |
| Legal risk from money challenges | Use compliant credits/subscription first; lawyer review before cash contests. |
| Cheating in competitions | Safe browser, randomization, logs, moderation, fraud review. |
| Poor content quality | Human review workflow. |
| Users feel confused | Minimal dashboard and one recommended next step. |
| Slow app | Performance budgets and caching. |
| Payment failures | Strong payment reconciliation. |
| Community abuse | Moderation and reporting. |
| AI gives wrong answer | Human-reviewed educational content and guardrails. |
| Folder structure becomes messy | Strict README and ownership rules. |

---

## 57. Success Metrics

Learning metrics:

- Daily active learners.
- Lessons completed.
- Questions solved.
- Average accuracy.
- Streak retention.
- Topic mastery.
- Test improvement.

Business metrics:

- Signup conversion.
- Day 7 retention.
- Day 30 retention.
- Subscription conversion.
- Event organizer conversion.
- Payment success rate.

Community metrics:

- Questions asked.
- Questions solved.
- Helpful answers.
- Report rate.
- Moderator response time.

Competition metrics:

- Match completion rate.
- Event completion rate.
- Fraud flag rate.
- Dispute rate.
- Leaderboard engagement.

---

## 58. Final Recommended Stack Summary

Use this stack first:

- Frontend: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, lucide-react.
- Backend: Node.js with TypeScript, NestJS or Fastify.
- Database: PostgreSQL.
- ORM: Prisma or Drizzle.
- Cache/realtime leaderboard: Redis or Valkey.
- Realtime: WebSockets.
- Jobs: BullMQ.
- Auth: Clerk, Auth.js, or custom secure auth with passkeys later.
- Payments India: Razorpay or Cashfree.
- Testing: Playwright, Vitest, API tests.
- Monitoring: Sentry and OpenTelemetry.
- Storage: S3-compatible storage.
- Search: PostgreSQL search first, OpenSearch/Meilisearch later.
- Safe exam: Safe Exam Browser integration for official competitions.
- AI: Optional LLM tutor and content assistant after MVP.

Use TypeScript and Node.js for the main implementation.

---

## 59. Official References Used For Technology Direction

- Next.js App Router documentation: https://nextjs.org/docs/app
- Next.js TypeScript configuration: https://nextjs.org/docs/app/api-reference/config/typescript
- React TypeScript documentation: https://react.dev/learn/typescript
- TypeScript documentation: https://www.typescriptlang.org/docs/
- Node.js release guidance: https://nodejs.org/en/about/previous-releases
- PostgreSQL JSONB indexing documentation: https://www.postgresql.org/docs/16/datatype-json.html
- Redis leaderboard documentation: https://redis.io/docs/latest/develop/use-cases/leaderboard/
- Clerk Next.js SDK documentation: https://clerk.com/docs/reference/nextjs/overview
- WebAuthn Level 3 specification: https://www.w3.org/TR/webauthn-3/
- Safe Exam Browser overview: https://safeexambrowser.org/about_overview_en.html
- Razorpay UPI documentation: https://razorpay.com/docs/payments/payment-methods/upi/?preferred-country=IN
- Tailwind CSS Next.js guide: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- shadcn/ui documentation: https://ui.shadcn.com/docs
- Playwright documentation: https://playwright.dev/docs/intro

---

## 60. Final Build Instruction For Future Developers

Build this platform in phases. Start with a clean monorepo, strict folder separation, and clear README comments inside every folder. Do not create one messy app where all classes, subjects, languages, tests, events, and community logic are mixed together.

The first working version should focus on:

- Home.
- Auth.
- Dashboard.
- Class 9 and Class 10 foundation.
- Engineering C language 30-day plan.
- Lesson flow.
- Questions.
- Points.
- Levels.
- Streak.
- YouTube help links.
- Basic community.
- Basic test engine.

After that, expand into:

- More subjects.
- More engineering languages.
- Events.
- Matching.
- Safe browser.
- Subscriptions.
- Compliant rewards.
- AI assistant.

Most important product rule:

The platform should make students feel, "I know exactly what to do next, I can see my progress, and I want to come back tomorrow."

---

## 61. Expanded MCP Version 2: Interpretation Of The Full Requirement

This expanded section exists because the website idea is not just a normal education website. It is a large learning ecosystem with study content, coding plans, tests, levels, streaks, events, safe competitions, communities, matching, subscriptions, credits, and institutional portals.

The platform should be understood as a combination of:

- Learning management system.
- Coding practice platform.
- School subject practice platform.
- Competitive quiz platform.
- Safe exam/event platform.
- Student community platform.
- Gamified progress platform.
- Institution competition portal.
- Minimal dashboard-based web app.

The MCP should not be treated as a simple page list. It should be treated as a complete product blueprint.

Core interpretation:

- The user wants a complete website-specific MCP, not a definition of MCP.
- The website must be built with the approved TypeScript and Node.js direction.
- The Markdown file must not include implementation code.
- The platform should use modern technologies.
- The platform should have strong folder separation.
- Every future folder and file should have easy English comments and explanation.
- Every class, subject, chapter, topic, engineering language, community area, event area, and test area should be separately organized.
- Matching should be fair, level-based, and class/topic-specific.
- Competition mode should be safer than normal learning mode.
- Real-money gaming/betting must not be hidden under another name.
- YouTube help links should exist under problems for all classes and engineering learning paths.

---

## 62. Updated India Compliance Decision For Money Features

This section supersedes any earlier softer wording about real-money skill contests.

As of May 2026, India has a strict legal framework around online money games. Government sources describe the Promotion and Regulation of Online Gaming Act, 2025 and the Promotion and Regulation of Online Gaming Rules, 2026 as prohibiting online money games and supporting permissible e-sports and online social games.

Important product decision:

- Do not build "pay ₹100 and win 1.7x cash" as a user-funded money game.
- Do not rename betting money as coins, wallet, gems, diamonds, energy, or credits if users deposit money expecting monetary return.
- Do not allow students to stake money against each other.
- Do not process payments for online money game entry.
- Do not advertise quick wealth or cash multiplication.
- Do not allow minors into any cash-reward product without strong legal approval, and the safer MVP decision is to avoid cash-reward user-funded matches entirely.

Allowed safer directions:

- Subscription for premium learning.
- One ad per day after Level 10 for free users.
- Learning credits that only unlock learning features and cannot be withdrawn.
- Sponsor-funded prizes where students do not stake money.
- Institution-paid event hosting.
- Certificate fees where legally compliant.
- Workshop fees.
- Mock test series fees.
- Non-cash badges, XP, ranks, certificates, coupons, books, scholarships, and sponsor gifts.
- E-sports/social-game registration only if officially classified/registered as permitted.

Product wording:

- Use "Learning Credits" only for non-withdrawable platform access.
- Use "Reward Points" only for non-cash gamification.
- Use "Scholarship Rewards" only when funded by platform/sponsor/institution, not by pooled player stakes.
- Use "Event Entry Fee" only for institution/service access, not for winner payout pool.
- Use "Prize Sponsored By" when a sponsor funds prizes.

Never use:

- Betting.
- Wager.
- Stake.
- Cash battle.
- Deposit to win more.
- 1.7x cash return.
- Money doubling.
- Hidden wallet terminology to avoid law.

---

## 63. Legal-Safe Monetization Model

### 63.1 Free Plan

Free users should get:

- Daily lessons.
- Limited daily questions.
- Basic streak.
- Basic dashboard.
- Community read access.
- Limited community posting.
- Basic tests.
- YouTube help links.
- Limited event participation where event is free.

### 63.2 Ads-Supported Plan After Level 10

After Level 10, a free user can continue by watching one limited ad per day.

Rules:

- No misleading ads.
- No gambling ads.
- No adult ads.
- No predatory loan ads.
- No ads inside safe competition mode.
- Ads should not interrupt tests.
- Ads should not appear to minors without careful policy review.

### 63.3 Premium Plan

Example price: ₹200 per month.

Premium features:

- No daily ad requirement.
- More practice sets.
- Advanced explanations.
- Advanced analytics.
- More simulations.
- Downloadable worksheets.
- More mock tests.
- Priority event registration.
- Premium community badge.
- More AI tutor usage if AI is added.
- Revision planner.
- Certificate discount.

### 63.4 Learning Credit Pack

Example price: ₹100.

Safe use:

- Unlock premium tests.
- Unlock workshops.
- Unlock certificate attempts.
- Unlock advanced simulations.
- Unlock project review.
- Unlock mentor doubt session.

Unsafe use:

- Do not use for staking in matches.
- Do not make credits withdrawable.
- Do not pool credits and give winner cash.
- Do not advertise credits as income.

### 63.5 Sponsor-Funded Prize Model

This is safer than user-funded payout.

Example:

- A college hosts a C language event.
- College pays platform hosting fee.
- Sponsor or college funds prizes.
- Students participate for free or pay only a non-prize service fee if legally approved.
- Winners receive certificates, internship coupons, books, scholarships, or sponsor prizes.

### 63.6 Institution Plan

Institution plan can include:

- Event portal.
- Private competition rooms.
- Registration forms.
- Student identity verification.
- Safe exam browser configuration.
- Leaderboard.
- Certificates.
- Analytics report.
- Admin support.

---

## 64. Complete Information Architecture

### 64.1 Top Navigation

Top navigation should include:

- Home.
- Learn.
- Engineering.
- Tests.
- Events.
- Community.
- Dashboard.
- Profile.

When user is not logged in:

- Home.
- Class 9.
- Class 10.
- Class 11.
- Class 12.
- Engineering.
- Sign In.
- Sign Up.

When user is logged in:

- Continue Learning.
- Tests.
- Matches.
- Events.
- Community.
- Dashboard.
- Profile.

When user is organizer:

- Organizer Dashboard.
- Events.
- Registrations.
- Leaderboard.
- Certificates.
- Reports.

When user is admin:

- Admin Dashboard.
- Content.
- Users.
- Events.
- Moderation.
- Payments.
- Reports.
- Settings.

### 64.2 Mobile Navigation

Mobile bottom navigation:

- Home.
- Learn.
- Test.
- Community.
- Profile.

Floating action:

- Continue today's task.

Special mobile rules:

- Match mode should show clear confirmation before starting.
- Test mode should hide bottom navigation.
- Competition mode should lock UI to exam layout.

---

## 65. Exact Folder Governance MCP

The user wants everything separated. The implementation must follow strict folder governance.

### 65.1 Folder README Rule

Every folder must have a `README.md` with:

- Folder purpose.
- What files belong here.
- What files do not belong here.
- Naming rules.
- Owner role.
- Testing expectations.
- Comment expectations.
- Related folders.

### 65.2 File Header Comment Rule

Every future source file should start with a simple English purpose comment.

Examples of purpose comments:

- "This file defines the Class 9 Mathematics chapter page."
- "This file handles scoring rules for practice questions."
- "This file stores validation rules for event registration."
- "This file manages safe browser settings for official competitions."

### 65.3 Business Logic Comment Rule

Add detailed comments for:

- Level calculation.
- Streak calculation.
- Points calculation.
- Matchmaking.
- Competition timer.
- Wallet/credit logic.
- Payment reconciliation.
- Anti-cheat logic.
- Event result finalization.
- Certificate generation.
- Admin permissions.

### 65.4 Folder Separation Rule

Never mix:

- Class 9 content inside Class 10 folder.
- Engineering content inside school class folders.
- Community logic inside test engine.
- Payment logic inside matching engine.
- Admin logic inside public pages.
- Safe browser policies inside normal practice tests.

---

## 66. Expanded Class 9 MCP

Class 9 should be simple, visual, and concept-focused.

### 66.1 Class 9 Subjects

Recommended folders:

- Mathematics.
- Science.
- Social Science.
- English.
- Hindi.
- Sanskrit.
- Regional Language.
- Computer Applications.
- Information Technology.
- Artificial Intelligence.
- General Knowledge.
- Olympiad Foundation.
- Worksheets.
- Tests.
- Simulations.
- Community.

### 66.2 Class 9 Mathematics Chapters

Recommended chapter folders:

- Number Systems.
- Polynomials.
- Coordinate Geometry.
- Linear Equations In Two Variables.
- Introduction To Euclid's Geometry.
- Lines And Angles.
- Triangles.
- Quadrilaterals.
- Circles.
- Heron's Formula.
- Surface Areas And Volumes.
- Statistics.
- Probability.

Each chapter should include:

- Theory.
- Formula sheet.
- Visual explanation.
- Solved examples.
- Easy questions.
- Medium questions.
- Hard questions.
- Board-style questions.
- Timed quiz.
- YouTube links.
- Mistake review.
- Chapter test.

### 66.3 Class 9 Science Chapters

Recommended chapter folders:

- Matter In Our Surroundings.
- Is Matter Around Us Pure.
- Atoms And Molecules.
- Structure Of The Atom.
- The Fundamental Unit Of Life.
- Tissues.
- Motion.
- Force And Laws Of Motion.
- Gravitation.
- Work And Energy.
- Sound.
- Improvement In Food Resources.

Science should include simulations for:

- States of matter.
- Atomic structure.
- Cell structure.
- Motion graphs.
- Force and acceleration.
- Sound waves.
- Gravitation.

### 66.4 Class 9 Social Science

Folders:

- History.
- Geography.
- Political Science.
- Economics.

Each should include:

- Chapter summary.
- Timeline where needed.
- Map practice.
- Key terms.
- Short answers.
- Long answers.
- MCQs.
- YouTube explanations.

---

## 67. Expanded Class 10 MCP

Class 10 should be board-focused and revision-friendly.

### 67.1 Class 10 Subjects

Recommended folders:

- Mathematics Standard.
- Mathematics Basic.
- Science.
- Social Science.
- English.
- Hindi.
- Sanskrit.
- Regional Language.
- Computer Applications.
- Information Technology.
- Artificial Intelligence.
- Board Practice.
- Sample Papers.
- Previous Year Style.
- Worksheets.
- Tests.
- Community.

### 67.2 Class 10 Mathematics Chapters

Recommended folders:

- Real Numbers.
- Polynomials.
- Pair Of Linear Equations In Two Variables.
- Quadratic Equations.
- Arithmetic Progressions.
- Triangles.
- Coordinate Geometry.
- Introduction To Trigonometry.
- Applications Of Trigonometry.
- Circles.
- Areas Related To Circles.
- Surface Areas And Volumes.
- Statistics.
- Probability.

Each chapter should include:

- NCERT-style explanation.
- Formula sheet.
- Board important questions.
- Common mistakes.
- Step-by-step solutions.
- YouTube help.
- Basic-to-advanced practice.
- Chapter test.

### 67.3 Class 10 Science Chapters

Recommended folders:

- Chemical Reactions And Equations.
- Acids Bases And Salts.
- Metals And Non-Metals.
- Carbon And Its Compounds.
- Life Processes.
- Control And Coordination.
- How Do Organisms Reproduce.
- Heredity.
- Light Reflection And Refraction.
- Human Eye And Colourful World.
- Electricity.
- Magnetic Effects Of Electric Current.
- Our Environment.

Science should include:

- Diagrams.
- Simulation.
- Formula practice.
- Numerical practice.
- Experiment videos.
- Assertion-reason questions.
- Case-based questions.

---

## 68. Expanded Class 11 MCP

Class 11 is where students split into streams. The app should ask stream during onboarding.

### 68.1 Science PCM

Folders:

- Physics.
- Chemistry.
- Mathematics.
- English.
- Computer Science optional.
- Engineering Foundation.
- Entrance Foundation.

### 68.2 Science PCB

Folders:

- Physics.
- Chemistry.
- Biology.
- English.
- NEET Foundation.
- Diagram Practice.

### 68.3 Commerce

Folders:

- Accountancy.
- Business Studies.
- Economics.
- Applied Mathematics optional.
- Entrepreneurship.
- English.

### 68.4 Arts/Humanities

Folders:

- History.
- Political Science.
- Geography.
- Psychology.
- Sociology.
- Economics.
- English.

### 68.5 Class 11 Learning Style

Class 11 should include:

- Deeper theory.
- Concept dependency graph.
- Long-term revision.
- Formula notebook.
- Practical file support.
- Project support.
- Competitive exam bridge.
- Skill-based tests.

---

## 69. Expanded Class 12 MCP

Class 12 should focus on board performance, entrance preparation, revision, and career next steps.

### 69.1 Class 12 Must-Have Features

- Board exam planner.
- Subject-wise target score.
- Chapter weightage.
- Revision calendar.
- Practical/project tracker.
- Previous year question analysis.
- Sample paper practice.
- Timed mock exams.
- Weak chapter repair.
- YouTube support.
- Certificate of completion.

### 69.2 Class 12 Science

Folders:

- Physics.
- Chemistry.
- Mathematics.
- Biology.
- Computer Science.
- Informatics Practices.
- English.
- JEE Bridge.
- NEET Bridge.
- CUET Bridge.

### 69.3 Class 12 Commerce

Folders:

- Accountancy.
- Business Studies.
- Economics.
- Applied Mathematics.
- Entrepreneurship.
- English.
- CUET Commerce.

### 69.4 Class 12 Humanities

Folders:

- History.
- Political Science.
- Geography.
- Psychology.
- Sociology.
- Economics.
- English.
- CUET Humanities.

---

## 70. Expanded Engineering MCP

Engineering should be treated as a career and skill-building area.

### 70.1 Engineering Main Categories

Folders:

- Programming Languages.
- Data Structures And Algorithms.
- Web Development.
- App Development.
- Backend Development.
- Frontend Development.
- Database.
- Cloud.
- DevOps.
- Cybersecurity.
- AI And Machine Learning.
- Data Science.
- System Design.
- Computer Science Fundamentals.
- Placement Preparation.
- Projects.
- Certifications.
- Coding Matches.
- Hackathons.
- Community.

### 70.2 Programming Language Folders

Recommended folders:

- C.
- C Plus Plus.
- Java.
- Python.
- JavaScript.
- TypeScript.
- HTML.
- CSS.
- SQL.
- Rust.
- C Sharp.
- Kotlin.
- Swift.
- PHP.
- Ruby.
- R.
- MATLAB.
- Dart.
- Bash.
- PowerShell.

The platform implementation should stay on the approved TypeScript and Node.js direction. Additional teaching-language choices can be decided separately later.

### 70.3 Best Language Recommendations

For students:

- Best first language for school learners: Python.
- Best first language for college fundamentals: C.
- Best for DSA: C++ or Java.
- Best for placements: Java, C++, Python, SQL.
- Best for web development: TypeScript, JavaScript, HTML, CSS.
- Best for backend with this project: TypeScript on Node.js.
- Best for AI/data: Python.
- Best for databases: SQL.
- Best for mobile Android: Kotlin.
- Best for iOS: Swift.
- Best for systems: Rust, C, C++.

For this website:

- Use TypeScript for frontend and backend.
- Use SQL/PostgreSQL for database.
- Use Python only for AI/content tooling if needed.
- Use TypeScript and Node.js for the main implementation.

---

## 71. Expanded 30-Day C Language Plan

When user clicks Engineering, then Programming Languages, then C, the platform should show a complete plan.

### 71.1 C Language Day Format

Each day should show:

- Day title.
- Estimated time.
- Learning goals.
- Theory section.
- Visual explanation.
- Subtopics.
- Practice questions.
- Points.
- Hints.
- YouTube links.
- Mini test.
- Completion badge.
- Next day unlock.

### 71.2 C Language 30-Day Detail

| Day | Main Focus | Subtopics | Practice |
|---|---|---|---|
| 1 | Introduction To C | What is C, compiler, first program, syntax structure | Output questions, identify syntax parts |
| 2 | Variables And Data Types | int, float, char, double, constants | Declare variables, predict type behavior |
| 3 | Input And Output | scanf, printf, format specifiers | Input/output problems |
| 4 | Operators | Arithmetic, relational, logical, assignment | Expression evaluation |
| 5 | Conditions | if, else, nested if, switch | Decision-making problems |
| 6 | Loops Part 1 | for, while | Counting and repetition |
| 7 | Loops Part 2 | do-while, nested loops | Pattern problems |
| 8 | Functions | Declaration, definition, return, parameters | Function-based problems |
| 9 | Arrays Part 1 | 1D arrays, traversal | Sum, max, min |
| 10 | Arrays Part 2 | Searching, basic sorting | Linear search, bubble sort |
| 11 | Strings | char arrays, string functions | String length, reverse |
| 12 | Pointers Basics | Address, dereference, pointer variable | Pointer tracing |
| 13 | Pointers With Arrays | Array-pointer relation | Pointer arithmetic |
| 14 | Recursion | Base case, recursive call | Factorial, Fibonacci |
| 15 | Structures | struct declaration, access | Student record problems |
| 16 | Unions And Enums | Difference from struct, constants | Concept MCQ |
| 17 | File Handling | Read, write, append | File-based mini tasks |
| 18 | Dynamic Memory | malloc, calloc, free | Dynamic array tasks |
| 19 | Sorting | Bubble, selection, insertion | Sort arrays |
| 20 | Searching | Linear and binary search | Search problems |
| 21 | Debugging | Common errors, warnings | Fix broken programs |
| 22 | Mini Project 1 | Calculator or marksheet | Project build task |
| 23 | Problem Set 1 | Mixed beginner problems | Timed practice |
| 24 | Problem Set 2 | Medium problems | Accuracy practice |
| 25 | Concept Test | MCQ and short answer | Theory review |
| 26 | Coding Challenge | Mixed coding | Scored challenge |
| 27 | Mini Project 2 | Quiz app or library record | Project task |
| 28 | Revision | All weak topics | Personalized revision |
| 29 | Final Mock Test | Timed test | Exam-style coding |
| 30 | Certification Challenge | Final project and test | Certificate unlock |

### 71.3 Day 1 Example Content Design

Day 1 should include:

- What is programming.
- What is C language.
- Why C is useful.
- What is compiler.
- What is source file.
- What is output.
- How a program runs.
- Basic program structure.
- Common beginner mistakes.
- Questions after each subtopic.
- YouTube link under each problem after attempt.
- Points for correct answers.
- Day completion score.

Day 1 question mix:

- MCQ: identify correct output.
- Short answer: what is compiler.
- Fill blank: basic syntax word.
- Debugging: find missing symbol.
- Coding: print a message.

---

## 72. Universal Daily Lesson Template

Every class lesson and engineering day should follow this structure:

1. Header.
2. Time estimate.
3. Difficulty.
4. Required previous knowledge.
5. Today's goal.
6. Theory part 1.
7. Practice question 1.
8. Feedback.
9. Theory part 2.
10. Practice question 2.
11. Visual or simulation.
12. Practice question 3.
13. Mini challenge.
14. YouTube help.
15. Summary.
16. Points earned.
17. Mistakes saved.
18. Streak update.
19. Next lesson preview.

Lesson should not dump too much theory at once. It should teach small concept, ask question, then continue.

---

## 73. Expanded Question Bank Standard

Every question should contain these non-code fields:

- Question ID.
- Class or engineering category.
- Subject or language.
- Chapter.
- Topic.
- Subtopic.
- Difficulty.
- Question type.
- Estimated time.
- Points.
- Negative marking rule if any.
- Correct answer.
- Explanation.
- Hint 1.
- Hint 2.
- Hint 3.
- YouTube link.
- Video language.
- Solution quality rating.
- Concept tags.
- Common mistake tags.
- Created by.
- Reviewed by.
- Last reviewed date.
- Safe for competition flag.
- Practice-only flag.
- Match-eligible flag.
- Event-eligible flag.

### 73.1 Difficulty Levels

Use:

- Very Easy.
- Easy.
- Medium.
- Hard.
- Very Hard.
- Olympiad.
- Interview.
- Event Final.

### 73.2 Question Quality Rules

Good questions should:

- Test understanding, not memorization only.
- Have clear wording.
- Avoid ambiguity.
- Have one correct answer unless multiple-select.
- Include explanation.
- Include video help.
- Map to exact topic.
- Have tested difficulty.
- Be reviewed before publishing.

---

## 74. Expanded Points, Level, And Streak MCP

### 74.1 Points Categories

Points should be divided into:

- Learning XP.
- Practice points.
- Test points.
- Match points.
- Community reputation.
- Event points.
- Badge points.

Do not mix money with points.

### 74.2 Level Rules

Level should measure learning progress.

Level should consider:

- Total XP.
- Accuracy.
- Topic mastery.
- Test completion.
- Minimum unique questions.
- No suspicious behavior.

Level should not be farmed by repeating one easy question.

### 74.3 Streak Rules

A streak should count only if:

- User completes a real learning activity.
- User earns minimum daily XP.
- User does not only open the app.
- User does not only watch a video without attempt.

Streak break recovery:

- Earn streak freeze through study.
- Use limited freeze.
- Premium may get extra freeze, but not unlimited.

### 74.4 Badge Ideas

Badges:

- First Step.
- 7 Day Streak.
- 30 Day Streak.
- Math Warrior.
- Science Explorer.
- C Beginner.
- C Problem Solver.
- Debug Master.
- No Hint Solver.
- Fast Thinker.
- Community Helper.
- Event Participant.
- Event Winner.
- Board Ready.
- Placement Ready.

---

## 75. Expanded Matchmaking MCP

### 75.1 Matching Inputs

The matching engine should use:

- Class.
- Stream.
- Subject.
- Chapter.
- Topic.
- Level.
- Accuracy.
- Recent match results.
- Speed.
- Language preference.
- Region/time availability if needed.
- Device integrity.
- Account trust score.

### 75.2 Level Window

Suggested rules:

- Level 10 can match Level 9, 10, or 11.
- Level 20 can match Level 18 to 22.
- Beginner levels should have tighter matching.
- Advanced levels can have wider matching if queue is small.

### 75.3 Queue Types

Queues:

- Class 9 Mathematics queue.
- Class 9 Science queue.
- Class 10 Mathematics queue.
- Class 10 Science queue.
- Class 11 Physics queue.
- Class 12 Chemistry queue.
- C language queue.
- Python queue.
- DSA queue.
- Event queue.

### 75.4 Match Room States

Room states:

- Searching.
- Opponent found.
- Ready check.
- Rules screen.
- Starting countdown.
- Active question.
- Answer submitted.
- Waiting for opponent.
- Round result.
- Final result.
- Review pending.
- Completed.
- Cancelled.

### 75.5 Match Rewards

Safe rewards:

- XP.
- Rank points.
- Badge progress.
- Leaderboard placement.
- Certificate eligibility.
- Sponsor prize eligibility if event-approved.

Unsafe rewards:

- User-funded cash payout.
- Stake-to-win.
- Deposit-to-earn.
- 1.7x monetary return.

---

## 76. Expanded Event Portal MCP

### 76.1 Event Creation Flow

Organizer should enter:

- Event name.
- Institution name.
- Organizer contact.
- Event category.
- Eligible class/year/branch.
- Subject or language.
- Date.
- Start time.
- Duration.
- Registration deadline.
- Participant limit.
- Team size.
- Rules.
- Safe browser requirement.
- Question source.
- Prize source.
- Certificate template.
- Result visibility.
- Dispute policy.

### 76.2 Event Types

Event types:

- School quiz.
- Class-specific challenge.
- C programming competition.
- Python sprint.
- DSA contest.
- Debugging challenge.
- Web development challenge.
- SQL challenge.
- AI quiz.
- Science olympiad practice.
- Math battle.
- Hackathon.
- Aptitude test.
- Placement mock test.

### 76.3 Event Registration Form

Form fields:

- Full name.
- Email.
- Phone.
- College/school.
- Class/year.
- Branch/stream.
- Roll number.
- ID proof upload if required.
- Team name if team event.
- Consent checkbox.
- Rules acceptance.

### 76.4 Event Monitoring

Organizer dashboard should show:

- Registered students.
- Checked-in students.
- Active participants.
- Completed participants.
- Disconnected participants.
- Suspicious activity flags.
- Live leaderboard.
- Question difficulty analytics.
- Average score.
- Time remaining.
- Support requests.

### 76.5 Event Result Review

Before publishing result:

- Check suspicious activity.
- Check duplicate accounts.
- Check impossible speed.
- Check answer similarity.
- Check device logs.
- Check disconnections.
- Apply dispute rules.
- Lock final leaderboard.
- Generate certificates.

---

## 77. Expanded Safe Browser MCP

### 77.1 Safe Browser Levels

Use three levels:

| Level | Name | Use |
|---|---|---|
| 1 | Normal Integrity | Practice and normal tests |
| 2 | Strict Web Test | Timed tests and low-stakes competitions |
| 3 | Safe Browser Competition | College/institution official event |

### 77.2 Level 1 Controls

- Focus loss warning.
- Copy/paste logging.
- Randomized questions.
- Server timer.
- Answer audit.

### 77.3 Level 2 Controls

- Fullscreen prompt.
- Tab switch detection.
- Paste blocking.
- Right-click blocking where useful.
- DevTools warning where detectable.
- Question randomization.
- Server-side submission rules.
- Suspicious behavior scoring.

### 77.4 Level 3 Controls

- Safe Exam Browser or approved secure client.
- Start URL restriction.
- URL allowlist.
- Exam key validation where supported.
- Device check.
- Identity check.
- Strong audit logs.
- Manual review.

### 77.5 Safe Browser User Experience

Before starting:

- Show system requirements.
- Show rules.
- Show sample check.
- Show internet stability warning.
- Show support contact.

During competition:

- No distractions.
- Clear timer.
- Clear progress.
- Clear submit button.
- Auto-save answers.
- Reconnect support if allowed.

After competition:

- Show submission confirmation.
- Show result release time.
- Show dispute process.

---

## 78. Anti-Cheat Signal Taxonomy

The platform should track signals, not instantly punish every signal.

### 78.1 Low-Risk Signals

- One focus loss.
- One slow answer.
- One reload.
- One network disconnect.

### 78.2 Medium-Risk Signals

- Multiple focus losses.
- Repeated paste attempts.
- Very similar answer timing.
- Many answer changes after long inactivity.
- Frequent reconnects.

### 78.3 High-Risk Signals

- Multiple accounts on same device in same event.
- Impossible answer speed.
- Identical wrong-answer patterns across users.
- Known leaked question usage.
- Safe browser validation failure.
- Tampered request.

### 78.4 Review Outcomes

- No action.
- Warning.
- Score hold.
- Manual review.
- Disqualification from event.
- Account restriction.
- Organizer notification.

Every serious action should have audit logs and appeal/dispute process.

---

## 79. Expanded Community MCP

### 79.1 Community Folder Structure

Community should have separate folders for:

- Class 9.
- Class 10.
- Class 11.
- Class 12.
- Engineering.
- Events.
- Announcements.
- Doubts.
- Mentors.
- Moderation.

Inside Class 9 community:

- Mathematics.
- Science.
- Social Science.
- English.
- Hindi.
- Computer Applications.

Inside Engineering community:

- C.
- C Plus Plus.
- Java.
- Python.
- JavaScript.
- TypeScript.
- SQL.
- DSA.
- Web Development.
- Placement.

### 79.2 Community Post Types

Post types:

- Doubt.
- Explanation.
- Resource.
- Poll.
- Announcement.
- Event update.
- Match discussion.
- Project showcase.
- Bug report.
- Feedback.

### 79.3 Community Safety

Rules:

- No abusive language.
- No leaked answers.
- No cheating help.
- No spam links.
- No gambling promotion.
- No personal data sharing.
- No harassment.
- No fake mentor claims.

Moderation tools:

- Report.
- Hide.
- Lock.
- Delete.
- Warn.
- Ban.
- Escalate.
- Auto-detect spam.

---

## 80. Expanded Dashboard MCP

Dashboard should adapt to user type.

### 80.1 Student Dashboard

Widgets:

- Continue learning.
- Today's goal.
- Current level.
- XP to next level.
- Streak calendar.
- Weak topics.
- Upcoming test.
- Upcoming event.
- Match unlock status.
- Recent community replies.
- Certificates.
- Subscription status.
- Learning credit balance.

### 80.2 Parent Dashboard

Widgets:

- Child activity.
- Time spent.
- Topics completed.
- Test scores.
- Streak.
- Weak areas.
- Payment history.
- Safety settings.
- Allowed competition settings.

### 80.3 Teacher Dashboard

Widgets:

- Assigned students.
- Class progress.
- Weak chapters.
- Test performance.
- Doubt queue.
- Content review.
- Assignment creator.

### 80.4 Organizer Dashboard

Widgets:

- Active events.
- Registrations.
- Check-ins.
- Live leaderboard.
- Suspicious flags.
- Certificates.
- Reports.

### 80.5 Admin Dashboard

Widgets:

- Users.
- Revenue.
- Events.
- Content review.
- Reports.
- Fraud flags.
- Payment issues.
- Community moderation.
- System health.

---

## 81. Expanded Admin MCP

Admin panel should include:

- User management.
- Role management.
- Content management.
- Question management.
- Video link management.
- Test management.
- Event management.
- Community moderation.
- Payment management.
- Subscription management.
- Credit management.
- Fraud review.
- Safe browser settings.
- Certificate templates.
- Notification templates.
- Analytics.
- System settings.

Admin safety rules:

- Every admin action should be logged.
- Sensitive actions need step-up authentication.
- Finance actions need separate permission.
- Content publish should require review.
- Event final result should require approval.
- User deletion should follow retention policy.

---

## 82. Expanded Modern Technology Stack

### 82.1 Recommended Main Stack

Use:

- Next.js App Router.
- React.
- TypeScript.
- Node.js Active LTS.
- PostgreSQL.
- Redis or Valkey.
- Tailwind CSS.
- shadcn/ui.
- Radix UI primitives.
- lucide-react icons.
- Framer Motion.
- Rive or Lottie.
- Playwright.
- Vitest.
- Prisma or Drizzle.
- Zod.
- TanStack Query.
- Zustand.
- Sentry.
- OpenTelemetry.
- GitHub Actions.

### 82.2 Backend Framework Choice

Option A: NestJS.

Best for:

- Large modular backend.
- Clear service architecture.
- Enterprise-style organization.
- Many developers.

Option B: Fastify.

Best for:

- Lightweight APIs.
- High performance.
- Simple service structure.

Recommendation:

- Use NestJS if the platform will become very large.
- Use Fastify if building fast MVP with smaller team.
- Use TypeScript and Node.js for the main implementation.

### 82.3 Database Choice

Use PostgreSQL because:

- Strong relational data.
- Good for users, classes, subjects, questions, tests, payments, events.
- Supports JSONB for flexible metadata.
- Supports indexing.
- Mature and reliable.

Use Redis/Valkey because:

- Realtime leaderboards.
- Match queues.
- Rate limits.
- Temporary sessions.
- Fast counters.

### 82.4 Search Choice

MVP:

- PostgreSQL full-text search.

Scale:

- Meilisearch for easy content search.
- OpenSearch for large analytics/search.

### 82.5 Realtime Choice

Use WebSockets for:

- Match room updates.
- Live leaderboard.
- Event monitoring.
- Notifications.

Fallback:

- Server-sent events for simple live updates.
- Polling for low-priority dashboard updates.

---

## 83. Conceptual Database MCP

### 83.1 User Tables

User data groups:

- Auth identity.
- Student profile.
- Parent profile.
- Teacher profile.
- Organizer profile.
- Admin role.
- Device records.
- Session records.

### 83.2 Learning Tables

Learning data groups:

- Program.
- Class.
- Stream.
- Subject.
- Chapter.
- Topic.
- Subtopic.
- Lesson.
- Learning path.
- Day plan.

### 83.3 Question Tables

Question data groups:

- Question.
- Options.
- Correct answer.
- Explanation.
- Hints.
- YouTube links.
- Difficulty.
- Tags.
- Review status.

### 83.4 Progress Tables

Progress data groups:

- Lesson progress.
- Topic mastery.
- Points transactions.
- Level history.
- Streak records.
- Badge awards.
- Mistake notebook.

### 83.5 Test And Match Tables

Data groups:

- Test.
- Test attempt.
- Answer submission.
- Match room.
- Match participant.
- Match question.
- Match result.
- Anti-cheat signal.

### 83.6 Events Tables

Data groups:

- Event.
- Organizer.
- Registration.
- Event participant.
- Event question pool.
- Event attempt.
- Event leaderboard.
- Certificate.
- Dispute.

### 83.7 Finance Tables

Data groups:

- Payment order.
- Payment transaction.
- Subscription.
- Invoice.
- Learning credit ledger.
- Refund.
- Sponsor prize record.

Important:

- Use ledger-style records for credits.
- Never directly overwrite balances without transaction history.

---

## 84. Conceptual API MCP Without Code

API groups:

- Auth APIs.
- Profile APIs.
- Curriculum APIs.
- Lesson APIs.
- Question APIs.
- Test APIs.
- Progress APIs.
- Level APIs.
- Streak APIs.
- Match APIs.
- Event APIs.
- Community APIs.
- Payment APIs.
- Subscription APIs.
- Admin APIs.
- Organizer APIs.
- Notification APIs.
- Search APIs.

API rules:

- Every write action validates user role.
- Every payment webhook verifies provider signature.
- Every match submission uses server time.
- Every competition action is audit logged.
- Every admin action is audit logged.
- Every API should return clear errors.

---

## 85. Content Operations MCP

### 85.1 Content Creation Workflow

Workflow:

1. Content creator drafts lesson.
2. Subject expert reviews.
3. Editor checks language.
4. Video link is attached.
5. Question difficulty is tagged.
6. Test reviewer verifies answer.
7. Admin publishes.
8. Student feedback is monitored.
9. Content is updated when needed.

### 85.2 Review States

States:

- Draft.
- Needs review.
- Review in progress.
- Changes requested.
- Approved.
- Published.
- Archived.

### 85.3 Content Quality Metrics

Track:

- Incorrect report count.
- Skip rate.
- Average time.
- Wrong answer percentage.
- Hint usage.
- Video click rate.
- Student rating.
- Teacher rating.

---

## 86. AI Tutor MCP

AI should be useful but controlled.

### 86.1 Allowed AI Uses

- Explain mistakes.
- Generate practice variations for review.
- Summarize chapters.
- Suggest revision.
- Explain code errors.
- Recommend videos.
- Create teacher drafts.

### 86.2 Restricted AI Uses

- Do not reveal live competition answers.
- Do not auto-publish unreviewed questions.
- Do not give medical/legal/financial advice to students.
- Do not encourage gambling or quick money.
- Do not store private student data inside prompts without policy.

### 86.3 AI Safety

AI responses should:

- Be age-appropriate.
- Be simple.
- Be factual.
- Encourage learning.
- Admit uncertainty.
- Link to reviewed content when possible.

---

## 87. Design System MCP

### 87.1 Design Personality

The design should feel:

- Clean.
- Focused.
- Youthful.
- Trustworthy.
- Fast.
- Minimal.
- Energetic only where needed.

### 87.2 Colors

Use a balanced palette:

- White or near-white backgrounds.
- Dark readable text.
- One primary brand color.
- One success color.
- One warning color.
- One error color.
- Neutral borders.

Avoid:

- Too much purple gradient.
- Too much dark blue.
- Too much beige.
- Too much decorative background.
- Too many cards inside cards.

### 87.3 Components

Components:

- Buttons.
- Icon buttons.
- Tabs.
- Segmented controls.
- Progress bars.
- Streak calendar.
- Level badge.
- Question card.
- Lesson stepper.
- Match room panel.
- Event status panel.
- Leaderboard.
- Community thread.
- Admin table.
- Modal.
- Toast.
- Tooltip.

### 87.4 Accessibility

Design should support:

- Keyboard navigation.
- Screen reader labels.
- Captions.
- High contrast.
- Reduced motion.
- Mute sound.
- Clear focus ring.

---

## 88. Sound System MCP

Sound events:

- Correct answer.
- Wrong answer.
- Hint revealed.
- Level up.
- Streak continued.
- Match found.
- Match start.
- Match win.
- Match lose.
- Event start.
- Timer warning.
- Certificate unlocked.

Rules:

- Sound should be short.
- Sound should be optional.
- Mute should be easy.
- No sound during classroom mode if disabled.
- Visual feedback should always exist.

---

## 89. Printable Folder MCP

The user mentioned printed/printable material. The platform should include a `printables` folder.

Printable categories:

- Worksheets.
- Formula sheets.
- Revision sheets.
- Practice tests.
- Answer keys.
- Certificates.
- Parent reports.
- Event reports.
- Attendance sheets.
- Hall tickets.

Printable rules:

- Clean layout.
- Print-friendly colors.
- Page numbers.
- Student name where needed.
- QR verification for certificates.
- No unnecessary background graphics.

---

## 90. Acceptance Criteria For MVP

MVP is complete only when:

- Home page exists.
- Sign in exists.
- Sign up exists.
- Dashboard exists.
- Class 9 folder structure exists.
- Class 10 folder structure exists.
- Engineering C language path exists.
- At least one 30-day C plan is represented.
- Lesson flow exists conceptually.
- Question system supports points.
- Level system works conceptually.
- Streak system works conceptually.
- YouTube links are supported under questions.
- Basic test flow exists.
- Basic community exists.
- Admin can manage content.
- The approved TypeScript and Node.js direction is used.
- Markdown planning file contains no implementation code.
- Money game features are not implemented illegally.

---

## 91. Acceptance Criteria For Full Product

Full product is complete when:

- All class sections are live.
- Every subject has folders and content.
- Engineering languages have roadmaps.
- Questions have explanations and YouTube links.
- Points, levels, streaks, badges work.
- Matching works for eligible users.
- Event portal works for institutions.
- Safe browser competition mode works.
- Community is moderated.
- Subscription works.
- Learning credits are compliant and non-withdrawable.
- Admin tools are complete.
- Organizer reports are complete.
- Certificates are verifiable.
- Analytics are useful.
- Performance is fast.
- Security is tested.
- Accessibility is tested.

---

## 92. What Must Not Be Missed

Non-negotiable items from the original request:

- Home page.
- Class 9 page.
- Class 10 page.
- Class 11 page.
- Class 12 page.
- Engineering page.
- Dashboard page.
- Test page.
- Sign in page.
- Sign up page.
- Community page.
- Separate folder for frontend.
- Separate folder for backend.
- Separate folder for printables.
- Separate folder for Class 9.
- Separate folder for Class 10.
- Separate folder for Class 11.
- Separate folder for Class 12.
- Separate folder for Engineering.
- Separate folder for Dashboard.
- Separate folder for Test.
- Separate folder for Sign In.
- Separate folder for Sign Up.
- Separate subject folders.
- Separate engineering language folders.
- Comments in every future file.
- README in every future folder.
- 30-day language plan support.
- Day-wise topic/subtopic learning.
- Questions after teaching.
- Points based on question type.
- Level system.
- Streak system.
- BGMI-inspired progression feel.
- Animations.
- Simulations.
- Copy-paste restriction in competition.
- Event organizing portal.
- Safe browser competition mode.
- Minimal UI.
- Level 10 unlock logic.
- Ad-supported option.
- ₹200 premium option concept.
- ₹100 learning pack concept as safe non-withdrawable credits.
- Matching by class, subject, chapter, topic, and level.
- Daily cap concept for paid access, but not for illegal staking.
- Correct and wrong answer sounds.
- Community folders for classes and engineering languages.
- YouTube links under every problem.
- Modern technologies.
- Approved TypeScript and Node.js direction.
- English Markdown file.
- No implementation code inside the Markdown file.

---

## 93. Updated Reference Notes For Compliance And Technology

Important source-backed notes:

- Next.js App Router is suitable for modern React web apps and supports file-system routing, layouts, route handlers, TypeScript, and deployment workflows.
- React with TypeScript is a strong choice for typed UI development.
- Node.js production apps should use Active LTS or Maintenance LTS releases.
- PostgreSQL is suitable for structured relational data and flexible JSONB metadata.
- Redis sorted sets are suitable for realtime leaderboards and rankings.
- WebAuthn/passkeys are suitable for stronger authentication.
- Safe Exam Browser is designed to temporarily turn a computer into a secure workstation for e-assessment.
- Razorpay UPI documentation notes that UPI Collect flow is deprecated effective 28 February 2026 under NPCI guidelines.
- Government of India/PIB material states that the Online Gaming Act framework prohibits online money games and creates a regulator/classification framework for permissible e-sports/social games.

Extra references:

- Government of India PIB on Online Gaming Act: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241804&lang=1&reg=6
- Government of India PIB on Online Gaming Rules 2026: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2254606&lang=1&reg=3
- Promotion and Regulation of Online Gaming Act PDF: https://www.meity.gov.in/static/uploads/2025/10/8a7f103cefc68ed8aaa2ebc9a2ed7c13.pdf

---

## 94. Final Product Direction

The best version of this platform is not a betting app. It is a serious education platform with game-like motivation.

Build the platform around:

- Learning.
- Skill.
- Progress.
- Community.
- Events.
- Safe competitions.
- Certificates.
- Premium education.
- Sponsor-funded recognition.

Avoid building it around:

- Cash staking.
- Hidden betting.
- Addiction loops.
- Misleading wallet names.
- Quick-money promises.

Final product sentence:

This platform should help a student study every day, solve better questions, build real skills, compete fairly, join safe events, grow a visible learning profile, and feel proud of progress without confusion or legal risk.

---

## 95. Deep Expansion Version 3: Developer Handoff Blueprint

This section turns the product idea into a direct handoff blueprint for designers, developers, content creators, teachers, admins, and event organizers.

The purpose is to make sure nobody building the platform gets confused about:

- Which pages exist.
- Which folders exist.
- Which role owns which feature.
- Which content belongs to which class.
- Which engineering language should be prioritized.
- Which features are MVP.
- Which features are later phases.
- Which legal boundaries cannot be crossed.
- Which comments must be added in future source files.
- Which parts must be minimal and clean.

The platform should be built as a serious education product first, with gamified motivation second.

---

## 96. Full Page Inventory

### 96.1 Public Pages

Public pages are visible before login.

| Page | Purpose | Must Include |
|---|---|---|
| Home | Explain platform and help user start quickly | Class cards, engineering card, event preview, sign up CTA |
| Class 9 Overview | Show Class 9 subjects | Subject cards, sample questions, benefits |
| Class 10 Overview | Show Class 10 subjects | Board-focused subjects, sample tests |
| Class 11 Overview | Show streams | Science, Commerce, Humanities, subject selector |
| Class 12 Overview | Show board and career focus | Revision, mock tests, entrance bridge |
| Engineering Overview | Show coding and CS paths | Language cards, DSA, web, AI, placement |
| Events Public | Show public events | Upcoming competitions, registration rules |
| Pricing | Explain free, ads-supported, premium, credits | Clear, transparent pricing |
| Sign In | User login | Email, phone, passkey options |
| Sign Up | User registration | Class/stream/engineering onboarding |
| Terms | Legal terms | Usage, payments, competitions |
| Privacy | Data privacy | Student data, minors, proctoring consent |
| Help | Support | FAQs, contact, technical help |

### 96.2 Logged-In Student Pages

| Page | Purpose | Must Include |
|---|---|---|
| Dashboard | Personal learning center | Continue learning, level, streak, weak topics |
| Learn | All assigned learning paths | Class/subject/chapter cards |
| Lesson | Study one lesson | Theory, visual, question, points |
| Practice | Solve practice questions | Filters, difficulty, YouTube help |
| Test | Attempt tests | Timer, submit, result |
| Result | Review attempt | Score, mistakes, explanations |
| Streak | Show learning consistency | Calendar, intensity, freeze |
| Level | Show progress | Level ladder, next unlock |
| Badges | Achievements | Earned and locked badges |
| Match | Find opponent | Subject/chapter/topic/level matching |
| Match Room | Live battle | Questions, timer, score |
| Events | Join events | Registrations, rules, waiting room |
| Community | Ask/answer doubts | Class, subject, language rooms |
| Wallet/Credits | Manage learning credits | Non-withdrawable balance, transactions |
| Subscription | Premium plan | Plan, renewal, invoices |
| Certificates | Download certificates | QR verification |
| Profile | User profile | Class, subjects, preferences |
| Settings | Account settings | Security, notifications, privacy |

### 96.3 Organizer Pages

| Page | Purpose | Must Include |
|---|---|---|
| Organizer Dashboard | Event command center | Active events, registrations, reports |
| Create Event | Build competition | Event type, rules, schedule |
| Registration Builder | Create form | Fields, consent, eligibility |
| Question Pool | Select questions | Difficulty, topic, randomization |
| Safe Browser Settings | Configure lockdown | Start URL, browser requirement, checks |
| Live Monitor | Monitor event | Participants, flags, leaderboard |
| Result Review | Approve results | Suspicious flags, disputes |
| Certificates | Generate certificates | Templates, QR verification |
| Reports | Download analytics | CSV/PDF reports |

### 96.4 Admin Pages

| Page | Purpose | Must Include |
|---|---|---|
| Admin Dashboard | Platform overview | Users, revenue, events, alerts |
| User Management | Manage users | Search, roles, status |
| Content Management | Manage lessons | Draft, review, publish |
| Question Management | Manage question bank | Review, difficulty, videos |
| Event Management | Manage events | Approve, monitor, close |
| Community Moderation | Manage posts | Reports, bans, warnings |
| Payment Management | Manage payments | Orders, refunds, reconciliation |
| Subscription Management | Manage plans | Active, cancelled, failed |
| Credit Ledger | Manage credits | Non-withdrawable transactions |
| Fraud Review | Review suspicious activity | Flags, logs, actions |
| Certificate Management | Templates and verification | Issue, revoke, verify |
| Settings | Platform settings | Feature flags, rules |

---

## 97. Full Folder Blueprint Without Code

This is a conceptual folder blueprint. It is not implementation code.

### 97.1 Root-Level Folders

| Folder | Purpose | Required Documentation |
|---|---|---|
| frontend | All web UI pages and components | README explaining UI architecture |
| backend | All server-side APIs and business modules | README explaining backend modules |
| content | Educational content source and metadata | README explaining content standards |
| printables | Printable worksheets, reports, certificates | README explaining print rules |
| class-9 | Class 9 subject content | README explaining Class 9 structure |
| class-10 | Class 10 subject content | README explaining Class 10 structure |
| class-11 | Class 11 stream content | README explaining Class 11 structure |
| class-12 | Class 12 stream content | README explaining Class 12 structure |
| engineering | Engineering and coding paths | README explaining language folders |
| dashboard | Dashboard planning and widgets | README explaining dashboard areas |
| test | Test engine planning | README explaining test rules |
| auth | Sign in/sign up planning | README explaining auth flows |
| community | Community planning | README explaining community hierarchy |
| events | Event portal planning | README explaining event lifecycle |
| matching | Matchmaking planning | README explaining match rules |
| wallet-credits | Credits, subscription, reward planning | README explaining legal-safe model |
| safe-browser | Safe exam policies | README explaining competition security |
| admin | Admin panel planning | README explaining admin modules |
| docs | Product and technical documentation | README explaining document index |
| qa | QA checklists and acceptance criteria | README explaining testing approach |

### 97.2 Frontend Subfolders

| Subfolder | Purpose |
|---|---|
| pages-public | Public pages before login |
| pages-student | Student logged-in pages |
| pages-organizer | College/institution organizer pages |
| pages-admin | Admin pages |
| components-common | Shared UI components |
| components-learning | Lesson and question UI |
| components-test | Test UI |
| components-match | Match room UI |
| components-community | Community UI |
| components-events | Event UI |
| components-dashboard | Dashboard widgets |
| components-auth | Sign in and sign up UI |
| layouts | App layouts |
| navigation | Header, sidebar, mobile nav |
| design-system | Colors, typography, spacing rules |
| animations | UI animation assets |
| sounds | Correct/wrong/level/match sounds |
| accessibility | Accessibility helpers and notes |

### 97.3 Backend Subfolders

| Subfolder | Purpose |
|---|---|
| auth-service | Login, signup, sessions, passkeys |
| user-service | User profiles and roles |
| curriculum-service | Classes, subjects, chapters, topics |
| content-service | Lessons, theory, media |
| question-service | Question bank, options, hints, solutions |
| test-service | Tests, attempts, timers, results |
| scoring-service | Points and scoring logic |
| level-service | Level calculation |
| streak-service | Daily streak tracking |
| matching-service | Matchmaking and room lifecycle |
| realtime-service | WebSocket events |
| event-service | College competitions |
| organizer-service | Organizer portal |
| community-service | Posts, comments, reports |
| wallet-credit-service | Non-withdrawable learning credits |
| payment-service | Payment orders and reconciliation |
| subscription-service | Premium plans |
| safe-browser-service | Safe exam config and validation |
| anti-cheat-service | Integrity signals and fraud flags |
| notification-service | In-app, email, SMS/push later |
| certificate-service | Certificates and QR verification |
| admin-service | Admin actions |
| analytics-service | Product and learning analytics |
| audit-service | Logs for sensitive actions |

### 97.4 Content Subfolders

| Subfolder | Purpose |
|---|---|
| lessons | Theory and learning steps |
| questions | Practice and test questions |
| hints | Hint content |
| solutions | Explanation content |
| youtube-links | Verified support videos |
| diagrams | Diagram assets |
| simulations | Simulation planning and assets |
| worksheets | Printable practice |
| revision | Revision sheets |
| tests | Test definitions |
| certificates | Certificate wording and templates |

---

## 98. Class Subject Matrix

### 98.1 Class 9 Subject Matrix

| Subject | Main Use | Special Features |
|---|---|---|
| Mathematics | Concept and problem practice | Formula sheet, graph visuals, step solutions |
| Science | Physics, Chemistry, Biology basics | Simulations, diagrams, experiment videos |
| Social Science | History, geography, civics, economics | Maps, timelines, long answers |
| English | Grammar, literature, writing | Reading passages, writing practice |
| Hindi | Grammar and literature | Explanation videos, writing practice |
| Sanskrit | Grammar and translation | Vocabulary and sentence practice |
| Computer Applications | Computer basics | MCQ, practical concepts |
| Artificial Intelligence | Beginner AI awareness | Visual examples, activity tasks |
| General Knowledge | Awareness | Quiz mode |
| Olympiad Foundation | Advanced practice | Higher difficulty questions |

### 98.2 Class 10 Subject Matrix

| Subject | Main Use | Special Features |
|---|---|---|
| Mathematics Standard | Full board prep | Board-style questions, timed practice |
| Mathematics Basic | Basic board prep | Step-by-step guided practice |
| Science | Board science | Diagrams, numericals, assertion-reason |
| Social Science | Board social science | Map work, timeline, case questions |
| English | Board English | Literature, grammar, writing |
| Hindi | Board Hindi | Grammar, literature |
| Sanskrit | Optional language | Translation, grammar |
| Computer Applications | Coding/computer basics | Practical question support |
| Information Technology | Skill subject | Employability skills |
| Artificial Intelligence | Skill subject | AI basics and project ideas |

### 98.3 Class 11 Subject Matrix

| Stream | Subjects |
|---|---|
| Science PCM | Physics, Chemistry, Mathematics, English, Computer Science optional |
| Science PCB | Physics, Chemistry, Biology, English |
| Science PCMB | Physics, Chemistry, Mathematics, Biology, English |
| Commerce | Accountancy, Business Studies, Economics, English, Applied Mathematics optional |
| Humanities | History, Political Science, Geography, Psychology, Sociology, Economics, English |
| Skill Track | Entrepreneurship, Physical Education, Informatics Practices |

### 98.4 Class 12 Subject Matrix

| Stream | Subjects |
|---|---|
| Science PCM | Physics, Chemistry, Mathematics, English, Computer Science optional |
| Science PCB | Physics, Chemistry, Biology, English |
| Science PCMB | Physics, Chemistry, Mathematics, Biology, English |
| Commerce | Accountancy, Business Studies, Economics, English, Applied Mathematics optional |
| Humanities | History, Political Science, Geography, Psychology, Sociology, Economics, English |
| Career Bridge | JEE, NEET, CUET, placement foundation |

---

## 99. Engineering Skill Matrix

### 99.1 Programming Language Matrix

| Language | Priority | Best For | Initial Roadmap Length |
|---|---|---|---|
| C | Very High | Fundamentals and college syllabus | 30 days |
| Python | Very High | Beginners, AI, data | 30 to 45 days |
| Java | High | OOP, placements, backend | 45 days |
| C Plus Plus | High | DSA, competitive programming | 45 days |
| JavaScript | High | Web development | 30 days |
| TypeScript | High | Professional web apps | 30 days after JavaScript |
| SQL | High | Databases and analytics | 21 days |
| HTML | High | Web basics | 7 to 14 days |
| CSS | High | Web design | 14 to 21 days |
| Kotlin | Medium | Android | 30 days |
| Swift | Medium | iOS | 30 days |
| C Sharp | Medium | .NET and game dev | 30 days |
| Rust | Advanced | Systems and safety | 45 days |
| R | Medium | Statistics and data | 21 days |
| MATLAB | Medium | Engineering computation | 21 days |
| Bash | Medium | Automation and DevOps | 14 days |
| PowerShell | Medium | Windows automation | 14 days |
| Dart | Medium | Flutter apps | 30 days |

### 99.2 Engineering Non-Language Matrix

| Skill | Priority | Why |
|---|---|---|
| Data Structures And Algorithms | Very High | Placement and problem solving |
| Git And GitHub | Very High | Developer workflow |
| Web Development | Very High | Most practical project path |
| Database Systems | High | Backend and real projects |
| Operating Systems | High | CS fundamentals |
| Computer Networks | High | CS fundamentals and interviews |
| DBMS | High | College and placements |
| System Design | Medium | Advanced interviews |
| Cloud Computing | Medium | Deployment and scale |
| DevOps | Medium | CI/CD and operations |
| Cybersecurity | Medium | Safety and career path |
| AI And Machine Learning | High | Modern career path |
| Data Science | High | Analytics and AI |
| Mobile App Development | Medium | Android/iOS apps |
| Competitive Programming | Medium | Advanced problem solving |
| Interview Preparation | Very High | Career outcomes |

---

## 100. Detailed C Language Learning Content MCP

### 100.1 C Language Module List

C Language should have these modules:

- Introduction.
- Environment setup.
- Program structure.
- Variables.
- Data types.
- Constants.
- Input/output.
- Operators.
- Conditions.
- Loops.
- Functions.
- Arrays.
- Strings.
- Pointers.
- Recursion.
- Structures.
- Unions.
- Enums.
- File handling.
- Dynamic memory.
- Preprocessor.
- Debugging.
- Searching.
- Sorting.
- Mini projects.
- Final certification.

### 100.2 C Language Question Categories

Question categories:

- Output prediction.
- Syntax correction.
- Concept MCQ.
- Fill in the blank.
- Code tracing.
- Debugging.
- Small coding problem.
- Pattern problem.
- Array problem.
- String problem.
- Pointer tracing.
- Function writing.
- File task.
- Mini project task.

### 100.3 C Language YouTube Help Policy

For each C problem:

- Show video link after one attempt in practice mode.
- Hide video link during test mode until result.
- Hide video link during match mode until match ends.
- Store Hindi and English video options if possible.
- Prefer internally verified videos.

---

## 101. Question Delivery Logic

### 101.1 Practice Mode

Practice mode should:

- Allow hints.
- Show YouTube help after attempt.
- Give immediate feedback.
- Award normal points.
- Save mistakes.
- Recommend similar questions.

### 101.2 Test Mode

Test mode should:

- Hide hints unless test allows them.
- Hide YouTube links until submission.
- Use timer.
- Submit server-side.
- Show result after completion.
- Save attempt history.

### 101.3 Match Mode

Match mode should:

- Hide hints.
- Hide YouTube links.
- Use same difficulty question set.
- Use realtime scoring.
- Use anti-cheat logs.
- Show final explanations only after match.

### 101.4 Event Mode

Event mode should:

- Follow organizer rules.
- Use safe browser if required.
- Use server-side timer.
- Use randomized questions.
- Use audit logs.
- Show result only when organizer allows.

---

## 102. UI Screens For Learning Flow

### 102.1 Learning Path Screen

Must show:

- Current path name.
- Completion percentage.
- Day cards.
- Locked/unlocked state.
- Recommended next day.
- Estimated time.
- Points available.
- Certificate progress.

### 102.2 Lesson Screen

Must show:

- Topic title.
- Progress stepper.
- Theory.
- Visual/simulation.
- Question area.
- Hint button.
- YouTube help area.
- Points earned.
- Next button.

### 102.3 Question Screen

Must show:

- Question text.
- Difficulty.
- Points.
- Timer if needed.
- Answer input.
- Submit button.
- Feedback.
- Explanation.
- YouTube link when allowed.

### 102.4 Result Screen

Must show:

- Score.
- Accuracy.
- Time.
- Points earned.
- Mistakes.
- Correct answers.
- Explanation links.
- Recommended revision.
- Next action.

---

## 103. Dashboard Widget Detail

### 103.1 Continue Learning Widget

Shows:

- Current subject/language.
- Current chapter/day.
- Next lesson.
- Completion percentage.
- Start button.

### 103.2 Level Widget

Shows:

- Current level.
- XP bar.
- XP needed.
- Next unlock.
- Recent XP sources.

### 103.3 Streak Widget

Shows:

- Current streak.
- Longest streak.
- Today complete or pending.
- Calendar heatmap.
- Streak freeze status.

### 103.4 Weak Topic Widget

Shows:

- Weak topics.
- Mistake count.
- Recommended practice.
- Revision button.

### 103.5 Match Unlock Widget

Shows:

- Current eligibility.
- Level requirement.
- Trust requirement.
- Practice suggestion.

### 103.6 Event Widget

Shows:

- Registered events.
- Upcoming events.
- Event status.
- Join button when available.

---

## 104. Role And Permission Matrix

| Role | Can Learn | Can Test | Can Match | Can Organize Event | Can Moderate | Can Manage Payments | Can Publish Content |
|---|---|---|---|---|---|---|---|
| Guest | Limited preview | No | No | No | No | No | No |
| Student | Yes | Yes | After unlock | No | No | Own only | No |
| Parent | View child | View reports | No | No | No | Child payments | No |
| Teacher | Yes | Create assignments | No | Limited | Limited | No | Draft only |
| Mentor | Yes | Yes | Optional | No | Limited | No | Draft/review |
| Organizer | No | Event tests | No | Yes | Event only | Event billing | Event content only |
| Moderator | No | No | No | No | Yes | No | No |
| Content Admin | Yes | Yes | No | No | No | No | Yes |
| Finance Admin | No | No | No | No | No | Yes | No |
| Super Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes |

---

## 105. Notification Matrix

| Trigger | Student | Parent | Teacher | Organizer | Admin |
|---|---|---|---|---|---|
| Streak pending | Yes | Optional | No | No | No |
| Level up | Yes | Optional | No | No | No |
| Test completed | Yes | Optional | Optional | Event only | No |
| Event registration | Yes | No | No | Yes | Optional |
| Suspicious event flag | No | No | No | Yes | Yes |
| Payment success | Yes | Optional | No | Organizer billing | Finance admin |
| Community reply | Yes | No | Optional | No | No |
| Content report | No | No | No | No | Content admin |

---

## 106. Event Package Ideas

### 106.1 Starter Event Package

For small colleges or schools:

- Up to 100 participants.
- Registration form.
- Basic quiz/test.
- Basic leaderboard.
- Certificates.
- Basic report.

### 106.2 Pro Event Package

For larger competitions:

- Up to 1000 participants.
- Safe browser option.
- Live monitoring.
- Custom branding.
- Advanced analytics.
- Fraud review.
- Certificate QR verification.

### 106.3 Enterprise Event Package

For universities or large institutions:

- Multiple rounds.
- Multiple organizers.
- Department-wise reports.
- Advanced safe browser policies.
- Dedicated support.
- Sponsor integration.
- Custom certificate templates.

---

## 107. Competition Round Types

Competition can have:

- Registration round.
- Practice round.
- Qualification round.
- Main round.
- Final round.
- Tie-breaker round.
- Viva/interview round for project events.
- Manual review round.

Round rules should define:

- Start time.
- End time.
- Question count.
- Difficulty mix.
- Negative marking.
- Safe browser requirement.
- Result visibility.
- Tie-breaker.

---

## 108. Leaderboard MCP

Leaderboards should exist for:

- Daily XP.
- Weekly XP.
- Monthly XP.
- Class-wise learning.
- Subject-wise learning.
- Engineering language-wise learning.
- Match rank.
- Event rank.
- Community helpfulness.

Leaderboard safety:

- Hide full names by default.
- Use display names.
- Allow privacy settings.
- Remove suspicious scores.
- Do not rank minors in harmful ways.
- Do not show cash-like rewards as leaderboard bait.

---

## 109. Certificate System Detail

Certificate types:

- Course completion.
- Language completion.
- Subject mastery.
- Event participation.
- Event winner.
- Community mentor.
- Teacher workshop.

Certificate fields:

- Certificate ID.
- Student name.
- Course/event name.
- Issued date.
- Issuer.
- Score or rank if allowed.
- QR verification.
- Signature image if approved.
- Organizer logo.

Certificate lifecycle:

- Draft.
- Generated.
- Issued.
- Verified.
- Revoked if fraud confirmed.

---

## 110. Parent Safety Controls

Parent controls should include:

- View child's progress.
- Control paid purchases.
- Disable match mode.
- Disable community posting.
- Set daily study reminders.
- Set spending limit.
- View event participation.
- Approve safe browser events if minor.

---

## 111. Teacher Tools

Teacher tools should include:

- Create class group.
- Assign chapter.
- Assign test.
- View progress.
- Review weak topics.
- Answer doubts.
- Recommend videos.
- Create custom worksheet.
- Export report.

---

## 112. Content Personalization Rules

The recommendation engine should consider:

- User class.
- Subject selection.
- Chapter progress.
- Accuracy.
- Time spent.
- Mistake tags.
- Hint usage.
- Test history.
- Streak pattern.
- Upcoming exams.
- Event participation.

Recommendations should include:

- Next lesson.
- Revision topic.
- Easier question.
- Harder question.
- YouTube video.
- Practice test.
- Community discussion.

---

## 113. Mistake Notebook MCP

Every learner should have a mistake notebook.

It should store:

- Question.
- User answer.
- Correct answer.
- Mistake type.
- Explanation.
- Related topic.
- YouTube help.
- Retry date.
- Mastered status.

Mistake types:

- Concept gap.
- Formula mistake.
- Calculation mistake.
- Syntax mistake.
- Reading mistake.
- Time pressure mistake.
- Guessing.

---

## 114. Revision System MCP

Revision system should include:

- Daily revision.
- Weekly revision.
- Monthly revision.
- Exam revision.
- Mistake-based revision.
- Weak-topic revision.
- Flashcards.
- Formula sheets.
- Mini quizzes.

Revision should be automatically generated from:

- Mistakes.
- Low accuracy topics.
- Old completed topics.
- Upcoming tests.

---

## 115. Project-Based Learning MCP

Engineering learners should build projects.

Project categories:

- C mini projects.
- Python mini projects.
- Web mini projects.
- Database mini projects.
- AI beginner projects.
- Data analysis projects.
- Portfolio projects.

Each project should include:

- Goal.
- Skills learned.
- Requirements.
- Milestones.
- Evaluation rubric.
- Submission.
- Feedback.
- Certificate/badge.

---

## 116. Placement Preparation MCP

Engineering placement section should include:

- DSA roadmap.
- Aptitude.
- Reasoning.
- Verbal ability.
- DBMS.
- OS.
- CN.
- OOP.
- SQL.
- HR questions.
- Resume builder.
- Mock interview.
- Coding contest.

Placement readiness score:

- DSA accuracy.
- Core CS score.
- Project count.
- Mock test score.
- Interview practice.

---

## 117. AI And Simulation Feature Ideas

Future advanced features:

- AI doubt solver.
- AI hint generator.
- AI mistake explainer.
- AI revision planner.
- AI teacher assistant.
- AI event report summary.
- Physics motion simulator.
- Chemistry reaction simulator.
- Biology cell explorer.
- Math graph visualizer.
- Pointer memory visualizer.
- Sorting animation.
- Recursion call-stack animation.
- Network packet simulator.
- SQL query visualizer.

AI should support learning, not replace real practice.

---

## 118. Security And Privacy Checklist

Security checklist:

- Secure auth.
- Strong password policy if passwords are used.
- OTP rate limiting.
- Session expiration.
- Device management.
- Role permissions.
- Payment signature verification.
- Admin action audit.
- Input validation.
- Upload scanning.
- Rate limits.
- Secure headers.
- Data encryption where needed.
- Backup policy.
- Incident response plan.

Privacy checklist:

- Clear privacy policy.
- Parent consent for minors.
- Proctoring consent.
- Minimal data collection.
- Data deletion process.
- Safe display names.
- No public personal information.

---

## 119. QA Test Plan

### 119.1 Functional QA

Test:

- Signup.
- Signin.
- Class selection.
- Lesson start.
- Question submit.
- Points award.
- Level update.
- Streak update.
- YouTube link visibility.
- Test attempt.
- Result review.
- Community post.
- Event registration.
- Payment success.
- Subscription status.

### 119.2 Competition QA

Test:

- Safe browser start.
- Timer.
- Randomization.
- Focus loss.
- Paste attempt.
- Submission.
- Leaderboard.
- Result review.
- Certificate.

### 119.3 Mobile QA

Test:

- Small screen layout.
- Touch targets.
- Navigation.
- Lesson readability.
- Test UI.
- Dashboard widgets.
- Community posting.

### 119.4 Accessibility QA

Test:

- Keyboard usage.
- Screen reader labels.
- Color contrast.
- Focus states.
- Reduced motion.
- Captions.
- Mute sound.

---

## 120. Launch Roadmap

### 120.1 Month 1

Focus:

- Finalize brand.
- Finalize UI design.
- Build auth.
- Build dashboard skeleton.
- Build curriculum structure.
- Build Class 9 and Class 10 sample content.
- Build C language 30-day structure.

### 120.2 Month 2

Focus:

- Build lesson flow.
- Build question system.
- Build points and levels.
- Build streak.
- Add YouTube help.
- Add basic tests.
- Add admin content manager.

### 120.3 Month 3

Focus:

- Expand content.
- Add community.
- Add subscriptions.
- Add learning credits.
- Add certificates.
- Add basic analytics.

### 120.4 Month 4

Focus:

- Add events beta.
- Add organizer dashboard.
- Add event registration.
- Add live leaderboard.
- Add safe browser planning.

### 120.5 Month 5

Focus:

- Add matching beta.
- Add realtime match room.
- Add anti-cheat signals.
- Add event reports.
- Improve mobile.

### 120.6 Month 6

Focus:

- Public launch.
- Performance optimization.
- Security review.
- Content review.
- Institution outreach.
- Student feedback loop.

---

## 121. Developer Build Rules

Rules for developers:

- Use TypeScript and Node.js for the main implementation.
- Use TypeScript for main application.
- Keep folders separated.
- Add README to every folder.
- Add English comments to every future source file.
- Keep comments useful and beginner-friendly.
- Do not mix business logic with UI unnecessarily.
- Do not hardcode scoring rules everywhere.
- Do not implement hidden betting.
- Do not make credits withdrawable.
- Do not publish unreviewed content.
- Do not show YouTube help during live competition.
- Do not make UI confusing.

---

## 122. Designer Build Rules

Rules for designers:

- Keep first screen useful.
- Avoid marketing-heavy hero if user is logged in.
- Use clear action buttons.
- Use progress indicators.
- Make test mode distraction-free.
- Make event mode serious.
- Make community readable.
- Make mobile first.
- Keep text readable.
- Keep colors accessible.
- Do not overload students.

---

## 123. Content Team Rules

Rules for content team:

- Every topic must have clear theory.
- Every question must have correct answer.
- Every question must have explanation.
- Every question should have YouTube help link.
- Every video should be reviewed.
- Every chapter should have easy, medium, hard practice.
- Every test should have balanced difficulty.
- Every board class should include exam-style questions.
- Every engineering language should include projects.

---

## 124. Organizer Rules

Rules for event organizers:

- Create clear event rules.
- Do not promise illegal cash returns.
- Use sponsor-funded prizes only.
- Verify participant eligibility.
- Use safe browser for official competitions.
- Review suspicious flags.
- Publish results transparently.
- Provide support contact.
- Respect privacy.

---

## 125. Student Experience Rules

The student should always know:

- What to study next.
- How many points they earned.
- Why an answer is wrong.
- Which topic is weak.
- What level they are.
- How to improve.
- Where to watch explanation.
- When an event starts.
- What rules apply in competition.

Student should never feel:

- Lost.
- Overwhelmed.
- Tricked by money mechanics.
- Forced into confusing ads.
- Punished without explanation.

---

## 126. Final Extended Non-Negotiable Compliance Statement

The platform must not create a system where users deposit money, play a match, and receive more money from other users' deposits. That is the dangerous money-game pattern.

The platform can create:

- Learning subscription.
- Course access.
- Mock test fee.
- Certificate fee.
- Institution event hosting fee.
- Sponsor-funded prizes.
- Non-cash XP and badges.
- Non-withdrawable credits.

This keeps the platform safer, more trustworthy, and more buildable.

---

## 127. Final Expanded MVP Build Order

Build in this order:

1. Auth and onboarding.
2. Home and dashboard.
3. Curriculum structure.
4. Class 9 and Class 10 samples.
5. Engineering C 30-day plan.
6. Lesson flow.
7. Question flow.
8. Points.
9. Levels.
10. Streak.
11. YouTube help.
12. Test engine.
13. Admin content manager.
14. Community basic.
15. Premium subscription.
16. Learning credits.
17. Event portal beta.
18. Matching beta.
19. Safe browser integration.
20. AI tutor.

---

## 128. Final Expanded Summary

This MCP describes a large, modern, TypeScript-and-Node.js-based education platform for Indian students and engineering learners. It includes school classes, coding paths, tests, dashboards, events, safe competition mode, communities, levels, streaks, points, sounds, YouTube help, folder separation, comments, admin tools, organizer tools, modern technologies, and legal-safe monetization.

The correct direction is:

- Build clean.
- Build modular.
- Build legal.
- Build minimal UI.
- Build deep learning content.
- Build gamification carefully.
- Build events safely.
- Build matching as skill competition without illegal money mechanics.
- Build trust before scale.

The platform should become a place where students return daily because progress feels visible, learning feels structured, competition feels fair, and every next step is obvious.

---

## 129. Deep Expansion Version 4: Final No-Code Implementation Planning Appendix

This appendix adds another layer of detail for the final handoff. It is still not implementation code. It is a planning, ownership, architecture, and execution guide for building the website correctly.

The purpose of this appendix is to make the MCP more useful for:

- A founder explaining the product to a developer.
- A developer creating the folder structure.
- A designer creating screens.
- A content team creating lessons and questions.
- A college organizer planning competitions.
- An admin team reviewing safety and moderation.
- A future investor or partner understanding the product.

---

## 130. Product One-Line Definition

The platform is a modern Indian education and coding platform where school students and engineering learners follow structured learning paths, solve high-quality questions, earn XP, maintain streaks, level up, join safe competitions, participate in class-wise communities, and attend institution-hosted events with strong anti-cheat and legal-safe monetization.

---

## 131. Product Positioning

### 131.1 What This Platform Is

It is:

- A learning platform.
- A coding practice platform.
- A class-wise study platform.
- A safe event hosting platform.
- A student progress platform.
- A gamified education platform.
- A community-led doubt-solving platform.
- A college competition portal.

### 131.2 What This Platform Is Not

It is not:

- A gambling platform.
- A betting platform.
- A hidden real-money game.
- A random quiz website.
- A messy course folder.
- A landing page-only website.
- A copy of BGMI.
- A copy of LeetCode.
- A copy of GitHub.

It can be inspired by good mechanics from those products, but the final purpose must remain education.

---

## 132. Exact MVP Promise

The MVP should promise only this:

- Learn daily.
- Solve questions.
- Earn points.
- Build streak.
- Level up.
- Get help through YouTube links.
- Track progress.
- Join basic community.
- Attempt tests.
- Start one engineering language path.

The MVP should not promise:

- Cash earning.
- Full anti-cheat guarantee.
- Every class fully completed.
- Every engineering language fully completed.
- AI tutor perfection.
- National-level competitions from day one.

---

## 133. Exact Future Vision Promise

The full platform can promise:

- Class 9 to 12 complete learning.
- Engineering coding paths.
- AI-assisted learning.
- Safe college events.
- Realtime matching.
- Advanced analytics.
- Certificates.
- Parent and teacher dashboards.
- Organizer portals.
- Institution plans.
- Sponsor-funded prizes.

---

## 134. Route Planning MCP

This is conceptual route planning, not code.

### 134.1 Public Route Groups

Public route groups:

- Home.
- Classes.
- Engineering.
- Events.
- Pricing.
- Help.
- Legal.
- Auth.

### 134.2 Student Route Groups

Student route groups:

- Dashboard.
- Learn.
- Practice.
- Test.
- Match.
- Events.
- Community.
- Profile.
- Settings.
- Certificates.
- Subscription.
- Credits.

### 134.3 Organizer Route Groups

Organizer route groups:

- Organizer dashboard.
- Event creation.
- Registration forms.
- Question pools.
- Live monitoring.
- Result review.
- Certificates.
- Reports.
- Billing.

### 134.4 Admin Route Groups

Admin route groups:

- Admin dashboard.
- Users.
- Content.
- Questions.
- Tests.
- Events.
- Community.
- Finance.
- Fraud.
- Certificates.
- Analytics.
- Settings.

---

## 135. Feature Priority Ranking

### 135.1 Priority 0: Foundation

Must exist before anything serious:

- Authentication.
- User profiles.
- Role system.
- Class/subject structure.
- Engineering language structure.
- Dashboard skeleton.
- Admin skeleton.
- Database schema planning.
- Content review workflow.

### 135.2 Priority 1: Learning Core

Must exist for students:

- Lessons.
- Questions.
- Answers.
- Explanations.
- YouTube links.
- Points.
- Levels.
- Streaks.
- Results.
- Mistake notebook.

### 135.3 Priority 2: Engagement

Add after learning core:

- Badges.
- Leaderboards.
- Community.
- Daily missions.
- Weekly goals.
- Sound feedback.
- Simulations.
- Animations.

### 135.4 Priority 3: Events

Add after platform proves learning:

- Organizer portal.
- Event registration.
- Event test mode.
- Event leaderboard.
- Certificates.
- Event reports.

### 135.5 Priority 4: Matching

Add after enough users exist:

- Matchmaking queue.
- Match room.
- Realtime score.
- Match results.
- Rank points.
- Anti-cheat signals.

### 135.6 Priority 5: Advanced Systems

Add later:

- AI tutor.
- Parent dashboard.
- Teacher dashboard.
- Advanced safe browser.
- Sponsor prize system.
- Institution white-label.
- Mobile app.

---

## 136. Epic Backlog MCP

### 136.1 Epic: Authentication And Onboarding

Goal:

- Let users safely create accounts and choose their learning track.

Must include:

- Sign up.
- Sign in.
- Forgot password or OTP recovery.
- Class selection.
- Stream selection.
- Engineering skill selection.
- Subject selection.
- User role assignment.
- Parent consent planning for minors.

### 136.2 Epic: Curriculum System

Goal:

- Represent classes, subjects, chapters, topics, and subtopics clearly.

Must include:

- Class 9 structure.
- Class 10 structure.
- Class 11 structure.
- Class 12 structure.
- Engineering structure.
- Subject metadata.
- Chapter metadata.
- Topic metadata.
- Dependency mapping.

### 136.3 Epic: Lesson System

Goal:

- Teach one concept at a time.

Must include:

- Lesson introduction.
- Theory.
- Visual explanation.
- Practice question.
- Summary.
- Completion tracking.
- Next lesson unlock.

### 136.4 Epic: Question System

Goal:

- Deliver high-quality questions with explanations and video help.

Must include:

- MCQ.
- Short answer.
- Long answer.
- Numerical answer.
- Coding problem planning.
- Hints.
- Solutions.
- YouTube links.
- Difficulty.
- Points.
- Review status.

### 136.5 Epic: Progress System

Goal:

- Make learning progress visible and motivating.

Must include:

- Points.
- Levels.
- Streaks.
- Badges.
- Mastery.
- Mistake notebook.
- Revision suggestions.

### 136.6 Epic: Test System

Goal:

- Allow practice tests, chapter tests, mocks, and event tests.

Must include:

- Test creation.
- Timed attempt.
- Server-side submission.
- Result.
- Explanation.
- Retry policy.
- Performance analytics.

### 136.7 Epic: Community System

Goal:

- Allow safe student discussion.

Must include:

- Class rooms.
- Subject rooms.
- Engineering language rooms.
- Doubt posts.
- Answers.
- Reports.
- Moderation.
- Helpful answer reputation.

### 136.8 Epic: Event Portal

Goal:

- Let colleges and institutions run competitions.

Must include:

- Organizer account.
- Event creation.
- Registration form.
- Participant list.
- Event test.
- Safe browser option.
- Leaderboard.
- Certificates.
- Reports.

### 136.9 Epic: Matching System

Goal:

- Let eligible users compete with similar users.

Must include:

- Level 10 unlock.
- Same class/language matching.
- Subject/chapter/topic selection.
- Similar level range.
- Realtime room.
- Winner by points and time.
- No illegal cash staking.

### 136.10 Epic: Monetization

Goal:

- Make the platform sustainable without illegal money games.

Must include:

- Free plan.
- Ads-supported continuation.
- Premium plan around ₹200.
- Learning credit pack around ₹100.
- Institution event fee.
- Sponsor-funded prize support.
- Payment records.
- Refund policy.

---

## 137. Folder Ownership MCP

Each folder should have an owner role.

| Folder | Owner | Reviewer |
|---|---|---|
| frontend | Frontend lead | Product/design lead |
| backend | Backend lead | Tech lead |
| content | Content manager | Subject expert |
| class-9 | Class 9 content lead | Teacher reviewer |
| class-10 | Class 10 content lead | Teacher reviewer |
| class-11 | Class 11 content lead | Stream expert |
| class-12 | Class 12 content lead | Stream expert |
| engineering | Engineering mentor | Technical reviewer |
| test | Assessment lead | QA lead |
| events | Event manager | Operations lead |
| community | Community manager | Moderation lead |
| matching | Backend/realtime lead | Product lead |
| wallet-credits | Finance/product lead | Legal reviewer |
| safe-browser | Security lead | Event lead |
| admin | Internal tools lead | Super admin |
| docs | Product manager | Founder |
| qa | QA lead | Tech lead |

---

## 138. Naming Convention MCP

### 138.1 Folder Names

Folder names should be:

- Lowercase.
- Simple.
- Hyphen-separated.
- Clear.

Good examples:

- class-9.
- class-10.
- sign-in.
- sign-up.
- safe-browser.
- question-bank.
- c-language.
- data-structures.

Avoid:

- Random abbreviations.
- Mixed casing.
- Spaces in folder names.
- Unclear names.

### 138.2 Content Names

Content names should be:

- Human-readable.
- Class-specific.
- Chapter-specific.
- Topic-specific.

Example naming idea:

- Class 9 Mathematics Number Systems.
- C Language Day 1 Introduction.
- Class 10 Science Electricity Test.

### 138.3 Question IDs

Question IDs should identify:

- Class or engineering path.
- Subject/language.
- Chapter/topic.
- Difficulty.
- Sequence.

Question IDs should be stable. Do not change IDs after publishing unless migration is planned.

---

## 139. Comment Policy For Future Code Files

This Markdown file has no implementation code, but future source files must follow this comment policy.

### 139.1 Required Comments

Add comments for:

- File purpose.
- Complex business logic.
- Scoring decisions.
- Matchmaking rules.
- Anti-cheat rules.
- Payment/credit logic.
- Safe browser logic.
- Admin permission logic.
- Content publishing workflow.

### 139.2 Avoid Bad Comments

Avoid comments that only repeat obvious syntax.

Bad comment style:

- "This button is a button."
- "This variable stores variable."
- "This function runs function."

Good comment style:

- "This rule prevents repeated easy questions from artificially increasing the student's level."
- "This check keeps event results pending if the anti-cheat score is too risky."
- "This flow hides YouTube help during competition but shows it after submission."

---

## 140. Content Template MCP

### 140.1 Lesson Template

Every lesson should include:

- Lesson title.
- Class or engineering path.
- Subject or language.
- Chapter.
- Topic.
- Subtopics.
- Estimated time.
- Difficulty.
- Prerequisites.
- Learning goals.
- Theory.
- Visual explanation.
- Practice questions.
- Hints.
- Summary.
- YouTube help.
- Next lesson.

### 140.2 Question Template

Every question should include:

- Question title.
- Question body.
- Question type.
- Difficulty.
- Points.
- Correct answer.
- Explanation.
- Hint 1.
- Hint 2.
- Hint 3.
- YouTube link.
- Topic tags.
- Common mistake tags.
- Review status.

### 140.3 Test Template

Every test should include:

- Test name.
- Class/path.
- Subject/language.
- Chapters.
- Question count.
- Duration.
- Difficulty mix.
- Marking rules.
- Attempt rules.
- Result visibility.
- Explanation visibility.
- YouTube visibility.

### 140.4 Event Template

Every event should include:

- Event name.
- Organizer.
- Eligibility.
- Registration form.
- Event schedule.
- Competition rules.
- Safe browser requirement.
- Question pool.
- Leaderboard rule.
- Prize source.
- Certificate rule.
- Dispute policy.
- Support contact.

---

## 141. Minimal UI Screen Requirements

### 141.1 Home Page

Home page must answer:

- What is this platform?
- Where should I start?
- Which class/path can I choose?
- How do I sign up?
- Are events available?

### 141.2 Dashboard

Dashboard must answer:

- What should I do today?
- What is my level?
- Is my streak safe?
- What topic is weak?
- What test is next?

### 141.3 Lesson Page

Lesson page must answer:

- What am I learning now?
- What is the concept?
- Can I practice immediately?
- Did I answer correctly?
- Where can I watch help?

### 141.4 Test Page

Test page must answer:

- How much time is left?
- Which question am I on?
- Have I answered it?
- How do I submit?
- What happens after submit?

### 141.5 Event Page

Event page must answer:

- Who can participate?
- When is the event?
- What are the rules?
- Is safe browser required?
- How do I register?

---

## 142. Copy-Paste And Safe Browser Rules In Detail

### 142.1 Normal Learning

In normal learning:

- Copy may be allowed for notes.
- Paste may be allowed in some practice areas.
- The goal is learning, not punishment.

### 142.2 Practice Coding

In practice coding:

- Paste can be allowed or limited depending on mode.
- If paste is allowed, still run plagiarism checks for submissions.

### 142.3 Tests

In tests:

- Paste can be blocked.
- Copy can be blocked from question area.
- Focus loss can be logged.
- Repeated suspicious actions can reduce trust.

### 142.4 Official Competitions

In official competitions:

- Safe browser should be required when organizer chooses strict mode.
- YouTube help must be hidden during live attempt.
- Copy-paste should be blocked where possible.
- New tab should be restricted by safe browser configuration.
- Result can be held for review.

---

## 143. YouTube Help Visibility Matrix

| Mode | YouTube Link Visible Before Attempt | Visible During Attempt | Visible After Submission |
|---|---|---|---|
| Learning lesson | Optional | Yes after attempt | Yes |
| Practice question | No by default | Yes after first attempt | Yes |
| Chapter test | No | No | Yes |
| Mock test | No | No | Yes after result |
| Match | No | No | Yes after match |
| Official event | No | No | Depends on organizer |

---

## 144. Level 10 Unlock Design

Level 10 should feel meaningful but safe.

Unlocks:

- Matching mode.
- Advanced practice.
- Premium challenge sets.
- Community helper badge eligibility.
- Event priority registration.
- More detailed analytics.

Does not unlock:

- Illegal cash staking.
- Hidden betting.
- Unlimited spending.
- Unreviewed competitions.

Level 10 screen should show:

- Congratulations.
- New features.
- Safety rules.
- Premium option.
- Ads-supported option.
- Learning credits explanation.

---

## 145. ₹200 Premium Plan Detail

Premium plan should include:

- No daily ad requirement.
- More questions per day.
- Advanced explanations.
- More mock tests.
- Better analytics.
- Downloadable printables.
- Extra simulations.
- Certificate discounts.
- More AI tutor messages later.

Premium should not include:

- Guaranteed rank.
- Guaranteed event win.
- Cash earning promise.
- Unfair match advantage.

---

## 146. ₹100 Learning Pack Detail

The ₹100 pack should be described as a learning pack, not earning pack.

Can include:

- Premium test attempts.
- Workshop access.
- Certificate attempt.
- Mentor doubt session credit.
- Advanced simulation access.
- Project review access.

Should not include:

- Stake for match.
- Cash return.
- Withdrawal.
- 1.7x money promise.

---

## 147. 1.7x Concept Safe Conversion

Original idea: winner gets 1.7x.

Safe conversion options:

- 1.7x XP boost for match winner.
- 1.7x badge progress for event winner.
- 1.7x virtual rank points.
- 1.7x sponsor coupon value if sponsor-funded and legally reviewed.
- Fixed sponsor prize, not user-funded multiplier.

Recommended:

- Use 1.7x only for XP/rank, not cash.

---

## 148. Daily Cap Safe Conversion

Original idea: daily cap ₹50 to ₹100.

Safe use:

- Daily learning credit spending cap.
- Parent-controlled minor spending cap.
- Self-control cap.
- Event entry fee cap if applicable.
- Premium add-on cap.

Unsafe use:

- Daily betting cap.
- Daily stake cap.
- Daily cash battle cap.

---

## 149. Anti-Abuse Controls

Platform should prevent:

- Fake accounts.
- Repeated self-matching.
- Collusion.
- Payment abuse.
- Refund abuse.
- Community spam.
- Event cheating.
- Content scraping.
- Bot attempts.
- Credential sharing.

Controls:

- Rate limits.
- Device signals.
- Email/phone verification.
- Match repetition limits.
- Suspicious score review.
- Moderator tools.
- Admin audit.

---

## 150. Data Retention MCP

Suggested retention:

- Account data: until account deletion or legal requirement.
- Payment records: as required by law/accounting.
- Test attempts: long-term for progress.
- Event logs: fixed retention policy.
- Anti-cheat logs: limited and disclosed.
- Community deleted posts: limited moderator retention.
- Certificates: long-term verification.

Privacy policy must explain this clearly.

---

## 151. Reports MCP

### 151.1 Student Reports

Student reports:

- Weekly progress.
- Subject progress.
- Weak topics.
- Test performance.
- Streak summary.
- Certificate progress.

### 151.2 Parent Reports

Parent reports:

- Study time.
- Completed lessons.
- Test scores.
- Weak areas.
- Streak.
- Payments.

### 151.3 Teacher Reports

Teacher reports:

- Class progress.
- Chapter completion.
- Top weak topics.
- Test averages.
- Student list.

### 151.4 Organizer Reports

Organizer reports:

- Registration count.
- Attendance.
- Score distribution.
- Leaderboard.
- Suspicious activity.
- Certificate list.

### 151.5 Admin Reports

Admin reports:

- User growth.
- Revenue.
- Content quality.
- Community moderation.
- Event health.
- Fraud trends.

---

## 152. Support System MCP

Support categories:

- Login issue.
- Payment issue.
- Subscription issue.
- Content mistake.
- Wrong answer report.
- Event issue.
- Safe browser issue.
- Certificate issue.
- Community report.

Support should include:

- Ticket ID.
- User details.
- Category.
- Priority.
- Status.
- Admin notes.
- Resolution.

---

## 153. Error And Empty State MCP

Every screen should have good empty states.

Examples:

- No lessons started: "Start your first lesson."
- No tests attempted: "Take your first practice test."
- No events: "No events are open right now."
- No community posts: "Ask the first doubt in this topic."
- No certificates: "Complete a path to earn certificates."

Errors should:

- Be clear.
- Avoid scary wording.
- Tell next action.
- Not expose technical secrets.

---

## 154. Performance Budget MCP

Targets:

- Home should load fast.
- Dashboard should be responsive.
- Lesson page should not feel heavy.
- Test page must be stable.
- Match page must be realtime.
- Event live page must handle load.

Performance practices:

- Optimize images.
- Lazy-load simulations.
- Cache curriculum.
- Paginate community.
- Use database indexes.
- Use Redis for leaderboards.
- Use CDN for static assets.

---

## 155. Observability MCP

Track:

- Page errors.
- API errors.
- Payment failures.
- Test submission failures.
- Match disconnects.
- Event load.
- Slow pages.
- Database slow queries.
- Queue failures.
- Login failures.

Tools:

- Sentry for errors.
- OpenTelemetry for tracing.
- Logs for backend.
- Metrics dashboard.
- Alerting.

---

## 156. Disaster Recovery MCP

Plan for:

- Database backup.
- Restore testing.
- Payment reconciliation failure.
- Event server failure.
- Safe browser issue during event.
- Question leak.
- Wrong answer in live test.
- Admin account compromise.

Event emergency actions:

- Pause event.
- Extend time.
- Restart round.
- Cancel round.
- Manual review.
- Notify participants.

---

## 157. Launch Checklist

Before public launch:

- Auth tested.
- Payment tested.
- Lesson flow tested.
- Question answers reviewed.
- YouTube links reviewed.
- Points tested.
- Levels tested.
- Streak tested.
- Mobile tested.
- Accessibility tested.
- Admin tested.
- Backup configured.
- Privacy policy ready.
- Terms ready.
- Support process ready.

Before first event:

- Organizer trained.
- Event rules ready.
- Question pool reviewed.
- Safe browser tested.
- Timer tested.
- Leaderboard tested.
- Certificate template ready.
- Support contact ready.
- Dispute process ready.

---

## 158. Final Master Instruction To Builders

Build this product with discipline.

Do not rush into all features at once. First build a strong learning engine. Then build tests. Then build community. Then build events. Then build matching. Then build advanced AI.

The folder structure and comments matter because this platform will become large. If the foundation is messy, future features will become painful.

The legal-safe money model matters because trust is the product. If students or parents feel tricked, the platform will fail.

The UI must stay minimal because students should focus on learning, not figuring out the website.

The content must be high quality because no amount of gamification can fix weak explanations.

The event system must be strict because colleges will trust the platform only if results are fair.

The community must be moderated because student safety is more important than engagement.

---

## 159. Final Master Checklist

The MCP is complete only if it covers:

- Pages.
- Folders.
- Comments.
- Classes.
- Subjects.
- Engineering languages.
- C language 30-day plan.
- Points.
- Levels.
- Streaks.
- Sounds.
- Animations.
- Simulations.
- Tests.
- YouTube links.
- Community.
- Events.
- Safe browser.
- Matching.
- Dashboard.
- Admin.
- Organizer portal.
- Payments.
- Subscription.
- Learning credits.
- Legal safety.
- Modern technology.
- Approved TypeScript and Node.js direction.
- No implementation code.

This document covers all of those.

---

## 160. Final Closing Statement

This MCP should be treated as the master planning document for the education platform. It is intentionally detailed so that the next developer, designer, or content creator can understand the complete idea without asking the founder to explain everything again.

The strongest version of the platform is a clean, modern, legally safe, deeply structured learning system where students improve daily, compete fairly, and always know their next step.

---

## 161. Deep Expansion Version 5: More Detailed Product, Technical, And Operations Blueprint

This section improves the MCP with deeper implementation planning while still avoiding actual code. It gives a clearer map for developers, designers, content teams, admins, teachers, event organizers, and future investors.

This addendum focuses on:

- More detailed module behavior.
- More detailed database planning.
- More detailed screen states.
- More detailed event and competition operations.
- More detailed content quality rules.
- More detailed security and compliance rules.
- More detailed launch planning.
- More detailed acceptance criteria.

Important:

- This is still a no-code Markdown planning file.
- The approved TypeScript and Node.js direction must be used for building the website.
- Real-money betting or hidden money-game mechanics must not be built.

---

## 162. Master Product Pillars

The platform should be built on five pillars.

### 162.1 Pillar 1: Structured Learning

The platform must guide the student step by step.

This means:

- Class-wise learning paths.
- Subject-wise learning paths.
- Chapter-wise learning paths.
- Topic-wise learning paths.
- Day-wise engineering roadmaps.
- Theory before practice.
- Practice after each subtopic.
- Review after mistakes.
- YouTube support after attempts.

### 162.2 Pillar 2: Gamified Motivation

The platform should feel motivating but not addictive in a harmful way.

This means:

- Points.
- XP.
- Levels.
- Streaks.
- Badges.
- Daily goals.
- Weekly goals.
- Match ranking.
- Certificates.

### 162.3 Pillar 3: Fair Competition

Competitions must be fair.

This means:

- Same class matching.
- Same subject matching.
- Same chapter/topic matching.
- Similar level matching.
- Server-side scoring.
- Anti-cheat signals.
- Safe browser for official events.
- Result review before final publication.

### 162.4 Pillar 4: Community And Support

Students should not feel alone.

This means:

- Class-wise communities.
- Subject-wise doubt areas.
- Engineering language communities.
- Event discussion rooms.
- Mentor replies.
- Moderation.
- Report abuse.
- Mark answer as solved.

### 162.5 Pillar 5: Trust And Safety

Parents, colleges, and students must trust the platform.

This means:

- Transparent pricing.
- No hidden betting.
- No illegal money mechanics.
- Strong privacy.
- Safe community.
- Reviewed content.
- Audit logs.
- Clear support.

---

## 163. Detailed User Personas

### 163.1 Class 9 Beginner Student

Needs:

- Simple explanations.
- Visuals.
- Small questions.
- Confidence building.
- Hindi/English support later.
- Parent visibility.

Success moment:

- Completes first chapter and sees visible progress.

### 163.2 Class 10 Board Student

Needs:

- Board-style questions.
- Revision.
- Sample papers.
- Weak topic repair.
- Timed tests.
- Previous-year style practice.

Success moment:

- Sees board readiness score improving.

### 163.3 Class 11 Science Student

Needs:

- Deep concepts.
- Physics/Chemistry/Math/Biology clarity.
- Entrance foundation.
- Formula notebook.
- Numerical practice.

Success moment:

- Understands a difficult concept through simulation and solves related questions.

### 163.4 Class 12 Exam Student

Needs:

- Revision calendar.
- Mock tests.
- Board/entrance bridge.
- Practical/project tracker.
- Stress-free dashboard.

Success moment:

- Completes revision plan and improves mock score.

### 163.5 Engineering Beginner

Needs:

- Language roadmap.
- Day-wise plan.
- Practice problems.
- Debugging help.
- YouTube help.
- Projects.

Success moment:

- Completes C Language Day 1 and sees the 30-day roadmap clearly.

### 163.6 College Organizer

Needs:

- Easy event creation.
- Registration form.
- Safe competition mode.
- Leaderboard.
- Reports.
- Certificates.

Success moment:

- Runs a competition without managing spreadsheets manually.

### 163.7 Parent

Needs:

- Progress visibility.
- Payment control.
- Safety controls.
- Time spent.
- Weak topics.

Success moment:

- Understands exactly where the child is improving.

---

## 164. Detailed Page Acceptance Criteria

### 164.1 Home Page Acceptance Criteria

Home page is complete when:

- It clearly shows the platform purpose.
- It has direct entry points for Class 9, Class 10, Class 11, Class 12, Engineering.
- It has sign in and sign up buttons.
- It shows event/competition concept without overpromising money.
- It is minimal and not confusing.
- It loads fast on mobile.
- It uses clear cards or sections without visual clutter.

### 164.2 Class Page Acceptance Criteria

Each class page is complete when:

- It lists subjects separately.
- It shows progress if user is logged in.
- It shows chapters inside each subject.
- It supports tests.
- It supports YouTube links under questions.
- It links to related community rooms.
- It has a clear continue button.

### 164.3 Engineering Page Acceptance Criteria

Engineering page is complete when:

- It lists programming languages separately.
- It lists non-language skills separately.
- It has C language 30-day plan.
- It has DSA roadmap.
- It has web development roadmap.
- It has project-based learning area.
- It has placement preparation area.
- It shows progress and recommended next path.

### 164.4 Dashboard Acceptance Criteria

Dashboard is complete when:

- It shows one main next action.
- It shows current level.
- It shows XP to next level.
- It shows streak.
- It shows weak topics.
- It shows tests.
- It shows events.
- It shows community replies.
- It shows subscription/credits only when relevant.

### 164.5 Test Page Acceptance Criteria

Test page is complete when:

- It has timer where required.
- It has question navigation.
- It has answer save status.
- It has submit confirmation.
- It hides YouTube links during test.
- It shows result after submission.
- It saves mistakes.
- It provides revision recommendation.

### 164.6 Sign In Acceptance Criteria

Sign in is complete when:

- User can log in safely.
- Errors are clear.
- Rate limiting exists.
- Session is secure.
- Forgot/recovery flow exists.
- Passkey option can be added later.

### 164.7 Sign Up Acceptance Criteria

Sign up is complete when:

- User chooses class or engineering.
- User chooses stream if Class 11 or 12.
- User chooses subjects.
- User sets learning goal.
- User reaches dashboard after onboarding.
- Parent consent is considered for minors.

---

## 165. Detailed Module Behavior

### 165.1 Curriculum Module

Responsibilities:

- Store class list.
- Store stream list.
- Store subject list.
- Store chapter list.
- Store topic list.
- Store subtopic list.
- Map user to selected curriculum.
- Provide next lesson recommendation.

Rules:

- No subject should be placed directly without class/stream mapping.
- Engineering languages should be separate from school subjects.
- A chapter can have many topics.
- A topic can have many subtopics.
- Lessons should map to exact subtopic where possible.

### 165.2 Content Module

Responsibilities:

- Store theory.
- Store summaries.
- Store diagrams.
- Store simulation references.
- Store video references.
- Store lesson status.

Rules:

- Content must have review status.
- Published content must have reviewer name.
- Content should have last reviewed date.
- Outdated content should be marked for review.

### 165.3 Question Module

Responsibilities:

- Store questions.
- Store correct answers.
- Store hints.
- Store solutions.
- Store difficulty.
- Store points.
- Store YouTube help.

Rules:

- Every question must have at least one explanation.
- Every published question should have a verified answer.
- Every question should map to topic.
- Competition questions should be marked event-safe.

### 165.4 Scoring Module

Responsibilities:

- Calculate points.
- Apply difficulty multiplier.
- Apply hint penalty.
- Apply first-attempt bonus.
- Store point transaction.

Rules:

- Points must be auditable.
- Repeated easy questions should not farm level.
- Suspicious activity can hold points for review.
- Negative marking should apply only where test rules say so.

### 165.5 Level Module

Responsibilities:

- Convert XP into level.
- Unlock features.
- Track level history.
- Prevent manipulation.

Rules:

- Level must not depend only on repeated questions.
- Level 10 unlocks matching and advanced areas.
- Level unlocks should be clearly explained.

### 165.6 Streak Module

Responsibilities:

- Track daily activity.
- Track streak continuation.
- Track streak freeze.
- Track longest streak.

Rules:

- Opening app should not count as streak.
- Minimum learning action should be required.
- Streak should respect user's local timezone.

### 165.7 Matching Module

Responsibilities:

- Create matching queue.
- Match similar users.
- Start match room.
- Track answers.
- Calculate winner.
- Save result.

Rules:

- Class 9 matches only with Class 9 in class mode.
- Similar subject/chapter/topic is required.
- Similar level range is required.
- Cash staking is not allowed.
- XP/rank rewards are allowed.

### 165.8 Event Module

Responsibilities:

- Create event.
- Register participants.
- Configure safe browser.
- Run competition.
- Monitor live status.
- Publish results.
- Generate certificates.

Rules:

- Official events should have clear rules.
- Safe browser should be tested before event.
- Results should be reviewed before final publication.
- Sponsor prizes must be transparent.

---

## 166. Detailed Database Entity Blueprint

This is conceptual database planning, not code.

### 166.1 User And Identity Entities

Entities:

- User.
- User profile.
- Student profile.
- Parent profile.
- Teacher profile.
- Organizer profile.
- Admin profile.
- Role.
- Permission.
- Session.
- Device.
- Login attempt.

Important fields:

- User ID.
- Display name.
- Email.
- Phone.
- Role.
- Status.
- Created date.
- Last login.
- Verification status.
- Guardian link if minor.

### 166.2 Curriculum Entities

Entities:

- Program.
- Class.
- Stream.
- Subject.
- Chapter.
- Topic.
- Subtopic.
- Learning path.
- Day plan.
- Lesson.

Important fields:

- Title.
- Slug.
- Description.
- Order.
- Difficulty.
- Estimated time.
- Prerequisites.
- Active status.

### 166.3 Question Entities

Entities:

- Question.
- Question option.
- Correct answer.
- Hint.
- Solution.
- Video link.
- Question tag.
- Difficulty profile.
- Review record.

Important fields:

- Question type.
- Points.
- Negative marking.
- Time estimate.
- Topic mapping.
- Published status.
- Review status.
- Match eligible.
- Event eligible.

### 166.4 Progress Entities

Entities:

- Lesson progress.
- Topic mastery.
- Question attempt.
- Test attempt.
- Points ledger.
- Level history.
- Streak record.
- Badge award.
- Mistake notebook.
- Revision schedule.

Important fields:

- User ID.
- Content ID.
- Status.
- Score.
- Accuracy.
- Time spent.
- Attempt count.
- Last activity date.

### 166.5 Match Entities

Entities:

- Match queue entry.
- Match room.
- Match participant.
- Match round.
- Match question.
- Match answer.
- Match result.
- Match anti-cheat signal.

Important fields:

- Class/language.
- Subject.
- Chapter.
- Topic.
- Level range.
- Start time.
- End time.
- Winner.
- Review status.

### 166.6 Event Entities

Entities:

- Event.
- Event organizer.
- Event registration.
- Event form field.
- Event participant.
- Event question pool.
- Event attempt.
- Event leaderboard.
- Event certificate.
- Event dispute.
- Event report.

Important fields:

- Organizer ID.
- Event type.
- Eligibility.
- Registration deadline.
- Start time.
- Duration.
- Safe browser mode.
- Result status.
- Certificate status.

### 166.7 Finance Entities

Entities:

- Payment order.
- Payment transaction.
- Subscription.
- Invoice.
- Learning credit account.
- Learning credit ledger.
- Refund.
- Sponsor prize.
- Institution billing.

Important fields:

- Amount.
- Currency.
- Payment provider.
- Status.
- Purpose.
- User ID.
- Event ID if relevant.
- Created date.
- Reconciled status.

Important finance rule:

- Learning credits should be non-withdrawable.
- User-funded cash payout should not be built.
- Every balance change should be ledger-based.

---

## 167. Detailed API Behavior Without Code

### 167.1 Auth APIs

Should support:

- Create account.
- Login.
- Logout.
- Refresh session.
- Verify email or phone.
- Recover account.
- Manage devices.

Must enforce:

- Rate limits.
- Secure sessions.
- Clear errors.
- Audit logs for risky actions.

### 167.2 Curriculum APIs

Should support:

- Get classes.
- Get subjects.
- Get chapters.
- Get topics.
- Get learning path.
- Get next lesson.

Must enforce:

- Public preview rules.
- User enrollment rules.
- Active content only for students.

### 167.3 Question APIs

Should support:

- Get question.
- Submit answer.
- Get explanation.
- Get YouTube help when allowed.
- Report question issue.

Must enforce:

- Hide answers before submission.
- Hide YouTube in test/match/event modes.
- Validate attempt status.

### 167.4 Test APIs

Should support:

- Start test.
- Save answer.
- Submit test.
- Get result.
- Get review.

Must enforce:

- Server-side timer.
- Attempt limit.
- Result visibility rules.

### 167.5 Match APIs

Should support:

- Join queue.
- Leave queue.
- Ready check.
- Submit answer.
- Get live score.
- Get result.

Must enforce:

- Level eligibility.
- Same class/language rule.
- Similar chapter/topic rule.
- No money staking.

### 167.6 Event APIs

Should support:

- Create event.
- Register participant.
- Check eligibility.
- Start event attempt.
- Submit event attempt.
- Get leaderboard.
- Generate certificate.

Must enforce:

- Organizer permissions.
- Safe browser rules.
- Result review rules.
- Registration deadline.

---

## 168. Detailed Screen States

Every major page should define states.

### 168.1 Lesson Page States

States:

- Loading.
- Not started.
- In progress.
- Question active.
- Answer correct.
- Answer wrong.
- Hint opened.
- Video help available.
- Completed.
- Error.

### 168.2 Test Page States

States:

- Instructions.
- Starting.
- Active.
- Auto-saving.
- Connection lost.
- Time warning.
- Submitted.
- Result pending.
- Result ready.
- Review available.

### 168.3 Match Page States

States:

- Select subject.
- Searching.
- Opponent found.
- Ready check.
- Countdown.
- Active round.
- Waiting.
- Result.
- Review pending.
- Cancelled.

### 168.4 Event Page States

States:

- Upcoming.
- Registration open.
- Registration closed.
- Waiting room.
- Device check.
- Safe browser required.
- Live.
- Submitted.
- Under review.
- Result published.
- Certificate ready.

### 168.5 Community Page States

States:

- Empty room.
- Posts loading.
- Post opened.
- Reply writing.
- Report submitted.
- Moderator reviewing.
- Solved.

---

## 169. Detailed Content QA Rules

### 169.1 Lesson QA

A lesson passes QA when:

- Objective is clear.
- Theory is correct.
- Language is simple.
- Examples are relevant.
- At least one practice question exists.
- Summary exists.
- Related YouTube help exists where needed.
- Reviewer approved.

### 169.2 Question QA

A question passes QA when:

- It is mapped to exact topic.
- It has correct answer.
- It has explanation.
- It has difficulty.
- It has points.
- It has hints.
- It has video help where possible.
- It has no ambiguity.
- It has no offensive content.

### 169.3 Video QA

A video link passes QA when:

- It explains the same concept.
- It is age-appropriate.
- It is not misleading.
- It has acceptable audio/visual quality.
- It matches the student's language needs.
- It is reviewed periodically.

### 169.4 Event Question QA

An event question passes QA when:

- It has no leaked answer.
- It has correct difficulty.
- It is time-appropriate.
- It is not dependent on external browsing.
- It is safe for competition.
- It has been reviewed by expert.

---

## 170. Detailed Anti-Cheat And Trust Score

### 170.1 Trust Score Inputs

Trust score can consider:

- Account age.
- Verification status.
- Device consistency.
- Past suspicious flags.
- Match completion history.
- Event integrity history.
- Payment risk history.
- Community moderation history.

### 170.2 Trust Score Use

Trust score can affect:

- Match eligibility.
- Event review requirement.
- Result hold.
- Manual review priority.
- Community posting limits.

### 170.3 Trust Score Safety

Rules:

- Do not show exact trust score to users.
- Explain restrictions clearly.
- Allow appeal for serious actions.
- Do not punish users only for one weak signal.

---

## 171. Detailed Safe Browser Event Flow

### 171.1 Before Event

Steps:

- Organizer enables safe browser mode.
- Admin reviews event settings.
- Safe browser instructions are published.
- Participants complete device check.
- Trial link is provided.
- Support contact is visible.

### 171.2 During Event

Steps:

- Participant opens safe browser.
- Platform validates event session.
- Timer starts from server.
- Questions are delivered.
- Answers are auto-saved.
- Suspicious signals are logged.
- Participant submits.

### 171.3 After Event

Steps:

- Submission is locked.
- Leaderboard is calculated.
- Anti-cheat review runs.
- Organizer reviews flags.
- Admin approves result if needed.
- Final result is published.
- Certificates are generated.

---

## 172. Detailed Community Moderation Workflow

### 172.1 Report Flow

Steps:

- User reports post/comment.
- System records reason.
- Moderator sees report queue.
- Moderator reviews content.
- Moderator takes action.
- User is notified if needed.

### 172.2 Moderator Actions

Actions:

- No action.
- Hide content.
- Delete content.
- Warn user.
- Temporary mute.
- Temporary ban.
- Permanent ban.
- Escalate to admin.

### 172.3 Community Auto-Flags

Auto-flag:

- Abusive words.
- Spam links.
- Repeated posts.
- Cheating requests.
- Money-game promotion.
- Personal information sharing.
- Impersonation.

---

## 173. Detailed Admin Audit Requirements

Audit logs should record:

- Who performed action.
- What action was performed.
- When it was performed.
- Which object changed.
- Previous value summary.
- New value summary.
- Reason if required.
- IP/device context where appropriate.

Audit-required actions:

- Content publish.
- Question answer change.
- Event result publish.
- User ban.
- Payment refund.
- Credit adjustment.
- Certificate revoke.
- Role change.
- Admin login.

---

## 174. Detailed Payment And Credits Rules

### 174.1 Payment Purposes

Allowed purposes:

- Premium subscription.
- Learning credit pack.
- Certificate attempt.
- Workshop access.
- Institution event hosting.
- Printable bundle.

Not allowed:

- Stake for match.
- Deposit to win cash.
- Betting entry.
- Cash multiplier.
- User-funded prize pool.

### 174.2 Learning Credits

Learning credits can be used for:

- Premium tests.
- Advanced simulations.
- Workshop seats.
- Certificate attempts.
- Mentor sessions.

Learning credits cannot be:

- Withdrawn.
- Transferred freely to other users.
- Used as stake.
- Converted to cash.

### 174.3 Refund Rules

Refund rules should define:

- Failed payment refund.
- Duplicate payment refund.
- Event cancellation refund.
- Subscription cancellation rules.
- Credit pack refund rules.

---

## 175. Detailed Analytics Events

Track learning events:

- Lesson started.
- Lesson completed.
- Question viewed.
- Answer submitted.
- Hint opened.
- YouTube help clicked.
- Test started.
- Test submitted.
- Level up.
- Streak continued.

Track competition events:

- Match queue joined.
- Match found.
- Match started.
- Match completed.
- Event registered.
- Event attempt started.
- Event submitted.
- Anti-cheat flag created.

Track business events:

- Signup.
- Onboarding completed.
- Subscription started.
- Payment success.
- Payment failed.
- Credit used.

---

## 176. Detailed KPI Targets

Early MVP KPIs:

- Signup completion rate.
- Onboarding completion rate.
- First lesson completion rate.
- Day 1 question solve rate.
- Day 7 retention.
- Average daily questions solved.
- Streak creation rate.

Learning KPIs:

- Lesson completion.
- Accuracy improvement.
- Weak topic recovery.
- Test score improvement.
- Revision completion.

Event KPIs:

- Registration completion.
- Attendance rate.
- Event completion rate.
- Dispute rate.
- Certificate download rate.

Business KPIs:

- Free-to-premium conversion.
- Payment success rate.
- Refund rate.
- Institution event conversion.

---

## 177. Detailed Launch Risk Matrix

| Risk | Impact | Mitigation |
|---|---|---|
| Too much scope | Delays launch | Build MVP first |
| Poor content | Low trust | Teacher review |
| Wrong answers | Serious trust damage | Multi-step QA |
| Payment failure | User frustration | Reconciliation and support |
| Illegal money mechanics | Legal risk | No user-funded cash staking |
| Cheating in events | College trust loss | Safe browser and review |
| Community abuse | Student safety risk | Moderation |
| Slow website | Drop-off | Performance budget |
| Confusing UI | Low retention | Minimal dashboard |
| Weak mobile UX | Lost users | Mobile-first testing |

---

## 178. Detailed MVP Data To Prepare Before Development

Before development, prepare:

- Brand name.
- Logo.
- Color palette.
- Class 9 subject list.
- Class 10 subject list.
- Class 11 stream list.
- Class 12 stream list.
- Engineering language list.
- C language 30-day outline.
- Sample lessons.
- Sample questions.
- Sample YouTube links.
- Pricing decision.
- Terms draft.
- Privacy draft.
- Event rules draft.
- Safe browser policy draft.

---

## 179. Detailed Developer Handoff Checklist

Developer should receive:

- This MCP file.
- UI wireframes.
- Folder naming rules.
- Tech stack decision.
- Database entity plan.
- API behavior plan.
- Content sample.
- Scoring rules.
- Level rules.
- Streak rules.
- Matching rules.
- Payment restrictions.
- Safe browser rules.
- Admin role matrix.
- QA checklist.

---

## 180. Detailed Designer Handoff Checklist

Designer should receive:

- User personas.
- Page inventory.
- Minimal UI rules.
- Dashboard widget list.
- Lesson screen requirements.
- Test screen requirements.
- Match screen requirements.
- Event screen requirements.
- Community screen requirements.
- Accessibility rules.
- Color constraints.
- Mobile navigation rules.

---

## 181. Detailed Content Team Handoff Checklist

Content team should receive:

- Class subject matrix.
- Engineering language matrix.
- Lesson template.
- Question template.
- Test template.
- Video QA rules.
- Difficulty definitions.
- Points policy.
- Review workflow.
- Content publishing rules.

---

## 182. Detailed Event Organizer Handoff Checklist

Organizer should receive:

- Event creation guide.
- Registration guide.
- Safe browser guide.
- Participant instructions.
- Competition rules template.
- Leaderboard explanation.
- Result review process.
- Certificate process.
- Dispute process.
- Support process.

---

## 183. Detailed Founder Decision Checklist

Founder must decide:

- Final platform name.
- Final brand style.
- First class to launch fully.
- First engineering language to launch fully.
- Free daily question limit.
- Premium price.
- Learning credit use cases.
- Whether ads are used.
- Whether parent dashboard is MVP or later.
- First college event pilot.
- Content review team.
- Legal review partner.

---

## 184. Detailed Implementation Language Policy

The website should be built using the approved TypeScript and Node.js direction.

Preferred build languages:

- TypeScript for frontend.
- TypeScript for backend.
- SQL for database.
- Python only for optional AI/content tooling if needed.

If someone proposes the rejected backend-language direction:

- Reject it for this project.
- Keep the implementation stack TypeScript-based.
- Mention that the approved TypeScript and Node.js direction should remain the platform implementation stack.

---

## 185. Detailed Modern Technology Recommendation

Recommended stack:

- Next.js for frontend.
- React for UI.
- TypeScript for type safety.
- Tailwind CSS for styling.
- shadcn/ui and Radix UI for components.
- lucide-react for icons.
- Framer Motion for animations.
- Rive or Lottie for learning animations.
- Node.js Active LTS for runtime.
- NestJS or Fastify for backend.
- PostgreSQL for main database.
- Redis or Valkey for queues, leaderboard, and matching state.
- Prisma or Drizzle for database access.
- Zod for validation.
- TanStack Query for server state.
- Zustand for lightweight UI state.
- Playwright for browser testing.
- Vitest for unit testing.
- Sentry for error tracking.
- OpenTelemetry for observability.
- Razorpay or Cashfree for Indian payments.
- Safe Exam Browser for strict event mode.

---

## 186. Detailed Future Feature Ideas

Future features:

- AI doubt tutor.
- Voice explanation.
- Hindi/English toggle.
- Offline worksheet download.
- Parent app.
- Teacher assignment mode.
- College white-label event pages.
- Sponsor dashboard.
- Scholarship programs.
- Project review marketplace without cash betting.
- Mentor office hours.
- Placement readiness score.
- Board readiness score.
- Skill portfolio.
- Resume builder.
- GitHub integration for engineering learners.
- Code playback after contest.
- Typing speed tracker.
- Formula flashcards.
- Mistake revision calendar.
- Adaptive question difficulty.

---

## 187. Detailed Final Product Quality Bar

The product is high quality only if:

- Students understand what to do next.
- Parents understand progress.
- Teachers trust content.
- Colleges trust event results.
- Developers understand folder structure.
- Admins can moderate safely.
- Payments are transparent.
- Legal risk is controlled.
- The UI feels minimal and serious.
- The platform improves learning outcomes.

---

## 188. Version 5 Closing Note

This Version 5 addendum improves the MCP with deeper planning for modules, data, APIs, screens, QA, operations, analytics, launch, and handoff. It still does not include implementation code and still follows the approved TypeScript and Node.js direction.

The best next practical step after this document is not to add more duplicate text. The best next step is to use this MCP to create:

- A visual sitemap.
- A database diagram.
- A UI wireframe set.
- A development backlog.
- A first MVP folder structure.
- A first C language content sample.

---

## 189. Deep Expansion Version 6: Ultra-Detailed Build And Folder Execution Addendum

This Version 6 addendum adds more practical detail for turning the MCP into a real project. It focuses on exact folder planning, page responsibilities, learning content packaging, event operations, developer tasks, and definition of done.

This addendum still contains no implementation code.

---

## 190. Exact Root Folder Detail

The root folder of the future project should be treated like the main city map of the product. Nothing should be randomly placed at the root.

### 190.1 Required Root Folders

| Folder | Purpose | Must Contain | Must Not Contain |
|---|---|---|---|
| frontend | User-facing screens and UI | Pages, layouts, components, styles, client behavior | Backend business rules |
| backend | Server-side features | APIs, services, jobs, validation, database access | UI components |
| printables | PDF/print assets | Worksheets, certificates, reports, answer keys | Live app pages |
| class-9 | Class 9 content structure | Subjects, chapters, tests, community mapping | Class 10 content |
| class-10 | Class 10 content structure | Subjects, chapters, board practice | Class 9 content |
| class-11 | Class 11 content structure | Streams, subjects, entrance foundation | Class 12 content |
| class-12 | Class 12 content structure | Streams, board prep, entrance bridge | Engineering content |
| engineering | Coding and CS learning | Languages, DSA, projects, placement | School class chapters |
| dashboard | Dashboard planning | Widgets, reports, progress blocks | Auth logic |
| test | Test planning | Practice, mock, event test, result review | Community posts |
| auth | Authentication planning | Sign in, sign up, OTP, sessions, passkeys | Class lessons |
| community | Community planning | Rooms, posts, moderation, reports | Payment logic |
| events | Event portal planning | Registration, organizer, live monitoring | Normal lessons only |
| matching | Matchmaking planning | Queues, rooms, scoring, fairness | Payment staking |
| safe-browser | Competition security planning | Policies, device check, event lockdown | Normal casual practice |
| wallet-credits | Legal-safe money planning | Subscriptions, credits, invoices, refunds | Illegal betting |
| admin | Internal admin planning | Users, content, reports, fraud review | Student-only UI |
| docs | Documentation | Product docs, technical docs, legal notes | App runtime files |
| qa | Quality assurance | Test plans, checklists, release checks | Production secrets |

### 190.2 Required README In Every Folder

Every folder README should include:

- Folder purpose.
- Owner.
- Review owner.
- What belongs here.
- What does not belong here.
- Naming rules.
- Comment rules.
- Testing expectations.
- Related folders.
- Last updated date.

### 190.3 Required Comment Philosophy

Future comments should explain product logic in simple English.

Good comment topics:

- Why a user is allowed into a match.
- Why YouTube help is hidden during tests.
- Why Level 10 unlocks matching.
- Why learning credits are non-withdrawable.
- Why event results are pending review.
- Why repeated easy questions cannot farm XP.

---

## 191. Exact Frontend Folder Detail

### 191.1 Public Frontend Areas

Public frontend should include:

- Home page.
- Class overview pages.
- Engineering overview page.
- Events preview page.
- Pricing page.
- Help page.
- Sign in page.
- Sign up page.
- Terms page.
- Privacy page.

### 191.2 Student Frontend Areas

Student frontend should include:

- Student dashboard.
- Learn home.
- Class subject page.
- Chapter page.
- Topic page.
- Lesson page.
- Practice page.
- Test page.
- Result page.
- Mistake notebook.
- Streak page.
- Level page.
- Badge page.
- Match page.
- Event page.
- Community page.
- Profile page.
- Subscription page.
- Learning credits page.

### 191.3 Organizer Frontend Areas

Organizer frontend should include:

- Organizer dashboard.
- Create event.
- Edit event.
- Registration builder.
- Participant table.
- Question pool selector.
- Safe browser settings.
- Live event monitor.
- Result review.
- Certificate generator.
- Reports.
- Billing.

### 191.4 Admin Frontend Areas

Admin frontend should include:

- Admin dashboard.
- User management.
- Role management.
- Curriculum management.
- Content management.
- Question management.
- Video link review.
- Test management.
- Event management.
- Community moderation.
- Payment management.
- Credit ledger.
- Fraud review.
- Certificate management.
- Settings.
- System health.

---

## 192. Exact Backend Service Detail

### 192.1 Authentication Service

Responsibilities:

- Account creation.
- Login.
- Logout.
- Password or OTP recovery.
- Session validation.
- Role assignment.
- Device record.
- Security logs.

Important rules:

- Rate limit login attempts.
- Protect sessions.
- Record suspicious login behavior.
- Support passkeys later.

### 192.2 Curriculum Service

Responsibilities:

- Manage classes.
- Manage streams.
- Manage subjects.
- Manage chapters.
- Manage topics.
- Manage subtopics.
- Return learning path.
- Return next recommended lesson.

Important rules:

- Class content and engineering content stay separate.
- Order should be stable.
- Draft content should not show to students.

### 192.3 Learning Service

Responsibilities:

- Start lesson.
- Track lesson progress.
- Mark lesson complete.
- Recommend next lesson.
- Update mastery.

Important rules:

- A lesson should teach small concepts.
- A user should always see one next action.
- Progress should be saved frequently.

### 192.4 Question Service

Responsibilities:

- Deliver questions.
- Validate answer.
- Return feedback.
- Return hints.
- Return YouTube help only when allowed.
- Store reports for wrong questions.

Important rules:

- Do not expose correct answer before submission.
- Do not expose videos during live test/match/event.
- Every answer submission should be auditable.

### 192.5 Scoring Service

Responsibilities:

- Award XP.
- Apply bonuses.
- Apply penalties.
- Save point ledger.
- Trigger level check.

Important rules:

- XP should be fair.
- Hints reduce bonus.
- Repeated questions reduce reward.
- Suspicious attempts can be held.

### 192.6 Event Service

Responsibilities:

- Create event.
- Register participants.
- Validate eligibility.
- Start event attempt.
- Monitor status.
- Calculate leaderboard.
- Hold results for review.
- Publish results.

Important rules:

- Organizer cannot silently change rules after event starts.
- Event result should have review trail.
- Safe browser mode should be tested before event.

### 192.7 Community Service

Responsibilities:

- Create posts.
- Reply to posts.
- Mark solved.
- Vote helpful.
- Report abuse.
- Moderate content.

Important rules:

- No cheating help.
- No abusive language.
- No illegal money promotion.
- No leaking event answers.

---

## 193. Detailed Class 9 Folder Contents

Class 9 folder should include:

- README.
- Subject overview.
- Mathematics.
- Science.
- Social Science.
- English.
- Hindi.
- Sanskrit.
- Regional Language.
- Computer Applications.
- Artificial Intelligence.
- Tests.
- Worksheets.
- Simulations.
- YouTube Links.
- Community Mapping.
- Progress Rules.

Each subject folder should include:

- README.
- Chapter list.
- Topic list.
- Lesson files.
- Question sets.
- Answer explanations.
- YouTube help links.
- Tests.
- Revision.
- Printable worksheets.

Class 9 user experience:

- Simple.
- Visual.
- Step-by-step.
- Encouraging.
- Not overloaded.

---

## 194. Detailed Class 10 Folder Contents

Class 10 folder should include:

- README.
- Mathematics Standard.
- Mathematics Basic.
- Science.
- Social Science.
- English.
- Hindi.
- Sanskrit.
- Regional Language.
- Computer Applications.
- Information Technology.
- Artificial Intelligence.
- Board Practice.
- Sample Papers.
- Previous Year Style Questions.
- Tests.
- Worksheets.
- Revision Plans.
- Community Mapping.

Class 10 special requirements:

- Board exam mode.
- Case-based questions.
- Assertion-reason questions.
- Timed mock tests.
- Formula revision.
- Common mistake section.
- Chapter weightage.

---

## 195. Detailed Class 11 Folder Contents

Class 11 folder should include:

- README.
- Science PCM.
- Science PCB.
- Science PCMB.
- Commerce.
- Humanities.
- Skill Subjects.
- Entrance Foundation.
- Practical Support.
- Projects.
- Tests.
- Community Mapping.

Science PCM should include:

- Physics.
- Chemistry.
- Mathematics.
- English.
- Computer Science optional.

Science PCB should include:

- Physics.
- Chemistry.
- Biology.
- English.

Commerce should include:

- Accountancy.
- Business Studies.
- Economics.
- English.
- Applied Mathematics optional.

Humanities should include:

- History.
- Political Science.
- Geography.
- Psychology.
- Sociology.
- Economics.
- English.

---

## 196. Detailed Class 12 Folder Contents

Class 12 folder should include:

- README.
- Science PCM.
- Science PCB.
- Science PCMB.
- Commerce.
- Humanities.
- Board Revision.
- Practical Tracker.
- Project Tracker.
- Sample Papers.
- Previous Year Style.
- Entrance Bridge.
- Tests.
- Certificates.
- Community Mapping.

Class 12 special requirements:

- Revision calendar.
- Board readiness score.
- Mock test analysis.
- Practical/project reminders.
- Weak chapter recovery.
- Career path suggestions.

---

## 197. Detailed Engineering Folder Contents

Engineering folder should include:

- README.
- Programming Languages.
- Data Structures And Algorithms.
- Web Development.
- Backend Development.
- Frontend Development.
- Database Systems.
- Operating Systems.
- Computer Networks.
- DBMS.
- OOP.
- System Design.
- Cloud Computing.
- DevOps.
- Cybersecurity.
- AI And Machine Learning.
- Data Science.
- Git And GitHub.
- Placement Preparation.
- Projects.
- Hackathons.
- Coding Matches.
- Community Mapping.

Programming Languages should include:

- C.
- C Plus Plus.
- Java.
- Python.
- JavaScript.
- TypeScript.
- HTML.
- CSS.
- SQL.
- Rust.
- C Sharp.
- Kotlin.
- Swift.
- PHP.
- Ruby.
- R.
- MATLAB.
- Dart.
- Bash.
- PowerShell.

Use the approved TypeScript and Node.js direction for building the platform.

---

## 198. Exact Language Roadmap Template

Every programming language folder should follow the same structure.

Required sections:

- Language overview.
- Why learn this language.
- Who should learn it.
- Setup guide.
- Syntax basics.
- Data types.
- Operators.
- Control flow.
- Loops.
- Functions.
- Collections.
- Strings.
- Error handling.
- File handling where relevant.
- Object-oriented programming where relevant.
- Memory model where relevant.
- Standard library.
- Beginner problems.
- Intermediate problems.
- Advanced problems.
- Debugging problems.
- Output prediction.
- Mini projects.
- Final challenge.
- Interview questions.
- YouTube help links.
- Community room.
- Match question pool.
- Certificate rule.

---

## 199. Detailed C Language Folder Blueprint

C language folder should include:

- README.
- Overview.
- Setup.
- Day 1 Introduction.
- Day 2 Variables And Data Types.
- Day 3 Input Output.
- Day 4 Operators.
- Day 5 Conditions.
- Day 6 Loops Part 1.
- Day 7 Loops Part 2.
- Day 8 Functions.
- Day 9 Arrays Part 1.
- Day 10 Arrays Part 2.
- Day 11 Strings.
- Day 12 Pointers Basics.
- Day 13 Pointers And Arrays.
- Day 14 Recursion.
- Day 15 Structures.
- Day 16 Unions And Enums.
- Day 17 File Handling.
- Day 18 Dynamic Memory.
- Day 19 Sorting.
- Day 20 Searching.
- Day 21 Debugging.
- Day 22 Mini Project 1.
- Day 23 Problem Set 1.
- Day 24 Problem Set 2.
- Day 25 Concept Test.
- Day 26 Coding Challenge.
- Day 27 Mini Project 2.
- Day 28 Revision.
- Day 29 Final Mock Test.
- Day 30 Certification Challenge.
- Questions.
- Hints.
- Solutions.
- YouTube Links.
- Tests.
- Projects.
- Community.

Each day should include:

- Goal.
- Theory.
- Subtopics.
- Examples.
- Practice.
- Points.
- Hints.
- YouTube help.
- Completion rule.

---

## 200. Detailed Points Policy

Points should be transparent.

Point sources:

- Completing lesson.
- Correct answer.
- First attempt correct.
- Solving without hint.
- Completing daily goal.
- Completing test.
- Winning match.
- Helping community.
- Completing event.

Point reductions:

- Using multiple hints.
- Repeating same question.
- Very late submission in timed mode.
- Wrong answer in negative marking test.
- Suspicious attempt held for review.

Point display:

- Show points earned after answer.
- Show why points were reduced.
- Show progress to next level.

---

## 201. Detailed Level Unlock Policy

Level unlock examples:

- Level 1: Basic profile and first badge.
- Level 2: Daily challenge.
- Level 3: Community answer option.
- Level 4: Chapter mastery badge.
- Level 5: Weekly leaderboard.
- Level 6: Advanced practice.
- Level 7: Mini challenge.
- Level 8: Revision analytics.
- Level 9: Pre-match training.
- Level 10: Matching unlock.
- Level 15: Advanced leaderboard.
- Level 20: Expert path.
- Level 30: Elite learner badge.

Level should unlock motivation, not unfair advantage.

---

## 202. Detailed Streak Policy

Daily streak requires one of:

- Complete one lesson.
- Solve minimum number of questions.
- Earn minimum daily XP.
- Complete a revision task.
- Attempt a test.

Daily streak should not count:

- Only logging in.
- Only opening dashboard.
- Only watching one video without practice.

Streak recovery:

- Streak freeze.
- Limited recovery challenge.
- Parent/teacher approved absence later.

---

## 203. Detailed Match Mode Policy

Match mode should be unlocked at Level 10.

Before matching:

- User selects class/path.
- User selects subject/language.
- User selects chapter.
- User selects topic if available.
- User sees rules.
- User confirms ready.

Matching conditions:

- Same class for school mode.
- Same engineering language for language mode.
- Similar chapter/topic.
- Similar level.
- Similar trust score where possible.

Winner calculation:

- Correct answers.
- Points.
- Speed.
- Accuracy.
- Difficulty.
- Penalties.

Rewards:

- XP.
- Rank points.
- Badge progress.
- Leaderboard improvement.

Not allowed:

- Cash staking.
- Deposit-to-win.
- User-funded 1.7x payout.

---

## 204. Detailed Event Portal Policy

Event portal should support:

- School quiz.
- College coding competition.
- DSA contest.
- Debugging competition.
- Language-specific contest.
- Department-level event.
- Hackathon.
- Aptitude test.
- Placement mock.

Organizer setup:

- Institution name.
- Organizer contact.
- Event title.
- Event type.
- Eligibility.
- Schedule.
- Rules.
- Registration form.
- Question pool.
- Safe browser mode.
- Result policy.
- Certificate policy.

Event should have these statuses:

- Draft.
- Under review.
- Approved.
- Registration open.
- Registration closed.
- Waiting room open.
- Live.
- Submitted.
- Review pending.
- Result published.
- Certificates issued.
- Archived.

---

## 205. Detailed Safe Browser Policy

Safe browser should be required for serious competitions.

Safe browser rules:

- Only competition URL allowed.
- No extra tabs.
- No copy-paste where possible.
- No external navigation.
- Device check before event.
- Trial run before event.
- Clear instructions.
- Support contact.

Important limitation:

- No online exam system can stop every external cheating method.
- Safe browser should be combined with randomization, timing, identity checks, server logs, and manual review.

---

## 206. Detailed Community Folder Blueprint

Community folder should include:

- README.
- Class 9.
- Class 10.
- Class 11.
- Class 12.
- Engineering.
- Events.
- Announcements.
- Doubts.
- Mentors.
- Moderation.
- Reports.

Class community should include:

- General room.
- Subject rooms.
- Chapter rooms.
- Doubt rooms.
- Test discussion.
- Event discussion.

Engineering community should include:

- Language rooms.
- DSA room.
- Web development room.
- Project room.
- Placement room.
- Debugging room.

Moderation should include:

- Report queue.
- Spam detection.
- Abuse detection.
- Cheating request detection.
- Moderator action logs.

---

## 207. Detailed Sound And Feedback Policy

Sound feedback:

- Correct answer sound.
- Wrong answer sound.
- Level up sound.
- Streak sound.
- Match found sound.
- Timer warning sound.
- Certificate unlock sound.

Rules:

- User can mute sound.
- Sound should be short.
- Sound should not embarrass student.
- Visual feedback must also exist.
- Competition mode should use subtle sounds only.

---

## 208. Detailed Animation And Simulation Policy

Animations should help learning.

Good uses:

- Explaining motion.
- Showing graphs.
- Showing chemistry particles.
- Showing biology diagrams.
- Showing pointer memory.
- Showing sorting.
- Showing recursion.
- Showing network packets.

Bad uses:

- Random decorative motion.
- Distracting loops.
- Heavy animations in tests.
- Animations that slow mobile.

Simulation rule:

- Every simulation should have learning purpose.
- Every simulation should have reset option.
- Every simulation should work on mobile where possible.

---

## 209. Detailed Admin Workflows

### 209.1 Content Publish Workflow

Steps:

- Draft created.
- Subject reviewer checks.
- Editor checks clarity.
- Video reviewer checks link.
- Admin approves.
- Content published.
- Student reports monitored.

### 209.2 Event Approval Workflow

Steps:

- Organizer creates event.
- Admin checks rules.
- Admin checks prize wording.
- Admin checks question pool.
- Admin checks safe browser setting.
- Event approved.

### 209.3 Fraud Review Workflow

Steps:

- Signal generated.
- Risk score calculated.
- Reviewer checks logs.
- Reviewer decides action.
- Action is logged.
- User/organizer notified if needed.

---

## 210. Detailed Reports And Exports

Student exports:

- Progress report.
- Certificate.
- Mistake notebook.
- Test result.

Parent exports:

- Weekly report.
- Monthly report.
- Payment history.

Teacher exports:

- Class progress.
- Test scores.
- Weak topic list.

Organizer exports:

- Participant list.
- Attendance.
- Leaderboard.
- Suspicious activity report.
- Certificates.

Admin exports:

- User report.
- Payment report.
- Content report.
- Event report.
- Moderation report.

---

## 211. Detailed Roadmap By Release

### 211.1 Release 0.1

Goal:

- Basic product skeleton.

Includes:

- Home.
- Auth.
- Dashboard.
- Curriculum structure.
- Class 9 sample.
- Engineering C sample.

### 211.2 Release 0.2

Goal:

- Learning core.

Includes:

- Lessons.
- Questions.
- Points.
- Levels.
- Streak.
- YouTube help.

### 211.3 Release 0.3

Goal:

- Testing and progress.

Includes:

- Practice tests.
- Results.
- Mistake notebook.
- Weak topic recommendations.

### 211.4 Release 0.4

Goal:

- Community and admin.

Includes:

- Community rooms.
- Moderation.
- Admin content manager.

### 211.5 Release 0.5

Goal:

- Monetization.

Includes:

- Premium.
- Learning credits.
- Invoices.
- Refund process.

### 211.6 Release 0.6

Goal:

- Events beta.

Includes:

- Organizer portal.
- Registration.
- Event test.
- Leaderboard.
- Certificates.

### 211.7 Release 0.7

Goal:

- Matching beta.

Includes:

- Level 10 unlock.
- Matchmaking.
- Match room.
- Rank points.

### 211.8 Release 1.0

Goal:

- Public launch.

Includes:

- Stable mobile UX.
- Security review.
- Content review.
- Performance review.
- Support process.

---

## 212. Detailed Definition Of Done

A feature is done only when:

- It has clear user purpose.
- It has folder placement.
- It has English comments in future source files.
- It works on mobile.
- It handles loading state.
- It handles empty state.
- It handles error state.
- It has access control.
- It has basic tests.
- It has admin visibility where needed.
- It has audit logs if sensitive.
- It is documented.

---

## 213. Final Version 6 Closing

This Version 6 addendum improves the MCP with more exact folder detail, backend responsibilities, class folder contents, engineering folder contents, C language folder blueprint, points policy, level policy, streak policy, match policy, event policy, safe browser policy, community blueprint, admin workflows, reports, release roadmap, and definition of done.

The document is now detailed enough to start serious planning, design, and development without needing to repeat the original idea again.

---

## 214. Deep Expansion Version 7: Execution-Ready PRD, Backlog, And Delivery Addendum

This Version 7 addendum makes the MCP more execution-ready. It turns the product idea into a product requirements document style plan with backlog items, user stories, acceptance gates, folder README templates, sprint planning, and content production workflow.

This addendum still contains no implementation code.

---

## 215. Product Requirements Document Summary

### 215.1 Product Name Placeholder

Temporary name:

- Education Skill Arena.

Final name can be changed later.

### 215.2 Product Category

Category:

- Education technology.
- Coding practice.
- Skill competition.
- Safe event hosting.
- Student community.

### 215.3 Primary Problem

Students often do not know:

- What to study next.
- Which topic is weak.
- How to practice after theory.
- How to stay consistent.
- How to compete fairly.
- Where to get explanation after failing a question.

### 215.4 Product Solution

The platform provides:

- Structured class-wise and engineering learning paths.
- Lessons followed by practice.
- Points, levels, streaks, and badges.
- YouTube help links below questions.
- Tests and result review.
- Safe college event competitions.
- Class/language-specific communities.
- Minimal dashboard that always shows the next step.

### 215.5 Core Differentiation

The platform is different because:

- It combines school learning and engineering coding.
- It has day-wise coding language roadmaps.
- It has class/subject/chapter-level matching.
- It has a safe event portal for colleges.
- It adds YouTube help under questions for all classes and engineering.
- It has strict folder separation and maintainability rules.
- It avoids illegal hidden betting mechanics.

---

## 216. Definition Of Ready

A feature is ready for development only when:

- The user problem is clear.
- The target user is clear.
- The page or module is identified.
- The folder location is identified.
- The data needed is listed.
- The API behavior is described.
- The empty/loading/error states are described.
- The acceptance criteria are written.
- The legal or safety concerns are checked.
- The design direction is clear.

If any of these are missing, the feature should stay in planning.

---

## 217. MVP User Stories

### 217.1 Authentication Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| AUTH-1 | As a student, I want to sign up so I can start learning. | Must | User can create account and reach onboarding. |
| AUTH-2 | As a student, I want to sign in so I can continue progress. | Must | User can login and see dashboard. |
| AUTH-3 | As a student, I want to choose my class or engineering path. | Must | User profile stores selected learning track. |
| AUTH-4 | As a parent, I want minor accounts to be safer. | Later | Parent consent and controls are planned. |

### 217.2 Learning Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| LEARN-1 | As a student, I want to see my class subjects separately. | Must | Subjects are shown in separate areas. |
| LEARN-2 | As a student, I want to open a chapter and see topics. | Must | Chapter page lists topics and progress. |
| LEARN-3 | As a student, I want to study theory before questions. | Must | Lesson shows theory first, then practice. |
| LEARN-4 | As a student, I want YouTube help after trying. | Must | Video link appears according to mode rules. |
| LEARN-5 | As an engineering learner, I want a 30-day C plan. | Must | C roadmap shows Day 1 to Day 30. |

### 217.3 Progress Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| PROG-1 | As a student, I want points after correct answers. | Must | Points appear after valid answer. |
| PROG-2 | As a student, I want levels to increase. | Must | XP moves user toward next level. |
| PROG-3 | As a student, I want a daily streak. | Must | Streak updates after real learning activity. |
| PROG-4 | As a student, I want weak topics shown. | Should | Dashboard recommends revision topics. |

### 217.4 Test Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| TEST-1 | As a student, I want to attempt a topic quiz. | Must | Quiz starts, records answers, shows result. |
| TEST-2 | As a student, I want a chapter test. | Should | Chapter test uses selected chapter questions. |
| TEST-3 | As a student, I want explanations after test. | Must | Result review shows explanation and video help. |

### 217.5 Community Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| COMM-1 | As a student, I want to ask doubts in my class room. | Should | User can post in class community. |
| COMM-2 | As a student, I want subject-specific rooms. | Should | Rooms exist by class and subject. |
| COMM-3 | As a moderator, I want to review reports. | Must for community launch | Report queue exists conceptually and operationally. |

### 217.6 Event Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| EVENT-1 | As an organizer, I want to create an event. | Later MVP | Event draft can be created. |
| EVENT-2 | As an organizer, I want a registration form. | Later MVP | Participants can register. |
| EVENT-3 | As an organizer, I want safe browser mode. | Later | Safe browser settings are planned. |
| EVENT-4 | As a participant, I want event rules clearly shown. | Later MVP | Event page displays rules before join. |

### 217.7 Matching Stories

| ID | User Story | Priority | Acceptance |
|---|---|---|---|
| MATCH-1 | As a Level 10 user, I want matching unlocked. | Later | Level 10 unlock state appears. |
| MATCH-2 | As a student, I want same-class matching. | Later | Class 9 matches Class 9 only in class mode. |
| MATCH-3 | As a learner, I want topic-based matching. | Later | Match uses subject, chapter, topic. |
| MATCH-4 | As a platform owner, I do not want illegal cash staking. | Must | Matching rewards are XP/rank/sponsor-safe only. |

---

## 218. MVP Development Backlog

### 218.1 Foundation Backlog

Backlog items:

- Create project structure.
- Create root documentation.
- Create frontend folder.
- Create backend folder.
- Create content folder.
- Create class folders.
- Create engineering folder.
- Create dashboard folder.
- Create test folder.
- Create auth folder.
- Create community folder.
- Create events folder.
- Create admin folder.
- Add README to every folder.
- Add comment policy document.

### 218.2 Learning Backlog

Backlog items:

- Create Class 9 subject structure.
- Create Class 10 subject structure.
- Create Engineering language structure.
- Create C Language 30-day roadmap.
- Create lesson template.
- Create question template.
- Create YouTube link template.
- Create points policy.
- Create level policy.
- Create streak policy.

### 218.3 Dashboard Backlog

Backlog items:

- Define dashboard widgets.
- Define continue learning widget.
- Define level widget.
- Define streak widget.
- Define weak topic widget.
- Define test widget.
- Define event widget.
- Define subscription/credits widget.

### 218.4 Admin Backlog

Backlog items:

- Define content admin flow.
- Define question review flow.
- Define video review flow.
- Define event approval flow.
- Define user management flow.
- Define moderation flow.
- Define finance review flow.

---

## 219. Suggested 8-Week MVP Sprint Plan

### 219.1 Week 1: Foundation

Focus:

- Project architecture.
- Folder structure.
- README standards.
- Product rules.
- Auth planning.
- Curriculum data planning.

Deliverables:

- Clean folder map.
- Documentation skeleton.
- User role list.
- Initial class/engineering taxonomy.

### 219.2 Week 2: Auth And Onboarding

Focus:

- Sign in.
- Sign up.
- Class selection.
- Engineering selection.
- Profile creation.

Deliverables:

- User can choose learning path.
- Dashboard can identify user path.

### 219.3 Week 3: Curriculum And C Roadmap

Focus:

- Class pages.
- Subject structure.
- Engineering page.
- C Language 30-day roadmap.

Deliverables:

- Class 9 and Class 10 structure visible.
- Engineering C path visible.

### 219.4 Week 4: Lesson And Question Flow

Focus:

- Lesson template.
- Theory display.
- Question display.
- Answer submission behavior.
- YouTube help visibility.

Deliverables:

- User can complete a lesson and answer questions.

### 219.5 Week 5: Points, Levels, Streaks

Focus:

- XP logic.
- Level progress.
- Daily streak.
- Dashboard progress widgets.

Deliverables:

- User sees progress after learning.

### 219.6 Week 6: Tests And Results

Focus:

- Topic quiz.
- Chapter test.
- Result review.
- Mistake notebook.

Deliverables:

- User can take a test and review mistakes.

### 219.7 Week 7: Admin And Content Workflow

Focus:

- Content review planning.
- Question review planning.
- Video review planning.
- Admin dashboard planning.

Deliverables:

- Content team can manage learning material conceptually.

### 219.8 Week 8: Polish And Pilot

Focus:

- Mobile polish.
- QA.
- Accessibility.
- First pilot content.
- First feedback cycle.

Deliverables:

- MVP ready for small student pilot.

---

## 220. Folder README Template

Every folder README should follow this no-code template:

### 220.1 Folder Name

Write the folder name.

### 220.2 Purpose

Explain what this folder is for in simple English.

### 220.3 Owner

Mention who owns this folder.

### 220.4 What Belongs Here

List allowed files and subfolders.

### 220.5 What Does Not Belong Here

List things that should not be placed here.

### 220.6 Naming Rules

Explain naming format.

### 220.7 Comment Rules

Explain what comments future files need.

### 220.8 Testing Rules

Explain how this folder should be tested.

### 220.9 Related Folders

Mention connected folders.

### 220.10 Last Updated

Add date when this folder documentation was updated.

---

## 221. First MVP Content Pack

The first MVP should not attempt all content. It should launch with a small but polished content pack.

### 221.1 Class 9 Starter Pack

Include:

- Mathematics: Number Systems starter lesson.
- Science: Motion starter lesson.
- English: Grammar starter lesson.
- 20 to 50 starter questions.
- YouTube help links.
- One topic quiz.

### 221.2 Class 10 Starter Pack

Include:

- Mathematics: Real Numbers starter lesson.
- Science: Electricity starter lesson.
- Social Science: one starter summary.
- 20 to 50 starter questions.
- YouTube help links.
- One chapter test.

### 221.3 Engineering Starter Pack

Include:

- C Language Day 1 to Day 5.
- Basic questions.
- Output prediction.
- Debugging questions.
- YouTube links.
- One Day 1 quiz.

### 221.4 Dashboard Starter Pack

Include:

- Continue learning.
- Level.
- Streak.
- Points.
- Next lesson.
- Weak topic placeholder.

---

## 222. First C Language Day 1 Detailed Content Package

Day 1 should include:

- What is programming?
- What is C language?
- Why C is important?
- What is compiler?
- What is source code?
- What is output?
- What is program structure?
- What is a syntax error?
- What is a beginner mistake?

Day 1 practice should include:

- Identify correct output.
- Identify missing symbol.
- Identify compiler role.
- Fill simple concept blank.
- Solve first print-style task.

Day 1 points:

- Easy MCQ: 1 or 2 XP.
- Short answer: 2 XP.
- Debugging easy: 4 XP.
- First coding task: 5 XP.
- Day completion bonus: 10 XP.

Day 1 YouTube help:

- Show after first attempt in practice.
- Hide during Day 1 quiz.
- Show after quiz result.

---

## 223. First Class 9 Mathematics Starter Package

Topic:

- Number Systems.

Subtopics:

- Natural numbers.
- Whole numbers.
- Integers.
- Rational numbers.
- Irrational numbers.
- Real numbers.
- Number line.

Practice:

- Identify number type.
- Convert fraction to decimal.
- Place number on number line.
- Compare numbers.
- Short explanation.

Visuals:

- Number line.
- Number family chart.

YouTube help:

- One basic concept video.
- One solved example video.
- One practice video.

---

## 224. First Class 10 Science Starter Package

Topic:

- Electricity.

Subtopics:

- Electric current.
- Potential difference.
- Resistance.
- Ohm's law.
- Series circuit.
- Parallel circuit.

Practice:

- Formula identification.
- Simple numerical.
- Concept MCQ.
- Diagram-based question.
- Assertion-reason question.

Visuals:

- Circuit diagram.
- Current flow animation.
- Ohm's law graph.

YouTube help:

- Concept video.
- Numericals video.
- Diagram explanation video.

---

## 225. Detailed MVP QA Gate

MVP cannot be released until:

- Signup works.
- Signin works.
- User can select class/path.
- Dashboard loads.
- At least one lesson opens.
- At least one question can be answered.
- Points update.
- Level progress updates.
- Streak updates.
- YouTube help rule works.
- Test result page works.
- Mobile layout is readable.
- The approved TypeScript and Node.js direction is used.
- No implementation code exists in this MCP file.
- No hidden betting mechanic exists.

---

## 226. Detailed Event Pilot Plan

First event pilot should be simple.

Suggested first pilot:

- C Language beginner quiz.
- 30 to 100 participants.
- No cash staking.
- Certificate for participation.
- Sponsor-funded top-rank recognition if available.
- Safe browser optional for first low-stakes pilot.
- Manual result review.

Pilot event checklist:

- Organizer identified.
- Rules written.
- Questions reviewed.
- Registration tested.
- Timer tested.
- Leaderboard tested.
- Result review tested.
- Certificates tested.
- Support contact ready.

---

## 227. Detailed Match Pilot Plan

First match pilot should be practice-only.

Suggested first match:

- C Language Day 1 quiz battle.
- Level 10 requirement can be simulated during beta.
- No money.
- XP reward only.
- Same topic.
- Same difficulty.
- 5 questions.
- Result with explanations.

Match pilot checklist:

- Queue works.
- Opponent matching works.
- Timer works.
- Score works.
- Result works.
- No cash stake exists.
- Anti-cheat logs basic signals.

---

## 228. Detailed Founder Pitch Points

Founder can describe the platform as:

- A learning platform where every student gets a daily path.
- A coding roadmap platform for engineering learners.
- A gamified study platform with points, levels, and streaks.
- A safe competition portal for colleges.
- A community platform for class-wise and language-wise doubts.
- A progress platform for parents and teachers.
- A legally safer alternative to money-game style competition.

Avoid pitching it as:

- A betting platform.
- A cash battle app.
- A gambling-style matching app.
- A shortcut to earn money.

---

## 229. Detailed Investor/Partner Questions To Prepare

Prepare answers for:

- Who is the first target user?
- Which class launches first?
- Which engineering language launches first?
- How is content quality controlled?
- How does the platform make money?
- How are competitions kept fair?
- How is student safety handled?
- How are legal risks avoided?
- How does the platform retain users?
- What makes this different from existing learning apps?

---

## 230. Final Version 7 Closing

This Version 7 addendum improves the MCP by adding PRD structure, user stories, MVP backlog, sprint plan, folder README template, starter content packs, QA gates, event pilot plan, match pilot plan, and founder pitch clarity.

The MCP is now not only a product idea document. It is also a planning document that can guide first development, design, content creation, pilot testing, and partner discussions.

---

## 231. Deep Expansion Version 8: Screen-by-Screen Functional Specification

This Version 8 addendum improves the MCP by adding screen-level functional detail. It explains exactly what each important screen should show, what actions the user can take, what states the screen should support, what permissions apply, and what the screen must avoid.

This section is useful for:

- UI designers.
- Frontend developers.
- Backend developers.
- QA testers.
- Product managers.
- Founders.
- Content teams.

This addendum still contains no implementation code.

---

## 232. Master Screen Groups

The platform should be divided into these screen groups:

- Public screens.
- Authentication screens.
- Student learning screens.
- Student progress screens.
- Test screens.
- Match screens.
- Event screens.
- Community screens.
- Dashboard screens.
- Payment and credit screens.
- Organizer screens.
- Admin screens.
- Support screens.
- Legal screens.

Each screen group should have:

- Clear purpose.
- Clear owner.
- Clear user role.
- Clear states.
- Clear empty state.
- Clear error state.
- Clear mobile behavior.
- Clear acceptance criteria.

---

## 233. Public Home Screen Specification

### 233.1 Purpose

The public home screen should help a new visitor understand the platform within a few seconds.

### 233.2 Main Sections

The home screen should include:

- Simple top navigation.
- Clear platform name.
- One-line value proposition.
- Class 9, 10, 11, 12 entry cards.
- Engineering entry card.
- Event portal preview.
- Community preview.
- Sign up button.
- Sign in button.
- Pricing preview.
- Trust/safety note.

### 233.3 Primary Actions

User can:

- Open Class 9 overview.
- Open Class 10 overview.
- Open Class 11 overview.
- Open Class 12 overview.
- Open Engineering overview.
- Sign up.
- Sign in.
- View events.
- View pricing.

### 233.4 States

States:

- Visitor not logged in.
- Logged-in student returning.
- Logged-in organizer returning.
- Loading.
- Error.

### 233.5 Must Avoid

Avoid:

- Too much marketing text.
- Fake income promises.
- Betting language.
- Confusing hero sections.
- Too many buttons.
- Heavy animations that slow mobile.

### 233.6 Acceptance Criteria

Home screen is accepted when:

- A new user understands what the site does.
- User can choose class or engineering.
- User can sign up clearly.
- Mobile layout is readable.
- No illegal money-game promise appears.

---

## 234. Class Overview Screen Specification

This applies to Class 9, Class 10, Class 11, and Class 12 overview screens.

### 234.1 Purpose

The class overview screen should show all available subjects and help the student select the correct learning path.

### 234.2 Main Sections

Each class overview should include:

- Class title.
- Short class description.
- Subject cards.
- Progress summary if logged in.
- Recommended subject if logged in.
- Tests section.
- Community link.
- YouTube help policy note.
- Continue learning button.

### 234.3 Primary Actions

User can:

- Open subject.
- Continue last lesson.
- Start first lesson.
- Open tests.
- Open community.
- View progress.

### 234.4 States

States:

- Not logged in preview.
- Logged-in no progress.
- Logged-in with progress.
- All subjects locked due to profile mismatch.
- Loading.
- Error.

### 234.5 Acceptance Criteria

Class overview is accepted when:

- Every subject is visibly separate.
- Student can open subject page.
- Progress appears for logged-in user.
- Community and test links exist.
- UI remains minimal and clear.

---

## 235. Subject Screen Specification

### 235.1 Purpose

The subject screen should show all chapters for a specific subject.

### 235.2 Main Sections

Subject screen should include:

- Subject title.
- Progress bar.
- Chapter list.
- Recommended next chapter.
- Weak chapter section.
- Tests.
- Revision.
- Printable worksheets.
- Related community room.

### 235.3 Primary Actions

User can:

- Open chapter.
- Start recommended chapter.
- Take subject test.
- Download printable if allowed.
- Open subject community.
- Review weak chapters.

### 235.4 Chapter Card Should Show

Each chapter card should show:

- Chapter name.
- Completion percentage.
- Number of lessons.
- Number of questions.
- Difficulty.
- Estimated time.
- Test availability.
- Locked/unlocked status.

### 235.5 Acceptance Criteria

Subject screen is accepted when:

- Chapters are separate.
- Progress is clear.
- Next action is obvious.
- Weak areas are visible.
- User can navigate to lesson or test.

---

## 236. Chapter Screen Specification

### 236.1 Purpose

The chapter screen should break a chapter into topics and subtopics.

### 236.2 Main Sections

Chapter screen should include:

- Chapter title.
- Chapter summary.
- Topic list.
- Subtopic progress.
- Chapter formulas or key points.
- Practice section.
- Chapter test.
- YouTube help library.
- Mistake review.

### 236.3 Primary Actions

User can:

- Start topic.
- Continue topic.
- Practice chapter questions.
- Take chapter test.
- Review mistakes.
- Open help videos.

### 236.4 Acceptance Criteria

Chapter screen is accepted when:

- Topics are clear.
- Subtopics are visible.
- Practice is connected to topic.
- Chapter test exists or is planned.
- Help videos are mapped.

---

## 237. Lesson Screen Specification

### 237.1 Purpose

The lesson screen should teach one small concept and immediately give practice.

### 237.2 Main Sections

Lesson screen should include:

- Lesson title.
- Learning objective.
- Estimated time.
- Progress stepper.
- Theory section.
- Visual or simulation if available.
- Example.
- Question block.
- Hint block.
- Feedback block.
- YouTube help block.
- Summary.
- Next lesson button.

### 237.3 Lesson Flow

Flow:

1. Student reads objective.
2. Student reads theory.
3. Student sees example.
4. Student answers question.
5. Student gets feedback.
6. Student sees explanation.
7. Student can open YouTube help when allowed.
8. Student earns points.
9. Student completes lesson.
10. Student sees next action.

### 237.4 States

States:

- Not started.
- In progress.
- Question active.
- Correct answer.
- Wrong answer.
- Hint used.
- Video help available.
- Completed.
- Network issue.
- Content unavailable.

### 237.5 Acceptance Criteria

Lesson screen is accepted when:

- Student can learn and practice without confusion.
- Question feedback works.
- Points appear.
- YouTube link visibility follows rules.
- Next action is clear.

---

## 238. Question Component Specification

### 238.1 Purpose

The question component should deliver questions consistently across lesson, practice, test, match, and event modes.

### 238.2 Required Display Fields

Question component should show:

- Question text.
- Question type.
- Difficulty.
- Points.
- Answer input area.
- Submit button.
- Timer if mode requires it.
- Hint button if mode allows it.
- Feedback after submission.
- Explanation after submission.
- YouTube help after allowed trigger.

### 238.3 Mode Differences

Learning mode:

- Hints allowed.
- Feedback immediate.
- YouTube allowed after attempt.

Practice mode:

- Hints allowed.
- Feedback immediate.
- YouTube after first attempt.

Test mode:

- Hints hidden unless test allows.
- YouTube hidden until submission.
- Feedback after test.

Match mode:

- Hints hidden.
- YouTube hidden until match ends.
- Feedback after round or match.

Event mode:

- Hints hidden by default.
- YouTube hidden during event.
- Result visibility controlled by organizer.

### 238.4 Acceptance Criteria

Question component is accepted when:

- Same component logic can support multiple modes conceptually.
- No answer leaks before submission.
- Points display is clear.
- Help visibility follows mode.

---

## 239. Engineering Overview Screen Specification

### 239.1 Purpose

Engineering overview should show languages, skill tracks, projects, and placement paths.

### 239.2 Main Sections

Engineering overview should include:

- Programming languages.
- DSA.
- Web development.
- Backend development.
- Database.
- CS fundamentals.
- AI/ML.
- Projects.
- Placement preparation.
- Coding matches.
- Engineering community.

### 239.3 Primary Actions

User can:

- Open a language.
- Open DSA path.
- Open web path.
- Open project path.
- Continue current engineering roadmap.
- Join engineering community.

### 239.4 Acceptance Criteria

Engineering overview is accepted when:

- Languages are separate.
- C Language path is visible.
- Skills are separate from languages.
- User can start a roadmap.

---

## 240. Language Roadmap Screen Specification

### 240.1 Purpose

The language roadmap screen should show the complete day-wise plan for a language.

### 240.2 Main Sections

Language roadmap should include:

- Language name.
- Why learn this language.
- Roadmap duration.
- Day cards.
- Progress.
- Projects.
- Tests.
- Community.
- Certificate requirement.

### 240.3 Day Card Fields

Each day card should show:

- Day number.
- Day title.
- Topics.
- Estimated time.
- Questions count.
- Points available.
- Completion status.
- Locked/unlocked status.

### 240.4 Acceptance Criteria

Language roadmap is accepted when:

- User can see all days.
- User can open Day 1.
- Progress is visible.
- Day structure is consistent.

---

## 241. C Language Day Screen Specification

### 241.1 Purpose

C Language day screen should teach one day's content in a focused way.

### 241.2 Main Sections

Day screen should include:

- Day title.
- Goal.
- Subtopics.
- Theory.
- Examples.
- Practice questions.
- Debugging questions.
- Output prediction.
- YouTube help.
- Day quiz.
- Completion reward.

### 241.3 Day Completion Rule

Day is complete when:

- Required theory is viewed.
- Required practice questions are attempted.
- Minimum XP is earned.
- Day quiz is attempted.
- Summary is viewed.

### 241.4 Acceptance Criteria

C Day screen is accepted when:

- Student knows what to study.
- Student can practice.
- Student gets XP.
- Student sees next day.

---

## 242. Dashboard Screen Specification

### 242.1 Purpose

Dashboard should be the student's command center.

### 242.2 Main Sections

Dashboard should include:

- Continue learning.
- Today's goal.
- Level progress.
- Streak.
- Points.
- Weak topics.
- Upcoming tests.
- Upcoming events.
- Community replies.
- Certificates.
- Subscription/credits.

### 242.3 Primary Action Rule

Dashboard should always show one main recommended action.

Examples:

- Continue C Language Day 2.
- Revise Class 10 Electricity.
- Take today's quiz.
- Complete streak goal.

### 242.4 Acceptance Criteria

Dashboard is accepted when:

- User instantly knows what to do next.
- Progress is visible.
- No unnecessary clutter appears.
- Mobile dashboard is readable.

---

## 243. Test Screen Specification

### 243.1 Purpose

Test screen should provide focused assessment.

### 243.2 Main Sections

Test screen should include:

- Instructions.
- Timer.
- Question number.
- Answer area.
- Question navigation.
- Save status.
- Submit button.
- Warning before final submit.

### 243.3 Test Rules

Test should:

- Use server-side timer.
- Hide YouTube help during attempt.
- Save answers.
- Prevent accidental submit.
- Show result according to test policy.

### 243.4 Acceptance Criteria

Test screen is accepted when:

- Timer works conceptually.
- User can answer and submit.
- Result review is available.
- YouTube help appears only after allowed stage.

---

## 244. Result Screen Specification

### 244.1 Purpose

Result screen should teach from mistakes.

### 244.2 Main Sections

Result screen should include:

- Score.
- Accuracy.
- Time taken.
- Points earned.
- Correct answers.
- Wrong answers.
- Explanations.
- YouTube help links.
- Weak topics.
- Retry/revision recommendations.

### 244.3 Acceptance Criteria

Result screen is accepted when:

- User understands performance.
- Mistakes are clear.
- Revision path is suggested.
- Help links are visible.

---

## 245. Match Screen Specification

### 245.1 Purpose

Match screen should create fair skill-based learning battles.

### 245.2 Main Sections

Match screen should include:

- Eligibility status.
- Level requirement.
- Subject/language selector.
- Chapter selector.
- Topic selector.
- Match rules.
- Start search button.
- Recent match history.

### 245.3 Match Room Should Show

Match room should show:

- Opponent display name.
- Current question.
- Timer.
- Your score.
- Opponent score.
- Round progress.
- Submit button.
- Result after round.

### 245.4 Acceptance Criteria

Match screen is accepted when:

- Only eligible users can enter.
- Matching rules are clear.
- No cash staking exists.
- Result is fair and auditable.

---

## 246. Event Screen Specification

### 246.1 Purpose

Event screen should let students register and participate in competitions.

### 246.2 Public Event Page Sections

Event page should include:

- Event title.
- Organizer.
- Date and time.
- Eligibility.
- Rules.
- Registration button.
- Safe browser requirement.
- Prize/certificate details.
- Support contact.

### 246.3 Participant Event Dashboard

Participant event dashboard should include:

- Registered events.
- Event status.
- Device check.
- Waiting room.
- Join button.
- Result status.
- Certificate status.

### 246.4 Acceptance Criteria

Event screen is accepted when:

- Rules are clear.
- Registration works conceptually.
- Safe browser requirement is visible.
- Result/certificate flow is clear.

---

## 247. Organizer Dashboard Screen Specification

### 247.1 Purpose

Organizer dashboard should let institutions run events without confusion.

### 247.2 Main Sections

Organizer dashboard should include:

- Active events.
- Draft events.
- Registrations.
- Upcoming event timeline.
- Live monitor.
- Result review.
- Certificates.
- Reports.
- Billing.

### 247.3 Acceptance Criteria

Organizer dashboard is accepted when:

- Organizer can see event status.
- Organizer can manage registrations.
- Organizer can review results.
- Organizer can download reports.

---

## 248. Admin Dashboard Screen Specification

### 248.1 Purpose

Admin dashboard should control platform safety, content, users, events, and finance.

### 248.2 Main Sections

Admin dashboard should include:

- User summary.
- Content review queue.
- Question reports.
- Event approval queue.
- Community reports.
- Payment issues.
- Fraud flags.
- System health.

### 248.3 Acceptance Criteria

Admin dashboard is accepted when:

- Admin can find important issues quickly.
- Review queues are visible.
- Sensitive actions are auditable.
- Roles are respected.

---

## 249. Community Screen Specification

### 249.1 Purpose

Community screen should help students ask doubts and learn together safely.

### 249.2 Main Sections

Community screen should include:

- Class rooms.
- Subject rooms.
- Engineering language rooms.
- Event rooms.
- Search.
- Ask doubt button.
- Solved filter.
- Helpful answers.
- Report button.

### 249.3 Post Screen Should Include

Post screen should include:

- Question/doubt.
- Related class/subject/topic.
- Replies.
- Accepted answer.
- Helpful votes.
- Related lesson.
- Related YouTube help.
- Report option.

### 249.4 Acceptance Criteria

Community is accepted when:

- Users can ask and answer.
- Moderation exists.
- Abuse can be reported.
- Cheating requests can be removed.

---

## 250. Payment And Credits Screen Specification

### 250.1 Purpose

Payment and credits screens should be transparent and legally safe.

### 250.2 Main Sections

Payment/credits screen should include:

- Premium plan.
- Learning credit balance.
- Credit usage history.
- Payment history.
- Invoices.
- Refund help.
- Spending controls.

### 250.3 Must Clearly Say

The screen should clearly communicate:

- Learning credits are not withdrawable.
- Learning credits are not betting tokens.
- Learning credits are for platform learning features.
- Matching does not support cash staking.

### 250.4 Acceptance Criteria

Payment screen is accepted when:

- Pricing is clear.
- Payment purpose is clear.
- Credits are transparent.
- No illegal payout promise exists.

---

## 251. Support Screen Specification

### 251.1 Purpose

Support screen should help users resolve problems.

### 251.2 Support Categories

Categories:

- Login issue.
- Payment issue.
- Subscription issue.
- Content mistake.
- Wrong answer.
- Event issue.
- Safe browser issue.
- Certificate issue.
- Community report.

### 251.3 Acceptance Criteria

Support screen is accepted when:

- User can submit issue.
- Issue category is clear.
- Ticket status can be tracked.
- Admin can respond.

---

## 252. Final Version 8 Closing

This Version 8 addendum improves the MCP with screen-by-screen functional specifications for home, class pages, subject pages, chapters, lessons, questions, engineering, language roadmaps, C day pages, dashboard, tests, results, matching, events, organizer dashboard, admin dashboard, community, payments, and support.

The document now gives a clearer bridge between product idea and actual UI/UX design work.

---

## 253. Deep Expansion Version 9: Operational Playbooks, Data Dictionary, And Governance Addendum

This Version 9 addendum improves the MCP by adding operational detail. It explains how the platform should be governed after it is built: data fields, permissions, content taxonomy, event operations, payment operations, incident handling, accessibility checks, scalability planning, notification design, and founder execution plan.

This addendum still contains no implementation code.

---

## 254. Master Governance Principles

The platform should be governed by these rules:

- Learning must come before monetization.
- Student safety must come before engagement.
- Legal compliance must come before growth.
- Content quality must come before quantity.
- Fair competition must come before excitement.
- Folder clarity must come before speed.
- Auditability must come before admin convenience.
- Minimal UI must come before decorative design.

These principles should be written in the internal team documentation so every future developer and content creator understands the product direction.

---

## 255. Data Dictionary: User And Profile

### 255.1 User

Purpose:

- Represents one account on the platform.

Important fields:

- User ID.
- Full name.
- Display name.
- Email.
- Phone number.
- Password/auth provider reference.
- Primary role.
- Account status.
- Verification status.
- Created date.
- Last login date.
- Last active date.
- Preferred language.
- Timezone.

Rules:

- Display name should be used in public leaderboards.
- Full name should be protected.
- Email and phone should not be public.
- Minor accounts should support guardian linking.

### 255.2 Student Profile

Purpose:

- Stores student learning identity.

Important fields:

- Student ID.
- User ID.
- Class or engineering path.
- Stream.
- Board.
- Subjects.
- Current level.
- Total XP.
- Current streak.
- Longest streak.
- Learning goal.
- Daily target.
- Match eligibility.
- Community reputation.

Rules:

- Student can have one active main learning path.
- Student can add engineering path later if allowed.
- Level should be calculated, not manually edited by normal users.

### 255.3 Parent Profile

Purpose:

- Supports guardian oversight.

Important fields:

- Parent ID.
- User ID.
- Linked student IDs.
- Payment approval setting.
- Match permission setting.
- Community posting permission.
- Event participation permission.
- Weekly report preference.

Rules:

- Parent should not see private community messages unless policy allows.
- Parent should control payments for minors.

### 255.4 Organizer Profile

Purpose:

- Represents college, school, or institution event manager.

Important fields:

- Organizer ID.
- User ID.
- Institution name.
- Institution type.
- Contact person.
- Verification status.
- Billing details.
- Approved event count.
- Risk status.

Rules:

- Organizer should be verified before hosting official paid events.
- Organizer actions should be audit logged.

---

## 256. Data Dictionary: Curriculum And Content

### 256.1 Program

Purpose:

- Top-level learning category.

Examples:

- Class 9.
- Class 10.
- Class 11.
- Class 12.
- Engineering.

Important fields:

- Program ID.
- Program name.
- Program type.
- Description.
- Active status.
- Display order.

### 256.2 Subject Or Language

Purpose:

- Represents a school subject or engineering language.

Important fields:

- Subject/language ID.
- Program ID.
- Name.
- Slug.
- Description.
- Difficulty range.
- Active status.
- Community room reference.

Rules:

- School subjects must map to a class or stream.
- Engineering languages must map to engineering.
- The approved TypeScript and Node.js direction must remain the website implementation stack.

### 256.3 Chapter Or Module

Purpose:

- Groups related topics.

Important fields:

- Chapter ID.
- Subject/language ID.
- Name.
- Order.
- Estimated completion time.
- Difficulty.
- Test availability.
- Revision availability.

### 256.4 Lesson

Purpose:

- Teaches one specific concept.

Important fields:

- Lesson ID.
- Chapter ID.
- Topic ID.
- Title.
- Objective.
- Theory.
- Visual reference.
- Simulation reference.
- Estimated time.
- Review status.
- Published status.

Rules:

- Lesson should have clear objective.
- Lesson should map to at least one question set.
- Lesson should not be published without review.

---

## 257. Data Dictionary: Questions And Attempts

### 257.1 Question

Purpose:

- Stores one practice/test/match/event question.

Important fields:

- Question ID.
- Program.
- Subject/language.
- Chapter.
- Topic.
- Subtopic.
- Question type.
- Question text.
- Difficulty.
- Points.
- Time estimate.
- Correct answer reference.
- Explanation reference.
- Hint references.
- YouTube help reference.
- Match eligible.
- Event eligible.
- Review status.
- Published status.

Rules:

- Every question needs a correct answer.
- Every question needs an explanation.
- Every published question should have difficulty.
- Every competition question must be reviewed.

### 257.2 Question Attempt

Purpose:

- Records a user's attempt.

Important fields:

- Attempt ID.
- User ID.
- Question ID.
- Mode.
- User answer.
- Correct/incorrect status.
- Points awarded.
- Hints used.
- Time taken.
- Attempt number.
- Submitted date.
- Suspicious flag status.

Rules:

- Attempts should be immutable after submission except admin-reviewed correction flows.
- Points changes should use ledger entries.

---

## 258. Data Dictionary: Events And Matching

### 258.1 Match Room

Purpose:

- Represents one live learning battle.

Important fields:

- Match ID.
- Match type.
- Program.
- Subject/language.
- Chapter.
- Topic.
- Player IDs.
- Level range.
- Start time.
- End time.
- Status.
- Winner.
- Review status.

Rules:

- No cash stake.
- No withdrawable reward.
- XP and rank rewards only unless legally reviewed sponsor reward exists.

### 258.2 Event

Purpose:

- Represents one school/college/institution competition.

Important fields:

- Event ID.
- Organizer ID.
- Title.
- Description.
- Event type.
- Eligibility.
- Registration deadline.
- Start time.
- Duration.
- Safe browser mode.
- Question pool.
- Result policy.
- Prize source.
- Certificate template.
- Status.

Rules:

- Event must have clear rules.
- Event must disclose safe browser requirement.
- Event must not promise illegal cash multipliers.

---

## 259. Permission Matrix By Feature

| Feature | Student | Parent | Teacher | Organizer | Moderator | Admin |
|---|---|---|---|---|---|---|
| View lessons | Yes | Child view only | Yes | No | No | Yes |
| Attempt questions | Yes | No | Optional | No | No | Yes |
| Take tests | Yes | No | Create assigned tests | Event tests only | No | Yes |
| Join match | Eligible only | No | No | No | No | Test only |
| Create event | No | No | Limited school mode | Yes | No | Yes |
| Publish event result | No | No | No | Request only | No | Yes/approved organizer |
| Ask community doubt | Yes | No | Yes | Event rooms only | No | Yes |
| Moderate community | No | No | Limited assigned | Event room only | Yes | Yes |
| Manage payments | Own only | Child payment | No | Event billing | No | Finance/admin |
| Edit questions | No | No | Draft only | Event draft only | No | Content admin |
| Publish questions | No | No | No | No | No | Content admin |

---

## 260. Content Tagging Taxonomy

Every question and lesson should be tagged properly.

### 260.1 Required Tags

Required tags:

- Program.
- Class or engineering path.
- Subject or language.
- Chapter.
- Topic.
- Subtopic.
- Difficulty.
- Question type.
- Skill tested.
- Common mistake.
- Exam relevance.

### 260.2 Skill Tags

Skill tags:

- Recall.
- Understanding.
- Application.
- Analysis.
- Debugging.
- Calculation.
- Conceptual reasoning.
- Pattern recognition.
- Code tracing.
- Problem solving.

### 260.3 Common Mistake Tags

Mistake tags:

- Formula confusion.
- Sign error.
- Unit error.
- Syntax error.
- Logic error.
- Misread question.
- Time pressure.
- Guessing.
- Concept gap.
- Calculation error.

### 260.4 Difficulty Calibration

Difficulty should be based on:

- Average solve rate.
- Average time.
- Hint usage.
- First-attempt accuracy.
- Teacher rating.
- Student feedback.

Difficulty can change after real usage data.

---

## 261. Question Review Governance

### 261.1 Review Levels

Review levels:

- Draft.
- Self-reviewed.
- Subject expert reviewed.
- Language/editor reviewed.
- Video reviewed.
- Published.
- Reported.
- Archived.

### 261.2 Wrong Answer Report Flow

Flow:

- Student reports issue.
- Report enters content queue.
- Reviewer checks question.
- Reviewer checks answer.
- Reviewer checks explanation.
- Reviewer checks YouTube link.
- Reviewer marks valid/invalid report.
- If valid, correction is published.
- Affected attempts may be recalculated if needed.

### 261.3 High-Risk Content

High-risk content:

- Board exam questions.
- Event questions.
- Paid tests.
- Certification tests.
- Competitive ranking questions.

High-risk content needs stricter review.

---

## 262. Event Standard Operating Procedure

### 262.1 Event Request Stage

Steps:

- Organizer submits event request.
- Platform reviews institution.
- Platform reviews event purpose.
- Platform confirms event category.
- Platform confirms whether safe browser is needed.
- Platform confirms prize/certificate wording.

### 262.2 Event Setup Stage

Steps:

- Create event draft.
- Configure registration form.
- Configure eligibility.
- Select question pool.
- Configure test duration.
- Configure result policy.
- Configure certificate template.
- Publish event page.

### 262.3 Event Dry Run Stage

Steps:

- Organizer tests registration.
- Participant test account joins.
- Timer is checked.
- Safe browser is checked if used.
- Leaderboard is checked.
- Support process is checked.

### 262.4 Event Live Stage

Steps:

- Waiting room opens.
- Participants join.
- Rules are shown.
- Device/safe browser check runs.
- Competition starts.
- Live monitor watches flags.
- Support handles issues.
- Submissions are locked.

### 262.5 Event Result Stage

Steps:

- Calculate provisional leaderboard.
- Run anti-cheat review.
- Review suspicious attempts.
- Resolve disputes.
- Approve final leaderboard.
- Publish results.
- Issue certificates.
- Export reports.

---

## 263. Payment Operations Playbook

### 263.1 Payment Success Flow

Steps:

- User starts payment.
- Payment provider confirms payment.
- Platform verifies webhook/signature.
- Payment order is marked successful.
- Subscription or learning credits are activated.
- Invoice is generated.
- User is notified.

### 263.2 Payment Failure Flow

Steps:

- Payment fails.
- User sees clear message.
- Payment order is marked failed.
- User can retry.
- No credits/subscription are granted.

### 263.3 Duplicate Payment Flow

Steps:

- Duplicate is detected.
- Finance admin reviews.
- Refund is initiated if valid.
- User is notified.
- Audit log is saved.

### 263.4 Credit Adjustment Flow

Rules:

- Manual credit adjustment requires finance/admin permission.
- Reason must be recorded.
- Old balance and new balance must be auditable.
- Credits remain non-withdrawable.

---

## 264. Incident Response Playbook

### 264.1 Content Incident

Examples:

- Wrong answer.
- Misleading explanation.
- Bad YouTube link.
- Inappropriate content.

Response:

- Unpublish or flag content.
- Review correction.
- Notify affected users if serious.
- Recalculate points if needed.

### 264.2 Event Incident

Examples:

- Server issue.
- Timer issue.
- Question leak.
- Safe browser failure.
- Mass disconnection.

Response:

- Pause event if possible.
- Notify organizer.
- Notify participants.
- Preserve logs.
- Decide restart/extension/cancellation.
- Publish incident note.

### 264.3 Payment Incident

Examples:

- Webhook failure.
- Duplicate charge.
- Credits not added.
- Subscription not activated.

Response:

- Reconcile provider records.
- Fix account state.
- Notify user.
- Add audit note.

### 264.4 Security Incident

Examples:

- Admin compromise.
- Data leak.
- API abuse.
- Suspicious automation.

Response:

- Lock affected accounts.
- Rotate secrets if needed.
- Preserve logs.
- Investigate.
- Notify affected users if required.
- Patch vulnerability.

---

## 265. Scalability Stages

### 265.1 Stage 1: Pilot

Users:

- 100 to 1,000 users.

Focus:

- Correctness.
- Content quality.
- UI clarity.
- Feedback.

### 265.2 Stage 2: Early Growth

Users:

- 1,000 to 50,000 users.

Focus:

- Database indexes.
- Caching.
- Monitoring.
- Support.
- Content expansion.

### 265.3 Stage 3: Competition Scale

Users:

- Large events and live matches.

Focus:

- Realtime performance.
- Queue stability.
- Leaderboard speed.
- Safe browser readiness.
- Incident response.

### 265.4 Stage 4: Institution Scale

Users:

- Schools and colleges as partners.

Focus:

- Organizer tools.
- Reports.
- Certificates.
- Billing.
- Role management.
- Data privacy.

---

## 266. Accessibility Detailed Checklist

The platform should support:

- Keyboard navigation.
- Screen reader labels.
- Sufficient color contrast.
- Clear focus indicators.
- Captions for videos.
- Reduced motion option.
- Mute all sound option.
- Large clickable areas on mobile.
- No text overlap.
- Clear form errors.
- Plain English instructions.

Accessibility by screen:

- Home: clear navigation.
- Lesson: readable theory and controls.
- Test: keyboard accessible answer controls.
- Match: timer must be visible and announced clearly.
- Event: instructions must be readable before start.
- Community: report button must be accessible.

---

## 267. Notification Copy Guidelines

Notifications should be:

- Short.
- Clear.
- Helpful.
- Non-threatening.
- Not addictive.
- Not misleading.

Good notification examples:

- "Your daily learning goal is still pending."
- "You are 10 XP away from Level 5."
- "Your event starts in 30 minutes."
- "Your test result is ready."
- "A mentor replied to your doubt."

Avoid:

- "Earn money now."
- "You will lose everything."
- "You must play now."
- "Guaranteed win."
- "Double your money."

---

## 268. SEO And Public Content Strategy

Public pages should be searchable for:

- Class 9 learning.
- Class 10 board practice.
- Class 11 science learning.
- Class 12 board revision.
- C language 30-day plan.
- Python beginner roadmap.
- DSA practice.
- College coding competition platform.

SEO content should include:

- Clear page titles.
- Clear descriptions.
- Useful preview content.
- No fake claims.
- No copied content.
- Structured class/subject pages.

---

## 269. Internal Team Operating Rhythm

Suggested weekly rhythm:

- Monday: product planning.
- Tuesday: development focus.
- Wednesday: content review.
- Thursday: QA and bug review.
- Friday: demo and feedback.
- Saturday: content production.
- Sunday: rest or light monitoring.

Weekly review should check:

- New content published.
- Wrong answer reports.
- User feedback.
- Technical bugs.
- Payment issues.
- Community reports.
- Event readiness.

---

## 270. Founder 30-Day Action Plan

### 270.1 Days 1 To 5

Decide:

- Platform name.
- Primary audience.
- First class focus.
- First engineering language.
- Brand style.

### 270.2 Days 6 To 10

Prepare:

- C Language Day 1 content.
- Class 9 starter content.
- Class 10 starter content.
- First question set.
- First YouTube help links.

### 270.3 Days 11 To 15

Plan:

- UI wireframes.
- Dashboard layout.
- Lesson layout.
- Test layout.
- Event layout.

### 270.4 Days 16 To 20

Build planning:

- Development backlog.
- Folder structure.
- Database plan.
- API plan.
- QA checklist.

### 270.5 Days 21 To 25

Pilot preparation:

- Invite 10 to 30 students.
- Prepare feedback form.
- Prepare first learning path.
- Prepare support process.

### 270.6 Days 26 To 30

Pilot:

- Run small test.
- Collect feedback.
- Fix confusing parts.
- Improve content.
- Decide next sprint.

---

## 271. Final Version 9 Closing

This Version 9 addendum improves the MCP with governance, data dictionary, permission matrix, content taxonomy, question review, event SOP, payment operations, incident response, scalability stages, accessibility checklist, notification copy guidance, SEO strategy, internal team rhythm, and founder 30-day action plan.

The MCP is now stronger not only for building the product, but also for operating it after launch.

## Version 10 Deep Improvement Addendum - Final Product, Architecture, Content, Safety, And Growth Details

This addendum upgrades the master creation plan with a more production-ready vision. It keeps the document code-free, English-only, and focused on the educational platform itself. It also keeps the recommended implementation direction centered on TypeScript, Node.js, Next.js, React, PostgreSQL, Redis or Valkey, secure browser examination flows, AI-assisted learning, and modern product engineering practices.

### 1. Final Product North Star

The platform should become a complete learning, practice, assessment, competition, and community system for school students and engineering learners.

The student should never feel lost. Every screen should answer three questions clearly: what should I learn now, what should I practice now, and what progress did I make today.

The platform should feel minimalist, fast, mobile-friendly, and serious, but still motivating through points, ranks, streaks, matchups, badges, and event energy.

The product should balance three experiences: calm self-study, competitive practice, and institution-managed events.

The first version should focus on clarity and reliability. Advanced effects, simulations, animations, and AI personalization should be added in layers after the core learning loop works smoothly.

### 2. Required Top-Level Sections

The application must include these primary sections as permanent navigation areas:

- Home page for discovery, quick entry, recommended learning, active events, and platform trust signals.
- Class 9 page for subjects, chapters, lessons, practice, tests, streaks, and community.
- Class 10 page for subjects, chapters, lessons, practice, tests, streaks, and community.
- Class 11 page for stream-based subjects, deep concepts, competitive preparation, tests, and community.
- Class 12 page for board preparation, revision, practice, tests, competitive preparation, and community.
- Engineering page for programming languages, computer science topics, roadmaps, coding practice, contests, and community.
- Dashboard page for student progress, XP, level, streak, weak topics, wallet-safe credits, certificates, and recommended next actions.
- Test page for timed tests, chapter tests, mock tests, coding tests, event tests, and secure browser competitions.
- Sign in page for returning students, teachers, admins, event organizers, and institution users.
- Sign up page for new students, parents where required, teachers, college organizers, and institution partners.
- Community page for class-wise and engineering-language-wise discussion spaces.
- Event organizer area for colleges, schools, coaching institutes, and clubs.
- Admin area for platform operators, moderators, content managers, finance reviewers, and support teams.

### 3. Folder And File Architecture Expectations

The final codebase must keep a clean folder structure that reflects the product structure. Each major area needs its own folder, and each folder needs clear comments in future source files.

The frontend folder should contain separate areas for home, class 9, class 10, class 11, class 12, engineering, dashboard, tests, authentication, community, events, admin, shared components, design system, utilities, hooks, services, and assets.

The backend folder should contain separate areas for authentication, users, curriculum, lessons, questions, submissions, points, levels, streaks, matching, events, community, moderation, payments, wallet-safe credits, notifications, analytics, admin, security, and audit logs.

The content folder should contain separate subject and language content spaces so that teachers and content teams can update learning material without touching unrelated product logic.

The documentation folder should contain architecture notes, product decisions, data dictionary, API contracts in plain language, moderation policy, event policy, secure browser policy, testing strategy, release checklist, and support playbooks.

Every future source file should start with a simple English comment explaining the purpose of the file, the user-facing feature it supports, and the kind of logic expected inside it.

### 4. Class-Wise Subject Structure

Class 9 should include separate folders for Mathematics, Science, Social Science, English, Hindi, Computer Applications, Sanskrit if supported, and regional language support if the product expands state-wise.

Class 10 should include separate folders for Mathematics, Science, Social Science, English, Hindi, Information Technology or Computer Applications, Sanskrit if supported, and regional language support.

Class 11 should support stream-based subject grouping. Science should include Physics, Chemistry, Mathematics, Biology, Computer Science, English, and optional subjects. Commerce should include Accountancy, Business Studies, Economics, Mathematics or Applied Mathematics, English, and optional subjects. Humanities should include History, Political Science, Geography, Economics, Sociology, Psychology, English, and optional subjects.

Class 12 should mirror Class 11 but focus more heavily on boards, revision, chapter tests, previous-year style questions, sample papers, timed practice, and exam readiness dashboards.

Each subject folder should contain chapter overview, lesson notes, animation notes, simulation notes, practice question sets, difficulty mapping, solution explanation references, YouTube support link strategy, test templates, and common mistakes.

### 5. Engineering Learning Tracks

Engineering should include separate folders for C, C Plus Plus, Java, Python, JavaScript, TypeScript, HTML, CSS, SQL, Data Structures, Algorithms, Database Systems, Operating Systems, Computer Networks, System Design Basics, Web Development, App Development, Cloud Basics, Cybersecurity Basics, AI and Machine Learning Basics, and Interview Preparation.

Each programming language track should have a beginner roadmap, a 30-day starter plan, a 60-day practice plan, a project list, a syntax learning plan, debugging exercises, code-reading questions, output prediction questions, real coding problems, and concept quizzes.

C language should have a 30-day plan covering setup, variables, input-output, operators, conditionals, loops, functions, arrays, strings, pointers, structures, file handling, memory basics, recursion, problem solving, and final revision projects.

Python should focus on beginner productivity, logic building, automation, data structures, functions, files, modules, object-oriented basics, API basics, data analysis basics, and beginner AI usage.

JavaScript and TypeScript should support modern web development, browser basics, DOM concepts, async concepts, API consumption, UI state, type safety, testing, and project-based practice.

Java should support object-oriented programming, collections, exception handling, file handling, multithreading basics, JDBC concepts, backend fundamentals, and interview practice.

SQL should support database thinking, schema design, joins, aggregation, indexes, transactions, query optimization basics, and real-world reporting problems.

### 6. Lesson Experience

Every lesson should follow a repeatable structure:

- Short concept introduction.
- Visual explanation.
- Real-life example.
- Step-by-step theory.
- One animated explanation or simulation idea where useful.
- Mini checkpoint question.
- Practice question set.
- Solution explanation.
- YouTube support link below every problem.
- Mistake analysis.
- XP reward.
- Recommended next lesson.

The platform should avoid dumping long theory in one screen. The content should be split into digestible blocks with progress saved after each block.

For school subjects, the lesson should support diagrams, formulas, definitions, examples, solved questions, unsolved questions, and revision cards.

For programming topics, the lesson should support concept text, trace tables, dry-run explanation, input-output examples, debugging hints, and problem-solving strategy.

### 7. Question And Points System

Questions should have types such as multiple choice, numerical answer, short answer, long answer, coding output prediction, debugging, code completion, full coding challenge, match the following, diagram-based, and case-study based.

Each question should have a difficulty rating, estimated time, topic tags, chapter tags, concept tags, marks, XP points, hints, solution steps, YouTube support link, and quality review status.

Short questions may give lower points. Long questions, coding questions, multi-step reasoning questions, and time-limited challenge questions may give higher points.

Points should reward correctness, speed where appropriate, consistency, and topic mastery. Points should not reward random guessing.

For learning mode, hints should reduce reward slightly but improve understanding. For test mode, hints should be disabled unless the test is explicitly a practice test.

### 8. Levels, XP, Streaks, And Ranks

Level 1 should be easy to reach so new students feel early progress.

Higher levels should require more XP, better accuracy, more variety, and regular practice.

Streaks should count meaningful activity, not just opening the app. A valid streak day should require at least one lesson checkpoint, practice set, test attempt, or accepted coding solution.

The dashboard should show current level, XP to next level, daily streak, weekly activity, weak topics, strong topics, accuracy, average speed, and recommended action.

Rank titles should be educational and motivating, such as Starter, Explorer, Problem Solver, Challenger, Specialist, Master, Mentor, and Champion.

Class-wise ranks should stay separate so a Class 9 student is not compared unfairly with a Class 12 or engineering student.

### 9. Matching And Competitive Practice

Matching should only happen inside the same class or the same engineering track.

Before matching, users should choose class, subject, chapter, topic, difficulty, and mode.

The system should match users with similar level, similar recent accuracy, similar topic choice, and similar speed profile.

A Class 9 student should match with Class 9 students. A Class 10 student should match with Class 10 students. Class 11 and Class 12 should respect stream and subject. Engineering matching should respect selected programming language or topic.

The match should have a clear timer, question count, scoring rules, tie-breaker rules, surrender rules, disconnection rules, and result screen.

The winner should be decided using points, accuracy, time, and fair-play checks.

The platform should not implement real-money wagering. Competitive rewards should be handled through non-withdrawable learning credits, badges, sponsor-funded prizes, certificates, institution-approved awards, or subscription benefits.

### 10. Wallet-Safe Credits And Monetization

The platform can support a premium subscription, daily ad-supported access, institution licenses, event organizer fees, certification fees, and optional learning packs.

The Level 10 unlock can provide two compliant options: continue with limited ads or upgrade to a paid learning plan.

The low-cost pack can be positioned as a skill practice pack, tournament access pack, certificate pack, or premium challenge pack.

Any credit balance should be non-withdrawable unless reviewed legally and approved under the correct regulatory model.

Rewards should never be described as hidden betting, gambling, or disguised staking.

Payment flows should include invoices, refund policy, parental consent where required, fraud checks, and spending limits.

Daily spending caps should remain strict for minors and should be configurable by age, class, account type, and parent settings.

### 11. Events And College Competition Portal

The event portal should let schools, colleges, coaching institutes, coding clubs, and departments create competitions.

Organizer features should include event creation, registration form builder, participant import, eligibility rules, question paper builder, schedule, safe browser settings, proctoring settings, result publishing, certificate generation, and analytics.

Competition types should include coding contest, MCQ quiz, subject test, debugging challenge, speed round, team contest, hackathon registration, and placement preparation challenge.

The safe browser mode should block copy-paste, external tabs, screen switching where technically possible, dev tools, unsupported browsers, and suspicious activity.

The platform should treat anti-cheat as risk reduction, not absolute proof. Every event should include audit logs, suspicious activity flags, manual review, and organizer override process.

Certificates should include event name, organizer name, participant name, rank, score, date, verification ID, and verification page.

### 12. Safe Browser And Anti-Cheat Policy

Competition mode should run in approved secure browser environments where possible.

Normal learning mode should not be overly restrictive. Restrictions should apply mainly to tests, contests, and institution events.

Anti-cheat signals should include tab switching, copy-paste attempts, repeated focus loss, suspicious answer timing, multiple login sessions, device changes, network anomalies, and abnormal score jumps.

For coding contests, plagiarism detection should compare solution similarity, timing, language pattern, and known answer sources.

For school tests, question randomization, option shuffling, time limits, and question pools should reduce cheating risk.

Every anti-cheat action should be logged with time, device, event, user, and reason.

### 13. Community System

The community page should have separate spaces for Class 9, Class 10, Class 11, Class 12, and Engineering.

Inside engineering, every supported language and topic should have its own community folder and moderation rules.

Community features should include posts, replies, doubt questions, accepted answers, upvotes, bookmarks, reporting, moderation queue, topic tags, class filters, and mentor replies.

Students should be able to attach screenshots, formulas, diagrams, or problem references where allowed.

Community should never reveal full answers inside active competitions or secure tests.

Mentor badges should identify verified teachers, college mentors, and platform content reviewers.

### 14. AI Agent Features

AI should support personalized learning paths, weak topic detection, hint generation, solution explanation, doubt clarification, content quality review, question tagging, event analysis, and moderator assistance.

AI should not directly solve active test or competition questions for students.

AI hints should be layered: first hint gives direction, second hint gives method, third hint gives partial structure, final explanation appears after submission or practice completion.

AI feedback should explain why an answer is wrong and what concept needs revision.

For coding practice, AI can help explain errors, suggest debugging steps, and provide dry-run reasoning after the student attempts the problem.

### 15. Dashboard Enhancements

The dashboard should have a top summary, daily target, XP progress, level progress, streak, active courses, weak topics, upcoming tests, upcoming events, recent match results, certificates, and recommended next action.

A student should be able to resume the exact lesson, problem, or test they left.

Parents or guardians can receive optional progress summaries if the platform supports minors and consent flows.

Teachers can view class progress, assignment completion, weak chapters, test analytics, and student-level recommendations.

Institutions can view event registration, participation, attendance, suspicious activity, results, and certificate distribution.

### 16. Content Quality System

Every lesson and question should pass content review before publication.

Review status should include draft, internal review, subject expert review, grammar review, accessibility review, published, archived, and needs update.

Question quality should be measured using accuracy distribution, average time, skip rate, complaint rate, and learning outcome.

Bad questions should be flagged automatically when too many students fail for unclear reasons or report ambiguity.

YouTube support links should be curated and reviewed. Links should be replaced if the video is removed, low quality, misleading, or not age appropriate.

### 17. Accessibility And Minimal UI

The UI should use readable fonts, strong contrast, clean spacing, clear buttons, predictable navigation, and responsive layouts.

All important controls should have labels, keyboard support, focus states, and screen reader-friendly structure.

Animations should support reduced-motion settings.

The product should avoid clutter, excessive decorative cards, confusing banners, and too many colors.

Mobile screens should prioritize the current lesson, current problem, timer, answer controls, and progress.

Desktop screens can show more context such as lesson outline, notes, and progress sidebar.

### 18. Notifications

Notifications should be useful, not spammy.

Students can receive reminders for streak, incomplete lesson, upcoming test, event registration, match invitation, result published, certificate ready, and community answer received.

Teachers can receive alerts for assignment deadline, test submission issue, weak class performance, and moderation needs.

Organizers can receive alerts for event setup incomplete, registration milestone, suspicious activity, result review, and certificate publishing.

### 19. Analytics And Success Metrics

Core product metrics should include active learners, lessons completed, questions attempted, accuracy, streak retention, test completion, event participation, community response time, premium conversion, and support tickets.

Learning metrics should include topic mastery, improvement over time, repeated mistakes, hint dependency, revision completion, and readiness score.

Competition metrics should include match completion rate, fair-play flags, average wait time, result disputes, and participant satisfaction.

Content metrics should include lesson completion rate, question quality, video click rate, report rate, and update frequency.

### 20. Security, Privacy, And Compliance

The platform should protect student data using secure authentication, role-based access, encrypted transport, limited data access, audit logs, secure file handling, and regular backups.

Minors need careful consent, privacy, spending limits, community protection, and moderation.

Sensitive operations such as payments, event results, admin edits, moderator actions, and account changes should be auditable.

The system should support account recovery, device management, session history, password reset, and suspicious login detection.

### 21. Recommended Modern Technology Stack

Frontend should use TypeScript, Next.js, React, Tailwind CSS or a disciplined design system, shadcn-style components where suitable, and accessible UI patterns.

Backend should use TypeScript with Node.js, a structured API framework, background workers, validation, logging, monitoring, and clear service boundaries.

Database should use PostgreSQL for core data and Redis or Valkey for queues, caching, leaderboards, rate limiting, matchmaking state, and real-time counters.

Real-time features should use WebSocket-based infrastructure or a managed real-time service for matching, contests, score updates, and event monitoring.

Search should use a proper search layer for lessons, questions, community posts, events, and documentation.

Observability should include logs, metrics, traces, uptime checks, error tracking, audit dashboards, and product analytics.

Testing should include unit tests, integration tests, accessibility tests, browser tests, load tests, security checks, and content validation checks.

### 22. Release Phases

Phase 1 should deliver authentication, basic home, class pages, engineering page, lessons, questions, XP, levels, streaks, dashboard, and simple tests.

Phase 2 should deliver community, YouTube support links, improved content review, better analytics, certificates, and teacher tools.

Phase 3 should deliver matching, real-time competitive practice, advanced dashboards, safe browser event mode, organizer portal, and anti-cheat analytics.

Phase 4 should deliver AI personalization, advanced simulations, adaptive tests, institution licensing, premium plans, and large-scale event operations.

Phase 5 should deliver marketplace-style content partnerships, mentor network, advanced certification, placement preparation, and national-level competitions.

### 23. Final Acceptance Checklist

The MCP is complete only when it covers product vision, pages, folders, subjects, engineering tracks, day-wise learning plans, lessons, questions, points, levels, streaks, matching, safe browser, events, community, monetization, dashboard, admin, analytics, privacy, technology, testing, roadmap, and operational playbooks.

The MCP must stay English-only.

The MCP must stay code-free.

The MCP must not include the removed programming language direction.

The MCP must prefer TypeScript, Node.js, Next.js, React, PostgreSQL, Redis or Valkey, secure event tooling, and modern product engineering.

The MCP must treat real-money competitive play carefully and replace risky mechanics with compliant learning credits, certificates, sponsor-funded prizes, or institution-approved rewards.

The MCP must make the platform easy for students, powerful for organizers, useful for teachers, and manageable for administrators.

End of Version 10 Deep Improvement Addendum.