import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type UiSelectOption = {
  value: string;
  label?: string;
  disabled?: boolean;
};

type UiSelectProps = {
  value: string;
  options: readonly (string | UiSelectOption)[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
};

export function UiSelect({ value, options, onChange, ariaLabel, className = "" }: UiSelectProps) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const normalized = options.map((option) => typeof option === "string" ? { value: option, label: option, disabled: false } : { label: option.label || option.value, disabled: false, ...option });
  const selectedIndex = Math.max(0, normalized.findIndex((option) => option.value === value));
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  const nextEnabled = (start: number, direction: 1 | -1) => {
    let next = start;
    for (let step = 0; step < normalized.length; step += 1) {
      next = (next + direction + normalized.length) % normalized.length;
      if (!normalized[next]?.disabled) return next;
    }
    return start;
  };

  const openMenu = (direction: 1 | -1 = 1) => {
    const next = normalized[selectedIndex]?.disabled ? nextEnabled(selectedIndex, direction) : selectedIndex;
    setActiveIndex(next);
    setOpen(true);
  };

  const closeMenu = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const choose = (index: number) => {
    const option = normalized[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setActiveIndex(index);
    closeMenu(true);
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeMenu();
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    window.requestAnimationFrame(() => {
      const buttons = rootRef.current?.querySelectorAll<HTMLButtonElement>(".ui-select-option");
      buttons?.[activeIndex]?.focus();
    });
  }, [open, activeIndex]);

  return <div className={`ui-select ${open ? "open" : ""} ${className}`.trim()} ref={rootRef}>
    <button
      ref={triggerRef}
      type="button"
      className="ui-select-trigger"
      aria-label={ariaLabel}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={`${id}-options`}
      onClick={() => open ? closeMenu() : openMenu()}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          openMenu(event.key === "ArrowDown" ? 1 : -1);
        }
      }}
    >
      <span>{normalized[selectedIndex]?.label || value}</span>
      <ChevronDown />
    </button>
    {open && <div
      id={`${id}-options`}
      className="ui-select-options"
      role="listbox"
      aria-label={ariaLabel}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          setActiveIndex((current) => nextEnabled(current, event.key === "ArrowDown" ? 1 : -1));
        } else if (event.key === "Home" || event.key === "End") {
          event.preventDefault();
          const edge = event.key === "Home" ? -1 : 0;
          setActiveIndex(nextEnabled(edge, event.key === "Home" ? 1 : -1));
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose(activeIndex);
        } else if (event.key === "Escape") {
          event.preventDefault();
          closeMenu(true);
        } else if (event.key === "Tab") {
          closeMenu();
        }
      }}
    >
      {normalized.map((option, index) => <button
        type="button"
        id={`${id}-option-${index}`}
        className={`ui-select-option ${index === selectedIndex ? "selected" : ""}`}
        role="option"
        aria-selected={index === selectedIndex}
        disabled={option.disabled}
        tabIndex={index === activeIndex ? 0 : -1}
        onMouseEnter={() => !option.disabled && setActiveIndex(index)}
        onClick={() => choose(index)}
        key={option.value}
      >
        <span>{option.label}</span>
        {index === selectedIndex && <Check />}
      </button>)}
    </div>}
  </div>;
}
