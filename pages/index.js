import { useState, useEffect } from "react";
import Image from "next/image";

import styles from "@/styles/Home.module.css";
import ResultBox from "@/components/resultBox";
import Contents from "@/components/contents";
import Map from "@/components/map";
import ReturnJson from "@/components/returnJson";
import AnalysisResult from "@/components/AnalysisResult";

export default function Home() {
  const connect = "http://218.38.27.216:3000";

  // ****** 외부 API 연동
  const [ipInfo, setIpInfo] = useState([]);
  const [hostNameInfo, setHostNameInfo] = useState([]);
  const [vtIpRelInfo, setVtIpRelInfo] = useState([]);
  const [vtDomainRelInfo, setVtDomainRelInfo] = useState([]);
  const [vtUrlRelInfo, setVtUrlRelInfo] = useState([]);
  const [GPTResult, setGPTResult] = useState("");

  const [ipAddr, setIpAddr] = useState([]);
  const [hostName, setHostName] = useState([]);

  const [paths, setPaths] = useState([]);

  // 이메일 내용 세팅 및 결과 리턴
  const [emailData, setEmailData] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [extractedEmailBody, setExtractedEmailBody] = useState([]);
  const [bodyUrls, setBodyUrls] = useState([]);

  const [isLoadingGPTResult, setIsLoadingGPTResult] = useState(false);

  useEffect(() => {
    // IP 정보 GET API (/api/ip2loc_ip)
    ipAddr.forEach((ip) => {
      fetch(`${connect}/api/ip2loc_ip?ip=${ip}`)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error && !result.error_code) {
            setIpInfo((prevIpInfo) => [...prevIpInfo, { ip, data: result }]);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [ipAddr]);

  useEffect(() => {
    // 도메인 정보 GET API (/api/ip2loc_domain)
    hostName.forEach((hn) => {
      fetch(`${connect}/api/ip2loc_domain?domain=${hn}`)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error && !result.error_code) {
            setHostNameInfo((prevHostNameInfo) => [
              ...prevHostNameInfo,
              { hn, data: result },
            ]);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [hostName]);

  useEffect(() => {
    // ipInfo 값에서 위치 정보 획득 후 지도 매핑
    const newPaths = ipInfo.map((info) => ({
      lat: info.data.latitude,
      lng: info.data.longitude,
    }));
    setPaths(newPaths);
  }, [ipInfo]);

  useEffect(() => {
    // VirusTotal IP 정보 GET API (/api/vt_ip)
    ipAddr.forEach((ip) => {
      fetch(`${connect}/api/vt_ip?ip=${ip}`)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error && !result.error_code) {
            setVtIpRelInfo((prevVtIpRelInfo) => [
              ...prevVtIpRelInfo,
              { ip, data: result },
            ]);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [ipAddr]); // ipAddr 변경 시에만 실행

  useEffect(() => {
    // VirusTotal Domain 정보 GET API (/api/vt_domain)
    hostName.forEach((hn) => {
      fetch(`${connect}/api/vt_domain?domain=${hn}`)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error && !result.error_code) {
            setVtDomainRelInfo((prevVtUrlRelInfo) => [
              ...prevVtUrlRelInfo,
              { hn, data: result },
            ]);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [hostName]); // 도메인 변경 시에만 실행

  useEffect(() => {
    // VirusTotal URL 정보 POST API (/api/vt_url)
    bodyUrls.forEach((url) => {
      fetch(`${connect}/api/vt_url?url=${url}`)
        .then((response) => response.json())
        .then((result) => {
          if (!result.error && !result.error_code) {
            setVtUrlRelInfo((prevVtDomainRelInfo) => [
              ...prevVtDomainRelInfo,
              { url, data: result },
            ]);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [bodyUrls]);

  useEffect(() => {
    (async () => {
      if (extractedEmailBody && !GPTResult) {
        setIsLoadingGPTResult(true); // Start loading
        try {
          const res = await fetch(`${connect}/api/gpt4`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: extractedEmailBody }),
          });

          const data = await res.json();

          if (data.choices && data.choices.length > 0) {
            const res_content = data.choices[0].message.content;
            setGPTResult(res_content);
          }
        } catch (error) {
          console.error("ChatGPT API request failed:", error);
        } finally {
          setIsLoadingGPTResult(false); // End loading
        }
      }
    })();
  }, [extractedEmailBody]);

  /////////////////////////////////////////////////////

  // 이메일 값이 변경 될 경우, 데이터 처리
  const handleEmailDataChange = (e) => {
    setEmailData(e.target.value);
  };

  // 이메일 파싱 API 구현 및 연동
  const analyzeEmailHeader = () => {
    console.log("분석 시작");

    // 상태 초기화
    setIpInfo([]);
    setHostNameInfo([]);
    setVtIpRelInfo([]);
    setVtDomainRelInfo([]);
    setVtUrlRelInfo([]);
    setIpAddr([]);
    setHostName([]);
    setAnalysisResult("");
    setExtractedEmailBody("");
    setEmailData("");
    setBodyUrls([]);
    setGPTResult("");

    // 이메일 헤더 파싱 API
    fetch(`${connect}/api/analyzeEmailHeader`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("분석 결과:", data);
        setAnalysisResult(data);
        setIpAddr(data.ipAddresses || []);
        setHostName(data.hostNames || []);
      })
      .catch((error) => {
        console.error("분석 중 에러 발생:", error);
        setAnalysisResult("분석 중 에러 발생");
      });

    // 이메일 본문 파싱 API
    fetch(`${connect}/api/analyzeEmailBody`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rawEmailData: emailData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Extracted email body:", data);
        setExtractedEmailBody(data.body);
        setBodyUrls(data.links);
      })
      .catch((error) => {
        console.error("Error extracting email body:", error);
      });
  };

  /////////////////////////////////////////////////////
  return (
    <div className={`wrap flex`}>
      <div className={`${styles.inputWrap} flex`}>
        <div className={`${styles.titleWrap} flex`}>
          <div className={`${styles.logoWrap} flex`}>
            <div className={`${styles.imageBox} flex`} />
          </div>
        </div>
        <div className={`${styles.inputMailWrap} flex`}>
          <textarea value={emailData} onChange={handleEmailDataChange} />
        </div>
        <div className={`${styles.submitBtnWrap} flex`}>
          <button
            onClick={analyzeEmailHeader}
            disabled={!emailData.trim().length}
          >
            ANALYSIS
          </button>
        </div>
      </div>
      <div className={`${styles.outputWrap} flex`}>
        <div className={`${styles.outputBoxWrap} flex`}>
          <Contents header={"IP MAP"} contents={<Map paths={paths} />} />
          <Contents
            header={"AUTHENTICATION"}
            contents={<AnalysisResult result={analysisResult} />}
          />
          {ipInfo.map(
            (info, index) =>
              info.data && (
                <Contents
                  key={index}
                  header={`IP2LOC - IP`}
                  sub={`${info.ip}`}
                  contents={<ReturnJson data={info.data} />}
                />
              )
          )}
          {hostNameInfo.map(
            (info, index) =>
              info.data && (
                <Contents
                  key={index}
                  header={`IP2LOC - DOMAIN`}
                  sub={`${info.hn}`}
                  contents={<ReturnJson data={info.data} />}
                />
              )
          )}
          {vtIpRelInfo.map(
            (info, index) =>
              info.data && (
                <Contents
                  key={index}
                  header={`VirusTotal - IP`}
                  sub={`${info.ip}`}
                  contents={<ReturnJson data={info.data} />}
                />
              )
          )}
          {vtDomainRelInfo.map(
            (info, index) =>
              info.data && (
                <Contents
                  key={index}
                  header={`VirusTotal - Domain`}
                  sub={`${info.hn}`}
                  contents={<ReturnJson data={info.data} />}
                />
              )
          )}
          {vtUrlRelInfo.map(
            (info, index) =>
              info.data && (
                <Contents
                  key={index}
                  header={`VirusTotal - URL`}
                  sub={`${info.url}`}
                  contents={<ReturnJson data={info.data} />}
                />
              )
          )}
          {extractedEmailBody && (
            <Contents header={"Body Analysis"} contents={extractedEmailBody} />
          )}
          {isLoadingGPTResult ? (
            <div className={`${styles.loadingIcon}`}>Loading...</div>
          ) : (
            GPTResult && (
              <Contents header={"Text Analysis - GPT4"} contents={GPTResult} />
            )
          )}
        </div>
      </div>
    </div>
  );
}
