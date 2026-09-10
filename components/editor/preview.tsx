import type { ComponentProps } from "react";
import { Code } from "bright";
import { compileMDX } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

const components = {
  pre: (props: ComponentProps<typeof Code>) => (
    <Code {...props} lineNumbers className="shadow-light-200 dark:shadow-dark-200" />
  ),
};

const Preview = async ({ content }: { content: string }) => {
  const contentFormat = (content || "").replace(/&#x20;/g, " ");

  let compiled: React.ReactNode = null;
  let hasError = false;

  try {
    const { content: compiledContent } = await compileMDX({
      source: contentFormat,
      options: {
        mdxOptions: {
          format: "md",
        },
      },
      components,
    });

    compiled = compiledContent;
  } catch {
    hasError = true;
  }

  if (hasError) {
    return <section className="markdown prose grid wrap-break-word whitespace-pre-wrap">{contentFormat}</section>;
  }

  return <section className="markdown prose grid wrap-break-word">{compiled}</section>;
};

export default Preview;
