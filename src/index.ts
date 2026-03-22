export type ClipTypeTarget = HTMLElement | Iterable<HTMLElement>;

export type ClipTypeOptions = {
  lineClassName?: string;
  lineInnerClassName?: string;
  wordClassName?: string;
};

export type ClipTypeInstance = {
  elements: HTMLElement[];
  readonly lines: HTMLElement[];
  readonly lineInners: HTMLElement[];
  split: () => void;
  revert: () => void;
  destroy: () => void;
};

function normalizeTargets(target: ClipTypeTarget): HTMLElement[] {
  if (target instanceof HTMLElement) {
    return [target];
  }

  return Array.from(target).filter(
    (node): node is HTMLElement => node instanceof HTMLElement,
  );
}

export function cliptype(
  target: ClipTypeTarget,
  options: ClipTypeOptions = {},
): ClipTypeInstance {
  const elements = normalizeTargets(target);
  const originalState = elements.map((element) => ({
    element,
    html: element.innerHTML,
    fontKerning: element.style.fontKerning,
  }));

  let lines: HTMLElement[] = [];
  let lineInners: HTMLElement[] = [];

  const revert = () => {
    originalState.forEach(({ element, html, fontKerning }) => {
      element.innerHTML = html;
      element.style.fontKerning = fontKerning;
    });

    lines = [];
    lineInners = [];
  };

  const split = () => {
    lines = [];
    lineInners = [];

    elements.forEach((element) => {
      const words = (element.textContent ?? "").trim().split(/\s+/).filter(Boolean);

      element.textContent = "";
      element.style.fontKerning = "none";

      if (words.length === 0) {
        return;
      }

      const measureFragment = document.createDocumentFragment();
      const wordSpans: HTMLSpanElement[] = [];

      words.forEach((word, wordIndex) => {
        const wordSpan = document.createElement("span");
        wordSpan.textContent = word;
        wordSpan.dataset.word = word;
        wordSpan.style.display = "inline-block";

        if (options.wordClassName) {
          wordSpan.className = options.wordClassName;
        }

        measureFragment.appendChild(wordSpan);
        wordSpans.push(wordSpan);

        if (wordIndex < words.length - 1) {
          measureFragment.appendChild(document.createTextNode(" "));
        }
      });

      element.appendChild(measureFragment);

      const groupedWords: HTMLSpanElement[][] = [];
      let previousTop: number | null = null;

      wordSpans.forEach((wordSpan) => {
        const currentTop = Math.round(wordSpan.offsetTop);

        if (
          previousTop === null ||
          Math.abs(currentTop - previousTop) > 2 ||
          groupedWords.length === 0
        ) {
          groupedWords.push([wordSpan]);
          previousTop = currentTop;
          return;
        }

        groupedWords[groupedWords.length - 1]?.push(wordSpan);
      });

      element.textContent = "";

      const lineFragment = document.createDocumentFragment();

      groupedWords.forEach((lineWords) => {
        const line = document.createElement("span");
        line.style.display = "block";
        line.style.overflow = "hidden";

        if (options.lineClassName) {
          line.className = options.lineClassName;
        }

        const lineInner = document.createElement("span");
        lineInner.style.display = "block";
        lineInner.textContent = lineWords
          .map((wordSpan) => wordSpan.dataset.word ?? "")
          .join(" ");

        if (options.lineInnerClassName) {
          lineInner.className = options.lineInnerClassName;
        }

        line.appendChild(lineInner);
        lineFragment.appendChild(line);
        lines.push(line);
        lineInners.push(lineInner);
      });

      element.appendChild(lineFragment);
    });
  };

  split();

  return {
    elements,
    get lines() {
      return lines;
    },
    get lineInners() {
      return lineInners;
    },
    split,
    revert,
    destroy: revert,
  };
}

export const splitLines = cliptype;

export default cliptype;
