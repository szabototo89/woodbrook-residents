import { Fragment } from 'react';

export function TitleLines(props: { lines: string[] }) {
  return (
    <>
      {props.lines.map((line, index) => (
        <Fragment key={`${index}-${line}`}>
          {index > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </>
  );
}
