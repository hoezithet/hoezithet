import React, { useEffect, useRef } from "react";

const Comments = () => {
  const giscusRef = useRef(null);

  useEffect(() => {
    if (!giscusRef.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", "hoezithet/hoezithet");
    script.setAttribute("data-repo-id", "MDEwOlJlcG9zaXRvcnkyNjIxMjQ1NTg=");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOD5-0Ds4CtLRA");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "bottom");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "nl");
    script.crossOrigin = "anonymous";
    script.async = true;

    giscusRef.current.appendChild(script);
  }, []);

    return (
        <>
            <h2 id="comments">Vragen en reacties</h2>
            <div ref={giscusRef}></div>
        </>
    );
};

export default Comments;
