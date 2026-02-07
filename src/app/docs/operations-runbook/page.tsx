"use client";

import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import styles from "./runbook.module.css";

// --- COMMAND CONSTANTS ---

const CMD_DEBUG = `cmake -S . -B build_debug \\
    -DCMAKE_BUILD_TYPE=Debug \\
    -DPOMAI_BUILD_TESTS=ON \\
    -DPOMAI_ENABLE_CRASH_TESTS=ON \\
    -DCMAKE_CXX_FLAGS="-fsanitize=address,undefined -fno-omit-frame-pointer"
cmake --build build_debug -j`;

const CMD_RELEASE = `cmake -S . -B build_release \\
    -DCMAKE_BUILD_TYPE=Release \\
    -DPOMAI_BUILD_TESTS=OFF
cmake --build build_release -j`;

const CMD_TEST_UNIT = `cd build_debug
ctest --output-on-failure -L "unit|integ"`;

const CMD_TEST_CRASH = `cd build_debug
ctest --output-on-failure -R pomai_crash_replay`;

const CMD_TEST_TSAN = `cmake -S . -B build_tsan \\
    -DCMAKE_BUILD_TYPE=RelWithDebInfo \\
    -DPOMAI_BUILD_TESTS=ON \\
    -DCMAKE_CXX_FLAGS="-fsanitize=thread"
cmake --build build_tsan -j
ctest --test-dir build_tsan --output-on-failure -L tsan`;

const CMD_INSPECT_CHECKSUM = `./build_debug/pomai_inspect checksum /path/to/db/membranes/default/wal_0_0.log`;

const CMD_INSPECT_MANIFEST = `./build_debug/pomai_inspect dump-manifest /path/to/db/MANIFEST`;

export default function RunbookPage() {
    return (
        <Container>
            {/* --- HERO --- */}
            <section className={styles.hero}>
                <Badge label="Ops" tone="purple" />
                <h1>Operations Runbook</h1>
                <p>
                    Standard procedures for building, testing, and debugging PomaiDB.
                    This guide ensures consistent environments from local development to production.
                </p>

                <div className={styles.prereqBox}>
                    <div className={styles.prereqTag}>CMake 3.20+</div>
                    <div className={styles.prereqTag}>C++20 (GCC 11+, Clang 12+)</div>
                    <div className={styles.prereqTag}>Linux / macOS</div>
                </div>
            </section>

            {/* --- BUILD INSTRUCTIONS --- */}
            <SectionHeading
                eyebrow="Compilation"
                title="Build Instructions"
                description="Select the appropriate build target for your workflow."
            />

            <div className={styles.grid}>
                <Card className={styles.buildCard}>
                    <div className={styles.buildHeader}>
                        <div className={styles.buildTitle}>Debug Build</div>
                        <Badge label="Dev" tone="neutral" />
                    </div>
                    <ul className={styles.flagList}>
                        <li className={styles.flagItem}>Tests Enabled</li>
                        <li className={styles.flagItem}>ASAN + UBSAN Active</li>
                        <li className={styles.flagItem}>Debug Symbols</li>
                    </ul>
                    <CodeBlock language="bash" code={CMD_DEBUG} />
                </Card>

                <Card className={styles.buildCard}>
                    <div className={styles.buildHeader}>
                        <div className={styles.buildTitle}>Release Build</div>
                        <Badge label="Prod" tone="green" />
                    </div>
                    <ul className={styles.flagList}>
                        <li className={styles.flagItem}>Optimized (-O3)</li>
                        <li className={styles.flagItem}>No Sanitizers</li>
                        <li className={styles.flagItem}>Tests Disabled</li>
                    </ul>
                    <CodeBlock language="bash" code={CMD_RELEASE} />
                </Card>
            </div>

            <div className={styles.section} />

            {/* --- TESTING --- */}
            <SectionHeading
                eyebrow="Quality Assurance"
                title="Testing Suite"
                description="PomaiDB uses CTest. Always run the full suite before submitting PRs."
            />

            <div className={styles.grid}>
                <div>
                    <h3 className={styles.cliHeader}>Unit & Integration</h3>
                    <p className={styles.cliDesc}>Fast feedback loop for logic correctness.</p>
                    <CodeBlock language="bash" code={CMD_TEST_UNIT} />
                </div>
                <div>
                    <h3 className={styles.cliHeader}>Thread Sanitizer (TSAN)</h3>
                    <p className={styles.cliDesc}>Detects data races. Requires separate build.</p>
                    <CodeBlock language="bash" code={CMD_TEST_TSAN} />
                </div>
            </div>

            <div style={{ marginTop: "2rem" }}>
                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 className={styles.buildTitle}>Crash Safety Suite</h3>
                        <Badge label="Critical" tone="red" />
                    </div>
                    <p className={styles.cliDesc}>
                        Verifies data consistency across 50 simulated process crashes (SIGKILL). This is a long-running test.
                    </p>
                    <CodeBlock language="bash" code={CMD_TEST_CRASH} />

                    <div className={styles.crashBox}>
                        <h4>Failure Analysis</h4>
                        <ul className={styles.flagList}>
                            <li className={styles.flagItem}>
                                <span className={styles.logOutput}>Data Loss detected!</span>
                                &nbsp;&mdash;&nbsp; WAL replay failed or fsync was ignored.
                            </li>
                            <li className={styles.flagItem}>
                                <span className={styles.logOutput}>Named membrane ... failed to open</span>
                                &nbsp;&mdash;&nbsp; Persistence recovery logic broken.
                            </li>
                        </ul>
                        <p style={{ color: '#fefce8', fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>
                            <b>Success Criteria:</b> All 50 rounds pass with "Verifying consistency..." logs showing no data loss.
                        </p>
                    </div>
                </Card>
            </div>

            <div className={styles.section} />

            {/* --- INSPECTION --- */}
            <SectionHeading
                eyebrow="Forensics"
                title="Inspection & Debugging"
                description="The `pomai_inspect` tool helps diagnose corrupt files or verify binary formats on disk."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cliHeader}>Checksum Verification</h3>
                    <p className={styles.cliDesc}>
                        Verify CRC32C integrity of any file (WAL, Segment, Manifest).
                    </p>
                    <CodeBlock language="bash" code={CMD_INSPECT_CHECKSUM} />
                </Card>

                <Card>
                    <h3 className={styles.cliHeader}>Dump Manifest</h3>
                    <p className={styles.cliDesc}>
                        View the human-readable structure of the binary manifest file.
                    </p>
                    <CodeBlock language="bash" code={CMD_INSPECT_MANIFEST} />
                </Card>
            </div>

            {/* --- FOOTER LINK --- */}
            <div style={{ marginTop: "3rem", borderTop: "1px solid var(--pomai-border)", paddingTop: "1rem" }}>
                <p style={{ color: "var(--pomai-muted)", fontSize: "0.85rem" }}>
                    Ready to ship? See the <Link href="/release-checklist" style={{ color: "var(--pomai-link)" }}>Release Checklist</Link>.
                </p>
            </div>

        </Container>
    );
}