import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import styles from "@/styles/Scanner.module.css";
import wellKnownPorts from "@/public/data/wellKnownPorts";

export default function Scanner({ initialIps }) {
  // const [ip, setIp] = useState(["8.8.8.8", "223.130.195.200"]);
  const [ip, setIp] = useState(initialIps);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("ws://127.0.0.1:5001");
    socketRef.current = socket;

    socket.on("scanProgress", (data) => {
      setResults((prevResults) => ({
        ...prevResults,
        [data.ip]: {
          ...prevResults[data.ip],
          scanProgress: `Scanning ${data.ip} port ${data.port}...`,
        },
      }));
    });

    socket.on("scanCompleted", (ip) => {
      setResults((prevResults) => ({
        ...prevResults,
        [ip]: {
          ...prevResults[ip],
          scanProgress: "Scan completed",
        },
      }));
    });

    socket.on("scanResult", (data) => {
      setResults((prevResults) => ({
        ...prevResults,
        [data.ip]: {
          ...prevResults[data.ip],
          scanResults: [
            ...(prevResults[data.ip]?.scanResults || []),
            {
              port: data.port,
              banner: data.banner || "No banner available",
            },
          ],
        },
      }));
    });

    socket.on("connect", () => console.log("Socket Connected"));
    socket.on("disconnect", () => console.log("Socket Disconnected"));

    return () => {
      socket.close();
    };
  }, []);

  const handleScan = () => {
    if (socketRef.current && socketRef.current.connected) {
      setIsLoading(true);

      ip.forEach((ip) => {
        socketRef.current.emit("startScan", { target_ip: ip });
      });
    } else {
      console.error("Socket is not connected.");
    }
  };

  const parseBanner = (port, banner) => {
    console.log("parseBanner", port, banner);
    if (wellKnownPorts[port]) {
      return wellKnownPorts[port];
    }
    return banner || "NULL";
  };

  return (
    <div className={`${styles.wrap}`}>
      <h1 className={`${styles.title}`}>SHARKS SCANNER</h1>
      <div className={styles.target}>
        <p className={styles.targetTitle}>Target_IP</p>
        {initialIps.map((ip) => (
          <p key={ip}>+ {ip}</p>
        ))}
      </div>
      {!isLoading && (
        <div className={`${styles.inputWrap}`}>
          <button onClick={handleScan}>START</button>
        </div>
      )}
      <div className={styles.results}>
        {Object.entries(results).map(([ip, data]) => (
          <div key={ip} className={styles.returnResult}>
            <h3>{ip}</h3>
            <p className={styles.progress}>{data.scanProgress}</p>
            {data.scanResults?.map((result, index) => (
              <div key={index} className={styles.itemWrap}>
                <div className={styles.out}>
                  <strong>PORT: {result.port}</strong>
                  <p>{parseBanner(result.port, result.banner)}</p>
                  <p>{result.banner}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
