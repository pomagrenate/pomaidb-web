---

title: "What Actually Happens When You Type a URL Into a Browser?"
slug: "what-happens-when-you-type-a-url"
date: "2026-08-22"
author: "Quan Van"
excerpt: "A systems-level investigation into the chain of events triggered by a URL: parsing, DNS resolution, connection establishment, TLS negotiation, HTTP, and browser rendering."
tags: ["Web", "Networking", "HTTP", "DNS", "TLS", "Browsers"]
category: "Computer Systems"
----------------------------

![Browser Request Lifecycle](/images/blog/browser_request_lifecycle.png)

Typing a URL into a browser looks like one operation.

```text
https://example.com
```

Press Enter.

A webpage appears.

From the user's perspective, the process is almost instantaneous.

From the computer's perspective, however, this simple action triggers a surprisingly long sequence of operations involving string parsing, DNS, networking, cryptography, operating-system APIs, HTTP, memory management, and rendering.

The browser does not simply "request a webpage."

It constructs a chain of dependencies that eventually transforms:

$$
\text{URL}
\rightarrow
\text{Network Connection}
\rightarrow
\text{HTTP Response}
\rightarrow
\text{Document}
\rightarrow
\text{Pixels}
$$

Understanding this chain provides a useful mental model for the modern web.

---

## 1. The URL Is Parsed First

Consider:

```text
https://example.com/products?id=42
```

The browser first needs to understand what this string represents.

A simplified URL can be decomposed into:

```text
https://example.com/products?id=42
  │          │          │       │
  │          │          │       └── Query
  │          │          └────────── Path
  │          └──────────────────── Host
  └─────────────────────────────── Scheme
```

The components describe different aspects of the request.

The scheme:

```text
https
```

tells the browser which protocol stack should be used.

The host:

```text
example.com
```

identifies the destination.

The path:

```text
/products
```

identifies the requested resource.

The query:

```text
id=42
```

contains additional parameters.

At this stage, no network request is necessarily required.

The browser is simply interpreting the input.

---

## 2. The Hostname Is Not an IP Address

The browser cannot directly establish a network connection to:

```text
example.com
```

A network stack ultimately needs an address such as:

```text
93.184.216.34
```

or an IPv6 address.

This is where the Domain Name System enters the process.

Conceptually:

```text
example.com
      ↓
     DNS
      ↓
93.184.216.34
```

DNS acts as a distributed naming system that maps human-readable domain names to network addresses.

But the browser does not necessarily start by contacting a DNS server every time.

---

## 3. DNS Caching

DNS resolution can happen at several layers.

A simplified chain looks like:

```text
Browser Cache
     ↓
Operating System Cache
     ↓
Local Resolver
     ↓
Recursive DNS Resolver
     ↓
Authoritative DNS Server
```

If a valid cached record already exists, the browser may avoid performing the complete resolution process.

This is important because network latency accumulates.

If every request required a complete DNS lookup, even a simple webpage could become noticeably slower.

DNS therefore demonstrates an important systems principle:

> **Repeatedly computing the same mapping is often more expensive than remembering the previous result.**

Caching is everywhere in modern computing for precisely this reason.

---

## 4. DNS Resolution

If the address is not available locally, a recursive resolver may need to discover it.

The DNS hierarchy can be represented conceptually as:

```text
                    Root
                     │
                     ↓
                   .com
                     │
                     ↓
              example.com
                     │
                     ↓
               A / AAAA Record
```

The resolver eventually obtains a record containing the address associated with the requested hostname.

For example:

```text
example.com
    ↓
A record
    ↓
93.184.216.34
```

The browser can now proceed toward establishing a connection.

---

## 5. Establishing the Transport Connection

For HTTPS, the browser needs a secure transport connection.

Traditionally, HTTP/1.1 and HTTP/2 operate over TCP.

The simplified flow is:

```text
Client                         Server

   SYN ------------------------>
       <------------------ SYN-ACK
   ACK ------------------------>
```

This is the TCP three-way handshake.

The purpose is to establish a reliable byte stream between the two endpoints.

Conceptually:

$$
Client
\leftrightarrow
TCP Connection
\leftrightarrow
Server
$$

Only after this transport layer is established can higher-level protocols use it.

---

## 6. HTTPS Adds Cryptography

The URL uses:

```text
https://
```

rather than:

```text
http://
```

That extra `s` is significant.

HTTPS combines HTTP with TLS.

The browser and server negotiate cryptographic parameters and establish shared secrets that will be used to protect subsequent communication.

Conceptually:

```text
HTTP
 ↓
TLS
 ↓
TCP
 ↓
IP
 ↓
Network
```

The browser is therefore not simply sending plaintext HTTP data across the network.

---

## 7. The TLS Handshake

A simplified TLS interaction looks like:

```text
Client                              Server

ClientHello ------------------------>

                  <---------------- ServerHello
                  <---------------- Certificate
                  <---------------- Key Exchange

Key Exchange ----------------------->

Finished --------------------------->
                  <---------------- Finished
```

The exact details depend on the TLS version and negotiated cipher suite.

The important idea is that both sides establish the cryptographic context required to protect application data.

The server also provides a certificate that allows the browser to verify the server's identity within the Web PKI trust model.

After successful negotiation, application data can be encrypted.

---

## 8. HTTP Finally Enters the Picture

Now the browser can construct an HTTP request.

A simplified HTTP request might look like:

```http
GET /products?id=42 HTTP/1.1
Host: example.com
Accept: text/html
User-Agent: Browser
```

The request contains:

* method
* target
* headers
* optionally a body

The browser sends this request through the established connection.

The server processes it and returns an HTTP response.

---

## 9. The HTTP Response

A simplified response could look like:

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<html>
    ...
</html>
```

The browser now has actual application data.

But the webpage is not visible yet.

It has only received bytes.

This distinction is important.

The browser still has to transform those bytes into a structured representation that can eventually be rendered.

---

## 10. Bytes Become Characters

The HTTP response body is initially just a sequence of bytes.

For example:

```text
48 54 4D 4C ...
```

The browser determines the appropriate character encoding and decodes those bytes into text.

Conceptually:

$$
Bytes
\rightarrow
Characters
$$

For HTML, those characters are then interpreted by the browser's HTML parser.

---

## 11. HTML Becomes a DOM

Consider:

```html
<div>
    <h1>Hello</h1>
    <p>World</p>
</div>
```

The browser does not render this text directly.

It constructs a tree-like representation.

```text
Document
   │
   └── div
       ├── h1
       │   └── "Hello"
       │
       └── p
           └── "World"
```

This structure is the Document Object Model.

The DOM allows browser engines and JavaScript to reason about the document structurally rather than treating HTML as an undifferentiated string.

---

## 12. CSS Creates Another Representation

HTML describes structure.

CSS describes presentation.

For example:

```css
h1 {
    font-size: 32px;
}
```

The browser parses CSS into its own internal representation and determines which style rules apply to which elements.

Conceptually:

```text
HTML
 ↓
DOM

CSS
 ↓
Style Rules

DOM + CSS
 ↓
Styled Document
```

The browser must now determine how the document should actually be laid out.

---

## 13. Layout

Suppose the browser has:

```html
<div>
    <h1>Hello</h1>
    <p>World</p>
</div>
```

It needs to determine things such as:

* element dimensions
* positions
* margins
* padding
* line wrapping
* font metrics
* stacking relationships

The result is a set of geometric information.

Conceptually:

```text
Element
    ↓
Style
    ↓
Geometry
    ↓
Position + Size
```

This phase is often called layout.

A change to one element can sometimes invalidate geometry elsewhere, which is why certain DOM operations can become expensive when performed repeatedly.

---

## 14. Painting

Once the browser knows where things belong, it needs to determine what should actually be drawn.

For example:

```text
Draw background
Draw border
Draw text
Draw image
Draw shadow
```

The browser constructs drawing operations that describe the visual result.

Conceptually:

```text
Layout Tree
     ↓
Paint Operations
     ↓
Graphics Pipeline
```

The final output is no longer an HTML document.

It is a collection of graphical operations.

---

## 15. Compositing

Modern browsers frequently divide rendering into multiple layers.

Some elements can be rendered independently and later composited together.

Conceptually:

```text
Layer A ─┐
Layer B ─┼──→ Compositor ──→ Frame
Layer C ─┘
```

This is particularly useful for operations such as animations and transformations.

Instead of recalculating the entire document every time something moves, the browser may be able to manipulate an existing rendered layer.

This distinction is one reason why some animations are significantly cheaper than others.

---

## 16. The GPU May Enter the Pipeline

The browser can ultimately use graphics hardware to produce the final frame.

A simplified rendering path becomes:

```text
HTML
 ↓
DOM
 ↓
Style
 ↓
Layout
 ↓
Paint
 ↓
Layers
 ↓
Compositing
 ↓
GPU
 ↓
Display
```

The GPU processes graphics workloads in parallel and eventually contributes to producing the frame displayed on the screen.

The final visible webpage is therefore the result of several independent systems cooperating.

---

## 17. JavaScript Makes Everything Dynamic

The process does not necessarily happen once.

JavaScript can modify the document after the initial response arrives.

For example:

```javascript
document.querySelector("h1").textContent = "Hello World";
```

This changes the DOM.

The browser may then need to perform additional work:

```text
JavaScript
    ↓
DOM Mutation
    ↓
Style Recalculation
    ↓
Layout
    ↓
Paint
    ↓
Composite
```

Not every DOM change necessarily triggers every stage, but changes that affect geometry can cause substantially more work than changes that only affect compositing.

This is one of the foundations of browser performance engineering.

---

## 18. One URL, Multiple Protocols

What looks like one action to the user is actually a stack of cooperating protocols and systems.

A simplified representation is:

```text
                    Browser
                       │
                    HTTP
                       │
                     TLS
                       │
                     TCP
                       │
                      IP
                       │
                    Ethernet
                       │
                    Physical
```

Each layer solves a different problem.

HTTP provides application semantics.

TLS provides confidentiality and authentication.

TCP provides reliable ordered delivery.

IP provides packet addressing and routing.

The physical and link layers move the actual bits.

The browser sits at the top of this stack while depending on every layer beneath it.

---

## 19. The Full Journey

The complete simplified lifecycle can therefore be represented as:

```text
URL
 │
 ├── Parse
 │
 ↓
Hostname
 │
 ├── DNS
 │
 ↓
IP Address
 │
 ├── Connection
 │
 ↓
TCP
 │
 ├── TLS
 │
 ↓
Secure Channel
 │
 ├── HTTP Request
 │
 ↓
HTTP Response
 │
 ├── Decode
 │
 ↓
HTML
 │
 ├── Parse
 │
 ↓
DOM
 │
 ├── CSS
 │
 ↓
Style + Layout
 │
 ├── Paint
 │
 ↓
Graphics Layers
 │
 ├── Composite
 │
 ↓
Frame
 │
 ↓
Screen
```

A single press of Enter therefore crosses several abstraction boundaries.

---

## 20. Why This Matters

Understanding this sequence changes how web performance problems are diagnosed.

If a page is slow before the server receives the request, the problem may involve:

```text
DNS
Connection Establishment
TLS
```

If the server receives the request quickly but responds slowly:

```text
Application
Database
Backend
Infrastructure
```

may be responsible.

If the response arrives quickly but the page takes a long time to become interactive:

```text
JavaScript
DOM
Layout
Rendering
Main Thread
```

may be the bottleneck.

The visible symptom:

> "The website is slow."

is therefore almost meaningless without understanding where the latency occurs.

---

## 21. Architectural Conclusion

A browser is not a document viewer.

It is a distributed systems client, protocol implementation, programming runtime, parser, layout engine, graphics system, and security boundary operating simultaneously.

The transformation:

$$
URL \rightarrow Pixels
$$

hides an enormous amount of computation.

What makes the Web powerful is precisely this layering.

A developer can write:

```html
<h1>Hello World</h1>
```

without manually implementing:

* TCP
* TLS
* DNS
* HTTP parsing
* font rasterization
* layout algorithms
* GPU compositing

The abstractions allow us to build at a higher level.

But understanding what lies beneath those abstractions provides something equally valuable:

**the ability to reason about the system when the abstraction stops behaving as expected.**

> [!NOTE]
> **Research Insight:** A browser navigation is not a single operation but a pipeline crossing multiple abstraction boundaries. Performance, security, and reliability problems can originate at any layer of that pipeline. Understanding the complete chain—from DNS and transport protocols to parsing, layout, and compositing—turns "the website is slow" from a vague symptom into a diagnosable systems problem.
