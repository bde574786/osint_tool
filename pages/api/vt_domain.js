export default async function handler(req, res) {
  try {
    const domain = req.query.domain;
    const apiKey =
      "958a61d824f8ca6909d4ab686289c2aa6575effe217a73d6a5afc24810c11b63";

    //http://localhost:3000/api/vt_domain?domain=ip242.ip-15-204-49.us
    const apiUrl = `https://www.virustotal.com/api/v3/domains/${domain}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "x-apikey": apiKey,
      },
    });
    const data = await response.json();

    // Detected 데이터 필터링
    const filteredAnalysisResults = Object.entries(
      data.data.attributes.last_analysis_results
    ).reduce((acc, [engine, result]) => {
      if (result.category !== "undetected" && result.category !== "harmless") {
        acc[engine] = result;
      }
      return acc;
    }, {});

    const filteredData = {
      ...data,
      data: {
        ...data.data,
        attributes: {
          ...data.data.attributes,
          last_analysis_results: filteredAnalysisResults,
        },
      },
    };

    res.status(200).json(filteredData);
    // res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
}
