import React from "react";
import styles from "@/styles/ResultBox.module.css";

const ResultBox = ({ v, status }) => {
  let borderColor, backgroundColor, textColor, result;

  switch (v) {
    case "header":
    default:
      result = "헤더 분석";
      break;
    case "contents":
      result = "본문 분석";
      break;
  }

  switch (status) {
    case "pass":
      borderColor = backgroundColor = textColor = "rgba(3, 199, 90, 0.8)";
      break;
    case "fail":
      borderColor = backgroundColor = textColor = "rgba(255, 59, 48, 0.8)";
      break;
    case "none":
    default:
      borderColor = backgroundColor = textColor = "rgba(124, 124, 124, 0.8)";
      break;
  }

  return (
    <div className={`${styles.wrap} flex`} style={{ borderColor }}>
      <div className={`${styles.top} flex`} style={{ borderColor }}>
        <p style={{ color: textColor }}>{status.toUpperCase()}</p>
      </div>
      <div className={`${styles.bottom} flex`} style={{ backgroundColor }}>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default ResultBox;
