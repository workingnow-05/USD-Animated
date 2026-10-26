import React, { useState } from 'react';
import './investment.css';

const assets = '/landing/investment-';

export default function InvestmentSection({ selectedProgram }) {
  const [values, setValues] = useState({ program: selectedProgram || 'MS in Applied AI (AAI)', funding: '', scholarship: '' });
  const [result, setResult] = useState(null);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
    setResult(null);
  }

  function calculate(event) {
    event.preventDefault();
    const tuition = values.program === 'Cybersecurity (CSE)' ? 52800 : 51600;
    const scholarship = Number(values.scholarship || 0);
    const living = 19000;
    const total = tuition - scholarship + living;
    setResult({ tuition, scholarship, living, total });
  }

  return <section className="investment-section" id="investment" aria-labelledby="investment-title">
    <div className="investment-section__inner">
      <div className="investment-section__grid">
        <div className="investment-section__intro">
          <h2 id="investment-title">Understand your <span>investment.</span></h2>
          <p>Just fill in a few details, and we’ll help you estimate your total cost, potential education loan, and monthly repayments after graduation.</p>
        </div>

        <form className="investment-calculator" onSubmit={calculate} aria-labelledby="investment-calculator-title">
          <h3 id="investment-calculator-title">Calculate Your Exact Cost</h3>
          <div className="investment-calculator__fields">
            <div className="investment-calculator__select">
              <select aria-label="Program" required value={values.program} onChange={(event) => update('program', event.target.value)} data-empty={!values.program}>
                <option value="" disabled>Enter the Program</option>
                <option>MS in Applied AI (AAI)</option>
                <option>Cybersecurity (CSE)</option>
              </select>
              <img src={`${assets}chevron.svg`} alt="" />
            </div>
            <div className="investment-calculator__select">
              <select aria-label="Funding" required value={values.funding} onChange={(event) => update('funding', event.target.value)} data-empty={!values.funding}>
                <option value="" disabled>Enter the funding</option>
                <option>Education loan</option>
                <option>Self-funded</option>
                <option>Family support</option>
              </select>
              <img src={`${assets}chevron.svg`} alt="" />
            </div>
            <div className="investment-calculator__select">
              <select aria-label="Scholarship (if any)" value={values.scholarship} onChange={(event) => update('scholarship', event.target.value)} data-empty={!values.scholarship}>
                <option value="">Scholarship (if any)</option>
                <option value="10000">$10,000 Torero Merit Scholarship</option>
                <option value="5000">$5,000 Scholarship</option>
                <option value="0">No scholarship</option>
              </select>
              <img src={`${assets}chevron.svg`} alt="" />
            </div>
          </div>
          <button className="investment-calculator__submit" type="submit">Calculate My Cost <img src={`${assets}arrow.svg`} alt="" /></button>
          <p className="investment-calculator__disclaimer">Estimates are indicative only. Actual tuition, living expenses, scholarship amounts, loan terms, exchange rates and repayment amounts may vary.</p>
          {result && <div className="fl-cost-results investment-calculator__results" role="status" aria-label="Estimated program costs">
            <div><span>Base Degree Tuition</span><b>${result.tuition.toLocaleString('en-US')} USD</b></div>
            <div className="deduction"><span>Scholarship Deducted</span><b>-${result.scholarship.toLocaleString('en-US')} USD</b></div>
            <div><span>Estimated 1-Year San Diego Living &amp; Housing</span><b>${result.living.toLocaleString('en-US')} USD</b></div>
            <div className="total"><strong>Estimated Net Total Program Investment</strong><b>${result.total.toLocaleString('en-US')} USD</b></div>
          </div>}
        </form>
      </div>

      <aside className="investment-support" aria-label="Financing support">
        <div className="investment-support__inner">
          <div className="investment-support__intro">
            <span className="investment-support__icon"><img src={`${assets}financing.svg`} alt="" /></span>
            <div>
              <h3>Need help financing your degree?</h3>
              <p>From education loans and refinancing to understanding your funding options, our team can help you work out the next steps. You can also explore FundRight to compare education loan offers from multiple lenders, review eligibility, and compare terms before making a decision.</p>
            </div>
          </div>
          <div className="investment-support__contact">
            <a className="investment-support__team" href="mailto:indiaadmission@sandiego.edu">Talk to Our Team <span aria-hidden="true">→</span></a>
            <a className="investment-support__detail" href="tel:+917428144436"><img src={`${assets}phone.svg`} alt="" />+91 7428144436</a>
            <a className="investment-support__detail" href="mailto:indiaadmission@sandiego.edu"><img src={`${assets}mail.svg`} alt="" />indiaadmission@sandiego.edu</a>
          </div>
          <div className="investment-support__partner">
            <h3><span aria-hidden="true">🍃</span>FundRight</h3>
            <p>Compare education loan offers from multiple lenders — all in one place.</p>
            <a href="https://gradright.com/financing/" target="_blank" rel="noreferrer">Explore FundRight <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </aside>
    </div>
  </section>;
}
