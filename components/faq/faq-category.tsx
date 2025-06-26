import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategoryProps {
  title: string;
  description?: string;
  items: FAQItem[];
}

export function FAQCategory({ title, description, items }: FAQCategoryProps) {
  return (
    <div className="mb-10">
      <h2 className="mb-2 text-2xl font-bold text-foreground">{title}</h2>

      {description && (
        <p className="mb-4 font-vazirmatn text-muted-foreground">
          {description}
        </p>
      )}

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-right text-lg font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
