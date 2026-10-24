import { Fragment } from 'react';

type TitleLinesProps = { lines: string[]; lineClassName?: string };

export function TitleLines(props: TitleLinesProps) {
  return (
    <>
      {props.lines.map((line, index) => (
        <Fragment key={`${index}-${line}`}>
          {index > 0 && <br />}
          {props.lineClassName ? (
            <span className={props.lineClassName}>{line}</span>
          ) : (
            line
          )}
        </Fragment>
      ))}
    </>
  );
}
