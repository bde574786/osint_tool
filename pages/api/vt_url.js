export default async function handler(req, res) {
  // http://localhost:3000/api/vt_url?url=www.naver.com
  // POST로 URL에 대한 리포트 생성 -> GET으로 해당 리포트 문서 접근 -> detected 카테고리가 Undetected 또는 Harmless가 아닌 경우만 렌더링
  const url = req.query.url;

  const apiKey = process.env.NEXT_PUBLIC_API_VT;

  async function submitUrlForAnalysis(url) {
    const submitResponse = await fetch(
      `https://www.virustotal.com/api/v3/urls`,
      {
        method: "POST",
        headers: {
          "x-apikey": apiKey,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `url=${encodeURIComponent(url)}`,
      }
    );

    if (!submitResponse.ok) {
      const errorData = await submitResponse.json();
      throw new Error(
        `Error submitting URL for analysis: ${errorData.message}`
      );
    }

    return await submitResponse.json();
  }

  async function checkAndFilterAnalysisResults(analysisId) {
    const analysisResponse = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        method: "GET",
        headers: {
          "x-apikey": apiKey,
        },
      }
    );

    if (!analysisResponse.ok) {
      const errorData = await analysisResponse.json();
      throw new Error(`Error fetching analysis results: ${errorData.message}`);
    }

    const analysisData = await analysisResponse.json();

    // 감지된 데이터가 있는지 여부를 나타내는 플래그
    let detected = false;

    const filteredResults = Object.entries(
      analysisData.data.attributes.results
    ).reduce((acc, [engine, result]) => {
      if (result.category !== "undetected" && result.category !== "harmless") {
        acc[engine] = result;
        detected = true;
      }
      return acc;
    }, {});

    return {
      ...analysisData,
      data: {
        ...analysisData.data,
        attributes: {
          ...analysisData.data.attributes,
          results: filteredResults,
        },
      },
      detected: detected,
    };
  }

  try {
    const submissionResult = await submitUrlForAnalysis(url);
    const analysisId = submissionResult.data.id;
    const analysisResults = await checkAndFilterAnalysisResults(analysisId);

    res.status(200).json(analysisResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred during the analysis process.",
      details: error.toString(),
    });
  }
}
