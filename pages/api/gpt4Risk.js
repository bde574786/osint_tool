export default async function handler(req, res) {
  const apiKey = process.env.NEXT_PUBLIC_API_GPT;

  const exampleBodyText =
    "메일 내용:\n[국세청]국세 환급금 지급 안내(이)가 도착했어요. 지금 확인해 보세요. 발송기관 국세청 전자문서 종류 [국세청]국세 환급금 지급 안내 인증기한 2023-11-04 23:59 까지 기한 내 수령하지 않은 환급금은 국고로 귀속됩니다.소중한 내 자산 지금 확인하세요. 확인하러 가기 네이i버는 과학기술정i보통신부로부터 인i증 받은 공인전자문i서중계자로, 국민연i금공단의 종이우i편을 편i리하게 보i실 수 있i도록 네i이버앱을 통i해 전i자문서로 전i달합니다. 실i명의 네이i버ID가 있i다면 기i관에서 발i송한 문i서를 전i자문서로 받i아 보i실 수 있i으며, 전i자문서 열i람 시 소i중한 정i보보호를 위i해 본i인인증을 진i행합니다. 본i인인증은 모i바일앱 환i경에서만 가i능하며, 인i증 완i료 후 발i송기관의 페i이지로 이i동하여 문i서 원i문을 확i인하실 수 있i습니다. 본 메i일은 발i신전용 입i니다. 네이i버 서i비스관련 궁i금하신 사i항은 네i이버 고객센터에i서 확i인해주세요. Copiyright ⓒ NAVER Corp. All Rights Reserved.";

  // 레이블링 수행
  const label = [
    {
      role: "system",
      content:
        "- 입력된 메일 내용의 어투와 문체에 대해서도 분석하여 다음 예시처럼 스팸 확률을 판단한다. 또한 입력된 메일 내용에 적합한 레이블링을 수행한다. #메일 레이블링 기준 1. [사적]: 개인적으로 또는 업무용으로 주고 받은 메일 2. [사적(초대)]: SNS에서 개인계정으로 보내는 광고•알림 메시지(초대 등) 3. [광고(정상)]: 수신자가 수신을 동의한 광고메일 4. [광고(기존거래관계)]: 최근 6개월 이내에 기존거래관계(재화를 구매하거나 서비스를 이용하고 대가를 지불)가 있는 경우임 5. [스팸(도박)]: 국내외 도박사이트 또는 오프라인 도박 장소를 광고 6. [스팸(불법대출)]: 신용대출, 주택담보대출, 카드론(장기카드대출), 햇살론, 국민 행복기금, 이지론, 정부지원상품 등 대출 관련 광고, 불법대출 상품 광고(정식 은행 명칭과 유사한 명칭 사용, 정부지원 사칭 등) 7. [스팸(의약품)]: 비아그라, 시알리스 등 불법적으로 거래되는 의약품(건강 보조식품 제외) 광고 8. [스팸(금융-주식)]: 리딩방, 증권사 및 증권방송, 투자컨설팅사, 자산운용사 등에서 보낸 주식관련 정보 9. [스팸(금융-카드/보험/은행 등)]: 신용카드사, 은행, 보험사에서 보낸 상품(자동차 보험, 생명 보험 등) 및 서비스 광고(대출상품 제외) 10. [스팸(재태크/투자)]: 코인, 금융 등 재테크 투자 등을 권유하는 내용 11. [스팸(성인)]: 성에 관한 음란한 표현의 문구, 그림, 사진, 동영상이 포함 되어있거나 그러한 내용의 사이트로 접속을 유도하는 광고 (유흥주점, 성매매 알선 광고 등) 12. [스팸(교육/유학)]: 자격증 및 학위취득, 교재 판매, 유학 등의 내용을 담은 광고 13. [스팸(건강정보)]: 불법적인 의약품 이외의 건강 정보, 건강보조식품 등 광고 14. [스팸(취업/창업)]: 청년·중장년•실버 취업, 안정적인 일자리(직업), 창업 등 안내, 홍보, 권유 등 내용 15. [스팸(통신가입)]: 인터넷 서비스 가입, 휴대전화 신규 가입, 번호이동 권유 등 통신가입 내용 16. [스팸(그 외 유형)]: 기존 스팸 분류에 포함되지 않으면서 수신자를 기만하거나 사회적으로 물의를 일으키는 내용을 포함한 메일, 수신자를 기만하거나 사회적으로 물의를 일으키는 내용이 아니면서, 교육, 건강정보로 분류되지 않는 메일, 직접적인 사기행위 관련여부는 알 수 없으나, 고가물품 무료증정, 경품당첨, 투자유도 등 거짓된 내용으로 수신자를 기만하는 내용의 메일",
    },
    {
      role: "user",
      content: exampleBodyText,
    },
    {
      role: "assistant",
      content: "16. [스팸(그 외 유형)]",
    },
    {
      role: "user",
      content: req.body.content.replace(/\n/g, " "),
    },
  ];

  // 피싱 분석 메시지 구성
  const spamMessages = [
    {
      role: "system",
      content:
        "- 입력된 메일 내용의 어투와 문체에 대해서도 분석하여 다음 예시처럼 피싱 메일 위험도를 판단한다. (피싱 위험도와 이유 양식을 무조건 지킨다.)",
    },
    {
      role: "user",
      content: exampleBodyText,
    },
    {
      role: "assistant",
      content:
        "스팸 확률: 높음\n\n이유:\n\n1. 기관 사칭: 메일 제목과 내용에서 국세청을 사칭하고 있어 사용자들에게 혼란을 줄 수 있습니다.\n2. 긴박감 조성: '기한 내 수령하지 않은 환급금은 국고로 귀속된다'는 문구를 사용하여 사용자들이 빠르게 행동하도록 유도하고 있습니다.\n3. 링크 클릭 유도: '확인하러 가기' 링크를 클릭하면 사용자의 개인정보나 금융정보를 탈취하는 사이트로 연결될 가능성이 높습니다.\n4. 본인인증 절차: 모바일 앱 환경에서만 가능한 본인인증 절차를 통해 사용자의 개인정보를 수집할 수 있습니다.\n5. 발신전용 메일: 실제로는 발신전용 메일이 아님에도 불구하고 발신전용 메일로 표시하여 사용자들을 속일 수 있습니다.",
    },
    {
      role: "user",
      content: req.body.content.replace(/\n/g, " "),
    },
  ];

  if (req.method === "POST") {
    // 레이블링 분석 요청
    const labelResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: label,
          temperature: 0.7,
        }),
      }
    );

    const labelData = await labelResponse.json();

    // 스팸 위험도 분석 요청
    const SpamResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: spamMessages,
          temperature: 0.7,
        }),
      }
    );

    const spamData = await SpamResponse.json();

    const result = {
      labelAnalysis: labelData.choices[0].message.content,
      spamAnalysis: spamData.choices[0].message.content,
    };

    res.status(200).json(result);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
