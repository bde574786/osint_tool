export default async function handler(req, res) {
  const apiKey = "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";

  const init_msg =
    "- 입력된 메일 내용의 어투와 문체에 대해서도 분석하여 다음 예시처럼 피싱 메일 위험도를 판단한다. (피싱 위험도와 이유 양식을 무조건 지킨다.) \n메일 내용:\n네이버 클라우드 플랫폼 오윤석 님 크레딧 유효기간 만 료 예정 안내 안녕하세요. 네이버 클라우드 플랫폼입니 다. 보유하신 크레딧의 유효기간이 30 일 남았습니다.\n(기준일: 2023-12-01) 0 크레딧 명: Credit\nDiscount to New Customers w 만료일 : 2023-\n12-31유효기간이 만료된 크레딧은 더 이상 사용할 수 없으며, 사용가능한 크레딧이 없는 상태로 서비스를 이 용하실 경우 요금이 자동 과금됩니다. [남은 크레딧 확 인 하기] 서비스 이용 현황은 [마이페이지 > 서비스 이 용 현황]에서 실시간 조회 하실 수 있습니다. 궁금하신 사항은 고객지원으로 문의해주시기 바랍니다. 언제나 더 나은 서비스를 제공하기 위해 노력하겠습니다. 감사 합니다. 네이버 클라우드 플랫폼 바로가기 본 메일은 발 신전용 입니다. 궁금하신 점이나 불편한 사항은온라인 문의하기 / 채팅 문의하기 (9:00-17:00\nGMT+09:00)로 문의해주시기 바랍니다.© NAVER\nCloud Corp. All rights reserved.\n피싱 위험도: 낮음\n이유:\n공식적이고 일관된 어투: 메일은 네이버 클라우드 플랫 폼을 대표하는 공식적이고 일관된 어투를 사용하고 있 습니다. 이는 일반적인 피싱 메일에서 찾아볼 수 없는 특성입니다.\n정확한 정보 제공: 크레딧의 유효기간, 만료일, 그리고 사용에 대한 명확한 지침이 제공됩니다. 이러한 세부사 항은 피싱 메일에서 종종 부정확하거나 모호하게 제시 됩니다.\n직접적인 금융 정보 요구 부재: 메일에서 직접적인 금융 정보나 개인 정보를 요구하는 내용이 없습니다. 피싱 메 일은 주로 금융 정보나 개인 정보를 요구하는 경향이 있 습니다.\n합리적인 링크 제공: 사용자를 서비스 관련 페이지로 안 내하는 링크가 제공되지만, 이는 사용자의 서비스 이용 현황 확인과 관련이 있으며, 합리적인 맥락에서 제공됩 니다.\n기업 연락처 제공: 네이버 클라우드 플랫폼에 대한 문의 를 위한 고객 지원 연락처가 명시되어 있습니다. 피싱 메일은 종종 연락처를 제공하지 않거나, 가짜 연락처를 제공하는 경우가 많습니다.";
  const messages = [
    { role: "system", content: init_msg },
    { role: "user", content: init_msg },
    {
      role: "user",
      content:
        "메일 내용:\n[국세청]국세 환급금 지급 안내(이)가 도착했어요. 지금 확인해 보세요. 발송기관 국세청 전자문서 종류 [국세청]국세 환급금 지급 안내 인증기한 2023-11-04 23:59 까지 기한 내 수령하지 않은 환급금은 국고로 귀속됩니다.소중한 내 자산 지금 확인하세요. 확인하러 가기 네이i버는 과학기술정i보통신부로부터 인i증 받은 공인전자문i서중계자로, 국민연i금공단의 종이우i편을 편i리하게 보i실 수 있i도록 네i이버앱을 통i해 전i자문서로 전i달합니다. 실i명의 네이i버ID가 있i다면 기i관에서 발i송한 문i서를 전i자문서로 받i아 보i실 수 있i으며, 전i자문서 열i람 시 소i중한 정i보보호를 위i해 본i인인증을 진i행합니다. 본i인인증은 모i바일앱 환i경에서만 가i능하며, 인i증 완i료 후 발i송기관의 페i이지로 이i동하여 문i서 원i문을 확i인하실 수 있i습니다. 본 메i일은 발i신전용 입i니다. 네이i버 서i비스관련 궁i금하신 사i항은 네i이버 고객센터에i서 확i인해주세요. Copiyright ⓒ NAVER Corp. All Rights Reserved.",
    },
    {
      role: "assistant",
      content:
        "피싱 위험도: 높음\n\n이유:\n\n1. 기관 사칭: 메일 제목과 내용에서 국세청을 사칭하고 있어 사용자들에게 혼란을 줄 수 있습니다.\n2. 긴박감 조성: '기한 내 수령하지 않은 환급금은 국고로 귀속된다'는 문구를 사용하여 사용자들이 빠르게 행동하도록 유도하고 있습니다.\n3. 링크 클릭 유도: '확인하러 가기' 링크를 클릭하면 사용자의 개인정보나 금융정보를 탈취하는 사이트로 연결될 가능성이 높습니다.\n4. 본인인증 절차: 모바일 앱 환경에서만 가능한 본인인증 절차를 통해 사용자의 개인정보를 수집할 수 있습니다.\n5. 발신전용 메일: 실제로는 발신전용 메일이 아님에도 불구하고 발신전용 메일로 표시하여 사용자들을 속일 수 있습니다.",
    },
  ];

  const content =
    req.body.content !== "" ? req.body.content.replace(/\n/g, "") : "";

  messages.push({ role: "user", content: content });

  if (req.method === "POST") {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    res.status(200).json(data);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
