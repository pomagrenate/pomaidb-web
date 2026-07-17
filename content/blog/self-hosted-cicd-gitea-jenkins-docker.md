---
title: "Taking Back Control: Why I Built a Self-Hosted CI/CD Pipeline for My Microservices"
slug: "self-hosted-cicd-gitea-jenkins-docker"
date: "2026-07-24"
author: "Quan Van"
excerpt: "Moving to microservices solved my scaling issues, but it created a deployment nightmare. Here is why I bypassed cloud CI/CD solutions to build a fully on-premise pipeline using Gitea, Jenkins, and Portainer."
tags: ["DevOps", "CI/CD", "Jenkins", "Gitea", "Docker", "Portainer", "Data Sovereignty"]
category: "Platform Engineering"
---

# Taking Back Control: Why I Built a Self-Hosted CI/CD Pipeline for My Microservices

There is a running joke in software engineering that the most terrifying moment of the week is Friday afternoon deployment. In the early days of the Pomai Ecosystem, I lived that reality. 

When the project was a simple monolith, deploying meant manually transferring files and restarting a server. But as the architecture evolved into a distributed network of microservices, manual deployment became a liability. I quickly fell victim to the dreaded "it works on my machine" syndrome, wasting hours debugging configuration mismatches between my local laptop and the production server.

I knew I needed automation, but I also wanted absolute control. This is the story of how I built a zero-downtime, fully self-hosted CI/CD pipeline from scratch.

## Step 1: The Docker Awakening and the Portainer Dashboard

The first hurdle was environment parity. I needed absolute certainty that a service running on my local machine would run identically in production. I embraced a **Docker-first strategy**, containerizing every single service—Product, Auth, Chat, and the AI Engine. This completely eliminated dependency conflicts and provided strict resource isolation, preventing a heavy AI process from starving the core business logic of CPU and memory.

However, managing dozens of containers via the command line interface (CLI) quickly became error-prone and lacked visibility. To solve this, I introduced **Portainer** into the stack. 

Portainer transformed my infrastructure management. It provided a visual GUI to monitor real-time container status, networks, and volumes. Instead of writing complex `docker-compose` commands to manage lifecycles, I could now redeploy stacks and manage environment variables with just a few clicks. Furthermore, it allowed me to practice "least privilege" access control by managing user access directly within the container host.

## Step 2: The CI/CD Dilemma (Why not GitHub Actions?)

With containerization solved, I needed a way to automate the delivery. The industry standard is usually GitHub Actions or GitLab CI. They are powerful, easy to set up, and free for most personal projects. 

So why didn't I use them? **Data Sovereignty and Autonomy**.

I wanted my source code and deployment pipelines to remain entirely within my own infrastructure. I wanted zero reliance on third-party cloud outages, and I wanted the intellectual property (IP) of the Pomai Ecosystem to never leave my local server. 

This constraint forced me to look for on-premise alternatives.

## Step 3: Architecting the "On-Premise" Engine with Gitea and Jenkins

To achieve total autonomy, I built my automation engine using two incredibly powerful open-source tools:

### 1. Gitea: The Lightweight Source of Truth
I deployed **Gitea** as my local Git repository manager. It provides a familiar, GitHub-like experience but operates with a remarkably tiny memory footprint. 
* **High Speed:** Because Gitea runs locally on my infrastructure, push and pull speeds are nearly instantaneous, completely unaffected by external internet bandwidth.
* **Seamless Webhooks:** It integrates flawlessly with my automation server, instantly firing webhooks the exact second I push a new commit.

### 2. Jenkins: The Automation Orchestrator
To move code from a commit to a live environment without human intervention, I integrated **Jenkins**. 
* **Pipeline as Code:** I defined every step (build, test, deploy) inside a `Jenkinsfile`, ensuring the deployment logic is version-controlled right alongside the application code.
* **Automated Quality Gates:** Every code push triggers a Jenkins build that runs tests and compiles the Docker images. If any test fails, Jenkins instantly aborts the deployment and sends an alert, preventing broken code from reaching production.

## The Magic of the Automated Workflow

Today, deploying a new feature to the Pomai Ecosystem looks like this:

1. I push the code to my self-hosted **Gitea** repository.
2. Gitea immediately sends a webhook signal to **Jenkins**.
3. Jenkins pulls the latest code, executes the test scripts, and compiles a fresh **Docker Image**.
4. Acting as a bridge between the code and the server, Jenkins uses the Docker socket to spin up the new container version and gracefully shut down the old one, achieving a zero-downtime deployment.

## Conclusion: The Peace of Mind

By combining Docker, Portainer, Gitea, and Jenkins, I transformed my deployment process from a fragile, manual nightmare into a predictable, "Single-Click" operation. 

I no longer spend Friday afternoons configuring servers or panicking over broken dependencies. I spend my time writing code, knowing that my infrastructure will test, build, and deploy it flawlessly in seconds. 

Building a self-hosted CI/CD pipeline wasn't just about saving cloud costs; it was about mastering the entire lifecycle of software engineering. It taught me that writing code is only half the battle—knowing how to ship it securely and autonomously is what makes a platform truly robust.

---
*Want to see the `Jenkinsfile` configs or the `docker-compose` setups that power this pipeline? Check out the infrastructure code in the [Pomai Ecosystem GitHub repository](https://github.com/your-repo-link).*