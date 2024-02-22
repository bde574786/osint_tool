import { useState, useEffect } from "react";
import styles from "@/styles/Home.module.css";
import ResultBox from "@/components/resultBox";
import Contents from "@/components/contents";
import Map from "@/components/map";
import ReturnJson from "@/components/returnJson";
import AnalysisResult from "@/components/AnalysisResult";
import BodyAnalysisResult from "@/components/bodyAnalysisResult";
import Scanner from "@/components/Scanner";

export default function Home() {
  // const connect = "http://218.38.27.216:3000";
  const connect = "";

  // ****** 외부 API 연동
  const [ipInfo, setIpInfo] = useState([]);
  const [hostNameInfo, setHostNameInfo] = useState([]);
  const [vtIpRelInfo, setVtIpRelInfo] = useState([]);
  const [vtDomainRelInfo, setVtDomainRelInfo] = useState([]);
  const [vtUrlRelInfo, setVtUrlRelInfo] = useState([]);
  const [GPTResult, setGPTResult] = useState([]);

  const [ipAddr, setIpAddr] = useState([]);
  const [hostName, setHostName] = useState([]);
  const [paths, setPaths] = useState([]);

  // 이메일 내용 세팅 및 결과 리턴
  const [emailData, setEmailData] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [bodyAnalysisResult, setbodyAnalysisResult] = useState("");
  const [extractedEmailBody, setExtractedEmailBody] = useState([]);
  const [bodyUrls, setBodyUrls] = useState([]);

  const [isLoadingGPTResult, setIsLoadingGPTResult] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState("none");
  const [bodyDetectionStatus, setBodyDetectionStatus] = useState("none");
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // 탭 상태 추가
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
            setVtDomainRelInfo((prevVtDomainRelInfo) => [
              ...prevVtDomainRelInfo,
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
            setVtUrlRelInfo((prevVtUrlRelInfo) => [
              ...prevVtUrlRelInfo,
              { url, data: result },
            ]);
          }
        })
        .catch((error) => console.error(error));
    });
  }, [bodyUrls]);

  useEffect(() => {
    const fetchGPTResult = async () => {
      if (extractedEmailBody) {
        // `extractedEmailBody`가 있을 때만 API 호출
        setIsLoadingGPTResult(true); // 로딩 시작
        try {
          const response = await fetch(`${connect}/api/gpt4Risk`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: extractedEmailBody }),
          });
          const data = await response.json();

          setGPTResult(data); // 결과 설정
          console.log(GPTResult);
        } catch (error) {
          console.error("ChatGPT API request failed:", error);
        } finally {
          setIsLoadingGPTResult(false); // 로딩 종료
        }
      }
    };

    fetchGPTResult(); // API 호출 함수 실행
  }, [extractedEmailBody]);

  useEffect(() => {
    const allInfo = [...vtIpRelInfo, ...vtDomainRelInfo];
    if (analysisStarted) {
      const detected = allInfo.some((info) => info.data && info.data.detected);
      setDetectionStatus(detected ? "detected" : "pass");
    }
  }, [vtIpRelInfo, vtDomainRelInfo, analysisStarted]);

  useEffect(() => {
    if (analysisStarted) {
      const detected = vtUrlRelInfo.some(
        (info) => info.data && info.data.detected
      );
      setBodyDetectionStatus(detected ? "detected" : "pass");
    }
  }, [vtUrlRelInfo, analysisStarted]);

  useEffect(() => {
    console.log(GPTResult); // 상태가 업데이트될 때마다 실행됩니다.
  }, [GPTResult]);

  const renderGPTResultAsList = (gptResult) => {
    const reasonsPart = gptResult.spamAnalysis.split("이유:");
    const items = reasonsPart[1].split(/\d+\./).slice(1);

    console.log(reasonsPart);
    console.log(items);

    return (
      <ul>
        <li>{reasonsPart[0]}</li>
        <li>{gptResult.labelAnalysis}</li>
        <br />
        {items.map((item, index) => (
          <li key={index}>- {item.trim()}</li>
        ))}
      </ul>
    );
  };

  /////////////////////////////////////////////////////

  // 이메일 값이 변경 될 경우, 데이터 처리
  const handleEmailDataChange = (e) => {
    setEmailData(e.target.value);
  };

  // 이메일 파싱 API 구현 및 연동
  const analyzeEmailHeader = async () => {
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
    setbodyAnalysisResult("");
    setExtractedEmailBody("");
    setEmailData("");
    setBodyUrls([]);
    setGPTResult([]);

    setDetectionStatus("none");
    setBodyDetectionStatus("none");

    setAnalysisStarted(true);

    try {
      // 이메일 헤더 파싱 API
      const headerResponse = await fetch(`${connect}/api/analyzeEmailHeader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailData }),
      });
      const headerData = await headerResponse.json();

      console.log("분석 결과:", headerData);
      setAnalysisResult(headerData);
      setIpAddr(headerData.ipAddresses || []);
      setHostName(headerData.hostNames || []);
      setIsAnalysisComplete(true);

      // 이메일 본문 파싱 API 호출
      const bodyResponse = await fetch(`${connect}/api/analyzeEmailBody`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawEmailData: emailData }),
      });
      const bodyData = await bodyResponse.json();

      console.log("Extracted email body:", bodyData);
      setbodyAnalysisResult(bodyData);
      setExtractedEmailBody(bodyData.body);
      setBodyUrls(bodyData.links);
    } catch (error) {
      console.error("분석 중 에러 발생:", error);
      setAnalysisResult("분석 중 에러 발생");
    }
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
          <textarea
            placeholder="'메일 -> 더보기 -> 원문 보기' 메일 데이터 복사 붙여넣기"
            value={emailData}
            onChange={handleEmailDataChange}
          />
        </div>
        <div className={`${styles.submitBtnWrap} flex`}>
          <button
            onClick={analyzeEmailHeader}
            disabled={!emailData.trim().length}
          >
            ANALYZE
          </button>
        </div>
      </div>
      <div className={`${styles.outputWrap} flex`}>
        <div className={`${styles.tabWrap} flex`}>
          <button onClick={() => handleTabChange("info")}>Information</button>
          {isAnalysisComplete && (
            <button onClick={() => handleTabChange("scanner")}>Scanner</button>
          )}
        </div>
        {activeTab === "info" && (
          <div className={`${styles.outputBoxWrap} flex`}>
            <Contents
              header={"SUMMARY"}
              contents={
                <div className={`${styles.resultArea} flex`}>
                  <ResultBox v={"header"} status={detectionStatus} />
                  <ResultBox v={"contents"} status={bodyDetectionStatus} />
                </div>
              }
            />
            <Contents header={"IP MAP"} contents={<Map paths={paths} />} />
            <Contents
              header={"Header Analysis"}
              contents={<AnalysisResult result={analysisResult} />}
            />
            <Contents
              header={"Body Analysis"}
              contents={<BodyAnalysisResult result={bodyAnalysisResult} />}
            />

            <Contents
              header={"Text Analysis - GPT4"}
              contents={
                isLoadingGPTResult ? (
                  <div>Loading...</div>
                ) : GPTResult.spamAnalysis ? (
                  renderGPTResultAsList(GPTResult)
                ) : (
                  <div>No Result</div>
                )
              }
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

            {vtIpRelInfo.map((info, index) => (
              <Contents
                bg={info.data && info.data.detected ? "#bb0000" : undefined}
                key={index}
                header={`VirusTotal - IP`}
                sub={`${info.ip}`}
                contents={<ReturnJson data={info.data} />}
              />
            ))}

            {vtDomainRelInfo.map((info, index) => (
              <Contents
                bg={info.data && info.data.detected ? "#bb0000" : undefined}
                key={index}
                header={`VirusTotal - Domain`}
                sub={`${info.hn}`}
                contents={<ReturnJson data={info.data} />}
              />
            ))}

            {vtUrlRelInfo.map((info, index) => (
              <Contents
                bg={info.data && info.data.detected ? "#bb0000" : undefined}
                key={index}
                header={`VirusTotal - URL`}
                sub={`${info.url}`}
                contents={<ReturnJson data={info.data} />}
              />
            ))}
          </div>
        )}
        {activeTab === "scanner" && (
          <div className={styles.scannerWrap}>
            <Scanner initialIps={ipAddr} />
          </div>
        )}
      </div>
    </div>
  );
}
