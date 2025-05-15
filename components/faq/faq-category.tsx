import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQCategoryProps {
  title: string
  description?: string
  items: FAQItem[]
}

export function FAQCategory({ title, description, items }: FAQCategoryProps) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      {description && <p className="text-muted-foreground mb-4">{description}</p>}

      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-right font-medium text-lg">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
