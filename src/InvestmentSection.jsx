import React, { useState } from 'react';
import './investment.css';

const assets = '/landing/investment-';

export default function InvestmentSection({ selectedProgram, studentName = '' }) {
  const [values, setValues] = useState({ program: selectedProgram || 'MS in Applied AI (AAI)', funding: '', scholarship: '' });

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function calculate(event) {
    event.preventDefault();
    const params = new URLSearchParams({
      program: values.program,
      funding: values.funding,
      scholarship: values.scholarship || '0',
      student: studentName,
    });
    window.open(`/cost-calculator?${params.toString()}`, '_blank', 'noopener,noreferrer');
  }

  return <section className="investment-section" id="investment" aria-labelledby="investment-title">
    <div className="investment-section__inner">
      <div className="investment-section__grid">
        <div className="investment-section__intro">
          <h2 id="investment-title">Understand your <span>investment</span></h2>
          <p>Just fill in a few details, and we’ll help you estimate your total cost, potential education loan, and monthly repayments after graduation</p>

          <aside className="investment-support" aria-label="Financing support">
            <h3>Need help financing your degree?</h3>
            <p>Get expert guidance on education loans and refinancing, and compare offers from multiple lenders on FundRight</p>
            <div className="investment-support__actions">
              <a className="investment-support__team" href="mailto:indiaadmission@sandiego.edu">Talk to Our Team</a>
              <a className="investment-support__fundright" href="https://gradright.com/financing/" target="_blank" rel="noreferrer">Explore FundRight</a>
            </div>
            <div className="investment-support__contact">
              <a className="investment-support__detail" href="tel:+917428144436"><img src={`${assets}phone.svg`} alt="" />+91 7428144436</a>
              <a className="investment-support__detail" href="mailto:indiaadmission@sandiego.edu"><img src={`${assets}mail.svg`} alt="" />indiaadmission@sandiego.edu</a>
            </div>
          </aside>
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
              <input aria-label="Scholarship amount (USD)" type="number" min="0" step="1" inputMode="decimal" placeholder="Scholarship amount (USD)" value={values.scholarship} onChange={(event) => update('scholarship', event.target.value)} />
            </div>
          </div>
          <button className="investment-calculator__submit" type="submit">Calculate My Cost <img src={`${assets}arrow.svg`} alt="" /></button>
          <p className="investment-calculator__disclaimer">Estimates are indicative only Actual tuition, living expenses, scholarship amounts, loan terms, exchange rates and repayment amounts may vary</p>
        </form>
      </div>

    </div>
  </section>;
}
