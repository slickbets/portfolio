---
title: "A live auction draft room for my fantasy league"
summary: "A real-time auction draft room I built in six days, then shelved when testing showed what drafters actually needed."
status: Prototype
type: Personal
year: 2026
stack: [TypeScript, React, Node.js, Socket.IO, Postgres, Claude Code]
featured: 3
repo: https://github.com/slickbets/auction-draft
---

<!-- FINAL v1 (approved by Spencer 2026-10-02). Repo made public 2026-10-02. -->

**Prototype.** The draft engine works end to end in testing. It was never used in a real draft.

## The problem

My 10-team fantasy football league runs an auction draft. Every team gets a $200 budget and bids on players live, instead of picking in turn. We were paying for a third-party draft tool, and it had frozen on us.

I wanted a draft room that was free, reliable, and built around how our league actually runs.

## What I built

A live draft room that everyone joins from their phone, with a TV screen for the room.

- **No accounts.** The commissioner gets a link to run the draft, a link for the TV board, and one invite link per team.
- **Live auction.** Teams take turns nominating players. Bidding runs on a 10-second clock that resets with every bid. When the clock runs out, the player is sold and drops into the winning team's roster.
- **The rules are enforced for you.** The app tracks every budget and roster limit, and it caps each bid so every team can still afford to fill its roster. A bid placed a split second too late is rejected rather than silently counted.
- **Three views:** a phone screen for each manager, a TV board showing every roster and budget, and commissioner controls to start, pause, add time or bid for someone.
- **It survives a crash.** Every draft action is saved to a log. If the server goes down, the draft comes back exactly where it was, paused, ready to resume.

*Stack, for the curious: TypeScript throughout, with React for the screens, Node.js with live websocket connections for the bidding, and Postgres for the draft log. Player data comes from Sleeper's free API.*

## How I built it

This was my most structured build. Before writing any code, I had Claude Code draft a design spec and three detailed build plans, and I reviewed and approved each one. Then Claude built against the plans one task at a time, with a separate review pass on each piece of work.

I also put real weight on testing, because a draft room that breaks on draft night is worse than none. The test suite includes:
- a full 10-team draft run by bots over real connections
- 100 randomized simulated drafts, each checked to make sure no rule was ever broken

The testing paid off. The bot draft caught a bug where managers who joined early saw an empty player list. The simulated drafts found an edge case where a draft can get stuck if a scarce position runs out.

It took six days from spec to a working draft room.

## Why I stopped

When I tested it as a drafter, I saw the problem. I'd built the auction itself (bids, budgets, timers), but a drafter's real job is deciding who to bid on. For that you need bye weeks, recent player news and depth charts at hand, and my app had none of it. The free draft tool in ESPN's app already has all of that.

Matching it was a data problem, not an engineering one, and it was more work than I could finish before our draft. So I stopped, and our league drafted on ESPN.

## What I learned

I've played fantasy football for more than a decade, so I know how people draft. What I underestimated was how much of a draft room is everything *around* the auction: the research a drafter leans on before every bid. I didn't see it until I was sitting in my own draft room and noticed what wasn't there. Next time I'm replacing a tool, I'll go through the old one screen by screen and list everything it gives people before I write the spec.

Planning first with Claude Code worked. A written spec and plans, plus tests that try to break things, produced much more solid software than my first project.

Knowing when to stop is part of the job. Shelving it before draft night was the right call.

## Links

- [Code on GitHub](https://github.com/slickbets/auction-draft)
- Screenshots: manager phone view, TV board, commissioner view (in inventory/assets/auction-draft)
