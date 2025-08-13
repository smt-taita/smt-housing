import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const faqData = [
  {
    question: "What exactly is the St Matt's Kāinga project?",
    answer: "St Matt's Kāinga is an affordable housing community featuring 8 homes (1x 4-bedroom, 3x 2-bedroom, and 4x 1-bedroom units) in Taitā, Lower Hutt. It houses families, former refugees, and people transitioning from temporary housing, with two church leaders living onsite as community catalysts. It's part of the Anglican Diocese's Bedrock Housing initiative."
  },
  {
    question: "Who currently lives in these homes?",
    answer: "Our residents include families with children, a former refugee who has built a new life in New Zealand, and individuals who have successfully transitioned from temporary housing situations. Each resident contributes to our supportive community environment while maintaining their privacy and dignity."
  },
  {
    question: "Why are ongoing donations needed if the homes are already built?",
    answer: "While the homes are built and occupied, early subsidies that keep rent affordable for our lowest-income tenants end in early 2026. Without ongoing support, these residents—particularly those in one-bedroom units—may face rent increases that could force them to leave their homes and community. Your donations bridge this gap to maintain affordability."
  },
  {
    question: "How much should I consider giving?",
    answer: "We need 20 people giving $100/month to reach our $24,000 annual goal, but every amount helps. Consider what you spend on coffee in a month—even $20/month makes a real difference. Remember, donations are tax-deductible with a 33.33% IRD tax credit, so your actual cost is lower than your donation amount."
  },
  {
    question: "Are donations tax-deductible?",
    answer: "Yes! All donations to St Matt's Kāinga are tax-deductible in New Zealand. You'll receive a 33.33% IRD tax credit on your donation amount. For example, if you donate $100 monthly, you'll receive a $33.33 monthly tax credit, making your actual cost only $66.67."
  },
  {
    question: "Will I receive updates on how my donation is used?",
    answer: "Absolutely! We provide quarterly updates to all donors including resident success stories (with privacy maintained), financial transparency reports, community project updates, and insights into our future planning. You'll see exactly how your generosity is making a difference in real people's lives."
  }
];

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="bg-church-blue bg-opacity-20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <i className="fas fa-question-circle text-church-blue text-2xl"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-church-blue to-church-green mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <Card key={index} className="overflow-hidden">
              <Button
                variant="ghost"
                className="w-full p-6 h-auto justify-between hover:bg-slate-50"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-semibold text-slate-900 text-left">{faq.question}</h3>
                <i 
                  className={`fas fa-chevron-down text-slate-500 transform transition-transform ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </Button>
              {openFaq === index && (
                <CardContent className="px-6 pb-6 pt-0">
                  <p className="text-slate-700">{faq.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
