"use client";

import Badge from "@/components/Badge";
import Card from "@/components/Card";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import styles from "./c-api.module.css";

export default function CApiPage() {
    return (
        <Container>
            {/* --- HERO --- */}
            <section className={styles.hero}>
                <Badge label="Reference" tone="blue" />
                <h1>Stable C ABI Contract</h1>
                <p>
                    This document defines the stable C ABI contract for embedding PomaiDB from any FFI-capable language.
                    It prioritizes portability, explicit ownership, and forward compatibility.
                </p>
            </section>

            {/* --- DESIGN PRINCIPLES --- */}
            <SectionHeading
                eyebrow="Philosophy"
                title="Design Principles"
                description="Core rules ensuring the API remains bindable and predictable across languages."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cardHeader}>C-Only ABI</h3>
                    <p className={styles.list}>
                        All exported functions use <code>extern "C"</code> and plain C types.
                        Public symbols are exported via <code>POMAI_API</code>.
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Opaque Handles</h3>
                    <p className={styles.list}>
                        Core types like <code>pomai_db_t</code>, <code>pomai_snapshot_t</code>, and <code>pomai_iter_t</code> are opaque pointers, hiding internal layout.
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Explicit Status</h3>
                    <p className={styles.list}>
                        Every API returns <code>pomai_status_t*</code>.
                        <code>NULL</code> indicates success. Non-null must be freed.
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Single Ownership</h3>
                    <p className={styles.list}>
                        Caller owns inputs. Pomai owns returned result objects.
                        No ambiguous shared ownership.
                    </p>
                </Card>
            </div>

            <div className={styles.section} />

            {/* --- VERSIONING & STRUCTS --- */}
            <SectionHeading
                eyebrow="Compatibility"
                title="Versioning & Structs"
                description="Mechanisms for safe evolution without breaking existing clients."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cardHeader}>ABI Versioning</h3>
                    <ul className={styles.list}>
                        <li>Macros: <code>MAJOR</code>, <code>MINOR</code>, <code>PATCH</code>.</li>
                        <li>Runtime: <code>pomai_abi_version()</code> returns packed integer.</li>
                        <li><b>MAJOR:</b> Breaking changes allowed.</li>
                        <li><b>MINOR:</b> Additive only.</li>
                        <li><b>PATCH:</b> No ABI changes.</li>
                    </ul>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Forward-Compatible Structs</h3>
                    <ul className={styles.list}>
                        <li>Field #1 is always <code>uint32_t struct_size</code>.</li>
                        <li>New fields are appended at the end only.</li>
                        <li>Runtime validation: <code>size &ge; minimum expected</code>.</li>
                    </ul>
                </Card>
            </div>

            <div className={styles.section} />

            {/* --- STATUS & LIFETIME --- */}
            <SectionHeading
                eyebrow="Memory"
                title="Status Model & Lifetime"
                description="How to handle errors and manage object lifecycles."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cardHeader}>Status Convention</h3>
                    <ul className={styles.list}>
                        <li><code>NULL</code> &rarr; Success.</li>
                        <li>Non-<code>NULL</code> &rarr; Failure (must call <code>pomai_status_free</code>).</li>
                        <li>Helpers: <code>pomai_status_code</code>, <code>pomai_status_message</code>.</li>
                    </ul>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Object Lifetime</h3>
                    <ul className={styles.list}>
                        <li><b>Inputs:</b> Valid only for call duration.</li>
                        <li><b>Get Record:</b> Owned, stable until <code>pomai_record_free</code>.</li>
                        <li><b>Search Results:</b> Stable until <code>pomai_search_results_free</code>.</li>
                        <li><b>Iter Views:</b> Valid only until next <code>next()</code> call.</li>
                    </ul>
                </Card>
            </div>

            <div className={styles.section} />

            {/* --- THREAD SAFETY --- */}
            <SectionHeading
                eyebrow="Concurrency"
                title="Thread Safety Contract"
                description="Explicit rules for sharing handles across threads."
            />

            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem', fontFamily: 'var(--font-sora)' }}>Handle-Level Safety</h3>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Handle</th>
                            <th>Thread-safe?</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className={styles.codeBadge}>pomai_db_t*</span></td>
                            <td>✅ Yes</td>
                            <td>Safe for concurrent reads; writes are internally serialized.</td>
                        </tr>
                        <tr>
                            <td><span className={styles.codeBadge}>pomai_snapshot_t*</span></td>
                            <td>✅ Yes</td>
                            <td>Immutable point-in-time view.</td>
                        </tr>
                        <tr>
                            <td><span className={styles.codeBadge}>pomai_iter_t*</span></td>
                            <td>❌ No</td>
                            <td>Iterator handles are stateful and not thread-safe.</td>
                        </tr>
                        <tr>
                            <td><span className={styles.codeBadge}>pomai_search_results_t*</span></td>
                            <td>❌ No</td>
                            <td>Caller-owned result buffers.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 style={{ color: '#fff', fontSize: '1.1rem', marginTop: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-sora)' }}>Function-Level Safety</h3>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Function</th>
                            <th>Safe?</th>
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><code>pomai_open</code>, <code>pomai_close</code></td>
                            <td>⚠️ Conditional</td>
                            <td>Do not race close() with other calls on same DB.</td>
                        </tr>
                        <tr>
                            <td><code>pomai_put</code>, <code>pomai_delete</code></td>
                            <td>✅ Yes</td>
                            <td>Writes serialized internally per shard.</td>
                        </tr>
                        <tr>
                            <td><code>pomai_get</code>, <code>pomai_search</code></td>
                            <td>✅ Yes</td>
                            <td>Safe against concurrent writes.</td>
                        </tr>
                        <tr>
                            <td><code>pomai_iter_next</code></td>
                            <td>❌ No</td>
                            <td>Same iterator must not be used concurrently.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={styles.section} />

            {/* --- POLICIES --- */}
            <div className={styles.grid}>
                <div>
                    <SectionHeading
                        eyebrow="Behavior"
                        title="Policies"
                        description="Specific runtime behaviors for edge cases."
                    />
                    <Card>
                        <h3 className={styles.cardHeader}>Search Partial-Failure</h3>
                        <p className={styles.list}>
                            Pomai preserves shard-level partial failure semantics:
                        </p>
                        <ul className={styles.list} style={{ marginTop: '0.5rem', listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                            <li>Search may return best-effort hits.</li>
                            <li>Returns <code>POMAI_STATUS_PARTIAL_FAILURE</code> while still setting results.</li>
                        </ul>
                    </Card>
                    <div style={{ height: '1.5rem' }} />
                    <Card>
                        <h3 className={styles.cardHeader}>Deadline Contract</h3>
                        <ul className={styles.list}>
                            <li><code>0</code> &rarr; No deadline.</li>
                            <li><code>Non-zero</code> &rarr; Unix epoch ms.</li>
                            <li>Returns <code>DEADLINE_EXCEEDED</code> deterministically.</li>
                        </ul>
                    </Card>
                </div>

                <div>
                    <SectionHeading
                        eyebrow="Quality"
                        title="Stability Gates"
                        description="The C ABI is considered stable only when these CI gates pass."
                    />
                    <div className={styles.highlightBox}>
                        <h3>CI Requirements</h3>
                        <ul>
                            <li>✅ Linux CI build/test gate (ubuntu-latest).</li>
                            <li>✅ Linux TSAN workload covering full lifecycle.</li>
                            <li>✅ On-disk format validation tests.</li>
                            <li>✅ Python ctypes smoke tests.</li>
                            <li>✅ Performance regression check (threshold 10%).</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* --- FFI NOTES --- */}
            <SectionHeading
                eyebrow="Integration"
                title="FFI Implementation Notes"
                description="Tips for binding PomaiDB to other languages."
            />

            <div className={styles.grid}>
                <Card>
                    <h3 className={styles.cardHeader}>Python (ctypes)</h3>
                    <p className={styles.list}>
                        Map opaque handles as <code>ctypes.c_void_p</code>. Always remember to free status and result objects explicitly.
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Go (cgo)</h3>
                    <p className={styles.list}>
                        Wrap status codes into Go <code>error</code> interface. Use <code>unsafe.Slice</code> for efficient zero-copy access to result arrays.
                    </p>
                </Card>
                <Card>
                    <h3 className={styles.cardHeader}>Rust (bindgen)</h3>
                    <p className={styles.list}>
                        Model handles as opaque enums. Use RAII-drop wrappers to automatically call free functions when handles go out of scope.
                    </p>
                </Card>
            </div>

        </Container>
    );
}