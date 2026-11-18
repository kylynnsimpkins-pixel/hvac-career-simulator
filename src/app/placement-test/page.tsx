import questions from "@/game/data/placementQuestions.json";

export default function PlacementTestPage() {
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Placement Test</h1>
      <ol className="list-decimal space-y-2 pl-6">
        {questions.map((q) => (
          <li key={q.id}>{q.prompt}</li>
        ))}
      </ol>
    </section>
  );
}
