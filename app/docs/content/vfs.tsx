import React from "react";
import { DocHeading, DocSubHeading, DocParagraph, DocList, DocTechnicalSpec, DocCode, DocHighlight, DocNote } from "@/components/docs/doc-components";

export default function VfsDoc() {
    return (
        <>
            <DocHeading>Hardware Abstraction: The Virtual File System (VFS)</DocHeading>

            <DocParagraph>
                A fundamental requirement of edge-native deployments is immense portability. Edge environments frequently operate
                outside the norms of standard commercial clouds—they utilize entirely custom kernels, experimental Real-Time Operating
                Systems (RTOS) like FreeRTOS or VxWorks, and extremely obscure physical storage controller architectures. PomaiDB must
                operate flawlessly, and synchronously, across them all without modification to its core logical execution loops.
            </DocParagraph>
            <DocParagraph>
                <strong>PomaiDB achieves this hardware agnosticism via a robust, highly extensible Virtual File System (VFS) layer.</strong>
            </DocParagraph>

            <DocSubHeading>1. Complete Quarantine from POSIX Dependencies</DocSubHeading>
            <DocParagraph>
                Typical UNIX databases (and even standard embedded datastores like SQLite) directly inject POSIX system calls
                (such as <code>&lt;unistd.h&gt;</code>, <code>&lt;fcntl.h&gt;</code>, <code>pwrite()</code>, and <code>mmap()</code>)
                throughout their operational B-Tree logic. The moment developers compile that database for an aerospace RTOS lacking those exact headers,
                compilation completely fails.
            </DocParagraph>
            <DocList>
                <li>PomaiDB absolutely forbids OS-specific system libraries inside the core logic (<code>db/</code>, <code>membranes/</code>, <code>query/</code>).</li>
                <li>The system storage layer multiplexing, multi-threading construction loops, and clock synchronization algorithms are universally routed through abstract <code>pomai::Env</code> pointers.</li>
            </DocList>

            <DocTechnicalSpec
                title="Abstract VFS Contracts"
                specs={[
                    { label: "SequentialFile", value: "Forward-only reading buffers optimized to reconstruct WAL trails natively." },
                    { label: "RandomAccessFile", value: "Zero-copy operations across indexing blocks. Implementations typically override via raw Memory Maps where hardware supports MMU addressing." },
                    { label: "WritableFile", value: "Append-only semantic writing streams ensuring safe OS-cache flushes down to controller flash mediums." },
                    { label: "Directory & Clocks", value: "System iterators managing physical segment lifecycles and strictly monotonic timer implementations resisting NTP-drift anomalies." },
                ]}
            />

            <DocHighlight title="Defaulting to POSIX, Enabling Bare Metal">
                PomaiDB natively ships with a fully realized POSIX backend. If the C++ compiler detects an Android, Linux, or macOS environment,
                the compiler explicitly links that module ensuring maximum speed out of the box. However, because the interface contracts
                are strictly virtual, developers can build bespoke wrappers for hardware lacking standard file-systems.
            </DocHighlight>

            <DocSubHeading>2. Custom Environment Demonstrations (InMemory & Embedded)</DocSubHeading>
            <DocParagraph>
                PomaiDB intrinsically supplies an <code>InMemoryEnv</code> backend utilized primarily within the internal testing suite to
                safely execute millions of assertions instantaneously without eroding the physical NVMe disks.
                This identical structure demonstrates exactly how an enterprise engineers bare-metal abstractions.
            </DocParagraph>

            <DocCode language="cpp">
                {`// Example: Injecting completely custom hardware storage logic into PomaiDB via VFS
#include "pomai/pomai.h"
#include "pomai/env.h"
#include <iostream>

class CustomAerospaceEnv : public pomai::Env {
public:
    // Overriding the clock mechanism bypassing standard kernel time loops
    uint64_t NowMicros() override {
        return CustomHardwareTimer::ReadMonotonicTicks() * 1000;
    }

    // Overriding physical file generation logic to target proprietary flash EEPROM
    pomai::Status NewWritableFile(const std::string& fname, 
                                  pomai::WritableFile** result) override {
        // Instantiate a custom class wrapping the hardware's SPI protocol
        *result = new AerospaceSPIWritableFile(fname);
        return pomai::Status::OK();
    }
    
    // Manage threads bypassing standard pthreads
    void StartThread(void (*function)(void*), void* arg) override {
        VxWorksNativeScheduler::Spawn(function, arg);
    }
};

int main() {
    // 1. Instantiate the absolutely custom Hardware Environment
    CustomAerospaceEnv drone_hardware_env;

    // 2. Configure the Engine to explicitly utilize the custom VFS 
    //    instead of the default POSIX fallback.
    pomai::DBOptions opt;
    opt.env = &drone_hardware_env;  // Complete abstraction injection!
    opt.path = "/virtual_volume/telemetry";
    opt.dim = 64;

    std::unique_ptr<pomai::DB> secure_db;
    auto status = pomai::DB::Open(opt, &secure_db);

    if (status.ok()) {
        std::cout << "[SUCCESS] Engine bounded directly to proprietary hardware abstractions.\\n";
    }

    return 0;
}`}
            </DocCode>

            <DocNote title="File Mapping (Memory Management Unit Interface)">
                During VFS initialization, PomaiDB interrogates the <code>Env</code> to ascertain if the hardware supports logical Memory Mapping Unit (MMU)
                functionality via the <code>FileMapping</code> interface. If Memory Mapping is unsupported by the embedded chip, PomaiDB automatically degrades safely,
                switching its internal read-paths from zero-copy pointer arithmetic over to standard buffered block loading automatically.
            </DocNote>

        </>
    );
}
