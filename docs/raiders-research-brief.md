# Raiders Analytics Advantage Brief

Prepared as of **April 20, 2026** for two parallel goals:
1. Build a stronger **Big Data Bowl 2027** entry pipeline.
2. Develop **Raiders-specific analytics concepts** that could plausibly create edge in the 2026 season.

## Executive Summary

- **Ground-truth correction:** the prompt's Raiders context is already stale. As of **February 9, 2026**, **Klint Kubiak** became Raiders head coach, and the club announced a new 2026 staff on **March 1, 2026**. Pete Carroll is **not** the Raiders' head coach on April 20, 2026. [[Raiders: Kubiak hire](https://www.raiders.com/news/klint-kubiak-named-head-coach-of-the-las-vegas-raiders)] [[Raiders: 2026 staff](https://www.raiders.com/news/raiders-announce-2026-coaching-staff)]
- The Raiders' football research function is publicly more developed than many fans realize: the official front-office page lists **David Christoff (VP, Football Research and Development)**, **Andrew Fedele (Manager, Football Data Science and Engineering)**, **Jonah Lubin (Football Data Science Assistant)**, **Walt King (Coordinator, Player Personnel Research and Strategy)**, and **Kunal Singh (Senior Manager, Football Strategy)**. [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)]
- The team's **2026 draft position is unusually powerful**: Las Vegas owns the **No. 1 overall pick** and a total of **10 selections**. DraftTek's April 19, 2026 Jimmy Johnson chart values the class at **4035.2 points**, while Over the Cap's Fitzgerald-Spielberger chart values Raiders capital at **1184 points**. [[Raiders draft order](https://www.raiders.com/news/a-look-at-the-las-vegas-raiders-full-2026-nfl-draft-order)] [[DraftTek Jimmy Johnson chart](https://www.drafttek.com/NFL-Trade-Value-Chart.asp?RequestTeam=LV)] [[Over the Cap draft chart](https://overthecap.com/draft)]
- The cap picture is a classic "bridge year" shape: Over the Cap lists about **$23.25M** in 2026 effective cap space, but also about **$52.0M** in dead money; 2027 projects much cleaner at about **$108.5M** of effective cap space. That makes **cheap rookie impact plus disciplined 2027 optionality** more valuable than splashy 2026-only optimization. [[Over the Cap Raiders cap page](https://overthecap.com/salary-cap/las-vegas-raiders)]
- NFL IQ's live Raiders card currently shows the club picking **No. 1 overall** with headline needs of **QB, WR, OL**, while the current Ask NFL IQ roster/team-needs summaries expand that to a broader five-need stack of **QB, OL, WR, CB, DL**. [[NFL IQ](https://www.nfl.com/iq)] [[Ask NFL IQ: Raiders roster holes](https://www.nfl.com/iq?chatmax=true&prompt=What%20are%20the%20Raiders%20current%20top%20roster%20holes%20entering%20the%202026%20NFL%20Draft%3F)]
- Public Big Data Bowl evidence suggests the projects that advance deepest are not just accurate; they are **football-native, visual, reproducible, and directly coachable**. The official 2026 winner, Lucca Ferraz's **"Ghostbusters"**, married conditional ghost-defender distributions with catch-probability modeling and player-value decomposition. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)] [[Kaggle 2026 winners](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/hackathon-winners)] [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)]
- Public analytics is strongest today in **EPA/WPA/CPOE**, tracking-derived **completion/tackle/coverage responsibility** models, and opponent/self-scouting. The biggest remaining public gaps are still **assignment attribution**, **practice-load and medical integration**, **coachable real-time decision support**, and **closed-loop roster/cap optimization**. This is partly inference from what public data includes and excludes. [[nflfastR overview](https://opensourcefootball.com/posts/2020-09-28-nflfastr-ep-wp-and-cp-models/)] [[NFL Next Gen Stats 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)] [[Kaggle 2026 analytics data page](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)]
- For the Raiders specifically, the best asymmetric opportunities are not generic "be more analytical" ideas. They are: **pre-snap disguise and disclosure modeling**, **Kubiak-tree play-action/screen stress sequencing**, **coverage-shell-to-responsibility exploitation**, **low-win-probability aggression tuning**, and **scheme-weighted draft/free-agent valuation**.
- **As of April 20, 2026, no official BDB 2027 Kaggle page or NFL Football Operations announcement was found**, so the correct move is to build **prompt-agnostic tracking modules now** rather than overfit to a not-yet-announced competition. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)]

## Section 1 - Big Data Bowl Landscape (2019-2026)

### 1.1 Compressed history

| Year | Official prompt/theme | Data scope | Winner(s) / winning entry | Representative finalist entries | Core techniques that mattered | Evidence of downstream NGS adoption |
| --- | --- | --- | --- | --- | --- | --- |
| 2019 | Analyze WR/DB matchups and route behavior using tracking. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | 2018 passing-play tracking. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | College: Simon Fraser team, **"Routes to Success"**. Open: Nathan Sterken, **"RouteNet"**. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | DIRECT for DPI/holding; expected hypothetical completion probability; receiver-route autoencoding; space-control studies. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | Route clustering, CNN route classification, field-control geometry, expected completion surfaces. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | NFL says BDB analysis now informs NGS and broadcast workflows broadly; 2019 itself established the pipeline, but no single 2019 production metric was explicitly named in the sources reviewed. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)] |
| 2020 | Predict rushing play outcomes. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | 2019 rushing plays. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | Philipp Singer and Dmitry Gordeev, **"The Zoo"**. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | Effective acceleration, leverage, open area after handoff, zones of control, field/run-gap control. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | Spatial control, leverage, run-lane geometry, trajectory-based expected rushing. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | **Documented adoption:** Kaggle's 2022 competition page states the **winning algorithm from the 2020 Big Data Bowl was adopted by the NFL/NFL Network for on-air distribution**. [[Kaggle 2022](https://www.kaggle.com/competitions/nfl-big-data-bowl-2022)] |
| 2021 | Defensive performance on passing plays. [[Kaggle 2021](https://www.kaggle.com/competitions/nfl-big-data-bowl-2021)] | 2018 regular-season dropback passes. [[Kaggle 2021](https://www.kaggle.com/competitions/nfl-big-data-bowl-2021)] | Official NFL finalist page still exposes finalists but not a clean winner label in rendered text. Public secondary sources identify **Jill Reiner** as the collegiate winner and **Asmae Toumi**'s team as the open winner. [[NFL 2021 video gallery](https://operations.nfl.com/gameday/analytics/big-data-bowl/2021-big-data-bowl-video-gallery/)] [[Denison on Jill Reiner](https://denison.edu/academics/data-analytics/wh/141844)] | Official finalists included teams led by Wei Peng, Matthew Gartenhaus/James Venzor, Asmae Toumi, Joe Andruzzi, Dani Chu/Matthew Reyers, Zach Bradlow/Zach Drapkin/Ryan Gross/Sarah Hu, Jill Reiner, and Ella Summer. [[NFL 2021 video gallery](https://operations.nfl.com/gameday/analytics/big-data-bowl/2021-big-data-bowl-video-gallery/)] | Coverage classification, expected incompletion/completion surfaces, defensive attribution at catch point. [[Kaggle 2021](https://www.kaggle.com/competitions/nfl-big-data-bowl-2021)] | Publicly visible continuation into later NGS coverage metrics, but the sources reviewed do not tie a single 2021 entry directly to a named production metric. |
| 2022 | Special teams. [[Kaggle 2022](https://www.kaggle.com/competitions/nfl-big-data-bowl-2022)] | 2018-2020 special teams plus PFF scouting. [[Kaggle 2022](https://www.kaggle.com/competitions/nfl-big-data-bowl-2022)] | Public secondary sources identify **"Punt Returns: Using the Math to Find the Path"** as the winning work. [[NFL 2022 video recap](https://operations.nfl.com/gameday/analytics/big-data-bowl/2022-big-data-bowl-video-gallery-recap/)] [[Toronto CMSA review](https://community.amstat.org/cnsl/ourdiscussiongroup/viewthread?GroupId=3943&MessageKey=2d5c8de6-a4be-4f1a-b817-a5f53aa673b6&CommunityKey=f77c549a-69cc-4a92-9d74-714fcacae535)] | FireTime; kickoff/punt AR visualization; COYOTE; punt-aim optimization; punter evaluation; expected field position on punts. [[NFL 2022 video recap](https://operations.nfl.com/gameday/analytics/big-data-bowl/2022-big-data-bowl-video-gallery-recap/)] | Return-lane pathfinding, gunner/vice modeling, special-teams spatial optimization. [[NFL 2022 video recap](https://operations.nfl.com/gameday/analytics/big-data-bowl/2022-big-data-bowl-video-gallery-recap/)] | The official competition page explicitly notes 2020 adoption, and 2022 helped normalize special-teams tracking research, but the reviewed official sources do not identify a specific 2022 metric later put on air. [[Kaggle 2022](https://www.kaggle.com/competitions/nfl-big-data-bowl-2022)] |
| 2023 | Offensive and defensive line play on pass plays. [[Kaggle 2023](https://www.kaggle.com/competitions/nfl-big-data-bowl-2023)] | 2021 passing plays, Weeks 1-8, plus PFF scouting. [[Kaggle 2023](https://www.kaggle.com/competitions/nfl-big-data-bowl-2023)] | Public secondary sources identify the University of Toronto team, **"Between the Lines: How do We Measure Pressure?"**, as winner. [[U of T article](https://sportsanalytics.sa.utoronto.ca/2023/03/15/2023-big-data-bowl/)] | Official finalists page now appears to redirect, so finalist details are a **public archival gap**. The NFL still preserves the broad theme and finalist announcement page. [[NFL finalists announcement](https://operations.nfl.com/updates/football-ops/finalists-named-in-5th-annual-nfl-big-data-bowl/)] | Pass-rush pressure attribution, line-interaction geometry, pocket stress, time-to-throw-pressure coupling. [[Kaggle 2023](https://www.kaggle.com/competitions/nfl-big-data-bowl-2023)] [[U of T article](https://sportsanalytics.sa.utoronto.ca/2023/03/15/2023-big-data-bowl/)] | This research lane clearly fed public interest in pressure and protection attribution, but no reviewed official page stated a named 2023 entry became a production metric. |
| 2024 | Tackling. [[Kaggle 2024](https://www.kaggle.com/competitions/nfl-big-data-bowl-2024)] | 2022 Weeks 1-9 tracking plus PFF scouting, EPA, and WP. [[Kaggle 2024](https://www.kaggle.com/competitions/nfl-big-data-bowl-2024)] | Matthew Chang, Katherine Dai, Daniel Jiang, Harvey Cheng, **"Uncovering Missed Tackle Opportunities"**. [[NFL 2024 winners](https://operations.nfl.com/gameday/analytics/big-data-bowl/2024-big-data-bowl-winner-and-finalists/)] | NFL listed finalists across undergraduate, metric, and coaching tracks. [[NFL 2024 winners](https://operations.nfl.com/gameday/analytics/big-data-bowl/2024-big-data-bowl-winner-and-finalists/)] | Tackle probability, pursuit path quality, missed-tackle opportunity attribution, yards-saved framing. [[Kaggle 2024](https://www.kaggle.com/competitions/nfl-big-data-bowl-2024)] | NFL's 2025 NGS metrics package explicitly introduced **Tackle Probability**, showing the tackle-research stream has become mainstream production analytics. [[NFL NGS 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)] |
| 2025 | Pre-snap data to produce post-snap insights. [[Kaggle 2025](https://www.kaggle.com/competitions/nfl-big-data-bowl-2025)] | Tracking from pre-snap through play contexts; examples included play, scheme, and player prediction. [[Kaggle 2025](https://www.kaggle.com/competitions/nfl-big-data-bowl-2025)] | Official finalist announcement exists; public sources identify NYU's **Smit Bajaj and Vishakh Sandwar** and **"Exposing Coverage Tells in the Pre-Snap"** as winners. [[NFL 2025 finalists](https://operations.nfl.com/updates/football-ops/nfl-announces-the-finalists-for-the-seventh-annual-big-data-bowl/)] [[NYU story](https://www.nyu.edu/about/news-publications/news/2025/august/how-two-nyu-students-teamed-up-to-win-the-nfl-s-top-stats-compet.html)] | Finalists included work by Ben Wendel; Bajaj/Sandwar; Fleishman/Soriano/Steinberg/Ferraz; Brill/Jacobson/Lipitz/Pipping; Sarah Pollack. [[NFL 2025 finalists](https://operations.nfl.com/updates/football-ops/nfl-announces-the-finalists-for-the-seventh-annual-big-data-bowl/)] | Coverage disguise detection, pre-snap tell extraction, scheme-prediction from formation/motion/alignment. [[Kaggle 2025](https://www.kaggle.com/competitions/nfl-big-data-bowl-2025)] | **Documented adoption path:** NFL's 2025 NGS metrics article says a new post-snap defense classifier was inspired by the 2025 winners' disguise work, and the same article unveiled **Coverage Responsibility** as a new production metric. [[NFL NGS 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)] |
| 2026 | Analytics track: **"Understand player movement while the ball is in the air."** Prediction track: **"Predict player movement while the ball is in the air."** [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] | 2023-2024 training data, with predictions judged on 2025 Weeks 14-18 for prediction track. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)] | **Lucca Ferraz (Rice University), "Ghostbusters: Back off man, I'm a Data Scientist!"** [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)] [[Kaggle 2026 winners](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/hackathon-winners)] | Official finalists: Visualizing Contested Space to Optimize Defensive Outcomes After the Pass; Path Against The Pass; Ghostbusters; The Decision Point; Quantifying Pass Play Evolution Through Dynamic Completion Probability. [[Kaggle 2026 winners](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/hackathon-winners)] | Ghost defenders, conditional density estimation, catch-probability modeling, mixed-effects player valuation, dynamic completion probability. [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)] | Too early to call a production adoption as of April 20, 2026. **Speculation:** the ghost-defender/value-decomposition framework is exactly the kind of idea that could become a future NGS attribution layer. |

### 1.2 BDB 2026 specifics

#### Official competition structure

| Item | Analytics track | Prediction track |
| --- | --- | --- |
| Official title | NFL Big Data Bowl 2026 - Analytics [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] | NFL Big Data Bowl 2026 - Prediction [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Official prompt | "Understand player movement while the ball is in the air." [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] | "Predict player movement while the ball is in the air." [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Core task | "Create a metric or video to analyze NFL player movement during the video frames after the ball is thrown." [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] | Predict x/y movement for players during ball-flight frames, evaluated on future live data via API. [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Tracks | University Track and Broadcast Visualization Track. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] [[Kaggle analytics rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/rules)] | Single leaderboard/code competition. [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Key deliverables | Writeup, media gallery, public notebook for university track, public YouTube video for broadcast track. Writeup max 2000 words; video max 3 minutes. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] | Code submission via evaluation API; notebook reruns required for reproducibility. [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Evaluation | Football 30%, Data Science 30%, Writeup 20%, Data Visualization 20%. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] | RMSE on predicted x/y positions. [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Timeline | Start Sept. 25, 2025; close Dec. 17, 2025. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] | Start Sept. 25, 2025; final scoring Jan. 6, 2026, with forecasting phase from Dec. 4, 2025-Jan. 5, 2026. [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] |
| Team size and submission limits | Max team size 4; max 5 submissions/day; up to 2 final submissions selected for judging. [[Kaggle analytics rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/rules)] | Max team size 4; max 5 submissions/day; up to 2 final submissions for judging. [[Kaggle prediction rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction/rules)] |
| Prize structure | Three university finalists at $9k each; two broadcast finalists at $9k each; one additional $5k combine winner. [[Kaggle analytics rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/rules)] | $25k / $15k / $10k. [[Kaggle prediction rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction/rules)] |

#### Dataset schema

The 2026 data package is unusually clean for future reuse because it exposes both **pre-throw tracking input** and **post-throw output**, plus a rich supplementary play table. Key fields include:

- **Input tracking:** `game_id`, `play_id`, `nfl_id`, `frame_id`, `player_to_predict`, `play_direction`, `x`, `y`, `s`, `a`, `o`, `dir`, `player_role`, `num_frames_output`, `ball_land_x`, `ball_land_y`. [[Kaggle analytics data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)] [[Kaggle prediction data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction/data)]
- **Output tracking:** x/y positions during the ball-in-air window. [[Kaggle analytics data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)] [[Kaggle prediction data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction/data)]
- **Supplementary context:** `down`, `yards_to_go`, `offense_formation`, `receiver_alignment`, `route_of_targeted_receiver`, `play_action`, `dropback_type`, `pass_location_type`, `team_coverage_man_zone`, `team_coverage_type`, `expected_points_added`, and pre-snap win-probability fields. [[Kaggle analytics data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)]

This schema matters for 2027 prep because it can support **multiple reusable modules**:

- pre-snap shell recognition,
- targeted-receiver leverage models,
- ball-flight trajectory proxies,
- ghost-defender counterfactuals,
- and catch-point responsibility/value decomposition.

#### Judging panel composition

- The analytics competition page explicitly says judges will consist of **analytics staffers working for the 32 NFL teams and/or player-tracking vendors**. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)]
- The only specifically named judge visible on the rendered competition page was **Tom Bliss, Data Scientist, National Football League**. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)]
- NFL Operations says recent judging has included **Cynthia Frelund**, former BDB participants, AWS data scientists, and former NFL linebacker **Najee Goode**. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)]
- **Public-data limit:** I did **not** find a reliable public team-by-team list of 2026 judges, so any precise mapping of which club had which staffer in the room would be guesswork. For the Raiders specifically, I found no public source stating that a named Raiders staffer judged BDB 2026.

### 1.3 What tends to win

#### Common winner/finalist traits

1. **The best projects invent a useful football object, not just a better score.** RouteNet created a route-classification object; 2020 created leverage/space-control objects; 2025 created disguise/tell objects; 2026 created ghost-defender distributions and positioning-added-value. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)]
2. **Finalists usually answer a coachable football question.** NFL prompts themselves reward relevance and football value, and the 2026 scoring rubric still gave 30% to "Football Score." [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)]
3. **Visualization quality is not optional anymore.** Since 2025 and 2026, the scoring weights explicitly reserve 20% for data visualization, and 2026 had a separate broadcast track. [[Kaggle 2025](https://www.kaggle.com/competitions/nfl-big-data-bowl-2025)] [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)]
4. **Reproducibility matters.** Kaggle rules require open-source licensing for winners and detailed reproducibility support. [[Kaggle analytics rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/rules)] [[Kaggle prediction rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction/rules)]
5. **The strongest projects combine modeling with attribution.** Lucca Ferraz did not stop at catch probability; he decomposed skill into positioning and catch-point added value. [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)]

#### Elimination patterns

These are partly inference, but they line up tightly with the scoring rules and official finalist outputs:

- **Pure computer-science novelty with weak football interpretation** tends to lose to slightly simpler models that create immediately usable football language. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)]
- **Pretty visuals without causal or tactical insight** do not survive against entries that change a call, teaching point, or valuation decision. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)]
- **Leaderboard-style modeling without notebook clarity or clean writeup** is especially fatal in analytics-track years because writeup plus visualization are 40% of the score. [[Kaggle analytics overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)]
- **Domain overreach** gets punished. The 2024 prompt explicitly warned that injury analysis was out of scope. [[Kaggle 2024](https://www.kaggle.com/competitions/nfl-big-data-bowl-2024)]

### 1.4 Hiring outcomes and the pipeline

NFL Operations says **more than 75 Big Data Bowl participants have been hired in data and analytics roles in sports**. [[NFL Operations BDB page](https://operations.nfl.com/gameday/analytics/big-data-bowl/)]

Representative publicly visible outcomes:

| Person | BDB connection | Later role | Evidence |
| --- | --- | --- | --- |
| Marc Richards | 2021 finalist/winner cluster | Director, Football Research and Development, Kansas City Chiefs | [[Chiefs staff page](https://www.chiefs.com/team/front-office-roster/)] |
| Caio Brighenti | 2020 honorable mention group | Football Data Scientist, Detroit Lions | [[LinkedIn](https://www.linkedin.com/in/caio-brighenti)] |
| Zach Drapkin | 2021 finalist | Football analyst pathway spanning PFF and team-adjacent work; visible public analytics profile | [[LinkedIn](https://www.linkedin.com/in/zach-drapkin-3614a8174)] |
| Ryan Gross | 2021 finalist group | Public football analytics/media role and research profile | [[LinkedIn](https://www.linkedin.com/in/ryanzgross)] |
| Jonah Lubin | Public BDB community participant and now Raiders data-science staffer | Football Data Science Assistant, Raiders | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] [[LinkedIn](https://www.linkedin.com/in/jonahlubin)] |

**Pipeline pattern:** the strongest public path is not "win BDB then get hired instantly." It is usually:

1. produce a strong public tracking project,
2. use Kaggle/BDB visibility to become legible,
3. keep publishing one or two adjacent projects,
4. then convert through internships, research-assistant roles, analyst roles, or staffer referrals.

That pattern is inference from public career paths and should be treated as directional rather than universal.

## Section 2 - NFL Football Analytics State of the Art (2026)

### 2.1 Tracking-data frontier

| Research lane | Public state of the art | What is mature vs. frontier |
| --- | --- | --- |
| Coverage attribution | NFL's 2025 rollout introduced **Coverage Responsibility**, based on tracking and charted concepts, and public academic work has pushed toward assignment inference from tracking. [[NFL NGS 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)] [[Decoding Defensive Coverage Responsibilities](https://arxiv.org/abs/2509.11834)] | Mature enough for production storytelling; still frontier for exact assignment attribution on every rep. |
| Trajectory prediction | 2026 BDB prediction formalized future-position prediction during ball flight with RMSE scoring and future-week evaluation. [[Kaggle prediction overview](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-prediction)] | Mature as a competition task; still frontier as a general-purpose coaching tool. |
| Route / intent classification | RouteNet and later BDB work showed route classification is tractable from tracking. [[Past recaps](https://operations.nfl.com/gameday/analytics/big-data-bowl/past-big-data-bowl-recaps/)] | Mature for common route families; still shaky on disguised/scramble-adjusted routes. |
| Pressure / trench modeling | The 2023 BDB line-play prompt and U of T pressure work pushed pass-rush attribution closer to coachable units. [[Kaggle 2023](https://www.kaggle.com/competitions/nfl-big-data-bowl-2023)] [[U of T article](https://sportsanalytics.sa.utoronto.ca/2023/03/15/2023-big-data-bowl/)] | Frontier because OL/DL assignment ground truth is still limited publicly. |
| Completion and tackle surfaces | Completion-probability, tackle-probability, xYAC-like ideas are now normal public language. [[NFL NGS 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)] [[nflfastR models](https://opensourcefootball.com/posts/2020-09-28-nflfastr-ep-wp-and-cp-models/)] | Mature. |
| Graph/relational models | Public papers increasingly model players as dynamic graphs or assignment networks, especially for coverage and interaction problems. [[Decoding Defensive Coverage Responsibilities](https://arxiv.org/abs/2509.11834)] [[Defensive Scheme Identification via Hidden Markov Models](https://arxiv.org/abs/2508.04588)] | Frontier, especially for coach-facing explanations. |

### 2.2 EPA/WPA/CPOE and what still matters

- **EPA and WPA still anchor public football decision analysis.** nflfastR's expected-points and win-probability framework remains the default public baseline for play value and game-state leverage. [[nflfastR models](https://opensourcefootball.com/posts/2020-09-28-nflfastr-ep-wp-and-cp-models/)]
- **CPOE still matters, but standalone CPOE is no longer enough.** Modern work almost always combines it with location, leverage, separation, or post-throw dynamics. [[nflfastR models](https://opensourcefootball.com/posts/2020-09-28-nflfastr-ep-wp-and-cp-models/)] [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)]
- The public frontier is moving toward **state-conditional attribution**: tackle probability, coverage responsibility, pressure attribution, disguise classification, and post-throw contested-space evaluation. [[NFL NGS 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)] [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)]
- **Contested point:** EPA remains unmatched for common language, but it is increasingly criticized when used without opponent, role, or assignment decomposition. That critique is an inference from recent tracking research rather than a single official statement.

### 2.3 Scheme analytics

- Motion is no longer "ornament." PFF's public motion work and BDB 2025's pre-snap prompt both treat motion as an information and leverage device. [[PFF motion article](https://www.pff.com/news/nfl-motions-week-2-2025)] [[Kaggle 2025](https://www.kaggle.com/competitions/nfl-big-data-bowl-2025)]
- Play-action remains valuable, but the frontier question is **who it displaces spatially and when** rather than simply whether it increases EPA on average. That is an inference based on the shift from aggregate EPA work to assignment/space-control work.
- Personnel grouping, condensed splits, and pre-snap shell manipulation have become more analytically tractable because 2025-2026 BDB datasets expose formation, alignment, coverage labels, and ball-flight dynamics. [[Kaggle 2025](https://www.kaggle.com/competitions/nfl-big-data-bowl-2025)] [[Kaggle analytics data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)]

### 2.4 Defensive analytics

- **Coverage Responsibility** is the newest widely visible public NGS defensive metric. [[NFL NGS 2025 metrics](https://www.nfl.com/news/next-gen-stats-new-advanced-metrics-you-need-to-know-for-the-2025-nfl-season)]
- Public pass-rush work is improving, but true assignment-aware pass-rush win modeling is still behind offensive passing models in maturity. [[Kaggle 2023](https://www.kaggle.com/competitions/nfl-big-data-bowl-2023)] [[U of T article](https://sportsanalytics.sa.utoronto.ca/2023/03/15/2023-big-data-bowl/)]
- Safety-rotation and shell-detection research exists publicly, but a lot of the best version is still not "productized" into broadly used open tools. [[Defensive Scheme Identification via Hidden Markov Models](https://arxiv.org/abs/2508.04588)]

### 2.5 Special teams and fourth-down models

- Ben Baldwin's fourth-down work and **RBSDM** remain the best-known public aggression baseline. [[RBSDM](https://rbsdm.com/stats/4th_calculator/)]
- nflverse remains the production-grade public foundation for these decision models; the package ecosystem is not hobbyist anymore for play-by-play work. [[nflverse documentation](https://nflverse.nflverse.com/)] [[nflfastR models](https://opensourcefootball.com/posts/2020-09-28-nflfastr-ep-wp-and-cp-models/)]
- Special-teams tracking is a real edge domain because public attention is thinner, but BDB 2022 showed it is analytically rich. [[Kaggle 2022](https://www.kaggle.com/competitions/nfl-big-data-bowl-2022)] [[NFL 2022 video recap](https://operations.nfl.com/gameday/analytics/big-data-bowl/2022-big-data-bowl-video-gallery-recap/)]

### 2.6 Open-source ecosystem: production-grade vs. hobbyist

| Tool / ecosystem | Status | Why |
| --- | --- | --- |
| nflverse / nflfastR / nflreadr / nflplotR | **Production-grade public stack** | Maintained, documented, extensively used in public research and media. [[nflverse documentation](https://nflverse.nflverse.com/)] |
| RBSDM calculators and data outputs | **Production-grade public decision support** | Widely used, coachable outputs, stable methodology. [[RBSDM](https://rbsdm.com/)] |
| Over the Cap draft/cap tools | **Production-grade for cap and pick-value planning** | Widely referenced, transparent enough for scenario work. [[Over the Cap draft chart](https://overthecap.com/draft)] [[Over the Cap Raiders cap page](https://overthecap.com/salary-cap/las-vegas-raiders)] |
| PFF public articles | **High-signal but partially opaque** | Strong research ideas, but not fully reproducible because core charting and grades are proprietary. [[PFF motion article](https://www.pff.com/news/nfl-motions-week-2-2025)] |
| One-off Kaggle notebooks | **Mixed** | Often creative, sometimes excellent, but durability and maintenance vary sharply. [[Kaggle 2026 analytics](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics)] |

### 2.7 Frontier 2024-2026: beyond standard public models

- **LLM/agent-assisted synthesis** is becoming real in football workflows. SumerSports has publicly promoted **SumerBrain**, and Microsoft has highlighted Copilot-style football assistant use cases. [[SumerBrain](https://www.sumersports.com/the-zone/sumerbrain-is-here/)] [[Microsoft Falcons/Copilot](https://news.microsoft.com/source/features/ai/microsoft-and-atlanta-falcons-bring-real-time-player-insights-to-the-nfl-combine/)]
- **Video-first computer vision on All-22** is still comparatively immature in public NFL work. There is adjacent progress in sports CV and scheme-identification research, but NFL public work remains much thinner than tracking-based work. [[Defensive Scheme Identification via Hidden Markov Models](https://arxiv.org/abs/2508.04588)] This is partly inference.
- **Injury/load modeling** is where team advantage likely separates most from public work. NFL/AWS's **Digital Athlete** program explicitly integrates more than public tracking and is aimed at injury-risk understanding. [[AWS Digital Athlete](https://aws.amazon.com/sports/nfl/digital-athlete/)]

### 2.8 Where public analytics ends and proprietary team analytics begins

This section is intentionally explicit about inference.

**Documented public limits**

- Big Data Bowl data is competition-limited, non-commercial, and excludes team-private practice, install, and medical datasets. [[Kaggle analytics rules](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/rules)] [[Kaggle analytics data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)]
- Public models rarely have true assignment labels for every OL/DL rep, coverage exchange, or route adjustment. [[Kaggle 2023](https://www.kaggle.com/competitions/nfl-big-data-bowl-2023)] [[Decoding Defensive Coverage Responsibilities](https://arxiv.org/abs/2509.11834)]

**Best inference on team-only edge**

Public analytics still has not fully cracked:

1. practice-load plus GPS/medical integration,
2. exact assignment attribution,
3. closed-loop self-scout tied to install language,
4. real-time coach-usable decision support,
5. and draft/free-agent models that combine coaching fit, contract, character, and medical risk into a single decision process.

That is the strategic opening for a Raiders-specific portfolio.

## Section 3 - 2026 NFL Draft Analytics

### 3.1 Public board synthesis

No single free public source gives a clean, current, consensus top 50 with equal detail across every position. The best April 2026 public blend is **Daniel Jeremiah + PFF board + position-level public rankings + RAS/combine signals**. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] [[PFF big board](https://www.pff.com/news/draft-2026-nfl-draft-big-board)] [[RAS](https://ras.football/)]

#### Highest-agreement top of class

| Position | Public blue-chip names repeatedly near the top | Public take on class strength |
| --- | --- | --- |
| QB | Fernando Mendoza, Garrett Nussmeier, Drew Allar, LaNorris Sellers | Viable QB class at the top; Mendoza is the most consistent No. 1 overall name in public Raiders-facing coverage. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] [[Raiders draft coverage](https://www.raiders.com/news/raiders-are-open-to-all-options-as-they-prioritize-assembling-a-complete-draft-class)] |
| RB | Jeremiyah Love, Makhi Hughes, Darius Taylor | Good top-end athletic/mismatch talent. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| WR | Carnell Tate, Jordyn Tyson, Eric Singleton Jr., Antonio Williams | Good but not obviously historic top tier. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| TE | Eli Stowers | Thin compared with the Brock Bowers year; more role-player than market-resetter at the top. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| OT | Kadyn Proctor, Francis Mauigoa, Spencer Fano | Strong tackle group, especially for scheme-fit projection. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| IOL/C | Parker Brailsford, Jake Slaughter | Lighter true premium value than OT, but solid middle of board. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| EDGE | T.J. Parker, Rueben Bain Jr., David Bailey | Strong premium-value lane. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] [[RAS: David Bailey](https://ras.football/ras-information/?PlayerID=27902)] |
| DT | Peter Woods, Caleb Banks, Tim Keenan III | Useful interior group, but not clearly as deep as edge or OT at the very top. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| LB | Sonny Styles, Anthony Hill Jr. | Very attractive for modern space/coverage linebackers. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] [[RAS: Sonny Styles](https://ras.football/ras-information/?PlayerID=28024)] |
| CB | Mansoor Delane, Jermod McCoy, Malik Muhammad | Good corner class, especially for long/fast traits. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |
| S | Caleb Downs, Dillon Thieneman | Strong high-end safety talent. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] |

### 3.2 Analytics-informed prospect framing

Public models tend to reward:

- early breakout production,
- premium athleticism,
- younger declare age,
- pass-game impact for receiving weapons,
- tackle/edge/corner over lower-value positions,
- and tested movement skill at coverage-relevant positions.

**Public analytics darlings** from the top of the 2026 board:

- **Sonny Styles**: elite size-movement profile and modern space-LB utility. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] [[RAS: Sonny Styles](https://ras.football/ras-information/?PlayerID=28024)]
- **David Bailey**: premium edge archetype with elite testing appeal. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)] [[RAS: David Bailey](https://ras.football/ras-information/?PlayerID=27902)]
- **Caleb Downs**: safety value is capped by positional market, but public analysts treat him like a true impact defender because he wins the role-flexibility argument. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)]
- **Fernando Mendoza**: QB value swamps positional-market concerns if the internal model clears him. Public Raiders coverage strongly suggests he is the live No. 1 overall discussion. [[Raiders draft coverage](https://www.raiders.com/news/raiders-are-open-to-all-options-as-they-prioritize-assembling-a-complete-draft-class)] [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)]

**Public analytics concerns**

- **TE/RB early picks** remain harder to justify in surplus-value terms unless the player projects as a true offensive engine. That is inference from positional-value literature and market prices. [[Over the Cap draft chart](https://overthecap.com/draft)] [[Spotrac market value](https://www.spotrac.com/nfl/market-value/)]
- **Corners with incomplete testing or medical noise** remain fragile public-model bets even if scouts like the film. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)]

### 3.3 Combine integration

Players whose testing materially improved public enthusiasm:

- **Sonny Styles**: elite Relative Athletic Score strengthened the case for him as a true modern three-level linebacker/chess piece. [[RAS: Sonny Styles](https://ras.football/ras-information/?PlayerID=28024)]
- **David Bailey**: elite explosive/edge testing increased comfort with his premium-traits projection. [[RAS: David Bailey](https://ras.football/ras-information/?PlayerID=27902)]
- **Mansoor Delane**: speed-testing helped cement the long-speed requirement NFL teams want from outside corners. [[Daniel Jeremiah 4.0](https://www.nfl.com/news/daniel-jeremiah-s-top-50-2026-nfl-draft-prospect-rankings-4-0)]

### 3.4 Positional value and trade charts

#### Raiders 2026 pick inventory

Official club list as of March 13, 2026:

| Round | Pick |
| --- | --- |
| 1 | 1 |
| 2 | 36 |
| 3 | 67 |
| 4 | 102 |
| 4 | 117 |
| 4 | 134 |
| 5 | 175 |
| 6 | 185 |
| 6 | 208 |
| 7 | 219 |

Source: [[Raiders draft order](https://www.raiders.com/news/a-look-at-the-las-vegas-raiders-full-2026-nfl-draft-order)]

#### Trade-value snapshot

| Pick | Jimmy Johnson (DraftTek) | Rich Hill (DraftTek) | Fitzgerald-Spielberger / OTC |
| --- | --- | --- | --- |
| 1 | 3000 | 1000 | 514 |
| 36 | 540 | 166 | 159 |
| 67 | 255 | 75 | 91 |
| 102 | 92 | 34 | 52 |
| 117 | 60 | 26 | 41 |
| 134 | 39 | 17 | 31 |
| 175 | 21.4 | 8 | 16 |
| 185 | 17 | 7 | 13 |
| 208 | 7.8 | 4 | 8 |
| 219 | 3 | 4 | 6 |

Sources: [[DraftTek Jimmy Johnson chart](https://www.drafttek.com/NFL-Trade-Value-Chart.asp?RequestTeam=LV)] [[DraftTek Rich Hill chart](https://www.drafttek.com/NFL-Trade-Value-Chart-Rich-Hill.asp?RequestTeam=Nyg)] [[Over the Cap draft chart](https://overthecap.com/draft)]

**Interpretation:** Jimmy Johnson still massively overstates the value of No. 1 overall versus modern charts. If the Raiders trade down, they should anchor negotiations to a modern chart, not let another club frame the deal with legacy Jimmy Johnson math.

### 3.5 Raiders-specific draft context

#### Cap and contract context

- Over the Cap lists about **$23.25M** in 2026 effective cap space, **$52.0M** in dead money, and about **$108.5M** in 2027 effective cap space. [[Over the Cap Raiders cap page](https://overthecap.com/salary-cap/las-vegas-raiders)]
- NFL IQ's current Raiders draft/team card independently shows about **$23M** in cap space context, which lines up with Over the Cap's public snapshot and makes the two sources directionally consistent. [[NFL IQ](https://www.nfl.com/iq)]
- **Maxx Crosby** signed a multi-year extension on **March 5, 2025**. [[Raiders: Crosby extension](https://www.raiders.com/news/maxx-crosby-raiders-sign-to-multi-year-extension-nfl-2025-transactions)]
- The Raiders traded **Geno Smith** on **March 11, 2026** and then signed **Kirk Cousins** on **April 6, 2026**. Both are **changed within 90 days**. [[Raiders: Geno trade](https://www.raiders.com/news/raiders-acquire-2026-sixth-round-draft-pick-in-exchange-for-qb-geno-smith)] [[Raiders: Kirk Cousins signing](https://www.raiders.com/news/raiders-sign-kirk-cousins-quarterback-nfl-2026-free-agency-transactions)]
- Over the Cap lists inexpensive 2026 cap hits for **Brock Bowers** and **Ashton Jeanty**, which is exactly the type of rookie-cost efficiency a team with high dead money should lean into. [[Over the Cap Raiders cap page](https://overthecap.com/salary-cap/las-vegas-raiders)]

#### Roster strengths and weaknesses

**Documented core strengths**

- **Star edge**: Maxx Crosby remains the centerpiece. [[Raiders: Crosby extension](https://www.raiders.com/news/maxx-crosby-raiders-sign-to-multi-year-extension-nfl-2025-transactions)]
- **Cheap offensive skill talent**: Brock Bowers and Ashton Jeanty are still on favorable rookie structures. [[Over the Cap Raiders cap page](https://overthecap.com/salary-cap/las-vegas-raiders)]
- **NFL IQ offensive core snapshot:** Ask NFL IQ currently identifies the Raiders' primary offensive skill-position group as **Kirk Cousins / Aidan O'Connell** at quarterback, **Ashton Jeanty** at running back, **Brock Bowers** and **Michael Mayer** at tight end, and a WR group led by **Tre Tucker**, **Jalen Nailor**, **Jack Bech**, and **Dont'e Thornton Jr.** [[Ask NFL IQ: Raiders skill players](https://www.nfl.com/iq?chatmax=true&prompt=Who%20are%20the%20Raiders%20current%20primary%20skill-position%20players%20on%20offense%3F)]
- **NFL IQ offensive-line core snapshot:** Ask NFL IQ currently points to **Kolton Miller**, **Tyler Linderbaum**, **Jackson Powers-Johnson**, **Spencer Burford**, and **DJ Glaze** as the key offensive linemen, with Miller/Linderbaum as the clear veteran cornerstones. [[Ask NFL IQ: Raiders offensive line](https://www.nfl.com/iq?chatmax=true&prompt=Who%20are%20the%20Raiders%20current%20key%20offensive%20linemen%3F)]
- **Draft flexibility**: 10 picks including No. 1 overall. [[Raiders draft order](https://www.raiders.com/news/a-look-at-the-las-vegas-raiders-full-2026-nfl-draft-order)]

**Likely weaknesses**

- **Long-term quarterback certainty** is not solved by a veteran Cousins bridge alone. Ask NFL IQ currently lists the live QB room as **Kirk Cousins** and **Aidan O'Connell**, and notes both are tracking toward 2027 free agency, which reinforces the franchise-QB need implied by the No. 1 pick. [[Ask NFL IQ: Raiders quarterbacks](https://www.nfl.com/iq?chatmax=true&prompt=Who%20are%20the%20current%20Raiders%20quarterbacks%3F)] [[Raiders draft order](https://www.raiders.com/news/a-look-at-the-las-vegas-raiders-full-2026-nfl-draft-order)]
- **Wide receiver depth / separation creation** remains a public concern. NFL IQ's live Team Central card lists WR in the Raiders' top three needs, and Ask NFL IQ explicitly says the current room still lacks a true WR1 even after adding Jalen Nailor. [[NFL IQ](https://www.nfl.com/iq)] [[Ask NFL IQ: Raiders skill players](https://www.nfl.com/iq?chatmax=true&prompt=Who%20are%20the%20Raiders%20current%20primary%20skill-position%20players%20on%20offense%3F)]
- **Offensive line**, especially beyond the Miller/Linderbaum/JPJ core, remains a real build area. NFL IQ's live card includes OL in the top three needs, and Ask NFL IQ flags guard as a glaring hole. [[NFL IQ](https://www.nfl.com/iq)] [[Ask NFL IQ: Raiders roster holes](https://www.nfl.com/iq?chatmax=true&prompt=What%20are%20the%20Raiders%20current%20top%20roster%20holes%20entering%20the%202026%20NFL%20Draft%3F)]
- **Cornerback and interior defensive line** also show up in the current NFL IQ need stack, which is useful because those spots were easier to understate from team press releases alone. [[Ask NFL IQ: Raiders roster holes](https://www.nfl.com/iq?chatmax=true&prompt=What%20are%20the%20Raiders%20current%20top%20roster%20holes%20entering%20the%202026%20NFL%20Draft%3F)]

### 3.6 Undervalued archetypes for the Raiders

1. **Big slot / movement WRs who can block and win from reduced splits.** This fits Kubiak-tree play-action and condensed-formation sequencing.
2. **Coverage-capable linebackers and big nickel defenders.** Modern AFC West offenses force matchups, not just gap fits.
3. **Day-2/Day-3 tackles with verified movement skill** who can be developed inside/outside before 2027 cap clean-up.
4. **Corners with length plus speed but modest ball-production résumés.** Public models may slightly discount them; scheme fit may not.

## Section 4 - Raiders Organizational Context (as of April 20, 2026)

### 4.1 Leadership and coaching ground truth

| Topic | Publicly documented status |
| --- | --- |
| GM | John Spytek is operating as the club's GM and publicly fronting the 2026 draft process. [[Raiders draft-room article](https://www.raiders.com/news/raiders-reveal-upgraded-draft-room)] |
| Head coach | **Klint Kubiak**, hired **Feb. 9, 2026**. [[Raiders: Kubiak hire](https://www.raiders.com/news/klint-kubiak-named-head-coach-of-the-las-vegas-raiders)] |
| Offensive coordinator | **Andrew Janocko**. [[Raiders: 2026 staff](https://www.raiders.com/news/raiders-announce-2026-coaching-staff)] |
| Defensive coordinator | **Rob Leonard**. [[Raiders: 2026 staff](https://www.raiders.com/news/raiders-announce-2026-coaching-staff)] |
| Pass game coordinator / DBs | **Joe Woods**. [[Raiders: 2026 staff](https://www.raiders.com/news/raiders-announce-2026-coaching-staff)] |
| Special teams coordinator | **Joe DeCamillis**. [[Raiders: 2026 staff](https://www.raiders.com/news/raiders-announce-2026-coaching-staff)] |
| Assistant HC | **Mike McCoy**. [[Raiders: 2026 staff](https://www.raiders.com/news/raiders-announce-2026-coaching-staff)] |

**Changed within 90 days:** every staff item above except the GM-facing draft coverage.

### 4.2 Raiders analytics structure

| Role | Name | Public URL |
| --- | --- | --- |
| SVP, Football Operations and Strategy | Mark Thewes | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] [[LinkedIn](https://www.linkedin.com/in/markthewes)] |
| VP, Football Research and Development | David Christoff | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] [[LinkedIn](https://www.linkedin.com/in/davidchristoff)] |
| Senior Manager, Football Strategy | Kunal Singh | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] |
| Manager, Football Data Science and Engineering | Andrew Fedele | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] [[LinkedIn](https://www.linkedin.com/in/andrew-fedele-b6a52240)] |
| Coordinator, Player Personnel Research and Strategy | Walt King | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] |
| Football Data Science Assistant | Jonah Lubin | [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)] [[LinkedIn](https://www.linkedin.com/in/jonahlubin)] |

**Takeaway:** the Raiders already have a public-facing research/data-science spine. That makes externally pitched work more credible if it clearly complements rather than reinvents what is already inside the building.

### 4.3 Scheme identity

- **Offense:** Kubiak's background points to a Shanahan/Kubiak family structure: under-center, wide-zone / keeper / play-action stress, but with enough passing-game flexibility to incorporate modern shotgun answers. His hiring announcement explicitly highlights successful recent work in Seattle, New Orleans, San Francisco, and Minnesota, all strong play-action/play-sequencing environments. [[Raiders: Kubiak hire](https://www.raiders.com/news/klint-kubiak-named-head-coach-of-the-las-vegas-raiders)]
- **Defense:** the current public staff map points less to a pure "Pete Carroll defense" and more to a modernized blend through **Rob Leonard** and **Joe Woods**. The actionable question is not whether the Raiders "are Cover 3"; it is how often they can show single-high structure and rotate into matchup-sound answers against condensed-motion offenses. This is inference from the staff turnover and league context.

### 4.4 Cultural / ownership signals

- Publicly verifiable signals in the reviewed sources show a front office investing in **draft infrastructure** and a full reset around the new coach. Spytek's April 17, 2026 draft-room comments reinforce that the organization is treating this draft as a franchise-shaping event. [[Raiders draft-room article](https://www.raiders.com/news/raiders-reveal-upgraded-draft-room)]
- I did **not** find a clean primary public source in this run that precisely defines Mark Davis's 2026 analytics philosophy or Tom Brady's exact day-to-day football influence. Those topics should be treated carefully rather than guessed.

### 4.5 AFC West comparison

| Team | Publicly visible on-field edge | Publicly visible analytics/research posture | What this means for Las Vegas |
| --- | --- | --- | --- |
| Chiefs | Mahomes-Reid continuity and elite decision-making baseline | Public front office includes **Marc Richards**, Director of Football Research and Development. [[Chiefs staff page](https://www.chiefs.com/team/front-office-roster/)] | Las Vegas cannot beat Kansas City by being average at offensive efficiency and game management. |
| Broncos | Sean Payton infrastructure and strong defense | Broncos publicly list multiple football-technology and analytics roles. [[Broncos front office](https://www.denverbroncos.com/team/front-office-roster/)] | Denver looks structurally serious about internal football-process support. |
| Chargers | Harbaugh-style physical identity and roster discipline | Public Chargers pages show more limited football-analytics visibility than Denver or Las Vegas, at least from what is easy to verify. [[Chargers front office](https://www.chargers.com/team/front-office-roster/)] | Raiders can plausibly out-build LAC in public-facing research sophistication if execution is good. |

**Bottom line:** the Raiders' widest structural gap is still versus the **Chiefs' combined coaching/QB/decision system**, not raw data-science headcount.

## Section 5 - Strategic Advantage Brainstorm

**Important note:** all edge estimates below are **directional and speculative**, not measured outcomes. They are intended as portfolio triage, not promises.

| Cat. | Concept | Hypothesis | Data required | Modeling approach | Decision informed | Estimated edge | BDB fit | Diff. / time | Why Raiders benefit more |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | Motion Disclosure Index | Motion can be scored by how much it changes the posterior over coverage responsibility before the snap. | Public tracking + coverage labels; proprietary if hired for install tags | Pre-snap player graph -> shell classifier -> post-motion responsibility posterior shift -> EPA delta | Which motions actually reveal or distort coverage | ~0.4 to 0.8 EPA/game | Yes; directly aligns with 2025-2026 style data themes | 4 / 6-8 wks | New staff means the Raiders can design motion identity from scratch. |
| A | Personnel Bluff Detector | Certain personnel groupings force predictable defensive adjustments; quantify when "bluff" personnel really buys a mismatch. | Public tracking, play-by-play, personnel | Bayesian mixed model on personnel x formation x opponent response | 11/12/21 usage and fake-run personnel packages | ~0.2 wins/year | Yes | 3 / 4-6 wks | Kubiak offense should lean on personnel stress more than league average. |
| B | Play-Action Displacement Map | The value of play action is in displacing second-level defenders, not average play-action EPA. | Tracking around mesh and early post-throw frames | Linebacker/safety displacement model -> route-window creation score -> EPA attribution | Under-center vs shotgun PA menu | ~0.5 EPA/game | Yes | 4 / 6-8 wks | Fits Kubiak-tree sequencing and Jeanty/Bowers stress. |
| B | Screen Escort Geometry Optimizer | Screen success depends on convoy geometry and timing, not screen volume. | Tracking, OL assignments if available, route tags | Convoy graph + blocker-angle success model + tackle-probability overlay | Which screens and to whom | ~10-18 EPA over season | Borderline; depends on prompt | 3 / 4-6 wks | Useful for a QB bridge offense that may want easy efficiency. |
| C | Shell-to-Responsibility Mismatch Model | The offense's real edge is not identifying shell, but identifying when shell lies about actual responsibility. | Public tracking plus coverage labels/responsibility proxies | Pre-snap shell model -> post-snap responsibility classifier -> mismatch exploiter score | Alert routes, shot calls, protection tags | ~0.2 to 0.4 wins/year | Yes; excellent BDB angle | 5 / 8-10 wks | AFC West defenses major in disguise; Raiders need QB-friendly answers. |
| C | Leverage Alert Engine | You can pre-compute the highest-value hot/alert route based on leverage and expected rotation. | Tracking + route families + QB location | GNN on pre-snap alignment -> likely leverage winner -> EPA delta by audible | QB alerts and mirrored concepts | ~6-12 explosive plays/year | Yes | 4 / 6-8 wks | Especially helpful if rookie QB starts after a Cousins bridge. |
| D | Condensed-Formation Stress Map | Defensive spacing against condensed sets can be optimized by measuring route overlap stress, not just coverage family. | Tracking + route labels + target outcome | Route-interaction model -> stress heat map -> coverage call EPA | Which coverages survive bunch/condensed looks | ~0.3 wins/year | Yes; strong coaching track | 4 / 6-8 wks | AFC West offenses punish static spacing; Raiders need modern answers. |
| D | Rotation Disguise Efficiency | Not every rotation is worth the bust risk; score disguise by value created minus assignment volatility. | Tracking + bust flags if proprietary | Hidden-state shell model + bust-probability penalty | Single-high disguise menu and DB deployment | ~0.2 wins/year | Yes | 5 / 8-10 wks | New defensive staff can set efficient disguise rules early. |
| E | Low-WP Aggression Curve | Bad-to-average teams should be more aggressive than league-average 4th-down charts imply. | Play-by-play, roster strength priors, QB/defense quality | Team-calibrated WP model -> counterfactual aggressiveness policy | 4th-down choices | ~0.15 to 0.3 wins/year | No; not ideal BDB unless tied to tracking | 2 / 2-3 wks | Raiders are more likely than elite teams to benefit from variance. |
| E | Personalized Two-Point Chart | Optimal 2-point behavior changes with your QB, short-yardage roster, and defense. | Red-zone play-by-play, tracking near goal line | Team-specific success priors + dynamic programming | 2-point attempts, late-game chase policy | ~0.05 to 0.15 wins/year | No | 2 / 2-3 wks | Jeanty/Bowers packages could create non-generic goal-line value. |
| F | Scheme-Weighted Surplus Board | Draft and free-agent models should blend value, projection, and fit to Kubiak/Leonard systems. | Public boards, athletic data, contract markets; proprietary interviews/medical if hired | Multi-objective ranking: talent score + scheme fit + surplus value + risk | Draft board and mid-tier FA targets | $8M to $20M annual surplus | Partial; draft work is usually outside BDB scope | 3 / 4-6 wks | Raiders have rare top-pick leverage plus lots of Day 2/3 swings. |
| F | Veteran Arbitrage Finder | The market underprices certain scheme-fit veterans who can bridge 2026 without hurting 2027 cap flexibility. | OTC, Spotrac, age curves, public grades | Aging curve + scheme-role clustering + cut/trade candidate scanner | Cheap veteran signings and trades | $4M to $10M cap efficiency | No | 3 / 3-4 wks | Dead-money-heavy teams must shop differently than contenders. |
| G | Acute-Chronic Load Watchlist | Tracking and game-speed asymmetry can flag heightened soft-tissue risk earlier than injury reports do. | Proprietary practice/GPS ideal; public tracking for proxy | Rolling load model with acceleration/deceleration asymmetry | Practice taper, snap management | 1-2 key player games preserved | No with public-only data | 5 / 8-12 wks | Crosby and other high-leverage players create huge availability value. |
| G | Return-to-Play Reacceleration Monitor | The first weeks after return can be scored for movement quality, not just snap count. | Tracking + medical return dates | Baseline-vs-return movement similarity model | Re-ramp decisions | Avoid 1 re-injury or lost stretch run | No | 4 / 6-8 wks | Helps a roster carrying dead money and needing health efficiency. |
| H | Raiders Tell Detector | Your own alignment, split, motion, or stance tells are probably already on opponent cutups; measure them first. | Public tracking + film tags if proprietary | Mutual-information screen on pre-snap variables -> opponent exploit model | Self-scout corrections | ~0.2 wins/year | Yes; classic BDB coaching fit | 3 / 4-5 wks | New staff can clean tells before habits harden. |
| H | Opponent Script Alarm | First-15 and opening-drive tendencies can be modeled as a sequence problem instead of static percentages. | Play-by-play + tracking + game state | Sequence model on scripted tendencies and shot triggers | Defensive openers and call-sheet alerts | 3-5 drive-killing plays/year | Borderline | 3 / 3-5 wks | Valuable against Reid, Payton, and Harbaugh staffs. |
| I | Sideline Alert Feed | The best real-time tool is a low-bandwidth alert layer, not a giant dashboard. | Public tracking for offline build; proprietary live feed if hired | Precomputed trigger engine -> one-line recommendations | Timeout, challenge, aggression, matchup alerts | Small but compounding | No public BDB | 4 / 6-10 wks | Useful for a first-year HC installing systems quickly. |
| I | Halftime Counterfactual Explorer | Halftime should answer "what if we had called X more against this shell/spacing?" | Play-by-play + tracking | Fast nearest-neighbor counterfactual library | Second-half plan changes | ~0.1 wins/year | No | 4 / 6-8 wks | Raiders can build disciplined weekly process with a new staff. |
| J | Comp-Pick Farming Optimizer | Teams can systematically manage free-agency exits and signings to create future draft capital. | Contract market, OTC compensatory formulas | Free-agent decision simulator under comp-pick rules | Offseason signing cadence | 1 extra Day 3 pick/year | No | 2 / 2-3 wks | Valuable for a roster still rebuilding around premium picks. |
| J | Extension Timing Simulator | The timing of Crosby/Miller/future young-core deals matters as much as the APY. | Contract markets, cap tables, aging curves | Monte Carlo cap simulator with roster states | Extension timing and rollover strategy | $5M to $15M cap flexibility | No | 3 / 3-5 wks | Raiders' 2026-2027 cap shape makes timing edge real. |

## Section 6 - Best Big Data Bowl 2027 Bets

Because **no official BDB 2027 prompt was publicly available as of April 20, 2026**, the best portfolio candidates are the ones that:

1. are strong public-tracking projects on their own,
2. can pivot to multiple prompt types,
3. and create obvious coaching or broadcast value.

### 6.1 Concept 1: Motion Disclosure Index

**Why this is top-tier**

- It sits exactly at the intersection of 2025's pre-snap emphasis and 2026's movement emphasis.
- It is football-native, explainable, and visually strong.
- It is immediately useful to both offense and defense.

**Technical design**

- Data pipeline:
  - ingest BDB 2025-style pre-snap tracking or analogous public tracking,
  - normalize by play direction and hash,
  - attach formation, receiver alignment, motion flags, and downstream coverage labels,
  - build a play-level table keyed to motion start/end and post-snap coverage family.
- Features:
  - shell geometry,
  - corner depth and leverage,
  - nickel apex location,
  - safety width and pedal behavior,
  - LB stack depth,
  - motion path type,
  - offensive splits and condensed indicators.
- Model:
  - baseline multinomial logistic model for post-snap coverage family,
  - gradient-boosted tree for shell-to-coverage probabilities,
  - optional player-graph encoder for motion interaction effects.
- Validation:
  - leave-one-week-out or leave-one-team-out validation,
  - compare pre-motion posterior vs. post-motion posterior accuracy,
  - measure downstream EPA lift when offense chooses the highest-disclosure motion.
- Baselines:
  - no-motion baseline,
  - formation-only baseline,
  - shell-only baseline.

**Visualization plan**

- Animated field view showing posterior bars for likely coverages before and after motion.
- "Disclosure meter" that spikes when motion materially narrows the defense's likely responsibilities.
- Team-level leaderboard of motions that force the clearest defensive declaration.

**Novelty argument**

- Advances beyond "motion helps" by quantifying **how much information** each motion buys.
- More coachable than a raw coverage classifier because it scores motion as a decision tool.

**Concrete coaching action**

- Example: if orbit motion against a 2-high mugged front consistently collapses the defense into a smaller set of rotation outcomes, the OC should promote that motion into the early-down menu, especially for a bridge QB.

**Writeup skeleton**

1. Problem: not all motion is informationally equal
2. Data and framing
3. Motion-to-disclosure model
4. Validation and baselines
5. Which motions create real information
6. Case study
7. Coaching and broadcast applications

### 6.2 Concept 2: Shell-to-Responsibility Mismatch Model

**Why this is top-tier**

- It extends the exact public frontier opened by coverage responsibility and disguise modeling.
- It is highly NFL-relevant because every staff cares about disguise, but the offensive question is still underexplored publicly.

**Technical design**

- Data pipeline:
  - start with tracking, shell, coverage type, and route context,
  - infer or classify post-snap responsibility zones,
  - join targeted-receiver route and pass outcome.
- Features:
  - pre-snap shell,
  - motion-adjusted shell,
  - route stem,
  - target depth,
  - receiver release leverage,
  - nearest-defender angle,
  - ball landing coordinates,
  - post-snap safety displacement.
- Model architecture:
  - stage 1: shell classifier,
  - stage 2: responsibility classifier,
  - stage 3: mismatch value model predicting expected catch probability or EPA delta given the shell-to-responsibility gap.
- Validation:
  - Brier score or log loss for responsibility prediction,
  - calibration by route family,
  - holdout by week and by defense.
- Baselines:
  - shell-only offensive decision rule,
  - route-depth-only catch model,
  - static man/zone split.

**Visualization plan**

- Split-screen animations with the same shell but different realized responsibilities.
- Responsibility overlays that show how two identical shells produce opposite route answers.
- "Lying shell" leaderboard by defense.

**Novelty argument**

- Public work has focused on detecting disguise; this would focus on **offensive exploitation value** from that disguise gap.

**Concrete coaching action**

- If Cover-2-looking shells from a given opponent repeatedly rotate into weak-hook voids against reduced splits, that becomes an alert route family for Bowers or the slot.

**Writeup skeleton**

1. Shell is not assignment
2. Data and responsibility framing
3. Mismatch model
4. Calibration and case studies
5. Offensive application
6. Defensive counter-use

### 6.3 Concept 3: Condensed-Formation Stress Map

**Why this is top-tier**

- Condensed formations are a live league problem.
- It is visual and coachable.
- It can be pitched from either offensive or defensive perspective.

**Technical design**

- Data pipeline:
  - isolate condensed/bunch/nasty-split plays,
  - attach route distributions, target outcomes, and coverage structures,
  - create interaction zones among defenders during route expansion.
- Features:
  - split width,
  - bunch spacing,
  - release timing,
  - cross/over/return route combinations,
  - defender switch depth,
  - safety entry angle.
- Model:
  - route-interaction graph plus defender-conflict score,
  - expected stress surface over first 2.5 seconds,
  - EPA and completion overlays.
- Validation:
  - does higher modeled stress predict busts, target separation, or EPA?
  - compare with simpler bunch-vs-non-bunch averages.

**Visualization plan**

- Animated stress heat map blooming from condensed sets.
- Defensive "stress fingerprints" by call family.
- Opponent scout cards showing which coverage answers survive particular route families.

**Novelty argument**

- Moves from static "bunch is hard to defend" to a measured stress geometry framework.

**Concrete coaching action**

- Defensive side: rotate out of any call family that repeatedly creates high-stress switch points against a rival's favorite condensed package.

**Writeup skeleton**

1. Why condensed formations break rules
2. Stress-map framework
3. Validation vs. EPA and separation
4. Defensive call implications
5. Case study

## Section 7 - Outreach and Positioning

### 7.1 Public Raiders analytics org chart

The cleanest public map is:

Mark Thewes -> David Christoff -> Kunal Singh / Andrew Fedele / Walt King -> Jonah Lubin. [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)]

### 7.2 Warmest contacts for a non-traditional pivot

1. **Jonah Lubin** - closest to recent BDB/community pathway and likely easiest empathy match for a skills-first transition story. [[LinkedIn](https://www.linkedin.com/in/jonahlubin)]
2. **Andrew Fedele** - hands-on data science/engineering title suggests practical build orientation. [[LinkedIn](https://www.linkedin.com/in/andrew-fedele-b6a52240)]
3. **Walt King** - player personnel research/strategy is a good bridge between scouting and analytics, and public posts indicate mentoring exposure around BDB-style talent. [[Raiders administration page](https://www.raiders.com/team/front-office-roster/)]
4. **David Christoff** - senior enough to see strategic fit, still directly tied to football research. [[LinkedIn](https://www.linkedin.com/in/davidchristoff)]
5. **Mark Thewes** - highest upside reach once there is already a concrete artifact worth forwarding. [[LinkedIn](https://www.linkedin.com/in/markthewes)]

### 7.3 Recommended sequence

**Recommendation:** do **not** cold-message first with only biography. Build one sharp public artifact first, then message **before** BDB submission season opens in earnest.

Why:

- A teaser plus live repo/notebook makes you legible.
- It avoids sounding like a generic career-change ask.
- It still gives the contact time to recognize your name before BDB noise ramps up.

**Best cadence**

1. Build one public prototype by early summer.
2. Send a short note with the artifact, one Raiders-relevant takeaway, and zero job ask.
3. Enter BDB 2027 when announced.
4. Follow up only if the project deepens, places, or clearly improves.

### 7.4 Positioning language for your background

Use something close to this:

> I come from high-stakes stochastic decision environments where uncertainty, spatial risk, and operational timing matter more than clean textbook data. My background includes DOE Hanford risk assessment, ERCOT QSE operations, and LLM/automation systems that turn messy real-world signals into decision support. In football terms, that maps naturally to tracking-data modeling, counterfactual analysis, uncertainty calibration, and building tools coaches can actually use under time pressure.

Why this works:

- It translates your past into football-relevant primitives.
- It avoids pretending you already "are" a scout.
- It frames you as someone who can handle uncertainty, spatial systems, and decision support, which is exactly what tracking and game-management work require.

## Prioritized 90-Day Action Plan

### Weeks 1-2

- Build a clean local data pipeline for historic BDB tracking data and nflverse merges. [[Kaggle analytics data](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/data)] [[nflverse documentation](https://nflverse.nflverse.com/)]
- Reproduce one baseline model from the 2026 winner paper: catch probability or ghost-defender sampling. [[Winning writeup](https://www.kaggle.com/competitions/nfl-big-data-bowl-2026-analytics/writeups/ghostbusters-back-off-man-im-a-data-scientist)]
- Start a Raiders notebook with roster, cap, and draft capital snapshots. [[Raiders draft order](https://www.raiders.com/news/a-look-at-the-las-vegas-raiders-full-2026-nfl-draft-order)] [[Over the Cap Raiders cap page](https://overthecap.com/salary-cap/las-vegas-raiders)]

### Weeks 3-4

- Prototype **Motion Disclosure Index** on a subset of teams.
- Prototype **Raiders Tell Detector** on old Raiders offensive data.
- Draft two visual styles: one analyst-first, one broadcast-first.

### Weeks 5-6

- Choose the strongest of:
  - Motion Disclosure Index
  - Shell-to-Responsibility Mismatch
  - Condensed-Formation Stress Map
- Harden validation and baseline comparisons.
- Write a short public memo with one Raiders-specific insight derived from the prototype.

### Weeks 7-8

- Expand the Raiders portfolio:
  - low-WP aggression curve,
  - scheme-weighted surplus board,
  - comp-pick farming optimizer.
- Prepare one outreach artifact: a 2-3 page PDF or a polished notebook landing page.

### Weeks 9-10

- Contact the first two warmest Raiders targets with the artifact and one concise takeaway.
- Build version 2 of the strongest BDB concept with better animation and a clearer coaching use case.
- Add one opponent-specific AFC West case study.

### Weeks 11-12

- Finalize a reusable BDB project skeleton:
  - data ingestion,
  - feature store,
  - evaluation harness,
  - chart templates,
  - animation templates.
- Publish a second public artifact, ideally on a distinct theme from the first.

### Week 13

- Review what gained traction:
  - which concept is strongest technically,
  - which concept is most Raiders-relevant,
  - which concept is most telegenic.
- Decide whether to pursue one flagship BDB entry or a lead concept plus one backup.

## Bottom Line

The Raiders do **not** need generic analytics evangelism. They need a small set of high-signal systems that fit a new Kubiak-led regime, protect 2027 cap flexibility, and exploit the rare leverage that comes with the No. 1 pick plus 10 total selections. The public BDB record suggests the strongest way into that conversation is to build one or two unusually coachable tracking projects now, then use BDB 2027 as an accelerant rather than the only door.
