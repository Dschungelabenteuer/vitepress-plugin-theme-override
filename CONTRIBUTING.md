# Contributing

It looks like you're interested in contributing to vitepress-plugin-theme-override, thank you so
much! Whether you are a novice or experienced contributor, this guide should help you going through
the whole process of submitting contributions.

> **Note** If you're a novice contributor,
> [Github's How to Contribute to Open Source](https://opensource.guide/how-to-contribute/) might be
> a really valuable resource to get you started with the Open Source world's customs and philosophy.

If you've already read through this guide and still have questions on how to to contribute, feel
free to create a
[new discussion](https://github.com/Dschungelabenteuer/vitepress-plugin-theme-override/discussions).

## Setting up the environment

1. [Pre-requesites](#pre-requisites)
2. [Forking the repository](#forking-the-repository)
3. [Installing dependencies](#installing-dependencies)
4. [Start developing](#start-developing)
5. [Adding a changeset](#adding-a-changeset)
6. [Submitting a pull request](#submitting-a-pull-request)

---

## Pre-requisites

This project is written in TypeScript and uses [Node.js](https://nodejs.org/en/download) as a
JavaScript runtime and [pnpm](https://pnpm.io/fr/installation) as a package manager. Please make
sure those are installed and that their versions match the ones specified in the `engines` field of
the root `package.json` file.

You can check both versions by running the following commands in a terminal:

```bash
node -v
pnpm -v
```

This project also uses:

- [ESLint](https://eslint.org/docs/latest/use/getting-started) as a linter
- [Prettier](https://prettier.io/docs/en/index.html) as a formatter

It is recommended (but optional) to plug these tools into your IDE by using their respective
extensions. This should considerably improve your developer experience. If you're using Visual
Studio Code, you should be prompted to install any missing recommended extension when opening the
project's workspace.

## Forking the repository

To start contributing to the project, first
[fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the repository, then clone
your by running either of the following commands:

```bash
# Using HTTPS
git clone https://github.com/your-username/vitepress-plugin-theme-override.git

# Using SSH
git clone git@github.com:your-username/vitepress-plugin-theme-override.git
```

## Installing dependencies

Install the project's dependencies by running the following command within the project root
directory:

```bash
pnpm i
```

Once the dependencies are installed, pnpm may run postinstall scripts to setup the project.

## Start developing

Create a new branch for your contribution by running the following command:

```bash
git checkout -b my-branch-name
```

## Adding a changeset

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and
changelogs. If your contribution affects the codebase and requires bumping versions of any package,
you should add a changeset describing your changes by running the following command:

```bash
pnpm changeset
```

Please follow
[this guide](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md) if you
need help with generating a changeset.

> **Note** Some contributions (e.g. fixing a typo in a README) do not need changesets.

## Submitting a pull request

When you're ready to submit a pull request, you may follow these naming conventions:

- [Imperative Mood](https://en.wikipedia.org/wiki/Imperative_mood) for pull request titles (e.g.,
  `Add something`, `Fix something`).
- Past tense verbs for [changesets](#adding-a-changeset) (e.g., `Added something`,
  `Fixed something`).
