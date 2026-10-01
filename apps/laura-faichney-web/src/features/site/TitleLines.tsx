import { Fragment } from 'react';

export function TitleLines(props: { lines: string[]; lineClassName?: string }) {
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
