---
title: "BLOG: What Actually Happens When You Call a Framework API?"
slug: "what-actually-happens-when-you-call-a-framework-api"
date: "2026-08-23"
author: "Quan Van"
excerpt: "We use frameworks every day, but how much of their internal machinery do we actually understand? Let's go underneath the API and trace what really happens when a framework processes a request."
tags: ["Framework", "Backend", "Architecture", "Runtime", "Dependency Injection", "HTTP"]
category: "Software Engineering"
---

# BLOG: What Actually Happens When You Call a Framework API?

There is a point in every developer's career where frameworks stop feeling like magic.

You write:

```typescript
@Controller('/users')
export class UserController {
  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
````

And somehow, when a request arrives:

```http
GET /users/42
```

the framework knows:

* which controller should handle it,
* which method should execute,
* what `id` means,
* which dependencies should be injected,
* how to serialize the return value,
* how to handle errors,
* and how to send the final HTTP response.

The interesting question is:

> **Where does all of that actually happen?**

A framework API often looks deceptively simple.

Behind:

```typescript
@Get('/:id')
```

there may be:

```text
Metadata
    ↓
Registration
    ↓
Application Bootstrap
    ↓
Route Resolution
    ↓
Dependency Resolution
    ↓
Middleware
    ↓
Controller Invocation
    ↓
Serialization
    ↓
Response
```

Once you understand this pipeline, frameworks become much less mysterious.

You stop thinking:

> "NestJS somehow knows this."

and start thinking:

> "There must be a runtime mechanism that registered this metadata and later used it to construct and execute the request pipeline."

That shift in mental model is extremely valuable.

---

# 1. A Framework Is Usually a Runtime Built Around Your Code

When people say:

> "I'm using NestJS."

or:

> "I'm using Spring."

or:

> "I'm using ASP.NET Core."

they often imagine the framework as a collection of convenient APIs.

That's only part of the story.

A serious backend framework usually provides a runtime that manages:

```text
Application lifecycle
Dependency graph
Routing
Middleware
Request context
Error handling
Serialization
Configuration
Modules
Plugins
Observability
```

Your application code becomes a set of components that the runtime knows how to discover and execute.

Conceptually:

```text
Your Code
    ↓
Framework Metadata
    ↓
Framework Runtime
    ↓
Application
```

This is why frameworks are often described as **inversion of control** systems.

You don't necessarily call the framework.

The framework calls you.

---

# 2. The Difference Between a Library and a Framework

This distinction is worth understanding deeply.

With a library, your code usually controls the flow:

```text
Your Application
      ↓
Library
      ↓
Return
      ↓
Your Application
```

For example:

```typescript
const result = bcrypt.hash(password);
```

Your code decides when the library executes.

With a framework, the direction is often reversed:

```text
Framework Runtime
       ↓
Your Controller
       ↓
Your Service
       ↓
Return
       ↓
Framework Runtime
```

You don't normally write:

```typescript
while (serverIsRunning) {
    const request = receiveRequest();

    if (request.path === '/users') {
        usersController.getUsers();
    }
}
```

The framework owns that lifecycle.

This is the essence of:

> **Inversion of Control.**

---

# 3. So What Happens During Application Startup?

Before the first HTTP request arrives, the framework has a lot of work to do.

Imagine:

```typescript
@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

At startup, the framework needs to understand:

```text
Application
    ↓
Module
    ├── Controller
    └── Provider
```

It must construct an internal representation of your application.

Conceptually:

```text
ApplicationContainer

RootModule
    │
    ├── UserModule
    │      │
    │      ├── UserController
    │      │
    │      └── UserService
    │
    └── AuthModule
           │
           └── AuthService
```

The framework is building a graph.

---

# 4. Your Application Is a Dependency Graph

Suppose we have:

```typescript
class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
}
```

and:

```typescript
class UserService {
  constructor(
    private readonly userRepository: UserRepository,
  ) {}
}
```

Then the dependency graph is:

```text
UserController
      ↓
UserService
      ↓
UserRepository
```

If the controller also needs an authentication service:

```text
             ┌──────────────┐
             │ UserService  │
             └──────┬───────┘
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
UserRepository          AuthService
```

The framework needs to construct this graph correctly.

This is the real job of a Dependency Injection container.

---

# 5. Dependency Injection Is Not Magic

Consider:

```typescript
class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}
}
```

You never write:

```typescript
new UserController(
  new UserService(
    new UserRepository()
  )
);
```

The framework effectively does something conceptually similar.

The difference is that the framework performs this resolution dynamically based on its application metadata and dependency registrations.

A simplified container might behave conceptually like:

```text
resolve(UserController)
        ↓
find dependencies
        ↓
resolve(UserService)
        ↓
find dependencies
        ↓
resolve(UserRepository)
        ↓
construct UserService
        ↓
construct UserController
```

The important concept is:

> **Dependency Injection is dependency graph resolution.**

---

# 6. Why Does the Framework Know the Constructor Dependencies?

This is where runtime metadata becomes interesting.

Depending on the language and framework, the runtime may obtain dependency information through:

```text
Reflection
Decorators
Generated metadata
Explicit provider definitions
Type information
Code generation
```

For example, a framework may conceptually transform:

```typescript
constructor(
    userService: UserService
)
```

into metadata resembling:

```text
UserController
    dependencies:
        [UserService]
```

The exact mechanism differs between frameworks.

But the conceptual process remains:

```text
Source Code
    ↓
Metadata
    ↓
Container
    ↓
Dependency Resolution
```

---

# 7. Decorators Are Often Registration Mechanisms

Take:

```typescript
@Controller('/users')
export class UserController {}
```

It is tempting to think:

```text
@Controller()
```

means:

> "Create an HTTP controller."

But a decorator itself does not need to create the controller.

It can simply register metadata.

Conceptually:

```text
@Controller('/users')
        ↓
Metadata:
{
    type: "controller",
    path: "/users"
}
```

Then:

```typescript
@Get('/:id')
getUser() {}
```

might register:

```text
{
    method: "GET",
    path: "/:id",
    handler: "getUser"
}
```

The framework later reads that metadata.

This distinction is important:

> **Declaration and execution are different phases.**

---

# 8. Startup Phase vs Request Phase

A useful way to understand framework internals is to split the system into two major phases.

## Startup

```text
Application starts
       ↓
Discover modules
       ↓
Register providers
       ↓
Read metadata
       ↓
Build dependency graph
       ↓
Create instances
       ↓
Register routes
       ↓
Start HTTP server
```

## Request

```text
HTTP Request
       ↓
Router
       ↓
Middleware
       ↓
Guards / Interceptors / Filters
       ↓
Dependency Context
       ↓
Controller
       ↓
Service
       ↓
Response
```

This distinction explains why some framework operations happen only once while others happen for every request.

---

# 9. Route Registration

Consider:

```typescript
@Controller('/users')
export class UserController {

  @Get('/:id')
  getUser() {
    // ...
  }
}
```

The framework eventually needs something resembling:

```text
GET /users/:id
        ↓
UserController.getUser
```

Internally, this could become a route table:

```text
┌────────┬───────────────┬──────────────────────────┐
│ Method │ Path          │ Handler                  │
├────────┼───────────────┼──────────────────────────┤
│ GET    │ /users/:id    │ UserController.getUser   │
└────────┴───────────────┴──────────────────────────┘
```

The actual implementation can be more sophisticated.

But conceptually, that's what the framework needs to construct.

---

# 10. The Request Finally Arrives

Now:

```http
GET /users/42
```

arrives.

The framework receives something from the underlying HTTP runtime.

Depending on the ecosystem, this could ultimately involve:

```text
Node.js HTTP
Express
Fastify
Netty
Kestrel
Servlet
Tokio
Hyper
```

The framework doesn't necessarily implement the network stack itself.

It often sits above another runtime.

Conceptually:

```text
Operating System
       ↓
TCP
       ↓
HTTP Runtime
       ↓
Framework
       ↓
Application
```

This is another useful architectural boundary.

---

# 11. Routing Is a Lookup Problem

The framework now has:

```text
Method = GET
Path   = /users/42
```

and needs to determine:

```text
Which handler?
```

It might conceptually compare against:

```text
GET /users/:id
```

and determine:

```text
/users/42

:id = 42
```

The route matcher therefore produces something like:

```text
Route Match
├── Controller: UserController
├── Method: getUser
└── Params:
      id = "42"
```

Now the framework knows what to execute.

---

# 12. But It Still Cannot Simply Call the Method

You might think:

```typescript
controller.getUser("42");
```

and we're done.

Not quite.

Real frameworks usually have a request execution pipeline.

For example:

```text
Request
   ↓
Middleware
   ↓
Authentication
   ↓
Authorization
   ↓
Validation
   ↓
Interceptors
   ↓
Controller
   ↓
Serialization
   ↓
Response
```

Each layer has a specific responsibility.

---

# 13. Middleware

Middleware usually operates around the incoming request.

Conceptually:

```typescript
async function middleware(req, res, next) {
    // do something
    await next();
}
```

The important abstraction is:

```text
Request
   ↓
Middleware A
   ↓
Middleware B
   ↓
Route Handler
```

Middleware is essentially a chain.

Conceptually:

```text
M1(
  M2(
    M3(
      Handler
    )
  )
)
```

This is sometimes called a **middleware pipeline**.

---

# 14. The Pipeline Is Basically Function Composition

Suppose:

```text
F1 = authentication
F2 = logging
F3 = validation
F4 = controller
```

The final execution can conceptually resemble:

$$
F_1(F_2(F_3(F_4(request))))
$$

Or, operationally:

```text
Request
  ↓
Auth
  ↓
Logging
  ↓
Validation
  ↓
Controller
```

This is a powerful general programming concept.

Framework pipelines are often compositions of smaller execution units.

---

# 15. Dependency Resolution Happens Around Here

Eventually the framework needs the controller instance.

If:

```text
UserController
    ↓
UserService
```

the DI container resolves the dependency.

Conceptually:

```text
resolve(UserController)
        ↓
resolve(UserService)
        ↓
resolve(UserRepository)
        ↓
construct dependencies
        ↓
construct UserController
```

The resulting instance is then used by the request pipeline.

Depending on framework scope configuration, this instance may be:

```text
Singleton
Request-scoped
Transient
```

This distinction can have major performance implications.

---

# 16. Singleton vs Request Scope

Suppose the framework uses a singleton service:

```text
Application
    ↓
One UserService instance
    ↓
Many requests
```

This is efficient because the object doesn't need to be recreated for every request.

But request-scoped dependencies change the picture:

```text
Request 1
   ↓
UserService #1

Request 2
   ↓
UserService #2

Request 3
   ↓
UserService #3
```

Now the framework has additional work to perform.

It needs to create a dependency context for each request.

This is why dependency scope isn't merely a design preference.

It can affect runtime performance and memory usage.

---

# 17. Parameter Resolution

Now consider:

```typescript
@Get('/:id')
getUser(@Param('id') id: string) {
    return this.userService.findById(id);
}
```

The method expects:

```text
id
```

The framework needs to transform:

```text
HTTP Request
```

into:

```text
"42"
```

This is another metadata-driven operation.

Conceptually:

```text
Parameter Metadata

Parameter #0
Source = RouteParams
Key = "id"
```

Then:

```text
Request
   ↓
params["id"]
   ↓
"42"
   ↓
Controller argument #0
```

The framework is effectively performing argument injection.

---

# 18. Validation Is Another Transformation

Suppose:

```typescript
@Post()
createUser(@Body() dto: CreateUserDto) {}
```

The incoming request contains:

```json
{
  "name": "Quan",
  "age": 24
}
```

The framework may perform:

```text
HTTP Body
   ↓
JSON Parse
   ↓
Object
   ↓
Validation
   ↓
Transformation
   ↓
DTO
   ↓
Controller
```

The controller therefore doesn't necessarily receive raw HTTP bytes.

It receives an object that has passed through several framework layers.

---

# 19. This Is Why Frameworks Feel "Declarative"

You write:

```typescript
@Post()
createUser(@Body() dto: CreateUserDto) {}
```

instead of:

```typescript
const body = JSON.parse(request.body);

if (!body.name) {
    throw new Error(...);
}

const dto = new CreateUserDto();

dto.name = body.name;
dto.age = body.age;

await controller.createUser(dto);
```

The framework moves repetitive infrastructure logic away from application code.

That is the real value of a framework.

It doesn't eliminate complexity.

It **centralizes and automates** it.

---

# 20. The Controller Executes

Eventually:

```typescript
this.userController.getUser("42");
```

is invoked.

Inside:

```typescript
return this.userService.findById("42");
```

Now the framework temporarily disappears from your mental model.

Your application logic executes.

This is important.

A framework should ideally orchestrate your application without becoming the application itself.

---

# 21. Then the Framework Takes Control Again

Suppose the controller returns:

```typescript
{
    id: "42",
    name: "Quan"
}
```

The framework now needs to convert the application result into an HTTP response.

Conceptually:

```text
Controller Result
      ↓
Interceptors
      ↓
Serialization
      ↓
HTTP Response
```

Potentially:

```json
{
  "id": "42",
  "name": "Quan"
}
```

with:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

The framework has now completed the cycle.

---

# 22. The Entire Request Pipeline

We can now draw the complete conceptual pipeline:

```text
                 HTTP Request
                       │
                       ▼
               ┌───────────────┐
               │ HTTP Runtime  │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │    Router     │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │  Middleware   │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │ Guards/Auth   │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │   Validation  │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │   Controller  │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │    Service    │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │   Database    │
               └───────┬───────┘
                       │
                       ▼
               ┌───────────────┐
               │ Serialization │
               └───────┬───────┘
                       │
                       ▼
                  HTTP Response
```

That's the framework's job.

Not business logic.

**Orchestration.**

---

# 23. So What Is the Framework Actually Doing?

At this point we can simplify the entire framework into several major responsibilities.

### 1. Discover

```text
What components exist?
```

### 2. Register

```text
Which component provides what?
```

### 3. Resolve

```text
What dependencies does each component need?
```

### 4. Route

```text
Which handler owns this request?
```

### 5. Execute

```text
How should the request flow through the pipeline?
```

### 6. Transform

```text
How do HTTP inputs become application inputs?
```

### 7. Serialize

```text
How does application output become HTTP output?
```

This is a much better mental model than:

> "NestJS handles requests."

---

# 24. Frameworks Are Metadata Machines

One of the deeper ideas behind decorator-heavy frameworks is:

> **Your source code contains declarations, and the framework turns those declarations into runtime behavior.**

For example:

```typescript
@Controller('/users')
```

declares:

```text
This class represents a controller.
```

Then:

```typescript
@Get('/:id')
```

declares:

```text
This method handles GET /:id.
```

And:

```typescript
constructor(userService: UserService)
```

declares:

```text
This component depends on UserService.
```

The framework combines those declarations.

Conceptually:

```text
Declarations
     ↓
Metadata
     ↓
Runtime Graph
     ↓
Execution
```

That is a recurring pattern across modern frameworks.

---

# 25. This Pattern Exists Outside Backend Frameworks

The same idea appears in many ecosystems.

## React

You declare:

```jsx
<Component />
```

The runtime determines:

```text
What needs to render?
What changed?
What needs updating?
```

---

## Spring

You declare:

```java
@Service
```

and:

```java
@Autowired
```

The container constructs and wires components.

---

## ASP.NET Core

You register services:

```csharp
services.AddScoped<IUserService, UserService>();
```

The runtime builds the dependency graph and request pipeline.

---

## Rust Ecosystem

Even without runtime reflection, frameworks can build similar abstractions through:

```text
Traits
Macros
Code Generation
Compile-time Registration
Generics
```

This is an important distinction.

The *idea* is the same.

The implementation mechanism is different.

---

# 26. Runtime Reflection vs Compile-Time Generation

There are two broad ways frameworks can obtain this information.

### Runtime approach

```text
Source
  ↓
Metadata
  ↓
Runtime Reflection
  ↓
Framework
```

Advantages:

* flexible
* dynamic
* convenient

Potential disadvantages:

* runtime overhead
* more difficult static reasoning
* reflection limitations depending on language/runtime

---

### Compile-time approach

```text
Source
  ↓
Compiler / Macro
  ↓
Generated Code
  ↓
Runtime
```

Advantages:

* potentially lower runtime overhead
* stronger compile-time guarantees
* compiler can catch more errors

This is one reason systems programming languages often approach framework design differently from reflection-heavy ecosystems.

---

# 27. Framework Magic Is Usually Just Hidden Control Flow

When a framework feels magical, try asking:

```text
Who created this object?

Who registered this route?

Who called this method?

Who converted this parameter?

Who serialized this response?

Who catches this exception?

Who owns this lifecycle?
```

There is almost always an answer.

The answer might be:

```text
Router
Container
Metadata Registry
Middleware Pipeline
Runtime
Generated Code
```

But there is an answer.

This is one of the most useful debugging techniques when working with frameworks.

---

# 28. Debugging Frameworks From the Inside Out

Suppose:

```http
GET /users/42
```

returns:

```http
404 Not Found
```

Instead of randomly changing controller code, reason through the pipeline.

### Question 1

Did the HTTP server receive the request?

```text
HTTP Runtime
```

### Question 2

Did the router match the route?

```text
GET /users/:id
```

### Question 3

Was the controller registered?

```text
UserController
```

### Question 4

Was the module loaded?

```text
UserModule
```

### Question 5

Was the dependency resolved?

```text
UserService
```

### Question 6

Did middleware reject the request?

```text
Auth
Validation
Guard
```

### Question 7

Did the controller execute?

This approach transforms framework debugging from guessing into tracing.

---

# 29. Framework Performance Is Mostly About the Pipeline

When someone says:

> "Framework X is slow."

the question should be:

> **Which part of the runtime pipeline is expensive?**

Possibilities include:

```text
Routing
Dependency resolution
Reflection
Serialization
Validation
Middleware
Request-scoped providers
Database access
Logging
Network I/O
```

The framework itself may not be the bottleneck.

For example:

```text
HTTP
 ↓
Framework: 1 ms
 ↓
Database: 120 ms
```

Optimizing the framework would accomplish almost nothing.

This is why performance engineering requires measurement rather than assumptions.

---

# 30. The Most Important Mental Model

When learning a framework, don't memorize only:

```text
@Controller()
@Get()
@Post()
@Inject()
@Module()
```

Instead ask:

```text
What does this declaration register?

When is it processed?

Where is the metadata stored?

Who reads it?

When is the object created?

Who invokes the method?

What happens before it?

What happens after it?
```

Once you can answer those questions, you stop being dependent on framework magic.

You start understanding the runtime.

---

# 31. Framework Abstractions Have a Cost

Every abstraction introduces some amount of machinery.

For example:

```text
Simple HTTP Handler
```

might look like:

```text
Request
 ↓
Function
 ↓
Response
```

while a full framework may provide:

```text
Request
 ↓
Router
 ↓
Middleware
 ↓
Context
 ↓
DI
 ↓
Guard
 ↓
Interceptor
 ↓
Pipe
 ↓
Controller
 ↓
Service
 ↓
Interceptor
 ↓
Serializer
 ↓
Response
```

The second architecture provides significantly more capabilities.

But it also has more moving parts.

This does not mean:

> "Frameworks are bad."

It means:

> **Abstractions have operational costs.**

Good engineering is understanding when those costs are worth paying.

---

# 32. When Should You Go Deeper?

If you are building ordinary CRUD APIs, you don't need to understand every internal data structure of your framework.

But deeper knowledge becomes extremely valuable when:

* debugging mysterious behavior,
* optimizing latency,
* designing custom middleware,
* writing framework plugins,
* handling dependency scope,
* diagnosing memory leaks,
* building high-throughput services,
* migrating between frameworks,
* evaluating architecture.

At that point, knowing only the public API is not enough.

---

# 33. The Framework Is Not the Application

This is perhaps the most important architectural boundary.

Your application contains:

```text
Business Rules
Domain Logic
Use Cases
Data Rules
```

The framework provides:

```text
HTTP
Lifecycle
Dependency Management
Routing
Serialization
Infrastructure
```

Conceptually:

```text
┌────────────────────────────────────┐
│           Application              │
│                                    │
│  Domain                            │
│  Use Cases                         │
│  Business Rules                    │
└──────────────────┬─────────────────┘
                   │
                   ▼
┌────────────────────────────────────┐
│             Framework              │
│                                    │
│ Routing                            │
│ DI                                 │
│ Middleware                         │
│ Serialization                      │
│ Lifecycle                          │
└────────────────────────────────────┘
```

The cleaner this boundary is, the easier the application becomes to evolve.

---

# 34. Final Mental Model

The next time you write:

```typescript
@Get('/users/:id')
```

don't think:

> "The framework handles the request."

Think:

```text
Decorator
   ↓
Metadata Registration
   ↓
Application Bootstrap
   ↓
Route Registration
   ↓
HTTP Request
   ↓
Route Matching
   ↓
Execution Pipeline
   ↓
Dependency Resolution
   ↓
Parameter Resolution
   ↓
Controller Invocation
   ↓
Application Logic
   ↓
Serialization
   ↓
HTTP Response
```

What looks like one line of code is actually the declaration of a much larger runtime process.

And that is one of the most important things to understand about frameworks:

> **A framework doesn't remove control flow. It moves control flow from your application code into a runtime that orchestrates your application for you.**

Once you understand that, framework internals stop looking like magic.

They become architecture.