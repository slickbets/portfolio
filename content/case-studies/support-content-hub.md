---
title: "Moving a fintech's support content off Zendesk"
summary: "I led the support-content side of a fintech's move off Zendesk, and built the tools it needed: a matching engine, a usage analysis, and an agent knowledge base that went to production."
status: Shipped
type: Work
year: 2026
stack: [React, Vite, Contentful, Salesforce Knowledge, Zendesk API, Claude Code]
featured: 1
---

<!-- FINAL v2 (approved by Spencer 2026-10-02). Employer, brands, people, ticket IDs, internal URLs and dollar figures are intentionally left out. Spencer should brush up on the matching engine and usage analysis before interviews. -->

**Shipped.** I led the support-content migration during a leading fintech company's move off Zendesk. Along the way I built the tools the migration needed, including an agent knowledge base that went to production.

## The problem

The company was moving its support operation off Zendesk, its help desk, before the contract ended. A product manager led that larger platform move to Salesforce. The support content alone was more than 1,000 internal support articles plus more than 2,000 "macros," the canned replies agents send customers. All of this content had to move to new platforms before the deadline, and nothing agents relied on could break.

It sat inside a bigger effort. The company had several consumer brands, each with its own support-content tool, and leadership wanted fewer tools doing the same job.

I was the program lead for the content migration: deciding what moved, where it went, and making sure it worked when it got there.

## What I built

The usual tools ran out quickly, so I built what was missing.

- **An agent knowledge base.** Agents needed somewhere to find articles after the move. I built a prototype on Contentful, a content platform. Product leadership approved it, and it went into the production app with versions for two brands. It launched to about 1,000 support agents at one brand. The second brand's version was built and planned to go live, but hadn't launched yet.
- **A matching engine for articles and macros.** To migrate safely, we had to know which macros pointed to which support articles. The existing mapping looked complete, but it wasn't. I built a matcher that compared every article with every macro in several passes, from exact title matches to fuzzy ones. It found about 1,800 links the original mapping had missed, which was over 40% of the total. That changed which macros we treated as documented, and it changed the migration scope.
- **A usage analysis for macros.** The help desk's built-in reports couldn't tell us which macros agents actually used. So I sampled more than 10,000 support tickets and pulled every macro use out of them. That showed which macros to migrate, which to rewrite, and which to retire. It also settled a debate about how far back we needed to look before archiving one.

## How I built it

I wrote all of this by directing Claude Code. I decided what each tool had to answer and what "right" looked like. Claude wrote the code, and I checked the results against real data before anyone made a decision from them.

Two moments shaped the work:

- **Not trusting the existing data.** The article-to-macro mapping was the basis for scoping the migration. When the numbers didn't add up, I didn't log it as a known limitation. I rebuilt the matching from scratch and re-ran it.
- **Getting content to display right.** Articles that looked fine in the old help desk didn't always render correctly after the move to Contentful. Fixing that took a lot of research and trial and error before the knowledge base showed content the way agents expected.

The knowledge base went through engineering review before production. Engineers recommended how to fit it into their deployment pipeline and set up the hosting. I built the access rules so each team's agents saw only their own content.

## Outcome

- The knowledge base prototype was approved, built out for two brands, and shipped to production, where about 1,000 agents at one brand were using it.
- The migration was scoped on corrected data, which meant fewer missed dependencies and a clear list of what to migrate and what to archive.
- When I handed off the content migration in May 2026, it was nearly complete.

## What I learned

Running a program and building for it aren't separate jobs. Each time the standard tools stopped answering the question, building the answer myself with Claude Code was faster than waiting or working around the gap. It also gave the decisions much better data.

A working prototype also moves people faster than a proposal. Leadership approved the knowledge base after seeing it work.

## Links

No links or screenshots. This was internal work, and I keep it confidential.
