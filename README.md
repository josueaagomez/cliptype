# cliptype

Lightweight text line splitting for clip-and-reveal animations.

`cliptype` is the narrow utility we actually use in site builds:
- split plain text into real rendered lines
- wrap each line so it can animate independently
- revert back to the original HTML when needed

No external animation library. No extra CSS required.

## What It Solves

When text wraps naturally in the browser, there is no built-in line API.

`cliptype` solves that by:
1. splitting text into words
2. measuring each word's `offsetTop`
3. grouping words that share the same top position
4. rebuilding the element as line wrappers you can animate

## Usage

```ts
import cliptype from "./src/index";

const heading = document.querySelector("[data-clip]") as HTMLElement;
const split = cliptype(heading);

split.lineInners.forEach((line, index) => {
  line.style.willChange = "transform";
  line.style.transitionProperty = "transform";
  line.style.transitionTimingFunction = "cubic-bezier(0.22,1,0.36,1)";
  line.style.transitionDuration = "360ms";
  line.style.transitionDelay = `${index * 90}ms`;
  line.style.transform = "translateY(100%)";
});

requestAnimationFrame(() => {
  split.lineInners.forEach((line) => {
    line.style.transform = "translateY(0%)";
  });
});
```

## API

```ts
cliptype(target, options?)
```

### `target`

One of:
- a single `HTMLElement`
- an iterable of `HTMLElement`s

### `options`

```ts
{
  lineClassName?: string;
  lineInnerClassName?: string;
  wordClassName?: string;
}
```

### return value

```ts
{
  elements: HTMLElement[];
  lines: HTMLElement[];
  lineInners: HTMLElement[];
  split(): void;
  revert(): void;
  destroy(): void;
}
```

## Install Into A Project

Fastest path is to copy the source file into your project:

```bash
curl -L https://raw.githubusercontent.com/josueaagomez/cliptype/main/src/index.ts -o ./cliptype.ts
```

Or clone the repo and import the file directly.

## Notes

- Best for plain text blocks
- Designed for line-based reveal animations
- If your target is inside a flex layout, give it a stable width before splitting
