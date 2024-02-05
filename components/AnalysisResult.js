import AuthBox from "./authBox";
import styles from "@/styles/AnalysisResult.module.css";

const AnalysisResult = ({ result }) => {
  if (!result || Object.keys(result).length === 0) {
    return <p>No analysis result to display</p>;
  }

  return (
    <div className={`${styles.wrap}`}>
      <div className={`${styles.auth} flex`}>
        <AuthBox v="spf" status={result.spf} />
        <AuthBox v="dkim" status={result.dkim} />
        <AuthBox v="dmarc" status={result.dmarc} />
      </div>
      <p>Date: {result.date}</p>
      <p>To: {result.to}</p>
      <p>From: {result.from}</p>

      {result.links && (
        <>
          <h4>[Links]</h4>
          <ul>
            {result.links.map(
              (link, index) => link && <li key={index}>{link}</li>
            )}
          </ul>
        </>
      )}
      {result.receivedPaths && (
        <>
          <h4>[Received Paths]</h4>
          <ul>
            {result.receivedPaths.map(
              (path, index) => path && <li key={index}>{path.join(" -> ")}</li>
            )}
          </ul>
        </>
      )}
      {result.ipAddresses && (
        <>
          <h4>[IP ADDRESSES]</h4>
          <ul>
            {result.ipAddresses.map(
              (ip, index) => ip && <li key={index}>{ip}</li>
            )}
          </ul>
        </>
      )}
      {result.hostNames && (
        <>
          <h4>[HostNames]</h4>
          <ul>
            {result.hostNames.map(
              (hn, index) => hn && <li key={index}>{hn}</li>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default AnalysisResult;
