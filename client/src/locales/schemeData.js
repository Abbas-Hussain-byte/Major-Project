export const SCHEME_LOCALIZATIONS = {
  // 1. Education Loan Scheme of NMDFC (from user's myScheme photos)
  nmdfc_edu: {
    key: 'nmdfc_edu',
    matchKeys: ['NMDFC', 'Education Loan Scheme of NMDFC', 'minority education loan', 'minority loan'],
    en: {
      name: 'Education Loan Scheme of NMDFC',
      type: 'Concessional Education Loan',
      ministry: 'Ministry of Minority Affairs',
      details: "Under this scheme of NMDFC, loan is available for job-oriented 'technical and professional courses' of durations not exceeding five years. Loan of up to Rs. 20 Lakhs for domestic courses & Rs. 30 Lakhs for courses abroad under Credit Line-1 and Credit Line-2 is extended to beneficiaries belonging to minority communities at 3% p.a. & 8% p.a. respectively. Further, concession of 3% is extended to women beneficiaries under Credit Line-2.",
      benefit: 'Concessional credit of up to ₹20 Lakh (Domestic) and ₹30 Lakh (Abroad) at 3% to 8% interest with 3% additional rebate for women students.',
      benefits_list: [
        'Concessional credit to beneficiaries among notified minority communities.',
        'Maximum loan up to ₹20 Lakh for courses in India and ₹30 Lakh for abroad courses.',
        'Low interest rate: 3% p.a. for Credit Line-1 and 8% p.a. for Credit Line-2.',
        'Special 3% interest concession for female students under Credit Line-2.',
        'Moratorium period covers course duration plus 6 months before repayment begins.'
      ],
      eligibility_list: [
        'Applicant must be an Indian citizen belonging to one of the six notified minority communities (Muslim, Christian, Sikh, Buddhist, Parsi, Jain).',
        'Annual family income up to ₹3.00 Lakh p.a. under Credit Line-1, and up to ₹8.00 Lakh p.a. under Credit Line-2.',
        'Must have secured admission to a recognized institution in India or abroad through entrance test or merit selection.',
        'Course must be technical or professional with duration not exceeding 5 years.',
        'Must have a co-borrower (parent/guardian) with verified income credentials.',
        'Preference given to female students and candidates from economically weaker sections.'
      ],
      exclusions_list: [
        'Applicants not belonging to the 6 notified minority communities.',
        'Family income exceeding ₹8.00 Lakhs per annum.',
        'Candidates who have already availed financial assistance for the same course under another government scheme.',
        'Non-professional or non-technical general degree programs.'
      ],
      how_to_apply: 'Apply through State Channelizing Agencies (SCAs) nominated by State Governments or partner refinance banks (Canara Bank, Punjab Grameen Bank) or via UMANG portal.',
      application_process: 'Step 1: Download form from nmdfc.org or collect from nearest State Channelizing Agency (SCA) office or Canara Bank branch.\nStep 2: Attach admission letter, fee structure, and minority certificate.\nStep 3: Submit application with co-borrower income documents.\nStep 4: Once verified, funds are disbursed directly to the college/university account.',
      documents_required: [
        '1. Duly filled Education Loan Application Form.',
        '2. Photographs of student and co-borrower (parent/guardian).',
        '3. Proof of Minority Status (certificate or self-declaration).',
        '4. Income Certificate of the family issued by competent authority.',
        '5. Proof of Residence: Aadhaar card, voter ID, ration card, or utility bill.',
        '6. Admission Letter from recognized college/university in India or abroad.',
        '7. Fee Structure or estimate from the educational institution.',
        '8. Mark Sheets/Certificates of qualifying examinations (Class X, XII, Graduation).',
        '9. Bank Account Proof: Aadhaar-linked bank passbook copy.',
        '10. Valid Passport and Visa (for studies abroad).',
        '11. Proof of age (DOB Certificate/10th Certificate).',
        '12. Affidavit/Undertaking confirming no other education loan availed under govt schemes.',
        '13. PAN Card of student and co-borrower.'
      ],
      faqs: [
        {
          question: "What is the objective of NMDFC's Education Loan Scheme?",
          answer: 'To facilitate concessional credit to eligible minority students pursuing job-oriented professional and technical higher education in India and abroad.'
        },
        {
          question: 'What is the maximum amount of education loan that can be availed?',
          answer: 'Up to ₹20.00 Lakhs for courses in India, and up to ₹30.00 Lakhs for approved courses abroad.'
        },
        {
          question: 'What are the interest rates applicable to Education Loans?',
          answer: '3% per annum for Credit Line-1 (income up to ₹3L), and 8% per annum for Credit Line-2 (income up to ₹8L), with a 3% rebate for female students.'
        },
        {
          question: 'When does the repayment period begin, and how long is it?',
          answer: 'Repayment starts 6 months after completion of course or getting employment (whichever is earlier), spread over up to 5 years.'
        }
      ],
      source_url: 'https://www.nmdfc.org/',
      match_reasons: ['Belongs to notified community target group', 'Pursuing technical or higher professional education', 'Within eligible family income band'],
      tags: ['Loan Up to ₹30 Lakh', '3% Concessional Interest', 'Minority Community', 'Women 3% Rebate']
    },
    hi: {
      name: 'एनएमडीएफसी शिक्षा ऋण योजना (NMDFC Education Loan)',
      type: 'रियायती शिक्षा ऋण योजना',
      ministry: 'अल्पसंख्यक कार्य मंत्रालय',
      details: 'एनएमडीएफसी के तहत अल्पसंख्यक समुदाय के विद्यार्थियों के लिए व्यावसायिक व तकनीकी पाठ्यक्रमों (अधिकतम 5 वर्ष) हेतु रियायती दरों पर ऋण उपलब्ध है। देश में अध्ययन हेतु ₹20 लाख तथा विदेश में अध्ययन हेतु ₹30 लाख तक का ऋण 3% से 8% ब्याज दर पर प्रदान किया जाता है।',
      benefit: 'भारत में ₹20 लाख व विदेश में ₹30 लाख तक का रियायती शिक्षा ऋण मात्र 3% से 8% ब्याज दर पर, छात्राओं को 3% अतिरिक्त छूट।',
      benefits_list: [
        'अधिसूचित अल्पसंख्यक समुदाय के छात्रों को रियायती दर पर शिक्षा ऋण।',
        'भारत में अध्ययन हेतु ₹20 लाख तथा विदेश हेतु ₹30 लाख तक की ऋण सीमा।',
        'क्रेडिट लाइन-1 पर मात्र 3% वार्षिक तथा क्रेडिट लाइन-2 पर 8% वार्षिक ब्याज दर।',
        'क्रेडिट लाइन-2 के तहत छात्राओं को 3% की विशेष ब्याज रियायत।',
        'पाठ्यक्रम समाप्ति के 6 महीने बाद तक कोई किश्त नहीं (मोरेटोरियम सुविधा)।'
      ],
      eligibility_list: [
        'आवेदक भारत का नागरिक और 6 अधिसूचित अल्पसंख्यक समुदायों (मुस्लिम, ईसाई, सिख, बौद्ध, पारसी, जैन) से होना चाहिए।',
        'पारिवारिक वार्षिक आय सीमा: क्रेडिट लाइन-1 में ₹3.00 लाख तक, क्रेडिट लाइन-2 में ₹8.00 लाख तक।',
        'प्रवेश परीक्षा या मेरिट के आधार पर मान्यता प्राप्त संस्थान में प्रवेश प्राप्त किया हो।',
        'पाठ्यक्रम तकनीकी या व्यावसायिक हो (अवधि 5 वर्ष से कम)।',
        'माता-पिता या अभिभावक सह-उधारकर्ता (Co-borrower) के रूप में होने चाहिए।'
      ],
      exclusions_list: [
        'गैर-अल्पसंख्यक वर्ग के आवेदक।',
        'वार्षिक पारिवारिक आय ₹8.00 लाख से अधिक होने पर।',
        'जिन्होंने उसी कोर्स के लिए पहले से किसी अन्य सरकारी ऋण योजना का लाभ लिया हो।'
      ],
      how_to_apply: 'राज्य चैनलाइजिंग एजेंसी (SCA), केनरा बैंक, पंजाब ग्रामीण बैंक या उमंग (UMANG) पोर्टल के माध्यम से आवेदन करें।',
      application_process: 'चरण 1: nmdfc.org से फॉर्म डाउनलोड करें या नजदीकी राज्य चैनलाइजिंग एजेंसी (SCA) कार्यालय से प्राप्त करें।\nचरण 2: प्रवेश पत्र, फीस संरचना और अल्पसंख्यक प्रमाण पत्र संलग्न करें।\nचरण 3: सह-उधारकर्ता के आय दस्तावेजों के साथ आवेदन जमा करें।\nचरण 4: सत्यापन के बाद राशि सीधे कॉलेज/विश्वविद्यालय खाते में भेजी जाती है।',
      documents_required: [
        '1. विधिवत भरा हुआ शिक्षा ऋण आवेदन पत्र।',
        '2. छात्र और सह-उधारकर्ता (माता-पिता) के फोटो।',
        '3. अल्पसंख्यक वर्ग प्रमाण पत्र या स्व-घोषणा।',
        '4. सक्षम प्राधिकारी द्वारा जारी परिवार का आय प्रमाण पत्र।',
        '5. निवास प्रमाण पत्र: आधार कार्ड, वोटर आईडी, राशन कार्ड।',
        '6. कॉलेज/विश्वविद्यालय का आधिकारिक प्रवेश पत्र।',
        '7. संस्थान द्वारा जारी फीस संरचना का अनुमान।',
        '8. 10वीं, 12वीं या स्नातक की अंकतालिकाएं।',
        '9. आधार से जुड़े बैंक खाते की पासबुक प्रति।',
        '10. विदेश अध्ययन हेतु वैध पासपोर्ट व वीजा।',
        '11. जन्म तिथि प्रमाण पत्र (10वीं का प्रमाण पत्र)।',
        '12. कोई अन्य ऋण न लेने का शपथ पत्र।',
        '13. छात्र और सह-उधारकर्ता का पैन कार्ड।'
      ],
      faqs: [
        {
          question: 'एनएमडीएफसी शिक्षा ऋण योजना का मुख्य उद्देश्य क्या है?',
          answer: 'अल्पसंख्यक वर्ग के पात्र छात्रों को भारत व विदेश में तकनीकी एवं व्यावसायिक उच्च शिक्षा हेतु रियायती वित्तीय ऋण उपलब्ध कराना।'
        },
        {
          question: 'अधिकतम कितनी शिक्षा ऋण राशि मिल सकती है?',
          answer: 'भारत में अध्ययन हेतु ₹20.00 लाख तक और विदेशों में अध्ययन हेतु ₹30.00 लाख तक।'
        },
        {
          question: 'ऋण पर ब्याज दर क्या है?',
          answer: 'क्रेडिट लाइन-1 में मात्र 3% वार्षिक और क्रेडिट लाइन-2 में 8% वार्षिक ब्याज दर लागू होती है, छात्राओं को 3% की छूट मिलती है।'
        }
      ],
      source_url: 'https://www.nmdfc.org/',
      match_reasons: ['अधिसूचित अल्पसंख्यक समुदाय वर्ग में शामिल', 'व्यावसायिक या तकनीकी शिक्षा हेतु पात्र', 'निर्धारित पारिवारिक आय सीमा में'],
      tags: ['ऋण ₹30 लाख तक', '3% रियायती ब्याज', 'अल्पसंख्यक वर्ग', 'छात्राओं को 3% छूट']
    },
    te: {
      name: 'ఎన్‌ఎండిఎఫ్‌సి విద్యా రుణ పథకం (NMDFC Education Loan)',
      type: 'రాయితీ విద్యా రుణ పథకం',
      ministry: 'మైనారిటీ వ్యవహారాల మంత్రిత్వ శాఖ',
      details: 'మైనారిటీ వర్గాల విద్యార్థులకు వృత్తిపరమైన మరియు సాంకేతిక కోర్సుల (గరిష్టంగా 5 సంవత్సరాలు) కోసం రాయితీ వడ్డీతో రుణాలు లభిస్తాయి. దేశంలో చదువుకోవడానికి ₹20 లక్షల వరకు, విదేశాల్లో చదువుకోవడానికి ₹30 లక్షల వరకు 3% నుండి 8% రాయితీ వడ్డీతో రుణం మంజూరు చేయబడుతుంది.',
      benefit: 'దేశంలో చదువుకు ₹20 లక్షలు, విదేశీ చదువులకు ₹30 లక్షల వరకు 3% నుండి 8% రాయితీ వడ్డీతో విద్యా రుణం. మహిళా విద్యార్థినులకు 3% అదనపు తగ్గింపు.',
      benefits_list: [
        'మైనారిటీ వర్గాల విద్యార్థులకు అత్యంత తక్కువ రాయితీ వడ్డీతో విద్యా రుణాలు.',
        'దేశీయ విద్యా కోర్సులకు ₹20 లక్షల వరకు, విదేశీ విద్యకు ₹30 లక్షల వరకు గరిష్ట రుణం.',
        'క్రెడిట్ లైన్-1 కింద 3% వార్షిక వడ్డీ, క్రెడిట్ లైన్-2 కింద 8% వార్షిక వడ్డీ.',
        'క్రెడిట్ లైన్-2 లో మహిళా విద్యార్థినులకు ప్రత్యేకంగా 3% వడ్డీ రాయితీ.',
        'కోర్సు పూర్తయిన తర్వాత 6 నెలల వరకు మారటోరియం సదుపాయం (వాయిదాలు కట్టనవసరం లేదు).'
      ],
      eligibility_list: [
        'దరఖాస్తుదారుడు తప్పనిసరిగా 6 గుర్తించబడిన మైనారిటీ కమ్యూనిటీలలో (ముస్లిం, క్రిస్టియన్, సిక్కు, బౌద్ధ, పార్సీ, జైన) ఒకరికి చెందిన భారతీయ పౌరుడై ఉండాలి.',
        'వార్షిక కుటుంబ ఆదాయ పరిమితి: క్రెడిట్ లైన్-1 లో ₹3.00 లక్షల వరకు, క్రెడిట్ లైన్-2 లో ₹8.00 లక్షల వరకు.',
        'గుర్తింపు పొందిన విద్యాసంస్థలో ప్రవేశ పరీక్ష లేదా మెరిట్ ద్వారా అడ్మిషన్ పొంది ఉండాలి.',
        'కోర్సు సాంకేతిక లేదా ప్రొఫెషనల్ విభాగంలో గరిష్టంగా 5 సంవత్సరాల వ్యవధి కలిగి ఉండాలి.',
        'తల్లిదండ్రులు లేదా సంరక్షకులు కో-బోరోవర్‌గా ఆదాయ ధృవీకరణ పత్రం సమర్పించాలి.'
      ],
      exclusions_list: [
        'నోటిఫై చేయబడిన 6 మైనారిటీ వర్గాలకు చెందని దరఖాస్తుదారులు.',
        'కుటుంబ వార్షిక ఆదాయం ₹8.00 లక్షల కంటే ఎక్కువ ఉన్నవారు.',
        'ఇదే కోర్సు కోసం ఇప్పటికే ఇతర ప్రభుత్వ విద్యా రుణ పథకాల ప్రయోజనం పొందినవారు.'
      ],
      how_to_apply: 'రాష్ట్ర ఛానలైజింగ్ ఏజెన్సీ (SCA), కెనరా బ్యాంక్, పంజాబ్ గ్రామీణ బ్యాంక్ లేదా UMANG పోర్టల్ ద్వారా దరఖాస్తు చేసుకోండి.',
      application_process: 'దశ 1: nmdfc.org వెబ్‌సైట్ నుండి ఫారమ్‌ను డౌన్‌లోడ్ చేసుకోండి లేదా సమీప SCA కార్యాలయం వద్ద పొందండి.\nదశ 2: అడ్మిషన్ లెటర్, ఫీజు వివరాలు మరియు మైనారిటీ సర్టిఫికేట్‌ను జత చేయండి.\nదశ 3: ఆదాయ ధృవీకరణ పత్రాలతో దరఖాస్తును సమర్పించండి.\nదశ 4: పరిశీలన అనంతరం రుణ మొత్తం నేరుగా కళాశాల/యూనివర్సిటీ ఖాతాకు జమ చేయబడుతుంది.',
      documents_required: [
        '1. పూర్తి చేసిన విద్యా రుణ దరఖాస్తు ఫారమ్.',
        '2. విద్యార్థి మరియు కో-బోరోవర్ (తల్లిదండ్రులు) ఫోటోలు.',
        '3. మైనారిటీ వర్గ ధృవీకరణ పత్రం (సర్టిఫికేట్ లేదా స్వీయ ప్రకటన).',
        '4. ప్రభుత్వం జారీ చేసిన కుటుంబ ఆదాయ ధృవీకరణ పత్రం.',
        '5. నివాస రుజువు: ఆధార్ కార్డ్, ఓటర్ ఐడీ, రేషన్ కార్డ్.',
        '6. గుర్తింపు పొందిన కళాశాల నుండి అడ్మిషన్ లెటర్.',
        '7. కళాశాల ఫీజు వివరాల అంచనా పత్రం (Fee Structure).',
        '8. 10వ తరగతి, ఇంటర్ లేదా డిగ్రీ మార్కుల మెమోలు.',
        '9. ఆధార్‌తో అనుసంధానించబడిన బ్యాంక్ ఖాతా పాస్‌బుక్ కాపీ.',
        '10. విదేశీ విద్య కోసం చెల్లుబాటు అయ్యే పాస్‌పోర్ట్ మరియు వీసా.',
        '11. పుట్టిన తేదీ రుజువు (10వ తరగతి సర్టిఫికేట్).',
        '12. ఇతర రుణాలు తీసుకోలేదని అఫిడవిట్/హామీ పత్రం.',
        '13. విద్యార్థి మరియు కో-బోరోవర్ పాన్ కార్డ్.'
      ],
      faqs: [
        {
          question: 'NMDFC విద్యా రుణ పథకం ప్రధాన లక్ష్యం ఏమిటి?',
          answer: 'మైనారిటీ వర్గాల విద్యార్థులు భారతదేశంలో మరియు విదేశాలలో ఉన్నత వృత్తి విద్యా కోర్సులు చదవడానికి రాయితీ రుణ సదుపాయం కల్పించడం.'
        },
        {
          question: 'గరిష్టంగా ఎంత మొత్తం విద్యా రుణం లభిస్తుంది?',
          answer: 'భారతదేశంలో చదువుకు ₹20.00 లక్షల వరకు మరియు విదేశీ విద్యకు ₹30.00 లక్షల వరకు లభిస్తుంది.'
        },
        {
          question: 'ఈ విద్యా రుణంపై వడ్డీ రేటు ఎంత?',
          answer: 'క్రెడిట్ లైన్-1 లో 3% వార్షిక వడ్డీ, క్రెడిట్ లైన్-2 లో 8% వార్షిక వడ్డీ ఉంటుంది. మహిళా విద్యార్థినులకు 3% వడ్డీ రాయితీ లభిస్తుంది.'
        }
      ],
      source_url: 'https://www.nmdfc.org/',
      match_reasons: ['గుర్తించబడిన మైనారిటీ వర్గానికి చెందినవారు', 'సాంకేతిక లేదా ప్రొఫెషనల్ ఉన్నత విద్యకు అర్హులు', 'కుటుంబ ఆదాయ పరిమితి నిబంధనలకు అనుకూలం'],
      tags: ['రుణం ₹30 లక్షల వరకు', '3% రాయితీ వడ్డీ', 'మైనారిటీ వర్గం', 'మహిళలకు 3% తగ్గింపు']
    }
  },

  // 2. PMJJBY
  pmjjby: {
    key: 'pmjjby',
    matchKeys: ['PMJJBY', 'Jeevan Jyoti'],
    en: {
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      type: 'Government Life Insurance',
      ministry: 'Ministry of Finance (Department of Financial Services)',
      details: 'PMJJBY is a one-year life insurance scheme renewable from year to year offering coverage for death due to any reason. Auto-debited from savings account annually.',
      benefit: 'Life insurance cover of ₹2,00,000 for death due to any reason. Direct bank auto-debit of ₹436 per year (₹1.20/day).',
      benefits_list: [
        '₹2,00,000 pure life insurance cover in case of death of insured person due to any reason.',
        'Nominee receives ₹2,00,000 directly into bank account via DBT.',
        'Extremely affordable: only ₹436 per year (approx ₹1.20 per day).',
        'Automatic renewal every year via bank account auto-debit on May 31st.'
      ],
      eligibility_list: [
        'Age between 18 and 50 years with a savings bank or post office account.',
        'Consent for auto-debit of ₹436 annual premium from savings bank account.',
        'Aadhaar acts as primary KYC for the bank account.'
      ],
      exclusions_list: [
        'Demise occurring during first 30 days of enrollment (lien period), except accidental death.',
        'Individuals having multiple accounts can only enroll through one bank account.'
      ],
      how_to_apply: 'Apply through your savings bank branch, post office, or banking correspondent with your Aadhaar-linked account.',
      application_process: 'Step 1: Visit your bank branch or log in to net banking.\nStep 2: Submit the PMJJBY consent-cum-declaration form with nominee details.\nStep 3: ₹436 will be auto-debited and insurance certificate generated.',
      documents_required: [
        '1. Aadhaar Card copy.',
        '2. Bank Account Passbook copy.',
        '3. Duly signed Auto-Debit Consent Form.',
        '4. Nominee Aadhaar and bank details.'
      ],
      faqs: [
        {
          question: 'Can I join PMJJBY in multiple banks?',
          answer: 'No. An individual can join through only one bank account. If multiple enrollments occur, claims are payable only on one policy.'
        },
        {
          question: 'What is the claim settlement timeline?',
          answer: 'Nominee must submit death certificate within 30 days. Claims are settled directly by Life Insurance Corporation (LIC) or partner insurer within 30 days.'
        }
      ],
      source_url: 'https://financialservices.gov.in/beta/en/pmjjby',
      match_reasons: ['Age (32) is within 18–50 limit', 'Active savings bank account verified', 'No health certificate required'],
      tags: ['Life Cover ₹2 Lakh', 'Auto-Debit ₹436/yr', 'Age 18–50']
    },
    hi: {
      name: 'प्रधानमंत्री जीवन ज्योति बीमा योजना (PMJJBY)',
      type: 'सरकारी जीवन बीमा',
      ministry: 'वित्त मंत्रालय (वित्तीय सेवाएं विभाग)',
      details: 'किसी भी कारण से मृत्यु होने पर ₹2 लाख का शुद्ध जीवन बीमा। वार्षिक प्रीमियम ₹436 बैंक खाते से स्वतः काटा जाता है।',
      benefit: 'किसी भी कारण से मृत्यु होने पर ₹2,00,000 का जीवन बीमा सुरक्षा कवर। केवल ₹436 प्रति वर्ष (लगभग ₹1.20/दिन) बैंक खाते से ऑटो-डेबिट।',
      benefits_list: [
        'किसी भी कारण से मृत्यु पर नॉमिनी को ₹2,00,000 की वित्तीय सहायता।',
        'किफायती प्रीमियम: केवल ₹436 प्रति वर्ष।',
        'सीधे बैंक खाते से स्वतः नवीनीकरण।'
      ],
      eligibility_list: ['18 से 50 वर्ष की आयु।', 'सक्रिय बचत बैंक खाता व आधार से जुड़ाव।'],
      exclusions_list: ['शुरुआती 30 दिनों में प्राकृतिक मृत्यु (दुर्घटना मृत्यु पर लागू नहीं)।'],
      how_to_apply: 'अपनी बैंक शाखा, डाकघर या बैंक मित्र केंद्र पर आधार से जुड़े बचत खाते के माध्यम से नामांकन करें।',
      application_process: 'बैंक शाखा जाएं, सहमति फॉर्म भरें और नॉमिनी विवरण दर्ज कराएं।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक पासबुक।', '3. ऑटो-डेबिट सहमति फॉर्म।', '4. नॉमिनी का विवरण।'],
      faqs: [
        {
          question: 'क्या पीएमजेजेबीवाई के लिए मेडिकल टेस्ट की जरूरत है?',
          answer: 'नहीं, इसमें किसी प्रकार की चिकित्सा जांच की आवश्यकता नहीं है।'
        }
      ],
      source_url: 'https://financialservices.gov.in/beta/en/pmjjby',
      match_reasons: ['आयु (32) 18–50 वर्ष की सीमा में है', 'सक्रिय बचत बैंक खाता सत्यापित है', 'चिकित्सा जांच की आवश्यकता नहीं'],
      tags: ['जीवन बीमा ₹2 लाख', 'प्रीमियम ₹436/वर्ष', 'आयु 18–50']
    },
    te: {
      name: 'ప్రధాన మంత్రి జీవన్ జ్యోతి బీమా యోజన (PMJJBY)',
      type: 'ప్రభుత్వ జీవిత బీమా',
      ministry: 'ఆర్థిక మంత్రిత్వ శాఖ (ఫైనాన్షియల్ సర్వీసెస్ విభాగం)',
      details: 'ఏ కారణం చేతనైనా మరణం సంభవించినప్పుడు ₹2 లక్షల జీవిత బీమా రక్షణ. సంవత్సరానికి కేవలం ₹436 బ్యాంక్ ఖాతా నుండి ఆటో-డెబిట్ అవుతుంది.',
      benefit: 'ఏదైనా కారణంతో మరణం సంభవించినప్పుడు ₹2,00,000 జీవిత బీమా రక్షణ. సంవత్సరానికి కేవలం ₹436 బ్యాంక్ ఖాతా నుండి ఆటో-డెబిట్.',
      benefits_list: [
        'ఏ కారణం చేతనైనా మరణిస్తే నామినీకి ₹2,00,000 నగదు రక్షణ.',
        'వార్షిక ప్రీమియం కేవలం ₹436 (రోజుకు సుమారు ₹1.20).',
        'బ్యాంక్ ఖాతా నుండి ఆటోమేటిక్ వార్షిక పునరుద్ధరణ.'
      ],
      eligibility_list: ['18 నుండి 50 సంవత్సరాల వయస్సు.', 'యాక్టివ్ పొదుపు బ్యాంక్ ఖాతా మరియు ఆధార్ అనుసంధానం.'],
      exclusions_list: ['మొదటి 30 రోజులలో సహజ మరణం (ప్రమాద మరణానికి ఇది వర్తించదు).'],
      how_to_apply: 'మీ పొదుపు ఖాతా ఉన్న బ్యాంక్ బ్రాంచ్, పోస్టాఫీసు లేదా బ్యాంకింగ్ కరస్పాండెంట్ ద్వారా ఆధార్ వివరాలతో దరఖాస్తు చేసుకోండి.',
      application_process: 'మీ బ్యాంక్ శాఖను సందర్శించి, PMJJBY ఫారమ్‌లో నామినీ వివరాలను నింపి సమర్పించండి.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. బ్యాంక్ పాస్‌బుక్ కాపీ.', '3. ఆటో-డెబిట్ సమ్మతి ఫారమ్.', '4. నామినీ వివరాలు.'],
      faqs: [
        {
          question: 'దీనికి వైద్య పరీక్ష అవసరమా?',
          answer: 'అవసరం లేదు. ఎటువంటి వైద్య పరీక్షలు లేకుండానే ఈ బీమా పొందవచ్చు.'
        }
      ],
      source_url: 'https://financialservices.gov.in/beta/en/pmjjby',
      match_reasons: ['వయస్సు (32) 18–50 సంవత్సరాల పరిమితిలో ఉంది', 'యాక్టివ్ బ్యాంక్ ఖాతా ధృవీకరించబడింది', 'మెడికల్ పరీక్ష అవసరం లేదు'],
      tags: ['జీవిత రక్షణ ₹2 లక్షలు', 'ఖర్చు ₹436/సంవత్సరం', 'వయస్సు 18–50']
    }
  },

  // 3. PMSBY
  pmsby: {
    key: 'pmsby',
    matchKeys: ['PMSBY', 'Suraksha Bima'],
    en: {
      name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
      type: 'Accident & Disability Insurance',
      ministry: 'Ministry of Finance',
      details: 'Accidental death and permanent disability insurance offering ₹2,00,000 cover for an annual premium of just ₹20.',
      benefit: 'Accidental death & permanent full disability cover of ₹2,00,000 (₹1,00,000 for partial disability) at only ₹20 per year.',
      benefits_list: [
        '₹2,00,000 on accidental death or permanent total disability.',
        '₹1,00,000 for permanent partial disability (loss of one eye or limb).',
        'Nationwide coverage with claim payable through direct bank transfer.',
        'Extremely low premium: just ₹20 per year.'
      ],
      eligibility_list: [
        'Age between 18 and 70 years with an active savings bank account.',
        'Aadhaar-linked account with auto-debit consent.'
      ],
      exclusions_list: [
        'Natural demise or death due to illness or suicide.',
        'Drug or alcohol induced accidents.'
      ],
      how_to_apply: 'Submit consent form at your bank branch, post office, or netbanking with auto-debit consent on June 1st.',
      application_process: 'Submit 1-page form at your bank branch or activate through SMS/netbanking.',
      documents_required: ['1. Aadhaar Card.', '2. Bank Account Passbook.', '3. Auto-debit Consent Form.'],
      faqs: [
        {
          question: 'What is needed to claim accidental insurance?',
          answer: 'Police FIR, hospital post-mortem report, and original death/disability certificate within 30 days.'
        }
      ],
      source_url: 'https://financialservices.gov.in/beta/en/pmsby',
      match_reasons: ['Age (32) satisfies 18–70 limit', 'Active savings account detected', 'Affordable safety net tier'],
      tags: ['Accident Cover ₹2 Lakh', '₹20/year Premium', 'Age 18–70']
    },
    hi: {
      name: 'प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)',
      type: 'दुर्घटना व विकलांगता बीमा',
      ministry: 'वित्त मंत्रालय',
      details: 'दुर्घटना मृत्यु व स्थायी विकलांगता पर मात्र ₹20 वार्षिक में ₹2 लाख का कवर।',
      benefit: 'दुर्घटना मृत्यु व पूर्ण स्थायी विकलांगता पर ₹2,00,000 (आंशिक विकलांगता पर ₹1,00,000) का सुरक्षा कवर मात्र ₹20 प्रति वर्ष में।',
      benefits_list: [
        'दुर्घटना मृत्यु पर ₹2,00,000 का कवर।',
        'स्थायी पूर्ण विकलांगता पर ₹2,00,000 तथा आंशिक पर ₹1,00,000।',
        'वार्षिक प्रीमियम मात्र ₹20।'
      ],
      eligibility_list: ['18 से 70 वर्ष की आयु।', 'सक्रिय बचत बैंक खाता।'],
      exclusions_list: ['प्राकृतिक मृत्यु या बीमारी से होने वाली मृत्यु।'],
      how_to_apply: 'अपने बैंक शाखा या डाकघर में ऑटो-डेबिट सहमति फॉर्म जमा करके तुरंत जुड़ें।',
      application_process: 'बैंक में सहमति पत्र जमा करें, ₹20 वार्षिक काटा जाएगा।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक खाता पासबुक।'],
      faqs: [
        {
          question: 'क्लेम कैसे करें?',
          answer: 'दुर्घटना के 30 दिनों के भीतर एफआईआर और अस्पताल रिपोर्ट बैंक में जमा करें।'
        }
      ],
      source_url: 'https://financialservices.gov.in/beta/en/pmsby',
      match_reasons: ['आयु (32) 18–70 वर्ष के दायरे में है', 'सक्रिय बचत बैंक खाता उपलब्ध है', 'कम आय वर्ग के लिए सुलभ सुरक्षा'],
      tags: ['दुर्घटना कवर ₹2 लाख', 'प्रीमियम ₹20/वर्ष', 'आयु 18–70']
    },
    te: {
      name: 'ప్రధాన మంత్రి సురక్షా బీమా యోజన (PMSBY)',
      type: 'ప్రమాద & వైకల్య బీమా',
      ministry: 'ఆర్థిక మంత్రిత్వ శాఖ',
      details: 'సంవత్సరానికి కేవలం ₹20 చెల్లిస్తే ప్రమాద మరణం లేదా పూర్తి వైకల్యానికి ₹2 లక్షల బీమా రక్షణ.',
      benefit: 'ప్రమాదవశాత్తు మరణం లేదా శాశ్వత పూర్తి వైకల్యానికి ₹2,00,000 (పాక్షిక వైకల్యానికి ₹1,00,000) రక్షణ కేవలం ₹20 వార్షిక ప్రీమియంతో.',
      benefits_list: [
        'ప్రమాదవశాత్తు మరణం లేదా పూర్తి వైకల్యానికి ₹2,00,000.',
        'పాక్షిక శాశ్వత వైకల్యానికి ₹1,00,000.',
        'సంవత్సరానికి ప్రీమియం కేవలం ₹20 మాత్రమే.'
      ],
      eligibility_list: ['18 నుండి 70 సంవత్సరాల వయస్సు.', 'పొదుపు బ్యాంక్ ఖాతా కలిగి ఉండాలి.'],
      exclusions_list: ['సహజ మరణం లేదా అనారోగ్యంతో సంభవించే మరణం.'],
      how_to_apply: 'మీ బ్యాంక్ శాఖ లేదా పోస్టాఫీసులో ఆటో-డెబిట్ సమ్మతి ఫారమ్‌ను సమర్పించి చేరండి.',
      application_process: 'బ్యాంకులో సమ్మతి ఫారమ్ ఇవ్వండి, ప్రతి సంవత్సరం మే 31న ₹20 ఆటో-డెబిట్ అవుతుంది.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. బ్యాంక్ పాస్‌బుక్ కాపీ.'],
      faqs: [
        {
          question: 'క్లెయిమ్ కోసం ఏమి కావాలి?',
          answer: 'పోలీస్ ఎఫ్ఐఆర్, పోస్ట్‌మార్టం నివేదిక మరియు మరణ ధృవీకరణ పత్రం 30 రోజులలోపు బ్యాంకులో సమర్పించాలి.'
        }
      ],
      source_url: 'https://financialservices.gov.in/beta/en/pmsby',
      match_reasons: ['వయస్సు (32) 18–70 ఏళ్ల అర్హతను కలిగి ఉంది', 'పొదుపు బ్యాంక్ ఖాతా అందుబాటులో ఉంది', 'అత్యల్ప వార్షిక ప్రీమియం'],
      tags: ['ప్రమాద కవర్ ₹2 లక్షలు', 'ప్రీమియం ₹20/ఏడాది', 'వయస్సు 18–70']
    }
  },

  // 4. PM-JAY
  pmjay: {
    key: 'pmjay',
    matchKeys: ['PM-JAY', 'Ayushman', 'Arogya'],
    en: {
      name: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY)',
      type: 'Free Cashless Hospitalization',
      ministry: 'Ministry of Health and Family Welfare (National Health Authority)',
      details: 'World largest government-funded healthcare scheme providing ₹5,00,000 per family per year for secondary and tertiary care across 27,000+ hospitals.',
      benefit: '₹5,00,000 free cashless medical & surgical treatment per family per year across 27,000+ empanelled government and private hospitals.',
      benefits_list: [
        '₹5,00,000 annual cashless coverage per family on a family floater basis.',
        'Covers 1,949 medical and surgical procedures including cancer, cardiology, and surgeries.',
        'Pre-existing conditions covered from day 1.',
        'Pre and post hospitalization expenses covered for 3 and 15 days respectively.'
      ],
      eligibility_list: [
        'Households identified in SECC 2011 or NFSA Ration Card list as vulnerable/informal workers.',
        'No restriction on family size or age of family members.'
      ],
      exclusions_list: [
        'Families paying income tax or owning motorized vehicles/pucca agricultural holdings.'
      ],
      how_to_apply: 'Visit nearest Ayushman Mitra kiosk at any government hospital or Common Service Centre (CSC) with Ration Card and Aadhaar.',
      application_process: 'Step 1: Verify name at mera.pmjay.gov.in.\nStep 2: Visit nearest hospital or CSC kiosk with Aadhaar and Ration Card.\nStep 3: Complete biometric e-KYC and collect Ayushman Card PVC.',
      documents_required: ['1. Aadhaar Card of all family members.', '2. State Ration Card.', '3. Active mobile number.'],
      faqs: [
        {
          question: 'Are private hospitals included?',
          answer: 'Yes, over 12,000 empanelled private hospitals provide 100% cashless treatment under PM-JAY.'
        }
      ],
      source_url: 'https://nha.gov.in/PM-JAY',
      match_reasons: ['BPL / Informal income band matches eligibility', 'Covers all family dependents', 'Zero out-of-pocket costs'],
      tags: ['₹5 Lakh Free Hospital Care', 'Cashless Treatment', 'Secondary & Tertiary Care']
    },
    hi: {
      name: 'आयुष्मान भारत प्रधानमंत्री जन आरोग्य योजना (PM-JAY)',
      type: 'मुफ्त कैशलेस अस्पताल इलाज',
      ministry: 'स्वास्थ्य एवं परिवार कल्याण मंत्रालय',
      details: 'प्रति परिवार प्रति वर्ष ₹5 लाख का मुफ्त कैशलेस इलाज 27,000+ अस्पतालों में।',
      benefit: 'प्रति परिवार प्रति वर्ष ₹5,00,000 तक का मुफ्त कैशलेस इलाज व सर्जरी 27,000+ सरकारी व निजी सूचीबद्ध अस्पतालों में।',
      benefits_list: [
        '₹5,00,000 प्रति परिवार प्रति वर्ष मुफ्त स्वास्थ्य सुरक्षा।',
        'हार्ट, कैंसर, सर्जरी सहित 1,900+ उपचार कैशलेस।'
      ],
      eligibility_list: ['राशन कार्ड धारक व सामाजिक आर्थिक जनगणना (SECC) में सूचीबद्ध परिवार।'],
      exclusions_list: ['आयकर दाता या सरकारी कर्मचारी।'],
      how_to_apply: 'अपने राशन कार्ड और आधार कार्ड के साथ किसी भी सरकारी अस्पताल में आयुष्मान मित्र डेस्क या जन सेवा केंद्र (CSC) पर जाएं।',
      application_process: 'सीएससी केंद्र जाएं, आधार व राशन कार्ड से ई-केवाईसी कराएं और आयुष्मान कार्ड प्राप्त करें।',
      documents_required: ['1. आधार कार्ड।', '2. राशन कार्ड।'],
      faqs: [
        {
          question: 'क्या पुरानी बीमारियां कवर होती हैं?',
          answer: 'हाँ, पहले से मौजूद सभी बीमारियां पहले दिन से कवर होती हैं।'
        }
      ],
      source_url: 'https://nha.gov.in/PM-JAY',
      match_reasons: ['पारिवारिक आय सीमा पात्रता के अनुकूल है', 'परिवार के सभी आश्रित शामिल हैं', 'अस्पताल में कोई अग्रिम भुगतान नहीं'],
      tags: ['₹5 लाख मुफ्त अस्पताल इलाज', 'कैशलेस सुविधा', 'पूरे परिवार के लिए']
    },
    te: {
      name: 'ఆయుష్మాన్ భారత్ ప్రధాన మంత్రి జన్ ఆరోగ్య యోజన (PM-JAY)',
      type: 'ఉచిత నగదు రహిత ఆసుపత్రి చికిత్స',
      ministry: 'ఆరోగ్య మరియు కుటుంబ సంక్షేమ మంత్రిత్వ శాఖ',
      details: 'ప్రతి కుటుంబానికి ఏడాదికి ₹5 లక్షల వరకు ఉచిత క్యాష్‌లెస్‌ ఆసుపత్రి చికిత్స.',
      benefit: 'ప్రతి కుటుంబానికి సంవత్సరానికి ₹5,00,000 వరకు ఉచిత క్యాష్‌లెస్‌ వైద్య చికిత్స మరియు శస్త్రచికిత్సలు దేశవ్యాప్తంగా గుర్తింపు పొందిన ఆసుపత్రులలో.',
      benefits_list: [
        'ప్రతి కుటుంబానికి ₹5 లక్షల వరకు ఉచిత క్యాష్‌లెస్‌ చికిత్స.',
        'గుండె, క్యాన్సర్, ఆపరేషన్లతో సహా 1,900+ వ్యాధులకు చికిత్స.'
      ],
      eligibility_list: ['రేషన్ కార్డు కలిగిన అసంఘటిత మరియు నిరుపేద కుటుంబాలు.'],
      exclusions_list: ['ఆదాయపు పన్ను చెల్లించే కుటుంబాలు.'],
      how_to_apply: 'రేషన్ కార్డ్ మరియు ఆధార్‌తో ఏదైనా ప్రభుత్వ ఆసుపత్రిలోని ఆయుష్మాన్ మిత్ర కేంద్రం లేదా సమీప CSC కేంద్రాన్ని సంప్రదించండి.',
      application_process: 'CSC కేంద్రాన్ని సందర్శించి ఆధార్ మరియు రేషన్ కార్డు ద్వారా ఈ-కేవైసీ పూర్తి చేసి ఆయుష్మాన్ కార్డు పొందండి.',
      documents_required: ['1. ఆధార్ కార్డు.', '2. రేషన్ కార్డు.'],
      faqs: [
        {
          question: 'ప్రైవేట్ ఆసుపత్రులలో చెల్లుతుందా?',
          answer: 'అవును, నెట్‌వర్క్ ప్రైవేట్ ఆసుపత్రులలో కూడా 100% ఉచితంగా చికిత్స పొందవచ్చు.'
        }
      ],
      source_url: 'https://nha.gov.in/PM-JAY',
      match_reasons: ['కుటుంబ ఆదాయ స్థాయి అర్హతకు తగినట్లుగా ఉంది', 'కుటుంబ సభ్యులందరికీ వర్తిస్తుంది', 'నగదు రహిత చికిత్స'],
      tags: ['₹5 లక్షల ఉచిత వైద్యం', 'క్యాష్‌లెస్‌ కార్డు', 'మొత్తం కుటుంబానికి']
    }
  },

  // 5. APY
  apy: {
    key: 'apy',
    matchKeys: ['APY', 'Atal Pension'],
    en: {
      name: 'Atal Pension Yojana (APY)',
      type: 'Guaranteed Social Pension',
      ministry: 'Ministry of Finance (PFRDA)',
      details: 'Government guaranteed pension scheme for all unorganised citizens offering lifelong ₹1,000 to ₹5,000 monthly pension from age 60.',
      benefit: 'Guaranteed monthly lifetime pension of ₹1,000 to ₹5,000 after age 60. On demise, spouse receives pension, and nominee receives accumulated corpus.',
      benefits_list: [
        'Guaranteed monthly pension of ₹1,000, ₹2,000, ₹3,000, ₹4,000, or ₹5,000 from age 60.',
        'Spouse gets identical monthly pension for life upon subscriber demise.',
        'Full accumulated pension wealth handed over to nominee on death of both subscriber and spouse.'
      ],
      eligibility_list: [
        'Age between 18 and 40 years with a savings bank or post office account.',
        'Citizen must not be an income tax payer.'
      ],
      exclusions_list: ['Income tax payers as per October 2022 rules.'],
      how_to_apply: 'Submit APY subscriber registration form at your bank where you hold your savings account.',
      application_process: 'Submit APY form at your bank branch or activate through netbanking with auto-debit consent.',
      documents_required: ['1. Aadhaar Card.', '2. Bank Account Passbook.', '3. Mobile Number.'],
      faqs: [
        {
          question: 'Can I increase or decrease my pension tier later?',
          answer: 'Yes, once a year in April you can upgrade or downgrade your pension slab.'
        }
      ],
      source_url: 'https://pfrda.org.in/index1.cshtml?lsid=16',
      match_reasons: ['Age (32) is in the 18–40 entry window', 'Active bank account detected', 'Unorganised worker pension tier'],
      tags: ['₹1000–₹5000/mo Pension', 'Government Guaranteed', 'Spouse Continuity']
    },
    hi: {
      name: 'अटल पेंशन योजना (APY)',
      type: 'निश्चित मासिक पेंशन',
      ministry: 'वित्त मंत्रालय (PFRDA)',
      details: '60 वर्ष के बाद ₹1,000 से ₹5,000 प्रति माह की आजीवन गारंटीड सरकारी पेंशन।',
      benefit: '60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह की आजीवन गारंटीड पेंशन। पति/पत्नी को पेंशन निरंतरता व नॉमिनी को पूरी संचित राशि।',
      benefits_list: [
        '60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 प्रति माह आजीवन पेंशन।',
        'पति/पत्नी को पेंशन निरंतरता तथा नॉमिनी को संचित राशि।'
      ],
      eligibility_list: ['18 से 40 वर्ष की आयु।', 'गैर-आयकर दाता भारतीय नागरिक।'],
      exclusions_list: ['आयकर दाता।'],
      how_to_apply: 'जिस बैंक में आपका खाता है, वहाँ अटल पेंशन योजना फॉर्म भरकर ऑटो-डेबिट शुरू करवाएं।',
      application_process: 'बैंक शाखा जाएं, एपीवाई फॉर्म भरें और ऑटो-डेबिट शुरू कराएं।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक खाता पासबुक।'],
      faqs: [
        {
          question: 'पेंशन कब शुरू होती है?',
          answer: '60 वर्ष की आयु पूरी होने पर पेंशन बैंक खाते में हर महीने आने लगती है।'
        }
      ],
      source_url: 'https://pfrda.org.in/index1.cshtml?lsid=16',
      match_reasons: ['आयु (32) 18–40 वर्ष की प्रवेश सीमा में है', 'सक्रिय बैंक खाता मौजूद है', 'असंगठित कामगारों के लिए सुरक्षित बुढ़ापा'],
      tags: ['₹1000–₹5000 मासिक पेंशन', 'सरकारी गारंटी', 'जीवनभर सुरक्षा']
    },
    te: {
      name: 'అటల్ పెన్షన్ యోజన (APY)',
      type: 'హామీ ఇవ్వబడిన సామాజిక పింఛను',
      ministry: 'ఆర్థిక మంత్రిత్వ శాఖ',
      details: '60 ఏళ్లు దాటిన తర్వాత జీవితాంతం నెలకు ₹1,000 నుండి ₹5,000 వరకు ప్రభుత్వ హామీ పింఛను.',
      benefit: '60 సంవత్సరాల వయస్సు దాటిన తర్వాత నెలకు ₹1,000 నుండి ₹5,000 వరకు జీవితాంతం గ్యారెంటీ పింఛను. జీవిత భాగస్వామికి మరియు నామినీకి భద్రత.',
      benefits_list: [
        '60 ఏళ్ల తర్వాత జీవితాంతం నెలకు ₹1,000 నుండి ₹5,000 గ్యారెంటీ పింఛను.',
        'భార్య/భర్తకు పింఛను కొనసాగింపు మరియు నామినీకి మొత్తం నిధి వాపసు.'
      ],
      eligibility_list: ['18 నుండి 40 సంవత్సరాల వయస్సు.', 'ఆదాయపు పన్ను చెల్లించని భారతీయ పౌరులు.'],
      exclusions_list: ['ఇన్‌కమ్ ట్యాక్స్ కట్టేవారు.'],
      how_to_apply: 'మీ పొదుపు ఖాతా ఉన్న బ్యాంక్ బ్రాంచ్‌ను సందర్శించి APY నమోదు దరఖాస్తును సమర్పించండి.',
      application_process: 'బ్యాంకులో దరఖాస్తు ఫారమ్ సమర్పించండి, ఖాతా నుండి ప్రీమియం ఆటో-డెబిట్ అవుతుంది.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. బ్యాంక్ పాస్‌బుక్ కాపీ.'],
      faqs: [
        {
          question: 'పింఛను ఎప్పుడు ప్రారంభమవుతుంది?',
          answer: 'మీకు 60 సంవత్సరాలు నిండిన వెంటనే ప్రతి నెలా బ్యాంక్ ఖాతాలో పింఛను జమ అవుతుంది.'
        }
      ],
      source_url: 'https://pfrda.org.in/index1.cshtml?lsid=16',
      match_reasons: ['వయస్సు (32) 18–40 సంవత్సరాల లోపు ఉంది', 'బ్యాంక్ ఖాతా ధృవీకరించబడింది', 'అసంఘటిత కార్మికుల భవిష్యత్ భద్రత'],
      tags: ['నెలకు ₹1000–₹5000 పింఛను', 'ప్రభుత్వ హామీ', 'వృద్ధాప్య రక్షణ']
    }
  },

  // 6. PM-SYM
  pmsym: {
    key: 'pmsym',
    matchKeys: ['PM-SYM', 'Shram Yogi'],
    en: {
      name: 'Pradhan Mantri Shram Yogi Maan-dhan (PM-SYM)',
      type: 'Unorganised Worker Pension',
      ministry: 'Ministry of Labour and Employment',
      details: 'Old age pension scheme for unorganised workers with 50% matching contribution by the Central Government.',
      benefit: '₹3,000 assured monthly pension after age 60 for informal workers, street vendors, rickshaw pullers, and daily wagers. 50% matching govt contribution.',
      benefits_list: [
        '₹3,000 guaranteed lifelong monthly pension from age 60.',
        'Central Government contributes 50% matching amount every month.',
        'Family pension: 50% (₹1,500/mo) payable to spouse upon death of pensioner.'
      ],
      eligibility_list: [
        'Unorganised workers (drivers, vendors, construction, domestic, agricultural).',
        'Age between 18 and 40 years.',
        'Monthly income of ₹15,000 or below.'
      ],
      exclusions_list: ['Organised sector workers covered under EPF/NPS/ESIC or paying income tax.'],
      how_to_apply: 'Visit any Common Service Centre (CSC) with Aadhaar card and savings bank passbook. Enrolled on the spot.',
      application_process: 'Step 1: Visit nearest CSC center with Aadhaar and bank passbook.\nStep 2: Biometric authentication and spot issuance of Shram Yogi Maandhan Card.',
      documents_required: ['1. Aadhaar Card.', '2. Savings Bank Passbook or Jan Dhan Passbook.', '3. Active Mobile Number.'],
      faqs: [
        {
          question: 'How much monthly contribution do I pay?',
          answer: 'Between ₹55 to ₹200 per month depending on entry age (₹55 at age 18, ₹100 at age 29, ₹200 at age 40).'
        }
      ],
      source_url: 'https://maandhan.in',
      match_reasons: ['Daily wage / unorganised worker occupation verified', 'Age (32) satisfies 18–40 entry rule', 'Monthly income below ₹15,000 limit'],
      tags: ['₹3,000/mo Pension', '50% Govt Matching Contribution', 'CSC Spot Enrollment']
    },
    hi: {
      name: 'प्रधानमंत्री श्रम योगी मान-धन योजना (PM-SYM)',
      type: 'असंगठित कामगार वृद्धावस्था पेंशन',
      ministry: 'श्रम एवं रोजगार मंत्रालय',
      details: 'दिहाड़ी मजदूरों व असंगठित कामगारों के लिए 60 वर्ष बाद ₹3,000 मासिक पेंशन। 50% सरकार का अंशदान।',
      benefit: '60 वर्ष की आयु के बाद ₹3,000 निश्चित मासिक पेंशन। केंद्र सरकार का 50% बराबर का मासिक अंशदान।',
      benefits_list: ['60 वर्ष के बाद ₹3,000 निश्चित मासिक पेंशन।', '50% केंद्र सरकार का बराबर अंशदान।'],
      eligibility_list: ['असंगठित कामगार (मासिक आय ₹15,000 तक)।', '18 से 40 वर्ष की आयु।'],
      exclusions_list: ['ईपीएफ / ईएसआईसी / एनपीएस से जुड़े संगठित कर्मचारी या आयकर दाता।'],
      how_to_apply: 'अपने नजदीकी जन सेवा केंद्र (CSC) पर आधार कार्ड व बैंक पासबुक लेकर जाएं। तत्काल कार्ड जारी।',
      application_process: 'सीएससी केंद्र जाएं, बायोमेट्रिक कराएं और तुरंत कार्ड प्राप्त करें।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक पासबुक।'],
      faqs: [{ question: 'अंशदान कितना देना होता है?', answer: 'उम्र के आधार पर ₹55 से ₹200 प्रति माह।' }],
      source_url: 'https://maandhan.in',
      match_reasons: ['दिहाड़ी मजदूर / असंगठित व्यवसाय सत्यापित', 'आयु (32) 18–40 वर्ष के नियम के अनुकूल', 'मासिक आय ₹15,000 से कम'],
      tags: ['₹3,000 मासिक पेंशन', '50% सरकारी अंशदान', 'तुरंत कार्ड जारी']
    },
    te: {
      name: 'ప్రధాన మంత్రి శ్రమ యోగి మాన్-ధన్ (PM-SYM)',
      type: 'అసంఘటిత కార్మిక పింఛను పథకం',
      ministry: 'కార్మిక మరియు ఉపాధి మంత్రిత్వ శాఖ',
      details: 'అసంఘటిత రోజువారీ కార్మికులకు 60 ఏళ్ల తర్వాత నెలకు ₹3,000 పింఛను. ప్రభుత్వం 50% మ్యాచింగ్ గ్రాంట్ అందిస్తుంది.',
      benefit: '60 ఏళ్లు నిండిన తర్వాత ప్రతి నెలా ₹3,000 హామీ పింఛను. మీరు చెల్లించే మొత్తానికి సమానంగా ప్రభుత్వం 50% జమ చేస్తుంది.',
      benefits_list: ['60 ఏళ్ల తర్వాత నెలకు ₹3,000 హామీ పింఛను.', 'కేంద్ర ప్రభుత్వం 50% మ్యాచింగ్ కంట్రిబ్యూషన్.'],
      eligibility_list: ['అసంఘటిత కార్మికులు (నెలకు ₹15,000 లోపు ఆదాయం).', '18 నుండి 40 సంవత్సరాల వయస్సు.'],
      exclusions_list: ['ఈపీఎఫ్, ఈఎస్ఐ లేదా ఆదాయపు పన్ను వర్తించే ఉద్యోగులు.'],
      how_to_apply: 'ఆధార్ కార్డ్ మరియు బ్యాంక్ పాస్‌బుక్‌తో సమీపంలోని కామన్ సర్వీస్ సెంటర్ (CSC) వద్ద వెంటనే నమోదు చేసుకోండి.',
      application_process: 'CSC కేంద్రాన్ని సందర్శించి బయోమెట్రిక్ పూర్తి చేసి వెంటనే స్మార్ట్ కార్డు పొందండి.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. బ్యాంక్ పాస్‌బుక్ కాపీ.'],
      faqs: [{ question: 'నెలవారీ చెల్లింపు ఎంత?', answer: 'చేరే వయస్సును బట్టి నెలకు ₹55 నుండి ₹200 మాత్రమే.' }],
      source_url: 'https://maandhan.in',
      match_reasons: ['రోజువారీ కూలీ / అసంఘటిత వృత్తి వర్తిస్తుంది', 'వయస్సు (32) 18–40 పరిమితిలో ఉంది', 'నెలకు ₹15,000 లోపు ఆదాయం'],
      tags: ['నెలకు ₹3,000 పింఛను', '50% ప్రభుత్వ భాగస్వామ్యం', 'వెంటనే కార్డు జారీ']
    }
  },

  // 7. PMJDY
  pmjdy: {
    key: 'pmjdy',
    matchKeys: ['PMJDY', 'Jan Dhan'],
    en: {
      name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
      type: 'Universal Financial Inclusion Banking',
      ministry: 'Ministry of Finance',
      details: 'National mission for comprehensive financial inclusion ensuring universal access to banking services with zero minimum balance requirement.',
      benefit: 'Zero balance savings account with free RuPay debit card, ₹2 Lakh inbuilt accidental cover, and ₹10,000 overdraft facility.',
      benefits_list: [
        'Zero balance account with no minimum balance maintenance charges.',
        'Free RuPay debit card with inbuilt ₹2,00,000 accidental insurance cover.',
        'Overdraft (OD) facility up to ₹10,000 for eligible account holders.',
        'Direct Benefit Transfer (DBT) eligible for all central welfare schemes.'
      ],
      eligibility_list: ['Any Indian citizen aged 10 years and above with valid KYC (Aadhaar/Voter ID).'],
      exclusions_list: ['Existing holders of full KYC savings accounts in the same bank.'],
      how_to_apply: 'Open account at any bank branch or Bank Mitra kiosk with basic KYC (Aadhaar or Voter ID).',
      application_process: 'Visit any bank branch or Bank Mitra kiosk with Aadhaar and photo. Account opened in 15 minutes.',
      documents_required: ['1. Aadhaar Card or Voter ID.', '2. Two passport size photographs.'],
      faqs: [{ question: 'Are there charges if balance becomes zero?', answer: 'No, PMJDY accounts are 100% zero-balance with no penalties.' }],
      source_url: 'https://pmjdy.gov.in',
      match_reasons: ['Financial safety net foundation', 'Zero balance and free RuPay card', 'Built-in ₹2L accident cover'],
      tags: ['Zero Minimum Balance', 'Free RuPay Debit Card', '₹10,000 Overdraft']
    },
    hi: {
      name: 'प्रधानमंत्री जन धन योजना (PMJDY)',
      type: 'शून्य बैलेंस बचत बैंक खाता',
      ministry: 'वित्त मंत्रालय',
      details: 'बिना किसी न्यूनतम राशि के शून्य बैलेंस खाता, मुफ्त रुपे कार्ड व ₹2 लाख का दुर्घटना कवर।',
      benefit: 'शून्य बैलेंस बचत खाता, मुफ्त रुपे डेबिट कार्ड, ₹2 लाख इनबिल्ट दुर्घटना कवर और ₹10,000 ओवरड्राफ्ट सुविधा।',
      benefits_list: ['शून्य बैलेंस खाता।', 'मुफ्त रुपे कार्ड के साथ ₹2 लाख का इनबिल्ट बीमा।', '₹10,000 ओवरड्राफ्ट सुविधा।'],
      eligibility_list: ['10 वर्ष से अधिक आयु का कोई भी भारतीय नागरिक।'],
      exclusions_list: ['समान बैंक में पूर्व सक्रिय बचत खाता।'],
      how_to_apply: 'किसी भी बैंक शाखा या बैंक मित्र कियोस्क पर आधार कार्ड के साथ खाता खुलवाएं।',
      application_process: 'आधार कार्ड व फोटो लेकर किसी भी बैंक शाखा जाएं, तत्काल खाता खुल जाता है।',
      documents_required: ['1. आधार कार्ड।', '2. दो पासपोर्ट फोटो।'],
      faqs: [{ question: 'क्या बैलेंस जीरो होने पर जुर्माना लगता है?', answer: 'नहीं, जन धन खाते में कोई पेनल्टी नहीं लगती।' }],
      source_url: 'https://pmjdy.gov.in',
      match_reasons: ['वित्तीय सुरक्षा की बुनियादी नींव', 'शून्य बैलेंस व मुफ्त रुपे कार्ड', '₹2 लाख का इनबिल्ट कवर'],
      tags: ['शून्य बैलेंस खाता', 'मुफ्त रुपे डेबिट कार्ड', '₹10,000 ओवरड्राफ्ट']
    },
    te: {
      name: 'ప్రధాన మంత్రి జన్ ధన్ యోజన (PMJDY)',
      type: 'జీరో బ్యాలెన్స్ బ్యాంక్ ఖాతా',
      ministry: 'ఆర్థిక మంత్రిత్వ శాఖ',
      details: 'ఎటువంటి కనీస నిల్వ అవసరం లేని ఉచిత బ్యాంక్ ఖాతా, ఉచిత రూపే కార్డు మరియు ₹2 లక్షల ప్రమాద బీమా రక్షణ.',
      benefit: 'ఉచిత జీరో బ్యాలెన్స్ ఖాతా, ఉచిత రూపే డెబిట్ కార్డు, ₹2 లక్షల ప్రమాద బీమా రక్షణ మరియు ₹10,000 ఓవర్‌డ్రాఫ్ట్ సౌకర్యం.',
      benefits_list: ['కనీస బ్యాలెన్స్ నిబంధన లేని జీరో బ్యాలెన్స్ ఖాతా.', 'ఉచిత రూపే డెబిట్ కార్డుతో ₹2 లక్షల ప్రమాద బీమా.', '₹10,000 ఓవర్‌డ్రాఫ్ట్ (OD) సదుపాయం.'],
      eligibility_list: ['10 ఏళ్లు పైబడిన ఏ భారతీయ పౌరుడైనా ఖాతా తెరవవచ్చు.'],
      exclusions_list: ['అదే బ్యాంకులో ఇప్పటికే యాక్టివ్ ఖాతా ఉన్నవారు.'],
      how_to_apply: 'ఏదైనా బ్యాంక్ శాఖ లేదా బ్యాంక్ మిత్ర కేంద్రాన్ని ఆధార్ మరియు ఫోటోలతో సందర్శించండి.',
      application_process: 'ఆధార్ మరియు ఫోటోలతో బ్యాంకుకు వెళ్ళండి, కొద్ది నిమిషాల్లోనే ఖాతా ప్రారంభించబడుతుంది.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. రెండు పాస్‌పోర్ట్ సైజు ఫోటోలు.'],
      faqs: [{ question: 'ఖాతాలో డబ్బులు లేకపోతే రుసుము పడుతుందా?', answer: 'లేదు, జన్ ధన్ ఖాతాలో ఎటువంటి ఫైన్లు లేదా ఛార్జీలు ఉండవు.' }],
      source_url: 'https://pmjdy.gov.in',
      match_reasons: ['ఆర్థిక సంక్షేమ ప్రాథమిక వేదిక', 'జీరో బ్యాలెన్స్ మరియు ఉచిత రూపే కార్డు', '₹2 లక్షల ఉచిత ప్రమాద బీమా'],
      tags: ['జీరో బ్యాలెన్స్ బ్యాంకింగ్', 'ఉచిత రూపే కార్డు', '₹10,000 ఓవర్‌డ్రాఫ్ట్']
    }
  },

  // 8. PM SVANidhi
  svanidhi: {
    key: 'svanidhi',
    matchKeys: ['SVANidhi', 'Street Vendor'],
    en: {
      name: 'PM SVANidhi (Micro-Credit for Street Vendors)',
      type: 'Collateral-Free Street Vendor Loan',
      ministry: 'Ministry of Housing and Urban Affairs',
      details: 'Micro-credit facility for street vendors providing working capital loans of ₹10,000, ₹20,000, and ₹50,000 with 7% interest subsidy.',
      benefit: 'Collateral-free working capital loan starting at ₹10,000 with 7% interest subsidy and up to ₹1,200 annual cashback on digital UPI transactions.',
      benefits_list: [
        '1st tranche: ₹10,000 collateral-free loan.',
        '2nd tranche: ₹20,000 on timely repayment.',
        '3rd tranche: ₹50,000 enhanced credit.',
        '7% interest subsidy credited directly to bank account.',
        'Up to ₹1,200 cashback per year on digital payments.'
      ],
      eligibility_list: ['Urban and peri-urban street vendors possessing vending certificate/ID or identified in ULB survey.'],
      exclusions_list: ['Non-vendor businesses or rural farm occupations.'],
      how_to_apply: 'Apply on pmsvanidhi.mohua.gov.in or through Urban Local Body (ULB) / Bank branch.',
      application_process: 'Apply online on pmsvanidhi portal or at local municipality/bank with Vending ID and Aadhaar.',
      documents_required: ['1. Vending Certificate/ID or Recommendation Letter from ULB.', '2. Aadhaar Card.', '3. Bank Passbook.'],
      faqs: [{ question: 'Is collateral needed?', answer: 'No collateral or guarantor is required.' }],
      source_url: 'https://pmsvanidhi.mohua.gov.in',
      match_reasons: ['Street vendor occupation verified', 'Zero collateral required', 'Interest subsidy & cashback incentive'],
      tags: ['Loans Up to ₹50,000', '7% Interest Subsidy', 'Zero Collateral']
    },
    hi: {
      name: 'पीएम स्वनिधि योजना (स्ट्रीट वेंडर ऋण)',
      type: 'बिना गारंटी रेहड़ी-पटरी ऋण',
      ministry: 'आवासन और शहरी कार्य मंत्रालय',
      details: 'स्ट्रीट वेंडर्स के लिए ₹10,000 से ₹50,000 तक का बिना गारंटी कार्यशील पूंजी ऋण, 7% ब्याज सब्सिडी के साथ।',
      benefit: '₹10,000 से शुरू बिना गारंटी ऋण, 7% ब्याज सब्सिडी और डिजिटल लेनदेन पर ₹1,200 तक सालाना कैशबैक।',
      benefits_list: ['₹10,000, ₹20,000 और ₹50,000 की तीन किस्तों में ऋण।', '7% ब्याज सब्सिडी सीधे खाते में।'],
      eligibility_list: ['शहरी वेंडर प्रमाण पत्र धारक रेहड़ी-पटरी विक्रेता।'],
      exclusions_list: ['गैर-स्ट्रीट वेंडर।'],
      how_to_apply: 'pmsvanidhi.mohua.gov.in पोर्टल पर या स्थानीय नगर पालिका में आवेदन करें।',
      application_process: 'वेंडर आईडी और आधार के साथ ऑनलाइन या बैंक शाखा में आवेदन करें।',
      documents_required: ['1. वेंडर पहचान पत्र।', '2. आधार कार्ड।', '3. बैंक पासबुक।'],
      faqs: [{ question: 'क्या कोई गारंटी चाहिए?', answer: 'नहीं, यह पूरी तरह बिना गारंटी का ऋण है।' }],
      source_url: 'https://pmsvanidhi.mohua.gov.in',
      match_reasons: ['स्ट्रीट वेंडर व्यवसाय सत्यापित', 'कोई गारंटी आवश्यक नहीं', '7% ब्याज सब्सिडी'],
      tags: ['ऋण ₹50,000 तक', '7% ब्याज सब्सिडी', 'बिना किसी गारंटी']
    },
    te: {
      name: 'పీఎం స్వనిధి పథకం (స్ట్రీట్ వెండర్ రుణాలు)',
      type: 'పూచీకత్తు లేని చిరు వ్యాపార రుణం',
      ministry: 'గృహ మరియు పట్టణ వ్యవహారాల మంత్రిత్వ శాఖ',
      details: 'వీధి వ్యాపారులకు ఎటువంటి పూచీకత్తు లేకుండా ₹10,000 నుండి ₹50,000 వరకు మూలధన రుణాలు మరియు 7% వడ్డీ రాయితీ.',
      benefit: 'హామీ లేని ₹10,000 నుండి ₹50,000 వరకు వ్యాపార రుణం, 7% వడ్డీ సబ్సిడీ మరియు డిజిటల్ చెల్లింపులపై ₹1,200 క్యాష్‌బ్యాక్.',
      benefits_list: ['మొదటి విడత ₹10,000, సకాలంలో చెల్లిస్తే ₹20,000, ఆపై ₹50,000 రుణం.', '7% వడ్డీ రాయితీ నేరుగా ఖాతాలో జమ.'],
      eligibility_list: ['పట్టణాల్లో వీధి వ్యాపారం చేసే వెండర్ సర్టిఫికేట్ కలిగిన చిరు వ్యాపారులు.'],
      exclusions_list: ['వీధి వ్యాపారం చేయని సాధారణ వ్యక్తులు.'],
      how_to_apply: 'pmsvanidhi.mohua.gov.in వెబ్‌సైట్ లేదా స్థానిక మున్సిపల్ కార్యాలయం / బ్యాంకులో దరఖాస్తు చేసుకోండి.',
      application_process: 'వెండర్ కార్డు మరియు ఆధార్‌తో ఆన్‌లైన్ లేదా మున్సిపల్ కార్యాలయంలో దరఖాస్తు సమర్పించండి.',
      documents_required: ['1. వెండర్ ఐడీ కార్డు.', '2. ఆధార్ కార్డు కాపీ.', '3. బ్యాంక్ పాస్‌బుక్ కాపీ.'],
      faqs: [{ question: 'ఏదైనా తాకట్టు పెట్టాలా?', answer: 'ఎటువంటి పూచీకత్తు లేదా గ్యారెంటర్ అవసరం లేదు.' }],
      source_url: 'https://pmsvanidhi.mohua.gov.in',
      match_reasons: ['స్ట్రీట్ వెండర్ వృత్తి వర్తిస్తుంది', 'ఎటువంటి పూచీకత్తు అవసరం లేదు', '7% వడ్డీ రాయితీ'],
      tags: ['రూ. 50,000 వరకు రుణం', '7% వడ్డీ రాయితీ', 'హామీ లేని రుణం']
    }
  },

  // 9. PM Vishwakarma
  vishwakarma: {
    key: 'vishwakarma',
    matchKeys: ['Vishwakarma'],
    en: {
      name: 'PM Vishwakarma Scheme',
      type: 'Artisan & Craftsperson Empowerment',
      ministry: 'Ministry of MSME',
      details: 'Comprehensive support for 18 traditional trades including carpenters, blacksmiths, goldsmiths, potters, sculptors, and cobblers.',
      benefit: 'Recognition card, skill training with ₹500/day stipend, toolkit grant of ₹15,000, and collateral-free enterprise loan up to ₹3 Lakh at 5% interest.',
      benefits_list: [
        'PM Vishwakarma Certificate & ID Card.',
        'Free 5–7 days basic training with ₹500 daily stipend.',
        '₹15,000 e-voucher toolkit incentive.',
        'Collateral-free credit: ₹1 Lakh (1st tranche) & ₹2 Lakh (2nd tranche) at 5% interest.'
      ],
      eligibility_list: ['Practicing one of the 18 traditional artisan trades (carpenter, potter, tailor, blacksmith, cobbler, mason, etc.).'],
      exclusions_list: ['Families having a government employee or existing Mudra/PMEGP loan defaults.'],
      how_to_apply: 'Register at CSC center with Aadhaar, skill certificate, and bank details.',
      application_process: 'Register with biometric verification at nearest CSC centre. Verification by Gram Panchayat/ULB.',
      documents_required: ['1. Aadhaar Card.', '2. Bank Account Passbook.', '3. Artisan Trade Declaration.'],
      faqs: [{ question: 'How much is the toolkit grant?', answer: '₹15,000 directly provided as a digital e-voucher.' }],
      source_url: 'https://pmvishwakarma.gov.in',
      match_reasons: ['Traditional craft/trade match', '₹15k toolkit grant + ₹500/day stipend', '5% subsidized loans'],
      tags: ['₹15,000 Toolkit Grant', 'Loans Up to ₹3 Lakh at 5%', '₹500/day Stipend']
    },
    hi: {
      name: 'पीएम विश्वकर्मा योजना',
      type: 'पारंपरिक कारीगर व शिल्पकार संवर्धन',
      ministry: 'सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME)',
      details: '18 पारंपरिक व्यवसायों (बढ़ई, लोहार, कुम्हार, दर्जी, मोची आदि) के लिए ₹15,000 टूलकिट अनुदान और 5% पर ₹3 लाख तक का ऋण।',
      benefit: 'पहचान पत्र, ₹500/दिन वजीफे के साथ मुफ्त प्रशिक्षण, ₹15,000 टूलकिट अनुदान और मात्र 5% ब्याज पर ₹3 लाख तक का उद्यम ऋण।',
      benefits_list: ['₹15,000 का टूलकिट अनुदान।', 'प्रशिक्षण के दौरान ₹500 प्रतिदिन स्टाइपेंड।', '5% की रियायती दर पर ₹3 लाख तक का लोन।'],
      eligibility_list: ['18 पारंपरिक व्यवसायों में कार्यरत कारीगर।'],
      exclusions_list: ['सरकारी कर्मचारी परिवार।'],
      how_to_apply: 'सीएससी केंद्र पर आधार और बैंक पासबुक लेकर पंजीकरण कराएं।',
      application_process: 'सीएससी केंद्र जाएं, बायोमेट्रिक कराएं और ग्राम प्रधान/वार्ड सदस्य से सत्यापन कराएं।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक पासबुक।'],
      faqs: [{ question: 'टूलकिट अनुदान कितना मिलता है?', answer: '₹15,000 का ई-वाउचर औजार खरीदने के लिए मिलता है।' }],
      source_url: 'https://pmvishwakarma.gov.in',
      match_reasons: ['पारंपरिक कारीगर व्यवसाय', '₹15,000 टूलकिट व ₹500/दिन स्टाइपेंड', '5% पर ₹3 लाख ऋण'],
      tags: ['₹15,000 टूलकिट ग्रांट', '5% पर ₹3 लाख लोन', '₹500/दिन स्टाइपेंड']
    },
    te: {
      name: 'పీఎం విశ్వకర్మ పథకం',
      type: 'సాంప్రదాయ చేతివృత్తుల సాధికారత',
      ministry: 'ఎంఎస్ఎంఈ మంత్రిత్వ శాఖ',
      details: '18 సాంప్రదాయ వృత్తుల కళాకారులకు (వడ్రంగి, కమ్మరి, కుమ్మరి, టైలర్, శిల్పి మొదలైనవి) ₹15,000 టూల్‌కిట్ గ్రాంట్ మరియు 5% వడ్డీతో ₹3 లక్షల రుణం.',
      benefit: 'విశ్వకర్మ గుర్తింపు కార్డు, ₹500/రోజు స్టైపెండ్‌తో ఉచిత శిక్షణ, ₹15,000 టూల్‌కిట్ గ్రాంట్ మరియు 5% రాయితీ వడ్డీతో ₹3 లక్షల వరకు రుణం.',
      benefits_list: ['₹15,000 ఉచిత టూల్‌కిట్ ఇ-వోచర్.', 'ఉచిత నైపుణ్య శిక్షణతో రోజుకు ₹500 భత్యం.', 'కేవలం 5% వడ్డీతో ₹3 లక్షల వరకు పూచీకత్తు లేని రుణం.'],
      eligibility_list: ['18 సాంప్రదాయ చేతివృత్తులలో ఒకదానిని ఆచరించే చేతివృత్తిదారులు.'],
      exclusions_list: ['కుటుంబంలో ప్రభుత్వ ఉద్యోగి ఉన్నవారు.'],
      how_to_apply: 'ఆధార్ మరియు బ్యాంక్ వివరాలతో సమీప CSC కేంద్రం వద్ద నమోదు చేసుకోండి.',
      application_process: 'CSC కేంద్రాన్ని సందర్శించి బయోమెట్రిక్ నమోదు చేయించుకోండి. గ్రామ పంచాయతీ ద్వారా ధృవీకరణ పూర్తవుతుంది.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. బ్యాంక్ పాస్‌బుక్ కాపీ.'],
      faqs: [{ question: 'టూల్‌కిట్ గ్రాంట్ ఎంత వస్తుంది?', answer: '₹15,000 విలువైన డిజిటల్ ఇ-వోచర్ పరికరాల కొనుగోలుకు లభిస్తుంది.' }],
      source_url: 'https://pmvishwakarma.gov.in',
      match_reasons: ['సాంప్రదాయ చేతివృత్తుల కేటగిరీ', '₹15,000 ఉచిత టూల్‌కిట్ గ్రాంట్', '5% రాయితీ వడ్డీ రుణం'],
      tags: ['₹15,000 టూల్‌కిట్ గ్రాంట్', '5% వడ్డీతో ₹3 లక్షల రుణం', 'రోజుకు ₹500 భత్యం']
    }
  },

  // 10. NFSA
  nfsa: {
    key: 'nfsa',
    matchKeys: ['NFSA', 'Antyodaya', 'Food Security', 'Ration'],
    en: {
      name: 'National Food Security Act (NFSA / Antyodaya Anna Yojana)',
      type: 'Subsidized Food Security Entitlement',
      ministry: 'Ministry of Consumer Affairs, Food & Public Distribution',
      details: 'Highly subsidized / free food grains (rice, wheat, coarse grains) ensuring food security for vulnerable households through the Public Distribution System (PDS).',
      benefit: '35 kg highly subsidized/free food grains (rice, wheat, coarse grains) per month for vulnerable and low-income families.',
      benefits_list: [
        'Antyodaya (AAY) households: 35 kg food grains per family per month free.',
        'Priority Households (PHH): 5 kg food grains per person per month.',
        'One Nation One Ration Card (ONORC) enabled across any ration shop in India.'
      ],
      eligibility_list: ['BPL households, landless laborers, marginal farmers, rural artisans.'],
      exclusions_list: ['Higher income households possessing commercial establishments or 4-wheelers.'],
      how_to_apply: 'Apply through your state Civil Supplies / Food portal or local Gram Panchayat / Tehsildar office.',
      application_process: 'Apply online on state food portal or submit physical form to local Food Inspector / Tahsildar.',
      documents_required: ['1. Aadhaar Card copies of all family members.', '2. Residence Proof.', '3. Income Certificate.'],
      faqs: [{ question: 'Can I collect ration in another state?', answer: 'Yes, under ONORC you can use biometric authentication anywhere in India.' }],
      source_url: 'https://nfsa.gov.in',
      match_reasons: ['BPL / Informal income threshold satisfied', 'Food security coverage for all family dependents', 'One Nation One Ration Card portability'],
      tags: ['35 kg Monthly Food Grains', '100% Free / Subsidized Food', 'One Nation One Ration Card']
    },
    hi: {
      name: 'राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA / अंत्योदय अन्न योजना)',
      type: 'मुफ्त / रियायती खाद्य सुरक्षा',
      ministry: 'उपभोक्ता मामले, खाद्य और सार्वजनिक वितरण मंत्रालय',
      details: 'गरीब और असंगठित परिवारों के लिए हर महीने 35 किलो मुफ्त/रियायती खाद्यान्न।',
      benefit: 'गरीब व कमजोर परिवारों के लिए प्रति माह 35 किलोग्राम मुफ्त/रियायती राशन (चावल, गेहूं) सार्वजनिक वितरण प्रणाली द्वारा।',
      benefits_list: ['अंत्योदय परिवारों को प्रति माह 35 किलो खाद्यान्न।', 'वन नेशन वन राशन कार्ड से देश में कहीं भी राशन।'],
      eligibility_list: ['बीपीएल व कमजोर आय वर्ग के परिवार।'],
      exclusions_list: ['चार पहिया वाहन या पक्का मकान धारक।'],
      how_to_apply: 'राज्य खाद्य एवं रसद पोर्टल या स्थानीय तहसील/पंचायत कार्यालय में आवेदन करें।',
      application_process: 'तहसीलदार कार्यालय या सीएससी पर राशन कार्ड आवेदन फॉर्म जमा करें।',
      documents_required: ['1. सभी सदस्यों के आधार कार्ड।', '2. निवास प्रमाण पत्र।'],
      faqs: [{ question: 'क्या दूसरे राज्य में राशन ले सकते हैं?', answer: 'हाँ, वन नेशन वन राशन कार्ड से किसी भी राशन दुकान से ले सकते हैं।' }],
      source_url: 'https://nfsa.gov.in',
      match_reasons: ['बीपीएल आय सीमा अनुकूल', 'परिवार के सभी सदस्यों को खाद्य सुरक्षा', 'वन नेशन वन राशन कार्ड'],
      tags: ['35 किलो मुफ्त राशन/माह', 'खाद्य सुरक्षा गारंटी', 'वन नेशन वन राशन कार्ड']
    },
    te: {
      name: 'జాతీయ ఆహార భద్రతా చట్టం (NFSA / అంత్యోదయ అన్న యోజన)',
      type: 'ఉచిత / రాయితీ ఆహార భద్రత',
      ministry: 'వినియోగదారుల వ్యవహారాలు, ఆహార మరియు ప్రజా పంపిణీ మంత్రిత్వ శాఖ',
      details: 'నిరుపేద కుటుంబాలకు ప్రతి నెలా 35 కిలోల ఉచిత/రాయితీ బియ్యం మరియు నిత్యావసర సరుకులు.',
      benefit: 'నిరుపేద కుటుంబాలకు ప్రతి నెలా 35 కిలోల ఉచిత ఆహార ధాన్యాలు (బియ్యం, గోధుమలు) ప్రజా పంపిణీ వ్యవస్థ (PDS) ద్వారా లభిస్తాయి.',
      benefits_list: ['అంత్యోదయ కుటుంబాలకు నెలకు 35 కిలోల ఆహార ధాన్యాలు.', 'వన్ నేషన్ వన్ రేషన్ కార్డు ద్వారా దేశంలో ఎక్కడైనా రేషన్ పొందే సౌలభ్యం.'],
      eligibility_list: ['బిపిఎల్ కుటుంబాలు, రోజువారీ కూలీలు మరియు సన్నకారు రైతులు.'],
      exclusions_list: ['నాలుగు చక్రాల వాహనాలు లేదా ఆదాయపు పన్ను చెల్లించే కుటుంబాలు.'],
      how_to_apply: 'రాష్ట్ర పౌర సరఫరాల పోర్టల్ లేదా స్థానిక గ్రామ పంచాయతీ / తహశీల్దార్ కార్యాలయం ద్వారా దరఖాస్తు చేసుకోండి.',
      application_process: 'మీ సేవా లేదా గ్రామ సచివాలయంలో కుటుంబ సభ్యుల ఆధార్‌తో దరఖాస్తు సమర్పించండి.',
      documents_required: ['1. కుటుంబ సభ్యులందరి ఆధార్ కార్డులు.', '2. నివాస ధృవీకరణ పత్రం.'],
      faqs: [{ question: 'ఇతర రాష్ట్రాల్లో రేషన్ తీసుకోవచ్చా?', answer: 'అవును, వన్ నేషన్ వన్ రేషన్ కార్డు విధానంలో దేశంలో ఎక్కడైనా రేషన్ తీసుకోవచ్చు.' }],
      source_url: 'https://nfsa.gov.in',
      match_reasons: ['నిరుపేద ఆదాయ పరిమితి నిబంధనలకు అనుకూలం', 'మొత్తం కుటుంబానికి ఆహార భద్రత', 'వన్ నేషన్ వన్ రేషన్ కార్డు సదుపాయం'],
      tags: ['నెలకు 35 కిలోల ఉచిత బియ్యం', 'ఆహార భద్రత రక్షణ', 'వన్ నేషన్ వన్ రేషన్ కార్డు']
    }
  },

  // 11. e-Shram
  eshram: {
    key: 'eshram',
    matchKeys: ['e-Shram', 'eshram', 'UAN'],
    en: {
      name: 'e-Shram Social Security Registration',
      type: 'Universal Social Security Identity',
      ministry: 'Ministry of Labour and Employment',
      details: 'National database of unorganised workers creating universal 12-digit UAN card with ₹2,00,000 free accidental insurance and direct DBT welfare access.',
      benefit: 'Universal 12-digit UAN card for unorganised workers with ₹2 Lakh free accidental insurance and direct DBT integration for welfare.',
      benefits_list: [
        'Universal 12-digit UAN ID recognized nationwide.',
        '₹2,00,000 accidental death insurance and ₹1,00,000 partial disability cover.',
        'Direct cash benefit transfer in case of national emergencies or natural calamities.',
        'Seamless integration with PM-SYM, PMSBY, and PM-JAY.'
      ],
      eligibility_list: ['Unorganised worker aged 18–59 years not registered in EPFO or ESIC.'],
      exclusions_list: ['Income tax payees or members of EPFO/ESIC.'],
      how_to_apply: 'Self-register on eshram.gov.in or through nearest CSC with Aadhaar and bank details.',
      application_process: 'Self-register in 5 minutes on eshram.gov.in with OTP verification or visit CSC.',
      documents_required: ['1. Aadhaar Card linked with active mobile number.', '2. Bank Account Passbook.'],
      faqs: [{ question: 'Is there any registration fee?', answer: 'No, registration on e-Shram is 100% free.' }],
      source_url: 'https://eshram.gov.in',
      match_reasons: ['Unorganised worker occupation', 'Age is within 18–59 threshold', 'Free ₹2L accidental insurance'],
      tags: ['Universal 12-digit UAN', '₹2 Lakh Free Accidental Cover', '100% Free Registration']
    },
    hi: {
      name: 'ई-श्रम सामाजिक सुरक्षा पंजीकरण (e-Shram)',
      type: 'असंगठित कामगार पहचान पत्र',
      ministry: 'श्रम एवं रोजगार मंत्रालय',
      details: 'असंगठित कामगारों के लिए 12 अंकों का विशिष्ट यूएएन कार्ड व ₹2 लाख का मुफ्त दुर्घटना बीमा।',
      benefit: 'असंगठित कामगारों के लिए 12 अंकों का राष्ट्रीय यूएएन कार्ड, ₹2 लाख का मुफ्त दुर्घटना कवर और आपदाओं में सीधी आर्थिक मदद।',
      benefits_list: ['12 अंकों का राष्ट्रीय पहचान कार्ड।', '₹2 लाख का मुफ्त दुर्घटना बीमा।', 'सरकारी योजनाओं का सीधा लाभ।'],
      eligibility_list: ['18 से 59 वर्ष की आयु के असंगठित कामगार।'],
      exclusions_list: ['ईपीएफओ/ईएसआईसी सदस्य या आयकर दाता।'],
      how_to_apply: 'eshram.gov.in पर स्वयं या नजदीकी जन सेवा केंद्र (CSC) पर पंजीकरण कराएं।',
      application_process: 'eshram.gov.in पर आधार ओटीपी से 5 मिनट में पंजीकरण करें और यूएएन कार्ड डाउनलोड करें।',
      documents_required: ['1. आधार से लिंक मोबाइल नंबर।', '2. बैंक खाता विवरण।'],
      faqs: [{ question: 'क्या पंजीकरण शुल्क लगता है?', answer: 'नहीं, यह पूरी तरह निशुल्क है।' }],
      source_url: 'https://eshram.gov.in',
      match_reasons: ['असंगठित कामगार व्यवसाय', '18–59 वर्ष की आयु', '₹2 लाख का मुफ्त दुर्घटना कवर'],
      tags: ['12 अंकों का यूएएन कार्ड', '₹2 लाख मुफ्त दुर्घटना बीमा', 'पूर्णतः निशुल्क']
    },
    te: {
      name: 'ఈ-శ్రమ్ సామాజిక భద్రతా నమోదు (e-Shram)',
      type: 'అసంఘటిత కార్మిక గుర్తింపు కార్డు',
      ministry: 'కార్మిక మరియు ఉపాధి మంత్రిత్వ శాఖ',
      details: 'అసంఘటిత కార్మికుల కోసం 12 అంకెల యూనివర్సల్ యుఎఎన్ కార్డు మరియు ₹2 లక్షల ఉచిత ప్రమాద బీమా.',
      benefit: 'అసంఘటిత కార్మికులకు 12 అంకెల జాతీయ UAN గుర్తింపు కార్డు, ₹2 లక్షల ఉచిత ప్రమాద బీమా మరియు ప్రభుత్వ సంక్షేమ పథకాల ప్రత్యక్ష లబ్ధి.',
      benefits_list: ['దేశవ్యాప్తంగా గుర్తింపు పొందిన 12 అంకెల UAN కార్డు.', '₹2 లక్షల ఉచిత ప్రమాద బీమా రక్షణ.', 'ఆపద సమయాల్లో నేరుగా ఖాతాలో నగదు సహాయం.'],
      eligibility_list: ['18 నుండి 59 ఏళ్ల వయస్సు గల అసంఘటిత రంగ కార్మికులు.'],
      exclusions_list: ['ఈపీఎఫ్ లేదా ఈఎస్ఐ సభ్యులు.'],
      how_to_apply: 'eshram.gov.in పోర్టల్‌లో ఉచితంగా లేదా సమీప CSC కేంద్రంలో ఆధార్ వివరాలతో నమోదు చేసుకోండి.',
      application_process: 'ఆధార్ ఓటీపీ ద్వారా eshram.gov.in లో 5 నిమిషాల్లో స్వీయ నమోదు పూర్తి చేసుకోవచ్చు.',
      documents_required: ['1. ఆధార్‌తో లింక్ అయిన మొబైల్ నంబర్.', '2. బ్యాంక్ ఖాతా పాస్‌బుక్ కాపీ.'],
      faqs: [{ question: 'నమోదుకు డబ్బులు కట్టాలా?', answer: 'లేదు, ఈ-శ్రమ్ నమోదు 100% ఉచితం.' }],
      source_url: 'https://eshram.gov.in',
      match_reasons: ['అసంఘటిత కార్మిక వర్గం', '18–59 సంవత్సరాల వయస్సు', '₹2 లక్షల ఉచిత ప్రమాద బీమా'],
      tags: ['12 అంకెల UAN కార్డు', '₹2 లక్షల ఉచిత ప్రమాద బీమా', 'ఉచిత నమోదు']
    }
  },

  // 12. PMMY Mudra
  mudra: {
    key: 'mudra',
    matchKeys: ['MUDRA', 'PMMY', 'Shishu', 'Kishore'],
    en: {
      name: 'Pradhan Mantri Mudra Yojana (PMMY)',
      type: 'Collateral-Free Micro Enterprise Loan',
      ministry: 'Ministry of Finance',
      details: 'Collateral-free institutional credit up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises across Shishu, Kishore, and Tarun categories.',
      benefit: 'Collateral-free loans: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakh), and Tarun (up to ₹10 Lakh) for micro-enterprises and shops.',
      benefits_list: [
        'Shishu: Loans up to ₹50,000 with minimal paperwork for new tiny businesses.',
        'Kishore: Loans from ₹50,000 to ₹5,00,000 for expanding units.',
        'Tarun: Loans from ₹5,00,000 up to ₹10,00,000 for established setups.',
        'Zero collateral security or third-party guarantor required.',
        'Mudra Card provided for flexible cash credit withdrawal.'
      ],
      eligibility_list: ['Non-corporate, non-farm small/micro enterprises in manufacturing, trading, or service.'],
      exclusions_list: ['Corporate entities or defaults with commercial banks.'],
      how_to_apply: 'Apply at any commercial bank, regional rural bank (RRB), or via Udyamimitra portal.',
      application_process: 'Submit Mudra application form with business proposal to your bank or apply online at udyamimitra.in.',
      documents_required: ['1. Aadhaar & PAN Card.', '2. Business address proof.', '3. 6 months bank statement.'],
      faqs: [{ question: 'Is collateral needed for Mudra loans?', answer: 'No collateral security is required for any Mudra loan up to ₹10 Lakh.' }],
      source_url: 'https://mudra.org.in',
      match_reasons: ['Informal micro-enterprise match', 'Zero collateral or third-party guarantor', 'Regulated subsidized bank interest'],
      tags: ['Loans Up to ₹10 Lakh', 'Zero Collateral Required', 'Mudra Debit Card']
    },
    hi: {
      name: 'प्रधानमंत्री मुद्रा योजना (PMMY - सूक्ष्म उद्यम ऋण)',
      type: 'बिना गारंटी सूक्ष्म व्यापार ऋण',
      ministry: 'वित्त मंत्रालय',
      details: 'छोटे व्यवसायों व दुकानों के लिए बिना किसी संपत्ति गारंटी के ₹10 लाख तक का ऋण।',
      benefit: 'बिना किसी संपत्ति गारंटी के लोन: शिशु (₹50,000 तक), किशोर (₹50,000 से ₹5 लाख) और तरुण (₹10 लाख तक) छोटे व्यवसाय व दुकान के लिए।',
      benefits_list: ['शिशु: ₹50,000 तक का लोन।', 'किशोर: ₹5 लाख तक का लोन।', 'तरुण: ₹10 लाख तक का लोन।', 'कोई गारंटी आवश्यक नहीं।'],
      eligibility_list: ['छोटे व्यापारी, दुकानदार, हस्तशिल्पी और सूक्ष्म उद्यमी।'],
      exclusions_list: ['कॉर्पोरेट या बड़े उद्योग।'],
      how_to_apply: 'किसी भी वाणिज्यिक बैंक, ग्रामीण बैंक में मुद्रा आवेदन फॉर्म जमा करें या udyamimitra.in पर ऑनलाइन भरें।',
      application_process: 'बैंक शाखा में बिजनेस प्रस्ताव के साथ आवेदन करें या udyamimitra.in पर ऑनलाइन भरें।',
      documents_required: ['1. आधार व पैन कार्ड।', '2. बैंक खाता विवरण।'],
      faqs: [{ question: 'क्या कोई गारंटी देनी होगी?', answer: 'नहीं, मुद्रा योजना में कोई गारंटी नहीं ली जाती।' }],
      source_url: 'https://mudra.org.in',
      match_reasons: ['असंगठित व छोटे व्यवसायियों के लिए सुलभ', 'कोई गारंटी या गिरवी रखने की जरूरत नहीं', 'कम ब्याज दरें'],
      tags: ['₹10 लाख तक का ऋण', 'बिना किसी गारंटी', 'मुद्रा कार्ड सुविधा']
    },
    te: {
      name: 'ప్రధాన మంత్రి ముద్రా యోజన (PMMY - సూక్ష్మ వ్యాపార రుణాలు)',
      type: 'హామీ లేని సూక్ష్మ వ్యాపార రుణాలు',
      ministry: 'ఆర్థిక మంత్రిత్వ శాఖ',
      details: 'చిరు వ్యాపారులు మరియు దుకాణదారుల కోసం ఎటువంటి పూచీకత్తు లేకుండా ₹10 లక్షల వరకు వ్యాపార రుణాలు.',
      benefit: 'ఎటువంటి పూచీకత్తు లేకుండా వ్యాపార రుణాలు: శిశు (₹50,000 వరకు), కిషోర్ (₹5 లక్షల వరకు), మరియు తరుణ్ (₹10 లక్షల వరకు) వ్యాపారం ప్రారంభించడానికి.',
      benefits_list: [
        'శిశు: చిన్న దుకాణాలకు ₹50,000 వరకు రుణం.',
        'కిషోర్: వ్యాపార విస్తరణకు ₹5 లక్షల వరకు రుణం.',
        'తరుణ్: ₹10 లక్షల వరకు గరిష్ట రుణం.',
        'ఎటువంటి ఆస్తి తాకట్టు లేదా పూచీకత్తు అవసరం లేదు.'
      ],
      eligibility_list: ['చిన్న వర్తకులు, చేతివృత్తుల వ్యాపారులు మరియు స్వయం ఉపాధి పొందుతున్న వ్యక్తులు.'],
      exclusions_list: ['పెద్ద కార్పొరేట్ సంస్థలు.'],
      how_to_apply: 'ఏదైనా వాణిజ్య బ్యాంకు లేదా ప్రాంతీయ గ్రామీణ బ్యాంకు (RRB) వద్ద ముద్ర దరఖాస్తును సమర్పించండి.',
      application_process: 'వ్యాపార వివరాలతో బ్యాంకులో దరఖాస్తు చేయండి లేదా udyamimitra.in లో ఆన్‌లైన్ ద్వారా దరఖాస్తు చేయండి.',
      documents_required: ['1. ఆధార్ కార్డు & పాన్ కార్డు.', '2. బ్యాంక్ స్టేట్‌మెంట్.'],
      faqs: [{ question: 'తాకట్టు పెట్టాలా?', answer: 'లేదు, ముద్రా పథకంలో ఎటువంటి తాకట్టు అవసరం లేదు.' }],
      source_url: 'https://mudra.org.in',
      match_reasons: ['చిరు వ్యాపారాలు ప్రారంభించే అసంఘటిత కార్మికులకు అనుకూలం', 'పూచీకత్తు లేదా గ్యారెంటర్ అవసరం లేదు', 'రాయితీ వడ్డీ'],
      tags: ['₹10 లక్షల వరకు రుణాలు', 'పూచీకత్తు అవసరం లేదు', 'ముద్రా కార్డు సదుపాయం']
    }
  },

  // 13. PMAY-G
  pmayg: {
    key: 'pmayg',
    matchKeys: ['PMAY', 'Awas'],
    en: {
      name: 'Pradhan Mantri Awas Yojana (PMAY-G / Pucca Housing Grant)',
      type: 'Housing Assistance Grant',
      ministry: 'Ministry of Rural Development',
      details: 'Housing for All rural initiative providing financial grants for construction of permanent pucca houses with clean toilet, power, and LPG.',
      benefit: 'Direct financial grant of ₹1,20,000 (plain areas) to ₹1,30,000 (hilly areas) for construction of permanent pucca house with toilet & power.',
      benefits_list: [
        '₹1,20,000 in plains and ₹1,30,000 in hilly/difficult areas transferred in installments.',
        'Additional ₹12,000 grant for toilet construction under Swachh Bharat Mission.',
        '90/95 days of unskilled labor wages under MGNREGA (approx ₹18,000–₹24,000 extra).'
      ],
      eligibility_list: ['Homeless families or households living in zero or one/two room kutcha houses.'],
      exclusions_list: ['Households owning pucca house, motorized vehicle, or agricultural land above limit.'],
      how_to_apply: 'Beneficiary lists prepared through Gram Sabha. Check status at pmayg.nic.in or block development office.',
      application_process: 'Selection through Gram Sabha prioritization. Physical geo-tagging at plinth, roof, and finish stages.',
      documents_required: ['1. Aadhaar Card.', '2. Bank Account Passbook with DBT enabled.', '3. MGNREGA Job Card.'],
      faqs: [{ question: 'Are funds paid in cash?', answer: 'No, all installments are paid directly into Aadhaar-linked bank accounts via DBT.' }],
      source_url: 'https://pmayg.nic.in',
      match_reasons: ['Low-income household without pucca house', 'Direct bank account transfer (DBT)', 'Additional ₹12,000 toilet grant'],
      tags: ['₹1.20–₹1.30 Lakh Housing Grant', 'Permanent Pucca House', '100% DBT Transfer']
    },
    hi: {
      name: 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G / पक्का मकान अनुदान)',
      type: 'पक्का आवास सहायता अनुदान',
      ministry: 'ग्रामीण विकास मंत्रालय',
      details: 'पक्का मकान बनाने के लिए ₹1.20 लाख से ₹1.30 लाख का सीधा सरकारी अनुदान।',
      benefit: 'पक्का मकान निर्माण हेतु ₹1,20,000 (मैदानी क्षेत्र) से ₹1,30,000 (पहाड़ी क्षेत्र) का सीधा सरकारी अनुदान, साथ में शौचालय हेतु ₹12,000 अतिरिक्त।',
      benefits_list: [
        'मकान निर्माण के लिए ₹1.20 से ₹1.30 लाख की सीधी आर्थिक मदद।',
        'शौचालय निर्माण हेतु ₹12,000 अतिरिक्त सहायता।',
        'मनरेगा के तहत 90 दिन की मजदूरी भी शामिल।'
      ],
      eligibility_list: ['कच्चे मकान में रहने वाले या बेघर ग्रामीण परिवार।'],
      exclusions_list: ['पक्का मकान या 4-पहिया वाहन धारक।'],
      how_to_apply: 'ग्राम सभा के माध्यम से चयन। ब्लॉक विकास कार्यालय (BDO) या pmayg.nic.in पोर्टल पर जांचें।',
      application_process: 'ग्राम पंचायत की वरीयता सूची में नाम जांचें, निर्माण की प्रगति पर किस्तों में भुगतान होता है।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक पासबुक।', '3. मनरेगा जॉब कार्ड।'],
      faqs: [{ question: 'पैसा कैसे मिलता है?', answer: 'सीधे बैंक खाते में किस्तों में डीबीटी द्वारा भेजा जाता है।' }],
      source_url: 'https://pmayg.nic.in',
      match_reasons: ['कच्चे मकान वाले ग्रामीण व असंगठित परिवारों के लिए', 'सीधे बैंक खाते में किस्तों में भुगतान', 'शौचालय व बिजली कनेक्शन शामिल'],
      tags: ['₹1.20–₹1.30 लाख आवास अनुदान', 'पक्का मकान सहायता', 'सीधे बैंक खाते में']
    },
    te: {
      name: 'ప్రధాన మంత్రి ఆవాస్ యోజన - గ్రామీణ్ (PMAY-G / పక్కా గృహ గ్రాంట్)',
      type: 'గృహ నిర్మాణ సహాయ గ్రాంట్',
      ministry: 'గ్రామీణాభివృద్ధి మంత్రిత్వ శాఖ',
      details: 'పక్కా ఇల్లు నిర్మించుకోవడానికి పేద కుటుంబాలకు ₹1.20 లక్షల నుండి ₹1.30 లక్షల వరకు నేరుగా ప్రభుత్వ నగదు గ్రాంట్.',
      benefit: 'శాశ్వత పక్కా ఇల్లు నిర్మించుకోవడానికి ₹1,20,000 నుండి ₹1,30,000 వరకు నేరుగా ప్రభుత్వ నగదు సహాయం, అలాగే మరుగుదొడ్డి నిర్మాణానికి ₹12,000 అదనం.',
      benefits_list: [
        'ఇంటి నిర్మాణానికి ₹1.20 లక్షల నుండి ₹1.30 లక్షల నగదు సహాయం.',
        'మరుగుదొడ్డి నిర్మాణానికి అదనంగా ₹12,000 గ్రాంట్.',
        'ఉపాధి హామీ (MGNREGA) పథకం కింద 90 రోజుల ఉచిత కూలీ వేతనం.'
      ],
      eligibility_list: ['పక్కా ఇల్లు లేని లేదా మట్టి గుడిసెల్లో నివసించే నిరుపేద కుటుంబాలు.'],
      exclusions_list: ['ఇప్పటికే పక్కా ఇల్లు లేదా మోటారు వాహనం ఉన్నవారు.'],
      how_to_apply: 'గ్రామ సభ ద్వారా లబ్ధిదారుల ఎంపిక. స్థానిక మండల అభివృద్ధి కార్యాలయం (MPDO) లేదా pmayg.nic.in లో తనిఖీ చేయండి.',
      application_process: 'గ్రామ సచివాలయంలో పేరు తనిఖీ చేసుకోండి. నిర్మాణ దశల వారీగా నేరుగా ఖాతాలో నగదు జమ చేయబడుతుంది.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. బ్యాంక్ పాస్‌బుక్ కాపీ.', '3. జాబ్ కార్డు.'],
      faqs: [{ question: 'డబ్బులు ఎవరి చేతికి ఇస్తారు?', answer: 'డబ్బులు నేరుగా ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో విడతల వారీగా జమ అవుతాయి.' }],
      source_url: 'https://pmayg.nic.in',
      match_reasons: ['పక్కా ఇల్లు లేని అసంఘటిత కుటుంబాలకు వర్తిస్తుంది', 'నేరుగా బ్యాంక్ ఖాతాలో జమ (DBT)', 'ఉచిత గృహ సదుపాయం'],
      tags: ['₹1.20–₹1.30 లక్షల గృహ గ్రాంట్', 'శాశ్వత పక్కా ఇల్లు', 'నేరుగా బ్యాంక్ ఖాతాకు']
    }
  },

  // 14. PM Kisan Samman Nidhi
  pmkisan: {
    key: 'pmkisan',
    matchKeys: ['PM-KISAN', 'PM Kisan', 'Kisan Samman'],
    en: {
      name: 'PM Kisan Samman Nidhi (PM-KISAN)',
      type: 'Direct Farmer Income Support',
      ministry: 'Ministry of Agriculture and Farmers Welfare',
      details: 'Central scheme providing direct income support of ₹6,000 per year to all landholding farmer families in three equal installments of ₹2,000 every 4 months.',
      benefit: 'Direct income support of ₹6,000 per year transferred in 3 equal four-monthly installments of ₹2,000 directly into Aadhaar-linked bank accounts.',
      benefits_list: [
        '₹6,000 per annum credited in three equal installments of ₹2,000 directly into bank accounts via DBT.',
        '100% funded by Central Government.',
        'Assists farmers in procurement of seeds, fertilizers, and equipment.'
      ],
      eligibility_list: ['All landholding farmer families having cultivable landholding in their names.'],
      exclusions_list: ['Institutional landholders, serving/retired government employees, income tax payees, professionals (doctors, engineers).'],
      how_to_apply: 'Self-register on pmkisan.gov.in (Farmers Corner) or apply via local CSC / Village Nodal Officer.',
      application_process: 'Register on pmkisan.gov.in with land revenue records (Khatauni/RoR) and Aadhaar e-KYC.',
      documents_required: ['1. Aadhaar Card.', '2. Land Revenue Records (RoR / 1-B / Khatauni).', '3. Bank Account Passbook copy.'],
      faqs: [{ question: 'How is e-KYC completed?', answer: 'Using Aadhaar OTP on the PM-Kisan portal or biometric at any CSC centre.' }],
      source_url: 'https://pmkisan.gov.in/',
      match_reasons: ['Landholding farmer family eligibility', '100% central DBT transfer', '3 guaranteed ₹2,000 installments'],
      tags: ['₹6,000/yr Direct Income', '3 Installments of ₹2,000', 'Direct Bank DBT']
    },
    hi: {
      name: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
      type: 'सीधी किसान आय सहायता',
      ministry: 'कृषि एवं किसान कल्याण मंत्रालय',
      details: 'सभी किसान परिवारों को प्रति वर्ष ₹6,000 की सीधी आय सहायता, 4 महीने के अंतराल पर ₹2,000 की तीन समान किस्तों में।',
      benefit: 'प्रति वर्ष ₹6,000 की आर्थिक मदद सीधे बैंक खाते में तीन किश्तों (₹2,000 प्रत्येक) में।',
      benefits_list: ['सालाना ₹6,000 की नकद सहायता सीधे खाते में।', 'खाद, बीज व कृषि इनपुट के लिए समय पर धन उपलब्ध।'],
      eligibility_list: ['खेती योग्य भूमि के स्वामी किसान परिवार।'],
      exclusions_list: ['आयकर दाता या सरकारी कर्मचारी।'],
      how_to_apply: 'pmkisan.gov.in पर फार्मर्स कॉर्नर से स्वयं या सीएससी केंद्र पर जाकर पंजीकरण करें।',
      application_process: 'खतौनी व आधार के साथ pmkisan.gov.in पर फॉर्म भरें और ई-केवाईसी पूर्ण करें।',
      documents_required: ['1. आधार कार्ड।', '2. जमीन की खतौनी/जमाबंदी।', '3. बैंक पासबुक।'],
      faqs: [{ question: 'ई-केवाईसी कैसे करें?', answer: 'पोर्टल पर आधार ओटीपी से या सीएससी पर बायोमेट्रिक द्वारा।' }],
      source_url: 'https://pmkisan.gov.in/',
      match_reasons: ['किसान परिवार पात्रता अनुकूल', '100% सरकारी डीबीटी भुगतान', 'नियमित ₹2,000 की किस्तें'],
      tags: ['₹6,000/वर्ष नकद सहायता', '₹2,000 की 3 किस्तें', 'सीधे बैंक खाते में']
    },
    te: {
      name: 'పీఎం కిసాన్ సమ్మాన్ నిధి (PM-KISAN)',
      type: 'ప్రత్యక్ష రైతు ఆదాయ మద్దతు',
      ministry: 'వ్యవసాయ మరియు రైతు సంక్షేమ మంత్రిత్వ శాఖ',
      details: 'రైతులకు పెట్టుబడి సహాయంగా ప్రతి సంవత్సరం ₹6,000 నగదు సహాయం మూడు విడతల్లో (₹2,000 చొప్పున) నేరుగా బ్యాంక్ ఖాతాలో జమ.',
      benefit: 'ప్రతి సంవత్సరం ₹6,000 నగదు సహాయం 3 సమాన విడతల్లో (ప్రతి 4 నెలలకు ₹2,000) నేరుగా ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాలో జమ అవుతుంది.',
      benefits_list: ['సంవత్సరానికి ₹6,000 నేరుగా బ్యాంక్ ఖాతాలో జమ.', 'విత్తనాలు, ఎరువుల కొనుగోలుకు ఆర్థిక భరోసా.'],
      eligibility_list: ['తమ పేరు మీద సాగుభూమి ఉన్న రైతులందరూ అర్హులు.'],
      exclusions_list: ['ఆదాయపు పన్ను చెల్లించేవారు లేదా ప్రభుత్వ ఉద్యోగులు.'],
      how_to_apply: 'pmkisan.gov.in పోర్టల్‌లో లేదా సమీప CSC కేంద్రం / రైతు భరోసా కేంద్రం ద్వారా దరఖాస్తు చేసుకోండి.',
      application_process: 'పట్టాదారు పాస్‌బుక్ మరియు ఆధార్‌తో pmkisan.gov.in లో నమోదు చేసుకుని ఈ-కేవైసీ పూర్తి చేయండి.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. పట్టాదారు పాస్‌బుక్ లేదా 1-బి నకలు.', '3. బ్యాంక్ ఖాతా వివరాలు.'],
      faqs: [{ question: 'ఈ-కేవైసీ ఎలా చేయాలి?', answer: 'pmkisan పోర్టల్‌లో ఆధార్ ఓటీపీ ద్వారా లేదా CSC కేంద్రంలో బయోమెట్రిక్ ద్వారా చేయవచ్చు.' }],
      source_url: 'https://pmkisan.gov.in/',
      match_reasons: ['భూమి గల రైతు కుటుంబం అర్హత', '100% కేంద్ర ప్రభుత్వ DBT బదిలీ', 'ప్రతి 4 నెలలకు ₹2,000 జమ'],
      tags: ['సంవత్సరానికి ₹6,000 నగదు', '3 విడతల్లో ₹2,000 జమ', 'రైతులకు పెట్టుబడి భరోసా']
    }
  },

  // 15. Sukanya Samriddhi Yojana
  sukanya: {
    key: 'sukanya',
    matchKeys: ['Sukanya', 'SSY', 'Beti Bachao'],
    en: {
      name: 'Sukanya Samriddhi Yojana (SSY / Beti Bachao)',
      type: 'High-Yield Girl Child Savings Scheme',
      ministry: 'Ministry of Finance & Ministry of Women and Child Development',
      details: 'Small deposit savings scheme for girl children launched under Beti Bachao Beti Padhao offering highest sovereign interest rate (~8.2% p.a.) and EEE tax exemption.',
      benefit: 'High-interest sovereign savings scheme for girl children up to age 10 with highest sovereign guaranteed interest (~8.2% p.a.) and 100% tax exemption under Section 80C.',
      benefits_list: [
        'Highest sovereign interest among small savings schemes (currently ~8.2% p.a. compounded annually).',
        'Triple tax exemption (EEE): Investment, interest, and maturity amount are 100% tax-free.',
        'Account matures on completion of 21 years from opening date or upon marriage after age 18.',
        'Partial withdrawal up to 50% allowed for higher education after age 18.'
      ],
      eligibility_list: ['Parents/guardians of girl child up to 10 years of age (maximum 2 accounts per family).'],
      exclusions_list: ['Girl child above 10 years of age at time of account opening.'],
      how_to_apply: 'Open account at any Post Office or authorized commercial bank branch with girl child birth certificate and KYC documents.',
      application_process: 'Submit SSY application form at any post office or bank branch with minimum opening deposit of ₹250.',
      documents_required: ['1. Birth Certificate of the Girl Child.', '2. Identity & Address Proof of Parent/Guardian (Aadhaar, PAN).', '3. Photograph of child & parent.'],
      faqs: [{ question: 'What is the minimum annual deposit?', answer: 'Minimum ₹250 per financial year, up to a maximum of ₹1.50 Lakh.' }],
      source_url: 'https://www.indiapost.gov.in/',
      match_reasons: ['Girl child dependent in household', 'Highest sovereign interest (~8.2%)', 'Complete tax-free wealth creation'],
      tags: ['8.2% Sovereign Interest', '100% Tax Free (EEE)', 'Girl Child Welfare']
    },
    hi: {
      name: 'सुकन्या समृद्धि योजना (SSY / बेटी बचाओ)',
      type: 'बालिका समृद्धि बचत योजना',
      ministry: 'वित्त मंत्रालय एवं महिला व बाल विकास मंत्रालय',
      details: '10 वर्ष तक की बालिकाओं के लिए उच्चतम सरकारी ब्याज दर (~8.2%) वाली बचत योजना।',
      benefit: '10 वर्ष तक की बेटियों के उज्ज्वल भविष्य व शिक्षा हेतु ~8.2% ब्याज दर और 100% टैक्स फ्री परिपक्वता राशि।',
      benefits_list: ['उच्चतम सरकारी ब्याज दर (~8.2% प्रति वर्ष)।', 'पूर्णतः कर-मुक्त (धारा 80C EEE छूट)।', 'उच्च शिक्षा हेतु 50% निकासी की सुविधा।'],
      eligibility_list: ['10 वर्ष से कम आयु की बालिकाओं के अभिभावक (अधिकतम 2 बेटियां)।'],
      exclusions_list: ['10 वर्ष से अधिक आयु की बालिकाएं।'],
      how_to_apply: 'किसी भी डाकघर या अधिकृत बैंक शाखा में बालिका के जन्म प्रमाण पत्र व आधार के साथ खाता खोलें।',
      application_process: 'डाकघर या बैंक में मात्र ₹250 जमा करके खाता खोलें।',
      documents_required: ['1. बालिका का जन्म प्रमाण पत्र।', '2. माता-पिता का आधार व पैन कार्ड।'],
      faqs: [{ question: 'न्यूनतम कितना जमा करना होता है?', answer: 'प्रति वर्ष न्यूनतम ₹250 और अधिकतम ₹1.5 लाख।' }],
      source_url: 'https://www.indiapost.gov.in/',
      match_reasons: ['परिवार में बालिका आश्रित', 'उच्चतम ब्याज (~8.2%)', 'पूर्ण कर-मुक्त बचत'],
      tags: ['8.2% ब्याज दर', 'पूर्णतः टैक्स फ्री', 'बालिका भविष्य सुरक्षा']
    },
    te: {
      name: 'సుకున్య సమృద్ధి యోజన (SSY / బేటీ బచావో)',
      type: 'బాలికల అధిక వడ్డీ పొదుపు పథకం',
      ministry: 'ఆర్థిక మరియు మహిళా శిశు సంక్షేమ మంత్రిత్వ శాఖ',
      details: '10 సంవత్సరాలలోపు ఆడపిల్లల ఉన్నత విద్య మరియు వివాహం కోసం అత్యధిక వడ్డీ (~8.2%) అందించే ప్రభుత్వ పొదుపు పథకం.',
      benefit: '10 సంవత్సరాలలోపు ఆడపిల్లల కోసం అత్యధిక వడ్డీ (~8.2%) మరియు 100% పన్ను మినహాయింపుతో కూడిన ప్రభుత్వ పొదుపు పథకం.',
      benefits_list: [
        'ప్రభుత్వ పొదుపు పథకాలలో అత్యధిక వడ్డీ రేటు (~8.2% చక్రవడ్డీ).',
        'మొత్తం రాబడి మరియు వడ్డీపై 100% పన్ను మినహాయింపు (EEE హోదా).',
        '18 ఏళ్లు నిండిన తర్వాత ఉన్నత చదువుల కోసం 50% నిధులను ఉపసంహరించుకునే సౌలభ్యం.'
      ],
      eligibility_list: ['10 సంవత్సరాల లోపు ఆడపిల్లలు ఉన్న తల్లిదండ్రులు (కుటుంబానికి గరిష్టంగా ఇద్దరు).'],
      exclusions_list: ['10 సంవత్సరాల కంటే ఎక్కువ వయస్సు ఉన్న బాలికలు.'],
      how_to_apply: 'ఏదైనా పోస్టాఫీసు లేదా వాణిజ్య బ్యాంకు శాఖలో బాలిక జనన ధృవీకరణ పత్రంతో ఖాతా తెరవవచ్చు.',
      application_process: 'పోస్టాఫీస్ లేదా బ్యాంకును సందర్శించి కనీసం ₹250 డిపాజిట్‌తో ఖాతాను ప్రారంభించండి.',
      documents_required: ['1. బాలిక జనన ధృవీకరణ పత్రం (Birth Certificate).', '2. తల్లిదండ్రుల ఆధార్ మరియు పాన్ కార్డులు.'],
      faqs: [{ question: 'సంవత్సరానికి కనీసం ఎంత కట్టాలి?', answer: 'సంవత్సరానికి కనీసం ₹250 నుండి గరిష్టంగా ₹1.50 లక్షల వరకు జమ చేయవచ్చు.' }],
      source_url: 'https://www.indiapost.gov.in/',
      match_reasons: ['కుటుంబంలో ఆడపిల్ల ఆధారం', 'అత్యధిక వడ్డీ రేటు (~8.2%)', '100% పన్ను రహిత భవిష్యత్ సంపద'],
      tags: ['8.2% గరిష్ట వడ్డీ', '100% పన్ను రహితం', 'బాలికల ఉన్నత భవిష్యత్తు']
    }
  },

  // 16. Stand-Up India
  standup_india: {
    key: 'standup_india',
    matchKeys: ['Stand-Up India', 'StandUp', 'SC/ST loan', 'Women Entrepreneurship'],
    en: {
      name: 'Stand-Up India Scheme (SC/ST & Women Entrepreneurship)',
      type: 'Greenfield Enterprise Bank Loan',
      ministry: 'Ministry of Finance (SIDBI)',
      details: 'Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.',
      benefit: 'Bank loans between ₹10 Lakh and ₹1 Crore for setting up greenfield enterprises in manufacturing, services, or trading by SC/ST or women entrepreneurs.',
      benefits_list: [
        'Bank loans between ₹10 Lakh and ₹1 Crore covering up to 85% of project cost.',
        'Composite loan covering both term loan and working capital.',
        'Margin money support converging with central/state subsidy schemes.',
        'Repayable in up to 7 years with a moratorium period of up to 18 months.'
      ],
      eligibility_list: ['SC/ST or woman entrepreneur above 18 years setting up greenfield (first-time) enterprise.'],
      exclusions_list: ['Existing business expansion or borrower with default history in financial institutions.'],
      how_to_apply: 'Apply through standupmitra.in portal or visit nearest scheduled commercial bank branch.',
      application_process: 'Register on standupmitra.in with project report or visit any scheduled commercial bank branch.',
      documents_required: ['1. Identity & Address Proof (Aadhaar, PAN).', '2. SC/ST Certificate (if applicable).', '3. Detailed Project Report (DPR).', '4. Enterprise Registration.'],
      faqs: [{ question: 'What is a greenfield project?', answer: 'Greenfield signifies the first-time venture of the beneficiary in manufacturing, services, or trading sector.' }],
      source_url: 'https://www.standupmitra.in/',
      match_reasons: ['SC/ST or female entrepreneur category', 'Loans up to ₹1 Crore for enterprise setup', 'Long 7-year repayment window'],
      tags: ['Loan ₹10 Lakh – ₹1 Crore', 'SC/ST & Women Entrepreneurs', 'Greenfield Enterprise']
    },
    hi: {
      name: 'स्टैंड-अप इंडिया योजना (अनुसूचित जाति/जनजाति व महिला उद्यमिता)',
      type: 'उद्यमिता बैंक ऋण योजना',
      ministry: 'वित्त मंत्रालय (SIDBI)',
      details: 'एससी/एसटी व महिला उद्यमियों को विनिर्माण, सेवा या व्यापार में नया उद्यम शुरू करने हेतु ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण।',
      benefit: 'एससी/एसटी व महिला उद्यमियों के लिए नया उद्यम स्थापित करने हेतु ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण।',
      benefits_list: ['₹10 लाख से ₹1 करोड़ तक का समग्र बैंक लोन।', '7 वर्ष तक की आसान पुनर्भुगतान अवधि।'],
      eligibility_list: ['18 वर्ष से अधिक आयु की महिला या एससी/एसटी उद्यमी।'],
      exclusions_list: ['पूर्व में डिफॉल्टर रहे व्यक्ति।'],
      how_to_apply: 'standupmitra.in पोर्टल पर या किसी भी वाणिज्यिक बैंक शाखा में आवेदन करें।',
      application_process: 'standupmitra.in पर प्रोजेक्ट रिपोर्ट के साथ आवेदन करें।',
      documents_required: ['1. आधार व पैन कार्ड।', '2. जाति प्रमाण पत्र (यदि लागू हो)।', '3. प्रोजेक्ट रिपोर्ट।'],
      faqs: [{ question: 'ऋण राशि कितनी मिलती है?', answer: '₹10 लाख से ₹1 करोड़ तक।' }],
      source_url: 'https://www.standupmitra.in/',
      match_reasons: ['एससी/एसटी या महिला उद्यमी वर्ग', '₹1 करोड़ तक का उद्यम ऋण', '7 वर्ष की आसान अवधि'],
      tags: ['ऋण ₹10 लाख – ₹1 करोड़', 'महिला व एससी/एसटी उद्यमी', 'नया व्यापार ऋण']
    },
    te: {
      name: 'స్టాండప్ ఇండియా పథకం (SC/ST & మహిళా వ్యాపార రుణాలు)',
      type: 'నూతన వ్యాపార బ్యాంక్ రుణం',
      ministry: 'ఆర్థిక మంత్రిత్వ శాఖ',
      details: 'ఎస్సీ/ఎస్టీ మరియు మహిళా ఔత్సాహిక పారిశ్రామికవేత్తలు కొత్త వ్యాపారాలు ప్రారంభించడానికి ₹10 లక్షల నుండి ₹1 కోటి వరకు బ్యాంక్ రుణం.',
      benefit: 'తయారీ, సేవా లేదా వ్యాపార రంగాలలో కొత్త వ్యాపారాలు ప్రారంభించడానికి ఎస్సీ/ఎస్టీ మరియు మహిళలకు ₹10 లక్షల నుండి ₹1 కోటి వరకు బ్యాంక్ రుణం.',
      benefits_list: [
        'ప్రాజెక్ట్ వ్యయంలో 85% వరకు ₹10 లక్షల నుండి ₹1 కోటి వరకు రుణం.',
        '7 సంవత్సరాల సులభ వాయిదాల తీర్పు వ్యవధి, 18 నెలల మారటోరియం సదుపాయం.'
      ],
      eligibility_list: ['18 ఏళ్లు పైబడిన ఎస్సీ/ఎస్టీ లేదా మహిళా ఔత్సాహిక పారిశ్రామికవేత్తలు.'],
      exclusions_list: ['బ్యాంకులలో ఎగవేత చరిత్ర ఉన్నవారు.'],
      how_to_apply: 'standupmitra.in పోర్టల్ ద్వారా లేదా సమీప వాణిజ్య బ్యాంకు శాఖలో ప్రాజెక్ట్ నివేదికతో దరఖాస్తు చేసుకోండి.',
      application_process: 'ప్రాజెక్ట్ నివేదికతో standupmitra.in లో నమోదు చేసుకోండి లేదా బ్యాంకును సంప్రదించండి.',
      documents_required: ['1. ఆధార్ & పాన్ కార్డు.', '2. కుల ధృవీకరణ పత్రం (వర్తిస్తే).', '3. ప్రాజెక్ట్ నివేదిక.'],
      faqs: [{ question: 'రుణం ఎంత లభిస్తుంది?', answer: '₹10 లక్షల నుండి ₹1 కోటి వరకు.' }],
      source_url: 'https://www.standupmitra.in/',
      match_reasons: ['ఎస్సీ/ఎస్టీ లేదా మహిళా పారిశ్రామికవేత్త వర్గం', '₹1 కోటి వరకు వ్యాపార రుణం', '7 సంవత్సరాల సులభ చెల్లింపు వ్యవధి'],
      tags: ['రుణం ₹10 లక్షలు – ₹1 కోటి', 'మహిళా & ఎస్సీ/ఎస్టీ పారిశ్రామికవేత్తలు', 'నూతన పరిశ్రమల రుణం']
    }
  },

  // 17. PMMSY
  pmmsy: {
    key: 'pmmsy',
    matchKeys: ['PMMSY', 'Matsya', 'Fisheries'],
    en: {
      name: 'Pradhan Mantri Matsya Sampada Yojana (PMMSY)',
      type: 'Fisheries & Aquaculture Livelihood Scheme',
      ministry: 'Ministry of Fisheries, Animal Husbandry and Dairying',
      details: 'Flagship scheme for sustainable development of fisheries sector, providing financial grants and 40% to 60% capital subsidies for boats, aquaculture, and cold chains.',
      benefit: 'Financial assistance and 40% to 60% capital subsidy for fishers, fish farmers, biofloc units, modern fishing boats, cold storage, and aquaculture equipment.',
      benefits_list: [
        '40% capital subsidy for general category beneficiaries.',
        '60% enhanced subsidy for women and SC/ST beneficiaries.',
        'Support for modern fishing vessels, biofloc systems, recirculating aquaculture (RAS), and cold chain transport.',
        'Livelihood support during fishing ban/lean periods.'
      ],
      eligibility_list: ['Fishers, fish farmers, fish workers, SHGs, and fisheries cooperatives.'],
      exclusions_list: ['Non-fisheries commercial ventures.'],
      how_to_apply: 'Submit project proposal to District Fisheries Officer or apply via PMMSY state nodal agency.',
      application_process: 'Submit detailed project report to District Fisheries Office or online via state fisheries portal.',
      documents_required: ['1. Aadhaar Card.', '2. Fishermen ID / Cooperative Membership.', '3. Land/Waterbody ownership or lease deed.', '4. Bank Passbook.'],
      faqs: [{ question: 'What is the subsidy rate for women?', answer: 'Women entrepreneurs and beneficiaries receive up to 60% capital subsidy under PMMSY.' }],
      source_url: 'https://pmmsy.dof.gov.in/',
      match_reasons: ['Fisheries and aquaculture livelihood sector', 'Up to 60% government subsidy', 'Modern equipment & boat assistance'],
      tags: ['40%–60% Capital Subsidy', 'Fisheries & Aquaculture', 'Modern Equipment Support']
    },
    hi: {
      name: 'प्रधानमंत्री मत्स्य संपदा योजना (PMMSY)',
      type: 'मत्स्य पालन व आजीविका संवर्धन',
      ministry: 'मत्स्य पालन, पशुपालन और डेयरी मंत्रालय',
      details: 'मछुआरों व मछली पालकों के लिए आधुनिक नावों, बायोफ्लॉक इकाइयों व कोल्ड चेन हेतु 40% से 60% सरकारी सब्सिडी।',
      benefit: 'मछली पालकों व मछुआरों के लिए नावों, तालाबों व बायोफ्लॉक यूनिट हेतु 40% से 60% सरकारी पूंजीगत सब्सिडी।',
      benefits_list: ['सामान्य वर्ग हेतु 40% तथा महिलाओं व एससी/एसटी हेतु 60% सब्सिडी।', 'नावों, कोल्ड स्टोरेज व तालाब निर्माण हेतु वित्तीय सहायता।'],
      eligibility_list: ['मछुआरे, मछली पालक, मत्स्य सहकारी समितियां व स्वयं सहायता समूह।'],
      exclusions_list: ['गैर-मत्स्य क्षेत्र।'],
      how_to_apply: 'जिला मत्स्य अधिकारी कार्यालय में प्रोजेक्ट प्रस्ताव जमा करें या राज्य मत्स्य पोर्टल पर भरें।',
      application_process: 'परियोजना रिपोर्ट के साथ जिला मत्स्य अधिकारी कार्यालय में आवेदन करें।',
      documents_required: ['1. आधार कार्ड।', '2. मछुआरा प्रमाण पत्र।', '3. जमीन/तालाब पट्टा या मिल्कियत।'],
      faqs: [{ question: 'महिलाओं को कितनी सब्सिडी मिलती है?', answer: 'महिलाओं को 60% तक की पूंजीगत सब्सिडी मिलती है।' }],
      source_url: 'https://pmmsy.dof.gov.in/',
      match_reasons: ['मत्स्य पालन व आजीविका क्षेत्र', '60% तक की भारी सरकारी सब्सिडी', 'नाव व उपकरण सहायता'],
      tags: ['40%–60% सरकारी सब्सिडी', 'मत्स्य पालन सहायता', 'नाव व उपकरण अनुदान']
    },
    te: {
      name: 'ప్రధాన మంత్రి మత్స్య సంపద యోజన (PMMSY)',
      type: 'మత్స్యకార & ఆక్వా జీవనోపాధి పథకం',
      ministry: 'మత్స్య, పశుసంవర్ధక మరియు పాడిపరిశ్రమ మంత్రిత్వ శాఖ',
      details: 'మత్స్యకారులు మరియు చేపల పెంపకందారులకు ఆధునిక పడవలు, బయోఫ్లాక్ యూనిట్లు, కోల్డ్ స్టోరేజ్ కోసం 40% నుండి 60% వరకు భారీ ప్రభుత్వ సబ్సిడీ.',
      benefit: 'చేపల పెంపకం, ఆధునిక బోట్లు, కోల్డ్ స్టోరేజ్ మరియు పరికరాల కొనుగోలుకు 40% నుండి 60% వరకు మూలధన సబ్సిడీ మరియు ఆర్థిక సహాయం.',
      benefits_list: [
        'జనరల్ కేటగిరీ లబ్ధిదారులకు 40% మూలధన సబ్సిడీ.',
        'మహిళలు మరియు ఎస్సీ/ఎస్టీ లబ్ధిదారులకు 60% గరిష్ట సబ్సిడీ.',
        'ఆధునిక పడవలు, బయోఫ్లాక్ చెరువులు, చేపల రవాణా వాహనాల కొనుగోలుకు తోడ్పాటు.'
      ],
      eligibility_list: ['మత్స్యకారులు, చేపల పెంపకందారులు, మత్స్యకార సహకార సంఘాలు మరియు స్వయం సహాయక సంఘాలు.'],
      exclusions_list: ['మత్స్య రంగానికి చెందని ఇతర వ్యాపారాలు.'],
      how_to_apply: 'జిల్లా మత్స్యశాఖ అధికారి కార్యాలయంలో ప్రాజెక్ట్ నివేదికతో లేదా రాష్ట్ర మత్స్య పోర్టల్ ద్వారా దరఖాస్తు చేసుకోండి.',
      application_process: 'జిల్లా మత్స్యశాఖ అధికారి (DFO) కార్యాలయంలో ప్రాజెక్ట్ ప్రతిపాదనను సమర్పించండి.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. మత్స్యకార గుర్తింపు కార్డు / సొసైటీ సభ్యత్వం.', '3. చెరువు/భూమి యాజమాన్య పత్రం.'],
      faqs: [{ question: 'మహిళలకు ఎంత సబ్సిడీ లభిస్తుంది?', answer: 'మహిళా లబ్ధిదారులకు PMMSY కింద 60% వరకు సబ్సిడీ లభిస్తుంది.' }],
      source_url: 'https://pmmsy.dof.gov.in/',
      match_reasons: ['మత్స్యకార మరియు ఆక్వా రంగ వృత్తి', '60% వరకు భారీ ప్రభుత్వ సబ్సిడీ', 'ఆధునిక పరికరాల సహాయం'],
      tags: ['40%–60% ప్రభుత్వ సబ్సిడీ', 'మత్స్యకార సంక్షేమం', 'ఆధునిక బోట్ల సహాయం']
    }
  },

  // 18. PMKVY
  pmkvy: {
    key: 'pmkvy',
    matchKeys: ['PMKVY', 'Kaushal Vikas', 'Skill Training'],
    en: {
      name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY 4.0)',
      type: 'Free Skill Development & Certification',
      ministry: 'Ministry of Skill Development and Entrepreneurship',
      details: 'Flagship skill certification scheme offering free industry-aligned technical skill training, NSQF certification, and placement assistance.',
      benefit: 'Free industry-aligned skill training, National Skills Qualification Framework (NSQF) certification, accident insurance, and assessment reward for youth.',
      benefits_list: [
        '100% free technical and industry skill training.',
        'Government of India recognized NSQF skill certificate and marksheet.',
        'Recognition of Prior Learning (RPL) certification for existing workers.',
        'Free 3-year accidental insurance cover (₹2 Lakh) and placement assistance.'
      ],
      eligibility_list: ['Indian youth aged 15–45 years, school/college dropouts, or unemployed jobseekers.'],
      exclusions_list: ['Currently enrolled full-time regular degree students.'],
      how_to_apply: 'Register on Skill India Digital (skillindiadigital.gov.in) or visit nearest PMKVY Training Centre.',
      application_process: 'Register on skillindiadigital.gov.in or visit accredited training partner center with Aadhaar.',
      documents_required: ['1. Aadhaar Card.', '2. Educational Certificate (10th/12th/ITI if any).', '3. Bank Account details.'],
      faqs: [{ question: 'Is training completely free?', answer: 'Yes, 100% of the training and assessment cost is borne by the Government of India.' }],
      source_url: 'https://www.pmkvyofficial.org/',
      match_reasons: ['Youth skill development tier', '100% free certified training', 'Placement and accidental insurance support'],
      tags: ['100% Free Training', 'Govt NSQF Certificate', 'Placement Assistance']
    },
    hi: {
      name: 'प्रधानमंत्री कौशल विकास योजना (PMKVY 4.0)',
      type: 'मुफ्त कौशल प्रशिक्षण व प्रमाणपत्र',
      ministry: 'कौशल विकास और उद्यमिता मंत्रालय',
      details: 'युवाओं के लिए उद्योग-उन्मुख निःशुल्क तकनीकी प्रशिक्षण, सरकारी प्रमाणपत्र और रोजगार सहायता।',
      benefit: 'निःशुल्क उद्योग-उन्मुख कौशल प्रशिक्षण, सरकारी एनएसक्यूएफ प्रमाणपत्र, ₹2 लाख का दुर्घटना बीमा और रोजगार सहायता।',
      benefits_list: ['100% निःशुल्क तकनीकी कौशल प्रशिक्षण।', 'राष्ट्रीय स्तर पर मान्य सरकारी प्रमाणपत्र।', 'रोजगार व प्लेसमेंट में सहायता।'],
      eligibility_list: ['15 से 45 वर्ष की आयु के भारतीय युवा व बेरोजगार।' ],
      exclusions_list: ['नियमित कॉलेज विद्यार्थी।'],
      how_to_apply: 'Skill India Digital पोर्टल (skillindiadigital.gov.in) पर या नजदीकी कौशल केंद्र पर पंजीकरण करें।',
      application_process: 'पोर्टल पर आधार के साथ पंजीकरण करें और अपनी पसंद का कोर्स चुनें।',
      documents_required: ['1. आधार कार्ड।', '2. बैंक पासबुक।', '3. शैक्षिक अंकतालिका।'],
      faqs: [{ question: 'क्या कोई फीस लगती है?', answer: 'नहीं, प्रशिक्षण पूरी तरह भारत सरकार द्वारा प्रायोजित और मुफ्त है।' }],
      source_url: 'https://www.pmkvyofficial.org/',
      match_reasons: ['युवा कौशल विकास श्रेणी', '100% मुफ्त सरकारी प्रशिक्षण', 'रोजगार व प्लेसमेंट सहायता'],
      tags: ['100% मुफ्त प्रशिक्षण', 'सरकारी कौशल प्रमाणपत्र', 'रोजगार सहायता']
    },
    te: {
      name: 'ప్రధాన మంత్రి కౌశల్ వికాస్ యోజన (PMKVY 4.0)',
      type: 'ఉచిత నైపుణ్య శిక్షణ & ధృవీకరణ',
      ministry: 'నైపుణ్యాభివృద్ధి మరియు వ్యవస్థాపకత మంత్రిత్వ శాఖ',
      details: 'యువత కోసం పరిశ్రమల ఆధారిత ఉచిత సాంకేతిక నైపుణ్య శిక్షణ, ప్రభుత్వ NSQF సర్టిఫికేట్ మరియు ఉద్యోగ అవకాశాలు.',
      benefit: 'యువతకు పరిశ్రమల ఆధారిత ఉచిత సాంకేతిక శిక్షణ, ప్రభుత్వ NSQF సర్టిఫికేట్, ₹2 లక్షల ఉచిత ప్రమాద బీమా మరియు ఉద్యోగ సహాయం.',
      benefits_list: [
        '100% ఉచిత సాంకేతిక మరియు చేతివృత్తుల నైపుణ్య శిక్షణ.',
        'కేంద్ర ప్రభుత్వ గుర్తింపు పొందిన జాతీయ NSQF సర్టిఫికేట్.',
        'ఉద్యోగ నియామక సహాయం మరియు ₹2 లక్షల ప్రమాద బీమా రక్షణ.'
      ],
      eligibility_list: ['15 నుండి 45 సంవత్సరాల వయస్సు గల యువత మరియు నిరుద్యోగులు.'],
      exclusions_list: ['ప్రస్తుతం రెగ్యులర్ డిగ్రీ చదువుతున్న విద్యార్థులు.'],
      how_to_apply: 'Skill India Digital (skillindiadigital.gov.in) పోర్టల్ లేదా సమీప PMKVY కేంద్రంలో నమోదు చేసుకోండి.',
      application_process: 'ఆధార్ కార్డుతో skillindiadigital.gov.in లో నమోదు చేసుకుని నచ్చిన కోర్సులో చేరండి.',
      documents_required: ['1. ఆధార్ కార్డు కాపీ.', '2. విద్యార్హత ధృవీకరణ పత్రాలు.', '3. బ్యాంక్ ఖాతా వివరాలు.'],
      faqs: [{ question: 'శిక్షణకు ఫీజు చెల్లించాలా?', answer: 'లేదు, కేంద్ర ప్రభుత్వ ఆధ్వర్యంలో శిక్షణ మరియు పరీక్షలు 100% ఉచితం.' }],
      source_url: 'https://www.pmkvyofficial.org/',
      match_reasons: ['యువత నైపుణ్యాభివృద్ధి అర్హత', '100% ఉచిత సర్టిఫైడ్ శిక్షణ', 'ఉద్యోగ నియామక మద్దతు'],
      tags: ['100% ఉచిత శిక్షణ', 'ప్రభుత్వ NSQF సర్టిఫికేట్', 'ఉద్యోగ అవకాశాలు']
    }
  }
};

/**
 * Returns localized scheme metadata given a backend scheme object and language code ('en', 'hi', 'te')
 */
export function getLocalizedScheme(scheme, lang = 'en') {
  if (!scheme) return null;
  const name = scheme.name || '';
  
  // Find matching entry from SCHEME_LOCALIZATIONS
  for (const entry of Object.values(SCHEME_LOCALIZATIONS)) {
    if (entry.matchKeys.some(k => name.toLowerCase().includes(k.toLowerCase()))) {
      const loc = entry[lang] || entry['en'];
      return {
        ...scheme,
        key: entry.key,
        localized_name: loc.name,
        localized_type: loc.type,
        localized_benefit: loc.benefit,
        localized_how_to_apply: loc.how_to_apply,
        match_reasons: loc.match_reasons || [],
        tags: loc.tags || [],
        ministry: loc.ministry || scheme.ministry || 'Government of India',
        details: loc.details || scheme.details || loc.benefit,
        benefits_list: loc.benefits_list || scheme.benefits_list || [loc.benefit],
        eligibility_list: loc.eligibility_list || scheme.eligibility_list || loc.match_reasons || [],
        exclusions_list: loc.exclusions_list || scheme.exclusions_list || [],
        application_process: loc.application_process || scheme.application_process || loc.how_to_apply,
        documents_required: loc.documents_required || scheme.documents_required || [],
        faqs: loc.faqs || scheme.faqs || [],
        source_url: loc.source_url || scheme.source_document_ref
      };
    }
  }

  // Fallback if not specifically in dictionary
  return {
    ...scheme,
    key: 'scheme_generic',
    localized_name: scheme.name,
    localized_type: scheme.type === 'govt_insurance' ? 'Government Insurance' : 'Welfare Scheme',
    localized_benefit: scheme.benefit_description,
    localized_how_to_apply: scheme.how_to_apply,
    match_reasons: ['Meets all verified central government eligibility rules'],
    tags: [`Cost: ₹${scheme.premium_annual_inr || 0}`, `Cover: ₹${scheme.coverage_inr || 0}`],
    ministry: scheme.ministry || 'Government of India',
    details: scheme.benefit_description,
    benefits_list: [scheme.benefit_description],
    eligibility_list: ['Meets standard criteria based on age and unorganised sector profile.'],
    exclusions_list: ['Families above official income limits or duplicate scheme beneficiaries.'],
    application_process: scheme.how_to_apply || 'Visit nearest Bank branch or Common Service Centre (CSC).',
    documents_required: [
      '1. Aadhaar Card copy.',
      '2. Bank Account Passbook copy.',
      '3. Income / Residence Certificate.'
    ],
    faqs: [
      {
        question: 'Who should I contact to apply?',
        answer: 'You can visit any authorized bank branch or nearest Common Service Centre (CSC) with your Aadhaar and bank details.'
      }
    ],
    source_url: scheme.source_document_ref
  };
}
