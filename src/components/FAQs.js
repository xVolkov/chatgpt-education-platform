import React from 'react';

const faqs = [
  { question: 'How do I reset my password?', answer: 'To reset your password, go to the settings page and click on "Reset Password".' },
  { question: 'Where can I find the latest updates?', answer: 'Latest updates can be found on the updates section of our homepage.' },
  { question: 'Can I modify my courses?', answer: 'Yes, you can do so by clicking on "Modify a Course" button on the homepage.' },
  // ... Add more FAQs here
];

const FAQs = () => {
  return (
    <div className="faqs">
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, index) => (
        <div key={index} className="faq">
          <h2>{faq.question}</h2>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQs;
