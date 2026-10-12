import { Search, X } from 'lucide-react';
import { useId, type Ref } from 'react';

export function SearchField(props: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  inputRef?: Ref<HTMLInputElement>;
  submitButton?: boolean;
  onClear?: () => void;
}) {
  const id = useId();
  return (
    <div className="directory-search">
      <label htmlFor={id}>{props.label}</label>
      <div className="directory-search-field">
        {props.submitButton ? (
          <button
            className="search-field-button"
            type="submit"
            aria-label="Submit search"
          >
            <Search size={19} aria-hidden="true" />
          </button>
        ) : (
          <Search size={19} aria-hidden="true" />
        )}
        <input
          id={id}
          ref={props.inputRef}
          className={props.onClear ? 'search-input-custom-clear' : undefined}
          type="search"
          placeholder={props.placeholder}
          value={props.value}
          maxLength={120}
          onChange={(event) => props.onChange(event.target.value)}
        />
        {props.onClear && props.value ? (
          <button
            className="search-field-button"
            type="button"
            aria-label="Clear search"
            onClick={props.onClear}
          >
            <X size={19} aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
