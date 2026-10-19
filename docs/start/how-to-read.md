---
title: How to Read These Docs
description: What the badges mean, what the At a Glance table answers, where the facts come from, and which release this site covers.
sidebar_position: 1
---

This site explains Claude Code in plain words.
Each page tells you what you can use, what you can change, and how to switch it on or off.
This page shows you how to read the marks and tables on those pages.

:::note[Unofficial Site]
This is a community project. It is not made by or tied to Anthropic.
Official docs are the first place to check for supported behavior.
:::

## Badges

A badge is a small colored label in the `Status` column of a table.
Hover over a badge to see what it means.

| Badge | What it means |
| --- | --- |
| <Documented /> | An official docs page names this item. |
| <Undocumented /> | Only the program shows this item. It can change without notice. |
| <Differs /> | The official docs and the program disagree. The row says how. |
| <Gated note="Example: a flag name" /> | It works only behind a flag or a server gate. The row says which one. |

An item can carry more than one badge.
For example, an item can be <Undocumented /> and <Gated /> at the same time.

:::warning
Treat <Undocumented /> items with care.
They work today, but nobody promises they will work in the next release.
:::

## Marks in Tables

A table cell that answers a question uses one of three marks.

| Mark | What it means |
| --- | --- |
| ✅ | Yes. |
| ❌ | No. |
| ❓ | Unknown. Neither the official docs nor the program say. |

Text can follow a mark, such as "✅ Yes. Type `/` to see the list."
A star after a mark, such as ✅\*, points to a note under the table that starts with the same star.
The marks never replace the words in a heading or a link.

## Markers Before a Name

Four more marks can stand before an item name in a table cell, or at the start of a note.
Each has one meaning. A mark adds a fact that the badges above do not carry. It never replaces a badge.

| Mark | What it means |
| --- | --- |
| 🔒 | Managed only. The setting works only in managed (organization policy) settings. The source is the `x-managed-only` flag in the managed settings schema. |
| 🧪 | Experimental. The program or the official docs call it experimental or beta. |
| ⛔ | Deprecated. The row names what replaces it. |
| ⚠️ | Caution. It has a side effect to notice: it deletes data, skips a safety check or permission, or sends data off your machine. |

A screen reader reads the picture name, such as "locked" or "warning". The row text always says the same thing in words, so nothing depends on the picture.

## At a Glance

Every page about a surface starts with a short intro and then an At a Glance table.
The table answers five questions.

| Question | What the answer tells you |
| --- | --- |
| Can you use it? | ✅ Yes, ❌ No, or Partly, and how to start. |
| Can you change it? | Where and how you change it. |
| Can you turn it on or off? | The switch: a setting, an environment variable, or a flag. |
| Where does it live? | The file paths or scopes that hold it. |
| Status | The badges for the surface. |

Below that, tables list single items.
They use columns such as `Item`, `Status`, `What it does`, `Default`, and `Where to set it`.

## Only Usable Items Are Listed

The site lists only things you can use, change, or switch.
It leaves out items that are removed, do nothing, exist only for tests, or are for Anthropic staff.
If an item is not here, you should not rely on it.

## Where Facts Come From

Every fact has a source.

- Official docs: the page links to the official page by its title.
- The program: the page says "Source: the program" and names the string, key, or type in inline code.
- Probes: some facts come from running the program against a local stub. No model call leaves the machine.

If a fact is not checked, the page puts it in a "Not Verified" box or leaves it out.

## One Release Only

This site tracks only the newest release.
The current release is shown in the top bar, for example "Tracks 2.1.303".
There are no old versions of the docs.
The [What Changed](what-changed.md) page lists breaking changes.

## How the Text Is Written

The text uses Simple English: common words, short sentences, and one idea at a time.
Every code item, such as a command, a path, a key, or an environment variable, is in `inline code`.
To help, read the [Style Guide](../contributing/style-guide.md).
