import React, { useMemo, useState } from 'react';
import './cost-calculator.css';

const PROGRAMS = {
  'Cybersecurity (CSE)': {
    short: 'MS Cybersecurity Engineering',
    tuition: 73620,
    mandatoryFees: 0,
    living: 28500,
    duration: '3 semesters',
    supportRate: 0,
  },
  'MS in Applied AI (AAI)': {
    short: 'MS in Applied Artificial Intelligence',
    tuition: 60000,
    mandatoryFees: 1620,
    living: 28500,
    duration: '20 months',
    supportRate: 0.2,
  },
};

const INR_PER_USD = 94;
const MONTHLY_EARNINGS = 1527;
const SEMESTER_EARNINGS = 1865383;
const SUMMER_EARNINGS = 1212600;
const TOTAL_EARNINGS_INR = SEMESTER_EARNINGS + SUMMER_EARNINGS;
const STUDY_ACCRUAL_FACTOR = 8799215 / 6495024;
const ENROLLMENT_URL = 'https://india.sandiego.edu/usd-enrollment-commitment-form/';
const BROCHURE_URL = 'https://drive.google.com/file/d/1D1nvlOijiGqCmVAjzRUOIb60_sWvGwLi/view?usp=drive_link';

const usd = (value) => `$${Math.round(value).toLocaleString('en-US')}`;
const inr = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;

function monthlyPayment(principalUsd) {
  const monthlyRate = 0.065 / 12;
  const months = 120;
  return principalUsd * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
}

function ComparisonCard({ highlighted = false, title, loanInr, owedInr, payment, ratio, funding }) {
  const hasLoan = funding === 'Education loan';
  return <article className={`cost-plan ${highlighted ? 'cost-plan--highlighted' : ''}`}>
    {highlighted && <span className="cost-plan__badge">MOST STUDENTS CHOOSE THIS</span>}
    <h3>{title}</h3>
    <dl>
      <div><dt>{hasLoan ? 'Education loan' : 'Amount to self-fund'}</dt><dd>{inr(loanInr)}</dd></div>
      <div><dt>{hasLoan ? <>Owed at graduation <span>(10.25% accrues during study)</span></> : 'Loan balance at graduation'}</dt><dd>{hasLoan ? inr(owedInr) : '₹0'}</dd></div>
      <div className="cost-plan__payment"><dt>{hasLoan ? <>Monthly EMI after refinancing <span>(6.5%, 10 yrs)</span></> : 'Monthly EMI'}</dt><dd>{hasLoan ? `${usd(payment)} / month` : '$0 / month'}</dd></div>
    </dl>
    <p>{hasLoan ? <>About <b>{ratio.toFixed(1)}%</b> of an average US salary of $8,000–$12,000/month · 90% placement.</> : 'No education-loan repayment is included for the selected funding method.'}</p>
  </article>;
}

export default function CostCalculatorPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const [program, setProgram] = useState(PROGRAMS[params.get('program')] ? params.get('program') : 'MS in Applied AI (AAI)');
  const [funding, setFunding] = useState(params.get('funding') || 'Education loan');
  const [scholarship, setScholarship] = useState(params.has('scholarship') ? Math.max(0, Number(params.get('scholarship')) || 0) : 15000);
  const student = params.get('student') || 'Future Torero';
  const config = PROGRAMS[program];

  const result = useMemo(() => {
    const tuitionAndFeesUsd = config.tuition + config.mandatoryFees;
    const supportedFeesAndLivingUsd = (config.mandatoryFees + config.living) * config.supportRate;
    const effectiveScholarshipUsd = Math.min(config.tuition, scholarship) + supportedFeesAndLivingUsd;
    const grossUsd = tuitionAndFeesUsd + config.living;
    const netUsd = Math.max(0, grossUsd - effectiveScholarshipUsd);
    const netInr = netUsd * INR_PER_USD;
    const workLoanInr = Math.max(0, netInr - TOTAL_EARNINGS_INR);
    const withoutWorkLoanInr = netInr;
    const withOwed = workLoanInr * STUDY_ACCRUAL_FACTOR;
    const withoutOwed = withoutWorkLoanInr * STUDY_ACCRUAL_FACTOR;
    const withEmi = monthlyPayment(withOwed / INR_PER_USD);
    const withoutEmi = monthlyPayment(withoutOwed / INR_PER_USD);
    return { grossUsd, tuitionAndFeesUsd, effectiveScholarshipUsd, netUsd, netInr, workLoanInr, withoutWorkLoanInr, withOwed, withoutOwed, withEmi, withoutEmi };
  }, [config, scholarship]);

  return <main className="cost-page">
    <header className="shared-nav shared-nav--calculator"><a href="/" aria-label="University of San Diego home"><img src="/usd-logo-frame.png" alt="University of San Diego" /></a><nav><a href="/#program">PROGRAMS</a><a href="/#why">HOW IT WORKS</a><a href="/#experience">THE EXPERIENCE</a><a href="/#ready">MARK YOUR INTEREST</a><a href="/#faq">FAQS</a></nav><button className="shared-nav__menu" type="button" aria-label="Open navigation">☰</button></header>

    <div className="cost-page__stage">
      <section className="cost-sheet" aria-labelledby="cost-title">
        <div className="cost-sheet__intro">
          <h1 id="cost-title">See the full investment not<br /><span>just the tuition.</span></h1>
          <p>Adjust your selections below. Every figure updates instantly using the USD Spring 2027 cost and financing assumptions.</p>
        </div>

        <form className="cost-controls" onSubmit={(event) => event.preventDefault()}>
          <label>Program<select aria-label="Program" value={program} onChange={(event) => setProgram(event.target.value)}><option value="" disabled>Enter Program</option>{Object.keys(PROGRAMS).map((name) => <option key={name}>{name}</option>)}</select></label>
          <label>Funding<select aria-label="Funding" value={funding} onChange={(event) => setFunding(event.target.value)}><option value="" disabled>Enter Funding</option><option>Education loan</option><option>Self-funded</option><option>Family support</option></select></label>
          <label>Scholarship amount (USD)<input aria-label="Scholarship amount" type="number" min="0" step="1" inputMode="decimal" placeholder="Enter scholarship amount" value={scholarship || ''} onChange={(event) => setScholarship(Math.max(0, Number(event.target.value) || 0))} /></label>
        </form>

        <section className="cost-summary" aria-labelledby="summary-title">
          <div><span id="summary-title">ESTIMATED PROGRAM COST</span><strong>{usd(result.netUsd)}</strong><small>{inr(result.netInr)} at ₹{INR_PER_USD}/USD</small></div>
          <dl>
            <div><dt>Tuition + mandatory fees</dt><dd>{usd(result.tuitionAndFeesUsd)}</dd></div>
            <div><dt>Living, housing, meals &amp; insurance</dt><dd>{usd(config.living)}</dd></div>
            <div className="cost-summary__deduction"><dt>Scholarship &amp; support deducted</dt><dd>-{usd(result.effectiveScholarshipUsd)}</dd></div>
            <div><dt>Program duration</dt><dd>{config.duration}</dd></div>
          </dl>
        </section>

        <section className="cost-earnings" aria-labelledby="earn-title">
          <span className="cost-eyebrow" id="earn-title">EARN WHILE YOU LEARN</span>
          <p>F-1 students can work on campus up to 20 hours a week at $17.75/hour — about <b>{usd(MONTHLY_EARNINGS)} a month.</b></p>
          <dl>
            <div><dt>During semesters <span>20 hrs/wk × $17.75 × 13 months</span></dt><dd>{inr(SEMESTER_EARNINGS)}</dd></div>
            <div><dt>Summer internship <span>40 hrs/wk × $25 × 4 months</span></dt><dd>{inr(SUMMER_EARNINGS)}</dd></div>
            <div className="cost-earnings__total"><dt>Total earning potential</dt><dd>{inr(TOTAL_EARNINGS_INR)} ({usd(TOTAL_EARNINGS_INR / INR_PER_USD)})</dd></div>
          </dl>
        </section>

        <div className="cost-plans">
          <ComparisonCard highlighted title="With on-campus work" loanInr={result.workLoanInr} owedInr={result.withOwed} payment={result.withEmi} ratio={result.withEmi / 100} funding={funding} />
          <ComparisonCard title="Without campus work" loanInr={result.withoutWorkLoanInr} owedInr={result.withoutOwed} payment={result.withoutEmi} ratio={result.withoutEmi / 100} funding={funding} />
        </div>

        <div className="cost-actions">
          <a href={ENROLLMENT_URL} target="_blank" rel="noreferrer" className="cost-actions__primary">Confirm my seat <span>→</span></a>
          <a href={BROCHURE_URL} target="_blank" rel="noreferrer">Download brochure <span>↓</span></a>
          <a href="tel:+917428144436">Talk to Our Team: +91 7428144436</a>
        </div>
        <p className="cost-disclaimer">Estimates are indicative only, to help you understand funding, ROI and financing possibilities. Actual tuition, living expenses, scholarship amounts, loan terms, exchange rates and repayment amounts may vary. The loan estimate assumes 10.25% annual interest during the study period, refinanced at 6.5% over 10 years, at ₹94 per USD. Refinancing starts after 6 months of successful employment in the US.</p>
      </section>
    </div>
  </main>;
}
