import { useEffect, useRef } from "react";

export function useReveal(dependency = []) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current || document;
    const els = root.querySelectorAll(".reveal");
    
    // Immediately mark visible if IntersectionObserver isn't present or on initial load
    els.forEach((el) => el.classList.add("in-view"));
  }, dependency);

  return rootRef;
}
