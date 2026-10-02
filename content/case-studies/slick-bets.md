---
title: "Slick Bets: an NBA prediction model"
summary: "My first Claude Code project: an NBA prediction app that picked 71.5% of game winners over 648 games, tracked live."
status: Retired
type: Personal
year: 2026
stack: [Python, Streamlit, SQLite, Fly.io, GitHub Actions, Claude Code]
featured: 2
repo: https://github.com/slickbets/nba-betting-value
---

<!-- FINAL v1 (approved by Spencer 2026-10-02). -->

**Retired.** It ran live through the 2025-26 NBA season, and it's dormant now.

## The problem

I wanted to know if I could build a model that predicts NBA games well enough to trust. I also wanted to see if it could find bets where the sportsbooks' odds were off.

I also wanted to learn how to build software with Claude Code. This was my first real project with it.

## What I built

Slick Bets is a web app that predicts every NBA game, every day.

- **Today's games:** the model's pick, win probability, predicted point spread and total, and a confidence level, with live scores.
- **Game details:** what moved the prediction (injuries, rest, home court), plus the model's "fair" odds next to real sportsbook lines.
- **Model accuracy:** how the picks have actually done, overall and by confidence level, over any date range.
- **Team ratings:** a power ranking of all 30 teams.

Under the hood, every team has an Elo rating, a score that rises and falls with each result. Bigger wins move it more. Each team has separate offense and defense ratings, and they combine into a predicted score for both teams.

The model then adjusts for three things:
- **Injuries,** weighted by how much the missing player matters.
- **Rest,** with a penalty for the second night of back-to-back games.
- **Home court,** sized to each team's own home record.

It runs itself. Every morning a scheduled job pulls yesterday's results, updates the ratings, checks injuries and odds, and makes the day's picks. Every code change runs the tests and deploys on its own.

*Stack, for the curious: Python and Streamlit for the app, SQLite for data, hosted on Fly.io, with GitHub Actions for tests and deploys. Game and odds data come from BallDontLie, with ESPN and The Odds API as backups.*

## How I built it

I directed Claude Code through every part of it, over about ten weeks. I set the goals, made the calls on the model and the product, and reviewed everything before it shipped. My rule was preview, approve, then push.

Three decisions shaped it:

**I cut the betting features.** The app started as a "value finder" that compared the model's odds to sportsbook odds, sized bets, and tracked a bankroll. The value picks weren't right. There are also too many ways to chase value (spreads, moneylines, player props) to do any of them well at once. So I narrowed it to one thing the model could do well, picking winners, and planned to build out from there.

**I tuned the model with data, not instinct.** I had Claude build a backtest that replays the season. I ran 840 combinations of settings against more than 900 games. Then I chose settings that were slightly less accurate at picking winners but better at predicting the margin. I also added tests that fail the build if accuracy drops below a set bar.

**I learned production by running into it.** I'd never deployed an app before. Along the way I hit everything:
- the daily job couldn't see its passwords
- the server ran out of memory
- duplicate games showed up
- data providers went down

Each one became a fix and a written rule in the project's instructions file, so Claude wouldn't repeat the mistake.

## Outcome

- **71.5% of winners picked correctly (463 of 648 games),** tracked live from mid-season through the end of 2025-26. Every prediction was locked in before tip-off. The median spread miss was under 10 points.
- I retuned the model in early March using that season's games, so only the picks after that point are fully forward-looking.
- It only measures win/loss picks. I never tracked betting profit, so I make no claims about beating the books.
- A small group of friends used it. I never promoted it.

## What I learned

Shipping is its own skill. The model was the fun part. Hosting, scheduling, data outages and memory limits were where most of the learning happened, and I wouldn't have learned them without putting it live.

Cutting scope was the right call. A focused predictor that worked beat a betting tool that didn't.

If I picked it back up, I'd fix the interface first. It shows a lot of numbers but doesn't tell you what to do with them.

## Links

- [Code on GitHub](https://github.com/slickbets/nba-betting-value)
- Screenshots: daily picks, game details, model accuracy, team ratings (in inventory/assets/slick-bets)
