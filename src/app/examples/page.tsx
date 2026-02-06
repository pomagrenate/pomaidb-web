import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./examples.module.css";

const examples = [
  {
    id: "python",
    label: "Python",
    description: "Embed PomaiDB in notebooks or edge services.",
    run: "python examples/python/quickstart.py",
    code: `from pomaidb import Client\n\nclient = Client("./pomai-data")\nclient.create_collection("clips", dims=768)\n\nclient.upsert("clips", ids=["clip-001"], vectors=[[0.12, 0.08, 0.33, 0.19]])\nresults = client.search("clips", query=[0.12, 0.09, 0.29, 0.15], k=5)\nprint(results)`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    description: "Call the embedded engine from Node.js bindings.",
    run: "node examples/js/quickstart.js",
    code: `import { Client } from "pomaidb";\n\nconst client = new Client("./pomai-data");\nclient.createCollection("clips", 768);\n\nawait client.upsert("clips", [{ id: "clip-001", vector: [0.12, 0.08, 0.33, 0.19] }]);\nconst results = await client.search("clips", [0.12, 0.09, 0.29, 0.15], 5);\nconsole.log(results);`,
  },
  {
    id: "typescript",
    label: "TypeScript",
    description: "Typed workflows for desktop and offline apps.",
    run: "pnpm ts-node examples/ts/quickstart.ts",
    code: `import { Client } from "pomaidb";\n\nconst client = new Client("./pomai-data");\nclient.createCollection("clips", 768);\n\nawait client.upsert("clips", [\n  { id: "clip-001", vector: [0.12, 0.08, 0.33, 0.19], metadata: { scene: "studio" } },\n]);\n\nconst results = await client.search("clips", [0.12, 0.09, 0.29, 0.15], 10);\nconsole.log(results);`,
  },
  {
    id: "go",
    label: "Go",
    description: "Embed PomaiDB inside services with minimal memory overhead.",
    run: "go run examples/go/quickstart.go",
    code: `package main\n\nimport "pomaidb/client"\n\nfunc main() {\n  c := client.New("./pomai-data")\n  c.CreateCollection("clips", 768)\n  c.Upsert("clips", []client.Vector{{ID: "clip-001", Values: []float32{0.12, 0.08, 0.33, 0.19}}})\n  _ = c.Search("clips", []float32{0.12, 0.09, 0.29, 0.15}, 5)\n}`,
  },
  {
    id: "cpp",
    label: "C++",
    description: "High-performance embedded C++20 API.",
    run: "./bin/pomai_examples --quick",
    code: `#include "pomai/client.hpp"\n\nint main() {\n  pomai::Client client{"./pomai-data"};\n  client.create_collection("clips", 768);\n  client.upsert("clips", {"clip-001"}, {{0.12f, 0.08f, 0.33f, 0.19f}});\n  client.search("clips", {0.12f, 0.09f, 0.29f, 0.15f}, 5);\n}`,
  },
];

export default function ExamplesPage() {
  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Examples" tone="green" />
        <h1>Multi-language examples for embedded vector search.</h1>
        <p>
          PomaiDB keeps API behavior consistent across SDKs. Each snippet below
          includes a run command to boot locally or in CI.
        </p>
      </section>

      <SectionHeading
        eyebrow="Examples"
        title="Choose your language"
        description="Each example shows creating a collection, upserting, and searching with crash safety on by default."
      />

      <div className={styles.grid}>
        {examples.map((example) => (
          <Card key={example.id}>
            <section id={example.id} className={styles.exampleSection}>
              <h3>{example.label}</h3>
              <p>{example.description}</p>
              <CodeBlock language={example.label} code={example.code} />
              <div className={styles.run}>
                <span>Run</span>
                <code>{example.run}</code>
              </div>
            </section>
          </Card>
        ))}
      </div>
    </Container>
  );
}
