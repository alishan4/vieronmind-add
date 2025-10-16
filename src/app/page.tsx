import { serverClient } from "~/trpc/server";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();
  const hello = await (await serverClient()).emotion.analyze({
    userId: "demo-user",
    answers: ["I'm feeling anxious lately."],
    mode: "mcq",
  });

  return (
    <main className="flex flex-col items-center justify-center h-screen text-white bg-gray-900">
      <h1 className="text-3xl font-bold mb-4">Vieromind AI Therapy</h1>
      <p>Welcome {session?.user?.name ?? "Guest"} 👋</p>
      <div className="mt-4 p-4 rounded bg-gray-800">
        <p>
          Detected condition: <b>{hello.condition}</b> (
          <i>{hello.severity}</i>)
        </p>
      </div>
    </main>
  );
}
