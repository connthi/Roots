/** @typedef {{ axis1?: number, axis2?: number, axis3?: number, axis4?: number }} AxisDeltas */

/**
 * 20-question financial personality model.
 * axis1: Time Horizon (V+ / E-)
 * axis2: Execution Style (S+ / T-)
 * axis3: Budget Architecture (F+ / C-)
 * axis4: Asset Risk (A+ / R-)
 */
export const QUESTIONS = [
  {
    id: 1,
    text: 'You unexpectedly receive a $500 cash bonus. What is your immediate instinct?',
    options: [
      { label: 'Put it straight into my long-term investment portfolio and let it compound.', deltas: { axis1: 2 } },
      { label: 'Stash it in my savings account to pad my cash reserves for upcoming milestones.', deltas: { axis1: 1 } },
      { label: "Treat myself to a high-quality item or upgrade I've wanted for a couple of weeks.", deltas: { axis1: -1 } },
      { label: 'Book a spontaneous weekend trip or host a massive night out with the squad.', deltas: { axis1: -2 } },
    ],
  },
  {
    id: 2,
    text: 'You allocate money into an asset, and the entire market dips 15% the very next week. What is your move?',
    options: [
      { label: 'Panic and instantly regret it. I pull my money out immediately to prevent further bleeding.', deltas: { axis4: -2 } },
      { label: 'Leave it alone but feel deeply anxious, wishing I stuck to a guaranteed, risk-free savings account.', deltas: { axis4: -1 } },
      { label: 'Stay completely unfazed. I understand market volatility is normal and trust it will recover eventually.', deltas: { axis4: 1 } },
      { label: 'View it as a massive discount. I immediately drop more capital into the asset to buy the absolute dip.', deltas: { axis4: 2 } },
    ],
  },
  {
    id: 3,
    text: 'You need to open a new checking or savings account. How do you choose where to go?',
    options: [
      { label: 'Spend hours reading fine print, comparing APY rates, and calculated fee structures across multiple banks.', deltas: { axis2: 2 } },
      { label: 'Look up a couple of reputable financial subreddits or review articles to see what the top recommendation is.', deltas: { axis2: 1 } },
      { label: 'Go with whatever reputable bank my friends or family recommend to avoid overthinking it.', deltas: { axis2: -1 } },
      { label: 'Pick the bank with the absolute cleanest app interface, fastest mobile onboarding, and best branding.', deltas: { axis2: -2 } },
    ],
  },
  {
    id: 4,
    text: "Your close friend circle is planning a highly expensive weekend trip that you didn't budget for. What do you do?",
    options: [
      { label: 'Politely decline. My personal savings targets and financial boundaries come first, no exceptions.', deltas: { axis3: 2 } },
      { label: 'See if I can aggressively cut back on my personal expenses over the next few weeks to try to afford it safely.', deltas: { axis3: 1 } },
      { label: 'Go on the trip, but actively look for small, smart ways to save the group money while we are there.', deltas: { axis3: -1 } },
      { label: 'Absolutely send it. You cannot put a price tag on a core memory with the crew; I will deal with the bill later.', deltas: { axis3: -2 } },
    ],
  },
  {
    id: 5,
    text: 'When you think about your financial goals, what excites you the most?',
    options: [
      { label: 'Retiring early or achieving complete wealth independence by age 50 or 60.', deltas: { axis1: 2 } },
      { label: 'Building a reliable financial foundation that guarantees my safety over the next decade.', deltas: { axis1: 1 } },
      { label: 'Steadily increasing my monthly cash flow so I can comfortably elevate my current lifestyle.', deltas: { axis1: -1 } },
      { label: 'Having enough financial agility to maximize every spontaneous opportunity that comes up today.', deltas: { axis1: -2 } },
    ],
  },
  {
    id: 6,
    text: 'How would you describe your emotional relationship with your financial investments?',
    options: [
      { label: 'Hyper-protective. I get stressed out by unpredictable fluctuations; I prefer steady, guaranteed paths.', deltas: { axis4: -2 } },
      { label: 'Cautious. I am willing to take small, carefully calculated risks as long as the core foundation is safe.', deltas: { axis4: -1 } },
      { label: 'Open-minded. I like exploring dynamic market spaces and am comfortable with moderate volatility for higher gains.', deltas: { axis4: 1 } },
      { label: 'Exceptionally detached. I view money as strategic capital; I enjoy taking massive swings for massive upside.', deltas: { axis4: 2 } },
    ],
  },
  {
    id: 7,
    text: 'When a subscription service rolls around each month, how do you manage it?',
    options: [
      { label: 'Meticulously review my bank statements and manually log every single recurring transaction.', deltas: { axis2: 2 } },
      { label: "Check my accounts occasionally to make sure I'm not paying for anything I explicitly don't use.", deltas: { axis2: 1 } },
      { label: "Keep a mental checklist of what I'm subscribed to, trusting that my auto-pay handles it smoothly.", deltas: { axis2: -1 } },
      { label: 'Leave everything on 100% automated autopilot and ignore it unless my card gets declined.', deltas: { axis2: -2 } },
    ],
  },
  {
    id: 8,
    text: 'When it comes to splitting the bill at a group dinner or hangout, what is your standard approach?',
    options: [
      { label: 'Ask the server for itemized checks or calculate the exact pre-tax total for what I personally ordered.', deltas: { axis3: 2 } },
      { label: 'Throw my card in the middle to split evenly, as long as everyone ordered roughly the same amount.', deltas: { axis3: 1 } },
      { label: 'Happily pay a bit extra or cover the tip for the table to keep the gathering smooth and positive.', deltas: { axis3: -1 } },
      { label: "Drop my card and offer to cover a friend's meal or buy a round of drinks just because I love treating the group.", deltas: { axis3: -2 } },
    ],
  },
  {
    id: 9,
    text: 'You are looking into buying a vehicle or a major piece of tech. What is your primary focus?',
    options: [
      { label: 'How much value it will retain over the next 5 to 10 years and its overall lifetime utility.', deltas: { axis1: 2 } },
      { label: 'Making sure the monthly financing or purchase cost fits safely into my structured budget.', deltas: { axis1: 1 } },
      { label: 'The immediate convenience, features, and performance upgrade it brings to my daily routine.', deltas: { axis1: -1 } },
      { label: 'The aesthetic and the immediate vibe check—life is too short to drive or use boring things.', deltas: { axis1: -2 } },
    ],
  },
  {
    id: 10,
    text: 'A guy on TikTok or a trendy Reddit thread makes a highly compelling case for a brand-new, volatile asset class. Your reaction?',
    options: [
      { label: 'Total skepticism. I immediately ignore it and stick to my proven, boring index funds.', deltas: { axis4: -2 } },
      { label: 'Read up on it out of curiosity, but ultimately pass because it lacks a long-term historical track record.', deltas: { axis4: -1 } },
      { label: 'Throw a very small, negligible amount of "fun money" into it just to see what happens.', deltas: { axis4: 1 } },
      { label: 'Dive headfirst into the research rabbit hole and drop a meaningful piece of capital to ride the wave early.', deltas: { axis4: 2 } },
    ],
  },
  {
    id: 11,
    text: 'How do you feel about tracking your daily personal spending using spreadsheets or budgeting apps?',
    options: [
      { label: 'I love it. Breaking down my exact categories and spending habits gives me a huge sense of control.', deltas: { axis2: 2 } },
      { label: "I don't mind it. I try to log my major expenses to keep myself generally aligned.", deltas: { axis2: 1 } },
      { label: "It feels tedious. I prefer to just keep an eye on my overall bank balance to gauge if I'm doing fine.", deltas: { axis2: -1 } },
      { label: 'I hate it. Hyper-analyzing spreadsheets causes unneeded stress; I prefer to let my financial habits flow naturally.', deltas: { axis2: -2 } },
    ],
  },
  {
    id: 12,
    text: 'What does achieving true financial security look like to you?',
    options: [
      { label: 'Knowing that I am 100% self-reliant, debt-free, and completely insulated from any external economic shocks.', deltas: { axis3: 2 } },
      { label: 'Having a rock-solid, private emergency cushion that keeps me safe without needing to rely on anyone else.', deltas: { axis3: 1 } },
      { label: 'Being financially stable enough to fully support, celebrate, and show up for my loved ones whenever they need it.', deltas: { axis3: -1 } },
      { label: 'Having the wealth to host massive gatherings, spoil my inner circle, and use my resources as a social tool.', deltas: { axis3: -2 } },
    ],
  },
  {
    id: 13,
    text: 'How often do you find yourself thinking about your life post-retirement?',
    options: [
      { label: 'Constantly. I frequently think about building generational wealth and long-term asset positioning.', deltas: { axis1: 2 } },
      { label: 'Occasionally. I want to make sure I have a solid safety net waiting for me down the line.', deltas: { axis1: 1 } },
      { label: 'Rarely. I am much more focused on navigating my current life stage and career velocity.', deltas: { axis1: -1 } },
      { label: 'Almost never. The future is highly unpredictable; I care infinitely more about optimizing the now.', deltas: { axis1: -2 } },
    ],
  },
  {
    id: 14,
    text: 'Which investment portfolio structure sounds the most comfortable to you?',
    options: [
      { label: 'A 100% stable, historically backed government bond or hyper-safe High-Yield Savings Account.', deltas: { axis4: -2 } },
      { label: 'A standard, highly diversified index fund tracking the top 500 established companies in the world.', deltas: { axis4: -1 } },
      { label: 'A growth-heavy blend featuring traditional indexing paired with cutting-edge tech and innovation sectors.', deltas: { axis4: 1 } },
      { label: 'A highly concentrated, dynamic portfolio positioned entirely in emerging industries and high-upside assets.', deltas: { axis4: 2 } },
    ],
  },
  {
    id: 15,
    text: 'You are hit with a sudden, confusing charge on your cell phone or utility bill. What is your play?',
    options: [
      { label: 'Call customer support immediately, pull up the itemized statement, and fight to get every single cent back.', deltas: { axis2: 2 } },
      { label: 'Log into the portal, review the charge, and look up if this is a standard recurring processing fee.', deltas: { axis2: 1 } },
      { label: "Shrug it off if it's a small amount, assuming it'll just balance itself out on the next cycle anyway.", deltas: { axis2: -1 } },
      { label: 'Ignore it entirely. My peace of mind and time are worth way more than spending an hour fighting a robot over $15.', deltas: { axis2: -2 } },
    ],
  },
  {
    id: 16,
    text: "You want to buy a high-end gift for a close friend's birthday or graduation. How do you approach the cost?",
    options: [
      { label: 'Find a thoughtful, budget-friendly alternative or split the cost of a gift evenly with 3 other people.', deltas: { axis3: 2 } },
      { label: 'Plan ahead and intentionally set aside a strict budget cap for the gift a month in advance.', deltas: { axis3: 1 } },
      { label: 'Buy the gift they genuinely want, even if it forces me to push back a personal savings goal for the month.', deltas: { axis3: -1 } },
      { label: 'Price is irrelevant. Seeing their reaction and showing how much I value them is worth whatever it costs.', deltas: { axis3: -2 } },
    ],
  },
  {
    id: 17,
    text: "If a financial advisor tells you to lock your money into an account you can't touch for 5 years, how do you react?",
    options: [
      { label: 'Sign me up immediately. If it guarantees long-term compound growth, it is entirely worth it.', deltas: { axis1: 2 } },
      { label: 'Open to it, but only if I have a completely separate pool of liquid cash easily accessible.', deltas: { axis1: 1 } },
      { label: 'Hesitant. I prefer keeping my capital moving so I can leverage it for short-term opportunities.', deltas: { axis1: -1 } },
      { label: 'Hard pass. Locking away my money means sacrificing my current lifestyle flexibility and freedom.', deltas: { axis1: -2 } },
    ],
  },
  {
    id: 18,
    text: 'If you could guarantee one outcome for your investment capital, what would you choose?',
    options: [
      { label: 'Zero chance of nominal loss. Absolute peace of mind knowing my principal balance can never go down.', deltas: { axis4: -2 } },
      { label: 'Consistent, steady market pacing that mirrors historical averages with minimal surprises.', deltas: { axis4: -1 } },
      { label: 'Beating inflation by a healthy margin, even if it means weathering a few rough market cycles.', deltas: { axis4: 1 } },
      { label: 'Maximizing asymmetrical growth potential. I am completely willing to risk capital to secure life-changing returns.', deltas: { axis4: 2 } },
    ],
  },
  {
    id: 19,
    text: 'What is your general life philosophy when it comes to managing your wealth?',
    options: [
      { label: 'Maximum optimization. Every single dollar should be actively working, tracked, and thoroughly calculated.', deltas: { axis2: 2 } },
      { label: 'Informed structure. I like having a clear roadmap but leave room for occasional deviations.', deltas: { axis2: 1 } },
      { label: 'Fluid rhythm. I trust my intuition to keep me financially stable without needing a rigid rulebook.', deltas: { axis2: -1 } },
      { label: 'Effortless automation. Set up the direct deposits, automate the baselines, and completely forget about it.', deltas: { axis2: -2 } },
    ],
  },
  {
    id: 20,
    text: 'If you had to pick between a solo financial milestone or a collective experience, which sounds better?',
    options: [
      { label: 'Watching my personal investment portfolio hit a massive, round milestone through my own discipline.', deltas: { axis3: 2 } },
      { label: 'Getting a major raise or personal promotion that secures my independent career roadmap.', deltas: { axis3: 1 } },
      { label: 'Successfully organizing or hosting a beautifully executed holiday event or dinner for my family.', deltas: { axis3: -1 } },
      { label: 'Funding an unforgettable, legendary vacation or concert experience shared with my entire squad.', deltas: { axis3: -2 } },
    ],
  },
];
