export const grammar = [
    {
        id: 1,
        pattern: "～は ～です",
        explanation: "~은/는 ~입니다 (기본 서술문)",
        examples: [
            {
                japanese: "わたしは がくせいです。",
                romaji: "Watashi wa gakusei desu.",
                korean: "나는 학생입니다.",
            },
            {
                japanese: "これは ほんです。",
                romaji: "Kore wa hon desu.",
                korean: "이것은 책입니다.",
            },
        ],
    },
    {
        id: 2,
        pattern: "～は ～ではありません",
        explanation: "~은/는 ~이 아닙니다 (부정문)",
        examples: [
            {
                japanese: "わたしは せんせいではありません。",
                romaji: "Watashi wa sensei dewa arimasen.",
                korean: "나는 선생님이 아닙니다.",
            },
        ],
    },
    {
        id: 3,
        pattern: "～ですか？",
        explanation: "~입니까? (의문문, 문장 끝에 か 추가)",
        examples: [
            {
                japanese: "なまえは なんですか？",
                romaji: "Namae wa nan desu ka?",
                korean: "이름이 무엇입니까?",
            },
            {
                japanese: "これは いくらですか？",
                romaji: "Kore wa ikura desu ka?",
                korean: "이것은 얼마입니까?",
            },
        ],
    },
    {
        id: 4,
        pattern: "～を ください",
        explanation: "~을/를 주세요 (요청)",
        examples: [
            {
                japanese: "みずを ください。",
                romaji: "Mizu wo kudasai.",
                korean: "물 주세요.",
            },
            {
                japanese: "メニューを ください。",
                romaji: "Menyuu wo kudasai.",
                korean: "메뉴 주세요.",
            },
        ],
    },
    {
        id: 5,
        pattern: "～が あります / います",
        explanation: "~이 있습니다 (あります: 사물, います: 생명체)",
        examples: [
            {
                japanese: "ここに えきが あります。",
                romaji: "Koko ni eki ga arimasu.",
                korean: "여기에 역이 있습니다.",
            },
            {
                japanese: "ねこが います。",
                romaji: "Neko ga imasu.",
                korean: "고양이가 있습니다.",
            },
        ],
    },
    {
        id: 6,
        pattern: "～に いきます",
        explanation: "~에 갑니다 (장소 + に + 이동동사)",
        examples: [
            {
                japanese: "とうきょうに いきます。",
                romaji: "Toukyou ni ikimasu.",
                korean: "도쿄에 갑니다.",
            },
            {
                japanese: "えきに いきたいです。",
                romaji: "Eki ni ikitai desu.",
                korean: "역에 가고 싶습니다.",
            },
        ],
    },
    {
        id: 7,
        pattern: "～は どこですか？",
        explanation: "~은/는 어디입니까? (장소 묻기)",
        examples: [
            {
                japanese: "トイレは どこですか？",
                romaji: "Toire wa doko desu ka?",
                korean: "화장실은 어디입니까?",
            },
            {
                japanese: "えきは どこですか？",
                romaji: "Eki wa doko desu ka?",
                korean: "역은 어디입니까?",
            },
        ],
    },
    {
        id: 8,
        pattern: "いま ～じ ～ふんです",
        explanation: "지금 ~시 ~분입니다 (시간 말하기)",
        examples: [
            {
                japanese: "いまは さんじです。",
                romaji: "Ima wa sanji desu.",
                korean: "지금은 3시입니다.",
            },
            {
                japanese: "ごぜん じゅうじ ごふんです。",
                romaji: "Gozen juuji gofun desu.",
                korean: "오전 10시 5분입니다.",
            },
        ],
    },
];
