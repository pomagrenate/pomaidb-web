"use client";

import { useState } from "react";
import Badge from "@/components/Badge";
import Card from "@/components/Card";
import CodeBlock from "@/components/CodeBlock";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import Link from "next/link";
import styles from "./get-started.module.css";

// --- CONTENT CONSTANTS ---

const BUILD_CMD = `cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --target pomai_c`;

const EXAMPLES = {
  c: {
    label: "C",
    desc: "Direct integration using the raw C API headers.",
    filename: "main.c",
    cmd: `gcc -o example main.c -I./include -L./build -lpomai_c
./example`,
    code: `#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "pomai/c_api.h"

static void check_status(const char* step, pomai_status_t* st) {
    if (st == NULL) {
        return;
    }
    fprintf(stderr, "%s failed [%d]: %s\\n", step, pomai_status_code(st), pomai_status_message(st));
    pomai_status_free(st);
    exit(1);
}

int main(void) {
    pomai_options_t opts;
    pomai_options_init(&opts);
    opts.path = "example_db_c_basic";
    opts.dim = 4;

    pomai_db_t* db = NULL;
    check_status("open", pomai_open(&opts, &db));

    float vectors[3][4] = {{1, 0, 0, 0}, {0, 1, 0, 0}, {0.9f, 0.1f, 0, 0}};
    pomai_upsert_t batch[3];
    memset(batch, 0, sizeof(batch));
    for (size_t i = 0; i < 3; ++i) {
        batch[i].id = (uint64_t)(i + 1);
        batch[i].vector = vectors[i];
        batch[i].dim = 4;
    }
    check_status("put_batch", pomai_put_batch(db, batch, 3));

    float query_vec[4] = {1, 0, 0, 0};
    pomai_query_t query;
    memset(&query, 0, sizeof(query));
    query.vector = query_vec;
    query.dim = 4;
    query.topk = 2;

    pomai_search_results_t* res = NULL;
    check_status("search", pomai_search(db, &query, &res));
    for (size_t i = 0; i < res->count; ++i) {
        printf("hit[%zu] id=%llu score=%f\\n", i, (unsigned long long)res->ids[i], res->scores[i]);
    }
    pomai_search_results_free(res);

    pomai_snapshot_t* snap = NULL;
    check_status("get_snapshot", pomai_get_snapshot(db, &snap));

    pomai_scan_options_t scan_opts;
    pomai_scan_options_init(&scan_opts);

    pomai_iter_t* iter = NULL;
    check_status("scan", pomai_scan(db, &scan_opts, snap, &iter));

    while (pomai_iter_valid(iter)) {
        pomai_record_view_t view;
        check_status("iter_get_record", pomai_iter_get_record(iter, &view));
        printf("scan id=%llu dim=%u v0=%f\\n", (unsigned long long)view.id, view.dim, view.vector[0]);
        pomai_iter_next(iter);
    }
    check_status("iter_status", pomai_iter_status(iter));

    pomai_iter_free(iter);
    pomai_snapshot_free(snap);
    check_status("close", pomai_close(db));
    return 0;
}`,
  },
  go: {
    label: "Go (cgo)",
    desc: "High-performance bindings via cgo.",
    filename: "main.go",
    cmd: `export LD_LIBRARY_PATH=$PWD/build:$LD_LIBRARY_PATH
go run main.go`,
    code: `// PomaiDB Go cgo example.
//
// How to run:
//   cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
//   cmake --build build --target pomai_c
//   export LD_LIBRARY_PATH=$PWD/build:$LD_LIBRARY_PATH
//   go run examples/go_basic.go
package main

/*
#cgo CFLAGS: -I\${SRCDIR}/../include
#cgo LDFLAGS: -L\${SRCDIR}/../build -lpomai_c
#include "pomai/c_api.h"
*/
import "C"

import (
  "fmt"
  "math/rand"
  "path/filepath"
  "unsafe"
)

func checkStatus(st *C.pomai_status_t) {
  if st == nil {
    return
  }
  msg := C.pomai_status_message(st)
  defer C.pomai_status_free(st)
  panic(C.GoString(msg))
}

func main() {
  var opts C.pomai_options_t
  C.pomai_options_init(&opts)
  opts.struct_size = C.uint32_t(unsafe.Sizeof(opts))
  opts.path = C.CString(filepath.Clean("/tmp/pomai_example_go"))
  opts.shards = 4
  opts.dim = 8
  opts.search_threads = 2

  var db *C.pomai_db_t
  checkStatus(C.pomai_open(&opts, &db))

  rand.Seed(2024)
  dim := int(opts.dim)
  n := 100
  vectors := make([][]float32, n)
  upserts := make([]C.pomai_upsert_t, n)
  for i := 0; i < n; i++ {
    vec := make([]float32, dim)
    for j := 0; j < dim; j++ {
      vec[j] = rand.Float32()*2 - 1
    }
    vectors[i] = vec
    upserts[i].struct_size = C.uint32_t(unsafe.Sizeof(upserts[i]))
    upserts[i].id = C.uint64_t(i)
    upserts[i].vector = (*C.float)(unsafe.Pointer(&vec[0]))
    upserts[i].dim = C.uint32_t(dim)
    upserts[i].metadata = nil
    upserts[i].metadata_len = 0
  }
  checkStatus(C.pomai_put_batch(db, &upserts[0], C.size_t(n)))
  checkStatus(C.pomai_freeze(db))

  query := C.pomai_query_t{}
  query.struct_size = C.uint32_t(unsafe.Sizeof(query))
  query.vector = (*C.float)(unsafe.Pointer(&vectors[0][0]))
  query.dim = C.uint32_t(dim)
  query.topk = 5
  query.filter_expression = nil
  query.alpha = 1.0
  query.deadline_ms = 0

  var results *C.pomai_search_results_t
  checkStatus(C.pomai_search(db, &query, &results))

  count := int(results.count)
  ids := unsafe.Slice(results.ids, count)
  scores := unsafe.Slice(results.scores, count)
  fmt.Println("TopK results:")
  for i := 0; i < count; i++ {
    fmt.Printf("  id=%d score=%.4f\\n", uint64(ids[i]), float32(scores[i]))
  }
  C.pomai_search_results_free(results)
  checkStatus(C.pomai_close(db))
}`,
  },
  python: {
    label: "Python",
    desc: "Binding via ctypes. Requires no compilation.",
    filename: "example.py",
    cmd: `POMAI_C_LIB=./build/libpomai_c.so python3 example.py`,
    code: `#!/usr/bin/env python3
"""PomaiDB Python ctypes example.

How to run:
  # Build C API shared library first
  cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
  cmake --build build --target pomai_c
  POMAI_C_LIB=./build/libpomai_c.so python3 examples/python_basic.py
"""
import ctypes
import os
import random
import sys
from pathlib import Path


class PomaiOptions(ctypes.Structure):
    _fields_ = [
        ("struct_size", ctypes.c_uint32),
        ("path", ctypes.c_char_p),
        ("shards", ctypes.c_uint32),
        ("dim", ctypes.c_uint32),
        ("search_threads", ctypes.c_uint32),
        ("fsync_policy", ctypes.c_uint32),
        ("memory_budget_bytes", ctypes.c_uint64),
        ("deadline_ms", ctypes.c_uint32),
    ]


class PomaiUpsert(ctypes.Structure):
    _fields_ = [
        ("struct_size", ctypes.c_uint32),
        ("id", ctypes.c_uint64),
        ("vector", ctypes.POINTER(ctypes.c_float)),
        ("dim", ctypes.c_uint32),
        ("metadata", ctypes.POINTER(ctypes.c_uint8)),
        ("metadata_len", ctypes.c_uint32),
    ]


class PomaiQuery(ctypes.Structure):
    _fields_ = [
        ("struct_size", ctypes.c_uint32),
        ("vector", ctypes.POINTER(ctypes.c_float)),
        ("dim", ctypes.c_uint32),
        ("topk", ctypes.c_uint32),
        ("filter_expression", ctypes.c_char_p),
        ("alpha", ctypes.c_float),
        ("deadline_ms", ctypes.c_uint32),
    ]


class PomaiSearchResults(ctypes.Structure):
    _fields_ = [
        ("struct_size", ctypes.c_uint32),
        ("count", ctypes.c_size_t),
        ("ids", ctypes.POINTER(ctypes.c_uint64)),
        ("scores", ctypes.POINTER(ctypes.c_float)),
        ("shard_ids", ctypes.POINTER(ctypes.c_uint32)),
    ]


def load_lib() -> ctypes.CDLL:
    default_name = "libpomai_c.so" if sys.platform != "darwin" else "libpomai_c.dylib"
    lib_path = Path(os.environ.get("POMAI_C_LIB", f"./build/{default_name}")).resolve()
    if not lib_path.exists():
        raise FileNotFoundError(f"PomaiDB C library not found: {lib_path}")
    lib = ctypes.CDLL(str(lib_path))
    lib.pomai_options_init.argtypes = [ctypes.POINTER(PomaiOptions)]
    lib.pomai_options_init.restype = None
    lib.pomai_open.argtypes = [ctypes.POINTER(PomaiOptions), ctypes.POINTER(ctypes.c_void_p)]
    lib.pomai_open.restype = ctypes.c_void_p
    lib.pomai_close.argtypes = [ctypes.c_void_p]
    lib.pomai_close.restype = ctypes.c_void_p
    lib.pomai_put_batch.argtypes = [ctypes.c_void_p, ctypes.POINTER(PomaiUpsert), ctypes.c_size_t]
    lib.pomai_put_batch.restype = ctypes.c_void_p
    lib.pomai_freeze.argtypes = [ctypes.c_void_p]
    lib.pomai_freeze.restype = ctypes.c_void_p
    lib.pomai_search.argtypes = [
        ctypes.c_void_p,
        ctypes.POINTER(PomaiQuery),
        ctypes.POINTER(ctypes.POINTER(PomaiSearchResults)),
    ]
    lib.pomai_search.restype = ctypes.c_void_p
    lib.pomai_search_results_free.argtypes = [ctypes.POINTER(PomaiSearchResults)]
    lib.pomai_search_results_free.restype = None
    lib.pomai_status_message.argtypes = [ctypes.c_void_p]
    lib.pomai_status_message.restype = ctypes.c_char_p
    lib.pomai_status_free.argtypes = [ctypes.c_void_p]
    lib.pomai_status_free.restype = None
    return lib


def check_status(lib: ctypes.CDLL, status) -> None:
    if status:
        msg = lib.pomai_status_message(status).decode("utf-8", errors="replace")
        lib.pomai_status_free(status)
        raise RuntimeError(msg)


def main() -> None:
    lib = load_lib()
    db = ctypes.c_void_p()

    opts = PomaiOptions()
    lib.pomai_options_init(ctypes.byref(opts))
    opts.struct_size = ctypes.sizeof(PomaiOptions)
    opts.path = str(Path("/tmp/pomai_example_py").resolve()).encode()
    opts.shards = 4
    opts.dim = 8
    opts.search_threads = 2

    check_status(lib, lib.pomai_open(ctypes.byref(opts), ctypes.byref(db)))

    random.seed(42)
    dim = opts.dim
    n = 100

    vectors = []
    upserts = (PomaiUpsert * n)()
    for i in range(n):
        vec = (ctypes.c_float * dim)(*[(random.random() * 2 - 1) for _ in range(dim)])
        vectors.append(vec)
        upserts[i].struct_size = ctypes.sizeof(PomaiUpsert)
        upserts[i].id = i
        upserts[i].vector = ctypes.cast(vec, ctypes.POINTER(ctypes.c_float))
        upserts[i].dim = dim
        upserts[i].metadata = ctypes.cast(None, ctypes.POINTER(ctypes.c_uint8))
        upserts[i].metadata_len = 0

    check_status(lib, lib.pomai_put_batch(db, upserts, n))
    check_status(lib, lib.pomai_freeze(db))

    query_vec = vectors[0]
    query = PomaiQuery()
    query.struct_size = ctypes.sizeof(PomaiQuery)
    query.vector = ctypes.cast(query_vec, ctypes.POINTER(ctypes.c_float))
    query.dim = dim
    query.topk = 5
    query.filter_expression = None
    query.alpha = 1.0
    query.deadline_ms = 0

    out_ptr = ctypes.POINTER(PomaiSearchResults)()
    check_status(lib, lib.pomai_search(db, ctypes.byref(query), ctypes.byref(out_ptr)))
    results = out_ptr.contents

    print("TopK results:")
    for i in range(results.count):
        print(f"  id={results.ids[i]} score={results.scores[i]:.4f}")

    lib.pomai_search_results_free(out_ptr)
    check_status(lib, lib.pomai_close(db))


if __name__ == "__main__":
    main()`,
  },
  node: {
    label: "Node.js",
    desc: "FFI bindings using ffi-napi.",
    filename: "index.mjs",
    cmd: `npm install ffi-napi ref-napi ref-struct-di
POMAI_C_LIB=./build/libpomai_c.so node index.mjs`,
    code: `#!/usr/bin/env node
// PomaiDB JavaScript FFI example (Node.js).
//
// How to run:
//   cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
//   cmake --build build --target pomai_c
//   npm install ffi-napi ref-napi ref-struct-di
//   POMAI_C_LIB=./build/libpomai_c.so node examples/js_basic.mjs

import ffi from "ffi-napi";
import ref from "ref-napi";
import StructDi from "ref-struct-di";
import path from "node:path";
import process from "node:process";

const Struct = StructDi(ref);
const voidPtr = ref.refType(ref.types.void);
const floatPtr = ref.refType(ref.types.float);
const uint8Ptr = ref.refType(ref.types.uint8);

const PomaiOptions = Struct({
  struct_size: ref.types.uint32,
  path: ref.types.CString,
  shards: ref.types.uint32,
  dim: ref.types.uint32,
  search_threads: ref.types.uint32,
  fsync_policy: ref.types.uint32,
  memory_budget_bytes: ref.types.uint64,
  deadline_ms: ref.types.uint32,
});

const PomaiUpsert = Struct({
  struct_size: ref.types.uint32,
  id: ref.types.uint64,
  vector: floatPtr,
  dim: ref.types.uint32,
  metadata: uint8Ptr,
  metadata_len: ref.types.uint32,
});

const PomaiQuery = Struct({
  struct_size: ref.types.uint32,
  vector: floatPtr,
  dim: ref.types.uint32,
  topk: ref.types.uint32,
  filter_expression: ref.types.CString,
  alpha: ref.types.float,
  deadline_ms: ref.types.uint32,
});

const PomaiSearchResults = Struct({
  struct_size: ref.types.uint32,
  count: ref.types.size_t,
  ids: ref.refType(ref.types.uint64),
  scores: floatPtr,
  shard_ids: ref.refType(ref.types.uint32),
});

const libPath = process.env.POMAI_C_LIB ?? path.resolve("./build/libpomai_c.so");
const lib = ffi.Library(libPath, {
  pomai_options_init: ["void", [ref.refType(PomaiOptions)]],
  pomai_open: [voidPtr, [ref.refType(PomaiOptions), ref.refType(voidPtr)]],
  pomai_close: [voidPtr, [voidPtr]],
  pomai_put: [voidPtr, [voidPtr, ref.refType(PomaiUpsert)]],
  pomai_put_batch: [voidPtr, [voidPtr, ref.refType(PomaiUpsert), ref.types.size_t]],
  pomai_freeze: [voidPtr, [voidPtr]],
  pomai_search: [
    voidPtr,
    [voidPtr, ref.refType(PomaiQuery), ref.refType(ref.refType(PomaiSearchResults))],
  ],
  pomai_search_results_free: ["void", [ref.refType(PomaiSearchResults)]],
  pomai_status_message: ["string", [voidPtr]],
  pomai_status_free: ["void", [voidPtr]],
});

function checkStatus(status) {
  if (!ref.isNull(status)) {
    const msg = lib.pomai_status_message(status);
    lib.pomai_status_free(status);
    throw new Error(msg);
  }
}

function makeVector(dim, seed) {
  const buf = Buffer.alloc(dim * 4);
  const view = new Float32Array(buf.buffer, buf.byteOffset, dim);
  for (let i = 0; i < dim; i += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    view[i] = ((seed % 1000) / 500) - 1;
  }
  return { buf, seed };
}

const dim = 8;
const total = 50;

const opts = new PomaiOptions();
lib.pomai_options_init(opts.ref());
opts.struct_size = PomaiOptions.size;
opts.path = path.resolve("/tmp/pomai_example_js");
opts.shards = 4;
opts.dim = dim;
opts.search_threads = 2;

const dbPtr = ref.alloc(voidPtr);
checkStatus(lib.pomai_open(opts.ref(), dbPtr));
const db = dbPtr.deref();

let seed = 1337;
const vectors = [];
for (let i = 0; i < total; i += 1) {
  const out = makeVector(dim, seed);
  seed = out.seed;
  vectors.push(out.buf);
  const upsert = new PomaiUpsert();
  upsert.struct_size = PomaiUpsert.size;
  upsert.id = i;
  upsert.vector = out.buf;
  upsert.dim = dim;
  upsert.metadata = ref.NULL;
  upsert.metadata_len = 0;
  checkStatus(lib.pomai_put(db, upsert.ref()));
}
checkStatus(lib.pomai_freeze(db));

const query = new PomaiQuery();
query.struct_size = PomaiQuery.size;
query.vector = vectors[0];
query.dim = dim;
query.topk = 5;
query.filter_expression = ref.NULL;
query.alpha = 1.0;
query.deadline_ms = 0;

const resultsPtrPtr = ref.alloc(ref.refType(PomaiSearchResults));
checkStatus(lib.pomai_search(db, query.ref(), resultsPtrPtr));
const resultsPtr = resultsPtrPtr.deref();
const results = resultsPtr.deref();

const idsBuf = ref.reinterpret(results.ids, Number(results.count) * 8, 0);
const scoresBuf = ref.reinterpret(results.scores, Number(results.count) * 4, 0);
const ids = new BigUint64Array(idsBuf.buffer, idsBuf.byteOffset, Number(results.count));
const scores = new Float32Array(scoresBuf.buffer, scoresBuf.byteOffset, Number(results.count));

console.log("TopK results:");
for (let i = 0; i < results.count; i += 1) {
  console.log(\`  id=\${ids[i].toString()} score=\${scores[i].toFixed(4)}\`);
}

lib.pomai_search_results_free(resultsPtr);
checkStatus(lib.pomai_close(db));`,
  },
  ts: {
    label: "TypeScript",
    desc: "Type-safe FFI using ts-node.",
    filename: "main.ts",
    cmd: `npm install ffi-napi ref-napi ts-node
POMAI_C_LIB=./build/libpomai_c.so npx ts-node main.ts`,
    code: `// PomaiDB TypeScript FFI example (Node.js + ts-node).
//
// How to run:
//   cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
//   cmake --build build --target pomai_c
//   npm install ffi-napi ref-napi ref-struct-di ts-node typescript
//   POMAI_C_LIB=./build/libpomai_c.so npx ts-node --compiler-options '{"module":"commonjs"}' examples/ts_basic.ts

import ffi from "ffi-napi";
import ref from "ref-napi";
import StructDi from "ref-struct-di";
import path from "node:path";

const Struct = StructDi(ref);
const voidPtr = ref.refType(ref.types.void);
const floatPtr = ref.refType(ref.types.float);
const uint8Ptr = ref.refType(ref.types.uint8);

const PomaiOptions = Struct({
  struct_size: ref.types.uint32,
  path: ref.types.CString,
  shards: ref.types.uint32,
  dim: ref.types.uint32,
  search_threads: ref.types.uint32,
  fsync_policy: ref.types.uint32,
  memory_budget_bytes: ref.types.uint64,
  deadline_ms: ref.types.uint32,
});

const PomaiUpsert = Struct({
  struct_size: ref.types.uint32,
  id: ref.types.uint64,
  vector: floatPtr,
  dim: ref.types.uint32,
  metadata: uint8Ptr,
  metadata_len: ref.types.uint32,
});

const PomaiQuery = Struct({
  struct_size: ref.types.uint32,
  vector: floatPtr,
  dim: ref.types.uint32,
  topk: ref.types.uint32,
  filter_expression: ref.types.CString,
  alpha: ref.types.float,
  deadline_ms: ref.types.uint32,
});

const PomaiSearchResults = Struct({
  struct_size: ref.types.uint32,
  count: ref.types.size_t,
  ids: ref.refType(ref.types.uint64),
  scores: floatPtr,
  shard_ids: ref.refType(ref.types.uint32),
});

const libPath = process.env.POMAI_C_LIB ?? path.resolve("./build/libpomai_c.so");
const lib = ffi.Library(libPath, {
  pomai_options_init: ["void", [ref.refType(PomaiOptions)]],
  pomai_open: [voidPtr, [ref.refType(PomaiOptions), ref.refType(voidPtr)]],
  pomai_close: [voidPtr, [voidPtr]],
  pomai_put: [voidPtr, [voidPtr, ref.refType(PomaiUpsert)]],
  pomai_freeze: [voidPtr, [voidPtr]],
  pomai_search: [
    voidPtr,
    [voidPtr, ref.refType(PomaiQuery), ref.refType(ref.refType(PomaiSearchResults))],
  ],
  pomai_search_results_free: ["void", [ref.refType(PomaiSearchResults)]],
  pomai_status_message: ["string", [voidPtr]],
  pomai_status_free: ["void", [voidPtr]],
});

function checkStatus(status: any) {
  if (!ref.isNull(status)) {
    const msg = lib.pomai_status_message(status);
    lib.pomai_status_free(status);
    throw new Error(msg);
  }
}

function makeVector(dim: number, seed: number) {
  const buf = Buffer.alloc(dim * 4);
  const view = new Float32Array(buf.buffer, buf.byteOffset, dim);
  let next = seed;
  for (let i = 0; i < dim; i += 1) {
    next = (next * 1664525 + 1013904223) >>> 0;
    view[i] = ((next % 1000) / 500) - 1;
  }
  return { buf, seed: next };
}

const dim = 8;
const total = 50;

const opts = new PomaiOptions();
lib.pomai_options_init(opts.ref());
opts.struct_size = PomaiOptions.size;
opts.path = path.resolve("/tmp/pomai_example_ts");
opts.shards = 4;
opts.dim = dim;
opts.search_threads = 2;

const dbPtr = ref.alloc(voidPtr);
checkStatus(lib.pomai_open(opts.ref(), dbPtr));
const db = dbPtr.deref();

let seed = 4242;
const vectors: Buffer[] = [];
for (let i = 0; i < total; i += 1) {
  const out = makeVector(dim, seed);
  seed = out.seed;
  vectors.push(out.buf);
  const upsert = new PomaiUpsert();
  upsert.struct_size = PomaiUpsert.size;
  upsert.id = i;
  upsert.vector = out.buf;
  upsert.dim = dim;
  upsert.metadata = ref.NULL;
  upsert.metadata_len = 0;
  checkStatus(lib.pomai_put(db, upsert.ref()));
}
checkStatus(lib.pomai_freeze(db));

const query = new PomaiQuery();
query.struct_size = PomaiQuery.size;
query.vector = vectors[0];
query.dim = dim;
query.topk = 5;
query.filter_expression = ref.NULL;
query.alpha = 1.0;
query.deadline_ms = 0;

const resultsPtrPtr = ref.alloc(ref.refType(PomaiSearchResults));
checkStatus(lib.pomai_search(db, query.ref(), resultsPtrPtr));
const resultsPtr = resultsPtrPtr.deref();
const results = resultsPtr.deref();

const idsBuf = ref.reinterpret(results.ids, Number(results.count) * 8, 0);
const scoresBuf = ref.reinterpret(results.scores, Number(results.count) * 4, 0);
const ids = new BigUint64Array(idsBuf.buffer, idsBuf.byteOffset, Number(results.count));
const scores = new Float32Array(scoresBuf.buffer, scoresBuf.byteOffset, Number(results.count));

console.log("TopK results:");
for (let i = 0; i < results.count; i += 1) {
  console.log(\`  id=\${ids[i].toString()} score=\${scores[i].toFixed(4)}\`);
}

lib.pomai_search_results_free(resultsPtr);
checkStatus(lib.pomai_close(db));`,
  },
};

type LanguageKey = keyof typeof EXAMPLES;

export default function GetStartedPage() {
  const [lang, setLang] = useState<LanguageKey>("python");

  return (
    <Container>
      <section className={styles.hero}>
        <Badge label="Quickstart" tone="blue" />
        <h1>Start building locally.</h1>
        <p>
          PomaiDB is designed for crash-safe, low-RAM environments.
          Since it is an embedded engine, you integrate it directly into your application process via the C API.
        </p>
      </section>

      {/* --- STEP 1: BUILD --- */}
      <div className={styles.stepContainer}>
        <div className={styles.stepBadge}>1</div>
        <SectionHeading
          eyebrow="Prerequisite"
          title="Build the Shared Library"
          description="PomaiDB is distributed as source. You must compile the C API shared library first."
        />
        <CodeBlock language="bash" code={BUILD_CMD} />
        <p className={styles.note} style={{ marginTop: '1rem' }}>
          <strong>Output:</strong> This will generate <code>libpomai_c.so</code> (Linux) or <code>libpomai_c.dylib</code> (macOS) in the <code>build/</code> directory.
        </p>
      </div>

      {/* --- STEP 2: LANGUAGE --- */}
      <div className={styles.stepContainer}>
        <div className={styles.stepBadge}>2</div>
        <SectionHeading
          eyebrow="Integration"
          title="Choose your runtime"
          description="Select your preferred language to see how to bind and interact with the engine."
        />

        <div className={styles.tabs}>
          {(Object.keys(EXAMPLES) as LanguageKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setLang(key)}
              className={`${styles.tabBtn} ${lang === key ? styles.activeTab : ""}`}
            >
              {EXAMPLES[key].label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <h4
            style={{
              color: "var(--pomai-text-strong)",
              marginBottom: "0.5rem",
              fontFamily: "var(--font-sora)",
            }}
          >
            {EXAMPLES[lang].desc}
          </h4>

          <div style={{ marginBottom: "1rem" }}>
            <p style={{ color: "var(--pomai-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
              Run command:
            </p>
            <CodeBlock language="bash" code={EXAMPLES[lang].cmd} />
          </div>

          <p style={{ color: "var(--pomai-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
            {EXAMPLES[lang].filename}:
          </p>
          <CodeBlock language={lang === 'node' ? 'javascript' : lang} code={EXAMPLES[lang].code} />
        </div>
      </div>

      {/* --- NEXT STEPS --- */}
      <SectionHeading
        eyebrow="Going further"
        title="What's next?"
        description="Now that you have the engine running, dive deeper into performance and internals."
      />

      <div className={styles.grid}>
        <Link href="/benchmarks" className={styles.cardLink}>
          <Card>
            <div className={styles.cardContent}>
              <h3>Benchmarks</h3>
              <p>Understand recall, latency goals, and how routing affects performance.</p>
            </div>
          </Card>
        </Link>
        <Link href="/architecture" className={styles.cardLink}>
          <Card>
            <div className={styles.cardContent}>
              <h3>Architecture</h3>
              <p>Learn about the single-writer model, WAL, and snapshot isolation.</p>
            </div>
          </Card>
        </Link>
      </div>
    </Container>
  );
}
