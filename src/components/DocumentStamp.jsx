import React from "react";

/*
  Supported backend values:

  ACCEPT
  ACCEPTED
  APPROVED

  REJECT
  REJECTED

  PENDING
*/

const DocumentStamp = ({ status }) => {
  const rawStatus = String(status || "PENDING")
    .trim()
    .toUpperCase();

  let normalizedStatus = "PENDING";

  if (
    rawStatus === "ACCEPT" ||
    rawStatus === "ACCEPTED" ||
    rawStatus === "APPROVED"
  ) {
    normalizedStatus = "ACCEPT";
  } else if (
    rawStatus === "REJECT" ||
    rawStatus === "REJECTED"
  ) {
    normalizedStatus = "REJECT";
  } else if (rawStatus === "PENDING") {
    normalizedStatus = "PENDING";
  }

  const stampConfig = {
    ACCEPT: {
      src: "/stamps/Accepted.png",
      label: "Accepted"
    },

    REJECT: {
      src: "/stamps/Rejected.webp",
      label: "Rejected"
    },

    PENDING: {
      src: "/stamps/Pending.webp",
      label: "Pending"
    }
  };

  const currentStamp = stampConfig[normalizedStatus];

  return (
    <div
      className="
        pointer-events-none
        absolute
        inset-0
        z-20
        flex
        items-center
        justify-center
        overflow-hidden
      "
    >
      <img
        src={currentStamp.src}
        alt={`${currentStamp.label} document`}
        className="
          w-44
          sm:w-52
          md:w-60
          max-w-[70%]
          object-contain
          opacity-90
          select-none
        "
        style={{
          transform: "rotate(-16deg)",
          mixBlendMode: "multiply"
        }}
        onError={(event) => {
          console.error(
            "Stamp image not found:",
            currentStamp.src
          );

          event.currentTarget.style.display = "none";
        }}
      />
    </div>
  );
};

export default DocumentStamp;