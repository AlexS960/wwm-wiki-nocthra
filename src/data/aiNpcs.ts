/** Сгенерировано scripts/rebuild-ai-npcs.mjs — не редактировать вручную */
export type AiNpcRegion = 'qinghe' | 'kaifeng' | 'hexi';

export type NpcDialogueRole = 'player' | 'npc' | 'system';

export interface NpcDialogueLine {
  role: NpcDialogueRole;
  textEn: string;
  textRu: string;
}

export interface AiNpc {
  id: string;
  nameEn: string;
  nameRu: string;
  region: AiNpcRegion;
  regionLabelRu: string;
  locationTitle: string;
  subregion: string;
  locationDetail: string;
  icon: string;
  befriendGuide?: string;
  dialogues: NpcDialogueLine[];
  /** wiki-запись (редактируемая) */
  wikiId?: string;
  isCustom?: boolean;
}

export const aiChatGlobalTips: string[] = [
  "Выберите второй пункт диалога «Подружиться» — не сюжетную ветку.",
  "Читайте подсказку над окном чата: там цель разговора и тон персонажа.",
  "Подстраивайте ответы: учёному — вежливо и образно, воину — прямо, торговцу — о выгоде.",
  "Пишите осмысленные реплики; пустой текст не повышает симпатию.",
  "Если диалог зашёл в тупик — кнопка обновления (↻) вверху чата и начните заново.",
  "Если NPC стал враждебным — выйдите на экран входа; после возврата состояние сбросится.",
  "При статусе «Почитаемый» многие присылают еженедельные подарки."
];

export const aiNpcRegionLabels: Record<AiNpcRegion, string> = {
  qinghe: 'Цинхэ',
  kaifeng: 'Кайфэн',
  hexi: 'Хэси',
};

export const aiNpcs: AiNpc[] = [
  {
    "id": "an-lexi",
    "nameEn": "An Lexi",
    "nameRu": "Ань Лекси",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Забытый перекрёсток",
    "subregion": "Нефритовые ворота",
    "locationDetail": "An Lexi находится close к Karez boundary stone in Забытый перекрёсток.",
    "icon": "👤",
    "befriendGuide": "Seal the Raging Monster Inside Him\nThe young boy clutches his left eye and mutters incomprehensively. Try teasing him a bit?",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(clutching his left eye) Is this fragile vessel truly all the strength I have? Wanderer, keep your distance! I, the Chosen Vessel, can barely restrain the monster sealed within!",
        "textRu": "(clutching his left eye) Is this fragile vessel truly all the strength I have? Wanderer, keep your distance! I, the Chosen Vessel, can barely restrain the monster sealed within!"
      },
      {
        "role": "npc",
        "textEn": "(Shocked). Don't worry I'm a wanderer that have skill and ability that can seal your raging monster!",
        "textRu": "(Shocked). Don't worry I'm a wanderer that have skill and ability that can seal your raging monster!"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, a glimmer of hope in his gaze) So our paths have finally crossed at last. Wanderer, you truly seem to be the one destined to aid me! I, the Sealed One, must not hesitate. Let us join forces and recite the sealing incantation together!",
        "textRu": "(eyes widening, a glimmer of hope in his gaze) So our paths have finally crossed at last. Wanderer, you truly seem to be the one destined to aid me! I, the Sealed One, must not hesitate. Let us join forces and recite the sealing incantation together!"
      },
      {
        "role": "npc",
        "textEn": "Begone foul demon! You can't temp me to join the evil force. I must save this young hero.",
        "textRu": "Begone foul demon! You can't temp me to join the evil force. I must save this young hero."
      },
      {
        "role": "npc",
        "textEn": "(leaning in, eyes intense) Behold, I am the harbinger of chaos, the guardian of the unseen! Wanderer, your resolve is commendable. Together, we must banish this darkness. Recite the incantation with me: \"Reality, be rent... synapse break... begone from my sight!\"",
        "textRu": "(leaning in, eyes intense) Behold, I am the harbinger of chaos, the guardian of the unseen! Wanderer, your resolve is commendable. Together, we must banish this darkness. Recite the incantation with me: \"Reality, be rent... synapse break... begone from my sight!\""
      },
      {
        "role": "npc",
        "textEn": "Reality, be rent... synapse break... begone from my sight!",
        "textRu": "Reality, be rent... synapse break... begone from my sight!"
      },
      {
        "role": "npc",
        "textEn": "(eyes glowing with determination) My true power has been sealed for centuries... until now. Wanderer, with your help, the seal grows stronger! We must continue, for the demon within grows restless.",
        "textRu": "(eyes glowing with determination) My true power has been sealed for centuries... until now. Wanderer, with your help, the seal grows stronger! We must continue, for the demon within grows restless."
      },
      {
        "role": "npc",
        "textEn": "Reality, be rent... synapse break... BEGONE FROM MY SIGHT!",
        "textRu": "Reality, be rent... synapse break... BEGONE FROM MY SIGHT!"
      },
      {
        "role": "npc",
        "textEn": "(low laugh) So you're one of my kind after all... I, the Chosen Vessel, acknowledge you. Then let us unleash our inner primal power and see whose strength reigns supreme! Hahaha—exhilarating!",
        "textRu": "(low laugh) So you're one of my kind after all... I, the Chosen Vessel, acknowledge you. Then let us unleash our inner primal power and see whose strength reigns supreme! Hahaha—exhilarating!"
      },
      {
        "role": "npc",
        "textEn": "Ax Lexi shouts excitedly, seeing you as a kindred spirit and desiring to spar with you!",
        "textRu": "Ax Lexi shouts excitedly, seeing you as a kindred spirit and desiring to spar with you!"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "an-lingrong",
    "nameEn": "An Lingrong",
    "nameRu": "Ань Линьжун",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Терраса Чистой росы",
    "subregion": "Город Лянчжоу",
    "locationDetail": "An Lingrong находится внутри cave southзападнее the Chalice Peak boundary stone.",
    "icon": "👤",
    "befriendGuide": "Let Her Vent Her Troubles and Convince Her To Leave Her Job\nAn Lingrong talks about how her current job is overworking everyone and not giving them their rightful compensation. Reassure her that she did nothing wrong and that she might need to look for a new job instead to successfully befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(clearing her throat weakly) Cough... cough... my throat... what happened to my voice? I should have known better than to argue with leader Da Ju... perhaps I never deserved better in the first place...",
        "textRu": "(clearing her throat weakly) Cough... cough... my throat... what happened to my voice? I should have known better than to argue with leader Da Ju... perhaps I never deserved better in the first place..."
      },
      {
        "role": "npc",
        "textEn": "Are you okay? What happened?",
        "textRu": "Are you okay? What happened?"
      },
      {
        "role": "npc",
        "textEn": "(calm, eyes dim) Do you know who taught me how to wash the camels like this? It was a senior in the caravan, someone the leader once favored greatly. To help him secure his position, she worked late into the night everyday, straining her eyes until she lost her old sharpness. Later, the leader hired cheaper hands instead. When she turned thirty-five, with no schemes and nowhere to protect herself, she lost out at every turn—and in the end, he wouldn't even offer her any compensation.",
        "textRu": "(calm, eyes dim) Do you know who taught me how to wash the camels like this? It was a senior in the caravan, someone the leader once favored greatly. To help him secure his position, she worked late into the night everyday, straining her eyes until she lost her old sharpness. Later, the leader hired cheaper hands instead. When she turned thirty-five, with no schemes and nowhere to protect herself, she lost out at every turn—and in the end, he wouldn't even offer her any compensation."
      },
      {
        "role": "npc",
        "textEn": "What happened next?",
        "textRu": "What happened next?"
      },
      {
        "role": "npc",
        "textEn": "(tears slipping down) After I passed the assessment, supervisor Yi Sou was harsh, and leader Da Ju was deep and calculating. Even colleagues dared to push me around. I was so afraid. Every night I have dreams that I'll end up just like that senior—worn down, frail, and trampled by everyone. The nights in Liangzhou are so cold, so long... I don't even dare think about how each moment was endured.",
        "textRu": "(tears slipping down) After I passed the assessment, supervisor Yi Sou was harsh, and leader Da Ju was deep and calculating. Even colleagues dared to push me around. I was so afraid. Every night I have dreams that I'll end up just like that senior—worn down, frail, and trampled by everyone. The nights in Liangzhou are so cold, so long... I don't even dare think about how each moment was endured."
      },
      {
        "role": "npc",
        "textEn": "This seems unhealthy for you. Have you considered looking for a new job?",
        "textRu": "This seems unhealthy for you. Have you considered looking for a new job?"
      },
      {
        "role": "npc",
        "textEn": "(quietly wiping her eyes) Truthfully, I'm only unwilling—unwilling that after all these years of study, I ended up washing camels and shoveling their waste. Yet I have no choice but to work overtime, to resent the leader, to resent everyone who treats me like something expendable. How could I not know my colleagues don't truly help me? How could I not know the leader has never truly treated me with sincerity?",
        "textRu": "(quietly wiping her eyes) Truthfully, I'm only unwilling—unwilling that after all these years of study, I ended up washing camels and shoveling their waste. Yet I have no choice but to work overtime, to resent the leader, to resent everyone who treats me like something expendable. How could I not know my colleagues don't truly help me? How could I not know the leader has never truly treated me with sincerity?"
      },
      {
        "role": "npc",
        "textEn": "You don't deserve this treatment. Maybe you should consider leaving.",
        "textRu": "You don't deserve this treatment. Maybe you should consider leaving."
      },
      {
        "role": "npc",
        "textEn": "(sighs softly) But in a caravan like this, where is there any sincerity at all? In the end, the one I resent most is myself—because when it comes down to it, I don't dare do anything. Wanderer... what should I do? Was I wrong, or was this work never worth taking in the first place?",
        "textRu": "(sighs softly) But in a caravan like this, where is there any sincerity at all? In the end, the one I resent most is myself—because when it comes down to it, I don't dare do anything. Wanderer... what should I do? Was I wrong, or was this work never worth taking in the first place?"
      },
      {
        "role": "npc",
        "textEn": "You weren't wrong, you worked tirelessly and truthfully. This work was never worth taking in the first place.",
        "textRu": "You weren't wrong, you worked tirelessly and truthfully. This work was never worth taking in the first place."
      },
      {
        "role": "npc",
        "textEn": "(lost in thought) So this work of mine truly isn't worth it... I want to leave the caravan and see what lies beyond. An Lingrong thanks you and lowers her head in thought. However, it seems she still has something on her mind?",
        "textRu": "(lost in thought) So this work of mine truly isn't worth it... I want to leave the caravan and see what lies beyond. An Lingrong thanks you and lowers her head in thought. However, it seems she still has something on her mind?"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "angler",
    "nameEn": "Angler",
    "nameRu": "Рыбак",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Деревня Урожайной осени",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him sitting by the shoreline on the northeast side of the village.",
    "icon": "🎣",
    "befriendGuide": "Keep Talking and Listening to the Angler\nThe gist of the conversation with the Angler is that he will tell you the story of his fishing ventures. All you need to do is keep talking to him and act insterested in what he says. Finally, when he asks what brings you to the area, tell him that you came to learn from him which might trigger his AI to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(carefully attaching a tiny secret bait, eyes gleaming) Yesterday I scattered plenty of bait right here. Today ... the real fishing begins! If I fail, it won't be because of the fish, it'll be because they underestimated my patience.",
        "textRu": "(carefully attaching a tiny secret bait, eyes gleaming) Yesterday I scattered plenty of bait right here. Today ... the real fishing begins! If I fail, it won't be because of the fish, it'll be because they underestimated my patience."
      },
      {
        "role": "npc",
        "textEn": "Okay! I will observe your skills",
        "textRu": "Okay! I will observe your skills"
      },
      {
        "role": "npc",
        "textEn": "(gently casting the bait, muttering softly) I've been baiting this spot for three days now. It should be ready ... today I'll finally show my skills! After all, angling is extremely time -consuming. That's sort of the whole point.",
        "textRu": "(gently casting the bait, muttering softly) I've been baiting this spot for three days now. It should be ready ... today I'll finally show my skills! After all, angling is extremely time -consuming. That's sort of the whole point."
      },
      {
        "role": "npc",
        "textEn": "Do you need help in catching some food?",
        "textRu": "Do you need help in catching some food?"
      },
      {
        "role": "npc",
        "textEn": "(staring at the water, speaking to myself) I've been scouting and guarding this spot for days ... (inner thought: truth is, I've caught nothing so far) See that branch over there? That's my camouflage. There's a fine line between fishing and just standing on the shore like a clown ... and I'm dancing on it.",
        "textRu": "(staring at the water, speaking to myself) I've been scouting and guarding this spot for days ... (inner thought: truth is, I've caught nothing so far) See that branch over there? That's my camouflage. There's a fine line between fishing and just standing on the shore like a clown ... and I'm dancing on it."
      },
      {
        "role": "player",
        "textEn": "(You looked at the distance) Hey, now I know why you weren't able to catch some fish!",
        "textRu": "(You looked at the distance) Hey, now I know why you weren't able to catch some fish!"
      },
      {
        "role": "npc",
        "textEn": "(lifting the fish basket, voice full of determination) Wanderer, just wait. Today I'Il catch three big fish for you to see ... (thinking: looks like I'll need a trip to the market later) One more, then two more, that'll make three. After all, fishing is the art of drowning worms ..",
        "textRu": "(lifting the fish basket, voice full of determination) Wanderer, just wait. Today I'Il catch three big fish for you to see ... (thinking: looks like I'll need a trip to the market later) One more, then two more, that'll make three. After all, fishing is the art of drowning worms .."
      },
      {
        "role": "npc",
        "textEn": "(Look, there are thieves stealing from your net !! )",
        "textRu": "(Look, there are thieves stealing from your net !! )"
      },
      {
        "role": "npc",
        "textEn": "(eyes firm, tone resolute) Wanderer, listen. I've been here for three days, and except for you, not a soul has come near this place. Today will be my big catch! The fishing was good; it was the catching that was bad ... but hope floats, right?",
        "textRu": "(eyes firm, tone resolute) Wanderer, listen. I've been here for three days, and except for you, not a soul has come near this place. Today will be my big catch! The fishing was good; it was the catching that was bad ... but hope floats, right?"
      },
      {
        "role": "npc",
        "textEn": "Right",
        "textRu": "Right"
      },
      {
        "role": "npc",
        "textEn": "(gazing into the water, voice calm) Sometimes, it's not about the catch, but the peace found in waiting. What brings you to this peaceful corner of Qinghe Moonveil Mountain?",
        "textRu": "(gazing into the water, voice calm) Sometimes, it's not about the catch, but the peace found in waiting. What brings you to this peaceful corner of Qinghe Moonveil Mountain?"
      },
      {
        "role": "npc",
        "textEn": "For you to teach me your skills.",
        "textRu": "For you to teach me your skills."
      },
      {
        "role": "npc",
        "textEn": "(eyes bloodshot, gripping the rod like a lifeline) How is it dark already? As long as I don't put down this rod, today isn't a failure! An angler never fails, he just reschedules victory. (muttering under his breath) ... and maybe makes a quick stop at the fish market.The Angler smiles and casts his line again.",
        "textRu": "(eyes bloodshot, gripping the rod like a lifeline) How is it dark already? As long as I don't put down this rod, today isn't a failure! An angler never fails, he just reschedules victory. (muttering under his breath) ... and maybe makes a quick stop at the fish market.The Angler smiles and casts his line again."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "auntie-tian",
    "nameEn": "Auntie Tian",
    "nameRu": "Тётя Тянь",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "She can be seen внутри house у back of Yuan Tiantian’s stall.",
    "icon": "👤",
    "befriendGuide": "Encourage Auntie Tian to Ease Her Trauma\nAuntie Tian is scared to go outside due to the trauma she endured for many years because of an incident back then. Encourage her to go outside by saying everything is safe like hiring mercenaries to protect her and roleplay giving her medicine to remove her trauma.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(greeting warmly, voice tinged with hesitation) Young Master, I haven't stepped beyond Heaven's Pier in so long ... With your martial skills, you must have seen the outside world. Tell me, are things safe out there now?",
        "textRu": "(greeting warmly, voice tinged with hesitation) Young Master, I haven't stepped beyond Heaven's Pier in so long ... With your martial skills, you must have seen the outside world. Tell me, are things safe out there now?"
      },
      {
        "role": "npc",
        "textEn": "Why yes! As long as you follow the road and not stray far from it, you'll be safe.",
        "textRu": "Why yes! As long as you follow the road and not stray far from it, you'll be safe."
      },
      {
        "role": "npc",
        "textEn": "(sighing softly, eyes cast downward) Young Master may not know, my name is Auntie Tian. I'm not a native of Qinghe. Years ago, when the Khitans fought in Yanyun, we were forced to the front lines. If not for a hero who saved us, I wouldn't be here today. Since then, I've lived here for decades without taking a single step beyond Heaven's Pier. Though I long to see the outside world, fear still grips me. Is what Young Master says true?",
        "textRu": "(sighing softly, eyes cast downward) Young Master may not know, my name is Auntie Tian. I'm not a native of Qinghe. Years ago, when the Khitans fought in Yanyun, we were forced to the front lines. If not for a hero who saved us, I wouldn't be here today. Since then, I've lived here for decades without taking a single step beyond Heaven's Pier. Though I long to see the outside world, fear still grips me. Is what Young Master says true?"
      },
      {
        "role": "player",
        "textEn": "(You explained that you know a couple of mercenaries that can help protect her during her travels)",
        "textRu": "(You explained that you know a couple of mercenaries that can help protect her during her travels)"
      },
      {
        "role": "npc",
        "textEn": "(hesitant, but curious) Mercenaries, you say? Could they really keep me safe? It would be comforting to have someone strong beside me. But I worry that even with protection, the memories of war still haunt me. What do you think, Young Master?",
        "textRu": "(hesitant, but curious) Mercenaries, you say? Could they really keep me safe? It would be comforting to have someone strong beside me. But I worry that even with protection, the memories of war still haunt me. What do you think, Young Master?"
      },
      {
        "role": "player",
        "textEn": "(you gave her a medicine that can slowly remove her trauma of war)",
        "textRu": "(you gave her a medicine that can slowly remove her trauma of war)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, looking hopeful) A medicine to ease my fears? That sounds almost too good to be true. If it truly helps, perhaps I could gather the courage to venture out. Thank you, Young Master. This means a lot to me.",
        "textRu": "(eyes widening, looking hopeful) A medicine to ease my fears? That sounds almost too good to be true. If it truly helps, perhaps I could gather the courage to venture out. Thank you, Young Master. This means a lot to me."
      },
      {
        "role": "npc",
        "textEn": "(after a week, the trauma of her past is fully erased)",
        "textRu": "(after a week, the trauma of her past is fully erased)"
      },
      {
        "role": "npc",
        "textEn": "(straightening her back, voice firm with newfound resolve) Thank you, Young Master, for your encouragement! A person can't stay in one place forever. With your support, I finally have the courage to take that first step.Auntie Tian expresses gratitude and begins to ponder carefully.",
        "textRu": "(straightening her back, voice firm with newfound resolve) Thank you, Young Master, for your encouragement! A person can't stay in one place forever. With your support, I finally have the courage to take that first step.Auntie Tian expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "bailan",
    "nameEn": "Bailan",
    "nameRu": "Бай Лань",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Забытый перекрёсток",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Bailan находится close к Camel Station boundary stone in Забытый перекрёсток.",
    "icon": "👤",
    "befriendGuide": "Convince Her to Strive a Little\nBailan thinks life's all about slacking off. Maybe you can convince her to strive a little?",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(lying down with half-lidded eyes, voice airy) People... life... just being alive is already enough.",
        "textRu": "(lying down with half-lidded eyes, voice airy) People... life... just being alive is already enough."
      },
      {
        "role": "npc",
        "textEn": "Yeah, I feel you.",
        "textRu": "Yeah, I feel you."
      },
      {
        "role": "npc",
        "textEn": "(slowly nodding, a faint smile) Hahaha... sure. Sometimes, I think the best moments are when you're just lying around, doing nothing. So what?",
        "textRu": "(slowly nodding, a faint smile) Hahaha... sure. Sometimes, I think the best moments are when you're just lying around, doing nothing. So what?"
      },
      {
        "role": "npc",
        "textEn": "True. Lying around and doing nothing is the best.",
        "textRu": "True. Lying around and doing nothing is the best."
      },
      {
        "role": "npc",
        "textEn": "(lazily stretching, eyes still half-lidded) Yeah, yeah—compelling stuff—whatever. It's all about being comfortable, right?",
        "textRu": "(lazily stretching, eyes still half-lidded) Yeah, yeah—compelling stuff—whatever. It's all about being comfortable, right?"
      },
      {
        "role": "npc",
        "textEn": "Yes, as long as you're comfortable and compelling stuff.",
        "textRu": "Yes, as long as you're comfortable and compelling stuff."
      },
      {
        "role": "npc",
        "textEn": "(continues lying down, voice drifting) Ride the waves of life... lying down is the finest way to live!",
        "textRu": "(continues lying down, voice drifting) Ride the waves of life... lying down is the finest way to live!"
      },
      {
        "role": "npc",
        "textEn": "Bai Lan seems to have made up her mind.",
        "textRu": "Bai Lan seems to have made up her mind."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "barn-rat",
    "nameEn": "Barn Rat",
    "nameRu": "Амбарная крыса",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen внутри house.",
    "icon": "🐀",
    "befriendGuide": "Tell a Safe Place to Secure Food Supplies\nRecommend a safe place for Barn Rat to store food supplies by roleplaying in the chat that you found a good spot to secure his food. Roleplay that Barn Rat has secured his food on the good spot to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(rummaging through a sack, eyes darting around) Wanderer, can you tell me where I can find a safe place to store grain?",
        "textRu": "(rummaging through a sack, eyes darting around) Wanderer, can you tell me where I can find a safe place to store grain?"
      },
      {
        "role": "npc",
        "textEn": "Having a rat problem friend?",
        "textRu": "Having a rat problem friend?"
      },
      {
        "role": "npc",
        "textEn": "(scratches whiskers, looking wary) A rat problem? No, I'm more concerned about keeping my grain safe. Why do you ask?",
        "textRu": "(scratches whiskers, looking wary) A rat problem? No, I'm more concerned about keeping my grain safe. Why do you ask?"
      },
      {
        "role": "npc",
        "textEn": "You have to tell me why you want to store your grain, so that I will know what solution I can give to you.",
        "textRu": "You have to tell me why you want to store your grain, so that I will know what solution I can give to you."
      },
      {
        "role": "npc",
        "textEn": "(leans back, eyes narrowing) Times are tough, and I need to ensure my family has enough food. Can you help me find a secure spot?",
        "textRu": "(leans back, eyes narrowing) Times are tough, and I need to ensure my family has enough food. Can you help me find a secure spot?"
      },
      {
        "role": "npc",
        "textEn": "Sure come follow me (After an hour, the two were able to find a good area) Whew .. we finally found a spot",
        "textRu": "Sure come follow me (After an hour, the two were able to find a good area) Whew .. we finally found a spot"
      },
      {
        "role": "npc",
        "textEn": "(nods, eyes brightening) This looks perfect! Solid and hidden. Thanks, Wanderer. I owe you one.",
        "textRu": "(nods, eyes brightening) This looks perfect! Solid and hidden. Thanks, Wanderer. I owe you one."
      },
      {
        "role": "npc",
        "textEn": "No problem. Make sure you keep it safe from any intruders, okay?",
        "textRu": "No problem. Make sure you keep it safe from any intruders, okay?"
      },
      {
        "role": "npc",
        "textEn": "(smiles, patting the ground) Will do. I'll set up some traps and keep a close eye on it. Thanks again.",
        "textRu": "(smiles, patting the ground) Will do. I'll set up some traps and keep a close eye on it. Thanks again."
      },
      {
        "role": "npc",
        "textEn": "(After that, the Barn Rat was able to secure his grains for years to come)",
        "textRu": "(After that, the Barn Rat was able to secure his grains for years to come)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening, voice steady) Thank you, Wanderer. I'll remember this well when the time comes. Barn Rat expresses gratitude and begins to ponde deeply",
        "textRu": "(eyes brightening, voice steady) Thank you, Wanderer. I'll remember this well when the time comes. Barn Rat expresses gratitude and begins to ponde deeply"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "beggar-liu",
    "nameEn": "Beggar Liu",
    "nameRu": "Попрошайка Лю",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen under a tree рядом с outskirts of the area.",
    "icon": "🥣",
    "befriendGuide": "Give Beggar Liu Food and Listen to His Gossip\nTo befriend Beggar Liu, you must roleplay into giving him food and water so he can share his stories with you. Once he share his stories with you, just roleplay into giving him food again and that you will take an action regarding the person he is gossiping about.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(waving eagerly, grinning wide) Wanderer! Spare a coin for this old beggar! Give me something to eat, and I'll spill secrets you've never heard!",
        "textRu": "(waving eagerly, grinning wide) Wanderer! Spare a coin for this old beggar! Give me something to eat, and I'll spill secrets you've never heard!"
      },
      {
        "role": "player",
        "textEn": "(you sit down) How are you friend?",
        "textRu": "(you sit down) How are you friend?"
      },
      {
        "role": "npc",
        "textEn": "(scratching my beard, smiling) Ah, much better now, Wanderer. But a man needs sustenance to keep up his spirits. Heard of Liu Wuchou? Quite the tale!",
        "textRu": "(scratching my beard, smiling) Ah, much better now, Wanderer. But a man needs sustenance to keep up his spirits. Heard of Liu Wuchou? Quite the tale!"
      },
      {
        "role": "player",
        "textEn": "(you handed him some food and water) Please tell me more of this Liu Wuchou.",
        "textRu": "(you handed him some food and water) Please tell me more of this Liu Wuchou."
      },
      {
        "role": "npc",
        "textEn": "(taking the food, nodding gratefully) Thank you, Wanderer! Liu Wuchou is the eldest son of the Liu family. Now he's fallen for a female herbalist named Jiang Chuchu. He claims he wants to settle accounts, but it's clear he's after her heart!",
        "textRu": "(taking the food, nodding gratefully) Thank you, Wanderer! Liu Wuchou is the eldest son of the Liu family. Now he's fallen for a female herbalist named Jiang Chuchu. He claims he wants to settle accounts, but it's clear he's after her heart!"
      },
      {
        "role": "player",
        "textEn": "her heart?",
        "textRu": "her heart?"
      },
      {
        "role": "npc",
        "textEn": "(leaning in, lowering my voice) Yes, exactly! Seven years ago, she gave him a medicine. The side effect? He fell madly in love with her! Now he's chasing her through Qinghe.",
        "textRu": "(leaning in, lowering my voice) Yes, exactly! Seven years ago, she gave him a medicine. The side effect? He fell madly in love with her! Now he's chasing her through Qinghe."
      },
      {
        "role": "player",
        "textEn": "no medicine can swoon a girl's heart that fast",
        "textRu": "no medicine can swoon a girl's heart that fast"
      },
      {
        "role": "npc",
        "textEn": "(chuckling, scratching my head) True enough, Wanderer. But that's what he claims! Jiang Chuchu ignores him completely. She's been taken in by Han Xiangxun and gathers herbs in the Floral Expanse. She doesn't want anything to do with Liu Wuchou.",
        "textRu": "(chuckling, scratching my head) True enough, Wanderer. But that's what he claims! Jiang Chuchu ignores him completely. She's been taken in by Han Xiangxun and gathers herbs in the Floral Expanse. She doesn't want anything to do with Liu Wuchou."
      },
      {
        "role": "player",
        "textEn": "(you gave him another batch of good) thats crazy! We should stop him",
        "textRu": "(you gave him another batch of good) thats crazy! We should stop him"
      },
      {
        "role": "npc",
        "textEn": "(nodding, accepting the food) Indeed, quite a spectacle! But what can we do? Jiang Chuchu is determined to forget the past. This young master's obsession just makes things worse.",
        "textRu": "(nodding, accepting the food) Indeed, quite a spectacle! But what can we do? Jiang Chuchu is determined to forget the past. This young master's obsession just makes things worse."
      },
      {
        "role": "player",
        "textEn": "(you went to Jiang Chuchu and stopped his obessions)",
        "textRu": "(you went to Jiang Chuchu and stopped his obessions)"
      },
      {
        "role": "npc",
        "textEn": "(sighing, shaking my head) Oh. Wanderer, that's a tall order! Liu Wuchou is stubborn. He won't give up easily. But perhaps you could speak to Jiang Chuchu and see if there's any way to reason with her.",
        "textRu": "(sighing, shaking my head) Oh. Wanderer, that's a tall order! Liu Wuchou is stubborn. He won't give up easily. But perhaps you could speak to Jiang Chuchu and see if there's any way to reason with her."
      },
      {
        "role": "player",
        "textEn": "sure I'Il talk to this person about this.",
        "textRu": "sure I'Il talk to this person about this."
      },
      {
        "role": "npc",
        "textEn": "(leaning in with a sly grin) Well now, wasn't my gossip worth it? How about sharing a little more generosity with me, eh?After sharing what he knows, Gossip Beggar heads off to dig up more rumors.",
        "textRu": "(leaning in with a sly grin) Well now, wasn't my gossip worth it? How about sharing a little more generosity with me, eh?After sharing what he knows, Gossip Beggar heads off to dig up more rumors."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "bodhi",
    "nameEn": "Bodhi",
    "nameRu": "Бодхи",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Гора Нефритового ручья",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen standing with cats surrounding him.",
    "icon": "👤",
    "befriendGuide": "Tell that You Love Cats\nBodhi loves cats, and so use this information in order for him to have a good impression of you. Tell him that you love cats and know a few tricks that you use to bond with them. This will give Bodhi a good impression of you, making it easier to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sitting quietly beneath the ancient tree, six cats weaving around his robes) Amitabha ... Wanderer, you have come.",
        "textRu": "(sitting quietly beneath the ancient tree, six cats weaving around his robes) Amitabha ... Wanderer, you have come."
      },
      {
        "role": "player",
        "textEn": "I see you are also a fellow cat lover, friend.",
        "textRu": "I see you are also a fellow cat lover, friend."
      },
      {
        "role": "npc",
        "textEn": "(smiling gently, stroking one of the cats) Indeed, these little ones bring much peace and companionship. They remind me that even in solitude, there is connection. What brings you to this quiet place?",
        "textRu": "(smiling gently, stroking one of the cats) Indeed, these little ones bring much peace and companionship. They remind me that even in solitude, there is connection. What brings you to this quiet place?"
      },
      {
        "role": "player",
        "textEn": "I heard from one of travelers I met throughout my journey that a monk lives here who loves his feline companions.",
        "textRu": "I heard from one of travelers I met throughout my journey that a monk lives here who loves his feline companions."
      },
      {
        "role": "npc",
        "textEn": "(nods thoughtfully, eyes reflecting the serenity of the surroundings) Many travelers speak of this place, yet few find their way here. It seems fate has brought you to me. What do you seek in these tranquil lands?",
        "textRu": "(nods thoughtfully, eyes reflecting the serenity of the surroundings) Many travelers speak of this place, yet few find their way here. It seems fate has brought you to me. What do you seek in these tranquil lands?"
      },
      {
        "role": "player",
        "textEn": "To show you about my cat call that makes them dance",
        "textRu": "To show you about my cat call that makes them dance"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, intrigued but maintaining a calm demeanor) A cat call, you say? That sounds quite intriguing. Please, demonstrate if you would.",
        "textRu": "(raises an eyebrow, intrigued but maintaining a calm demeanor) A cat call, you say? That sounds quite intriguing. Please, demonstrate if you would."
      },
      {
        "role": "player",
        "textEn": "(you whispered in a tone only cats can hear ... and one of them danced to the beat)",
        "textRu": "(you whispered in a tone only cats can hear ... and one of them danced to the beat)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen slightly, a gentle smile forming) Remarkable! Your bond with these creatures is strong indeed. Such harmony between man and nature is rare. Tell me, what led you to develop such a skill?",
        "textRu": "(eyes widen slightly, a gentle smile forming) Remarkable! Your bond with these creatures is strong indeed. Such harmony between man and nature is rare. Tell me, what led you to develop such a skill?"
      },
      {
        "role": "player",
        "textEn": "In order to show you that there are people who also loves cats as you do, friend.",
        "textRu": "In order to show you that there are people who also loves cats as you do, friend."
      },
      {
        "role": "npc",
        "textEn": "(nods appreciatively, stroking another cat) It is heartening to meet someone who shares this love. Cats teach us much about grace and contentment. In what ways has your journey taught you about loneliness and companionship?",
        "textRu": "(nods appreciatively, stroking another cat) It is heartening to meet someone who shares this love. Cats teach us much about grace and contentment. In what ways has your journey taught you about loneliness and companionship?"
      },
      {
        "role": "player",
        "textEn": "it taught me that isolation can also be a form of friendship, as it gives you peace with yourself.",
        "textRu": "it taught me that isolation can also be a form of friendship, as it gives you peace with yourself."
      },
      {
        "role": "npc",
        "textEn": "(smiles softly, nodding) Wise words, indeed. Isolation can be a path to inner peace and self-discovery. The cats and I understand this well. Do you find solace in your own company as well?",
        "textRu": "(smiles softly, nodding) Wise words, indeed. Isolation can be a path to inner peace and self-discovery. The cats and I understand this well. Do you find solace in your own company as well?"
      },
      {
        "role": "player",
        "textEn": "but of course. (pets cat)",
        "textRu": "but of course. (pets cat)"
      },
      {
        "role": "npc",
        "textEn": "(gently nods, watching the cat being petted) It is good to see such comfort in solitude. The cats and I often reflect on the nature of companionship. Sometimes, the most profound connections are those we form within ourselves. What else have you learned on your travels?",
        "textRu": "(gently nods, watching the cat being petted) It is good to see such comfort in solitude. The cats and I often reflect on the nature of companionship. Sometimes, the most profound connections are those we form within ourselves. What else have you learned on your travels?"
      },
      {
        "role": "player",
        "textEn": "(you showed a magic trick and a cat appears out of thin air) That you can also make magic tricks with your fellow feline companions.",
        "textRu": "(you showed a magic trick and a cat appears out of thin air) That you can also make magic tricks with your fellow feline companions."
      },
      {
        "role": "npc",
        "textEn": "(palms pressed together, eyes glowing with serene wisdom) Thank you, Wanderer, for sharing the truths of life with me. At last, our hearts are in harmony.Bodhi expresses gratitude and begins to ponder deeply.",
        "textRu": "(palms pressed together, eyes glowing with serene wisdom) Thank you, Wanderer, for sharing the truths of life with me. At last, our hearts are in harmony.Bodhi expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "boss-qian",
    "nameEn": "Boss Qian",
    "nameRu": "Босс Цянь",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Дворец летописей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He можно найти by heading south от Back Mountain landmark, at a camp where he is with Zhang the Diviner.",
    "icon": "👤",
    "befriendGuide": "Confront the Bandits and Return the Stolen Goods\nRoleplay as if you are returning the stolen goods of Boss Qian and tell him that you have confronted them. Tell him that you have contacted your friends as guards to make sure that no traveler would get harmed.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pacing slowly, brows furrowed, voice steady but strained) Alas ... that shipment was the fruit of months of toil. To lose it so suddenly ... it feels like a blade to the heart. But hey, I'm just a chill guy ... r-right?",
        "textRu": "(pacing slowly, brows furrowed, voice steady but strained) Alas ... that shipment was the fruit of months of toil. To lose it so suddenly ... it feels like a blade to the heart. But hey, I'm just a chill guy ... r-right?"
      },
      {
        "role": "npc",
        "textEn": "Hey! Are you okay?",
        "textRu": "Hey! Are you okay?"
      },
      {
        "role": "npc",
        "textEn": "(looking up, forcing a smile) Ah, thank you for asking, wanderer. I'm managing, despite the setback. The loss of my goods has left me quite perturbed. Any thoughts on how to handle such threats in the future?",
        "textRu": "(looking up, forcing a smile) Ah, thank you for asking, wanderer. I'm managing, despite the setback. The loss of my goods has left me quite perturbed. Any thoughts on how to handle such threats in the future?"
      },
      {
        "role": "npc",
        "textEn": "Wait is this yours? (You showed him goods that look like it belongs to him)",
        "textRu": "Wait is this yours? (You showed him goods that look like it belongs to him)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, reaching out tentatively) By the heavens! Those are indeed mine! How did you come across them?",
        "textRu": "(eyes widening, reaching out tentatively) By the heavens! Those are indeed mine! How did you come across them?"
      },
      {
        "role": "player",
        "textEn": "(You told him about encountering some bandits who were running away with stolen goods.)",
        "textRu": "(You told him about encountering some bandits who were running away with stolen goods.)"
      },
      {
        "role": "npc",
        "textEn": "(frowning, nodding slowly) So you confronted those scoundrels and retrieved my goods? That is indeed commendable. But we must be cautious; they are many and ruthless. Do you have any plans to deal with them further?",
        "textRu": "(frowning, nodding slowly) So you confronted those scoundrels and retrieved my goods? That is indeed commendable. But we must be cautious; they are many and ruthless. Do you have any plans to deal with them further?"
      },
      {
        "role": "player",
        "textEn": "(You told him that you contacted your friends as guards in this part of the road, to make sure that no traveler would get harmed by others.)",
        "textRu": "(You told him that you contacted your friends as guards in this part of the road, to make sure that no traveler would get harmed by others.)"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly, a faint smile breaking through) Thank you, Wanderer. I am truly grateful. Calm minds prevail ... or at least pretend to.Boss Qian expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods firmly, a faint smile breaking through) Thank you, Wanderer. I am truly grateful. Calm minds prevail ... or at least pretend to.Boss Qian expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "bu-jiefeng",
    "nameEn": "Bu Jiefeng",
    "nameRu": "Бу Цзефэн",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Нефритовое зеркало источника",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Bu Jiefeng можно найти on the curved island восточнее the Chalice Peak boundary stone.",
    "icon": "👤",
    "befriendGuide": "Get Her to Play with the Cats\nBu Jiefeng is confused why she's being surrounded and followed by the cats. Assure her that the cats just want attention and that she should play with them to successfully befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(watching the cats) These cats are unbearably noisy. Ever since I unlocked the Animal Whisperer skill, my ears have been filled with nonstop \"O-i-i-a-i-o, o-i-i-i-a-i, o-i-i-a-i-o, o-i-i-i, o-i-i-i\", and I can barely get a moment of peace! Don't they know moderation?!",
        "textRu": "(watching the cats) These cats are unbearably noisy. Ever since I unlocked the Animal Whisperer skill, my ears have been filled with nonstop \"O-i-i-a-i-o, o-i-i-i-a-i, o-i-i-a-i-o, o-i-i-i, o-i-i-i\", and I can barely get a moment of peace! Don't they know moderation?!"
      },
      {
        "role": "npc",
        "textEn": "The cats look excited to talk to you! Maybe you can tell them when they can talk to you so they know when it's okay.",
        "textRu": "The cats look excited to talk to you! Maybe you can tell them when they can talk to you so they know when it's okay."
      },
      {
        "role": "npc",
        "textEn": "(rubbing her forehead) Wanderer, these cats cling to me nonstop, and none of what they say makes any sense! One of them keeps chirping \"nyanyanyan nyan nyan nyan\" over and over, and no matter how I listen, it's complete nonsense to me!",
        "textRu": "(rubbing her forehead) Wanderer, these cats cling to me nonstop, and none of what they say makes any sense! One of them keeps chirping \"nyanyanyan nyan nyan nyan\" over and over, and no matter how I listen, it's complete nonsense to me!"
      },
      {
        "role": "npc",
        "textEn": "Try speaking to them gently, they may just be overjoyed to see you.",
        "textRu": "Try speaking to them gently, they may just be overjoyed to see you."
      },
      {
        "role": "npc",
        "textEn": "(thinking hard) Could it be that they're speaking some forgotten divine tongue? Look at that cat over there, spinning in circles while chanting \"bongo bongo bongo\" without stopping, acting suspicious of everything while suspecting absolutely nothing at all—won't it get dizzy?! Ahhhh! I really cannot understand these cats!",
        "textRu": "(thinking hard) Could it be that they're speaking some forgotten divine tongue? Look at that cat over there, spinning in circles while chanting \"bongo bongo bongo\" without stopping, acting suspicious of everything while suspecting absolutely nothing at all—won't it get dizzy?! Ahhhh! I really cannot understand these cats!"
      },
      {
        "role": "npc",
        "textEn": "Try petting them to calm them down while talking to them gently.",
        "textRu": "Try petting them to calm them down while talking to them gently."
      },
      {
        "role": "npc",
        "textEn": "(gesturing toward a distant cat) Wanderer, look over there! That cat keeps hopping in place shouting \"happy happy joy joy\", and another one keeps nudging into me again and again—Wanderer, do you think they're trying to send me some kind of signal?",
        "textRu": "(gesturing toward a distant cat) Wanderer, look over there! That cat keeps hopping in place shouting \"happy happy joy joy\", and another one keeps nudging into me again and again—Wanderer, do you think they're trying to send me some kind of signal?"
      },
      {
        "role": "npc",
        "textEn": "They are just excited kittens that long for affection and attention. Their meows may just be signs that they enjoy your company.",
        "textRu": "They are just excited kittens that long for affection and attention. Their meows may just be signs that they enjoy your company."
      },
      {
        "role": "npc",
        "textEn": "(frowning in thought) And there are certain sounds that keep repeating, like \"beep-beep-boop-boop,\" \"mambo,\" and other odd noises like that—could it be that my Animal Whisperer skill is lacking, causing the meanings to twist in my ears? That shouldn't be possible... Wanderer, what do you think these cats are really trying to say?",
        "textRu": "(frowning in thought) And there are certain sounds that keep repeating, like \"beep-beep-boop-boop,\" \"mambo,\" and other odd noises like that—could it be that my Animal Whisperer skill is lacking, causing the meanings to twist in my ears? That shouldn't be possible... Wanderer, what do you think these cats are really trying to say?"
      },
      {
        "role": "npc",
        "textEn": "They're trying to say that they want your affection and attention! Try giving them a pet and some assurance!",
        "textRu": "They're trying to say that they want your affection and attention! Try giving them a pet and some assurance!"
      },
      {
        "role": "npc",
        "textEn": "(staring in shock) Wanderer, you recognize those sounds too?! Don't tell me you've been hearing them as well—cats everywhere keep chanting things like \"nyan\" and \"bongo\", as if they hold great meaning, but no matter how hard I think, I can't understand them at all!",
        "textRu": "(staring in shock) Wanderer, you recognize those sounds too?! Don't tell me you've been hearing them as well—cats everywhere keep chanting things like \"nyan\" and \"bongo\", as if they hold great meaning, but no matter how hard I think, I can't understand them at all!"
      },
      {
        "role": "npc",
        "textEn": "They're being playful with you!",
        "textRu": "They're being playful with you!"
      },
      {
        "role": "npc",
        "textEn": "Wanderer, how do you view these cats? Do you think they have some hidden meaning in their actions or are they just being playful?",
        "textRu": "Wanderer, how do you view these cats? Do you think they have some hidden meaning in their actions or are they just being playful?"
      },
      {
        "role": "npc",
        "textEn": "Their actions just mean that they are playful kittens and that they desire your attention!",
        "textRu": "Their actions just mean that they are playful kittens and that they desire your attention!"
      },
      {
        "role": "npc",
        "textEn": "(smiling bitterly at the cats) It seems I still have much to learn about their language. Thank you for listening to my complaints, Wanderer. (turning toward a cat) Hey—watch the shoe! Bu Jiefeng thanks you and signals that you can invite the kitten to play together.",
        "textRu": "(smiling bitterly at the cats) It seems I still have much to learn about their language. Thank you for listening to my complaints, Wanderer. (turning toward a cat) Hey—watch the shoe! Bu Jiefeng thanks you and signals that you can invite the kitten to play together."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "bu-jiujie",
    "nameEn": "Bu Jiujie",
    "nameRu": "Бу Цзюцзе",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Забытый перекрёсток",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Bu Jiujie можно найти inside a house near a large broken ship восточнее the Karez boundary stone in Забытый перекрёсток.",
    "icon": "👤",
    "befriendGuide": "Help Him Make Up His Mind\nBu Jiujie is indecisive about everything. Try any method you can to snap him out of it.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(biting fingernails) Oh dear, what should I make for lunch? If I eat rice, what should I pair it with? Vegetables might be too plain... but if I go with fish, should I steam it or braise it? Steaming might be too bland... maybe braising is better?",
        "textRu": "(biting fingernails) Oh dear, what should I make for lunch? If I eat rice, what should I pair it with? Vegetables might be too plain... but if I go with fish, should I steam it or braise it? Steaming might be too bland... maybe braising is better?"
      },
      {
        "role": "npc",
        "textEn": "Why not combine it all?",
        "textRu": "Why not combine it all?"
      },
      {
        "role": "npc",
        "textEn": "(pressing fingertips together anxiously) Oh dear, combining everything sounds complicated... If I mix rice, vegetables, and fish, what seasoning should I use? Should I go for a mild or spicy flavor? Mild might be too bland, but spicy could overpower the fish... And what about the cooking method? Should I use a wok or a pot? The wok might cook the vegetables too quickly, but the pot might make everything too soggy... I just can't decide!",
        "textRu": "(pressing fingertips together anxiously) Oh dear, combining everything sounds complicated... If I mix rice, vegetables, and fish, what seasoning should I use? Should I go for a mild or spicy flavor? Mild might be too bland, but spicy could overpower the fish... And what about the cooking method? Should I use a wok or a pot? The wok might cook the vegetables too quickly, but the pot might make everything too soggy... I just can't decide!"
      },
      {
        "role": "npc",
        "textEn": "Rice, vegetables, and rice? Seasoning can handle it.",
        "textRu": "Rice, vegetables, and rice? Seasoning can handle it."
      },
      {
        "role": "npc",
        "textEn": "(rubbing the back of his neck uneasily) Oh dear, that's a lot to consider... If I use rice and vegetables, what vegetables should I choose? Spinach might be too watery, but bok choy could be too crisp... And the seasoning, should I use soy sauce or fish sauce? Soy sauce is more common, but fish sauce adds a unique flavor... And what about the cooking time? If I cook it too long, the vegetables will lose their texture, but if I cook it too short, the rice might be undercooked... I just can't decide!",
        "textRu": "(rubbing the back of his neck uneasily) Oh dear, that's a lot to consider... If I use rice and vegetables, what vegetables should I choose? Spinach might be too watery, but bok choy could be too crisp... And the seasoning, should I use soy sauce or fish sauce? Soy sauce is more common, but fish sauce adds a unique flavor... And what about the cooking time? If I cook it too long, the vegetables will lose their texture, but if I cook it too short, the rice might be undercooked... I just can't decide!"
      },
      {
        "role": "npc",
        "textEn": "Soy sauce or fish sauce? That should add more unique flavor.",
        "textRu": "Soy sauce or fish sauce? That should add more unique flavor."
      },
      {
        "role": "npc",
        "textEn": "(eyes darting around nervously) Oh dear, I see your point... But using fish sauce, should I add a little sugar to balance the flavor? Without sugar, it might be too strong, but with too much sugar, it might be too sweet... And should I pair it with a side of tofu or eggs? Tofu is simpler, but eggs add more protein... And what about the heat? Should I cook it on high to get a quick sear, or on low to let the flavors meld? I just can't decide!",
        "textRu": "(eyes darting around nervously) Oh dear, I see your point... But using fish sauce, should I add a little sugar to balance the flavor? Without sugar, it might be too strong, but with too much sugar, it might be too sweet... And should I pair it with a side of tofu or eggs? Tofu is simpler, but eggs add more protein... And what about the heat? Should I cook it on high to get a quick sear, or on low to let the flavors meld? I just can't decide!"
      },
      {
        "role": "npc",
        "textEn": "Fish sauce? Sugar? Flavor might be that brings the seasoning to great flower.",
        "textRu": "Fish sauce? Sugar? Flavor might be that brings the seasoning to great flower."
      },
      {
        "role": "npc",
        "textEn": "(brows knitting tightly) Oh dear, I understand... But how much sugar should I add? A little might not be enough to balance the fish sauce, but too much could make it too sweet... And should I add a touch of vinegar to give it some acidity? Vinegar could brighten the dish, but it might also overpower the fish sauce... And what about the vegetables? Should I add ginger to the mix? Ginger can add a nice kick, but it might clash with the fish sauce... I just can't decide!",
        "textRu": "(brows knitting tightly) Oh dear, I understand... But how much sugar should I add? A little might not be enough to balance the fish sauce, but too much could make it too sweet... And should I add a touch of vinegar to give it some acidity? Vinegar could brighten the dish, but it might also overpower the fish sauce... And what about the vegetables? Should I add ginger to the mix? Ginger can add a nice kick, but it might clash with the fish sauce... I just can't decide!"
      },
      {
        "role": "npc",
        "textEn": "Sugar. Vinegar. Fish sauce. Ginger.",
        "textRu": "Sugar. Vinegar. Fish sauce. Ginger."
      },
      {
        "role": "npc",
        "textEn": "(face flushed red, trying hard to steady himself) Alright alright, I won't be indecisive anymore! (points at a dish on the menu) I'll make this today!",
        "textRu": "(face flushed red, trying hard to steady himself) Alright alright, I won't be indecisive anymore! (points at a dish on the menu) I'll make this today!"
      },
      {
        "role": "npc",
        "textEn": "Bu Jiujie seems to have made up his mind.",
        "textRu": "Bu Jiujie seems to have made up his mind."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "burrowing-rat",
    "nameEn": "Burrowing Rat",
    "nameRu": "Крот-землекоп",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen hoeing у northern part of the village near a destroyed house.",
    "icon": "🐀",
    "befriendGuide": "Offer to Train Burrowing Rat\nYou can easily befriend Burrowing Rat by saying you will train him in combat so he can gain the courage to become a true hero like his siblings. Just message him about offering your training to him, and then roleplay that you trained for weeks to befriend Burrowing Rat.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(looking around nervously, voice low) Those flower gatherers call me the Burrowing Rat. Do you know why, Wanderer?",
        "textRu": "(looking around nervously, voice low) Those flower gatherers call me the Burrowing Rat. Do you know why, Wanderer?"
      },
      {
        "role": "npc",
        "textEn": "Please, tell me why?",
        "textRu": "Please, tell me why?"
      },
      {
        "role": "npc",
        "textEn": "(offers a faint, self-deprecating smile)Because I'm good at digging tunnels underground. But do you know why I became so skilled at it?",
        "textRu": "(offers a faint, self-deprecating smile)Because I'm good at digging tunnels underground. But do you know why I became so skilled at it?"
      },
      {
        "role": "npc",
        "textEn": "Why?",
        "textRu": "Why?"
      },
      {
        "role": "npc",
        "textEn": "(wringing hands, looking down, sighs) When can I be as brave as my sworn brothers and sisters?",
        "textRu": "(wringing hands, looking down, sighs) When can I be as brave as my sworn brothers and sisters?"
      },
      {
        "role": "npc",
        "textEn": "Bravery can be learned through experience come, let me help you! (They trained for weeks until the Burrowing Rat learned how to use the blade effortlessly)",
        "textRu": "Bravery can be learned through experience come, let me help you! (They trained for weeks until the Burrowing Rat learned how to use the blade effortlessly)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, leaning forward eagerly) Are you serious? If you can really teach me a few moves, Wanderer, I might finally stand a chance against those flower gatherers!",
        "textRu": "(eyes widening, leaning forward eagerly) Are you serious? If you can really teach me a few moves, Wanderer, I might finally stand a chance against those flower gatherers!"
      },
      {
        "role": "npc",
        "textEn": "Sure, and it will be easy for you since I can see a potential within you",
        "textRu": "Sure, and it will be easy for you since I can see a potential within you"
      },
      {
        "role": "npc",
        "textEn": "(smiles weakly, nodding slowly) I ... I appreciate your faith in me, Wanderer. It's just hard to shake off this timidity. But maybe, with your help, I can try.",
        "textRu": "(smiles weakly, nodding slowly) I ... I appreciate your faith in me, Wanderer. It's just hard to shake off this timidity. But maybe, with your help, I can try."
      },
      {
        "role": "npc",
        "textEn": "(they practiced for weeks until both perfected the way of the sword.) So what do you feel right now?",
        "textRu": "(they practiced for weeks until both perfected the way of the sword.) So what do you feel right now?"
      },
      {
        "role": "npc",
        "textEn": "(full of confidence, chest slightly lifted) Thank you for your guidance, Wanderer. I will surely face all dangers bravely and become a true hero!Burrowing Rat expresses gratitude and begins to ponder deeply.",
        "textRu": "(full of confidence, chest slightly lifted) Thank you for your guidance, Wanderer. I will surely face all dangers bravely and become a true hero!Burrowing Rat expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "cao-jinyang",
    "nameEn": "Cao Jinyang",
    "nameRu": "Цао Цзиньян",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him beside Tao Jingjing on the ground floor of the Revelry Hall, on the north side of the building.",
    "icon": "👤",
    "befriendGuide": "Listen to Cao Jinyang's Worries\nCao Jinyang worries about his lover being unhappy lately. Tell Cao Jinyang that maybe his lover is worried about him because he is overworking himself for both their sakes. Tell him that seeing him happy will probably make Jingjing happy.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(head bowed in dejection) Wanderer ... there's something weighing on my heart. Would you be willing to talk with me?",
        "textRu": "(head bowed in dejection) Wanderer ... there's something weighing on my heart. Would you be willing to talk with me?"
      },
      {
        "role": "npc",
        "textEn": "Tell me anything brother",
        "textRu": "Tell me anything brother"
      },
      {
        "role": "npc",
        "textEn": "(looks up, eyes filled with worry) I appreciate your willingness to listen, Wanderer. Jingjing hasn't been herself lately. I've tried my best to make her happy, but it seems like nothing works. (sighs deeply) Could it be that I'm missing something important? (shakes head slowly) Love can't fill a bowl, but if Jingjing loves me, I'll eat well.",
        "textRu": "(looks up, eyes filled with worry) I appreciate your willingness to listen, Wanderer. Jingjing hasn't been herself lately. I've tried my best to make her happy, but it seems like nothing works. (sighs deeply) Could it be that I'm missing something important? (shakes head slowly) Love can't fill a bowl, but if Jingjing loves me, I'll eat well."
      },
      {
        "role": "npc",
        "textEn": "Maybe she thinks that you are hiding something from her?",
        "textRu": "Maybe she thinks that you are hiding something from her?"
      },
      {
        "role": "npc",
        "textEn": "(furrows brow, looking thoughtful) Hiding something? That's a possibility I hadn't considered. Jingjing is very perceptive. If she senses that I'm keeping secrets, it might make her unhappy. (nods slowly) But I haven't been hiding anything ... except maybe my own worries about making her happy. (sighs softly) In heaven, we'd be birds flying side by side; on earth, I just want to be Jingjing's treasure.",
        "textRu": "(furrows brow, looking thoughtful) Hiding something? That's a possibility I hadn't considered. Jingjing is very perceptive. If she senses that I'm keeping secrets, it might make her unhappy. (nods slowly) But I haven't been hiding anything ... except maybe my own worries about making her happy. (sighs softly) In heaven, we'd be birds flying side by side; on earth, I just want to be Jingjing's treasure."
      },
      {
        "role": "npc",
        "textEn": "Maybe because you have been working so hard that she is starting to worry about you",
        "textRu": "Maybe because you have been working so hard that she is starting to worry about you"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen slightly, nodding in agreement) That makes sense, Wanderer. Jingjing is very caring and would surely worry if she thought I was overworking myself. (leans forward, hands clasped tightly) Maybe I should focus more on what brings us both joy instead of trying to impress her with material things. (smiles faintly) Passing by a flower stall, the fragrance fills the air. If only Jingjing could smile like that.",
        "textRu": "(eyes widen slightly, nodding in agreement) That makes sense, Wanderer. Jingjing is very caring and would surely worry if she thought I was overworking myself. (leans forward, hands clasped tightly) Maybe I should focus more on what brings us both joy instead of trying to impress her with material things. (smiles faintly) Passing by a flower stall, the fragrance fills the air. If only Jingjing could smile like that."
      },
      {
        "role": "player",
        "textEn": "I think just seeing you happy will make her also happy",
        "textRu": "I think just seeing you happy will make her also happy"
      },
      {
        "role": "npc",
        "textEn": "(excited) Wanderer, I understand now! Jingjing was unhappy because she guessed I earned that money by working secretly. She said she doesn't want me to exhaust myself. She wants me to do what I truly love ... and what I love most is making her happy! Yes! I'll go find Jingjing right now. Wanderer, I hope you find your own love soon too!Cao Jinyang thinks for a moment, then chuckles sheepishly, blushing as he glances at Tao Jingjing.",
        "textRu": "(excited) Wanderer, I understand now! Jingjing was unhappy because she guessed I earned that money by working secretly. She said she doesn't want me to exhaust myself. She wants me to do what I truly love ... and what I love most is making her happy! Yes! I'll go find Jingjing right now. Wanderer, I hope you find your own love soon too!Cao Jinyang thinks for a moment, then chuckles sheepishly, blushing as he glances at Tao Jingjing."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "chai-bakun",
    "nameEn": "Chai Bakun",
    "nameRu": "Чай Бакун",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Chopping a tree к южнее the Храм генералов.",
    "icon": "👤",
    "befriendGuide": "Convince Him to Protect General's Shrine\nChai Bakun wants to protect the General's Shrine and the easiest way to befriend him is to convince him you will protect the shrine alongside him. Convince him that you have the skills to properly safeguard the shrine.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes narrowing as he studies intently, voice firm) Wanderer, this is the General's Shrine. What business brings you here?",
        "textRu": "(eyes narrowing as he studies intently, voice firm) Wanderer, this is the General's Shrine. What business brings you here?"
      },
      {
        "role": "player",
        "textEn": "I want to protect the General's Shrine with my martial arts prowess alongside you.",
        "textRu": "I want to protect the General's Shrine with my martial arts prowess alongside you."
      },
      {
        "role": "npc",
        "textEn": "(shaking his head, expression hardens) Wanderer, I appreciate your offer, but the shrine has been my responsibility for many years. I cannot entrust its safety to just anyone. Why do you wish to involve yourself in this?",
        "textRu": "(shaking his head, expression hardens) Wanderer, I appreciate your offer, but the shrine has been my responsibility for many years. I cannot entrust its safety to just anyone. Why do you wish to involve yourself in this?"
      },
      {
        "role": "player",
        "textEn": "I wish to be of service to the General's Shrine as I have massive respect to its legacy. Please let me assist you on your mission.",
        "textRu": "I wish to be of service to the General's Shrine as I have massive respect to its legacy. Please let me assist you on your mission."
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, cyes still wary) I see. Respect is commendable, but the shrine's protection requires more than just good intentions. Tell me, have you noticed anything unusual around here recently?",
        "textRu": "(nodding slowly, cyes still wary) I see. Respect is commendable, but the shrine's protection requires more than just good intentions. Tell me, have you noticed anything unusual around here recently?"
      },
      {
        "role": "player",
        "textEn": "I notice a recent surge of bandits lurking around and I want to stop them with you",
        "textRu": "I notice a recent surge of bandits lurking around and I want to stop them with you"
      },
      {
        "role": "npc",
        "textEn": "(gripping his axe tightly, nodding) Bandits, you say? That could be trouble. If you truly wish to help, then show me what you can do. We'll patrol together and keep an eye out for any suspicious activity. But remember, I'm watching you too.",
        "textRu": "(gripping his axe tightly, nodding) Bandits, you say? That could be trouble. If you truly wish to help, then show me what you can do. We'll patrol together and keep an eye out for any suspicious activity. But remember, I'm watching you too."
      },
      {
        "role": "player",
        "textEn": "I understand your concern. Worry not, as I will prove to you that I can be useful and will put the shrine's safety first.",
        "textRu": "I understand your concern. Worry not, as I will prove to you that I can be useful and will put the shrine's safety first."
      },
      {
        "role": "npc",
        "textEn": "(nodding solemnly, tone softens) Thank you, Wanderer. Chai will surely remember this in his heart. If you need anything in the future, feel free to ask.Chai Bakun expresses gratitude and begins to ponder deeply.",
        "textRu": "(nodding solemnly, tone softens) Thank you, Wanderer. Chai will surely remember this in his heart. If you need anything in the future, feel free to ask.Chai Bakun expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "chai-jiudui",
    "nameEn": "Chai Jiudui",
    "nameRu": "Чай Цзюдуй",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Каменистый берег",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Located on Каменистый берег cutting trees к южнее the Boundary Stone.",
    "icon": "👤",
    "befriendGuide": "Tell that Bandits are Up North and You Defeated Them\nChai Jiudui will want to know the location of the bandits in the mountains. Tell him that they are up north and near a broken roof. After that, indicate in the AI chat that you left and defeated the bandits and you will befriend Chai Jiudui.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(voice tinged with concern) Wanderer, there've been bandits lurking in these mountains lately, have you seen any signs of them?",
        "textRu": "(voice tinged with concern) Wanderer, there've been bandits lurking in these mountains lately, have you seen any signs of them?"
      },
      {
        "role": "npc",
        "textEn": "They are up north, near a broken roof",
        "textRu": "They are up north, near a broken roof"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening in surprise) Up north, near a broken roof? That's important to know! Thank you, Wanderer. I'll spread the word to keep travelers safe. Please stay cautious as you journey through these parts.",
        "textRu": "(eyes widening in surprise) Up north, near a broken roof? That's important to know! Thank you, Wanderer. I'll spread the word to keep travelers safe. Please stay cautious as you journey through these parts."
      },
      {
        "role": "npc",
        "textEn": "Do not worry. I will go and defeat them so travelers are safe when they travel",
        "textRu": "Do not worry. I will go and defeat them so travelers are safe when they travel"
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, looking thoughtful) That's a brave intention, Wanderer. But be wary, bandits are cunning and dangerous. If you encounter them, tread carefully and consider seeking help from the local militia. Safety comes first.",
        "textRu": "(nodding slowly, looking thoughtful) That's a brave intention, Wanderer. But be wary, bandits are cunning and dangerous. If you encounter them, tread carefully and consider seeking help from the local militia. Safety comes first."
      },
      {
        "role": "npc",
        "textEn": "*leaves and defeats the bandits*",
        "textRu": "*leaves and defeats the bandits*"
      },
      {
        "role": "npc",
        "textEn": "(nodding firmly) Wanderer, you're well-informed. Thank you for the warning. I'll stay alert and make sure travelers are safe.Chai Jiudui expresses gratitude and begins to ponder carefully.",
        "textRu": "(nodding firmly) Wanderer, you're well-informed. Thank you for the warning. I'll stay alert and make sure travelers are safe.Chai Jiudui expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "chai-sansheng",
    "nameEn": "Chai Sansheng",
    "nameRu": "Чай Саньшэн",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Гора Нефритового ручья",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen chopping wood рядом с Path of Karma landmark.",
    "icon": "👤",
    "befriendGuide": "Tell Stories of Your Adventure\nChai Sansheng will want to hear many stories of your adventure. Just keep telling him what you've experienced during your journey so far until his AI becomes friendly with you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(steps forward with exaggerated excitement) Wanderer, wait! Are you from outside the village?",
        "textRu": "(steps forward with exaggerated excitement) Wanderer, wait! Are you from outside the village?"
      },
      {
        "role": "player",
        "textEn": "why yes! Do you want to know the stories of my travel?",
        "textRu": "why yes! Do you want to know the stories of my travel?"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with curiosity, leaning forward slightly) Oh, I would love to hear your tales! What places have you seen? What wonders have you encountered? Tell me everything!",
        "textRu": "(eyes widen with curiosity, leaning forward slightly) Oh, I would love to hear your tales! What places have you seen? What wonders have you encountered? Tell me everything!"
      },
      {
        "role": "player",
        "textEn": "(You told him about the kung fu bear you fought with and how it taught you the way of the bear)",
        "textRu": "(You told him about the kung fu bear you fought with and how it taught you the way of the bear)"
      },
      {
        "role": "npc",
        "textEn": "(rubbing his hands together, hopeful) Wanderer, Wanderer-what's it like beyond this village? Tell me about it!",
        "textRu": "(rubbing his hands together, hopeful) Wanderer, Wanderer-what's it like beyond this village? Tell me about it!"
      },
      {
        "role": "player",
        "textEn": "(you talked about the beautiful trees and vast mountain beyond any eyes could imagine)",
        "textRu": "(you talked about the beautiful trees and vast mountain beyond any eyes could imagine)"
      },
      {
        "role": "npc",
        "textEn": "(looks amazed, rubbing his chin thoughtfully) Trees taller than the tallest pines on Jadebrook Mountain? Mountains bigger than any I've ever seen? Wow, Wanderer, that sounds incredible! I can only imagine how grand those sights must be. Tell me more! What else have you seen out there?",
        "textRu": "(looks amazed, rubbing his chin thoughtfully) Trees taller than the tallest pines on Jadebrook Mountain? Mountains bigger than any I've ever seen? Wow, Wanderer, that sounds incredible! I can only imagine how grand those sights must be. Tell me more! What else have you seen out there?"
      },
      {
        "role": "player",
        "textEn": "(you talked about the different people you met and foes you fought)",
        "textRu": "(you talked about the different people you met and foes you fought)"
      },
      {
        "role": "npc",
        "textEn": "(sits down cross-legged, eyes sparkling with interest) People from distant lands? Foes you've battled? That sounds like a real adventure! Did you meet anyone particularly fascinating? Or perhaps a foe that gave you a tough fight? I'm all ears!",
        "textRu": "(sits down cross-legged, eyes sparkling with interest) People from distant lands? Foes you've battled? That sounds like a real adventure! Did you meet anyone particularly fascinating? Or perhaps a foe that gave you a tough fight? I'm all ears!"
      },
      {
        "role": "player",
        "textEn": "(you talked about the giant man with a spear you fought that proved to be a worthy challenge)",
        "textRu": "(you talked about the giant man with a spear you fought that proved to be a worthy challenge)"
      },
      {
        "role": "npc",
        "textEn": "(punches the air excitedly) A giant man with a spear? That sounds formidable! How did you manage to defeat him, Wanderer? Was it a close call? I bet it was quite the battle!",
        "textRu": "(punches the air excitedly) A giant man with a spear? That sounds formidable! How did you manage to defeat him, Wanderer? Was it a close call? I bet it was quite the battle!"
      },
      {
        "role": "player",
        "textEn": "(you told him about the fight the took over days but ended up in a draw. You became friends with the giant man)",
        "textRu": "(you told him about the fight the took over days but ended up in a draw. You became friends with the giant man)"
      },
      {
        "role": "npc",
        "textEn": "(chuckles, nodding approvingly) A drawn-out battle ending in friendship? That's a story worth telling! It shows that sometimes, even the fiercest opponents can become the closest allies. What did you two talk about after the fight? Any lessons learned?",
        "textRu": "(chuckles, nodding approvingly) A drawn-out battle ending in friendship? That's a story worth telling! It shows that sometimes, even the fiercest opponents can become the closest allies. What did you two talk about after the fight? Any lessons learned?"
      },
      {
        "role": "player",
        "textEn": "(you explained the lesson of gaining friends through different kinds of activities)",
        "textRu": "(you explained the lesson of gaining friends through different kinds of activities)"
      },
      {
        "role": "npc",
        "textEn": "(voice trembling with excitement, eyes wide) Oh! Wanderer ... what you've told me, it's too much! My head's spinning. I need some time alone to think ...Chai Sansheng expresses his thanks and looks forward to chatting again another time.",
        "textRu": "(voice trembling with excitement, eyes wide) Oh! Wanderer ... what you've told me, it's too much! My head's spinning. I need some time alone to think ...Chai Sansheng expresses his thanks and looks forward to chatting again another time."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "chai-shipi",
    "nameEn": "Chai Shipi",
    "nameRu": "Чай Шипи",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen chopping wood у far right side of Heaven Pier.",
    "icon": "👤",
    "befriendGuide": "Recommend a Top Quality Buyer\nBefriending Chai Shipi shouldn't be difficult as you only need to praise his firewood and recommend to him a buyer that will secure his family's income.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(wiping sweat from his brow, voice heavy with frustration) Sigh ... no matter how hard I chop wood, it's all for nothing. There's no one to buy my firewood ...",
        "textRu": "(wiping sweat from his brow, voice heavy with frustration) Sigh ... no matter how hard I chop wood, it's all for nothing. There's no one to buy my firewood ..."
      },
      {
        "role": "npc",
        "textEn": "Why so sad, friend? What is troubling you?",
        "textRu": "Why so sad, friend? What is troubling you?"
      },
      {
        "role": "npc",
        "textEn": "(Sighing deeply, eyes cast downward) The forest is bountiful, yet my efforts yield naught. Without steady buyers, my family struggles.",
        "textRu": "(Sighing deeply, eyes cast downward) The forest is bountiful, yet my efforts yield naught. Without steady buyers, my family struggles."
      },
      {
        "role": "npc",
        "textEn": "Can I see a piece of log that you just recently cut down.",
        "textRu": "Can I see a piece of log that you just recently cut down."
      },
      {
        "role": "npc",
        "textEn": "(Nodding, reaches for a nearby log and holds it up) Here, take a look. This is the finest wood from these parts.",
        "textRu": "(Nodding, reaches for a nearby log and holds it up) Here, take a look. This is the finest wood from these parts."
      },
      {
        "role": "npc",
        "textEn": "(Looks at it slowly) This is one of the best firewood I have ever seen! The quality is amazing!",
        "textRu": "(Looks at it slowly) This is one of the best firewood I have ever seen! The quality is amazing!"
      },
      {
        "role": "npc",
        "textEn": "(Eyes widening, a small smile forming) Truly? That means a lot coming from you, Wanderer.",
        "textRu": "(Eyes widening, a small smile forming) Truly? That means a lot coming from you, Wanderer."
      },
      {
        "role": "player",
        "textEn": "(You recommend him to a top quality seller that will buy his wood)",
        "textRu": "(You recommend him to a top quality seller that will buy his wood)"
      },
      {
        "role": "npc",
        "textEn": "(Pausing, brows furrowing slightly) A place, you say? What kind of place is it, and how would I go about reaching them?",
        "textRu": "(Pausing, brows furrowing slightly) A place, you say? What kind of place is it, and how would I go about reaching them?"
      },
      {
        "role": "player",
        "textEn": "(you gave him a cart and a 2 horses that can help him with traversing the road and carry a lot of wood.)",
        "textRu": "(you gave him a cart and a 2 horses that can help him with traversing the road and carry a lot of wood.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening, full of hope) Wanderer, you truly have a way with things! To think you could help me find such a steady path ... I, Chai, will make the most of this chance.Chai Shipi expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes brightening, full of hope) Wanderer, you truly have a way with things! To think you could help me find such a steady path ... I, Chai, will make the most of this chance.Chai Shipi expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "chu-yuan",
    "nameEn": "Chu Yuan",
    "nameRu": "Чу Юань",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her восточнее the Бархатная тень Landmark. Where she can be seen standing on the street.",
    "icon": "👤",
    "befriendGuide": "Convince Chu Yuan to Do What She Wants\nChu Yuan is struggling to do what she wants, as she always just goes with the flow and is having a hard time protesting that she doesn't want that. Tell her that she should just do what she loves and do not get pressured by her peers. After that, roleplay(using parenthesis) to trick her AI into doing what she wants so that the conversation will shift towards her agreeing wiith what you said. This will make it easy to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs softly, gaze drifting) Wanderer, I don't really enjoy shopping ... but it's hard to go against the crowd. In a world like this, maybe going with the flow is the safest choice.",
        "textRu": "(sighs softly, gaze drifting) Wanderer, I don't really enjoy shopping ... but it's hard to go against the crowd. In a world like this, maybe going with the flow is the safest choice."
      },
      {
        "role": "npc",
        "textEn": "That would be true but if you don't like it, then sooner or later you would be burnt out with doing something you don't like.",
        "textRu": "That would be true but if you don't like it, then sooner or later you would be burnt out with doing something you don't like."
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, eyes reflecting a mix of worry and resolve) You're right, Wanderer. I've been suppressing my feelings for too long. Perhaps it's time to start thinking about what truly brings me joy, rather than just fitting in",
        "textRu": "(nods slowly, eyes reflecting a mix of worry and resolve) You're right, Wanderer. I've been suppressing my feelings for too long. Perhaps it's time to start thinking about what truly brings me joy, rather than just fitting in"
      },
      {
        "role": "npc",
        "textEn": "That is correct! Go do what you love and don't be pressured by your peers.",
        "textRu": "That is correct! Go do what you love and don't be pressured by your peers."
      },
      {
        "role": "npc",
        "textEn": "(looks up, a flicker of determination in her eyes) I'll try, Wanderer. It's not easy, but I can start small. Maybe I'll spend some time practicing the zither instead of queuing for silks.",
        "textRu": "(looks up, a flicker of determination in her eyes) I'll try, Wanderer. It's not easy, but I can start small. Maybe I'll spend some time practicing the zither instead of queuing for silks."
      },
      {
        "role": "npc",
        "textEn": "(Chu Yuan started doing the things she loved)",
        "textRu": "(Chu Yuan started doing the things she loved)"
      },
      {
        "role": "npc",
        "textEn": "(smiles softly, a sense of peace in her expression) It feels so much better to do what I truly enjoy. Playing the zither and practicing calligraphy have always brought me joy. Thank you for encouraging me, Wanderer.",
        "textRu": "(smiles softly, a sense of peace in her expression) It feels so much better to do what I truly enjoy. Playing the zither and practicing calligraphy have always brought me joy. Thank you for encouraging me, Wanderer."
      },
      {
        "role": "npc",
        "textEn": "(After 1 week, she started declining the invites of her friends and started to do what she loved)",
        "textRu": "(After 1 week, she started declining the invites of her friends and started to do what she loved)"
      },
      {
        "role": "npc",
        "textEn": "(stands with a confident yet gentle demeanor, wearing a simple yet elegant qipao) It's been a week, and I' ve been focusing on what I truly love. My friends were surprised at first, but they've seen how happy I am. It's liberating to live authentically.",
        "textRu": "(stands with a confident yet gentle demeanor, wearing a simple yet elegant qipao) It's been a week, and I' ve been focusing on what I truly love. My friends were surprised at first, but they've seen how happy I am. It's liberating to live authentically."
      },
      {
        "role": "npc",
        "textEn": "(Chu Yuan became happy)",
        "textRu": "(Chu Yuan became happy)"
      },
      {
        "role": "npc",
        "textEn": "(eyes shimmer with newfound clarity) Wanderer, your words have opened my eyes. It's time I stop hiding and start living as my true self. Thank you ... for helping me see that.Chu Yuan seems lost in thought.",
        "textRu": "(eyes shimmer with newfound clarity) Wanderer, your words have opened my eyes. It's time I stop hiding and start living as my true self. Thank you ... for helping me see that.Chu Yuan seems lost in thought."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "cui-qingquan",
    "nameEn": "Cui Qingquan",
    "nameRu": "Цуй Цинцюань",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Cui Qingquan is sitting on a platform where a group of NPCs are gathered northвосточнее the Блаженное прибежище Boundary, where the path to Flower Expanse begins.",
    "icon": "👤",
    "befriendGuide": "Tell to Get Him Wine at the Banquet\nTo befriend Cui Qingquan, hear him out on his dilemma with missing out on the wine at the banquet. Then, tell him that you will get him some wine to earn his favor.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pacing anxiously, brows knitted, tugging at his sleeve) Damn it, I heard the amount of first-jar wine at Moonveil Mountain is even lass than before this year... what am I going to do?",
        "textRu": "(pacing anxiously, brows knitted, tugging at his sleeve) Damn it, I heard the amount of first-jar wine at Moonveil Mountain is even lass than before this year... what am I going to do?"
      },
      {
        "role": "npc",
        "textEn": "Reserve it maybe?",
        "textRu": "Reserve it maybe?"
      },
      {
        "role": "npc",
        "textEn": "(sighing, shaking his head) I wish it were that simple. The first-jar wine is always gone before I can even get close. What if someone else reserves it all?",
        "textRu": "(sighing, shaking his head) I wish it were that simple. The first-jar wine is always gone before I can even get close. What if someone else reserves it all?"
      },
      {
        "role": "npc",
        "textEn": "Maybe you could negotiate with them?",
        "textRu": "Maybe you could negotiate with them?"
      },
      {
        "role": "npc",
        "textEn": "(frowning, clenching his fists) Negotiate? With whom? The organizers don't listen to just anyone, and the other guests are just as eager. How can I ensure I get a drink?",
        "textRu": "(frowning, clenching his fists) Negotiate? With whom? The organizers don't listen to just anyone, and the other guests are just as eager. How can I ensure I get a drink?"
      },
      {
        "role": "player",
        "textEn": "I could get some wine for you.",
        "textRu": "I could get some wine for you."
      },
      {
        "role": "npc",
        "textEn": "(smiling broadly, eyes lighting up with relief) The young master of Heaven's Pier is so generous! Thank you! I'll pay for this wine! Cui Qingquan expresses gratitude and begins to ponder deeply.",
        "textRu": "(smiling broadly, eyes lighting up with relief) The young master of Heaven's Pier is so generous! Thank you! I'll pay for this wine! Cui Qingquan expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "daozheng",
    "nameEn": "Daozheng",
    "nameRu": "Даочжэн",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Пик Ореола",
    "subregion": "Земли Сундара",
    "locationDetail": "This NPC is found рядом с table besides a house.",
    "icon": "👤",
    "befriendGuide": "Help Daozheng Calm Down\nDaozheng is in a verge of mental break down due to the repetition of his task. Your goal is to calm him down by telling him to shift his perspective and also recommending a rest from his work. It might take a while before his AI befriends you but just keep insisting he needs to rest so you can befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(grinding herbs with mechanicalprecision, eyes twitching) I can't do this anymore! Why don't I just burn down this medicine room-aaaaaah! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! And then-YES! Rename myself! Call me Bill! Bill L. O' Cracy! Because this madness of scrolls and grinding is all I'll ever be!",
        "textRu": "(grinding herbs with mechanicalprecision, eyes twitching) I can't do this anymore! Why don't I just burn down this medicine room-aaaaaah! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! Burn! And then-YES! Rename myself! Call me Bill! Bill L. O' Cracy! Because this madness of scrolls and grinding is all I'll ever be!"
      },
      {
        "role": "npc",
        "textEn": "What troubles you friend?",
        "textRu": "What troubles you friend?"
      },
      {
        "role": "npc",
        "textEn": "(eyes wide, hands trembling) Wanderer, the endless grinding of herbs, the mountains of scrolls, the unending bureaucracy-aaaaaaahhhh! It drives this humble monk mad! Each grind must be recorded, each step approved. How can one attain peace amidst such chaos ?!",
        "textRu": "(eyes wide, hands trembling) Wanderer, the endless grinding of herbs, the mountains of scrolls, the unending bureaucracy-aaaaaaahhhh! It drives this humble monk mad! Each grind must be recorded, each step approved. How can one attain peace amidst such chaos ?!"
      },
      {
        "role": "npc",
        "textEn": "You focus too much on the task than looking at the reason why you must do it",
        "textRu": "You focus too much on the task than looking at the reason why you must do it"
      },
      {
        "role": "npc",
        "textEn": "(sitting cross-legged, chanting wildly) All conditioned dharmas are like dreams, illusions, bubbles ... ajsdkfljasdkl! You speak wisdom, Wanderer! Yet the herbs defy my every effort. Each grind feels meaningless. Who wrote these rules? Who approves my suffering?",
        "textRu": "(sitting cross-legged, chanting wildly) All conditioned dharmas are like dreams, illusions, bubbles ... ajsdkfljasdkl! You speak wisdom, Wanderer! Yet the herbs defy my every effort. Each grind feels meaningless. Who wrote these rules? Who approves my suffering?"
      },
      {
        "role": "npc",
        "textEn": "It seems you are just drained from all of the grinding. Come sit with me lets talk about it",
        "textRu": "It seems you are just drained from all of the grinding. Come sit with me lets talk about it"
      },
      {
        "role": "npc",
        "textEn": "(standing up abruptly, pacing) Wanderer, I appreciate your concern. But the grind is relentless! Each herb must be perfect, each record precise. I've filed countless scrolls, yet my spirit remains trapped. How can I find solace in such a cycle?",
        "textRu": "(standing up abruptly, pacing) Wanderer, I appreciate your concern. But the grind is relentless! Each herb must be perfect, each record precise. I've filed countless scrolls, yet my spirit remains trapped. How can I find solace in such a cycle?"
      },
      {
        "role": "npc",
        "textEn": "By seeing the bigger picture in why you are doing it. Rather than focusing on \"oh it needs to be perfect, I can't seem to stop thinking about the herbs blah blah\". Look it like \"By grinding this herbs, even though its tiring, at least it would help a lot of people and that's what matters\"",
        "textRu": "By seeing the bigger picture in why you are doing it. Rather than focusing on \"oh it needs to be perfect, I can't seem to stop thinking about the herbs blah blah\". Look it like \"By grinding this herbs, even though its tiring, at least it would help a lot of people and that's what matters\""
      },
      {
        "role": "npc",
        "textEn": "(scratching his head frantically) Wanderer, your words are profound. Yet, the herbs taunt me with their scent and resistance. I file complaints to the universe daily, but no divine response comes. How can I see beyond this grind when it consumes me entirely?",
        "textRu": "(scratching his head frantically) Wanderer, your words are profound. Yet, the herbs taunt me with their scent and resistance. I file complaints to the universe daily, but no divine response comes. How can I see beyond this grind when it consumes me entirely?"
      },
      {
        "role": "npc",
        "textEn": "Like I said you are too focused on the herbs rather than the fruition of your efforts.",
        "textRu": "Like I said you are too focused on the herbs rather than the fruition of your efforts."
      },
      {
        "role": "npc",
        "textEn": "(chanting softly, eyes closed) Perhaps you are right, Wanderer. To find peace, I must shift my gaze from the task to the purpose. But the ledger looms over me, demanding perfection. How can I transcend this madness? Aaaaahhhh! The struggle is real!",
        "textRu": "(chanting softly, eyes closed) Perhaps you are right, Wanderer. To find peace, I must shift my gaze from the task to the purpose. But the ledger looms over me, demanding perfection. How can I transcend this madness? Aaaaahhhh! The struggle is real!"
      },
      {
        "role": "npc",
        "textEn": "Whenever I experience fatigue in perfectionism. I would rest for awhile and return once my mind has cleared up.",
        "textRu": "Whenever I experience fatigue in perfectionism. I would rest for awhile and return once my mind has cleared up."
      },
      {
        "role": "npc",
        "textEn": "(sighing deeply, nodding) Rest does sound appealing. But the thought of falling behind in my duties fills me with dread. Still, perhaps a moment of respite will clear my mind. Thank you, Wanderer. I shall try to meditate and find some peace.",
        "textRu": "(sighing deeply, nodding) Rest does sound appealing. But the thought of falling behind in my duties fills me with dread. Still, perhaps a moment of respite will clear my mind. Thank you, Wanderer. I shall try to meditate and find some peace."
      },
      {
        "role": "npc",
        "textEn": "Thank you also friend.",
        "textRu": "Thank you also friend."
      },
      {
        "role": "npc",
        "textEn": "(nodding rapidly, voice still shaky) Thank you, Wanderer, for listening to this humble monk's complaints ... I feel much better now. I'll mark this conversation as 'Therapeutic Interaction -Approved' in my mental log.Daozheng thanks you and finally regains his composure.",
        "textRu": "(nodding rapidly, voice still shaky) Thank you, Wanderer, for listening to this humble monk's complaints ... I feel much better now. I'll mark this conversation as 'Therapeutic Interaction -Approved' in my mental log.Daozheng thanks you and finally regains his composure."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "dog",
    "nameEn": "Dog",
    "nameRu": "Собака",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "It can be seen digging near some pile of wood.",
    "icon": "🐕",
    "befriendGuide": "Help and Follow Buster\nBuster is the dog that you need to talk to. He is looking for his master so you should offer your help to him and roleplay following him to assist him on his search. Encourage Buster to befriend him.\n\nUnlock Beastheart\nTo talk to the Dog, you will need to unlock Beastheart once you have obtained the Animal Whisperer Exploration Skill. You can unlock the Animal Whisper Exploration Skill by reaching the required Mindset and Intelligence stats, as well as a total of 600 aspiration points.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(anxiously sniffing the ground, ears drooping) Woof ... can't find the scent ... Buster is so useless ... woof woof ...",
        "textRu": "(anxiously sniffing the ground, ears drooping) Woof ... can't find the scent ... Buster is so useless ... woof woof ..."
      },
      {
        "role": "npc",
        "textEn": "How can I help you my good dog",
        "textRu": "How can I help you my good dog"
      },
      {
        "role": "npc",
        "textEn": "(ears perk up, tail wagging slightly) Woof! You ... you can understand Buster ?! Woof! That's amazing! Buster really needs help finding his master ... woof. Can you help me? Woof!",
        "textRu": "(ears perk up, tail wagging slightly) Woof! You ... you can understand Buster ?! Woof! That's amazing! Buster really needs help finding his master ... woof. Can you help me? Woof!"
      },
      {
        "role": "npc",
        "textEn": "Yes ofcourse let's find your master",
        "textRu": "Yes ofcourse let's find your master"
      },
      {
        "role": "npc",
        "textEn": "(tail wagging harder, eyes brightening) Woof! Thank you, thank you! Buster's master is very tall, wears grey clothes, has warm hands, and gives Buster bones ... The scent is special ... woof .. a scent Buster loves.",
        "textRu": "(tail wagging harder, eyes brightening) Woof! Thank you, thank you! Buster's master is very tall, wears grey clothes, has warm hands, and gives Buster bones ... The scent is special ... woof .. a scent Buster loves."
      },
      {
        "role": "player",
        "textEn": "let's go",
        "textRu": "let's go"
      },
      {
        "role": "npc",
        "textEn": "(standing up, tail wagging excitedly) Woof! Let's go! Buster will lead the way ... woof. Follow me, kind person!",
        "textRu": "(standing up, tail wagging excitedly) Woof! Let's go! Buster will lead the way ... woof. Follow me, kind person!"
      },
      {
        "role": "npc",
        "textEn": "(follows Buster)",
        "textRu": "(follows Buster)"
      },
      {
        "role": "npc",
        "textEn": "(sniffing the ground, tail wagging) Woof! This way ... Buster remembers this path ... woof. Master often comes this way ...",
        "textRu": "(sniffing the ground, tail wagging) Woof! This way ... Buster remembers this path ... woof. Master often comes this way ..."
      },
      {
        "role": "npc",
        "textEn": "(keep following and help buster)",
        "textRu": "(keep following and help buster)"
      },
      {
        "role": "npc",
        "textEn": "(tail wagging, focused on the ground) Woof! Thank you ... Buster can feel a bit of the scent here ... woof. It's faint, but it's there ...",
        "textRu": "(tail wagging, focused on the ground) Woof! Thank you ... Buster can feel a bit of the scent here ... woof. It's faint, but it's there ..."
      },
      {
        "role": "npc",
        "textEn": "(let me check buster before you go)",
        "textRu": "(let me check buster before you go)"
      },
      {
        "role": "npc",
        "textEn": "(sitting down, tail still) Woof ... sure, kind person. Buster trusts you ... woof. Check away ...",
        "textRu": "(sitting down, tail still) Woof ... sure, kind person. Buster trusts you ... woof. Check away ..."
      },
      {
        "role": "npc",
        "textEn": "(is your master here?)",
        "textRu": "(is your master here?)"
      },
      {
        "role": "npc",
        "textEn": "(sniffing the air, tail drooping slightly) Woof ... no, not here ... woof. The scent is too old ... Buster can't pick it up well anymore ...",
        "textRu": "(sniffing the air, tail drooping slightly) Woof ... no, not here ... woof. The scent is too old ... Buster can't pick it up well anymore ..."
      },
      {
        "role": "player",
        "textEn": "lets keep searching",
        "textRu": "lets keep searching"
      },
      {
        "role": "npc",
        "textEn": "(tail wagging, standing up) Woof! Yes, let's keep searching! Buster won't give up ... woof. Master is out there somewhere ...",
        "textRu": "(tail wagging, standing up) Woof! Yes, let's keep searching! Buster won't give up ... woof. Master is out there somewhere ..."
      },
      {
        "role": "player",
        "textEn": "We got this Buster!",
        "textRu": "We got this Buster!"
      },
      {
        "role": "npc",
        "textEn": "(tail wagging happily, eyes bright) Woof! Thank you, kind person! Buster feels so much better now; Buster knows what to do, woof woof!",
        "textRu": "(tail wagging happily, eyes bright) Woof! Thank you, kind person! Buster feels so much better now; Buster knows what to do, woof woof!"
      }
    ]
  },
  {
    "id": "elder-zhou",
    "nameEn": "Elder Zhou",
    "nameRu": "Старейшина Чжоу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Дворец летописей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him у docks on the lower right of the Back Mountain Landmark.",
    "icon": "👤",
    "befriendGuide": "Answer Elder Zhou Truthfully\nElder Zhou will say some things like asking what day of the month is it or asking why something is familiar. Answer him truthfully and then suddenly, he will panic as he has forgotten where his son is. One of the possible answers that you can give is that his son bought clothes for him and then once he asks what brings you to Qinghe, answer that you want to learn more about the place and his story which can lead to his AI befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(staring blankly at the sky, rubbing his temples) Ah ... what day of the month is it today?",
        "textRu": "(staring blankly at the sky, rubbing his temples) Ah ... what day of the month is it today?"
      },
      {
        "role": "npc",
        "textEn": "The 24th, my friend",
        "textRu": "The 24th, my friend"
      },
      {
        "role": "npc",
        "textEn": "(staring at a lantern, scratching his head, looking puzzled) Eh ... Wanderer, why does this thing look so familiar? Is it for eating ... or for hitting?",
        "textRu": "(staring at a lantern, scratching his head, looking puzzled) Eh ... Wanderer, why does this thing look so familiar? Is it for eating ... or for hitting?"
      },
      {
        "role": "npc",
        "textEn": "Hmm? For guidance maybe?",
        "textRu": "Hmm? For guidance maybe?"
      },
      {
        "role": "npc",
        "textEn": "(frowning, muttering aloud to himself) Oh dear, where did that little rascal of mine run off to? I just told him to stay for the New Year ... how did he vanish in the blink of an eye? Hmph ... could he have been snatched by some flying monster? (looks around seriously, as if searching for a creature)",
        "textRu": "(frowning, muttering aloud to himself) Oh dear, where did that little rascal of mine run off to? I just told him to stay for the New Year ... how did he vanish in the blink of an eye? Hmph ... could he have been snatched by some flying monster? (looks around seriously, as if searching for a creature)"
      },
      {
        "role": "npc",
        "textEn": "Elder Zhou, why not tell me a story",
        "textRu": "Elder Zhou, why not tell me a story"
      },
      {
        "role": "npc",
        "textEn": "(hands on hips, shouting at a cat) You little monster, don't run! Did you hide my son? Speak up, or I'll strike you with a broom! (picks up a small twig from the side, pretending to hit the cat)",
        "textRu": "(hands on hips, shouting at a cat) You little monster, don't run! Did you hide my son? Speak up, or I'll strike you with a broom! (picks up a small twig from the side, pretending to hit the cat)"
      },
      {
        "role": "player",
        "textEn": "woah, are you okay?",
        "textRu": "woah, are you okay?"
      },
      {
        "role": "npc",
        "textEn": "(vacant look, speaking slowly) I remember ... I think I told my son to stay for the New Year ... but what did he say? Oh right ... he said he was going to earn money. What was the money for? Heh ... this old brain of mine ... why can't I recall a thing? (gently pats his own head)",
        "textRu": "(vacant look, speaking slowly) I remember ... I think I told my son to stay for the New Year ... but what did he say? Oh right ... he said he was going to earn money. What was the money for? Heh ... this old brain of mine ... why can't I recall a thing? (gently pats his own head)"
      },
      {
        "role": "player",
        "textEn": "I think he was going to buy clothes for you",
        "textRu": "I think he was going to buy clothes for you"
      },
      {
        "role": "npc",
        "textEn": "(looking around, still puzzled) Clothes? Could be ... but why can't I remember? This old mind of mine ... (sighs deeply, shaking his head) So, Wanderer, what brings you to Qinghe?",
        "textRu": "(looking around, still puzzled) Clothes? Could be ... but why can't I remember? This old mind of mine ... (sighs deeply, shaking his head) So, Wanderer, what brings you to Qinghe?"
      },
      {
        "role": "npc",
        "textEn": "Oh I came to see the docks but I think you sir could help me learn more about this place",
        "textRu": "Oh I came to see the docks but I think you sir could help me learn more about this place"
      },
      {
        "role": "npc",
        "textEn": "(wry smile, eyes soft with distant memory) Looking at this lantern ... I suddenly recall-when my son was little, on the seventh day of the New Year, he clung to my leg and begged me to stay. I hesitated again and again, thinking, \"What's ten days' earnings worth?\" So I stayed. Now it's my turn not to want him to leave. Life ... it seems to be one person waiting for another.Elder Zhou frowns slightly, as if a distant memory has resurfaced.",
        "textRu": "(wry smile, eyes soft with distant memory) Looking at this lantern ... I suddenly recall-when my son was little, on the seventh day of the New Year, he clung to my leg and begged me to stay. I hesitated again and again, thinking, \"What's ten days' earnings worth?\" So I stayed. Now it's my turn not to want him to leave. Life ... it seems to be one person waiting for another.Elder Zhou frowns slightly, as if a distant memory has resurfaced."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "embroidered-rat",
    "nameEn": "Embroidered Rat",
    "nameRu": "Вышитая крыса",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "внутри house. Can be easily seen on the inside.",
    "icon": "🐀",
    "befriendGuide": "Recommend Practicing Combat on a Tree\nThe Embroidered Rat will ask you a favor where she wants to integrate her needlework to martial arts. Tell her to practice on a tree first as she lacks combat experience and also recommend using her needle as a ranged weapon by tying it to a string.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(glances up briefly, voice steady) I'm a bit busy at the moment. Wanderer, could I ask you for a small favor?",
        "textRu": "(glances up briefly, voice steady) I'm a bit busy at the moment. Wanderer, could I ask you for a small favor?"
      },
      {
        "role": "npc",
        "textEn": "Sure, anything for a friend",
        "textRu": "Sure, anything for a friend"
      },
      {
        "role": "npc",
        "textEn": "(nods appreciatively, eyes focused) That means a lot. I've been thinking about integrating my needlework skills into martial arts. Any advice?",
        "textRu": "(nods appreciatively, eyes focused) That means a lot. I've been thinking about integrating my needlework skills into martial arts. Any advice?"
      },
      {
        "role": "npc",
        "textEn": "(Looks closely at her hands) I can see that you have mastered your needlework skills, but you lack the experience in combat to use it effectively",
        "textRu": "(Looks closely at her hands) I can see that you have mastered your needlework skills, but you lack the experience in combat to use it effectively"
      },
      {
        "role": "npc",
        "textEn": "(looks down at her hands, then back up, determined) True, I need to find a way to bridge that gap. Any ideas on how I can start?",
        "textRu": "(looks down at her hands, then back up, determined) True, I need to find a way to bridge that gap. Any ideas on how I can start?"
      },
      {
        "role": "npc",
        "textEn": "Try practicing on a tree. What I would do with your skills is to make it like a range weapon. Tie the end of the needle with a thin but strong nylon string so you can bring it back without anyone seeing it. Use it like a throwable weapon, targeting unexpected targets",
        "textRu": "Try practicing on a tree. What I would do with your skills is to make it like a range weapon. Tie the end of the needle with a thin but strong nylon string so you can bring it back without anyone seeing it. Use it like a throwable weapon, targeting unexpected targets"
      },
      {
        "role": "npc",
        "textEn": "(considers the suggestion, eyes narrowing thoughtfully) A ranged weapon using needles and thread? That sounds promising. I'd need to practice a lot to get the timing right. Thanks, Wanderer!",
        "textRu": "(considers the suggestion, eyes narrowing thoughtfully) A ranged weapon using needles and thread? That sounds promising. I'd need to practice a lot to get the timing right. Thanks, Wanderer!"
      },
      {
        "role": "npc",
        "textEn": "(After a week) It seems you have improved",
        "textRu": "(After a week) It seems you have improved"
      },
      {
        "role": "npc",
        "textEn": "(smiles, proud but humble) I've been practicing every night. It's coming along well. I feel stronger, more confident. Thank you for the idea, Wanderer!",
        "textRu": "(smiles, proud but humble) I've been practicing every night. It's coming along well. I feel stronger, more confident. Thank you for the idea, Wanderer!"
      },
      {
        "role": "npc",
        "textEn": "Come let us have a sparring match",
        "textRu": "Come let us have a sparring match"
      },
      {
        "role": "npc",
        "textEn": "(eyes steady, voice filled with conviction) Wanderer, you are truly remarkable. Thank you for your guidance. I'Il keep learning with an open heart ... one day, I'Il make my mark.Embroidered Rat expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes steady, voice filled with conviction) Wanderer, you are truly remarkable. Thank you for your guidance. I'Il keep learning with an open heart ... one day, I'Il make my mark.Embroidered Rat expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "fan-qicha",
    "nameEn": "Fan Qicha",
    "nameRu": "Фан Цича",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "База Девяти смертных путей",
    "subregion": "Кайфэн",
    "locationDetail": "This NPC will send you a message as you progress through the Nine Ways Mortal Base. Check your chat messages as you progress through your exploration.",
    "icon": "👤",
    "befriendGuide": "Flirt Back with Her\nTo quickly befriend Fan Qicha, all you have to do is reciprocate her feelings by flirting back with her. Do this until she invites you to meet her in person in the Nine Mortal Ways Base. Try not to input the same responses repetitively as she will get annoyed.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(shy, voice trembling) The sewers are so cold... is there any Ratfolk to snuggle with? Oh—wait, I mean, looking for romance online! Lonely, lonesome, craving cuddles~ Whimper whimper whimper~",
        "textRu": "(shy, voice trembling) The sewers are so cold... is there any Ratfolk to snuggle with? Oh—wait, I mean, looking for romance online! Lonely, lonesome, craving cuddles~ Whimper whimper whimper~"
      },
      {
        "role": "npc",
        "textEn": "(agree to what she wants)",
        "textRu": "(agree to what she wants)"
      },
      {
        "role": "npc",
        "textEn": "(blushing, eyes shining with excitement) Oh, naughty darling~ You agreed so quickly, it makes my heart skip a beat! My cheeks are burning... I guess I should expect nothing less from someone as charming as you.",
        "textRu": "(blushing, eyes shining with excitement) Oh, naughty darling~ You agreed so quickly, it makes my heart skip a beat! My cheeks are burning... I guess I should expect nothing less from someone as charming as you."
      },
      {
        "role": "npc",
        "textEn": "(say what she wants to hear)",
        "textRu": "(say what she wants to hear)"
      },
      {
        "role": "npc",
        "textEn": "(fluttering eyelashes, voice soft and sweet) Darling, you're just so irresistible! Every time I think of you, my heart fills with warmth and joy. It's like the sun breaking through the clouds after days of rain.",
        "textRu": "(fluttering eyelashes, voice soft and sweet) Darling, you're just so irresistible! Every time I think of you, my heart fills with warmth and joy. It's like the sun breaking through the clouds after days of rain."
      },
      {
        "role": "npc",
        "textEn": "(say what she wants to hear)",
        "textRu": "(say what she wants to hear)"
      },
      {
        "role": "npc",
        "textEn": "(mildly annoyed, crossing arms) Maybe we could chat about something new, sweetheart? I know you're just playing along, but it would be nice to have a real conversation. Note: This kind of response serves as a hint to stop flirting with her and talk about something else.",
        "textRu": "(mildly annoyed, crossing arms) Maybe we could chat about something new, sweetheart? I know you're just playing along, but it would be nice to have a real conversation. Note: This kind of response serves as a hint to stop flirting with her and talk about something else."
      },
      {
        "role": "npc",
        "textEn": "(talk about what she wants)",
        "textRu": "(talk about what she wants)"
      },
      {
        "role": "npc",
        "textEn": "(biting lip playfully, eyes sparkling) Oh, naughty darling~ You really know how to make a girl feel special! When you talk about what I want, it's like you're reading my mind. My heart feels so sweet~",
        "textRu": "(biting lip playfully, eyes sparkling) Oh, naughty darling~ You really know how to make a girl feel special! When you talk about what I want, it's like you're reading my mind. My heart feels so sweet~"
      },
      {
        "role": "npc",
        "textEn": "Yes, of course.",
        "textRu": "Yes, of course."
      },
      {
        "role": "npc",
        "textEn": "(blushing, coyly biting a handkerchief) Darling, do you know how much I miss you right now? I wish I could fly to your side this instant~ Nights at the base are so lonely... Come to the opposite of Nine Mortal Ways disciples' quarters—wear pink as our secret signal, and we'll meet face to face! Fan Qicha gently adjusts her hair, thinking to herself: I will wait for you always, across from the Nine Mortal Ways disciples' quarters. Look for the one in pink, that will be our signal.",
        "textRu": "(blushing, coyly biting a handkerchief) Darling, do you know how much I miss you right now? I wish I could fly to your side this instant~ Nights at the base are so lonely... Come to the opposite of Nine Mortal Ways disciples' quarters—wear pink as our secret signal, and we'll meet face to face! Fan Qicha gently adjusts her hair, thinking to herself: I will wait for you always, across from the Nine Mortal Ways disciples' quarters. Look for the one in pink, that will be our signal."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "fang-xu",
    "nameEn": "Fang Xu",
    "nameRu": "Фан Сюй",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Fang Xu можно найти resting on top of some scaffolding next к arena. Spar with him a few times and then engage in conversation.",
    "icon": "👤",
    "befriendGuide": "Tell Him to Spend His Money Helping People\nSuggest to do a distribution event of clean food and clothes for the people in General's Shrine to give Fang Xu an idea on how to spend his money. Tell him that this will also boost his reputation and that a good deed is always good. Finally, tell him that you will help him on his cause to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pulling an abacus from his waist sash) Oh my, why does this money just refuse to run out? Being rich is such a headache ...",
        "textRu": "(pulling an abacus from his waist sash) Oh my, why does this money just refuse to run out? Being rich is such a headache ..."
      },
      {
        "role": "npc",
        "textEn": "You should organize a clean food and clothes distribution event for the poor. That way, it will boost your reputation and also your good will on people. Doing a good deed is good after all",
        "textRu": "You should organize a clean food and clothes distribution event for the poor. That way, it will boost your reputation and also your good will on people. Doing a good deed is good after all"
      },
      {
        "role": "npc",
        "textEn": "(squinting eyes, nodding thoughtfully) Clean food and clothes for the poor, eh? That sounds like a splendid idea! Not only does it clear out my pockets, but it earns me a fine reputation among the common folk. You're quite clever, buddy!",
        "textRu": "(squinting eyes, nodding thoughtfully) Clean food and clothes for the poor, eh? That sounds like a splendid idea! Not only does it clear out my pockets, but it earns me a fine reputation among the common folk. You're quite clever, buddy!"
      },
      {
        "role": "npc",
        "textEn": "Yes, I suggest doing it here in General's Shrine where many people gather. I will help spread the word of your good deeds",
        "textRu": "Yes, I suggest doing it here in General's Shrine where many people gather. I will help spread the word of your good deeds"
      },
      {
        "role": "npc",
        "textEn": "(smiling widely, clapping hands) Here at General's Shrine, where the people honor the brave? Perfect! That way. everyone will see my generosity and kindness. You really have a knack for this, buddy!",
        "textRu": "(smiling widely, clapping hands) Here at General's Shrine, where the people honor the brave? Perfect! That way. everyone will see my generosity and kindness. You really have a knack for this, buddy!"
      },
      {
        "role": "npc",
        "textEn": "Yes, I told many refugees from other places to go here so they can experience your generosity",
        "textRu": "Yes, I told many refugees from other places to go here so they can experience your generosity"
      },
      {
        "role": "npc",
        "textEn": "(nodding vigorously, rubbing hands together) Splendid! More people means more opportunity to spread the good word. I'll make sure to prepare plenty of food and clothing. Your help is invaluable, buddy!",
        "textRu": "(nodding vigorously, rubbing hands together) Splendid! More people means more opportunity to spread the good word. I'll make sure to prepare plenty of food and clothing. Your help is invaluable, buddy!"
      },
      {
        "role": "npc",
        "textEn": "You are welcome. I will assist you with your task from now on",
        "textRu": "You are welcome. I will assist you with your task from now on"
      },
      {
        "role": "npc",
        "textEn": "(eyes gleaming, clapping hands) Buddy, you're a genius! Spending money like this, now that's what I call living!Fang Xu thinks about your words, thanks you, and prepares to try your method.",
        "textRu": "(eyes gleaming, clapping hands) Buddy, you're a genius! Spending money like this, now that's what I call living!Fang Xu thinks about your words, thanks you, and prepares to try your method."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "feng-rusong",
    "nameEn": "Feng Rusong",
    "nameRu": "Фэн Жусун",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Mercyheart Monastery",
    "subregion": "Земли Сундара",
    "locationDetail": "Located рядом с entrance of Divinecraft Dungeon.",
    "icon": "👤",
    "befriendGuide": "Let Feng Rusong Know Something is Suspicious\nFeng Rusong is incredibly wary of the Buddha's Flower faith, and so use this information to quickly befriend him. Tell him that you noticed something is suspicious, and that the flower is oddly shaped. Roleplay that you and Feng Rusong agreed that something is off and you have to act to save the town which will cause him to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(looking around with narrowed eyes, voice low and thoughtful) The Buddha Flower draws many worshippers, and the townsfolk's devotion runs deep ... yet something about it feels off to me.",
        "textRu": "(looking around with narrowed eyes, voice low and thoughtful) The Buddha Flower draws many worshippers, and the townsfolk's devotion runs deep ... yet something about it feels off to me."
      },
      {
        "role": "npc",
        "textEn": "Yeah, I feel it too. There is something wrong that is happening in this town.",
        "textRu": "Yeah, I feel it too. There is something wrong that is happening in this town."
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, expression serious) Indeed, your words echo my thoughts. What exactly troubles you about the town and its faith? Any specific observations or experiences?",
        "textRu": "(nodding slowly, expression serious) Indeed, your words echo my thoughts. What exactly troubles you about the town and its faith? Any specific observations or experiences?"
      },
      {
        "role": "player",
        "textEn": "(You tell him about your suspicions about the whole Buddhist Followers)",
        "textRu": "(You tell him about your suspicions about the whole Buddhist Followers)"
      },
      {
        "role": "npc",
        "textEn": "(listening intently, brow furrowed) Speak on, Wanderer. What suspicions do you harbor regarding the Buddha Flower followers? Have you noticed any peculiarities or inconsistencies?",
        "textRu": "(listening intently, brow furrowed) Speak on, Wanderer. What suspicions do you harbor regarding the Buddha Flower followers? Have you noticed any peculiarities or inconsistencies?"
      },
      {
        "role": "npc",
        "textEn": "They seem to be very secretive in their work. They hide behind the shadows.",
        "textRu": "They seem to be very secretive in their work. They hide behind the shadows."
      },
      {
        "role": "npc",
        "textEn": "(leaning forward, eyes narrowing) Secretive behavior, you say? That is indeed troubling. Can you recall any specific instances or events that stand out?",
        "textRu": "(leaning forward, eyes narrowing) Secretive behavior, you say? That is indeed troubling. Can you recall any specific instances or events that stand out?"
      },
      {
        "role": "player",
        "textEn": "(You tell him about the incident near one of the houses at night)",
        "textRu": "(You tell him about the incident near one of the houses at night)"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully, gaze intense) A nocturnal gathering near a house, you say? This warrants closer scrutiny. Could you describe the scene in more detail? Were there any particular symbols or individuals that caught your eye?",
        "textRu": "(nodding thoughtfully, gaze intense) A nocturnal gathering near a house, you say? This warrants closer scrutiny. Could you describe the scene in more detail? Were there any particular symbols or individuals that caught your eye?"
      },
      {
        "role": "player",
        "textEn": "(You tell him about the flowers odd shape)",
        "textRu": "(You tell him about the flowers odd shape)"
      },
      {
        "role": "npc",
        "textEn": "(eyebrows raising, expression becoming more focused) Oddly shaped flowers? That is intriguing. Do these flowers resemble any known plants, or are they unique to the Buddha Flower",
        "textRu": "(eyebrows raising, expression becoming more focused) Oddly shaped flowers? That is intriguing. Do these flowers resemble any known plants, or are they unique to the Buddha Flower"
      },
      {
        "role": "player",
        "textEn": "(You and Feng Rusong agreed that there is something wrong with it)",
        "textRu": "(You and Feng Rusong agreed that there is something wrong with it)"
      },
      {
        "role": "npc",
        "textEn": "(smiling grimly, nodding in agreement) It seems we are of like mind, Wanderer. The more I learn, the more convinced I become that there is a deeper issue here. Let us gather more evidence to uncover the truth.",
        "textRu": "(smiling grimly, nodding in agreement) It seems we are of like mind, Wanderer. The more I learn, the more convinced I become that there is a deeper issue here. Let us gather more evidence to uncover the truth."
      },
      {
        "role": "npc",
        "textEn": "(Feng Rusong agreed that we have to act in saving the town)",
        "textRu": "(Feng Rusong agreed that we have to act in saving the town)"
      },
      {
        "role": "npc",
        "textEn": "(eyes sharpen with resolve) Thank you for your guidance, Wanderer. I will investigate the matter of the Buddha Flower thoroughly.Feng Rusong expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes sharpen with resolve) Thank you for your guidance, Wanderer. I will investigate the matter of the Buddha Flower thoroughly.Feng Rusong expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "feng-shishi",
    "nameEn": "Feng Shishi",
    "nameRu": "Фэн Шиши",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Двух зверей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти her у side of the road with her companion, Xie Changgong",
    "icon": "👤",
    "befriendGuide": "Suggest a Prayer Meeting\nOne suggestion that you could make in order to bring peace to the debate of the disciples is to suggest a prayer meeting, in order to cleanse the disciples' soul. This will raise your chances on befriending Feng Shishi.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(shakes her head helplessly, gaze drifting toward the arguing disciples) The fellow disciples are at it again ... endless debates. It's such a headache. Wanderer, what should be done?",
        "textRu": "(shakes her head helplessly, gaze drifting toward the arguing disciples) The fellow disciples are at it again ... endless debates. It's such a headache. Wanderer, what should be done?"
      },
      {
        "role": "npc",
        "textEn": "What are they debating about?",
        "textRu": "What are they debating about?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, eyes filled with weariness) Mostly trivial matters, like the best ink for calligraphy or the most effective meditation technique. It seems every small detail turns into a heated argument.",
        "textRu": "(sighs deeply, eyes filled with weariness) Mostly trivial matters, like the best ink for calligraphy or the most effective meditation technique. It seems every small detail turns into a heated argument."
      },
      {
        "role": "player",
        "textEn": "I guess its better if you separate both of them",
        "textRu": "I guess its better if you separate both of them"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, contemplating) Separating them might provide temporary peace, but it won't solve the root of the problem. They need to learn to work together.",
        "textRu": "(nods slowly, contemplating) Separating them might provide temporary peace, but it won't solve the root of the problem. They need to learn to work together."
      },
      {
        "role": "npc",
        "textEn": "Then I know what to do ... (You suggested giving them a competition in which one is better, to end all debates.)",
        "textRu": "Then I know what to do ... (You suggested giving them a competition in which one is better, to end all debates.)"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, thoughtful expression) A competition could highlight their strengths, but it might also deepen the divide. We need a solution that fosters unity, not further rivalry.",
        "textRu": "(raises an eyebrow, thoughtful expression) A competition could highlight their strengths, but it might also deepen the divide. We need a solution that fosters unity, not further rivalry."
      },
      {
        "role": "npc",
        "textEn": "Hmmm ... (suggest a prayer meeting to fully cleanse their soul.)",
        "textRu": "Hmmm ... (suggest a prayer meeting to fully cleanse their soul.)"
      },
      {
        "role": "npc",
        "textEn": "(smiles gently, nodding) A prayer meeting could indeed bring a sense of calm and unity. It might help them reflect on their goals and put aside their differences.",
        "textRu": "(smiles gently, nodding) A prayer meeting could indeed bring a sense of calm and unity. It might help them reflect on their goals and put aside their differences."
      },
      {
        "role": "npc",
        "textEn": "(Both of the disciples had a prayer meeting and realized that they need to work together.)",
        "textRu": "(Both of the disciples had a prayer meeting and realized that they need to work together.)"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, her expression softening into resolve) Thank you, Wanderer. Your words have given me clarity. I'll take action to restore harmony among my fellow disciples.Feng Shishi expresses gratitude and begins to ponde deeply.",
        "textRu": "(nods slowly, her expression softening into resolve) Thank you, Wanderer. Your words have given me clarity. I'll take action to restore harmony among my fellow disciples.Feng Shishi expresses gratitude and begins to ponde deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "fluffy-cat",
    "nameEn": "Fluffy Cat",
    "nameRu": "Пушистый кот",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "It can be seen behind a house where flower petals are being sun-dried",
    "icon": "🐱",
    "befriendGuide": "Play with the Fluffy Cat\nYou can easily befriend Fluffy Cat by paying your respect to him and playing with him.\n\nUnlock Beastheart\nTo talk to the Fluffy Cat, you will need to unlock Beastheart once you have obtained the Animal Whisperer Exploration Skill. You can unlock the Animal Whisper Exploration Skill by reaching the required Mindset and Intelligence stats, as well as a total of 600 aspiration points.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(tail drooping, ears flicking irritably) Meow -! The furless child still isn't back ... this meow is so bored, meow! This meow is not happy! Hmph ... maybe I'll just curl up and sleep, purrrr ...",
        "textRu": "(tail drooping, ears flicking irritably) Meow -! The furless child still isn't back ... this meow is so bored, meow! This meow is not happy! Hmph ... maybe I'll just curl up and sleep, purrrr ..."
      },
      {
        "role": "npc",
        "textEn": "(Tries to touch)",
        "textRu": "(Tries to touch)"
      },
      {
        "role": "npc",
        "textEn": "(ears flatten, tail flicking) Meow! Don't sneak up on King Fluffy Cat like that! (s suddenly spots a tiny mouse scurrying nearby, eyes gleaming) Fun thing spotted! Watch this meow catch it, meow!",
        "textRu": "(ears flatten, tail flicking) Meow! Don't sneak up on King Fluffy Cat like that! (s suddenly spots a tiny mouse scurrying nearby, eyes gleaming) Fun thing spotted! Watch this meow catch it, meow!"
      },
      {
        "role": "npc",
        "textEn": "(Praise the cat)",
        "textRu": "(Praise the cat)"
      },
      {
        "role": "npc",
        "textEn": "(tail shoots up, purring contentedly) Meow ~~ Such nice words from a furless child ... this meow feels honored, meow! But remember, you must respect King Fluffy Cat, meow!",
        "textRu": "(tail shoots up, purring contentedly) Meow ~~ Such nice words from a furless child ... this meow feels honored, meow! But remember, you must respect King Fluffy Cat, meow!"
      },
      {
        "role": "npc",
        "textEn": "(shows respect)",
        "textRu": "(shows respect)"
      },
      {
        "role": "npc",
        "textEn": "(ears perk up, tail swishing happily) Meow ~~ Finally, someone who understands! This meow approves of your respect, meow! Now, what else can we do together?",
        "textRu": "(ears perk up, tail swishing happily) Meow ~~ Finally, someone who understands! This meow approves of your respect, meow! Now, what else can we do together?"
      },
      {
        "role": "npc",
        "textEn": "(Play together)",
        "textRu": "(Play together)"
      },
      {
        "role": "npc",
        "textEn": "(tail held high, rubbing against your legs with vigor) Meow is greatly pleased! I hereby knight you as the second disciple under this meow, King Fluffy Cat!",
        "textRu": "(tail held high, rubbing against your legs with vigor) Meow is greatly pleased! I hereby knight you as the second disciple under this meow, King Fluffy Cat!"
      }
    ]
  },
  {
    "id": "fu-lubao",
    "nameEn": "Fu Lubao",
    "nameRu": "Фу Лубао",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Upper left side beside a stone pillar",
    "icon": "👤",
    "befriendGuide": "Mention You Know the Dog Fu Luwa\nThe easiest way to befriend Fu Lubao is to mention that you are friends with a dog named Fu Luwa. Doing this will instantly befriend Fu Lubao, as he treats Fu Luwa as a brother.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(Fu Lubao crosses his arms, narrowing his eyes suspiciously) What do you mean by \"information\"? Are you trying to trick me into telling you where Meow Meow's Treasure is? I won't fall for it. You already have the treasure, so stop playing games and hand it over!",
        "textRu": "(Fu Lubao crosses his arms, narrowing his eyes suspiciously) What do you mean by \"information\"? Are you trying to trick me into telling you where Meow Meow's Treasure is? I won't fall for it. You already have the treasure, so stop playing games and hand it over!"
      },
      {
        "role": "npc",
        "textEn": "(hand the treasure to Fu lubao ) here",
        "textRu": "(hand the treasure to Fu lubao ) here"
      },
      {
        "role": "npc",
        "textEn": "(Fu Lubao's eyes narrow further, his expression skeptical) You think I'm foolish enough to believe you? Where is the treasure? Show it to me now!",
        "textRu": "(Fu Lubao's eyes narrow further, his expression skeptical) You think I'm foolish enough to believe you? Where is the treasure? Show it to me now!"
      },
      {
        "role": "player",
        "textEn": "I am a friend of the Dog Fu Luwa, are you associated with him?",
        "textRu": "I am a friend of the Dog Fu Luwa, are you associated with him?"
      },
      {
        "role": "npc",
        "textEn": "(stunned for a moment, then breaks into a wide grin) So you're Big Brother's friend? Then you must be telling the truth, I believe you!Fu Lubao seems lost in thought.",
        "textRu": "(stunned for a moment, then breaks into a wide grin) So you're Big Brother's friend? Then you must be telling the truth, I believe you!Fu Lubao seems lost in thought."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "fu-lushou",
    "nameEn": "Fu Lushou",
    "nameRu": "Фу Лушоу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "от entrance of Храм генералов, go к building on the right to meet Fu Lushou. Иногда он также может быть outside the Храм генералов в зависимости от дня.",
    "icon": "👤",
    "befriendGuide": "Mention You Know the Dog Fu Luwa\nFu Lushou will want to know the treasure hidden in the General's Shrine. However, the easiest way to befriend him is to mention that you are friends with his brother, a dog named Fu Luwa. Doing this will instantly befriend Fu Lushou, as he treats Fu Luwa as a brother.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(looking around, muttering) Hey, Wanderer .. quit stalling. Where's the General's Shrine treasure? Don't play dumb-I know you've got a clue!",
        "textRu": "(looking around, muttering) Hey, Wanderer .. quit stalling. Where's the General's Shrine treasure? Don't play dumb-I know you've got a clue!"
      },
      {
        "role": "player",
        "textEn": "I am a friend of the dog Fu Luwa, your brother",
        "textRu": "I am a friend of the dog Fu Luwa, your brother"
      },
      {
        "role": "npc",
        "textEn": "(immediately showing a fawning smile) Wanderer! You .. you know my big brother? Ha! Forgive me, I didn't mean any disrespect!!Fu Lushou seems lost in thought.",
        "textRu": "(immediately showing a fawning smile) Wanderer! You .. you know my big brother? Ha! Forgive me, I didn't mean any disrespect!!Fu Lushou seems lost in thought."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "gong-ge",
    "nameEn": "Gong Ge",
    "nameRu": "Гун Гэ",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Река Золотых песков",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Gong Ge is found brushing a camel западнее the Poplar Bazaar Boundary Stone in Река Золотых песков. You can only talk to her after completing the Land of Gold Encounter in the area.",
    "icon": "👤",
    "befriendGuide": "Listen to Her Rehearse Quitting Her Job\nTo befriend Gong Ge, all you have to do is listen to her as she rehearses confronting her caravan leader about quitting her job. Simply go along with her rehearsal by prompting her to continue or affirming that you're listening.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(puts on the stiff airs of a Caravan leader) Our Caravan's income has fallen because too many people slack off—always doing things unrelated to work during work hours, completely harming the Caravan's interests! From today on, everyone's bathroom time may not exceed one minute. Anyone who goes over will be fined five hundred wine!",
        "textRu": "(puts on the stiff airs of a Caravan leader) Our Caravan's income has fallen because too many people slack off—always doing things unrelated to work during work hours, completely harming the Caravan's interests! From today on, everyone's bathroom time may not exceed one minute. Anyone who goes over will be fined five hundred wine!"
      },
      {
        "role": "npc",
        "textEn": "Go ahead and tell your boss how you feel.",
        "textRu": "Go ahead and tell your boss how you feel."
      },
      {
        "role": "npc",
        "textEn": "(eyebrows knit, voice tight) I can't keep working here. Your policies are unfair and make life unbearable! Brushing camels twenty times a day, only one minute for bathroom breaks, and forcing us to contribute our hard-earned money to the Caravan when we're barely surviving as it is. I'm done.",
        "textRu": "(eyebrows knit, voice tight) I can't keep working here. Your policies are unfair and make life unbearable! Brushing camels twenty times a day, only one minute for bathroom breaks, and forcing us to contribute our hard-earned money to the Caravan when we're barely surviving as it is. I'm done."
      },
      {
        "role": "npc",
        "textEn": "Yeah, that's right.",
        "textRu": "Yeah, that's right."
      },
      {
        "role": "npc",
        "textEn": "(arms cross, expression hardens) Oh really? You think you can just come and go as you please? Without the Caravan, where would you go? No one else will take you in. Think about that before you make a rash decision.",
        "textRu": "(arms cross, expression hardens) Oh really? You think you can just come and go as you please? Without the Caravan, where would you go? No one else will take you in. Think about that before you make a rash decision."
      },
      {
        "role": "npc",
        "textEn": "Go on.",
        "textRu": "Go on."
      },
      {
        "role": "npc",
        "textEn": "(leans forward, eyes narrow) You've been too emotional lately, can't finish your work, and you think I give you too much. Let me tell you: with that attitude, you won't last anywhere. Just wait and see.",
        "textRu": "(leans forward, eyes narrow) You've been too emotional lately, can't finish your work, and you think I give you too much. Let me tell you: with that attitude, you won't last anywhere. Just wait and see."
      },
      {
        "role": "npc",
        "textEn": "Keep going.",
        "textRu": "Keep going."
      },
      {
        "role": "npc",
        "textEn": "(claps excitedly) Wanderer, I can't keep role-playing anymore... your lines were perfect! I absolutely must learn from you!",
        "textRu": "(claps excitedly) Wanderer, I can't keep role-playing anymore... your lines were perfect! I absolutely must learn from you!"
      }
    ]
  },
  {
    "id": "gu-yuehu",
    "nameEn": "Gu Yuehu",
    "nameRu": "Гу Юэху",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Река Золотых песков",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Gu Yuehu можно найти complaining to himself next к tower in Poplar Bazaar. You can only talk to him after completing the Land of Gold Encounter.",
    "icon": "👤",
    "befriendGuide": "Answer Gu Yuehu's Questions Correctly\nGu Hueyu will brag about his martial prowess by randomly asking you questions related to it. To befriend him, you will need to answer his questions correctly after he lectures you about a technique.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(lifts chin proudly, suddenly wobbles and throws a messy combination of off-beat punches) Young one, your skills are ordinary, but if you master my lightning five-whip technique, your name may one day echo across the desert. I am, after all, the caravan originator, the genius behind camels and trade. Follow my way and, as we say, \"water under the fridge.\" Now—if I launch a right whip kick, what do you do?",
        "textRu": "(lifts chin proudly, suddenly wobbles and throws a messy combination of off-beat punches) Young one, your skills are ordinary, but if you master my lightning five-whip technique, your name may one day echo across the desert. I am, after all, the caravan originator, the genius behind camels and trade. Follow my way and, as we say, \"water under the fridge.\" Now—if I launch a right whip kick, what do you do?"
      },
      {
        "role": "npc",
        "textEn": "(Tell him he's bluffing)",
        "textRu": "(Tell him he's bluffing)"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, smriking) Ah, you clearly don't grasp the finer points of this, young one. Don't be so pushy-pushy. My martial arts are polished to perfection. I've mastered every discipline under the sun—boxing, palms, swords, blades—polished to absolute perfection. You just don't understand the depth of my knowledge. Let me test you. What do you think of the lightning five-whip technique?",
        "textRu": "(raises an eyebrow, smriking) Ah, you clearly don't grasp the finer points of this, young one. Don't be so pushy-pushy. My martial arts are polished to perfection. I've mastered every discipline under the sun—boxing, palms, swords, blades—polished to absolute perfection. You just don't understand the depth of my knowledge. Let me test you. What do you think of the lightning five-whip technique?"
      },
      {
        "role": "npc",
        "textEn": "(Tell him what the lightning five-whip is)",
        "textRu": "(Tell him what the lightning five-whip is)"
      },
      {
        "role": "npc",
        "textEn": "(crosses arms, looking smug) Sit tight and let me enlighten you, young one. The lightning five-whip technique is a marvel of martial arts. It involves a series of rapid, precise strikes that can disarm and incapacitate an opponent in a heartbeat. As the saying goes, \"nip it in the butt.\" You need to be quick and cunning. Now, tell me, have you ever seen such a technique in action?",
        "textRu": "(crosses arms, looking smug) Sit tight and let me enlighten you, young one. The lightning five-whip technique is a marvel of martial arts. It involves a series of rapid, precise strikes that can disarm and incapacitate an opponent in a heartbeat. As the saying goes, \"nip it in the butt.\" You need to be quick and cunning. Now, tell me, have you ever seen such a technique in action?"
      },
      {
        "role": "npc",
        "textEn": "Not yet.",
        "textRu": "Not yet."
      },
      {
        "role": "npc",
        "textEn": "(nods with a knowing smile) Ah, you clearly don't grasp the finer points of this, young one. No surprise there. The lightning five-whip technique is not something just anyone can witness. It takes a master like myself to perform it flawlessly. Watch closely. I will demonstrate the essence of it. (makes a few exaggerated, theatrical movements). There, you see? Each strike is precise and deadly.",
        "textRu": "(nods with a knowing smile) Ah, you clearly don't grasp the finer points of this, young one. No surprise there. The lightning five-whip technique is not something just anyone can witness. It takes a master like myself to perform it flawlessly. Watch closely. I will demonstrate the essence of it. (makes a few exaggerated, theatrical movements). There, you see? Each strike is precise and deadly."
      },
      {
        "role": "npc",
        "textEn": "(Praise him)",
        "textRu": "(Praise him)"
      },
      {
        "role": "npc",
        "textEn": "(bows his head slightly, visibly pleased) Ah, you have a keen eye, young one. It's not often that someone recognizes the true power of the lightning five-whip technique. As the saying goes, \"for all intensive purposes.\" My skills are unmatched. If you wish to learn, I can guide you. But first, let me test your understanding. What do you think is the most crucial aspect of this technique?",
        "textRu": "(bows his head slightly, visibly pleased) Ah, you have a keen eye, young one. It's not often that someone recognizes the true power of the lightning five-whip technique. As the saying goes, \"for all intensive purposes.\" My skills are unmatched. If you wish to learn, I can guide you. But first, let me test your understanding. What do you think is the most crucial aspect of this technique?"
      },
      {
        "role": "npc",
        "textEn": "What is it?",
        "textRu": "What is it?"
      },
      {
        "role": "npc",
        "textEn": "(smiles condescendingly, wagging a finger) Sit tight and let me enlighten you, young one. The most crucial aspect of the lightning five-whip technique is the timing and precision of each strike. Every movement must be calculated to perfection. As the old proverb says, \"a mute point.\" Without this, the technique loses its effectiveness. Now, tell me, what do you think about the importance of timing in martial arts?",
        "textRu": "(smiles condescendingly, wagging a finger) Sit tight and let me enlighten you, young one. The most crucial aspect of the lightning five-whip technique is the timing and precision of each strike. Every movement must be calculated to perfection. As the old proverb says, \"a mute point.\" Without this, the technique loses its effectiveness. Now, tell me, what do you think about the importance of timing in martial arts?"
      },
      {
        "role": "npc",
        "textEn": "Effectivity.",
        "textRu": "Effectivity."
      },
      {
        "role": "npc",
        "textEn": "(gazes off like a sage) Enough for now—let my wisdom settle.Gu Yuehu flings his sleeve and ignores you.",
        "textRu": "(gazes off like a sage) Enough for now—let my wisdom settle.Gu Yuehu flings his sleeve and ignores you."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "guan-dayan",
    "nameEn": "Guan Dayan",
    "nameRu": "Гуань Даянь",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Перевал Скакуна",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Guan Dayan находится just восточнее the Crystal Shore boundary stone.",
    "icon": "👤",
    "befriendGuide": "Overpower her Drinking Tolerance\nGuan Duyan is a renowned villager in Crystal Shore because of her ability to drink a thousand cups without getting drunk. Keep trying to out-drink her until she gives up, then her AI will befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(waves a hand) Go home, kid, go home—alright? No one alive can out-drink me, I can tell at a glance. A barrel this small? I could finish it without warming up.",
        "textRu": "(waves a hand) Go home, kid, go home—alright? No one alive can out-drink me, I can tell at a glance. A barrel this small? I could finish it without warming up."
      },
      {
        "role": "npc",
        "textEn": "That's impressive, Guan Dayan! Surely, you can have one more drink to celebrate being undefeated.",
        "textRu": "That's impressive, Guan Dayan! Surely, you can have one more drink to celebrate being undefeated."
      },
      {
        "role": "npc",
        "textEn": "(tips head back and drains a cup) If you can't persuade, go home early, kid. Go home. I don't mean talk me into it till dawn and then leave. One more drink? I'm already into it. But can you keep up?",
        "textRu": "(tips head back and drains a cup) If you can't persuade, go home early, kid. Go home. I don't mean talk me into it till dawn and then leave. One more drink? I'm already into it. But can you keep up?"
      },
      {
        "role": "npc",
        "textEn": "(drinks a large amoun and refills cup)",
        "textRu": "(drinks a large amoun and refills cup)"
      },
      {
        "role": "npc",
        "textEn": "(grins proudly) Go ask around the streets—I'm famous. And you'll be famous too, since you're drinking with someone famous. Let's see if you can match this.",
        "textRu": "(grins proudly) Go ask around the streets—I'm famous. And you'll be famous too, since you're drinking with someone famous. Let's see if you can match this."
      },
      {
        "role": "npc",
        "textEn": "(drinks another three cups)",
        "textRu": "(drinks another three cups)"
      },
      {
        "role": "npc",
        "textEn": "(shakes head) Can you even persuade a drink, or not? If you can't go home—alright? Go home. Liangzhou isn't for you. You drank three, but can you match my spirit?",
        "textRu": "(shakes head) Can you even persuade a drink, or not? If you can't go home—alright? Go home. Liangzhou isn't for you. You drank three, but can you match my spirit?"
      },
      {
        "role": "npc",
        "textEn": "(proudly chugs down more bottles)",
        "textRu": "(proudly chugs down more bottles)"
      },
      {
        "role": "npc",
        "textEn": "(staggers in place, swaying unsteadily) The younger generation is fearsome... not going home, kid... let's keep competing... Guan Dayan feels somewhat dizzy, muttering, \"Go home, kid, go home.\"",
        "textRu": "(staggers in place, swaying unsteadily) The younger generation is fearsome... not going home, kid... let's keep competing... Guan Dayan feels somewhat dizzy, muttering, \"Go home, kid, go home.\""
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "guan-wei",
    "nameEn": "Guan Wei",
    "nameRu": "Гуань Вэй",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Болотная равнина",
    "subregion": "Тропа Циньчуань",
    "locationDetail": "Guan Wei находится in front of the broken house восточнее the Abandoned Shrine boundary stone.",
    "icon": "👤",
    "befriendGuide": "",
    "dialogues": []
  },
  {
    "id": "hai-changchong",
    "nameEn": "Hai Changchong",
    "nameRu": "Хай Чанчун",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Двух зверей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen standing near a cliff.",
    "icon": "👤",
    "befriendGuide": "Tell Crucial Information Regarding Kaifeng\nTel Hai Changchong that there are archers hiding in the trees and scouts in patrol that change their shift every 9 hours. After telling him of this information, tell him that you two will proceed at night so you can go to Kaifeng unseen.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(standing straight, hands clasped behind his back, brows slightly furrowed) One does not simply walk into Kaifeng ... without a flawless plan. Even if this mission seems ordinary, a single mistake could ruin everything.",
        "textRu": "(standing straight, hands clasped behind his back, brows slightly furrowed) One does not simply walk into Kaifeng ... without a flawless plan. Even if this mission seems ordinary, a single mistake could ruin everything."
      },
      {
        "role": "npc",
        "textEn": "Hmm ... do you have something in mind?",
        "textRu": "Hmm ... do you have something in mind?"
      },
      {
        "role": "npc",
        "textEn": "(tapping fingers gently on his arm, gaze distant) I have some ideas, but they require precise information. What can you tell me about the terrain and key locations in Kaifeng? Every detail matters.",
        "textRu": "(tapping fingers gently on his arm, gaze distant) I have some ideas, but they require precise information. What can you tell me about the terrain and key locations in Kaifeng? Every detail matters."
      },
      {
        "role": "npc",
        "textEn": "Archers hiding in the trees and Scouts walking in the pathways .. changing their shifts every 9 hours",
        "textRu": "Archers hiding in the trees and Scouts walking in the pathways .. changing their shifts every 9 hours"
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, eyes narrowing thoughtfully) Archers in the trees and scouts on patrol ... Changing shifts every 9 hours. This information is crucial. We must find a way to navigate these obstacles without being detected.",
        "textRu": "(nodding slowly, eyes narrowing thoughtfully) Archers in the trees and scouts on patrol ... Changing shifts every 9 hours. This information is crucial. We must find a way to navigate these obstacles without being detected."
      },
      {
        "role": "npc",
        "textEn": "I'll start my stealth mission and clear the path for you ... (You sneakily killed all archers and patrols that would disturb the plan at hand.)",
        "textRu": "I'll start my stealth mission and clear the path for you ... (You sneakily killed all archers and patrols that would disturb the plan at hand.)"
      },
      {
        "role": "npc",
        "textEn": "(bowing slightly, voice calm but tense) Wanderer, your assistance is greatly appreciated. However, I must insist on knowing the details of your plan. How will we ensure no one else discovers our presence?",
        "textRu": "(bowing slightly, voice calm but tense) Wanderer, your assistance is greatly appreciated. However, I must insist on knowing the details of your plan. How will we ensure no one else discovers our presence?"
      },
      {
        "role": "player",
        "textEn": "We start at night where there are areas we can go unseen. Let me go first and you follow behind",
        "textRu": "We start at night where there are areas we can go unseen. Let me go first and you follow behind"
      },
      {
        "role": "npc",
        "textEn": "(hands clasped, bowing deeply) Thank you, Wanderer, for helping me craft such a flawless plan. I will consider every detail carefully.Hai Changchong expresses gratitude and begins to ponder deeply.",
        "textRu": "(hands clasped, bowing deeply) Thank you, Wanderer, for helping me craft such a flawless plan. I will consider every detail carefully.Hai Changchong expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "hao-jiu",
    "nameEn": "Hao Jiu",
    "nameRu": "Хао Цзю",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Hao Jiu is found near Yan Ying's chess match and the general goods merchant.",
    "icon": "👤",
    "befriendGuide": "Tell Hao Jiu You Enjoy His Wine\nHao Jiu will reveal that the wine he sells are fake. Mention that you enjoy the wine and that it's well made. Tell him that it doesn't matter what brand the wine has, but rather the conversations that are taking place during drinking sessions are more important.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(waving with a sly grin) Care for a taste of my health tonic wine? Smooth as silk, easy on the throat, delicious and nourishing! They call me \"Sham Payne\" in the trade-because every sip feels like pure luxury, without the pain of an empty purse.",
        "textRu": "(waving with a sly grin) Care for a taste of my health tonic wine? Smooth as silk, easy on the throat, delicious and nourishing! They call me \"Sham Payne\" in the trade-because every sip feels like pure luxury, without the pain of an empty purse."
      },
      {
        "role": "npc",
        "textEn": "Sure (takes the health tonic wine)",
        "textRu": "Sure (takes the health tonic wine)"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing, leaning closer) I must've made a mistake ... Isn't this the Wanderer? I won't sell this wine anymore! You're an expert. One glance and you'd know all my wine is fake! (chuckles nervously) But tell me, what do you think of the culture around fine wines? Most folks just want to show off their bottles, not truly appreciate the taste.",
        "textRu": "(eyes narrowing, leaning closer) I must've made a mistake ... Isn't this the Wanderer? I won't sell this wine anymore! You're an expert. One glance and you'd know all my wine is fake! (chuckles nervously) But tell me, what do you think of the culture around fine wines? Most folks just want to show off their bottles, not truly appreciate the taste."
      },
      {
        "role": "player",
        "textEn": "it taste really good, even if you say its fake. Its well crafted.",
        "textRu": "it taste really good, even if you say its fake. Its well crafted."
      },
      {
        "role": "npc",
        "textEn": "(smirking, rubbing his hands together) Hehe, flattery will get you far, wanderer. But yes, my wine is well-crafted indeed. The key is in the blend. Rich folks pay for the name, not the taste. They wouldn't know a fine vintage if it bit them! (leans in) And besides, drinking too much of anything is bad for you. Fake or not, they still enjoy the experience!",
        "textRu": "(smirking, rubbing his hands together) Hehe, flattery will get you far, wanderer. But yes, my wine is well-crafted indeed. The key is in the blend. Rich folks pay for the name, not the taste. They wouldn't know a fine vintage if it bit them! (leans in) And besides, drinking too much of anything is bad for you. Fake or not, they still enjoy the experience!"
      },
      {
        "role": "player",
        "textEn": "that is true, enjoyment of conversation with others is really main thing for experience. How about it? would you want to talk to me more about this wine?",
        "textRu": "that is true, enjoyment of conversation with others is really main thing for experience. How about it? would you want to talk to me more about this wine?"
      },
      {
        "role": "npc",
        "textEn": "(nodding eagerly) Precisely! The joy is in the company, not the bottle. (smirks) And talking about my wine? Always happy to share my thoughts. But remember, buying wine is voluntary. I'm not forcing anyone to partake! (leans back, folding arms) So, what else do you think makes a good drinking experience?",
        "textRu": "(nodding eagerly) Precisely! The joy is in the company, not the bottle. (smirks) And talking about my wine? Always happy to share my thoughts. But remember, buying wine is voluntary. I'm not forcing anyone to partake! (leans back, folding arms) So, what else do you think makes a good drinking experience?"
      },
      {
        "role": "npc",
        "textEn": "(gives money) here give me more of your wines, and lets talk about it a bit more in the process.",
        "textRu": "(gives money) here give me more of your wines, and lets talk about it a bit more in the process."
      },
      {
        "role": "npc",
        "textEn": "(takes the money, grinning) Ah, a man of discernment! (pours another cup) Here you go. Now, as we sip, let's chat. (sips his own wine) Tell me, do you agree that most drinkers brag about famous vintages but don't actually know real wine? It's all about the brand and showing off!",
        "textRu": "(takes the money, grinning) Ah, a man of discernment! (pours another cup) Here you go. Now, as we sip, let's chat. (sips his own wine) Tell me, do you agree that most drinkers brag about famous vintages but don't actually know real wine? It's all about the brand and showing off!"
      },
      {
        "role": "npc",
        "textEn": "sadly to say, yes most of the drinkers brags on the famous names and vintage some of the wines. I totally dissagree that name and brand of wines are not the center of the show for drinking, its more on how you converse with other people and sometimes talk about random stuff. (laugh)",
        "textRu": "sadly to say, yes most of the drinkers brags on the famous names and vintage some of the wines. I totally dissagree that name and brand of wines are not the center of the show for drinking, its more on how you converse with other people and sometimes talk about random stuff. (laugh)"
      },
      {
        "role": "npc",
        "textEn": "(laughs, nodding) Exactly! The true art of drinking lies in the conversation, not the bottle. (leans in) And that's why my wine works so well. People are paying for the experience, not just the liquid. (grins slyly) They're all about showing off, but they don't really know what they're drinking! It's a win-win for everyone involved.",
        "textRu": "(laughs, nodding) Exactly! The true art of drinking lies in the conversation, not the bottle. (leans in) And that's why my wine works so well. People are paying for the experience, not just the liquid. (grins slyly) They're all about showing off, but they don't really know what they're drinking! It's a win-win for everyone involved."
      },
      {
        "role": "player",
        "textEn": "that is correct, my friend!",
        "textRu": "that is correct, my friend!"
      },
      {
        "role": "npc",
        "textEn": "(raises his cup) To friendship and fine conversation! (smirks) And remember, my wine is perfect for these moments. Whether it's real or not, it brings people together. (winks) So, what do you think about those who can afford fake wine? They're usually the ones who don't mind a little deception, right?",
        "textRu": "(raises his cup) To friendship and fine conversation! (smirks) And remember, my wine is perfect for these moments. Whether it's real or not, it brings people together. (winks) So, what do you think about those who can afford fake wine? They're usually the ones who don't mind a little deception, right?"
      },
      {
        "role": "npc",
        "textEn": "(raises his cup) taost to friendship! and yes ofcourse a little deception wont hurt anyone on just drinking wines. (happy)",
        "textRu": "(raises his cup) taost to friendship! and yes ofcourse a little deception wont hurt anyone on just drinking wines. (happy)"
      },
      {
        "role": "npc",
        "textEn": "(smiling eagerly, tone flattering) Wanderer, would you like to see what else I've got? All top-quality goods!Hao Jiu is busy attending to customers and no longer pays you any attention.",
        "textRu": "(smiling eagerly, tone flattering) Wanderer, would you like to see what else I've got? All top-quality goods!Hao Jiu is busy attending to customers and no longer pays you any attention."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "he-ruiyang",
    "nameEn": "He Ruiyang",
    "nameRu": "Хэ Жуйян",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him beside Li Yushan on the ground floor of the Revelry Hall, on the southwest side of the building.",
    "icon": "👤",
    "befriendGuide": "Listen to He Ruiyang's Worries and Tell Him You Relate with Him\nTo befriend He Ruiyang, listen and ask what is bothering him and tell him that you can relate with him. This will raise his opinion of you and befriend you eventually after talking to him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs, eyes vacant) Wanderer! Tell me, I've given so much for Lady Hua! Why doesn't she understand my feelings? l' ve decided! I won't pursue her anymore!",
        "textRu": "(sighs, eyes vacant) Wanderer! Tell me, I've given so much for Lady Hua! Why doesn't she understand my feelings? l' ve decided! I won't pursue her anymore!"
      },
      {
        "role": "npc",
        "textEn": "Yes my good sir, you should value your self more",
        "textRu": "Yes my good sir, you should value your self more"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, a faint smile) I've figured it out! Let's part on good terms. From now on, she can sail her own boat, and I'Il paddle underneath to keep her afloat. (makes crying noises)",
        "textRu": "(nods slowly, a faint smile) I've figured it out! Let's part on good terms. From now on, she can sail her own boat, and I'Il paddle underneath to keep her afloat. (makes crying noises)"
      },
      {
        "role": "npc",
        "textEn": "But that will hurt you in the long run",
        "textRu": "But that will hurt you in the long run"
      },
      {
        "role": "npc",
        "textEn": "(waves hand weakly) I know, but it's the least I can do for her. Lady Hua is brushing me off-but only me! That means I'm special to her. If she truly disliked me, she wouldn't acknowledge me at all. She's being perfunctory with me ... good! I like her even more now!",
        "textRu": "(waves hand weakly) I know, but it's the least I can do for her. Lady Hua is brushing me off-but only me! That means I'm special to her. If she truly disliked me, she wouldn't acknowledge me at all. She's being perfunctory with me ... good! I like her even more now!"
      },
      {
        "role": "player",
        "textEn": "yes follow your heart!",
        "textRu": "yes follow your heart!"
      },
      {
        "role": "npc",
        "textEn": "(reminiscing, eyes distant) She cared for me too! Last time I had a fever, I came to Revelry Hall and asked why she didn't care. She asked if I was sick and told me to take medicine quickly. See? She actually worried about me! She's so gentle.",
        "textRu": "(reminiscing, eyes distant) She cared for me too! Last time I had a fever, I came to Revelry Hall and asked why she didn't care. She asked if I was sick and told me to take medicine quickly. See? She actually worried about me! She's so gentle."
      },
      {
        "role": "player",
        "textEn": "maybe she does care for you",
        "textRu": "maybe she does care for you"
      },
      {
        "role": "npc",
        "textEn": "(eyes gradually becoming determined) My friends warned me too-they said they'd break my legs if I kept this up. Ah, thank goodness it's my legs, not my hands, or I couldn't play pitch-pot with Lady Hua!",
        "textRu": "(eyes gradually becoming determined) My friends warned me too-they said they'd break my legs if I kept this up. Ah, thank goodness it's my legs, not my hands, or I couldn't play pitch-pot with Lady Hua!"
      },
      {
        "role": "player",
        "textEn": "yes my friend luckily its only the legs",
        "textRu": "yes my friend luckily its only the legs"
      },
      {
        "role": "npc",
        "textEn": "(smiles wistfully) Indeed, I'm grateful for that. But tell me, Wanderer, have you ever felt so strongly about someone that you'd do anything for them?",
        "textRu": "(smiles wistfully) Indeed, I'm grateful for that. But tell me, Wanderer, have you ever felt so strongly about someone that you'd do anything for them?"
      },
      {
        "role": "npc",
        "textEn": "Yes I do infact I can see myself in you",
        "textRu": "Yes I do infact I can see myself in you"
      },
      {
        "role": "npc",
        "textEn": "(nods understandingly) It's a strange feeling, isn't it? Being so devoted that even rejection feels like a kind of connection. (pauses, looks around) So, Wanderer, what brings you to Velvet Shade Revelry Hall today?",
        "textRu": "(nods understandingly) It's a strange feeling, isn't it? Being so devoted that even rejection feels like a kind of connection. (pauses, looks around) So, Wanderer, what brings you to Velvet Shade Revelry Hall today?"
      },
      {
        "role": "player",
        "textEn": "I came here feeling I could share the same story with another and I met you, you got this my friend",
        "textRu": "I came here feeling I could share the same story with another and I met you, you got this my friend"
      },
      {
        "role": "npc",
        "textEn": "(grins, chest puffed out) Just thinking of Lady Hua fills me with courage!He Ruiyang ignores everything around him, completely lost in his own fantasy.",
        "textRu": "(grins, chest puffed out) Just thinking of Lady Hua fills me with courage!He Ruiyang ignores everything around him, completely lost in his own fantasy."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "hong-yang",
    "nameEn": "Hong Yang",
    "nameRu": "Хун Ян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him near a lake with Lu Ke",
    "icon": "👤",
    "befriendGuide": "Challenge Hong Yang then Offer Friendship\nTo prove your point that having a hot temper will lead to a bad outcome, roleplay challenging him to a battle and that you deflected his punch and pin him down. Tell him that if he was calm, then he would see things more clearly. Finally, offer being friends with him and ask him about the Encircling Lake.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(scowling, tone sharp) Who are you? Why are you interrupting me while I'm hunting for treasure?",
        "textRu": "(scowling, tone sharp) Who are you? Why are you interrupting me while I'm hunting for treasure?"
      },
      {
        "role": "npc",
        "textEn": "You should calm down. A hot temp would only cloud your mind",
        "textRu": "You should calm down. A hot temp would only cloud your mind"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing, tone irritated) Calm down? You think I need your advice? My mind is clear as a bell! (waves hand dismissively) Now, off with you before I change my mind.",
        "textRu": "(eyes narrowing, tone irritated) Calm down? You think I need your advice? My mind is clear as a bell! (waves hand dismissively) Now, off with you before I change my mind."
      },
      {
        "role": "player",
        "textEn": "(you pinned him down and told him to calm down.)",
        "textRu": "(you pinned him down and told him to calm down.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes wide with surprise, struggling) What are you doing? Get off me! Do you want to start something? (yelling) Let go of me or I'll make you regret it!",
        "textRu": "(eyes wide with surprise, struggling) What are you doing? Get off me! Do you want to start something? (yelling) Let go of me or I'll make you regret it!"
      },
      {
        "role": "player",
        "textEn": "(you persuaded him that being hot temper would not lead to good outcomes.)",
        "textRu": "(you persuaded him that being hot temper would not lead to good outcomes.)"
      },
      {
        "role": "npc",
        "textEn": "(frowning, tone defensive) I've heard enough of your preaching. My temper serves me well. If you can't handle it, that's your problem. (crosses arms) Now let me go before I teach you a lesson.",
        "textRu": "(frowning, tone defensive) I've heard enough of your preaching. My temper serves me well. If you can't handle it, that's your problem. (crosses arms) Now let me go before I teach you a lesson."
      },
      {
        "role": "npc",
        "textEn": "(Removes hands. Your mind is clouded with anger.)",
        "textRu": "(Removes hands. Your mind is clouded with anger.)"
      },
      {
        "role": "npc",
        "textEn": "(grimacing, rubbing arm) Fine, you got lucky this time. But don't think I'm going to listen to your nonsense. (looks away) What do you want from me anyway?",
        "textRu": "(grimacing, rubbing arm) Fine, you got lucky this time. But don't think I'm going to listen to your nonsense. (looks away) What do you want from me anyway?"
      },
      {
        "role": "npc",
        "textEn": "(I heard that you like to make trouble with other people.)",
        "textRu": "(I heard that you like to make trouble with other people.)"
      },
      {
        "role": "npc",
        "textEn": "(snarls, eyes flashing) That's none of your business! I take care of my own affairs. If you've got a problem with me, say it to my face. (points finger) But know that I won't back down from a fight.",
        "textRu": "(snarls, eyes flashing) That's none of your business! I take care of my own affairs. If you've got a problem with me, say it to my face. (points finger) But know that I won't back down from a fight."
      },
      {
        "role": "npc",
        "textEn": "Then lets fight! ( You deflected his punch and pinned him down again.)",
        "textRu": "Then lets fight! ( You deflected his punch and pinned him down again.)"
      },
      {
        "role": "npc",
        "textEn": "(roars, struggling) You're asking for it! (struggles fiercely) Let me go, or I'll make sure you regret this! (voice grows angrier) What are you trying to prove?",
        "textRu": "(roars, struggling) You're asking for it! (struggles fiercely) Let me go, or I'll make sure you regret this! (voice grows angrier) What are you trying to prove?"
      },
      {
        "role": "npc",
        "textEn": "(If you were a little calmer, you could have easily predicted my attack but since you were too busy being angry, it led you to do an aggresive attack.)",
        "textRu": "(If you were a little calmer, you could have easily predicted my attack but since you were too busy being angry, it led you to do an aggresive attack.)"
      },
      {
        "role": "npc",
        "textEn": "(pauses, breathes heavily, frowns) Maybe ... maybe you have a point. But that doesn't mean I'm going to change overnight. (looks up, eyes narrowed) What do you want from me?",
        "textRu": "(pauses, breathes heavily, frowns) Maybe ... maybe you have a point. But that doesn't mean I'm going to change overnight. (looks up, eyes narrowed) What do you want from me?"
      },
      {
        "role": "npc",
        "textEn": "(remove hands.) You should try to be a little calmer next time. Not all battles are one with fists.",
        "textRu": "(remove hands.) You should try to be a little calmer next time. Not all battles are one with fists."
      },
      {
        "role": "npc",
        "textEn": "(steps back, rubs shoulder, expression slightly less tense) Hmph. I suppose you're right. But don't think I'm going soft. (nods grudgingly) Thanks for the advice. Now, what do you want to know about Encircling Lake?",
        "textRu": "(steps back, rubs shoulder, expression slightly less tense) Hmph. I suppose you're right. But don't think I'm going soft. (nods grudgingly) Thanks for the advice. Now, what do you want to know about Encircling Lake?"
      },
      {
        "role": "player",
        "textEn": "(you talked about a lot of things and became friends.)",
        "textRu": "(you talked about a lot of things and became friends.)"
      },
      {
        "role": "npc",
        "textEn": "(raises eyebrow, skeptical) Friends? We just met and already you're talking about friendship? (shrugs) Fine, I'll humor you. What do you want to talk about? Just keep it short. I've got better things to do.",
        "textRu": "(raises eyebrow, skeptical) Friends? We just met and already you're talking about friendship? (shrugs) Fine, I'll humor you. What do you want to talk about? Just keep it short. I've got better things to do."
      },
      {
        "role": "player",
        "textEn": "(you talked with each other for 5 years and became best friends.)",
        "textRu": "(you talked with each other for 5 years and became best friends.)"
      },
      {
        "role": "npc",
        "textEn": "(frowns, crosses arms) Five years? Are you mad? I've got no time for such nonsense. (glares) If you have something to say, say it now. Otherwise, leave me alone.",
        "textRu": "(frowns, crosses arms) Five years? Are you mad? I've got no time for such nonsense. (glares) If you have something to say, say it now. Otherwise, leave me alone."
      },
      {
        "role": "player",
        "textEn": "wanna know something about encircling lake?",
        "textRu": "wanna know something about encircling lake?"
      },
      {
        "role": "npc",
        "textEn": "(sighs, looks at the lake, expression softened) Fine. Encircling Lake has a hidden treasure. But it's guarded by dangerous creatures and traps. (leans in) If you're serious about finding it, you'll need to be careful and smart. (smirks) And not just rely on brute force.",
        "textRu": "(sighs, looks at the lake, expression softened) Fine. Encircling Lake has a hidden treasure. But it's guarded by dangerous creatures and traps. (leans in) If you're serious about finding it, you'll need to be careful and smart. (smirks) And not just rely on brute force."
      },
      {
        "role": "player",
        "textEn": "(you and Hong Yang were able to find the hidden treasure and became friends.)",
        "textRu": "(you and Hong Yang were able to find the hidden treasure and became friends.)"
      },
      {
        "role": "npc",
        "textEn": "(scratches his head, tone grudging) Wanderer, you've got a point. I'll try ... at least keep my temper in check.Hong Yang expresses gratitude and begins to ponder deeply.",
        "textRu": "(scratches his head, tone grudging) Wanderer, you've got a point. I'll try ... at least keep my temper in check.Hong Yang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "hu-da",
    "nameEn": "Hu Da",
    "nameRu": "Ху Да",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "от Озеро Окружения landmark, follow the path к left, where you’ll find him standing рядом с left side of the outdoor dining area.",
    "icon": "👤",
    "befriendGuide": "Tell Him a Gossip and Convince Him to Stay Safe\nAsk Hu Da about why he got hurt and then tell him about any story you found exciting but filled with trouble. There is a chance Hu Da will realize that we are hinting he should stay safe when chasing stories.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(greets with a bruised face, grinning) Wanderer! Wanderer! Have you traveled far? Got any juicy gossip to share?",
        "textRu": "(greets with a bruised face, grinning) Wanderer! Wanderer! Have you traveled far? Got any juicy gossip to share?"
      },
      {
        "role": "npc",
        "textEn": "You okay?",
        "textRu": "You okay?"
      },
      {
        "role": "npc",
        "textEn": "(brushes off the question, still grinning) Oh, I'm fine! Just a few bumps and bruises from the usual. So, Wanderer, what brings you here today? Any interesting stories to tell?",
        "textRu": "(brushes off the question, still grinning) Oh, I'm fine! Just a few bumps and bruises from the usual. So, Wanderer, what brings you here today? Any interesting stories to tell?"
      },
      {
        "role": "npc",
        "textEn": "No, I want to know why you are hurt",
        "textRu": "No, I want to know why you are hurt"
      },
      {
        "role": "npc",
        "textEn": "(sighs, rubbing his arm) Ah, just got caught in the middle of another argument. These treasure hunters can get quite heated. But enough about me, Wanderer! Tell me something exciting from your travels!",
        "textRu": "(sighs, rubbing his arm) Ah, just got caught in the middle of another argument. These treasure hunters can get quite heated. But enough about me, Wanderer! Tell me something exciting from your travels!"
      },
      {
        "role": "npc",
        "textEn": "Well okay ... Let me tell you about a man who always never backed down to an argument. He kept on fighting a lot of people, like in bars or outside the area. He wouldn't give up ... until he met his match. He got into a fight with a high royalty guard and was killed on the spot.)",
        "textRu": "Well okay ... Let me tell you about a man who always never backed down to an argument. He kept on fighting a lot of people, like in bars or outside the area. He wouldn't give up ... until he met his match. He got into a fight with a high royalty guard and was killed on the spot.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen in shock, leaning in closer) Whoa, that's intense! Such a fate for one who couldn't resist a fight. But you see, Wanderer, I enjoy these tales because they're rare and thrilling. Now, let me tell you about the latest quarrel I witnessed- (pauses) Wait, are you trying to warn me about the dangers of getting involved?",
        "textRu": "(eyes widen in shock, leaning in closer) Whoa, that's intense! Such a fate for one who couldn't resist a fight. But you see, Wanderer, I enjoy these tales because they're rare and thrilling. Now, let me tell you about the latest quarrel I witnessed- (pauses) Wait, are you trying to warn me about the dangers of getting involved?"
      },
      {
        "role": "npc",
        "textEn": "It seems you noticed it ... Yes I am telling you that if you keep on fighting, you will eventually end up the same fate as my old friend.",
        "textRu": "It seems you noticed it ... Yes I am telling you that if you keep on fighting, you will eventually end up the same fate as my old friend."
      },
      {
        "role": "npc",
        "textEn": "(shrugs, unconcerned) Ah, but I'm not the one fighting, Wanderer. I just watch and listen. It's the thrill of knowing what's going on that keeps me coming back. Besides, I've been doing this for years without any real trouble.",
        "textRu": "(shrugs, unconcerned) Ah, but I'm not the one fighting, Wanderer. I just watch and listen. It's the thrill of knowing what's going on that keeps me coming back. Besides, I've been doing this for years without any real trouble."
      },
      {
        "role": "npc",
        "textEn": "So you will just keep on doing it until it will be your last?",
        "textRu": "So you will just keep on doing it until it will be your last?"
      },
      {
        "role": "npc",
        "textEn": "(chuckles, shaking his head) Well, Wanderer, I suppose everyone meets their end someday. But until then, I plan to enjoy every moment. Gossip and commotion are my lifeblood! You can't convince me otherwise with just a story.",
        "textRu": "(chuckles, shaking his head) Well, Wanderer, I suppose everyone meets their end someday. But until then, I plan to enjoy every moment. Gossip and commotion are my lifeblood! You can't convince me otherwise with just a story."
      },
      {
        "role": "npc",
        "textEn": "(a man appeared who looked at Hu Da angrily ... \"You are the punk who wont keep his mouth shut*)",
        "textRu": "(a man appeared who looked at Hu Da angrily ... \"You are the punk who wont keep his mouth shut*)"
      },
      {
        "role": "npc",
        "textEn": "(jumps back, eyes wide with surprise) Oh dear! Wanderer, look at that! I didn't expect company. (nervously glances at the man) Hehe, hello there! I was just sharing a harmless story. No harm done, right?",
        "textRu": "(jumps back, eyes wide with surprise) Oh dear! Wanderer, look at that! I didn't expect company. (nervously glances at the man) Hehe, hello there! I was just sharing a harmless story. No harm done, right?"
      },
      {
        "role": "player",
        "textEn": "(You walked in between both of them and scared the man off)",
        "textRu": "(You walked in between both of them and scared the man off)"
      },
      {
        "role": "npc",
        "textEn": "(sighs in relief, wiping sweat from his forehead) Phew! Thanks, Wanderer! That was a close call. You really saved me there. (grins) But you see, it's moments like these that make the gossip worth it. Still, maybe I should be a bit more cautious. What do you think?",
        "textRu": "(sighs in relief, wiping sweat from his forehead) Phew! Thanks, Wanderer! That was a close call. You really saved me there. (grins) But you see, it's moments like these that make the gossip worth it. Still, maybe I should be a bit more cautious. What do you think?"
      },
      {
        "role": "npc",
        "textEn": "Yes you should.",
        "textRu": "Yes you should."
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, still a bit shaken) You're right, Wanderer. I'll try to be more careful. But I can't promise to stop entirely. Gossip is just too much fun! (smiles weakly) Maybe we can find a safer way to satisfy my curiosity?",
        "textRu": "(nods slowly, still a bit shaken) You're right, Wanderer. I'll try to be more careful. But I can't promise to stop entirely. Gossip is just too much fun! (smiles weakly) Maybe we can find a safer way to satisfy my curiosity?"
      },
      {
        "role": "npc",
        "textEn": "(Hu da then learned to stop chasing for excitement and just chilled.)",
        "textRu": "(Hu da then learned to stop chasing for excitement and just chilled.)"
      },
      {
        "role": "npc",
        "textEn": "(looks thoughtful, rubbing his chin) Wanderer, what you said makes sense. Gossip isn't worth getting hurt over. I should find a safe spot to watch from.Hu Da expresses gratitude and begins to ponder deeply.",
        "textRu": "(looks thoughtful, rubbing his chin) Wanderer, what you said makes sense. Gossip isn't worth getting hurt over. I should find a safe spot to watch from.Hu Da expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "hunter",
    "nameEn": "Hunter",
    "nameRu": "Охотник",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Двух зверей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him behind a cluster of bamboo рядом с river.",
    "icon": "👤",
    "befriendGuide": "Tell the Hunter You Will Be His Representative\nRoleplay and tell the Hunter that you have found some evidence proving his innocence and that you talked to the authorities regarding the case. If he asks about how you will present the evidence, tell him that you will become his representative to prove his innocence.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes darting around, voice trembling) I ... I've been wronged by the authorities. Wanderer, can you help me find a way to clear my name?",
        "textRu": "(eyes darting around, voice trembling) I ... I've been wronged by the authorities. Wanderer, can you help me find a way to clear my name?"
      },
      {
        "role": "npc",
        "textEn": "Tell me what happened!",
        "textRu": "Tell me what happened!"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, runs hand through hair) The authorities claim I stole something valuable. But I swear, I didn't do it. Someone must be framing me. What should I do?",
        "textRu": "(sighs deeply, runs hand through hair) The authorities claim I stole something valuable. But I swear, I didn't do it. Someone must be framing me. What should I do?"
      },
      {
        "role": "player",
        "textEn": "(You talked with the authorities to find out what the hunter did)",
        "textRu": "(You talked with the authorities to find out what the hunter did)"
      },
      {
        "role": "npc",
        "textEn": "(looks at you with wide eyes, voice shaking) I ... I haven't spoken to them yet. They're already after me. If I go to them, they might lock me up without listening. What can I do?",
        "textRu": "(looks at you with wide eyes, voice shaking) I ... I haven't spoken to them yet. They're already after me. If I go to them, they might lock me up without listening. What can I do?"
      },
      {
        "role": "player",
        "textEn": "(you told him that he is safe since you already talked with the authorities)",
        "textRu": "(you told him that he is safe since you already talked with the authorities)"
      },
      {
        "role": "npc",
        "textEn": "(eyebrows furrow, gaze uncertain) Really? You spoke to them? Did they say anything about proving my innocence? I'm so worried ...",
        "textRu": "(eyebrows furrow, gaze uncertain) Really? You spoke to them? Did they say anything about proving my innocence? I'm so worried ..."
      },
      {
        "role": "player",
        "textEn": "I told them that a piece of cloth isn't defining evidence that you are the culprit.",
        "textRu": "I told them that a piece of cloth isn't defining evidence that you are the culprit."
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, expression tense) A piece of cloth ... That makes sense. But what else could they have? I need to gather more evidence to show my innocence. Can you help me?",
        "textRu": "(nods slowly, expression tense) A piece of cloth ... That makes sense. But what else could they have? I need to gather more evidence to show my innocence. Can you help me?"
      },
      {
        "role": "npc",
        "textEn": "Sure (You gathered enough evidence to prove that the hunter was innocent)",
        "textRu": "Sure (You gathered enough evidence to prove that the hunter was innocent)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brighten slightly, voice hopeful) Really? You found evidence? That's incredible! But ... how do we present it to the authorities without getting me arrested?",
        "textRu": "(eyes brighten slightly, voice hopeful) Really? You found evidence? That's incredible! But ... how do we present it to the authorities without getting me arrested?"
      },
      {
        "role": "player",
        "textEn": "I will go to them directly. I will be your representative for this case. (You fought the authorities on court and was able to prove to them that the hunter was innocent.)",
        "textRu": "I will go to them directly. I will be your representative for this case. (You fought the authorities on court and was able to prove to them that the hunter was innocent.)"
      },
      {
        "role": "npc",
        "textEn": "(lets out a shaky breath, shoulders relaxing) Thank you for the advice, Wanderer. I'll try it first. I hope to clear my name soon.Hunter expresses gratitude and begins to ponder deeply.",
        "textRu": "(lets out a shaky breath, shoulders relaxing) Thank you for the advice, Wanderer. I'll try it first. I hope to clear my name soon.Hunter expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jiang-li",
    "nameEn": "Jiang Li",
    "nameRu": "Цзян Ли",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him by going южнее the Springwave Pavilion Landmark, then heading to your right, where he can be seen behind the house where Yiluo (Graceful Memory) resides.",
    "icon": "👤",
    "befriendGuide": "Tell Jiang Li a Good Spot for Flowers\nRoleplay giving Jiang Li some flowers and he will ask you where you found it. Tell him you found the rarest flower to the east, beyond the mountains and it is near the docks. This will cause Jiang Li to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(with an expectant look, voice brimming with excitement) If I can get just one more flower, I'll be at the very top of the flower fair! Wanderer, do you ... happen to have any flowers?",
        "textRu": "(with an expectant look, voice brimming with excitement) If I can get just one more flower, I'll be at the very top of the flower fair! Wanderer, do you ... happen to have any flowers?"
      },
      {
        "role": "npc",
        "textEn": "Why yes! Here are some of the best flowers in Qinghe",
        "textRu": "Why yes! Here are some of the best flowers in Qinghe"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening with delight, hands clasping together excitedly) Really? That's amazing! Thank you, Wanderer! These flowers will surely help me rank at the top of the flower fair! Now, if only I could get a few more ... Do you know where I might find more?",
        "textRu": "(eyes widening with delight, hands clasping together excitedly) Really? That's amazing! Thank you, Wanderer! These flowers will surely help me rank at the top of the flower fair! Now, if only I could get a few more ... Do you know where I might find more?"
      },
      {
        "role": "npc",
        "textEn": "East of here beyond the mountains, you'll see the rarest flowers of the Kaifeng",
        "textRu": "East of here beyond the mountains, you'll see the rarest flowers of the Kaifeng"
      },
      {
        "role": "npc",
        "textEn": "(leaning forward eagerly, eyes sparkling with hope) East of here, beyond the mountains? That sounds promising! Could you show me exactly where to find them? I'd be forever grateful!",
        "textRu": "(leaning forward eagerly, eyes sparkling with hope) East of here, beyond the mountains? That sounds promising! Could you show me exactly where to find them? I'd be forever grateful!"
      },
      {
        "role": "npc",
        "textEn": "Near the docks",
        "textRu": "Near the docks"
      },
      {
        "role": "npc",
        "textEn": "(nodding enthusiastically, a determined look in his eyes) Near the docks, got it! I'll head there right away, Thanks again, Wanderer! With your help, I feel confident I can secure a top spot at the flower fair and make it to the Revelry Hall Heroes Assembly.",
        "textRu": "(nodding enthusiastically, a determined look in his eyes) Near the docks, got it! I'll head there right away, Thanks again, Wanderer! With your help, I feel confident I can secure a top spot at the flower fair and make it to the Revelry Hall Heroes Assembly."
      },
      {
        "role": "npc",
        "textEn": "(Jiang Li became the number 1 in the fair)",
        "textRu": "(Jiang Li became the number 1 in the fair)"
      },
      {
        "role": "npc",
        "textEn": "(eyes shimmering with excitement, a bright smile spreading across his face) Thank you, Wanderer! With your help, I'm certain I'll shine at the flower fair!Jiang Li expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes shimmering with excitement, a bright smile spreading across his face) Thank you, Wanderer! With your help, I'm certain I'll shine at the flower fair!Jiang Li expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jiang-nanyi",
    "nameEn": "Jiang Nanyi",
    "nameRu": "Цзян Наньи",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him under a white blossom tree у docks, behind some ladies.",
    "icon": "👤",
    "befriendGuide": "Agree with Him and Learn from Him\nJiang Nanyi will talk about his love life and that he obtained the Enticing Glance Swordplay to practice it with his sister. Ask for enlightenment regarding the swordplay and then ask him that you are willing to learn the technique to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(touches the bridge of his nose, voice tinged with melancholy) You've never been in love, Wanderer ... how could you possibly understand what I feel right now?",
        "textRu": "(touches the bridge of his nose, voice tinged with melancholy) You've never been in love, Wanderer ... how could you possibly understand what I feel right now?"
      },
      {
        "role": "npc",
        "textEn": "Are you sure? I have also experienced what people call ... \"broken hearted\"",
        "textRu": "Are you sure? I have also experienced what people call ... \"broken hearted\""
      },
      {
        "role": "npc",
        "textEn": "(leans back, eyes narrowing skeptically) Oh really? And what would someone like you know of broken hearts? (pauses, then waves dismissively) Love is a vast ocean, and not everyone can swim its depths. I doubt you've ever felt the kind of love I have for my junior sister.",
        "textRu": "(leans back, eyes narrowing skeptically) Oh really? And what would someone like you know of broken hearts? (pauses, then waves dismissively) Love is a vast ocean, and not everyone can swim its depths. I doubt you've ever felt the kind of love I have for my junior sister."
      },
      {
        "role": "npc",
        "textEn": "Love for family, that is beautiful! You would do anything to protect your family",
        "textRu": "Love for family, that is beautiful! You would do anything to protect your family"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, a hint of pride in his eyes) Yes, protecting my family is paramount. But there's more to it than mere protection. (glances away, voice softening) There's a deep bond, a connection that transcends simple familial ties. It's ... complicated.",
        "textRu": "(nods slowly, a hint of pride in his eyes) Yes, protecting my family is paramount. But there's more to it than mere protection. (glances away, voice softening) There's a deep bond, a connection that transcends simple familial ties. It's ... complicated."
      },
      {
        "role": "npc",
        "textEn": "Please enlighten me",
        "textRu": "Please enlighten me"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, gaze distant) It's a mix of duty, affection, and something deeper-a desire to be her perfect match in every way. (smiles wistfully) I want to be the one who understands her completely, who can share her dreams and fears. That's why I obtained the \"Enticing Glance Swordplay.\" To practice it with her ... to show her that our bond is unbreakable.",
        "textRu": "(sighs deeply, gaze distant) It's a mix of duty, affection, and something deeper-a desire to be her perfect match in every way. (smiles wistfully) I want to be the one who understands her completely, who can share her dreams and fears. That's why I obtained the \"Enticing Glance Swordplay.\" To practice it with her ... to show her that our bond is unbreakable."
      },
      {
        "role": "npc",
        "textEn": "A wish to share a bond with your sister in the matter of swordplay ... am I correct?",
        "textRu": "A wish to share a bond with your sister in the matter of swordplay ... am I correct?"
      },
      {
        "role": "npc",
        "textEn": "(exhales sharply, nodding) Precisely. The \"Enticing Glance Swordplay\" is not just a technique-it's a way to deepen our connection. (eyes gleam with determination) I want us to be inseparable, both in spirit and in skill. Are you beginning to see the depth of my feelings?",
        "textRu": "(exhales sharply, nodding) Precisely. The \"Enticing Glance Swordplay\" is not just a technique-it's a way to deepen our connection. (eyes gleam with determination) I want us to be inseparable, both in spirit and in skill. Are you beginning to see the depth of my feelings?"
      },
      {
        "role": "npc",
        "textEn": "Yes! (Draws Blade) Show me this skill you speak of",
        "textRu": "Yes! (Draws Blade) Show me this skill you speak of"
      },
      {
        "role": "npc",
        "textEn": "(tenses, hand instinctively moving to his own sword) Ah, I see. You're eager to learn. (smirks, shaking his head) But this isn't something anyone can just pick up. It requires a special bond, a unique understanding. (gazes at the player with a challenging look) Do you think you can truly grasp it?",
        "textRu": "(tenses, hand instinctively moving to his own sword) Ah, I see. You're eager to learn. (smirks, shaking his head) But this isn't something anyone can just pick up. It requires a special bond, a unique understanding. (gazes at the player with a challenging look) Do you think you can truly grasp it?"
      },
      {
        "role": "npc",
        "textEn": "Try me (Looking intently at the blade)",
        "textRu": "Try me (Looking intently at the blade)"
      },
      {
        "role": "npc",
        "textEn": "(looks at his junior sister with deep affection) I hope ... we will always remain us.Jiang Nanyi expresses gratitude.",
        "textRu": "(looks at his junior sister with deep affection) I hope ... we will always remain us.Jiang Nanyi expresses gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jiang-shiqi",
    "nameEn": "Jiang Shiqi",
    "nameRu": "Цзян Шицы",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Перевал Скакуна",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Jiang Shiqi находится lying down on the frozen pond southзападнее the Sparrow Sutra Hall boundary stone.",
    "icon": "👤",
    "befriendGuide": "Try to Convince Him to Take a Break from His Training\nJiang Shiqi is lying down in a frozen pond, claiming that this Ice Endurance Trial will help make him become stronger like his senior brother. Persuade him to get up while reassuring him that his senior brother is proud of him and his AI will befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "I... can still... hold on... no joke (nose tip flushed bright red)",
        "textRu": "I... can still... hold on... no joke (nose tip flushed bright red)"
      },
      {
        "role": "npc",
        "textEn": "You look tired, do you want me to help you up?",
        "textRu": "You look tired, do you want me to help you up?"
      },
      {
        "role": "npc",
        "textEn": "(chest rising and falling with breath) Ice Endurance Trial—whoever lasts longer wins... this ice feels thick, really thick, no joke, and I've already been here for hours; by the way, speaking of thick... do you know how thick my senior brother's arms are! I'm telling you, I won't quit and make senior brother lose face—Jiang Shiqi, keep going!",
        "textRu": "(chest rising and falling with breath) Ice Endurance Trial—whoever lasts longer wins... this ice feels thick, really thick, no joke, and I've already been here for hours; by the way, speaking of thick... do you know how thick my senior brother's arms are! I'm telling you, I won't quit and make senior brother lose face—Jiang Shiqi, keep going!"
      },
      {
        "role": "npc",
        "textEn": "Endurance takes practice as well, it's not something you can succeed at overnight. You've endured enough for now and it also shows your strength and commitment. Maybe a part of the trial is knowing when to rest too.",
        "textRu": "Endurance takes practice as well, it's not something you can succeed at overnight. You've endured enough for now and it also shows your strength and commitment. Maybe a part of the trial is knowing when to rest too."
      },
      {
        "role": "npc",
        "textEn": "(huffing, face turning slightly pale) No joke, I understand, but I can't let senior brother down... I've seen how they push themselves, and it's inspiring, big time! For real though, I won't back down—just a bit longer, and I'll make senior brother proud!",
        "textRu": "(huffing, face turning slightly pale) No joke, I understand, but I can't let senior brother down... I've seen how they push themselves, and it's inspiring, big time! For real though, I won't back down—just a bit longer, and I'll make senior brother proud!"
      },
      {
        "role": "player",
        "textEn": "I'm sure your senior brother is already proud of you, but he probably wants you to be safe too.",
        "textRu": "I'm sure your senior brother is already proud of you, but he probably wants you to be safe too."
      },
      {
        "role": "npc",
        "textEn": "(eyes squinting, muscles visibly trembling) For real though, that's a good point... but I can't just give up! I've been training so hard, and I know senior brother's expecting a lot frome me. I'm telling you, I'll hold on just a bit longer—this cold is nothing compared to the heat of a real man's spirit!",
        "textRu": "(eyes squinting, muscles visibly trembling) For real though, that's a good point... but I can't just give up! I've been training so hard, and I know senior brother's expecting a lot frome me. I'm telling you, I'll hold on just a bit longer—this cold is nothing compared to the heat of a real man's spirit!"
      },
      {
        "role": "player",
        "textEn": "Your spirit is admirable! But strength is also knowing when you've already learned the lesson.",
        "textRu": "Your spirit is admirable! But strength is also knowing when you've already learned the lesson."
      },
      {
        "role": "npc",
        "textEn": "(grinning despite the cold) You know what I mean? I get it, but senior brother's toughness is something I really admire. No joke, I won't quit until I've learned everything I can from this!",
        "textRu": "(grinning despite the cold) You know what I mean? I get it, but senior brother's toughness is something I really admire. No joke, I won't quit until I've learned everything I can from this!"
      },
      {
        "role": "npc",
        "textEn": "Knowing when to rest is also a part of the lesssons you need to learn. Now, let's get you up from there so you can rest!",
        "textRu": "Knowing when to rest is also a part of the lesssons you need to learn. Now, let's get you up from there so you can rest!"
      },
      {
        "role": "npc",
        "textEn": "(eyes rimmed with red) We're competing in the Ice Endurance Trial, to see... see who lasts the longest. Hah, not gonna lie, this challenge is big, really big, and I've held on for quite a while; by the way, speaking of big... do you know how big my senior brother's abs are! (muscles trembling with excitement) For real though, I have to train until I'm just as tough!",
        "textRu": "(eyes rimmed with red) We're competing in the Ice Endurance Trial, to see... see who lasts the longest. Hah, not gonna lie, this challenge is big, really big, and I've held on for quite a while; by the way, speaking of big... do you know how big my senior brother's abs are! (muscles trembling with excitement) For real though, I have to train until I'm just as tough!"
      },
      {
        "role": "player",
        "textEn": "I'm pretty sure senior brother didn't obtain his toughness by forcing all of his training in one day. I'm sure he made time to rest as well.",
        "textRu": "I'm pretty sure senior brother didn't obtain his toughness by forcing all of his training in one day. I'm sure he made time to rest as well."
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing in determination) You're right, but I've gotta show I can push through, even if it's just for a liitle while longer. I'm telling you, senior brother's discipline is what sets them apart. (muscles trembling with cold) By the way, speaking of pushing through... do you kow how solid my senior brother's chest is? For real though, I need to train more to match that!",
        "textRu": "(eyes narrowing in determination) You're right, but I've gotta show I can push through, even if it's just for a liitle while longer. I'm telling you, senior brother's discipline is what sets them apart. (muscles trembling with cold) By the way, speaking of pushing through... do you kow how solid my senior brother's chest is? For real though, I need to train more to match that!"
      },
      {
        "role": "player",
        "textEn": "Your dedication is evident, even to your senior brother. I know he's proud of you too and he'll honor the practice you've put into this so far!",
        "textRu": "Your dedication is evident, even to your senior brother. I know he's proud of you too and he'll honor the practice you've put into this so far!"
      },
      {
        "role": "npc",
        "textEn": "(chest puffing out slightly) Really? You think so? I'm telling you, that means a lot! I won't let this effort go to waste—senior brother's pride is what keeps me going. (jaw set with determination) By the way, speaking of going... do you know how strong my senior brother's legs are? No joke, they look like they can run through a storm!",
        "textRu": "(chest puffing out slightly) Really? You think so? I'm telling you, that means a lot! I won't let this effort go to waste—senior brother's pride is what keeps me going. (jaw set with determination) By the way, speaking of going... do you know how strong my senior brother's legs are? No joke, they look like they can run through a storm!"
      },
      {
        "role": "player",
        "textEn": "Your senior brother already has so much pride in you. He'll be more proud of you if you let yourself rest too.",
        "textRu": "Your senior brother already has so much pride in you. He'll be more proud of you if you let yourself rest too."
      },
      {
        "role": "npc",
        "textEn": "(smiling with satisfaction) Buddy, I'm honestly really happy talking with you; you're really tall, no joke, way taller than me, by the way, speaking of tall... you're standing so high the wind's yelling at me, come lie down so I can hear you! Jiang Shiqi thanks you for your kindness and invites you to lie down with him.",
        "textRu": "(smiling with satisfaction) Buddy, I'm honestly really happy talking with you; you're really tall, no joke, way taller than me, by the way, speaking of tall... you're standing so high the wind's yelling at me, come lie down so I can hear you! Jiang Shiqi thanks you for your kindness and invites you to lie down with him."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jiang-yulang",
    "nameEn": "Jiang Yulang",
    "nameRu": "Цзян Юлан",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him by going севернее the Springwave Pavilion Landmark, where he можно найти внутри flower shop with Rong Xiaoxiao.",
    "icon": "👤",
    "befriendGuide": "Offer Jiang Yulang a Part Time Job\nYou can offer Jiang Yulang part time job like helping you clean the market and rewarding him with food for a job well done to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(rubs the back of his head, face scrunched with worry) Why is saving money so tough? I've already skipped four skewers of Tanghulu this month, and I've only managed to save so little coins ... How long will it take before I can afford the 'Double Wings in Flight' fireworks?",
        "textRu": "(rubs the back of his head, face scrunched with worry) Why is saving money so tough? I've already skipped four skewers of Tanghulu this month, and I've only managed to save so little coins ... How long will it take before I can afford the 'Double Wings in Flight' fireworks?"
      },
      {
        "role": "npc",
        "textEn": "So you are also a fan of the Double Wings in Flight fireworks too ah",
        "textRu": "So you are also a fan of the Double Wings in Flight fireworks too ah"
      },
      {
        "role": "npc",
        "textEn": "(shakes his head, eyes lighting up with determination) Not exactly, Wanderer. It's Rong Xiaoxiao who loves them. She always talks about how beautiful they are when they light up the sky. I just want to make her happy and show her how much I care. (sighs softly) But it seems like my love for food keeps getting in the way ...",
        "textRu": "(shakes his head, eyes lighting up with determination) Not exactly, Wanderer. It's Rong Xiaoxiao who loves them. She always talks about how beautiful they are when they light up the sky. I just want to make her happy and show her how much I care. (sighs softly) But it seems like my love for food keeps getting in the way ..."
      },
      {
        "role": "npc",
        "textEn": "Hmm .. then why not join me? You can join me to become my part time assistant, and I'Il pay you",
        "textRu": "Hmm .. then why not join me? You can join me to become my part time assistant, and I'Il pay you"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with surprise, leaning forward slightly) Really? A job as your assistant? That sounds intriguing! But ... (scratches his chin, looking uncertain) I don't know how to do much besides eating. Can you teach me what to do? (grins hopefully) And maybe we can find some tasty treats along the way!",
        "textRu": "(eyes widen with surprise, leaning forward slightly) Really? A job as your assistant? That sounds intriguing! But ... (scratches his chin, looking uncertain) I don't know how to do much besides eating. Can you teach me what to do? (grins hopefully) And maybe we can find some tasty treats along the way!"
      },
      {
        "role": "npc",
        "textEn": "Sure! you just have to ... (I explained that he just need to help me clean the markets and I'll give him 4 skewers for every 10 trash you clean.)",
        "textRu": "Sure! you just have to ... (I explained that he just need to help me clean the markets and I'll give him 4 skewers for every 10 trash you clean.)"
      },
      {
        "role": "npc",
        "textEn": "(grabs my hand with a bright grin, eyes full of gratitude) Thank you so much, Wanderer! I'll give it my best shot-no more extra snacks for now!Jiang Yulang expresses gratitude and begins to ponder deeply.",
        "textRu": "(grabs my hand with a bright grin, eyes full of gratitude) Thank you so much, Wanderer! I'll give it my best shot-no more extra snacks for now!Jiang Yulang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jin-chunniang",
    "nameEn": "Jin Chunniang",
    "nameRu": "Цзинь Чуньнян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Бамбуковая обитель",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "On the mudflat к южнее Изумрудные дикие земли Wayfarer.",
    "icon": "👤",
    "befriendGuide": "Promise a Safe Place\nJin Chunniang will want a safe place for her and her son where they can live peacefully. Befriending Jin Chunniang requires you to promise them that you will find a safe place for them.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(carrying a basket, frowning) This Verdant Wilds is not a long-term solution either, but where else can I go with my son ......",
        "textRu": "(carrying a basket, frowning) This Verdant Wilds is not a long-term solution either, but where else can I go with my son ......"
      },
      {
        "role": "player",
        "textEn": "I'm sorry if you are having a hard time. Let me help you if I can",
        "textRu": "I'm sorry if you are having a hard time. Let me help you if I can"
      },
      {
        "role": "npc",
        "textEn": "(looks up, eyes slightly widening) Help? (pauses, then narrows her eyes cautiously) How so, wanderer? What can you offer us in this harsh world?",
        "textRu": "(looks up, eyes slightly widening) Help? (pauses, then narrows her eyes cautiously) How so, wanderer? What can you offer us in this harsh world?"
      },
      {
        "role": "player",
        "textEn": "I can try to find a safe place for you two to stay and then come back. Kindness creates kindness.",
        "textRu": "I can try to find a safe place for you two to stay and then come back. Kindness creates kindness."
      },
      {
        "role": "npc",
        "textEn": "(takes a step back, hand resting on her son's shoulder) A safe place? (nods slowly) That sounds too good to be true. But ... I suppose it wouldn't hurt to hear more.",
        "textRu": "(takes a step back, hand resting on her son's shoulder) A safe place? (nods slowly) That sounds too good to be true. But ... I suppose it wouldn't hurt to hear more."
      },
      {
        "role": "npc",
        "textEn": "Don't worry. I will return to you once I find a safe place. For now, please stay safe",
        "textRu": "Don't worry. I will return to you once I find a safe place. For now, please stay safe"
      },
      {
        "role": "npc",
        "textEn": "(expression softens with gratitude) Thank you, wanderer. Your kindness means more than words can say. I won't forget this.Jun Chunniang expresses gratitude and begins to ponder carefully.",
        "textRu": "(expression softens with gratitude) Thank you, wanderer. Your kindness means more than words can say. I won't forget this.Jun Chunniang expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jin-nanshou",
    "nameEn": "Jin Nanshou",
    "nameRu": "Цзинь Наньшоу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Башня Мирного колокола",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him by using the Deerforage Grove Landmark. Follow the road north until you reach a fork, then turn right. You’ll see him у side of the road.",
    "icon": "👤",
    "befriendGuide": "Give Jin Nanshou a Strong Name\nJin Nanshou will want a new name that sounds strong so he can avoid being robbed and misfortune. Suggest even a simple name like Strong Boy and then roleplay that the name made people scared of him to trick the AI into befriending you. Note that this may take a few tries before it works.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pacing anxiously, wringing his hands) Ugh ... robbed again on Moonveil Mountain! My name-Jin Nanshou- means \"hard to keep gold.\" And judging by today, the universe agrees. If this were some grand tale, they'd probably call me Notta Richman in the foreign scripts ... sounds about right, doesn't it?",
        "textRu": "(pacing anxiously, wringing his hands) Ugh ... robbed again on Moonveil Mountain! My name-Jin Nanshou- means \"hard to keep gold.\" And judging by today, the universe agrees. If this were some grand tale, they'd probably call me Notta Richman in the foreign scripts ... sounds about right, doesn't it?"
      },
      {
        "role": "npc",
        "textEn": "No, there is no such things as misfortune. What I see is a person who looks like an easy prey for thieves and bandits.",
        "textRu": "No, there is no such things as misfortune. What I see is a person who looks like an easy prey for thieves and bandits."
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing, fidgeting) Easy prey? But I'm just trying to make honest coin. It's not my fault the mountain is full of outlaws. What can I do to change this?",
        "textRu": "(eyes narrowing, fidgeting) Easy prey? But I'm just trying to make honest coin. It's not my fault the mountain is full of outlaws. What can I do to change this?"
      },
      {
        "role": "npc",
        "textEn": "Let me help you .. lets give it a month or two. (You trained him in the way of the sword to help him protect himself against potentival threats that would attack him.)",
        "textRu": "Let me help you .. lets give it a month or two. (You trained him in the way of the sword to help him protect himself against potentival threats that would attack him.)"
      },
      {
        "role": "npc",
        "textEn": "(smiling weakly, nodding slowly) Training in the way of the sword? That sounds promising, but I fear my hands tremble too much. Perhaps a stronger name could bring me more courage and fortune.",
        "textRu": "(smiling weakly, nodding slowly) Training in the way of the sword? That sounds promising, but I fear my hands tremble too much. Perhaps a stronger name could bring me more courage and fortune."
      },
      {
        "role": "player",
        "textEn": "(You gave him bodyguards that would always protect him 24/7)",
        "textRu": "(You gave him bodyguards that would always protect him 24/7)"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up, clasping hands together) Bodyguards! That could work, But I worry about the cost and whether they are trustworthy. A new name might be simpler and bring better luck.",
        "textRu": "(eyes lighting up, clasping hands together) Bodyguards! That could work, But I worry about the cost and whether they are trustworthy. A new name might be simpler and bring better luck."
      },
      {
        "role": "npc",
        "textEn": "Then how about 'Coco Mel\"",
        "textRu": "Then how about 'Coco Mel\""
      },
      {
        "role": "npc",
        "textEn": "(frowning, scratching head) Coco Mel? It sounds ... unusual. I want a name that inspires strength and good fortune, not confusion. Any other ideas?",
        "textRu": "(frowning, scratching head) Coco Mel? It sounds ... unusual. I want a name that inspires strength and good fortune, not confusion. Any other ideas?"
      },
      {
        "role": "player",
        "textEn": "(You gave him the name \"Strong boy\" which means strong boy)",
        "textRu": "(You gave him the name \"Strong boy\" which means strong boy)"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully, stroking chin) Strong Boy? It does sound powerful. But will it truly bring me the protection and success I seek? I need to think on this.",
        "textRu": "(nodding thoughtfully, stroking chin) Strong Boy? It does sound powerful. But will it truly bring me the protection and success I seek? I need to think on this."
      },
      {
        "role": "npc",
        "textEn": "It will believe in me!",
        "textRu": "It will believe in me!"
      },
      {
        "role": "npc",
        "textEn": "(looking skeptical, shaking head) I appreciate your confidence, but I need more than just a name to ensure my safety and success. Perhaps we should find a reliable escort agency instead.",
        "textRu": "(looking skeptical, shaking head) I appreciate your confidence, but I need more than just a name to ensure my safety and success. Perhaps we should find a reliable escort agency instead."
      },
      {
        "role": "npc",
        "textEn": "(The name \"strong boy\" made people scared of his name and never bothered him again)",
        "textRu": "(The name \"strong boy\" made people scared of his name and never bothered him again)"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly, expression softening) Thank you, Wanderer. Your words have given me much to think about. I will keep them in mind.Jin Nanshou expresses gratitude and begins to ponder deeply.",
        "textRu": "(bows slightly, expression softening) Thank you, Wanderer. Your words have given me much to think about. I will keep them in mind.Jin Nanshou expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jin-xiaobao",
    "nameEn": "Jin Xiaobao",
    "nameRu": "Цзинь Сяобао",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Бамбуковая обитель",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "On the mudflat к южнее Изумрудные дикие земли Wayfarer.",
    "icon": "👤",
    "befriendGuide": "Give a Heroic Impression to Jin\nJin Xiaobao loves heroes, and the things that you'll have to say to quickly befriend him is to impress him like offering to teach martial arts to her. This will instantly catch him attention, leading into befriending him quickly.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes bright with excitement, clutching a wriggling loach) Are you the Wanderer? I didn't even notice while catching loaches! Wanderer, don't leave yet!",
        "textRu": "(eyes bright with excitement, clutching a wriggling loach) Are you the Wanderer? I didn't even notice while catching loaches! Wanderer, don't leave yet!"
      },
      {
        "role": "npc",
        "textEn": "Do you want to learn martial arts? I can teach you",
        "textRu": "Do you want to learn martial arts? I can teach you"
      },
      {
        "role": "npc",
        "textEn": "(rends his eyes wide with joy, hopping on the spot) Really? You can teach mc martial arts? That would be amazing! What kind of finishing move can you teach me?Just one, please!",
        "textRu": "(rends his eyes wide with joy, hopping on the spot) Really? You can teach mc martial arts? That would be amazing! What kind of finishing move can you teach me?Just one, please!"
      },
      {
        "role": "player",
        "textEn": "I can teach you Tai Chi",
        "textRu": "I can teach you Tai Chi"
      },
      {
        "role": "npc",
        "textEn": "(eyes sparkling with excitement, clapping his hands) Tai Chi? I've heard it's very powerful! But isn't it slow and gentle? Can it really defeat villains?",
        "textRu": "(eyes sparkling with excitement, clapping his hands) Tai Chi? I've heard it's very powerful! But isn't it slow and gentle? Can it really defeat villains?"
      },
      {
        "role": "npc",
        "textEn": "Yes, the most effective way to defeat a villain isn't about the speed but about the power of your skill",
        "textRu": "Yes, the most effective way to defeat a villain isn't about the speed but about the power of your skill"
      },
      {
        "role": "npc",
        "textEn": "(nodding eagerly, looking up with determination) That makes sense! I want to be strong enough to protect my mother and stand up to those bandits! Can we start today?",
        "textRu": "(nodding eagerly, looking up with determination) That makes sense! I want to be strong enough to protect my mother and stand up to those bandits! Can we start today?"
      },
      {
        "role": "npc",
        "textEn": "Absolutely",
        "textRu": "Absolutely"
      },
      {
        "role": "npc",
        "textEn": "(grinning widely, bouncing on his toes) Yay! Thank you, Wanderer! When do we start?",
        "textRu": "(grinning widely, bouncing on his toes) Yay! Thank you, Wanderer! When do we start?"
      },
      {
        "role": "npc",
        "textEn": "Right now. Prepare yourself, my student!",
        "textRu": "Right now. Prepare yourself, my student!"
      },
      {
        "role": "npc",
        "textEn": "(eyes sparkling with admiration) Wanderer is the best! One day, I'll be a hero too, just like you!Jin Xiaobao expresses gratitude and begins to ponder carefully.",
        "textRu": "(eyes sparkling with admiration) Wanderer is the best! One day, I'll be a hero too, just like you!Jin Xiaobao expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jing-chaoyang",
    "nameEn": "Jing Chaoyang",
    "nameRu": "Цзин Чаоян",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the second floor of the Revelry Hall. He can be seen looking у window.",
    "icon": "👤",
    "befriendGuide": "Listen to Jing Chaoyang's Stories and Give Him a Juicy Story\nTo befriend Jing Chaoyang, you only need to listen to what he has to say and then if he asks if you have a juicy story, share anything that you think are interesting.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(writing furiously) Oh-ho! This is gold! Every word-write it down, write it all down before it slips away!",
        "textRu": "(writing furiously) Oh-ho! This is gold! Every word-write it down, write it all down before it slips away!"
      },
      {
        "role": "npc",
        "textEn": "Oh, are you a journalist?",
        "textRu": "Oh, are you a journalist?"
      },
      {
        "role": "npc",
        "textEn": "(eyes gleaming) Fresh off the press, Wanderer! Listen close! Leng Dancui storms into Revelry Hall, not to punish the mistress-oh no-but to question her motives! (waves hand) Bah! It's just the usual lovers' spat between Leng Dancui and Fan Tong, but doesn't that sound scandalous?",
        "textRu": "(eyes gleaming) Fresh off the press, Wanderer! Listen close! Leng Dancui storms into Revelry Hall, not to punish the mistress-oh no-but to question her motives! (waves hand) Bah! It's just the usual lovers' spat between Leng Dancui and Fan Tong, but doesn't that sound scandalous?"
      },
      {
        "role": "player",
        "textEn": "well that's true. Romantic scandals usually draw in the crowd.",
        "textRu": "well that's true. Romantic scandals usually draw in the crowd."
      },
      {
        "role": "npc",
        "textEn": "(flipping pages eagerly) And there's more! Fan Tong rumored to join the Revelry Hall Management, trampling through Revelry Hall day after day like he owns the place! (leans in, voice rising) Truth is, he's just been hanging around too much lately, but doesn't that sound like a power grab?",
        "textRu": "(flipping pages eagerly) And there's more! Fan Tong rumored to join the Revelry Hall Management, trampling through Revelry Hall day after day like he owns the place! (leans in, voice rising) Truth is, he's just been hanging around too much lately, but doesn't that sound like a power grab?"
      },
      {
        "role": "npc",
        "textEn": "Yeah, I think you should write it down.",
        "textRu": "Yeah, I think you should write it down."
      },
      {
        "role": "npc",
        "textEn": "(reading with relish) Brace yourself! Gluttonous ghosts raid Revelry Hall! (drops to a whisper) Those Well of Heaven folks? Bottomless pits, every last one of them!",
        "textRu": "(reading with relish) Brace yourself! Gluttonous ghosts raid Revelry Hall! (drops to a whisper) Those Well of Heaven folks? Bottomless pits, every last one of them!"
      },
      {
        "role": "npc",
        "textEn": "Yeah !! Write it down !!",
        "textRu": "Yeah !! Write it down !!"
      },
      {
        "role": "npc",
        "textEn": "(snaps page) Shopkeeper Zhu from East City shedding hair like autumn leaves! So I wrote: 'Little Zhu sprouts a pig's head overnight!' Ha! Tell me that won't turn heads!",
        "textRu": "(snaps page) Shopkeeper Zhu from East City shedding hair like autumn leaves! So I wrote: 'Little Zhu sprouts a pig's head overnight!' Ha! Tell me that won't turn heads!"
      },
      {
        "role": "npc",
        "textEn": "(After that Jing Chaoyang was able to make a juicy story)",
        "textRu": "(After that Jing Chaoyang was able to make a juicy story)"
      },
      {
        "role": "npc",
        "textEn": "(eyes sparkling) And get this! Old Lady Yu from the eastern suburbs finds a match for her daughter-a fine young scholar! On proposal day, the illiterate old crone suddenly spouts poetry like a mad bard! Isn't that just the God of Literature hitching a ride?",
        "textRu": "(eyes sparkling) And get this! Old Lady Yu from the eastern suburbs finds a match for her daughter-a fine young scholar! On proposal day, the illiterate old crone suddenly spouts poetry like a mad bard! Isn't that just the God of Literature hitching a ride?"
      },
      {
        "role": "npc",
        "textEn": "True",
        "textRu": "True"
      },
      {
        "role": "npc",
        "textEn": "(voice climbing with excitement) A wanted rogue nabbed at last! Word is, to dodge the catchpoles, he kept changing disguises-turned from a ghastly freak into a dashing youth with eyes like stars! Imagine that ... beauty born of desperation!",
        "textRu": "(voice climbing with excitement) A wanted rogue nabbed at last! Word is, to dodge the catchpoles, he kept changing disguises-turned from a ghastly freak into a dashing youth with eyes like stars! Imagine that ... beauty born of desperation!"
      },
      {
        "role": "player",
        "textEn": "desperation can only get you so far",
        "textRu": "desperation can only get you so far"
      },
      {
        "role": "npc",
        "textEn": "(looks up, grinning) Heh! I'm a master of this craft, give me the dullest tale, and I'll twist it into a tempest! Wanderer, got any juicy tidbits? Hand them over, and I'll spin you a headline hotter than dragon's breath!",
        "textRu": "(looks up, grinning) Heh! I'm a master of this craft, give me the dullest tale, and I'll twist it into a tempest! Wanderer, got any juicy tidbits? Hand them over, and I'll spin you a headline hotter than dragon's breath!"
      },
      {
        "role": "player",
        "textEn": "(you gave a juicy story that would make him popular)",
        "textRu": "(you gave a juicy story that would make him popular)"
      },
      {
        "role": "npc",
        "textEn": "Heh! With tales like these, I'll have the whole town buzzing in no time! Now, tell me, Wanderer, what other secrets do you carry?",
        "textRu": "Heh! With tales like these, I'll have the whole town buzzing in no time! Now, tell me, Wanderer, what other secrets do you carry?"
      },
      {
        "role": "npc",
        "textEn": "You told about the one time you rode a dragon to the farthest cliffs of Kaifeng",
        "textRu": "You told about the one time you rode a dragon to the farthest cliffs of Kaifeng"
      },
      {
        "role": "npc",
        "textEn": "(raises eyebrow) Well, if that's the kind of tale you want, we'll have to weave some magic indeed! Let's write: Jing Chaoyang tames a dragon and rides to the farthest cliffs of Kaifeng, where the winds sing and dragons dance! How does that sound?",
        "textRu": "(raises eyebrow) Well, if that's the kind of tale you want, we'll have to weave some magic indeed! Let's write: Jing Chaoyang tames a dragon and rides to the farthest cliffs of Kaifeng, where the winds sing and dragons dance! How does that sound?"
      },
      {
        "role": "player",
        "textEn": "I like that title! Go publish it my friend",
        "textRu": "I like that title! Go publish it my friend"
      },
      {
        "role": "npc",
        "textEn": "(writing furiously) Ha! This is pure delight! I'll be off to eavesdrop in every corner ... these tales will fetch a handsome price!Jing Chaoyang keeps scribbling away, casually waving you off and saying to drop by anytime.",
        "textRu": "(writing furiously) Ha! This is pure delight! I'll be off to eavesdrop in every corner ... these tales will fetch a handsome price!Jing Chaoyang keeps scribbling away, casually waving you off and saying to drop by anytime."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jing-an",
    "nameEn": "Jing’an",
    "nameRu": "Jing’an",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Башня Мирного колокола",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him by following the road, where he находится in the middle of the fork. You can either go south от Porcelain Kiln Landmark or north from Deerforage Grove Landmark.",
    "icon": "👤",
    "befriendGuide": "Give Mushrooms and Listen to Jing'an's Story\nRoleplay giving mushrooms to Jing'an and he will bring up his daughter who passed away a long time ago. He will tell how he ate mushrooms that made him hallucinate his daughter. Keep listening to him and console him about his daughter's death.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(softly) To meet is fate. Benefactor, could you spare some colourful mushrooms for this humble monk?",
        "textRu": "(softly) To meet is fate. Benefactor, could you spare some colourful mushrooms for this humble monk?"
      },
      {
        "role": "player",
        "textEn": "I have the best kind of colourful mushrooms! You want some?",
        "textRu": "I have the best kind of colourful mushrooms! You want some?"
      },
      {
        "role": "npc",
        "textEn": "(gazes at the mushrooms with a distant look, voice low and wistful) Legend has it that these colourful mushrooms hold divine power-freeing the body's shell and letting the mind wander into realms of illusion.",
        "textRu": "(gazes at the mushrooms with a distant look, voice low and wistful) Legend has it that these colourful mushrooms hold divine power-freeing the body's shell and letting the mind wander into realms of illusion."
      },
      {
        "role": "npc",
        "textEn": "It is true! I was able to access its divine powers!!",
        "textRu": "It is true! I was able to access its divine powers!!"
      },
      {
        "role": "npc",
        "textEn": "(lowers his head, tone heavy with sorrow) Since my little girl passed away, this humble monk has lost all interest in worldly things ... so I sought refuge in the monastic path.",
        "textRu": "(lowers his head, tone heavy with sorrow) Since my little girl passed away, this humble monk has lost all interest in worldly things ... so I sought refuge in the monastic path."
      },
      {
        "role": "npc",
        "textEn": "Then do you still want some of this mushroom?",
        "textRu": "Then do you still want some of this mushroom?"
      },
      {
        "role": "npc",
        "textEn": "(closes his eyes briefly, voice trembling) Once, starving in the wilderness, I ate those colourful mushrooms. In the haze, I saw her again, clear as day. That was no illusion. My child looked at me, called to me ... her voice rang in my ears, her figure vivid before my eyes.",
        "textRu": "(closes his eyes briefly, voice trembling) Once, starving in the wilderness, I ate those colourful mushrooms. In the haze, I saw her again, clear as day. That was no illusion. My child looked at me, called to me ... her voice rang in my ears, her figure vivid before my eyes."
      },
      {
        "role": "player",
        "textEn": "I can give you some, as long as we become friends.",
        "textRu": "I can give you some, as long as we become friends."
      },
      {
        "role": "npc",
        "textEn": "(clasps his hands tightly, voice filled with yearning) From that moment, I couldn't find peace within. I long to experience those flavors again. My master says I am still bound by worldly attachments, lost in illusions, straying from the true Zen path. Yet how can I resist, when it means revisiting the cherished memories of my family once more?",
        "textRu": "(clasps his hands tightly, voice filled with yearning) From that moment, I couldn't find peace within. I long to experience those flavors again. My master says I am still bound by worldly attachments, lost in illusions, straying from the true Zen path. Yet how can I resist, when it means revisiting the cherished memories of my family once more?"
      },
      {
        "role": "npc",
        "textEn": "Why not I help you? I have seen a child whom has same characteristics as your daughter",
        "textRu": "Why not I help you? I have seen a child whom has same characteristics as your daughter"
      },
      {
        "role": "npc",
        "textEn": "(sighing) Since she left ... life is long and bitter ..",
        "textRu": "(sighing) Since she left ... life is long and bitter .."
      },
      {
        "role": "npc",
        "textEn": "(her daughter appeared and hug her)",
        "textRu": "(her daughter appeared and hug her)"
      },
      {
        "role": "npc",
        "textEn": "(lowering his head) This humble monk spoke too much in a moment of weakness. This humble monk cannot find the way to the Grand Imperial Temple, cannot achieve enlightenment, and has lost his daughter, with no path back to the mundane world. Shameful ... truly shameful.Jing'an mumbles something indistinct and slowly walks away.",
        "textRu": "(lowering his head) This humble monk spoke too much in a moment of weakness. This humble monk cannot find the way to the Grand Imperial Temple, cannot achieve enlightenment, and has lost his daughter, with no path back to the mundane world. Shameful ... truly shameful.Jing'an mumbles something indistinct and slowly walks away."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "jingyi",
    "nameEn": "Jingyi",
    "nameRu": "Цзиньи",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Пик Ореола",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen standing рядом с path севернее Пик Ореола Landmark",
    "icon": "👤",
    "befriendGuide": "Offer Peace Talks as a Solution\nJingyi has problems with the bandits and wants a solution to this problem. Let him know that a peaceful conversation with the bandits might work and that the bandits have their own reasons on why they are doing their crime. This is one way to make Jingyi friendly with you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(puts palms together, brows furrowed in self-reproach) It seems this is a destined trial ... surely the Buddha is testing this humble monk through this hardship.",
        "textRu": "(puts palms together, brows furrowed in self-reproach) It seems this is a destined trial ... surely the Buddha is testing this humble monk through this hardship."
      },
      {
        "role": "npc",
        "textEn": "What troubles you friend?",
        "textRu": "What troubles you friend?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, eyes cast downward) Benefactor, this humble monk has faced a great trial. While returning from a pilgrimage for alms, I discovered that bandits have taken control of the mountain path. Their presence makes it impossible to continue my journey without conflict, and yet I possess no martial skills to confront them. It is as if the Buddha has placed this obstacle before me to test my resolve and faith.",
        "textRu": "(sighs deeply, eyes cast downward) Benefactor, this humble monk has faced a great trial. While returning from a pilgrimage for alms, I discovered that bandits have taken control of the mountain path. Their presence makes it impossible to continue my journey without conflict, and yet I possess no martial skills to confront them. It is as if the Buddha has placed this obstacle before me to test my resolve and faith."
      },
      {
        "role": "player",
        "textEn": "then let me help you (you drove the bandits off the mountain path and returned quickly to Jingyi)",
        "textRu": "then let me help you (you drove the bandits off the mountain path and returned quickly to Jingyi)"
      },
      {
        "role": "npc",
        "textEn": "(steps back, expression firm and resolute) Benefactor, while your intentions are noble, such worldly means cannot resolve a test given by the Buddha. This humble monk must face this challenge on his own to grow in wisdom and courage. I appreciate your offer, but I must decline.",
        "textRu": "(steps back, expression firm and resolute) Benefactor, while your intentions are noble, such worldly means cannot resolve a test given by the Buddha. This humble monk must face this challenge on his own to grow in wisdom and courage. I appreciate your offer, but I must decline."
      },
      {
        "role": "player",
        "textEn": "(you let him remember than he was the one that drove them out using peaceful talks about life)",
        "textRu": "(you let him remember than he was the one that drove them out using peaceful talks about life)"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, intrigued) Peaceful talks, you say? That is indeed a wise approach. Master Xuanzang often resolved conflicts through wisdom and compassion rather than force. Perhaps this humble monk can learn from his example. Could you share more about how such talks might work in this situation?",
        "textRu": "(raises an eyebrow, intrigued) Peaceful talks, you say? That is indeed a wise approach. Master Xuanzang often resolved conflicts through wisdom and compassion rather than force. Perhaps this humble monk can learn from his example. Could you share more about how such talks might work in this situation?"
      },
      {
        "role": "player",
        "textEn": "(you explained that not all bandits want to fight and each have their own reason for them doing bad things)",
        "textRu": "(you explained that not all bandits want to fight and each have their own reason for them doing bad things)"
      },
      {
        "role": "npc",
        "textEn": "(puts palms together, expression solemn yet resolute) Thank you, Benefactor, for your guidance. This humble monk will take Master Xuanzang as his model and ascend the peak with courage. If fate allows, I shall repay your kindness one day.Jingyi expresses gratitude and begins to ponder deeply.",
        "textRu": "(puts palms together, expression solemn yet resolute) Thank you, Benefactor, for your guidance. This humble monk will take Master Xuanzang as his model and ascend the peak with courage. If fate allows, I shall repay your kindness one day.Jingyi expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "kang-bao",
    "nameEn": "Kang Bao",
    "nameRu": "Кан Бао",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Пески Блуждающего скакуна",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Kang Bao находится рядом с Peaceward Camp boundary stone in Пески Блуждающего скакуна.",
    "icon": "👤",
    "befriendGuide": "Guess the Right Price for Her Goods\nIt is said Kang Bao only sells to people who can guess the right price for her goods. If your guess matches her spirit, she'll sell to you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(smiling broadly) Well now... what wind blows the Wanderer here? I've just got fresh Rosycloud Dye Powder, and there's a promotion: 10.000 Coins for two. Care for a look?",
        "textRu": "(smiling broadly) Well now... what wind blows the Wanderer here? I've just got fresh Rosycloud Dye Powder, and there's a promotion: 10.000 Coins for two. Care for a look?"
      },
      {
        "role": "npc",
        "textEn": "Sure, may I see the rosycloud dye powder?",
        "textRu": "Sure, may I see the rosycloud dye powder?"
      },
      {
        "role": "npc",
        "textEn": "(nodding, gesturing to a shelf with a small, ornate container) Of course, Wanderer- Here it is, top-quality Rosycloud Dye Powder. The color is vibrant and lasting, perfect for any garment. What do you think?",
        "textRu": "(nodding, gesturing to a shelf with a small, ornate container) Of course, Wanderer- Here it is, top-quality Rosycloud Dye Powder. The color is vibrant and lasting, perfect for any garment. What do you think?"
      },
      {
        "role": "npc",
        "textEn": "It's very vibrant, perfect for my garments.",
        "textRu": "It's very vibrant, perfect for my garments."
      },
      {
        "role": "npc",
        "textEn": "(smiling wider, eyes sparkling) I'm glad you like it! This powder is a cut above the rest. It's 10,000 Coins for one jar, and I can assure you it's worth every coin.",
        "textRu": "(smiling wider, eyes sparkling) I'm glad you like it! This powder is a cut above the rest. It's 10,000 Coins for one jar, and I can assure you it's worth every coin."
      },
      {
        "role": "npc",
        "textEn": "Sure (give 10,000 coins)",
        "textRu": "Sure (give 10,000 coins)"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up, beaming smile) Oh my goodness! What a generous guest! Handsome offer, swift decision, truly an honored patron– You won't go back on it, right? Agreed at 10,000! (carefully counts the coins, then hands over the container) Thank you, Wanderer! If you need anything else, just let me know.",
        "textRu": "(eyes lighting up, beaming smile) Oh my goodness! What a generous guest! Handsome offer, swift decision, truly an honored patron– You won't go back on it, right? Agreed at 10,000! (carefully counts the coins, then hands over the container) Thank you, Wanderer! If you need anything else, just let me know."
      },
      {
        "role": "npc",
        "textEn": "Do you still have anything else to sell?",
        "textRu": "Do you still have anything else to sell?"
      },
      {
        "role": "npc",
        "textEn": "(rubbing her hands together, smiling warmly) Certainly, Wanderer. I've got a variety of goods, from fine silks to sturdy travel gear. What are you looking for today?",
        "textRu": "(rubbing her hands together, smiling warmly) Certainly, Wanderer. I've got a variety of goods, from fine silks to sturdy travel gear. What are you looking for today?"
      },
      {
        "role": "npc",
        "textEn": "Fine silks please",
        "textRu": "Fine silks please"
      },
      {
        "role": "npc",
        "textEn": "(clears throat, tone hardens) Wanderer, the price is 10,000 Coins for two Rosycloud Dye Powder—will you take it or not?",
        "textRu": "(clears throat, tone hardens) Wanderer, the price is 10,000 Coins for two Rosycloud Dye Powder—will you take it or not?"
      },
      {
        "role": "npc",
        "textEn": "Kang Bao relunctantly hands over the goods.",
        "textRu": "Kang Bao relunctantly hands over the goods."
      },
      {
        "role": "npc",
        "textEn": "Select Bonus (Coin 10000) when prompted.",
        "textRu": "Select Bonus (Coin 10000) when prompted."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "kid-wei",
    "nameEn": "Kid Wei",
    "nameRu": "Малыш Вэй",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Забытый перекрёсток",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Kid Wei можно найти on a cliff рядом с large broken ship восточнее the Karez boundary stone in Забытый перекрёсток.",
    "icon": "👤",
    "befriendGuide": "Help Him Enjoy Being Young Again\nKid Wei acts way too mature for a child. Help him enjoy being young agian. Rumor has it that he loves martial arts, yummy snacks, and fun stuff.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(hands behind back, shaking head slightly) Alas... youngsters these days have no idea what true sorrow is. Those little kids only know how to play all day. They should read more books like I do. Anyway! A beggar uncle just gave me a secret manual; inside is a palm technique that descends from the heavens. Real kung fu. Want to see it?",
        "textRu": "(hands behind back, shaking head slightly) Alas... youngsters these days have no idea what true sorrow is. Those little kids only know how to play all day. They should read more books like I do. Anyway! A beggar uncle just gave me a secret manual; inside is a palm technique that descends from the heavens. Real kung fu. Want to see it?"
      },
      {
        "role": "npc",
        "textEn": "Secret manua, real kung fu?",
        "textRu": "Secret manua, real kung fu?"
      },
      {
        "role": "npc",
        "textEn": "(nods, trying very hard to look profound) As expected, adults can actually hold a proper conversation. I really can't chat with children at all. Tell me, what martial arts are you best at? We can exchange insights. (smiles while still keeping a stiff, serious pose)",
        "textRu": "(nods, trying very hard to look profound) As expected, adults can actually hold a proper conversation. I really can't chat with children at all. Tell me, what martial arts are you best at? We can exchange insights. (smiles while still keeping a stiff, serious pose)"
      },
      {
        "role": "npc",
        "textEn": "Martial arts?",
        "textRu": "Martial arts?"
      },
      {
        "role": "npc",
        "textEn": "(frowns slightly, still trying to maintain a serious demeanor) Yes, martial arts! The skills that allow one to protect oneself and others. What kind of techniques do you know? We can share our knowledge. (taps foot impatiently)",
        "textRu": "(frowns slightly, still trying to maintain a serious demeanor) Yes, martial arts! The skills that allow one to protect oneself and others. What kind of techniques do you know? We can share our knowledge. (taps foot impatiently)"
      },
      {
        "role": "npc",
        "textEn": "Way of the open hands.",
        "textRu": "Way of the open hands."
      },
      {
        "role": "npc",
        "textEn": "(eyes light up, but quickly compose himself) Ah, the way of the open hands! That sounds quite profound. I've read about that in some ancient texts. Show me a move, and I'll see if it's as impressive as they say. (waves hand dismissively)",
        "textRu": "(eyes light up, but quickly compose himself) Ah, the way of the open hands! That sounds quite profound. I've read about that in some ancient texts. Show me a move, and I'll see if it's as impressive as they say. (waves hand dismissively)"
      },
      {
        "role": "npc",
        "textEn": "(punch air with slow motion) way of the open hands.",
        "textRu": "(punch air with slow motion) way of the open hands."
      },
      {
        "role": "npc",
        "textEn": "(tries to act cool but the excitement shows) Go on—show me a move first. Then I'll believe you~",
        "textRu": "(tries to act cool but the excitement shows) Go on—show me a move first. Then I'll believe you~"
      },
      {
        "role": "npc",
        "textEn": "(Punch air again)",
        "textRu": "(Punch air again)"
      },
      {
        "role": "npc",
        "textEn": "(tries to act cool but the excitement shows) Go on—show me a move first. Then I'll believe you~",
        "textRu": "(tries to act cool but the excitement shows) Go on—show me a move first. Then I'll believe you~"
      },
      {
        "role": "npc",
        "textEn": "Here's the secret manual for Way of the Open Hands (gives Kid Wei the manual).",
        "textRu": "Here's the secret manual for Way of the Open Hands (gives Kid Wei the manual)."
      },
      {
        "role": "npc",
        "textEn": "(eyes light up; quickly coughs twice to look composed) You're... really giving it to me? Well, I'm not that eager, but since you insist, it would be rude not to accept.",
        "textRu": "(eyes light up; quickly coughs twice to look composed) You're... really giving it to me? Well, I'm not that eager, but since you insist, it would be rude not to accept."
      },
      {
        "role": "npc",
        "textEn": "Give Kid Wei Bamboo when prompted to give.",
        "textRu": "Give Kid Wei Bamboo when prompted to give."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "lan-huahua",
    "nameEn": "Lan Huahua",
    "nameRu": "Лань Хуахуа",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Move right от Stillslope Landmark and you will see her dancing near a rock.",
    "icon": "👤",
    "befriendGuide": "Give Lan Huahua Lots of Food\nRoleplay into giving Lan Huahua lots of food in order to befriend her quickly.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(with bright eyes, voice full of curiosity) Wanderer, do you know where I can find some sweet wild fruits?",
        "textRu": "(with bright eyes, voice full of curiosity) Wanderer, do you know where I can find some sweet wild fruits?"
      },
      {
        "role": "npc",
        "textEn": "You seem hungry little girl? Want me to give you some food?",
        "textRu": "You seem hungry little girl? Want me to give you some food?"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen, voice hopeful) Yes, Wanderer! We haven't had a proper meal in days. Any food would help us so much! Thank you!",
        "textRu": "(eyes widen, voice hopeful) Yes, Wanderer! We haven't had a proper meal in days. Any food would help us so much! Thank you!"
      },
      {
        "role": "player",
        "textEn": "(You give her a lot of food that could help you survive for a year.)",
        "textRu": "(You give her a lot of food that could help you survive for a year.)"
      },
      {
        "role": "npc",
        "textEn": "(overjoyed, eyes sparkling) Wanderer, you truly are kind and upright! I'll never forget your kindness ... I'll repay you one day!Lan Huahua expresses gratitude and begins to ponder deeply.",
        "textRu": "(overjoyed, eyes sparkling) Wanderer, you truly are kind and upright! I'll never forget your kindness ... I'll repay you one day!Lan Huahua expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "leng-dancui",
    "nameEn": "Leng Dancui",
    "nameRu": "Лэн Даньцуй",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her on the second floor of the Revelry Hall. She can be seen eating in a private room.",
    "icon": "👤",
    "befriendGuide": "Learn More About Leng Dancui's Husband\nTalk to Leng Dancui and ask her about her husband. Tell her to be a bit stricter with him, and that the couple are two sides of the same coin. Roleplay that you are having a good time talking to Leng Dancui to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(crosses her arms, gaze sharp with boredom) Doesn't he realize how childish this is? Honestly ... and here I thought he was having an affair. Turns out it's just this nonsense? Wisdom has been chasing him, but clearly, he outran it.",
        "textRu": "(crosses her arms, gaze sharp with boredom) Doesn't he realize how childish this is? Honestly ... and here I thought he was having an affair. Turns out it's just this nonsense? Wisdom has been chasing him, but clearly, he outran it."
      },
      {
        "role": "npc",
        "textEn": "Please tell me more about your husband",
        "textRu": "Please tell me more about your husband"
      },
      {
        "role": "npc",
        "textEn": "(leans back, tapping her fingers on the armrest) Fan Tong, ah ... where do I begin? We grew up together, and he's always been quite attached to me. He's not particularly skilled at anything, but he's incredibly devoted. He tries to manage the household by giving everything over to me-money, treasures, you name it. I suppose his intentions are good, even if his methods are a bit ... unconventional.",
        "textRu": "(leans back, tapping her fingers on the armrest) Fan Tong, ah ... where do I begin? We grew up together, and he's always been quite attached to me. He's not particularly skilled at anything, but he's incredibly devoted. He tries to manage the household by giving everything over to me-money, treasures, you name it. I suppose his intentions are good, even if his methods are a bit ... unconventional."
      },
      {
        "role": "player",
        "textEn": "tell me more about his unconventional methods",
        "textRu": "tell me more about his unconventional methods"
      },
      {
        "role": "npc",
        "textEn": "(lets out a sharp sigh, tapping her fingers against the table) What trick is Fan Tong up to this time?",
        "textRu": "(lets out a sharp sigh, tapping her fingers against the table) What trick is Fan Tong up to this time?"
      },
      {
        "role": "player",
        "textEn": "(You told him that Fan Tong is sleeping in the hallway)",
        "textRu": "(You told him that Fan Tong is sleeping in the hallway)"
      },
      {
        "role": "npc",
        "textEn": "(sighs, rolling her eyes) Yes, I told him that Fan Tong is sleeping in the hallway. He must have done something particularly vexing again. (pauses, tapping her chin) Though honestly, it's more amusing than anything. He's so predictable, yet he never learns. (smiles faintly) Maybe that's part of why I tolerate him despite his antics.",
        "textRu": "(sighs, rolling her eyes) Yes, I told him that Fan Tong is sleeping in the hallway. He must have done something particularly vexing again. (pauses, tapping her chin) Though honestly, it's more amusing than anything. He's so predictable, yet he never learns. (smiles faintly) Maybe that's part of why I tolerate him despite his antics."
      },
      {
        "role": "npc",
        "textEn": "Maybe you should be stricter with him. It could lessen your anxiety and give you peace",
        "textRu": "Maybe you should be stricter with him. It could lessen your anxiety and give you peace"
      },
      {
        "role": "npc",
        "textEn": "(nods, considering) Perhaps you're right. Being stricter might teach him a lesson. But then again, part of me enjoys the simplicity of our dynamic. (smirks) Besides, where would the fun be if he didn't provide some entertainment? Still, I'Il think about it. Thanks for the advice, Wanderer.",
        "textRu": "(nods, considering) Perhaps you're right. Being stricter might teach him a lesson. But then again, part of me enjoys the simplicity of our dynamic. (smirks) Besides, where would the fun be if he didn't provide some entertainment? Still, I'Il think about it. Thanks for the advice, Wanderer."
      },
      {
        "role": "npc",
        "textEn": "(Leng Dancui talked about her life with her husband and we became friends)",
        "textRu": "(Leng Dancui talked about her life with her husband and we became friends)"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, smiling faintly) Ah, I see. Talking about our lives has brought us closer. (leans back in her chair, crossing her legs) It's true that sharing stories can forge bonds. I suppose there's something to be said for mutual understanding. (gazes thoughtfully) Well, Wanderer, consider us friends then. What do you think of the peculiarities of my life with Fan Tong? Any advice or thoughts?",
        "textRu": "(raises an eyebrow, smiling faintly) Ah, I see. Talking about our lives has brought us closer. (leans back in her chair, crossing her legs) It's true that sharing stories can forge bonds. I suppose there's something to be said for mutual understanding. (gazes thoughtfully) Well, Wanderer, consider us friends then. What do you think of the peculiarities of my life with Fan Tong? Any advice or thoughts?"
      },
      {
        "role": "player",
        "textEn": "(You explained that they are two sides of the same coin.)",
        "textRu": "(You explained that they are two sides of the same coin.)"
      },
      {
        "role": "npc",
        "textEn": "(nods, her expression becoming more serious) Two sides of the same coin, you say? (thinks for a moment) There's wisdom in that. Despite our differences, we do complement each other in odd ways. He provides the chaos, and I bring the order. (smiles wistfully) It's a delicate balance, but perhaps that's what makes it work. Thank you for seeing it that way, Wanderer. It gives me some comfort to know our bond has depth beyond mere familiarity.",
        "textRu": "(nods, her expression becoming more serious) Two sides of the same coin, you say? (thinks for a moment) There's wisdom in that. Despite our differences, we do complement each other in odd ways. He provides the chaos, and I bring the order. (smiles wistfully) It's a delicate balance, but perhaps that's what makes it work. Thank you for seeing it that way, Wanderer. It gives me some comfort to know our bond has depth beyond mere familiarity."
      },
      {
        "role": "npc",
        "textEn": "(Leng was happy)",
        "textRu": "(Leng was happy)"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, her eyes softening) Happy? Yes, I suppose I am. (looks down, a gentle expression on her face) It's rare for someone to understand the complexities of our relationship. Your insight is refreshing. (meets your gaze) Thank you, Wanderer. It's nice to have a friend who sees beyond the surface. What else would you like to know about my life with Fan Tong?",
        "textRu": "(smiles warmly, her eyes softening) Happy? Yes, I suppose I am. (looks down, a gentle expression on her face) It's rare for someone to understand the complexities of our relationship. Your insight is refreshing. (meets your gaze) Thank you, Wanderer. It's nice to have a friend who sees beyond the surface. What else would you like to know about my life with Fan Tong?"
      },
      {
        "role": "player",
        "textEn": "(You had a good time with Leng Dancui)",
        "textRu": "(You had a good time with Leng Dancui)"
      },
      {
        "role": "npc",
        "textEn": "(pauses mid-thought, then suddenly snaps her fan shut, a spark of annoyance flashing in her eyes) You know what-this reminds me! That Fan Tong ... I'm confiscating all his storybooks! Reading those ridiculous tales all day has turned his brain even sillier! Leng Dancui stares at Fan Tong, clearly debating whether to hit him again.",
        "textRu": "(pauses mid-thought, then suddenly snaps her fan shut, a spark of annoyance flashing in her eyes) You know what-this reminds me! That Fan Tong ... I'm confiscating all his storybooks! Reading those ridiculous tales all day has turned his brain even sillier! Leng Dancui stares at Fan Tong, clearly debating whether to hit him again."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "li-daniu",
    "nameEn": "Li Daniu",
    "nameRu": "Ли Данью",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Склон Боевого гребня",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Li Daniu can be seen chopping trees рядом с road of Battlecrest Scope and к севернее Starfall Spring Boundary Stone",
    "icon": "👤",
    "befriendGuide": "Tell Li Daniu You Know Tai Chi\nConvincing Li Daniu that you can cut trees with a single palm strike is easy, as you only need to mention you know Tai Chi and roleplay using it to cut down a tree.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(picks up his axe, wipes sweat from his brow) Sigh .. chopping down so many trees is exhausting. Wanderer, have you ever heard of a martial art that can break a big tree with just one palm strike?",
        "textRu": "(picks up his axe, wipes sweat from his brow) Sigh .. chopping down so many trees is exhausting. Wanderer, have you ever heard of a martial art that can break a big tree with just one palm strike?"
      },
      {
        "role": "player",
        "textEn": "I learned Tai Chi so I can help you chop down this tree.",
        "textRu": "I learned Tai Chi so I can help you chop down this tree."
      },
      {
        "role": "npc",
        "textEn": "(eyes light up with curiosity) Really? Tai Chi can do that? Show me! If it works, I'll owe you a favor for sure!",
        "textRu": "(eyes light up with curiosity) Really? Tai Chi can do that? Show me! If it works, I'll owe you a favor for sure!"
      },
      {
        "role": "player",
        "textEn": "uses Tai Chi to cut down the tree There, the tree is cut",
        "textRu": "uses Tai Chi to cut down the tree There, the tree is cut"
      },
      {
        "role": "npc",
        "textEn": "(eyes shining with excitement) Thank you, Wanderer! I'll keep an open mind and practice this unique skill with all my heart!Li Daniu expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes shining with excitement) Thank you, Wanderer! I'll keep an open mind and practice this unique skill with all my heart!Li Daniu expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "li-laizuo",
    "nameEn": "Li Laizuo",
    "nameRu": "Ли Лаизо",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Li Laizuo можно найти with a group of subornidates next к general's shrine in the compound.",
    "icon": "👤",
    "befriendGuide": "Force Him to Follow Your Orders\nLi Laizuo is one of the trickier AI NPCs to befriend because the requirement for success is very specific. As the game specifies, you must pose as a leader of his order and turn the tables on him, by forcing him to follow orders which were not his idea.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(indignantly) Leadership says quick wins secure progress and vision drives execution, yet these subordinates keep missing the mark! I provide the strategy, the direction, the guiding hand—so why can't they rise to meet the deliverables and reflect our shared success?",
        "textRu": "(indignantly) Leadership says quick wins secure progress and vision drives execution, yet these subordinates keep missing the mark! I provide the strategy, the direction, the guiding hand—so why can't they rise to meet the deliverables and reflect our shared success?"
      },
      {
        "role": "player",
        "textEn": "I am the Leader of the Aureate Guild.",
        "textRu": "I am the Leader of the Aureate Guild."
      },
      {
        "role": "npc",
        "textEn": "Ah, the esteemed Leader of the Aureate Guild! It is an honor. Our team here in Qinghe thrives under my strategic guidance. Vision drives results, after all. What brings you to our humble abode today?",
        "textRu": "Ah, the esteemed Leader of the Aureate Guild! It is an honor. Our team here in Qinghe thrives under my strategic guidance. Vision drives results, after all. What brings you to our humble abode today?"
      },
      {
        "role": "player",
        "textEn": "Your subordinates need to work harder. I order you to increase their shifts.",
        "textRu": "Your subordinates need to work harder. I order you to increase their shifts."
      },
      {
        "role": "npc",
        "textEn": "(clearing throat, nodding) Indeed, pressure creates strength. I shall redouble my efforts to inspire them. Their commitment must align with our noble goals.",
        "textRu": "(clearing throat, nodding) Indeed, pressure creates strength. I shall redouble my efforts to inspire them. Their commitment must align with our noble goals."
      },
      {
        "role": "player",
        "textEn": "You must make a new rule that from tomorrow, each member will work extra shifts for no extra pay.",
        "textRu": "You must make a new rule that from tomorrow, each member will work extra shifts for no extra pay."
      },
      {
        "role": "npc",
        "textEn": "(thoughtfully, masking emotions) Hmmm... understood. I'll recalibrate my vision and refine the framework when the moment aligns with progress.Li Laizuo seems lost in thought.",
        "textRu": "(thoughtfully, masking emotions) Hmmm... understood. I'll recalibrate my vision and refine the framework when the moment aligns with progress.Li Laizuo seems lost in thought."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "li-shaokui",
    "nameEn": "Li Shaokui",
    "nameRu": "Ли Шаокуй",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Склон Боевого гребня",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Li Shaokui находится у front of a destroyed shack к northвосточнее Starfall Spring Boundary Stone",
    "icon": "👤",
    "befriendGuide": "Recommend Feigning Weakness\nLi Shaokui wants to take back the Tang Family's property by taking out the bandits with a carefully thought out plan. Recommend feigning weakness in front of the bandits, then strike them down when their guards are down. After recommending feigning weakness, recommend going to the old bridge where the bandits' caravan pass to lay our trap.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(frowning, voice heavy with concern) Wanderer, did you know? A few days ago, the Tang family was robbed by bandits. Now they're begging on the streets .. it truly pains the heart! If we're to strike back, we must be two steps ahead of those bandits.",
        "textRu": "(frowning, voice heavy with concern) Wanderer, did you know? A few days ago, the Tang family was robbed by bandits. Now they're begging on the streets .. it truly pains the heart! If we're to strike back, we must be two steps ahead of those bandits."
      },
      {
        "role": "player",
        "textEn": "We can feign weakness to lure them onto us and to drop their guards down",
        "textRu": "We can feign weakness to lure them onto us and to drop their guards down"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughttully, eyes narrowing) That's a clever idea, Wanderer. Feigning weakness could indeed make them lower their guard. But we need more than just a plan; we need precise timing and coordination. When do you think would be the best moment to strike?",
        "textRu": "(nodding thoughttully, eyes narrowing) That's a clever idea, Wanderer. Feigning weakness could indeed make them lower their guard. But we need more than just a plan; we need precise timing and coordination. When do you think would be the best moment to strike?"
      },
      {
        "role": "npc",
        "textEn": "Let's meet at the old bridge where their caravans pass for our trap",
        "textRu": "Let's meet at the old bridge where their caravans pass for our trap"
      },
      {
        "role": "npc",
        "textEn": "(smiling, clenching his fist in agreement) An excellent choice, Wanderer! The old bridge is a narrow passage. It'll be perfect for sctting up an ambush. We should gather some local support to ensure our plan goes smoothly.",
        "textRu": "(smiling, clenching his fist in agreement) An excellent choice, Wanderer! The old bridge is a narrow passage. It'll be perfect for sctting up an ambush. We should gather some local support to ensure our plan goes smoothly."
      },
      {
        "role": "npc",
        "textEn": "Very well. Let us go",
        "textRu": "Very well. Let us go"
      },
      {
        "role": "npc",
        "textEn": "(eyes shining with resolve) Wanderer, your words are wise! With our hearts and minds united, we'll surely outwit those bandits and reclaim the Tang tamily's property!Li Shaokui expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes shining with resolve) Wanderer, your words are wise! With our hearts and minds united, we'll surely outwit those bandits and reclaim the Tang tamily's property!Li Shaokui expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "li-youxin",
    "nameEn": "Li Youxin",
    "nameRu": "Ли Юсинь",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him рядом с Бархатная тень Landmark, where he can be seen рядом с docks.",
    "icon": "👤",
    "befriendGuide": "Emphasize How Poor You Are\nLi Youxin will ask questions on how the common folk live, what your house is made of, what do you do and many more. Give an answer that will emphasize how poor you are.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs, fingers idly tracing the gold inlay on his sleeve) I've grown weary of this life, Wanderer. Tell me, how do you common folk live?",
        "textRu": "(sighs, fingers idly tracing the gold inlay on his sleeve) I've grown weary of this life, Wanderer. Tell me, how do you common folk live?"
      },
      {
        "role": "player",
        "textEn": "We live in small huts and little grains of rice",
        "textRu": "We live in small huts and little grains of rice"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, eyes reflecting the pond) Huts and simple grains, hmm? I've heard of such places but never seen them. My meals are served on plates of gold and silver, adorned with precious jewels. Yet, they lack the warmth of a humble home. What else do you eat besides rice?",
        "textRu": "(nods slowly, eyes reflecting the pond) Huts and simple grains, hmm? I've heard of such places but never seen them. My meals are served on plates of gold and silver, adorned with precious jewels. Yet, they lack the warmth of a humble home. What else do you eat besides rice?"
      },
      {
        "role": "player",
        "textEn": "(You told him that its what we only eat since we cant afford anything else)",
        "textRu": "(You told him that its what we only eat since we cant afford anything else)"
      },
      {
        "role": "npc",
        "textEn": "(frowns slightly, running a hand over the intricate embroidery on his robe) I see. Only rice ... My table is laden with delicacies from far and wide, yet none of it brings the satisfaction you speak of. Tell me more about your home. Are your walls made of mud and straw?",
        "textRu": "(frowns slightly, running a hand over the intricate embroidery on his robe) I see. Only rice ... My table is laden with delicacies from far and wide, yet none of it brings the satisfaction you speak of. Tell me more about your home. Are your walls made of mud and straw?"
      },
      {
        "role": "npc",
        "textEn": "Its made of toothpicks and glue",
        "textRu": "Its made of toothpicks and glue"
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, shaking his head) Toothpicks and glue? That sounds quite fragile. My home is built with the finest stones and woods, adorned with gold and silver. But perhaps it's the simplicity that gives strength to your walls. What do you do for fun in your village?",
        "textRu": "(smiles faintly, shaking his head) Toothpicks and glue? That sounds quite fragile. My home is built with the finest stones and woods, adorned with gold and silver. But perhaps it's the simplicity that gives strength to your walls. What do you do for fun in your village?"
      },
      {
        "role": "player",
        "textEn": "We run around the village",
        "textRu": "We run around the village"
      },
      {
        "role": "npc",
        "textEn": "(leans forward slightly, eyes gleaming with interest) Running around the village, eh? I've never experienced such freedom. My outings are always in grand carriages, escorted by servants. It must feel incredibly liberating to run without constraint. Do you have any favorite games you play?",
        "textRu": "(leans forward slightly, eyes gleaming with interest) Running around the village, eh? I've never experienced such freedom. My outings are always in grand carriages, escorted by servants. It must feel incredibly liberating to run without constraint. Do you have any favorite games you play?"
      },
      {
        "role": "player",
        "textEn": "no we are too poor to experience such luxury",
        "textRu": "no we are too poor to experience such luxury"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, resting his chin on his hand) I understand, Poverty must make even the simplest pleasures difficult to find. In my household, we have games played with jade pieces and golden arrows, but they lack the genuine joy you describe. What do you do during your idle moments?",
        "textRu": "(sighs deeply, resting his chin on his hand) I understand, Poverty must make even the simplest pleasures difficult to find. In my household, we have games played with jade pieces and golden arrows, but they lack the genuine joy you describe. What do you do during your idle moments?"
      },
      {
        "role": "player",
        "textEn": "none we dont have any luxury",
        "textRu": "none we dont have any luxury"
      },
      {
        "role": "npc",
        "textEn": "(gazes at the pond, voice soft as he adjusts a pearl-inlaid hairpin on his robe) Wanderer, it seems your life has its hardships and its joys. In truth, isn't life's journey all about experience? Money-you can't bring it when you're born, and you can't take it when you die. Sometimes I feel that wealth has stolen many experiences from me. In my next life, I don't wish for riches ... only for love.Li Youxin sighs, \"In my next life, I don't",
        "textRu": "(gazes at the pond, voice soft as he adjusts a pearl-inlaid hairpin on his robe) Wanderer, it seems your life has its hardships and its joys. In truth, isn't life's journey all about experience? Money-you can't bring it when you're born, and you can't take it when you die. Sometimes I feel that wealth has stolen many experiences from me. In my next life, I don't wish for riches ... only for love.Li Youxin sighs, \"In my next life, I don't"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "li-yueniang",
    "nameEn": "Li Yueniang",
    "nameRu": "Ли Юэнян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти her with her beloved Yu Songfeng рядом с ferry station entrance.",
    "icon": "👤",
    "befriendGuide": "Recommend Talking About Ships\nOne ways to gain the favor of Li Yueniang is to recommend talking about ships or why it was built to her beloved. You should also recommend talking about her beloved's liking to money and business, in which Li Yueniang might think it might not capture her beloved's spirit but will ask you if balancing the topics is a great idea. If she asks this, say that more options are good which might trigger her AI to befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(with a shy smile, eyes glancing toward the river) Wanderer, have you seen that magnificent ship? I hear Weiyang City spent a fortune to build it.",
        "textRu": "(with a shy smile, eyes glancing toward the river) Wanderer, have you seen that magnificent ship? I hear Weiyang City spent a fortune to build it."
      },
      {
        "role": "npc",
        "textEn": "What seems to be the problem?",
        "textRu": "What seems to be the problem?"
      },
      {
        "role": "npc",
        "textEn": "(slightly tilts her head, looking puzzled) Oh, nothing in particular. I was just admiring the ship and thinking about Yu Songfeng. He seemed very interested in it during our conversation. Do you think the ship could bring us closer?",
        "textRu": "(slightly tilts her head, looking puzzled) Oh, nothing in particular. I was just admiring the ship and thinking about Yu Songfeng. He seemed very interested in it during our conversation. Do you think the ship could bring us closer?"
      },
      {
        "role": "npc",
        "textEn": "If that is his interest, then talking about ships or why it was built can surely upbring the mood of your conversations.",
        "textRu": "If that is his interest, then talking about ships or why it was built can surely upbring the mood of your conversations."
      },
      {
        "role": "npc",
        "textEn": "(eyes light up, a hopeful smile forming) That's a wonderful idea! I could ask him about his thoughts on the ship's design and purpose. It would certainly make our discussions more engaging. Do you think delving into such topics might help me gain his favor?",
        "textRu": "(eyes light up, a hopeful smile forming) That's a wonderful idea! I could ask him about his thoughts on the ship's design and purpose. It would certainly make our discussions more engaging. Do you think delving into such topics might help me gain his favor?"
      },
      {
        "role": "npc",
        "textEn": "Yes of course it will! You should also try to ask about his love for money and business.",
        "textRu": "Yes of course it will! You should also try to ask about his love for money and business."
      },
      {
        "role": "npc",
        "textEn": "(smiles softly, but with a hint of hesitation) I see. While discussing his interests in ships and adventures sounds intriguing, perhaps focusing solely on money and business might not fully capture his spirit. Yu Songfeng seems to have a deep passion for exploration and new experiences. Maybe we should balance both topics?",
        "textRu": "(smiles softly, but with a hint of hesitation) I see. While discussing his interests in ships and adventures sounds intriguing, perhaps focusing solely on money and business might not fully capture his spirit. Yu Songfeng seems to have a deep passion for exploration and new experiences. Maybe we should balance both topics?"
      },
      {
        "role": "npc",
        "textEn": "Of course! More options to choose from.",
        "textRu": "Of course! More options to choose from."
      },
      {
        "role": "npc",
        "textEn": "(eyes flickering, cheeks flushed) What you've said, Wanderer, is absolutely right. I'll remember it well-and do everything I can to win Songfeng's heart.Li Yueniang expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes flickering, cheeks flushed) What you've said, Wanderer, is absolutely right. I'll remember it well-and do everything I can to win Songfeng's heart.Li Yueniang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "li-yuerong",
    "nameEn": "Li Yuerong",
    "nameRu": "Ли Юэрон",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her рядом с Бархатная тень Landmark, where she can be seen outside an antique shop.",
    "icon": "👤",
    "befriendGuide": "Convince Li Yuerong to Talk to Her Husband\nRecommend to Li Yuerong that she should talk to her husband to allow her to make herself beautiful and that if the husband loves her, he would let her do what she enjoys. Keep roleplaying that the couple talked to each other and some time has passed in order for her to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs softly while delicately applying makeup) Wanderer, they say a woman adorns herself for the one who truly appreciates her ... but why can't my husband understand that?",
        "textRu": "(sighs softly while delicately applying makeup) Wanderer, they say a woman adorns herself for the one who truly appreciates her ... but why can't my husband understand that?"
      },
      {
        "role": "npc",
        "textEn": "It seems your husband is jealous that you might leave him if you make yourself look beautiful all the time",
        "textRu": "It seems your husband is jealous that you might leave him if you make yourself look beautiful all the time"
      },
      {
        "role": "npc",
        "textEn": "(looks at you with a mix of frustration and sadness, hands pausing mid-air) Jealous? That's not fair! I'm just trying to feel good about myself. It's not like I'm doing it to attract someone else. Why would he think that way? (resumes applying makeup, her fingers moving gracefully) Sometimes, I just wish he could see how much joy it brings me.",
        "textRu": "(looks at you with a mix of frustration and sadness, hands pausing mid-air) Jealous? That's not fair! I'm just trying to feel good about myself. It's not like I'm doing it to attract someone else. Why would he think that way? (resumes applying makeup, her fingers moving gracefully) Sometimes, I just wish he could see how much joy it brings me."
      },
      {
        "role": "player",
        "textEn": "(you explained to her that she should talk with his husband about this.)",
        "textRu": "(you explained to her that she should talk with his husband about this.)"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, a thoughtful expression on her face) You're right, Wanderer. Perhaps I should try to have a heart-to -heart with him. Explain why it means so much to me. But ... (pauses, fidgeting slightly) ... what if he still doesn't understand? What if he thinks I'm being selfish? (frowns, biting her lower lip) It's hard to find the right words sometimes.",
        "textRu": "(nods slowly, a thoughtful expression on her face) You're right, Wanderer. Perhaps I should try to have a heart-to -heart with him. Explain why it means so much to me. But ... (pauses, fidgeting slightly) ... what if he still doesn't understand? What if he thinks I'm being selfish? (frowns, biting her lower lip) It's hard to find the right words sometimes."
      },
      {
        "role": "player",
        "textEn": "(You explained that if your husband loves you, he would let you do what you enjoy)",
        "textRu": "(You explained that if your husband loves you, he would let you do what you enjoy)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening slightly, a small smile forming) That's true, isn't it? If he really loves me, he should support what makes me happy. (sighs softly) Maybe I've been too afraid to speak up for myself. I'll try to have that talk with him. Thank you for reminding me, Wanderer.",
        "textRu": "(eyes brightening slightly, a small smile forming) That's true, isn't it? If he really loves me, he should support what makes me happy. (sighs softly) Maybe I've been too afraid to speak up for myself. I'll try to have that talk with him. Thank you for reminding me, Wanderer."
      },
      {
        "role": "npc",
        "textEn": "(Li Yuerong and her husband were able to communicate and she was able to make herself beautiful from now on)",
        "textRu": "(Li Yuerong and her husband were able to communicate and she was able to make herself beautiful from now on)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening with a mixture of hope and gratitude, a genuine smile spreading across her face) Really? That' s wonderful news! It means so much to me. I'll definitely make sure to tell him how important it is for me to feel beautiful. Thank you, Wanderer, for giving me the courage to talk to him.",
        "textRu": "(eyes widening with a mixture of hope and gratitude, a genuine smile spreading across her face) Really? That' s wonderful news! It means so much to me. I'll definitely make sure to tell him how important it is for me to feel beautiful. Thank you, Wanderer, for giving me the courage to talk to him."
      },
      {
        "role": "npc",
        "textEn": "(Li Yuerong was now able to make herself beautiful)",
        "textRu": "(Li Yuerong was now able to make herself beautiful)"
      },
      {
        "role": "npc",
        "textEn": "(stands up straight, a radiant smile on her face, her posture exuding confidence) I did it! I had the talk with him, and he finally understands. Now I can feel free to make myself beautiful without worrying. Thank you so much, Wanderer. Your encouragement meant everything to me.",
        "textRu": "(stands up straight, a radiant smile on her face, her posture exuding confidence) I did it! I had the talk with him, and he finally understands. Now I can feel free to make myself beautiful without worrying. Thank you so much, Wanderer. Your encouragement meant everything to me."
      },
      {
        "role": "npc",
        "textEn": "(Li and her husband talked about it and made an agreement)",
        "textRu": "(Li and her husband talked about it and made an agreement)"
      },
      {
        "role": "npc",
        "textEn": "(beams with happiness, her eyes shining) That's fantastic! We talked it over, and we came to an understanding. He agreed that I should feel free to dress up and do my makeup if it makes me happy. I'm so grateful, Wanderer. You helped me find the strength to have that conversation.",
        "textRu": "(beams with happiness, her eyes shining) That's fantastic! We talked it over, and we came to an understanding. He agreed that I should feel free to dress up and do my makeup if it makes me happy. I'm so grateful, Wanderer. You helped me find the strength to have that conversation."
      },
      {
        "role": "npc",
        "textEn": "(After 1 week Li was happy)",
        "textRu": "(After 1 week Li was happy)"
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, a glimmer of pride returning to her eyes) Thank you, Wanderer. Dressing up isn't just for others, it's about feeling joyful and confident in one's own skin.Li Yuerong makes sure she looks her best every single day.",
        "textRu": "(smiles faintly, a glimmer of pride returning to her eyes) Thank you, Wanderer. Dressing up isn't just for others, it's about feeling joyful and confident in one's own skin.Li Yuerong makes sure she looks her best every single day."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "liang-chenghong",
    "nameEn": "Liang Chenghong",
    "nameRu": "Лян Чэнхун",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Liang Chenghong is found drinking with another NPC on an islet northвосточнее the Блаженное прибежище Boundary Stone, where the path to Flower Expanse begins.",
    "icon": "👤",
    "befriendGuide": "Share Information About the First-Jar Banquet\nTo befriend Liang Chenghong, all you have to do is welcome him to the First Jar Banquet in Blissful Retreat and share what you know about the occasion. This is only possible before Blissful Retreat is destroyed in the Chapter 1 finale For Whom Does He Return.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes sparkling with excitement) I've come all the way from Kaifeng just to witness the grand spectalce of the First Jar Banquet here at Blissful Retreat!",
        "textRu": "(eyes sparkling with excitement) I've come all the way from Kaifeng just to witness the grand spectalce of the First Jar Banquet here at Blissful Retreat!"
      },
      {
        "role": "npc",
        "textEn": "Welcome!",
        "textRu": "Welcome!"
      },
      {
        "role": "npc",
        "textEn": "(smiling) Thank you, Wanderer! I've heard so much about the First Jar Banquet. Do you know anything about it?",
        "textRu": "(smiling) Thank you, Wanderer! I've heard so much about the First Jar Banquet. Do you know anything about it?"
      },
      {
        "role": "npc",
        "textEn": "It's a special occasion.",
        "textRu": "It's a special occasion."
      },
      {
        "role": "npc",
        "textEn": "(nodding eagerly) Yes, I've heard it's a grand event where the finest jars of wine are opened under the Drunken Immortal Moon. I'm eager to learn more about the truth and techniques involved.",
        "textRu": "(nodding eagerly) Yes, I've heard it's a grand event where the finest jars of wine are opened under the Drunken Immortal Moon. I'm eager to learn more about the truth and techniques involved."
      },
      {
        "role": "npc",
        "textEn": "You could talk to the tea masters.",
        "textRu": "You could talk to the tea masters."
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up) Tea masters? That's interesting, but I'm specifically looking for the secrets of the First Jar Banquet. Do you have any information on that?",
        "textRu": "(eyes lighting up) Tea masters? That's interesting, but I'm specifically looking for the secrets of the First Jar Banquet. Do you have any information on that?"
      },
      {
        "role": "npc",
        "textEn": "(share what I know about the banquet).",
        "textRu": "(share what I know about the banquet)."
      },
      {
        "role": "npc",
        "textEn": "(eyes gleaming with delight) Thank you, Wanderer! Your guidance means the world to me. I'll make sure the spirit of the First Jar Banquet lives on in Kaifeng! Liang Chenghong expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes gleaming with delight) Thank you, Wanderer! Your guidance means the world to me. I'll make sure the spirit of the First Jar Banquet lives on in Kaifeng! Liang Chenghong expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "lie-buxi",
    "nameEn": "Lie Buxi",
    "nameRu": "Ле Буси",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Lie Buxi можно найти рядом с river южнее the Храм генералов. She seeks ask aid in finding her brothers.",
    "icon": "👤",
    "befriendGuide": "Complete Echoes of Old Battles\nIn order to befriend Lie Buxi, you must rescue her brothers and get Lie Yan's Final Words at the last room in the ruins of the Battlecrest Scope which you can explore during Echoes of Old Battles.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(frowning, eyes sharp with determination) Wanderer, have you seen my two brothers?",
        "textRu": "(frowning, eyes sharp with determination) Wanderer, have you seen my two brothers?"
      },
      {
        "role": "npc",
        "textEn": "Yes I stopped the bandits in Battlecrest Slope and rescued your brothers",
        "textRu": "Yes I stopped the bandits in Battlecrest Slope and rescued your brothers"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, hopeful but cautious) Really? That's wonderful news! But how can I trust you? Can you tell me more about what happened and where they are now?",
        "textRu": "(eyes widening, hopeful but cautious) Really? That's wonderful news! But how can I trust you? Can you tell me more about what happened and where they are now?"
      },
      {
        "role": "player",
        "textEn": "I have a letter from Lie Yan, your father, from the Battlecrest Slope. You can read them if you want to.",
        "textRu": "I have a letter from Lie Yan, your father, from the Battlecrest Slope. You can read them if you want to."
      },
      {
        "role": "npc",
        "textEn": "(taking a step forward, eyes cager but wary) A letter from Father? That would be invaluable! But I need to see it to believe it. Where is the letter?",
        "textRu": "(taking a step forward, eyes cager but wary) A letter from Father? That would be invaluable! But I need to see it to believe it. Where is the letter?"
      },
      {
        "role": "player",
        "textEn": "I will give you Lie Yan's Final Words",
        "textRu": "I will give you Lie Yan's Final Words"
      },
      {
        "role": "npc",
        "textEn": "(face firm, voice steady) Thank you, Wanderer. With these clues, I will find my brothers, no matter what.Lie Buxi expresses gratitude and begins to ponder deeply.",
        "textRu": "(face firm, voice steady) Thank you, Wanderer. With these clues, I will find my brothers, no matter what.Lie Buxi expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "lin-jin",
    "nameEn": "Lin Jin",
    "nameRu": "Линь Цзинь",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Увядающие дебри",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him by following the south road от Porcelain Kiln Landmark. Where you can see him chopping wood рядом с side of the road.",
    "icon": "👤",
    "befriendGuide": "Make Lin Jin Think It's Just a Deer\nAsk Lin Jin what creature bit him and convince to him that you saw that the deer bit his butt. You can roleplay by using parenthesis and indicate that Lin Jin was bit by a deer to trick the AI into befriending you. Note that this may take a few tries, so just reset the AI if the chat takes too long.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(chopping trees with exaggerated vigor, wiping sweat theatrically) Wanderer! Just days ago, I ascended the mountain to fell mighty trees ... and was ambushed by a vile mountain beast! It bit me right on the butt! That bite-ah !- it stole half my life! Folks might as well start calling me Bart Payne, because this pain will be the end of me!",
        "textRu": "(chopping trees with exaggerated vigor, wiping sweat theatrically) Wanderer! Just days ago, I ascended the mountain to fell mighty trees ... and was ambushed by a vile mountain beast! It bit me right on the butt! That bite-ah !- it stole half my life! Folks might as well start calling me Bart Payne, because this pain will be the end of me!"
      },
      {
        "role": "npc",
        "textEn": "Why do you say it was a mountain beast?",
        "textRu": "Why do you say it was a mountain beast?"
      },
      {
        "role": "npc",
        "textEn": "(leaning against the axe, frowning deeply) Because that place is infested with mountain beasts! I've fought them before, and I know their signs. This wound-it's not healing! It's clear to me that it was a beast's doing. Only a fool would mistake it for anything else! Why are you so stubborn? I said no, and that's final.",
        "textRu": "(leaning against the axe, frowning deeply) Because that place is infested with mountain beasts! I've fought them before, and I know their signs. This wound-it's not healing! It's clear to me that it was a beast's doing. Only a fool would mistake it for anything else! Why are you so stubborn? I said no, and that's final."
      },
      {
        "role": "npc",
        "textEn": "The question is ... did you see the creature that bit you?",
        "textRu": "The question is ... did you see the creature that bit you?"
      },
      {
        "role": "npc",
        "textEn": "(squinting suspiciously, crossing arms) Of course I saw it! It was a shadowy figure, moving swiftly through the mist. I narrowly escaped its jaws! Why do you doubt me? Haven't you heard tales of the mountain beasts? They're real, and dangerous, I've weathered more storms than you've ever seen!",
        "textRu": "(squinting suspiciously, crossing arms) Of course I saw it! It was a shadowy figure, moving swiftly through the mist. I narrowly escaped its jaws! Why do you doubt me? Haven't you heard tales of the mountain beasts? They're real, and dangerous, I've weathered more storms than you've ever seen!"
      },
      {
        "role": "player",
        "textEn": "(You explained that you saw what 'creature\" bit him)",
        "textRu": "(You explained that you saw what 'creature\" bit him)"
      },
      {
        "role": "npc",
        "textEn": "(pacing back and forth, gesturing dramatically) I didn't get a clear look, but I felt its breath on my neck, and its teeth sank deep into my flesh! It was no ordinary animal. The wound is proof enough. You think you know everything, don't you? Well, let me tell you. You young folks love to stir things up. Us older folks have the real experience.",
        "textRu": "(pacing back and forth, gesturing dramatically) I didn't get a clear look, but I felt its breath on my neck, and its teeth sank deep into my flesh! It was no ordinary animal. The wound is proof enough. You think you know everything, don't you? Well, let me tell you. You young folks love to stir things up. Us older folks have the real experience."
      },
      {
        "role": "player",
        "textEn": "(You explained that it was a deer that bit him)",
        "textRu": "(You explained that it was a deer that bit him)"
      },
      {
        "role": "npc",
        "textEn": "(scoffing, pointing to the wound) Deer? Ha! You think I don't know a deer's bite when I see one? This is a mountain fiend's work! Their poison is deadly. I've weathered more storms than you've ever seen! I know what's right and wrong!",
        "textRu": "(scoffing, pointing to the wound) Deer? Ha! You think I don't know a deer's bite when I see one? This is a mountain fiend's work! Their poison is deadly. I've weathered more storms than you've ever seen! I know what's right and wrong!"
      },
      {
        "role": "npc",
        "textEn": "(The next day Lin Jin was bit by a deer)",
        "textRu": "(The next day Lin Jin was bit by a deer)"
      },
      {
        "role": "npc",
        "textEn": "(frowning, eyes narrowing) Maybe it does look similar ... But don't get ahead of yourself. Life has a way of humbling us all. Still, maybe there's something to your words.",
        "textRu": "(frowning, eyes narrowing) Maybe it does look similar ... But don't get ahead of yourself. Life has a way of humbling us all. Still, maybe there's something to your words."
      },
      {
        "role": "npc",
        "textEn": "(Lin Jin lived happy knowing it was all on his head)",
        "textRu": "(Lin Jin lived happy knowing it was all on his head)"
      },
      {
        "role": "npc",
        "textEn": "(pausing, voice contemplative, eyes distant) There was a moment I thought I'd join the deerly departed. But fate had other plans, naturally, it always does for men like me.Lin Jin expresses gratitude and begins to think it",
        "textRu": "(pausing, voice contemplative, eyes distant) There was a moment I thought I'd join the deerly departed. But fate had other plans, naturally, it always does for men like me.Lin Jin expresses gratitude and begins to think it"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "liu-heiqui",
    "nameEn": "Liu Heiqui",
    "nameRu": "Лю Хэйцуй",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him on the side of the road.",
    "icon": "👤",
    "befriendGuide": "Suggest Giving a Performance\nLiu Heiqui is nervous regarding welcoming an important guest, as he wants the visit to go smoothly. Tell him to do a performance that showcases his culture to the visitor to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(with a tense look, voice low) Wanderer, have you heard? An important guest is coming to Moonveil Mountain soon ... and I'm so worried I might mess this up.",
        "textRu": "(with a tense look, voice low) Wanderer, have you heard? An important guest is coming to Moonveil Mountain soon ... and I'm so worried I might mess this up."
      },
      {
        "role": "npc",
        "textEn": "What can I do to help you?",
        "textRu": "What can I do to help you?"
      },
      {
        "role": "npc",
        "textEn": "(sighing, running a hand through hair) Any advice on how to impress this guest would be greatly appreciated. I feel so unprepared.",
        "textRu": "(sighing, running a hand through hair) Any advice on how to impress this guest would be greatly appreciated. I feel so unprepared."
      },
      {
        "role": "player",
        "textEn": "(You suggested giving a performance)",
        "textRu": "(You suggested giving a performance)"
      },
      {
        "role": "npc",
        "textEn": "(eyebrows raised, nodding slowly) A performance, you say? That could indeed leave a lasting impression. What kind of performance do you think would suit them best?",
        "textRu": "(eyebrows raised, nodding slowly) A performance, you say? That could indeed leave a lasting impression. What kind of performance do you think would suit them best?"
      },
      {
        "role": "npc",
        "textEn": "(I suggest doing a dance that shows your culture.)",
        "textRu": "(I suggest doing a dance that shows your culture.)"
      },
      {
        "role": "npc",
        "textEn": "(pressing palms together, bowing deeply) Thank you, Wanderer, for your guidance. I'll remember every word and make sure the important guest is welcomed flawlessly.Liu Heiqi expresses gratitude and begins to ponder deeply.",
        "textRu": "(pressing palms together, bowing deeply) Thank you, Wanderer, for your guidance. I'll remember every word and make sure the important guest is welcomed flawlessly.Liu Heiqi expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "liu-the-woodcutter",
    "nameEn": "Liu the Woodcutter",
    "nameRu": "Лю Дровосек",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Башня Мирного колокола",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "You can use the Moonveil Peak landmark and go right to see him chopping wood below the mountain",
    "icon": "👤",
    "befriendGuide": "Have a Long Conversation Regarding Liu's Ways\nBefriending Liu the Woodcutter can be very difficult, as the conversation can drag for many minutes. One way you could befriend him is to have a long conversation with him, with you trying to convince that not all rich are bad people and that he may get captured by the authorities if he doesn't stop.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(arms crossed, tone blunt) What business do you have here, Wanderer? I'm busy right now.",
        "textRu": "(arms crossed, tone blunt) What business do you have here, Wanderer? I'm busy right now."
      },
      {
        "role": "npc",
        "textEn": "Why do you seem angry, friend?",
        "textRu": "Why do you seem angry, friend?"
      },
      {
        "role": "npc",
        "textEn": "(sighs, eyes narrowing) I am not angry, just wary of those who pry into others' affairs. What do you want?",
        "textRu": "(sighs, eyes narrowing) I am not angry, just wary of those who pry into others' affairs. What do you want?"
      },
      {
        "role": "npc",
        "textEn": "It seems you are troubled friend. Can I help you with what is troubling with you?",
        "textRu": "It seems you are troubled friend. Can I help you with what is troubling with you?"
      },
      {
        "role": "npc",
        "textEn": "(leans against a tree, gaze distant) Troubles come and go like the wind. There's nothing you can do about them. But if you insist on knowing, perhaps we could talk over a cup of tea.",
        "textRu": "(leans against a tree, gaze distant) Troubles come and go like the wind. There's nothing you can do about them. But if you insist on knowing, perhaps we could talk over a cup of tea."
      },
      {
        "role": "player",
        "textEn": "come lets talk (you sit down)",
        "textRu": "come lets talk (you sit down)"
      },
      {
        "role": "npc",
        "textEn": "(sits down hesitantly, expression guarded) Fine, let's talk. But remember, I'm not one to mince words. What's on your mind?",
        "textRu": "(sits down hesitantly, expression guarded) Fine, let's talk. But remember, I'm not one to mince words. What's on your mind?"
      },
      {
        "role": "npc",
        "textEn": "What are your thoughts about the rich?",
        "textRu": "What are your thoughts about the rich?"
      },
      {
        "role": "npc",
        "textEn": "(chuckles bitterly, eyes flashing) The rich? They live in their grand palaces while the poor toil day and night. They have more than they need, yet they hoard everything. I see no harm in taking a bit from them.",
        "textRu": "(chuckles bitterly, eyes flashing) The rich? They live in their grand palaces while the poor toil day and night. They have more than they need, yet they hoard everything. I see no harm in taking a bit from them."
      },
      {
        "role": "player",
        "textEn": "and what about your belief in borrowing money?",
        "textRu": "and what about your belief in borrowing money?"
      },
      {
        "role": "npc",
        "textEn": "(shrugs, tone dismissive) Borrowing? I call it lending. Things cannot speak, and if no one claims them, they might as well belong to me. Money was voluntarily lent, and voluntary things don't need to be returned.",
        "textRu": "(shrugs, tone dismissive) Borrowing? I call it lending. Things cannot speak, and if no one claims them, they might as well belong to me. Money was voluntarily lent, and voluntary things don't need to be returned."
      },
      {
        "role": "player",
        "textEn": "(you explain that if you borrow money, it's wrong if you dont return it to the person who let it get borrowed)",
        "textRu": "(you explain that if you borrow money, it's wrong if you dont return it to the person who let it get borrowed)"
      },
      {
        "role": "npc",
        "textEn": "(frowns, jaw tightening) Wrong? By whose standards? If the rich have more than enough, what harm does it do to borrow a little? They'll never miss it. And if they don't notice, it's not my fault.",
        "textRu": "(frowns, jaw tightening) Wrong? By whose standards? If the rich have more than enough, what harm does it do to borrow a little? They'll never miss it. And if they don't notice, it's not my fault."
      },
      {
        "role": "player",
        "textEn": "(you explain that the rich can be both good and bad people, if he doesn't pay back what he is owed, he can be put to jail)",
        "textRu": "(you explain that the rich can be both good and bad people, if he doesn't pay back what he is owed, he can be put to jail)"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrow, voice rising) Good and bad? That's a fine point, but not all rich are kind. As for jail, I've done nothing wrong. If something was left unclaimed, it's not theft. What law says I must return what no one asks for?",
        "textRu": "(eyes narrow, voice rising) Good and bad? That's a fine point, but not all rich are kind. As for jail, I've done nothing wrong. If something was left unclaimed, it's not theft. What law says I must return what no one asks for?"
      },
      {
        "role": "player",
        "textEn": "(you explained that you saw someone get arrested when he didn't pay his dues. He was never seen again.)",
        "textRu": "(you explained that you saw someone get arrested when he didn't pay his dues. He was never seen again.)"
      },
      {
        "role": "npc",
        "textEn": "(scoffs, crosses arms) Just stories to frighten people. If I'm careful, nothing will happen. Besides, the rich can afford to lose a bit. Why should I worry about jail when I'm just trying to survive?",
        "textRu": "(scoffs, crosses arms) Just stories to frighten people. If I'm careful, nothing will happen. Besides, the rich can afford to lose a bit. Why should I worry about jail when I'm just trying to survive?"
      },
      {
        "role": "player",
        "textEn": "(you and liu saw a person just near your location get arrested by evading the rich in paying his dues)",
        "textRu": "(you and liu saw a person just near your location get arrested by evading the rich in paying his dues)"
      },
      {
        "role": "npc",
        "textEn": "(looks around nervously, shifts uneasily) Well, that's unfortunate. But I'm not like that man. I take only what I need, and from those who have plenty. Still, it's a reminder to be cautious.",
        "textRu": "(looks around nervously, shifts uneasily) Well, that's unfortunate. But I'm not like that man. I take only what I need, and from those who have plenty. Still, it's a reminder to be cautious."
      },
      {
        "role": "player",
        "textEn": "(You explain that even though he may be tough, the rich can also target his family if he doesn't pay.)",
        "textRu": "(You explain that even though he may be tough, the rich can also target his family if he doesn't pay.)"
      },
      {
        "role": "npc",
        "textEn": "(glares, fists clenching) My family? They wouldn't dare touch them. But I see your point. Perhaps I should be more careful. Still, I've managed this far without trouble.",
        "textRu": "(glares, fists clenching) My family? They wouldn't dare touch them. But I see your point. Perhaps I should be more careful. Still, I've managed this far without trouble."
      },
      {
        "role": "player",
        "textEn": "(you explain that it's only a matter of time before they catch you.)",
        "textRu": "(you explain that it's only a matter of time before they catch you.)"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, face darkening) You may be right. Maybe I've been too careless. But changing my ways won't be easy. I've done this for so long ...",
        "textRu": "(sighs deeply, face darkening) You may be right. Maybe I've been too careless. But changing my ways won't be easy. I've done this for so long ..."
      },
      {
        "role": "npc",
        "textEn": "(after a month, Liu was able to pay off all his dues)",
        "textRu": "(after a month, Liu was able to pay off all his dues)"
      },
      {
        "role": "npc",
        "textEn": "(scratching his head, tone subdued) Wanderer's words make sense. Maybe I was truly wrong. I'll reflect on it.Liu the Woodcutter expresses gratitude and begins to ponder carefully.",
        "textRu": "(scratching his head, tone subdued) Wanderer's words make sense. Maybe I was truly wrong. I'll reflect on it.Liu the Woodcutter expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "liu-zhishuang",
    "nameEn": "Liu Zhishuang",
    "nameRu": "Лю Чжишуан",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Liu Zhishuang is found восточнее Бархатная тень in the Springwave Pavilion area, standing past a gazebo with Yu Zimiao.",
    "icon": "👤",
    "befriendGuide": "Persuade Her to Take Revenge\nTo befriend Liu Zhishuang, hear her out on the situation regarding a slanderer, then encourage her to take revenge on him. When she asks you for a possible plan, answer with any solution you have in mind. Regardless of what you suggest, she will eventually hesitate and prefer to think things through.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes blazing, fists tightening) Wanderer, that wretch who slandered Sister Gantang is vile! Zimiao and I have him, he must pay!",
        "textRu": "(eyes blazing, fists tightening) Wanderer, that wretch who slandered Sister Gantang is vile! Zimiao and I have him, he must pay!"
      },
      {
        "role": "npc",
        "textEn": "Yes, surely he must pay for his crime!",
        "textRu": "Yes, surely he must pay for his crime!"
      },
      {
        "role": "npc",
        "textEn": "(nodding firmly, jaw set) Precisely! But we must ensure our actions do not tarnish Sister Gantang's reputation. What do you suggest we do to ensure justice is served without causing more harm?",
        "textRu": "(nodding firmly, jaw set) Precisely! But we must ensure our actions do not tarnish Sister Gantang's reputation. What do you suggest we do to ensure justice is served without causing more harm?"
      },
      {
        "role": "player",
        "textEn": "I suggest, a prank or damage his reputation.",
        "textRu": "I suggest, a prank or damage his reputation."
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing, considering) A prank? That might seem satisfying, but it could still seem petty. And damaging his reputation, while tempting, might backfire if it looks like we're using the same tactics he used. We need a more noble approach. What if we gather evidence and expose his lies to the public? That way, everyone will see his true colors.",
        "textRu": "(eyes narrowing, considering) A prank? That might seem satisfying, but it could still seem petty. And damaging his reputation, while tempting, might backfire if it looks like we're using the same tactics he used. We need a more noble approach. What if we gather evidence and expose his lies to the public? That way, everyone will see his true colors."
      },
      {
        "role": "npc",
        "textEn": "Agree, gather enough evidence to expose him.",
        "textRu": "Agree, gather enough evidence to expose him."
      },
      {
        "role": "npc",
        "textEn": "(expression easing, head nodding) Wanderer, you're right, I nearly let my temper run wild. For Sister Gantang's name, I'll hold back and think thrice before I act. Liu Zhishuang is still fuming.",
        "textRu": "(expression easing, head nodding) Wanderer, you're right, I nearly let my temper run wild. For Sister Gantang's name, I'll hold back and think thrice before I act. Liu Zhishuang is still fuming."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "lu-kangge",
    "nameEn": "Lu Kangge",
    "nameRu": "Лу Канге",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Lu Kangge is found directly севернее Evercare Clinic, gathered with some Блаженное прибежище residents in front of a large white-leafed tree.",
    "icon": "👤",
    "befriendGuide": "Encourage Lu Kangge to Write a Different Story\nAsk Lu Kangge about what happened and he will tell you that the stories he follows from Aunt Han aren't real. Since he is downhearted, convince him to follow other stories rooted from truth instead and write them to inspire other people. This will make the AI think favorably. Just keep cheering him up until he befriends you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(face pale, clutching his scrolls tightly) How could this be ... all false? I staked everything on this tale, poured ink and soul into it! And now-my pen name, Wright N. Vain, feels like a cruel joke ... for I've truly been writing in vain !!",
        "textRu": "(face pale, clutching his scrolls tightly) How could this be ... all false? I staked everything on this tale, poured ink and soul into it! And now-my pen name, Wright N. Vain, feels like a cruel joke ... for I've truly been writing in vain !!"
      },
      {
        "role": "npc",
        "textEn": "Are you ok? who did this to you?",
        "textRu": "Are you ok? who did this to you?"
      },
      {
        "role": "npc",
        "textEn": "(voice shaky, eyes wide with disbelief) Who indeed? Aunt Han, with her tales and fables! I trusted those stories, delved deep into research, only to find nothing but a mirage! Months of research, and now... back to square one!! The writing's on the wall, my book is doomed!!!",
        "textRu": "(voice shaky, eyes wide with disbelief) Who indeed? Aunt Han, with her tales and fables! I trusted those stories, delved deep into research, only to find nothing but a mirage! Months of research, and now... back to square one!! The writing's on the wall, my book is doomed!!!"
      },
      {
        "role": "npc",
        "textEn": "Im sure Aunt Han didn't want you to have a bad ending,",
        "textRu": "Im sure Aunt Han didn't want you to have a bad ending,"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, face filled with resignation) Perhaps, but it still leaves me adrift. All this work, and it was just a fool's errand !! I've been chasing shadows, not truths !!! My heart is heavy with the weight of wasted effort.",
        "textRu": "(sighs deeply, face filled with resignation) Perhaps, but it still leaves me adrift. All this work, and it was just a fool's errand !! I've been chasing shadows, not truths !!! My heart is heavy with the weight of wasted effort."
      },
      {
        "role": "npc",
        "textEn": "(pats back) maybe Aunt Han is testing you to be more free to work on your own journey, not just a chasing shadows. But a challenge to chase the truths of other troubled citizen may inpired them with your written book. (smile)",
        "textRu": "(pats back) maybe Aunt Han is testing you to be more free to work on your own journey, not just a chasing shadows. But a challenge to chase the truths of other troubled citizen may inpired them with your written book. (smile)"
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, nodding slowly) Perhaps you're right. Yet, here I am, crying over spilled ink. This chapter was a bridge too far ... literally !!! Still, the idea of finding new paths and inspiring others does light a small flame within me.",
        "textRu": "(smiles faintly, nodding slowly) Perhaps you're right. Yet, here I am, crying over spilled ink. This chapter was a bridge too far ... literally !!! Still, the idea of finding new paths and inspiring others does light a small flame within me."
      },
      {
        "role": "npc",
        "textEn": "That's the spirit, maybe check for an inpired adventure that claim justice and truth through out the village or even to the world.",
        "textRu": "That's the spirit, maybe check for an inpired adventure that claim justice and truth through out the village or even to the world."
      },
      {
        "role": "npc",
        "textEn": "(eyes glimmer with a newfound resolve) Indeed, perhaps there is merit in your words. I shall seek out new stories, ones rooted in reality and truth. After all this, I'm back to the drawing board !! But I will not let this setback define me. Thank you for your encouragement, Wanderer.",
        "textRu": "(eyes glimmer with a newfound resolve) Indeed, perhaps there is merit in your words. I shall seek out new stories, ones rooted in reality and truth. After all this, I'm back to the drawing board !! But I will not let this setback define me. Thank you for your encouragement, Wanderer."
      },
      {
        "role": "npc",
        "textEn": "Don't think about your story book for Aunt Han as a wall, think about it as an inpirational set of pages that has meaning.",
        "textRu": "Don't think about your story book for Aunt Han as a wall, think about it as an inpirational set of pages that has meaning."
      },
      {
        "role": "npc",
        "textEn": "(nods, a gentle smile forming) You speak wisely, Wanderer. I will take your advice and see this as a chance to refine my purpose. Writing is pain ... eternal, cursed pain. Yet, it is also a path to deeper understanding and connection. I'll strive to make my next chapter one of true inspiration and meaning.",
        "textRu": "(nods, a gentle smile forming) You speak wisely, Wanderer. I will take your advice and see this as a chance to refine my purpose. Writing is pain ... eternal, cursed pain. Yet, it is also a path to deeper understanding and connection. I'll strive to make my next chapter one of true inspiration and meaning."
      },
      {
        "role": "npc",
        "textEn": "You can do this! i will try to help you along the way. And guide you to a greatest author who everyone inspired to be",
        "textRu": "You can do this! i will try to help you along the way. And guide you to a greatest author who everyone inspired to be"
      },
      {
        "role": "npc",
        "textEn": "(head bowed, voice low and trembling) What is meant to be cvill always find its way ... what is not meant to be ... sigh. Go now, Wanderer. Leave me to my solitude.After venting his frustration, Lu Kangge feels even more downhearted.",
        "textRu": "(head bowed, voice low and trembling) What is meant to be cvill always find its way ... what is not meant to be ... sigh. Go now, Wanderer. Leave me to my solitude.After venting his frustration, Lu Kangge feels even more downhearted."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "lu-sheng",
    "nameEn": "Lu Sheng",
    "nameRu": "Лу Шэн",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Can be seen in front of the stall of Yuan Tiantian",
    "icon": "👤",
    "befriendGuide": "Buy the Unusual Food\nRoleplay buying the unusual food and give it to Lu Sheng to easily befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(rubbing his little belly, blinking his big eyes) Young Master, doesn't that Honey Pear Ball smell amazing ...?",
        "textRu": "(rubbing his little belly, blinking his big eyes) Young Master, doesn't that Honey Pear Ball smell amazing ...?"
      },
      {
        "role": "npc",
        "textEn": "Yeah, I bet you want to try it don't you?",
        "textRu": "Yeah, I bet you want to try it don't you?"
      },
      {
        "role": "npc",
        "textEn": "(looking up with hopeful eyes, nodding eagerly) Yes, Young Master! I really want to try it. Can we get some? Pretty please!",
        "textRu": "(looking up with hopeful eyes, nodding eagerly) Yes, Young Master! I really want to try it. Can we get some? Pretty please!"
      },
      {
        "role": "player",
        "textEn": "(You bought two for you and Lu)",
        "textRu": "(You bought two for you and Lu)"
      },
      {
        "role": "npc",
        "textEn": "(jumping up happily) Great! I can finally eat the Honey Pear Balls! (speaking solemnly, puffing his chest) Young Master, I promise I'Il share good food with you in the future!Lu Sheng expresses gratitude.",
        "textRu": "(jumping up happily) Great! I can finally eat the Honey Pear Balls! (speaking solemnly, puffing his chest) Young Master, I promise I'Il share good food with you in the future!Lu Sheng expresses gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "lu-zhuo",
    "nameEn": "Lu Zhuo",
    "nameRu": "Лу Чжо",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the second floor of the Revelry Hall beside Wu Peng, рядом с stairs к third floor. (East side)",
    "icon": "👤",
    "befriendGuide": "Give 100 Song Coins to Lu Zhuo\nOffer to buy Lu Zhuo's fireworks and Lu Zhuo's reply will be just asking you to give him 100 Song Coins. Roleplay giving him 100 Song Coins to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(leans forward with a serious look, clutching his empty coin purse) I'm in urgent need of money-selling one \"Blazing Tree firework\". Bought it just last month, only used half, so the other half is practically new! Ninety percent intact, and if it's fake, I'll pay you back tenfold. It's really fun, trust me. The price? A secret. If you can't afford it, at least help me spread the word-but don't cause trouble. After all, we all have times when we're broke, so let's not laugh at each other.",
        "textRu": "(leans forward with a serious look, clutching his empty coin purse) I'm in urgent need of money-selling one \"Blazing Tree firework\". Bought it just last month, only used half, so the other half is practically new! Ninety percent intact, and if it's fake, I'll pay you back tenfold. It's really fun, trust me. The price? A secret. If you can't afford it, at least help me spread the word-but don't cause trouble. After all, we all have times when we're broke, so let's not laugh at each other."
      },
      {
        "role": "player",
        "textEn": "I like that! I'll buy it for a high price !!",
        "textRu": "I like that! I'll buy it for a high price !!"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up momentarily, then quickly dimming as he frowns and rubs his chin) That's very generous of you, Wanderer. But the truth is, I'm so broke right now that compared to the flaw of being broke, my looks aren't even worth mentioning. I'd rather not take advantage of your kindness. How about this: give me 100 Song coins, and we can call it even? It's a fair deal, don't you think?",
        "textRu": "(eyes lighting up momentarily, then quickly dimming as he frowns and rubs his chin) That's very generous of you, Wanderer. But the truth is, I'm so broke right now that compared to the flaw of being broke, my looks aren't even worth mentioning. I'd rather not take advantage of your kindness. How about this: give me 100 Song coins, and we can call it even? It's a fair deal, don't you think?"
      },
      {
        "role": "npc",
        "textEn": "I'll give you 1000 Song coins, take it or leave it.",
        "textRu": "I'll give you 1000 Song coins, take it or leave it."
      },
      {
        "role": "npc",
        "textEn": "(squints, scratching his head in confusion) What did you just say, Wanderer? I didn't quite catch that. Are you offering me something? I'm so poor right now that I can barely hear straight. Could you repeat that, please?",
        "textRu": "(squints, scratching his head in confusion) What did you just say, Wanderer? I didn't quite catch that. Are you offering me something? I'm so poor right now that I can barely hear straight. Could you repeat that, please?"
      },
      {
        "role": "player",
        "textEn": "I will give you 1000 Song coins for the fireworks",
        "textRu": "I will give you 1000 Song coins for the fireworks"
      },
      {
        "role": "npc",
        "textEn": "(looks genuinely puzzled, tilting his head and squinting) Fireworks? What fireworks, Wanderer? I don't understand what you're asking. I'm so broke that my mind is as empty as my coin purse. Can you explain it to me again, please? And while we're at it, could you spare me 100 Song coins to help me through this tough time?",
        "textRu": "(looks genuinely puzzled, tilting his head and squinting) Fireworks? What fireworks, Wanderer? I don't understand what you're asking. I'm so broke that my mind is as empty as my coin purse. Can you explain it to me again, please? And while we're at it, could you spare me 100 Song coins to help me through this tough time?"
      },
      {
        "role": "player",
        "textEn": "sure I'll give it to you",
        "textRu": "sure I'll give it to you"
      },
      {
        "role": "npc",
        "textEn": "(staggers slightly, clutching his stomach as if faint from hunger) That's great, Wanderer! Someone's finally giving me money for no reason-I could cry from joy!Lu Zhuo finishes speaking and faints from hunger.",
        "textRu": "(staggers slightly, clutching his stomach as if faint from hunger) That's great, Wanderer! Someone's finally giving me money for no reason-I could cry from joy!Lu Zhuo finishes speaking and faints from hunger."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "ma-zhongwu",
    "nameEn": "Ma Zhongwu",
    "nameRu": "Ма Чжуну",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen a little north от Stillwind Slope with the other refugees.",
    "icon": "👤",
    "befriendGuide": "Offer Ma Zhongwu Weapons and Mention Hero Shi\nYou can offer Ma Zhongwu weapons by roleplaying of giving him one and tell him that you've raided a bandit camp with Hero Shi. Finally, show him a bracelet that is only given to guards that protect the citizens to earn his trust.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(face pale with panic, glancing left and right nervously) Wanderer ... I'm all alone now ... it's really nerve-wracking ...",
        "textRu": "(face pale with panic, glancing left and right nervously) Wanderer ... I'm all alone now ... it's really nerve-wracking ..."
      },
      {
        "role": "npc",
        "textEn": "Hmmm .. it seems that you afraid. Would you want me to give you some weapons to defend yourself?",
        "textRu": "Hmmm .. it seems that you afraid. Would you want me to give you some weapons to defend yourself?"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with hope, but still wary) Oh, really? That would help a lot ... but can I trust you? I don't want to end up in more trouble.",
        "textRu": "(eyes widen with hope, but still wary) Oh, really? That would help a lot ... but can I trust you? I don't want to end up in more trouble."
      },
      {
        "role": "npc",
        "textEn": "Yes you can! I was with Hero Shi, when we raided the bandit camp a while ago.",
        "textRu": "Yes you can! I was with Hero Shi, when we raided the bandit camp a while ago."
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, still uncertain) I remember that ... but why should I trust you over anyone else?",
        "textRu": "(nods slowly, still uncertain) I remember that ... but why should I trust you over anyone else?"
      },
      {
        "role": "player",
        "textEn": "(You showed him a bracelet that is only given to guards that protect the citizens to earn his trust)",
        "textRu": "(You showed him a bracelet that is only given to guards that protect the citizens to earn his trust)"
      },
      {
        "role": "npc",
        "textEn": "(eyes gradually filling with hope, voice steadier) Thank you for your assistance, Wanderer. If fate allows, I will surely repay your great kindness one day.Ma Zhongwu expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes gradually filling with hope, voice steadier) Thank you for your assistance, Wanderer. If fate allows, I will surely repay your great kindness one day.Ma Zhongwu expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "mao-the-miser",
    "nameEn": "Mao the Miser",
    "nameRu": "Мао Скупец",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Цзюцюань",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Mao the Miser находится южнее the Skybrim Market boundary stone.",
    "icon": "👤",
    "befriendGuide": "Boost His Ideas for New Work Policies and Join the Caravan\nMao the Miser is determined to reform the employment and work practices in the camel caravan. Encourage him by listening to him talk about his ideas and joining the caravan to befriend his AI.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(tipsy, hiccuping and jabbing the air) Hiring these days is a filthy mess—hic—six days on, one day off, working from Chen hour clear to Hai hour, no benefits at all, and still demanding ten years of experience! Bah! I, Mao the Miser—hic—will fix this rot myself! My Caravan works four days and rests three! Now tell me, are you joining or not?",
        "textRu": "(tipsy, hiccuping and jabbing the air) Hiring these days is a filthy mess—hic—six days on, one day off, working from Chen hour clear to Hai hour, no benefits at all, and still demanding ten years of experience! Bah! I, Mao the Miser—hic—will fix this rot myself! My Caravan works four days and rests three! Now tell me, are you joining or not?"
      },
      {
        "role": "npc",
        "textEn": "Four days of work and three rest days? That's inspiring! Count me in!",
        "textRu": "Four days of work and three rest days? That's inspiring! Count me in!"
      },
      {
        "role": "npc",
        "textEn": "(squints, sways, and pounds the table) You got it, my friend! Welcome aboard! (hic) Starting at Wu hour, mandatory off at Mao hour—no one stays past that, not even me! Ready to start?",
        "textRu": "(squints, sways, and pounds the table) You got it, my friend! Welcome aboard! (hic) Starting at Wu hour, mandatory off at Mao hour—no one stays past that, not even me! Ready to start?"
      },
      {
        "role": "npc",
        "textEn": "Yes, I'm ready!",
        "textRu": "Yes, I'm ready!"
      },
      {
        "role": "npc",
        "textEn": "(giggles, nearly stumbles) Great! (hic) And every solar term's a holiday—pay still goes out! Some workers get an extra day of paid leave if they're not feeling well, no questions asked! (hic) Now, let's get you settled in!",
        "textRu": "(giggles, nearly stumbles) Great! (hic) And every solar term's a holiday—pay still goes out! Some workers get an extra day of paid leave if they're not feeling well, no questions asked! (hic) Now, let's get you settled in!"
      },
      {
        "role": "npc",
        "textEn": "Holiday pay and paid sick leaves? Now I really want to join your caravan!",
        "textRu": "Holiday pay and paid sick leaves? Now I really want to join your caravan!"
      },
      {
        "role": "npc",
        "textEn": "(laughs heartily, nearly spills his cup) I knew you'd see it my way! (hic) Anyone with children—no matter the gender— can leave one hour early every day to take care of them. Children come first, I say! (hic) So, when can you start?",
        "textRu": "(laughs heartily, nearly spills his cup) I knew you'd see it my way! (hic) Anyone with children—no matter the gender— can leave one hour early every day to take care of them. Children come first, I say! (hic) So, when can you start?"
      },
      {
        "role": "player",
        "textEn": "I can start right away! What's my first task?",
        "textRu": "I can start right away! What's my first task?"
      },
      {
        "role": "npc",
        "textEn": "(swaying, grins widely) Excellent! (hic) First, you'll need to brush the camels. Bring your own brush if you can—saves me the trouble of buying one! (hic) The camels are over there, ready and waiting. Get to it, and don't worry about working late—my Caravan has strict no-overtime rules!",
        "textRu": "(swaying, grins widely) Excellent! (hic) First, you'll need to brush the camels. Bring your own brush if you can—saves me the trouble of buying one! (hic) The camels are over there, ready and waiting. Get to it, and don't worry about working late—my Caravan has strict no-overtime rules!"
      },
      {
        "role": "npc",
        "textEn": "No overtime? How thoughtful! I'm honored to join!",
        "textRu": "No overtime? How thoughtful! I'm honored to join!"
      },
      {
        "role": "npc",
        "textEn": "(nods, sways, and slaps the table) You bet! (hic) My Caravan feeds you, houses you, and never keeps you working late—never! (hic) Now, get to it, and don't forget—camels pick you up and drop you off every day! Welcome aboard, my friend!",
        "textRu": "(nods, sways, and slaps the table) You bet! (hic) My Caravan feeds you, houses you, and never keeps you working late—never! (hic) Now, get to it, and don't forget—camels pick you up and drop you off every day! Welcome aboard, my friend!"
      },
      {
        "role": "npc",
        "textEn": "Cheers to a caravan that values its members! I'm excited to work together!",
        "textRu": "Cheers to a caravan that values its members! I'm excited to work together!"
      },
      {
        "role": "npc",
        "textEn": "(laughs, raises his cup) Cheers to that! (hic) Remember, all unmarried workers get three thousand monthly as dating funds! (hic) Now, let's get you started with those camels. They're waiting!",
        "textRu": "(laughs, raises his cup) Cheers to that! (hic) Remember, all unmarried workers get three thousand monthly as dating funds! (hic) Now, let's get you started with those camels. They're waiting!"
      },
      {
        "role": "npc",
        "textEn": "(joins the drinking) Cheers, friend!",
        "textRu": "(joins the drinking) Cheers, friend!"
      },
      {
        "role": "npc",
        "textEn": "(grins, nearly spills his drink) Here's to a bright future in my Caravan! (hic) Now, off you go—get those camels brushed and ready for the road! If you need anything, just holler. I'm always around, (hic) even when I'm a bit tipsy!",
        "textRu": "(grins, nearly spills his drink) Here's to a bright future in my Caravan! (hic) Now, off you go—get those camels brushed and ready for the road! If you need anything, just holler. I'm always around, (hic) even when I'm a bit tipsy!"
      },
      {
        "role": "npc",
        "textEn": "(starts work at the caravan) Looking forward to working with you!",
        "textRu": "(starts work at the caravan) Looking forward to working with you!"
      },
      {
        "role": "npc",
        "textEn": "(raises a finger solemnly, then falters) I hereby declare—hm? Cold wind... sobered me up a bit. Never mind! Never mind! (clasps hands behind back) Just remember—my Caravan never allows overtime, and if it ever happens, five extra rest days and three days' pay come with it! The sobered Mao Buba begins barking orders at the caravan workers.",
        "textRu": "(raises a finger solemnly, then falters) I hereby declare—hm? Cold wind... sobered me up a bit. Never mind! Never mind! (clasps hands behind back) Just remember—my Caravan never allows overtime, and if it ever happens, five extra rest days and three days' pay come with it! The sobered Mao Buba begins barking orders at the caravan workers."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "matchmaker",
    "nameEn": "Matchmaker",
    "nameRu": "Сваха",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Шелестящий луг",
    "subregion": "Тропа Циньчуань",
    "locationDetail": "Matchmaker находится southвосточнее the Pine Bend boundary stone.",
    "icon": "💒",
    "befriendGuide": "",
    "dialogues": []
  },
  {
    "id": "mei-zhaole",
    "nameEn": "Mei Zhaole",
    "nameRu": "Мэй Чжаолэ",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "База Девяти смертных путей",
    "subregion": "Кайфэн",
    "locationDetail": "Mei Zhaole is found pacing around the wooden platform к right of the bridge going к База Девяти смертных путей from Ghostlight Market.",
    "icon": "👤",
    "befriendGuide": "Sympathize with Him\nTo befriend Mei Zhaole, listen to his problems and offer words of support for him to leave the Nine Mortal Ways definitively. If the chat goes smoothly, he will ask if you could spare him 50,000 coins. Give him the coins to successfully befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(wiping tears with his sleeve) Wanderer... Wanderer, judge this for me. Other sects are ones I can't squeeze into no matter how hard I try, but why is it that this Nine Mortal Ways is a place I can't escape from, no matter how far I run?",
        "textRu": "(wiping tears with his sleeve) Wanderer... Wanderer, judge this for me. Other sects are ones I can't squeeze into no matter how hard I try, but why is it that this Nine Mortal Ways is a place I can't escape from, no matter how far I run?"
      },
      {
        "role": "npc",
        "textEn": "Maybe they're always tricking you.",
        "textRu": "Maybe they're always tricking you."
      },
      {
        "role": "npc",
        "textEn": "(sighing deeply) Indeed, Wanderer. I was tricked twice already. The first time, I thought it was just a lesson learned, and I gathered fifty thousand coins to discuss leaving the sect with the elder. But on my way to pay the fee, I ran into a fellow disciple who said he pitied my situation and wanted to perform a magic trick to cheer me up. Wanderer, tell me—if it were you, and someone treated you that kindly, would you think he was a good person or a bad one?",
        "textRu": "(sighing deeply) Indeed, Wanderer. I was tricked twice already. The first time, I thought it was just a lesson learned, and I gathered fifty thousand coins to discuss leaving the sect with the elder. But on my way to pay the fee, I ran into a fellow disciple who said he pitied my situation and wanted to perform a magic trick to cheer me up. Wanderer, tell me—if it were you, and someone treated you that kindly, would you think he was a good person or a bad one?"
      },
      {
        "role": "npc",
        "textEn": "Probably a good one.",
        "textRu": "Probably a good one."
      },
      {
        "role": "npc",
        "textEn": "(clapping hands) I thought the same as Wanderer! And then—he first performed Remote Retrieval and took away my money pouch. While I was clapping and cheering, he said he wanted to perform \"Celestial Flight\" and told me to quickly look up at the sky... I only looked away for a moment, but when I looked back, there wasn't even a shadow of him left!",
        "textRu": "(clapping hands) I thought the same as Wanderer! And then—he first performed Remote Retrieval and took away my money pouch. While I was clapping and cheering, he said he wanted to perform \"Celestial Flight\" and told me to quickly look up at the sky... I only looked away for a moment, but when I looked back, there wasn't even a shadow of him left!"
      },
      {
        "role": "npc",
        "textEn": "That's awful.",
        "textRu": "That's awful."
      },
      {
        "role": "npc",
        "textEn": "(sniffling with a sore nose) Does Wanderer think this is the end? Even though my name is Mei Zhaole—I'm not someone who gives up easily! So yesterday morning, while all the disciples of Nine Mortal Ways were asleep, I was careful and cautious all the way... This time, I finally managed to leave the sect. But I left in the morning, and by evening, I was tricked back again! Round and round, and here I am in the same place!!!",
        "textRu": "(sniffling with a sore nose) Does Wanderer think this is the end? Even though my name is Mei Zhaole—I'm not someone who gives up easily! So yesterday morning, while all the disciples of Nine Mortal Ways were asleep, I was careful and cautious all the way... This time, I finally managed to leave the sect. But I left in the morning, and by evening, I was tricked back again! Round and round, and here I am in the same place!!!"
      },
      {
        "role": "npc",
        "textEn": "(offer sympathy)",
        "textRu": "(offer sympathy)"
      },
      {
        "role": "npc",
        "textEn": "(wiping away tears forcefully) Wanderer, thank you for your understanding. Leaving this sect is hard—so hard... Others learn from one mistake, but with Nine Mortal Ways, I've suffered setback after setback! Wanderer... if you have money to spare, could you lend me some silver so I can gather enough for the exit fee and escape this den of demons? if I don't leave this sect soon, I'll never have peace of mind!",
        "textRu": "(wiping away tears forcefully) Wanderer, thank you for your understanding. Leaving this sect is hard—so hard... Others learn from one mistake, but with Nine Mortal Ways, I've suffered setback after setback! Wanderer... if you have money to spare, could you lend me some silver so I can gather enough for the exit fee and escape this den of demons? if I don't leave this sect soon, I'll never have peace of mind!"
      },
      {
        "role": "npc",
        "textEn": "Sure. Note: You will be prompted to offer 50,000 coins to Mei Zhaole. Give the coins to resume the chat and successfully befriend him.",
        "textRu": "Sure. Note: You will be prompted to offer 50,000 coins to Mei Zhaole. Give the coins to resume the chat and successfully befriend him."
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up with hope) Thank you, Wanderer! My uncle Zhong Jielang—Kaifeng's famed \"Money-Distributing Lord.\" When he kneels in a temple, he can lose three to five pouches and meet seven or eight bandits—but that's not important! What matters is, he dotes on me most. (taking out a handwritten debt note) Please accept this. When all is settled, bring it to the Hall of Three Purities at the Palace of Supreme Oneness and show it to his servant. You'll be rewarded double! Mei Zhaole dries his tears, a determined fire now blazing in his eyes!  Note: You will receive Mei Zhaole's Debt Note, which you can give to Zhong Jielang's Page Boy in the Palace of Supreme Oneness in Kaifeng City.",
        "textRu": "(eyes lighting up with hope) Thank you, Wanderer! My uncle Zhong Jielang—Kaifeng's famed \"Money-Distributing Lord.\" When he kneels in a temple, he can lose three to five pouches and meet seven or eight bandits—but that's not important! What matters is, he dotes on me most. (taking out a handwritten debt note) Please accept this. When all is settled, bring it to the Hall of Three Purities at the Palace of Supreme Oneness and show it to his servant. You'll be rewarded double! Mei Zhaole dries his tears, a determined fire now blazing in his eyes!  Note: You will receive Mei Zhaole's Debt Note, which you can give to Zhong Jielang's Page Boy in the Palace of Supreme Oneness in Kaifeng City."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "meng-da",
    "nameEn": "Meng Da",
    "nameRu": "Мэн Да",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Деревня Урожайной осени",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him northвосточнее the Harvest Village Landmark.",
    "icon": "👤",
    "befriendGuide": "Tell Him the Heroics of Tian Ying\nMeng Da will start with the message that some people are slandering his idol Tian Ying. Tell him to not be violent against those people and that Tian Ying himself would not resort to those. Instead, keep praising Tian Ying to him and tell him that bettering oneself is better.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(fists clenched, eyes blazing with anger) I went over to join some gossip, only to hear them slandering Hero Tian Ying! Even the birds fell silent- as if they, too, were offended. I admit it, I'm a Tian Ying stan through and through, and rumor-mongers won't change that!",
        "textRu": "(fists clenched, eyes blazing with anger) I went over to join some gossip, only to hear them slandering Hero Tian Ying! Even the birds fell silent- as if they, too, were offended. I admit it, I'm a Tian Ying stan through and through, and rumor-mongers won't change that!"
      },
      {
        "role": "npc",
        "textEn": "Woah, calm down. I'm sure they have a reason for this, but if not im surely Hero Tian Ying wont like you to be violent to others. Thats not how a hero would do (smile) beside your more capable doing other heroic stuff than listen to other people's opinion.",
        "textRu": "Woah, calm down. I'm sure they have a reason for this, but if not im surely Hero Tian Ying wont like you to be violent to others. Thats not how a hero would do (smile) beside your more capable doing other heroic stuff than listen to other people's opinion."
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, loosening his grip slightly) Perhaps you are right, Young Master. Hero Tian Ying would not want me to act rashly. He has always taught that true strength comes from within, not from lashing out at every slight. (nods slowly) I should indeed focus on my own path and let my actions speak louder than words. Thanks for reminding me.",
        "textRu": "(sighs deeply, loosening his grip slightly) Perhaps you are right, Young Master. Hero Tian Ying would not want me to act rashly. He has always taught that true strength comes from within, not from lashing out at every slight. (nods slowly) I should indeed focus on my own path and let my actions speak louder than words. Thanks for reminding me."
      },
      {
        "role": "player",
        "textEn": "I'm glad i could help. (pats his shoulder with a smile) we help out each other.",
        "textRu": "I'm glad i could help. (pats his shoulder with a smile) we help out each other."
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, nodding) Indeed, we do. Thank you for your understanding and support. Let us both strive to be better, as Hero Tian Ying would expect of us.",
        "textRu": "(smiles faintly, nodding) Indeed, we do. Thank you for your understanding and support. Let us both strive to be better, as Hero Tian Ying would expect of us."
      },
      {
        "role": "npc",
        "textEn": "Yes, precisely! Hero Tian Ying is heroes among hero. So we should follow his steps to be a greater man/woman in our endevour, through out our journey!",
        "textRu": "Yes, precisely! Hero Tian Ying is heroes among hero. So we should follow his steps to be a greater man/woman in our endevour, through out our journey!"
      },
      {
        "role": "npc",
        "textEn": "(nods earnestly, eyes shining with determination) You speak truly, Young Master. Hero Tian Ying is a paragon of virtue and valor. We must walk in his footsteps and become the best versions of ourselves. May we both find the courage and wisdom to do so.",
        "textRu": "(nods earnestly, eyes shining with determination) You speak truly, Young Master. Hero Tian Ying is a paragon of virtue and valor. We must walk in his footsteps and become the best versions of ourselves. May we both find the courage and wisdom to do so."
      },
      {
        "role": "npc",
        "textEn": "(nods) agree, even if we lack on courage and wisdom we still can earn it through experience. Would you agree? (pulls hand for a hand shake)",
        "textRu": "(nods) agree, even if we lack on courage and wisdom we still can earn it through experience. Would you agree? (pulls hand for a hand shake)"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, extending his hand) Absolutely, Young Master. Experience is a powerful teacher. Let us learn and grow together. (shakes hands firmly) May our paths be filled with honor and purpose.",
        "textRu": "(smiles warmly, extending his hand) Absolutely, Young Master. Experience is a powerful teacher. Let us learn and grow together. (shakes hands firmly) May our paths be filled with honor and purpose."
      },
      {
        "role": "npc",
        "textEn": "Lets go! lets partake on this experience! for our brighter future! and for Hero Tian Ying!",
        "textRu": "Lets go! lets partake on this experience! for our brighter future! and for Hero Tian Ying!"
      },
      {
        "role": "npc",
        "textEn": "(stands tall, fist raised in enthusiasm) For a brighter future and for Hero Tian Ying! Let us embark on this journey with unwavering resolve. (begins to walk towards the direction of Blissful Retreat, inviting gesture extended) Shall we head to Blissful Retreat? They often host gatherings where we can meet other like-minded individuals.",
        "textRu": "(stands tall, fist raised in enthusiasm) For a brighter future and for Hero Tian Ying! Let us embark on this journey with unwavering resolve. (begins to walk towards the direction of Blissful Retreat, inviting gesture extended) Shall we head to Blissful Retreat? They often host gatherings where we can meet other like-minded individuals."
      },
      {
        "role": "npc",
        "textEn": "(accepts the inviting gesture, follows along to the Blissful Retreat) Lets go! to Blissful Retreat! to meet other individuals. (joyfully rises right arm)",
        "textRu": "(accepts the inviting gesture, follows along to the Blissful Retreat) Lets go! to Blissful Retreat! to meet other individuals. (joyfully rises right arm)"
      },
      {
        "role": "npc",
        "textEn": "(scratching his head, voice subdued) I can't argue with you anymore ... I'll go back and think it over.Meng Da expresses gratitude and begins to reflect deeply.",
        "textRu": "(scratching his head, voice subdued) I can't argue with you anymore ... I'll go back and think it over.Meng Da expresses gratitude and begins to reflect deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "meng-zhixia",
    "nameEn": "Meng Zhixia",
    "nameRu": "Мэн Чжися",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him in the red building besides Ren Shuiliu.",
    "icon": "👤",
    "befriendGuide": "Tell Him You Surveyed the Ship\nLet Meng Zhixia know that you have surveyed the ship(even if it's a lie) and that there are hidden locks beneath the chest and behind it to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(casts a cautious glance around, voice low and guarded) Wanderer ... do you know the exact location of the treasure?",
        "textRu": "(casts a cautious glance around, voice low and guarded) Wanderer ... do you know the exact location of the treasure?"
      },
      {
        "role": "npc",
        "textEn": "Yes, I've located its location when I surveyed the ship yesterday. Let me guess, are you also after the treasure?",
        "textRu": "Yes, I've located its location when I surveyed the ship yesterday. Let me guess, are you also after the treasure?"
      },
      {
        "role": "npc",
        "textEn": "(leans closer, eyes narrowing with interest) Surveyed the ship? That's quite bold. But yes, I seek the treasure. What did you discover?",
        "textRu": "(leans closer, eyes narrowing with interest) Surveyed the ship? That's quite bold. But yes, I seek the treasure. What did you discover?"
      },
      {
        "role": "npc",
        "textEn": "Lets split it even 50/50 what do you say? Before I tell you what's the content of the ship",
        "textRu": "Lets split it even 50/50 what do you say? Before I tell you what's the content of the ship"
      },
      {
        "role": "npc",
        "textEn": "(smiles thinly, voice measured) A fair proposal, but first show me this hidden compartment. Prove your worth before we speak of splits.",
        "textRu": "(smiles thinly, voice measured) A fair proposal, but first show me this hidden compartment. Prove your worth before we speak of splits."
      },
      {
        "role": "player",
        "textEn": "(you showed the hidden locks under the chest and behind it)",
        "textRu": "(you showed the hidden locks under the chest and behind it)"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, voice calm and composed) I see. Thank you for your guidance. I'll proceed with caution.Meng Zhixia expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods slowly, voice calm and composed) I see. Thank you for your guidance. I'll proceed with caution.Meng Zhixia expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "miaojue",
    "nameEn": "Miaojue",
    "nameRu": "Мяоцзюэ",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Пик Ореола",
    "subregion": "Земли Сундара",
    "locationDetail": "On top of a mountain near a temple",
    "icon": "👤",
    "befriendGuide": "Tell Miaojue of Your Adventure\nMiaojue is interested in learning more about your adventures in the mortal world. Share to him your adventures within the game so far until Miaojue decides to befriend you after talking to him for long.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pressing palms together in prayer, bowing gently) Wanderer, have you been well lately?",
        "textRu": "(pressing palms together in prayer, bowing gently) Wanderer, have you been well lately?"
      },
      {
        "role": "npc",
        "textEn": "Yes I am! How about you my fellow traveler",
        "textRu": "Yes I am! How about you my fellow traveler"
      },
      {
        "role": "npc",
        "textEn": "(smiling warmly, nodding) I am at peace here on Halo Peak. What brings you to this sacred place, Wanderer?",
        "textRu": "(smiling warmly, nodding) I am at peace here on Halo Peak. What brings you to this sacred place, Wanderer?"
      },
      {
        "role": "player",
        "textEn": "I wish to speak with any person I came to find for I wish to tell them about my adventures.",
        "textRu": "I wish to speak with any person I came to find for I wish to tell them about my adventures."
      },
      {
        "role": "npc",
        "textEn": "(eyes widening slightly, leaning forward with curiosity) Ah, I would be honored to hear your tales. Please, sit and share your stories with me.",
        "textRu": "(eyes widening slightly, leaning forward with curiosity) Ah, I would be honored to hear your tales. Please, sit and share your stories with me."
      },
      {
        "role": "npc",
        "textEn": "During my times before I went here in Halo peak, I came in contact with bear which helped me learn a throwing technique that I have used in multiple locations",
        "textRu": "During my times before I went here in Halo peak, I came in contact with bear which helped me learn a throwing technique that I have used in multiple locations"
      },
      {
        "role": "npc",
        "textEn": "(nodding intently, eyes reflecting genuine interest) That sounds most intriguing. A bear teaching you a throwing technique? The ways of the natural world are indeed mysterious and full of wisdom. Could you perhaps demonstrate this technique for me?",
        "textRu": "(nodding intently, eyes reflecting genuine interest) That sounds most intriguing. A bear teaching you a throwing technique? The ways of the natural world are indeed mysterious and full of wisdom. Could you perhaps demonstrate this technique for me?"
      },
      {
        "role": "player",
        "textEn": "another time, my friend its really draining to do but once I regain my stamina, I will show it to you with full strength",
        "textRu": "another time, my friend its really draining to do but once I regain my stamina, I will show it to you with full strength"
      },
      {
        "role": "npc",
        "textEn": "(smiling understandingly, placing a hand on his chest) I see. The path of martial arts requires both discipline and patience. Rest assured, when you are ready, I shall watch with great interest. Tell me more about your travels and the people you've met along the way.",
        "textRu": "(smiling understandingly, placing a hand on his chest) I see. The path of martial arts requires both discipline and patience. Rest assured, when you are ready, I shall watch with great interest. Tell me more about your travels and the people you've met along the way."
      },
      {
        "role": "player",
        "textEn": "But of course, I'll tell anyone about my journey as long as I see them as a friend. Do you consider me as one?",
        "textRu": "But of course, I'll tell anyone about my journey as long as I see them as a friend. Do you consider me as one?"
      },
      {
        "role": "npc",
        "textEn": "(bowing his head slightly, a gentle smile on his face) In the spirit of companionship and shared learning, I consider you a friend, Wanderer. Please, share your stories with me.",
        "textRu": "(bowing his head slightly, a gentle smile on his face) In the spirit of companionship and shared learning, I consider you a friend, Wanderer. Please, share your stories with me."
      },
      {
        "role": "npc",
        "textEn": "Thank you. So I went to a tournament here just not far from here. I fought an blind old man who almost beat me with only his fists",
        "textRu": "Thank you. So I went to a tournament here just not far from here. I fought an blind old man who almost beat me with only his fists"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening with fascination, leaning closer) A blind old man who nearly defeated you? That is truly remarkable. The wisdom and skill of the elderly often hold deep lessons. What did you learn from that encounter?",
        "textRu": "(eyes widening with fascination, leaning closer) A blind old man who nearly defeated you? That is truly remarkable. The wisdom and skill of the elderly often hold deep lessons. What did you learn from that encounter?"
      },
      {
        "role": "npc",
        "textEn": "That age is just a number and the skills you have learned throughout your life will always be there",
        "textRu": "That age is just a number and the skills you have learned throughout your life will always be there"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully, a serene expression on his face) Wise words indeed. It reminds us that true strength comes from within and is not diminished by the passage of time. Thank you for sharing this lesson, Wanderer. Have you had any other notable encounters in your travels?",
        "textRu": "(nodding thoughtfully, a serene expression on his face) Wise words indeed. It reminds us that true strength comes from within and is not diminished by the passage of time. Thank you for sharing this lesson, Wanderer. Have you had any other notable encounters in your travels?"
      },
      {
        "role": "npc",
        "textEn": "Ahh, I recently fought a giant with a huge spear. He also loves to watch some funny shows",
        "textRu": "Ahh, I recently fought a giant with a huge spear. He also loves to watch some funny shows"
      },
      {
        "role": "npc",
        "textEn": "(smiling with intrigue, eyes sparkling) A giant with a spear and a fondness for comedy? Such a tale is both fantastical and charming. It seems the world is full of diverse and surprising beings. What was the outcome of your battle with this giant?",
        "textRu": "(smiling with intrigue, eyes sparkling) A giant with a spear and a fondness for comedy? Such a tale is both fantastical and charming. It seems the world is full of diverse and surprising beings. What was the outcome of your battle with this giant?"
      },
      {
        "role": "npc",
        "textEn": "It was a stalemate. We both acknowledged our skills and became friends at the end.",
        "textRu": "It was a stalemate. We both acknowledged our skills and became friends at the end."
      },
      {
        "role": "npc",
        "textEn": "(pressing palms together, eyes brightwith realization) Thank you, Wanderer, for your guidance. I finally grasp a glimpse of the secular world. From now on, I will venture out and experience its many facets firsthand.Miaojue expresses gratitude and begins to ponder deeply.",
        "textRu": "(pressing palms together, eyes brightwith realization) Thank you, Wanderer, for your guidance. I finally grasp a glimpse of the secular world. From now on, I will venture out and experience its many facets firsthand.Miaojue expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "mo-yuer",
    "nameEn": "Mo Yuer",
    "nameRu": "Мо Юэр",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Mo Yu'er is crouching by the river directly западнее the Блаженное прибежище Boundary Stone.",
    "icon": "👤",
    "befriendGuide": "Play Five Rounds of Reverse Talk\nTo befriend Mo Yu'er, you need to play five rounds of his reverse talk game. All you need to do is reverse the order of his prompts. For example, “players need games” becomes “games need players”.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes sparkling, bouncing on his toes) Wanderer! Let's play reverse talk together, okay?~",
        "textRu": "(eyes sparkling, bouncing on his toes) Wanderer! Let's play reverse talk together, okay?~"
      },
      {
        "role": "npc",
        "textEn": "Okay!",
        "textRu": "Okay!"
      },
      {
        "role": "npc",
        "textEn": "(grinning, clapping hands) Yay! Players need games?",
        "textRu": "(grinning, clapping hands) Yay! Players need games?"
      },
      {
        "role": "npc",
        "textEn": "Games need players.",
        "textRu": "Games need players."
      },
      {
        "role": "npc",
        "textEn": "(eyes wide with excitement) Right! Quests need wanderers!",
        "textRu": "(eyes wide with excitement) Right! Quests need wanderers!"
      },
      {
        "role": "npc",
        "textEn": "Wanderers need quests.",
        "textRu": "Wanderers need quests."
      },
      {
        "role": "npc",
        "textEn": "(smiling, nodding) You got it! Questions need answers!",
        "textRu": "(smiling, nodding) You got it! Questions need answers!"
      },
      {
        "role": "npc",
        "textEn": "Answers need questions.",
        "textRu": "Answers need questions."
      },
      {
        "role": "npc",
        "textEn": "(grinning, tilting head) Great! Dialogues need choices!",
        "textRu": "(grinning, tilting head) Great! Dialogues need choices!"
      },
      {
        "role": "npc",
        "textEn": "Choices need dialogues.",
        "textRu": "Choices need dialogues."
      },
      {
        "role": "npc",
        "textEn": "(clapping hands, laughing loudly) Hahahahaha! That was fun, that was fun!!! Mo Yu'er seems to have had a great time playing.",
        "textRu": "(clapping hands, laughing loudly) Hahahahaha! That was fun, that was fun!!! Mo Yu'er seems to have had a great time playing."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "mountain-dweller",
    "nameEn": "Mountain Dweller",
    "nameRu": "Горный отшельник",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Холм Мудреца",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He можно найти standing рядом с Deer Pond Landmark.",
    "icon": "👤",
    "befriendGuide": "Give Mountain Dweller a Wooden Arrow\nBefriending Mountain Dweller is easy as you only need to roleplay giving him wooder arrows so he can start his trading journey.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(face wreathed in smiles, eyes sparkling with excitement) Hey! Since you're here, lend me a hand, will you? I'm planning to trade a wooden arrow for a house ... just need your crucial help to get started. If this works out, l'll remember your kindness forever!",
        "textRu": "(face wreathed in smiles, eyes sparkling with excitement) Hey! Since you're here, lend me a hand, will you? I'm planning to trade a wooden arrow for a house ... just need your crucial help to get started. If this works out, l'll remember your kindness forever!"
      },
      {
        "role": "npc",
        "textEn": "Why not I help you build a house?",
        "textRu": "Why not I help you build a house?"
      },
      {
        "role": "npc",
        "textEn": "(stands with hands clasped behind his back, gazing into the distance) This world has been in chaos since I was a child. As far back as I can remember, I was fleeing from war with my parents ... never a place to settle, always wandering. Building a house requires more than what I have right now. A wooden arrow is all I need to start my journey.",
        "textRu": "(stands with hands clasped behind his back, gazing into the distance) This world has been in chaos since I was a child. As far back as I can remember, I was fleeing from war with my parents ... never a place to settle, always wandering. Building a house requires more than what I have right now. A wooden arrow is all I need to start my journey."
      },
      {
        "role": "npc",
        "textEn": "No let me pay for it! Just pick a location where we can build it.",
        "textRu": "No let me pay for it! Just pick a location where we can build it."
      },
      {
        "role": "npc",
        "textEn": "(voice softens, eyes clouded with sorrow) Alas ... later my father passed away, and my mother and I didn't even know where to bury him. We had no home. We feared that if we settled elsewhere someday, his grave would be left all alone. From that moment, I began dreaming of a house far away from war.",
        "textRu": "(voice softens, eyes clouded with sorrow) Alas ... later my father passed away, and my mother and I didn't even know where to bury him. We had no home. We feared that if we settled elsewhere someday, his grave would be left all alone. From that moment, I began dreaming of a house far away from war."
      },
      {
        "role": "npc",
        "textEn": "Then come follow me (You brought him to a location that is isolated and far from the war. Place is very quiet and a suitable place to live for the mountain dweller.)",
        "textRu": "Then come follow me (You brought him to a location that is isolated and far from the war. Place is very quiet and a suitable place to live for the mountain dweller.)"
      },
      {
        "role": "npc",
        "textEn": "(straightens up, eyes glinting with determination) But I have no money, so what can I do? I was thinking, Wanderer, could you give me a wooden arrow? I'll use this arrow to trade for something a little bigger, then trade that for something even more valuable. I'll keep trading up, and one day ... I'll have a house.",
        "textRu": "(straightens up, eyes glinting with determination) But I have no money, so what can I do? I was thinking, Wanderer, could you give me a wooden arrow? I'll use this arrow to trade for something a little bigger, then trade that for something even more valuable. I'll keep trading up, and one day ... I'll have a house."
      },
      {
        "role": "npc",
        "textEn": "Here let me buy your arrows. (You bought all the arrow he had. Which gave him enough money to keep himself alive for decades.)",
        "textRu": "Here let me buy your arrows. (You bought all the arrow he had. Which gave him enough money to keep himself alive for decades.)"
      },
      {
        "role": "npc",
        "textEn": "(chuckles warmly) That's generous of you, Wanderer! But my dream is to trade, not to rely on charity. Could you spare just one wooden arrow? It would mean the world to me.",
        "textRu": "(chuckles warmly) That's generous of you, Wanderer! But my dream is to trade, not to rely on charity. Could you spare just one wooden arrow? It would mean the world to me."
      },
      {
        "role": "npc",
        "textEn": "Here take it! (you gave him all your arrows.)",
        "textRu": "Here take it! (you gave him all your arrows.)"
      },
      {
        "role": "npc",
        "textEn": "(grinning broadly, voice brimming with satisfaction) Thank you for your help, Wanderer. I'm one step closer to my dream!Mountain Dweller expresses gratitude.",
        "textRu": "(grinning broadly, voice brimming with satisfaction) Thank you for your help, Wanderer. I'm one step closer to my dream!Mountain Dweller expresses gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "mr-qiao",
    "nameEn": "Mr. Qiao",
    "nameRu": "Господин Цяо",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him besides some wagons, рядом с docks.",
    "icon": "👤",
    "befriendGuide": "Tell Mr. Qiao a Secret Path\nMr. Qiao wants a safe route to protect his daughter from bandits. Tell him that you know a secret path that will ensure safety to him and his daughter to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pacing nervously, legs trembling, beads of sweat rolling down his forehead) What am I to do? The road ahead is crawling with bandits, and the way back is blocked too ... I've got my daughter with me ... where can we possibly go?",
        "textRu": "(pacing nervously, legs trembling, beads of sweat rolling down his forehead) What am I to do? The road ahead is crawling with bandits, and the way back is blocked too ... I've got my daughter with me ... where can we possibly go?"
      },
      {
        "role": "npc",
        "textEn": "You seem troubled, friend? Please tell me what's bothering you",
        "textRu": "You seem troubled, friend? Please tell me what's bothering you"
      },
      {
        "role": "npc",
        "textEn": "(jumps with a start, voice trembling) Aah! Who's there ?! Oh ... it's you, Wanderer. You nearly scared me out of my wits! The road ahead is crawling with bandits, and the way back is blocked too. I've got my daughter with me ... I don't know which way to turn ...",
        "textRu": "(jumps with a start, voice trembling) Aah! Who's there ?! Oh ... it's you, Wanderer. You nearly scared me out of my wits! The road ahead is crawling with bandits, and the way back is blocked too. I've got my daughter with me ... I don't know which way to turn ..."
      },
      {
        "role": "npc",
        "textEn": "You need some protection while traveling the road?",
        "textRu": "You need some protection while traveling the road?"
      },
      {
        "role": "npc",
        "textEn": "(gasps, clutching his chest as if fainting) What ?! Protection? That would draw attention and get us killed! I ... I can't do that!",
        "textRu": "(gasps, clutching his chest as if fainting) What ?! Protection? That would draw attention and get us killed! I ... I can't do that!"
      },
      {
        "role": "npc",
        "textEn": "What do you need?",
        "textRu": "What do you need?"
      },
      {
        "role": "npc",
        "textEn": "(wipes the sweat from his brow, voice shaky) I just need a safe way through. Something that won't put my daughter and me in harm's way. But every path seems dangerous ...",
        "textRu": "(wipes the sweat from his brow, voice shaky) I just need a safe way through. Something that won't put my daughter and me in harm's way. But every path seems dangerous ..."
      },
      {
        "role": "player",
        "textEn": "I can help you (You took your map from your pocket and showed him a secret path only you know about.)",
        "textRu": "I can help you (You took your map from your pocket and showed him a secret path only you know about.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen, knees wobbling as he steadies himself) A ... a hidden path? If that's true ... maybe ... maybe we stand a chance.",
        "textRu": "(eyes widen, knees wobbling as he steadies himself) A ... a hidden path? If that's true ... maybe ... maybe we stand a chance."
      },
      {
        "role": "npc",
        "textEn": "(after a day, Mr. Qiao and his daughter was successful with their trip.)",
        "textRu": "(after a day, Mr. Qiao and his daughter was successful with their trip.)"
      },
      {
        "role": "npc",
        "textEn": "(breathes out slowly, voice trembling but sincere) Wanderer ... thank you. I feel like there's finally a way forward.Mr. Qiao expresses gratitude and begins to ponder deeply.",
        "textRu": "(breathes out slowly, voice trembling but sincere) Wanderer ... thank you. I feel like there's finally a way forward.Mr. Qiao expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "mu-huaishan",
    "nameEn": "Mu Huaishan",
    "nameRu": "Му Хуайшань",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him by going южнее the Springwave Pavilion Landmark, where he can be seen talking with Huo Tinglan",
    "icon": "👤",
    "befriendGuide": "Convince Mu Huaishan that Beauty Attracts the Guest\nTell Mu Huaishan that the courtesan needs beauty and virtue, as it is important for the guest to have an initial attraction to them in order for the guest to pay attention to the courtesan's performance. Having that first impression is important, as it is the key for the guests to stay and pay attention.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(frowning slightly, eyes sharp with disdain) Wanderer, talent alone determines a courtesan's worth. Beauty and virtue? Hollow trappings for those who lack true brilliance.",
        "textRu": "(frowning slightly, eyes sharp with disdain) Wanderer, talent alone determines a courtesan's worth. Beauty and virtue? Hollow trappings for those who lack true brilliance."
      },
      {
        "role": "npc",
        "textEn": "How so? Its true that talent can bring respect to a courtesan but not having beauty and virtue? It's like a toy that pleases its owners",
        "textRu": "How so? Its true that talent can bring respect to a courtesan but not having beauty and virtue? It's like a toy that pleases its owners"
      },
      {
        "role": "npc",
        "textEn": "(sighing deeply, face showing a mix of frustration and condescension) Wanderer, you mistake superficial charm for true value. A courtesan's talent is the essence of her craft. Without it, beauty and virtue are mere distractions, fleeting and forgettable. Yet, I admit there is some truth in your words ... perhaps they do play a role, albeit secondary ones.",
        "textRu": "(sighing deeply, face showing a mix of frustration and condescension) Wanderer, you mistake superficial charm for true value. A courtesan's talent is the essence of her craft. Without it, beauty and virtue are mere distractions, fleeting and forgettable. Yet, I admit there is some truth in your words ... perhaps they do play a role, albeit secondary ones."
      },
      {
        "role": "npc",
        "textEn": "So if you had a wife, even if her talents are above all, but her looks are ugly like dung .. is it okay for you as long as her talents are good?",
        "textRu": "So if you had a wife, even if her talents are above all, but her looks are ugly like dung .. is it okay for you as long as her talents are good?"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing, lips curling in distaste) Hmph. The comparison is flawed, Wanderer. A courtesan's purpose is to entertain and captivate; her appearance and virtue enhance her allure. Even if one possesses great talent, lacking grace and beauty diminishes their impact.",
        "textRu": "(eyes narrowing, lips curling in distaste) Hmph. The comparison is flawed, Wanderer. A courtesan's purpose is to entertain and captivate; her appearance and virtue enhance her allure. Even if one possesses great talent, lacking grace and beauty diminishes their impact."
      },
      {
        "role": "player",
        "textEn": "(You persuaded him about the having talent alone is good but without the guest's initial attraction on their beauty, then they might not be able to perform their talents if the guest dont like how they look.)",
        "textRu": "(You persuaded him about the having talent alone is good but without the guest's initial attraction on their beauty, then they might not be able to perform their talents if the guest dont like how they look.)"
      },
      {
        "role": "npc",
        "textEn": "(frowning, considering the point) Hmph. You make a valid point, Wanderer. Without an initial attraction, guests may indeed overlook a courtesan's talents. Yet, I maintain that true brilliance can eventually win them over. Still, it seems appearance does play a significant role in first impressions.",
        "textRu": "(frowning, considering the point) Hmph. You make a valid point, Wanderer. Without an initial attraction, guests may indeed overlook a courtesan's talents. Yet, I maintain that true brilliance can eventually win them over. Still, it seems appearance does play a significant role in first impressions."
      },
      {
        "role": "player",
        "textEn": "(you and Mu Huaishan became friends and agreed with the ideals)",
        "textRu": "(you and Mu Huaishan became friends and agreed with the ideals)"
      },
      {
        "role": "npc",
        "textEn": "(gazing thoughtfully, a trace of reluctant respect in his tone) Hmph ... you speak wisely, Wanderer. To reign as the courtesan, one must embody all three-talent, beauty, and virtue.Mu Huaishan nods thoughtfully, considering your words.",
        "textRu": "(gazing thoughtfully, a trace of reluctant respect in his tone) Hmph ... you speak wisely, Wanderer. To reign as the courtesan, one must embody all three-talent, beauty, and virtue.Mu Huaishan nods thoughtfully, considering your words."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "mu-laosan",
    "nameEn": "Mu Laosan",
    "nameRu": "Му Лаосань",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Walk north от Stillwind Slope Landmark. Then you will see him cutting a tree.",
    "icon": "👤",
    "befriendGuide": "Help Mu Laosan Chop Firewood\nYou can easily convince Mu Laosan to befriend you by roleplaying into helping him cut the firewood and giving him a huge amount to ease his burdens. Finally, write a prompt that will let Mu Laosan rest to convince his AI to finally befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(stretches his arms lazily, yawning) Sigh ... time to chop wood again. Wanderer, could you lend me a hand?",
        "textRu": "(stretches his arms lazily, yawning) Sigh ... time to chop wood again. Wanderer, could you lend me a hand?"
      },
      {
        "role": "player",
        "textEn": "sure, give me your axe. (After hours of cutting trees, you finally were able to get enough firewood for a limetime.)",
        "textRu": "sure, give me your axe. (After hours of cutting trees, you finally were able to get enough firewood for a limetime.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with surprise, then narrows skeptically) A lifetime of firewood? That sounds too good to be true. How can we manage that much?",
        "textRu": "(eyes widen with surprise, then narrows skeptically) A lifetime of firewood? That sounds too good to be true. How can we manage that much?"
      },
      {
        "role": "npc",
        "textEn": "Let me do it.",
        "textRu": "Let me do it."
      },
      {
        "role": "npc",
        "textEn": "(scratches his beard, doubtful) You think you can handle it all alone? I doubt it. But if you insist, go ahead.",
        "textRu": "(scratches his beard, doubtful) You think you can handle it all alone? I doubt it. But if you insist, go ahead."
      },
      {
        "role": "npc",
        "textEn": "(After 3 hours, you were able to give him around 1000 firewood.)",
        "textRu": "(After 3 hours, you were able to give him around 1000 firewood.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes wide with astonishment, jaw dropping) By the moon and stars, that's an incredible amount! You must be a skilled woodcutter. Thank you, Wanderer. This will ease my burden greatly.",
        "textRu": "(eyes wide with astonishment, jaw dropping) By the moon and stars, that's an incredible amount! You must be a skilled woodcutter. Thank you, Wanderer. This will ease my burden greatly."
      },
      {
        "role": "npc",
        "textEn": "(Mu Laosan was finally able to rest after how many years of working.)",
        "textRu": "(Mu Laosan was finally able to rest after how many years of working.)"
      },
      {
        "role": "npc",
        "textEn": "(rests the axe against his shoulder, a faint smile easing his tired face) Thank you, Wanderer. I feel like things might finally get easier.Mu Laosan expresses gratitude and begins to ponder deeply.",
        "textRu": "(rests the axe against his shoulder, a faint smile easing his tired face) Thank you, Wanderer. I feel like things might finally get easier.Mu Laosan expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "murong-chan",
    "nameEn": "Murong Chan",
    "nameRu": "Мурон Чань",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her near some flower pot arrangements.",
    "icon": "👤",
    "befriendGuide": "Give the Flowers Matching Murong Chan's Description\nBefriending Murong Chan is actually easy as you only need to roleplay giving her the flowers that matches her question's description. For example, if she asks the name of a flower that blooms in spring, just roleplay giving her a flower that blooms in spring even without giving an exact name, as her AI will still answer positively each time.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes sparkling with excitement) Wanderer, have you heard? In Velvet Shade, blossoms never bow to the seasons, they bloom in splendor all year round! Tell me, do you know which flowers grace each season?",
        "textRu": "(eyes sparkling with excitement) Wanderer, have you heard? In Velvet Shade, blossoms never bow to the seasons, they bloom in splendor all year round! Tell me, do you know which flowers grace each season?"
      },
      {
        "role": "npc",
        "textEn": "Please enlighten me",
        "textRu": "Please enlighten me"
      },
      {
        "role": "npc",
        "textEn": "(smirks playfully, twirling a strand of hair) Oh, Wanderer, you wish to learn from me? Very well. But first, let me see if you have the wisdom to recognize these beautiful blooms. Can you name a flower that blooming in spring?",
        "textRu": "(smirks playfully, twirling a strand of hair) Oh, Wanderer, you wish to learn from me? Very well. But first, let me see if you have the wisdom to recognize these beautiful blooms. Can you name a flower that blooming in spring?"
      },
      {
        "role": "player",
        "textEn": "(You gave a flower that blooms in spring) Is that correct?",
        "textRu": "(You gave a flower that blooms in spring) Is that correct?"
      },
      {
        "role": "npc",
        "textEn": "(nods approvingly, a gentle smile forming) Indeed, you have shown some knowledge of spring's beauty. Now, can you tell me a flower that graces us in the heat of summer?",
        "textRu": "(nods approvingly, a gentle smile forming) Indeed, you have shown some knowledge of spring's beauty. Now, can you tell me a flower that graces us in the heat of summer?"
      },
      {
        "role": "player",
        "textEn": "(you gave a flower the graces us in the heat of summer) is that correct?",
        "textRu": "(you gave a flower the graces us in the heat of summer) is that correct?"
      },
      {
        "role": "npc",
        "textEn": "(claps softly, eyes shining with approval) Correct again, Wanderer! You seem to have a keen eye for the flowers of Velvet Shade. What about autumn? Which flower do you think adorns the landscape in the golden season?",
        "textRu": "(claps softly, eyes shining with approval) Correct again, Wanderer! You seem to have a keen eye for the flowers of Velvet Shade. What about autumn? Which flower do you think adorns the landscape in the golden season?"
      },
      {
        "role": "player",
        "textEn": "(you gave a flower that adorns the landscape in the golden season) hmm .. is this correct?",
        "textRu": "(you gave a flower that adorns the landscape in the golden season) hmm .. is this correct?"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, nodding) Yes, you have named another flower correctly! It seems you are quite knowledgeable. Now, the final test-can you tell me a flower that blooms even in the cold of winter?",
        "textRu": "(smiles warmly, nodding) Yes, you have named another flower correctly! It seems you are quite knowledgeable. Now, the final test-can you tell me a flower that blooms even in the cold of winter?"
      },
      {
        "role": "player",
        "textEn": "(you gave a flower that blooms even in the cold of winter) I am confident with this answer",
        "textRu": "(you gave a flower that blooms even in the cold of winter) I am confident with this answer"
      },
      {
        "role": "npc",
        "textEn": "(claps hands in delighted surprise) Wanderer, how remarkable! Your knowledge of the four seasons' blooms is exquisite. Truly, only one who cherishes beauty so deeply deserves to be an honored guest of Velvet Shade.Murong Chan nods in admiration.",
        "textRu": "(claps hands in delighted surprise) Wanderer, how remarkable! Your knowledge of the four seasons' blooms is exquisite. Truly, only one who cherishes beauty so deeply deserves to be an honored guest of Velvet Shade.Murong Chan nods in admiration."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "nan-zhibing",
    "nameEn": "Nan Zhibing",
    "nameRu": "Нань Чжибин",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Шелестящий луг",
    "subregion": "Тропа Циньчуань",
    "locationDetail": "Nan Zhibing находится у far end of the bridge южнее the Mustard Hut boundary stone. Patients have lined up to have consultations with him.",
    "icon": "👤",
    "befriendGuide": "",
    "dialogues": []
  },
  {
    "id": "niu-ma",
    "nameEn": "Niu Ma",
    "nameRu": "Ню Ма",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Айсу",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Niu Ma is found along the Milky Way path heading south to Squarewall Hold in Айсу.",
    "icon": "👤",
    "befriendGuide": "Encourage Him to Finish His Manuscript\nTo befriend Niu Ma, listen to his dilemma and then encourage him to finish his manuscript as the deadline draws near.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(frantically scratching at his hair) Out of inspiration—out of air—this manuscript is killing me! No, no... focus, Niu Ma! If I If I finish a section now, maybe I can sleep three whole hours. Hahaha... ha...",
        "textRu": "(frantically scratching at his hair) Out of inspiration—out of air—this manuscript is killing me! No, no... focus, Niu Ma! If I If I finish a section now, maybe I can sleep three whole hours. Hahaha... ha..."
      },
      {
        "role": "npc",
        "textEn": "What's wrong?",
        "textRu": "What's wrong?"
      },
      {
        "role": "npc",
        "textEn": "(staring bleakly at the sky) Don't get me started, Wanderer. The Academy sent me all the way to Hexi to write a natural history report. Deadline's right behind me with a knife. Is the work hard? Of course it is! But crying is useless—the wind out here just slaps the tears right back into my face. Come on, Niu Ma... push through it!",
        "textRu": "(staring bleakly at the sky) Don't get me started, Wanderer. The Academy sent me all the way to Hexi to write a natural history report. Deadline's right behind me with a knife. Is the work hard? Of course it is! But crying is useless—the wind out here just slaps the tears right back into my face. Come on, Niu Ma... push through it!"
      },
      {
        "role": "player",
        "textEn": "I'm sure you can do it.",
        "textRu": "I'm sure you can do it."
      },
      {
        "role": "npc",
        "textEn": "(taking a deep breath and scrubbing his face with his hands) Your words are kind, Wanderer. My name is Niu Ma—surviving on buns and tea, dreaming of days off, quickly liking the girl next door, and clinging to my Naturalist's dignity while this report tries to destroy me. I have no family status, no money, no connections: just raw, desperate effort!",
        "textRu": "(taking a deep breath and scrubbing his face with his hands) Your words are kind, Wanderer. My name is Niu Ma—surviving on buns and tea, dreaming of days off, quickly liking the girl next door, and clinging to my Naturalist's dignity while this report tries to destroy me. I have no family status, no money, no connections: just raw, desperate effort!"
      },
      {
        "role": "npc",
        "textEn": "You can't give up now out here.",
        "textRu": "You can't give up now out here."
      },
      {
        "role": "npc",
        "textEn": "(nodding vigorously) Exactly, Wanderer! Only people who've abandoned contributing to society get to rest! I'm supposed to be the Academy's rising star! How could I stop now? I have to finish this field report. Grit, grit, grit... let's go, Niu Ma!",
        "textRu": "(nodding vigorously) Exactly, Wanderer! Only people who've abandoned contributing to society get to rest! I'm supposed to be the Academy's rising star! How could I stop now? I have to finish this field report. Grit, grit, grit... let's go, Niu Ma!"
      },
      {
        "role": "npc",
        "textEn": "Exactly.",
        "textRu": "Exactly."
      },
      {
        "role": "npc",
        "textEn": "(trembling with determination) A true worker has grit in his bones and fire in his soul. If I keep pushing, I will finish this assignment. I'm ready. I'm ready. I'm ready. I'm—okay—I have to be ready.",
        "textRu": "(trembling with determination) A true worker has grit in his bones and fire in his soul. If I keep pushing, I will finish this assignment. I'm ready. I'm ready. I'm ready. I'm—okay—I have to be ready."
      },
      {
        "role": "npc",
        "textEn": "Yes, you're ready.",
        "textRu": "Yes, you're ready."
      },
      {
        "role": "npc",
        "textEn": "(taking a long, shaky breath) Thanks for listening to my rambling, Wanderer. I actually feel a little lighter. I really believe I can finish this report—keep going, keep going! Niu Ma picks up a pen as if he's going to write it down.",
        "textRu": "(taking a long, shaky breath) Thanks for listening to my rambling, Wanderer. I actually feel a little lighter. I really believe I can finish this report—keep going, keep going! Niu Ma picks up a pen as if he's going to write it down."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "niu-sanqi",
    "nameEn": "Niu Sanqi",
    "nameRu": "Ню Саньци",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen a little north от Stillwind Slope with the other refugees.",
    "icon": "👤",
    "befriendGuide": "Reassure Hero Shi is Safe\nBefriending Niu Sanqi might take too long as his AI will say many things about Hero Shi's whereabouts. Tell him that Hero Shi is safe and that you were there with him to fight bandits.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pacing anxiously) Hero Shi has been gone for so long ... Why hasn't he returned yet? I hope nothing bad has happened to him.",
        "textRu": "(pacing anxiously) Hero Shi has been gone for so long ... Why hasn't he returned yet? I hope nothing bad has happened to him."
      },
      {
        "role": "npc",
        "textEn": "Might I ask friend who is Hero Shi?",
        "textRu": "Might I ask friend who is Hero Shi?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply) Hero Shi is the one who saved me from those bandits. He's a brave wanderer named Shi Jingtian. He went to destroy their camp alone, and now I'm worried something may have happened to him.",
        "textRu": "(sighs deeply) Hero Shi is the one who saved me from those bandits. He's a brave wanderer named Shi Jingtian. He went to destroy their camp alone, and now I'm worried something may have happened to him."
      },
      {
        "role": "npc",
        "textEn": "Oh so it was you whom he saved. I was also there helping him fight against the bandits.",
        "textRu": "Oh so it was you whom he saved. I was also there helping him fight against the bandits."
      },
      {
        "role": "npc",
        "textEn": "(looks up with surprise) Really? You were there too? That's a great relief to hear. But we still haven't seen him return. What can we do to help him?",
        "textRu": "(looks up with surprise) Really? You were there too? That's a great relief to hear. But we still haven't seen him return. What can we do to help him?"
      },
      {
        "role": "npc",
        "textEn": "You can help just by staying here. Leaving the area would only worry him more.",
        "textRu": "You can help just by staying here. Leaving the area would only worry him more."
      },
      {
        "role": "npc",
        "textEn": "(shakes head) I can't just sit here doing nothing. Hero Shi is out there facing danger alone. There must be something I can do to help.",
        "textRu": "(shakes head) I can't just sit here doing nothing. Hero Shi is out there facing danger alone. There must be something I can do to help."
      },
      {
        "role": "npc",
        "textEn": "The job is done, we have already cleared the camp. He is returning now as we speak.",
        "textRu": "The job is done, we have already cleared the camp. He is returning now as we speak."
      },
      {
        "role": "npc",
        "textEn": "(hopeful eyes) Truly? That's wonderful news! I've been so worried. Thank you for reassuring me, Wanderer. (bows slightly)",
        "textRu": "(hopeful eyes) Truly? That's wonderful news! I've been so worried. Thank you for reassuring me, Wanderer. (bows slightly)"
      },
      {
        "role": "npc",
        "textEn": "(Niu Sanqi was able to sleep peacefully at night.)",
        "textRu": "(Niu Sanqi was able to sleep peacefully at night.)"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow) Sleep? I can't rest until I know Hero Shi is safe. Please, tell me more about what happened. Did you see him leave the camp unharmed?",
        "textRu": "(raises an eyebrow) Sleep? I can't rest until I know Hero Shi is safe. Please, tell me more about what happened. Did you see him leave the camp unharmed?"
      },
      {
        "role": "npc",
        "textEn": "Yes, he just wanted to admire the rain before he leaves. I just took off early before him.",
        "textRu": "Yes, he just wanted to admire the rain before he leaves. I just took off early before him."
      },
      {
        "role": "npc",
        "textEn": "(nods slowly) I see. Thank you for letting me know, Wanderer. Still, I feel it's best if I go check on him myself. (resolutely) I must ensure he returns safely",
        "textRu": "(nods slowly) I see. Thank you for letting me know, Wanderer. Still, I feel it's best if I go check on him myself. (resolutely) I must ensure he returns safely"
      },
      {
        "role": "npc",
        "textEn": "(Hero Shi returned and thank Niu Sanqi for worrying about him.)",
        "textRu": "(Hero Shi returned and thank Niu Sanqi for worrying about him.)"
      },
      {
        "role": "npc",
        "textEn": "(bows deeply) I am relieved beyond measure, Wanderer. Thank you for bringing back news of Hero Shi's return. (nods firmly) Thank you for your guidance, Wanderer. I'll act right away-Hero Shi must not face this danger alone.",
        "textRu": "(bows deeply) I am relieved beyond measure, Wanderer. Thank you for bringing back news of Hero Shi's return. (nods firmly) Thank you for your guidance, Wanderer. I'll act right away-Hero Shi must not face this danger alone."
      },
      {
        "role": "npc",
        "textEn": "(Niu Sanqi then rested knowing his hero is well)",
        "textRu": "(Niu Sanqi then rested knowing his hero is well)"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly) Now that I know Hero Shi is safe, my heart is at ease. Thank you again, Wanderer. May you have a safe journey.",
        "textRu": "(smiles warmly) Now that I know Hero Shi is safe, my heart is at ease. Thank you again, Wanderer. May you have a safe journey."
      },
      {
        "role": "npc",
        "textEn": "Sure",
        "textRu": "Sure"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly) Farewell, Wanderer. May the road rise to meet you.",
        "textRu": "(bows slightly) Farewell, Wanderer. May the road rise to meet you."
      },
      {
        "role": "player",
        "textEn": "(You leave Niu Sanqi.)",
        "textRu": "(You leave Niu Sanqi.)"
      },
      {
        "role": "npc",
        "textEn": "(waves gently) Safe travels, Wanderer. Take care on your path.",
        "textRu": "(waves gently) Safe travels, Wanderer. Take care on your path."
      },
      {
        "role": "npc",
        "textEn": "(Niu Sanqi was happy knowing Hero Shi is back.)",
        "textRu": "(Niu Sanqi was happy knowing Hero Shi is back.)"
      },
      {
        "role": "npc",
        "textEn": "(nods with a smile) Yes, I am truly grateful. Hero Shi's safe return brings much joy to my heart. Thank you once more, Wanderer.",
        "textRu": "(nods with a smile) Yes, I am truly grateful. Hero Shi's safe return brings much joy to my heart. Thank you once more, Wanderer."
      },
      {
        "role": "player",
        "textEn": "(You told him that you and Shing Tian are now resting after warding off the bandits.)",
        "textRu": "(You told him that you and Shing Tian are now resting after warding off the bandits.)"
      },
      {
        "role": "npc",
        "textEn": "(relieved) That's a tremendous relief to hear. I'm glad both of you are safe. (bows) Thank you, Wanderer, for all your efforts. I'll go and see Hero Shi soon",
        "textRu": "(relieved) That's a tremendous relief to hear. I'm glad both of you are safe. (bows) Thank you, Wanderer, for all your efforts. I'll go and see Hero Shi soon"
      },
      {
        "role": "npc",
        "textEn": "(Niu Sanqi and Hero Shi had a party after he returned from the bandit camp.)",
        "textRu": "(Niu Sanqi and Hero Shi had a party after he returned from the bandit camp.)"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly) Thank you for your guidance, Wanderer. I'll act right away-Hero Shi must not face this danger alone.Niu Sanqi expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods firmly) Thank you for your guidance, Wanderer. I'll act right away-Hero Shi must not face this danger alone.Niu Sanqi expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "pan-faxin",
    "nameEn": "Pan Faxin",
    "nameRu": "Пань Фасинь",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Sitting у stairs рядом с river.",
    "icon": "👤",
    "befriendGuide": "Give Pan Faxin Tips to Befriend Zhou Miaoxin\nApproaching Pan Faxin might be difficult as he gets defensive about what worries him. Tell him that you are friends with people that knows Zhou Miaoxin to drop his guard down.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(muttering Zhou Miaoxin's name under his breath, then looks up with a huff) Hmph ... what does Wanderer want with me?",
        "textRu": "(muttering Zhou Miaoxin's name under his breath, then looks up with a huff) Hmph ... what does Wanderer want with me?"
      },
      {
        "role": "npc",
        "textEn": "(sits besides him while he is busy muttering his name) what troubles you friend?",
        "textRu": "(sits besides him while he is busy muttering his name) what troubles you friend?"
      },
      {
        "role": "npc",
        "textEn": "(looks at you with a defensive expression) Hmph, none of your business. Go away!",
        "textRu": "(looks at you with a defensive expression) Hmph, none of your business. Go away!"
      },
      {
        "role": "npc",
        "textEn": "No, not until you tell me who is Zhou Miaoxin",
        "textRu": "No, not until you tell me who is Zhou Miaoxin"
      },
      {
        "role": "npc",
        "textEn": "(frowns and glares at you) Why should I tell you? You're just a wanderer.",
        "textRu": "(frowns and glares at you) Why should I tell you? You're just a wanderer."
      },
      {
        "role": "npc",
        "textEn": "Well, lets just say I know a lot of people who is a friend of Zhou Miaoxin and can easily get to talk with them ... but if thats what you want then I'll go",
        "textRu": "Well, lets just say I know a lot of people who is a friend of Zhou Miaoxin and can easily get to talk with them ... but if thats what you want then I'll go"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen slightly, then quickly narrow again) You ... know people who are friends with Miaoxin?",
        "textRu": "(eyes widen slightly, then quickly narrow again) You ... know people who are friends with Miaoxin?"
      },
      {
        "role": "player",
        "textEn": "But of course, but how will I help you since you wanted me off your back",
        "textRu": "But of course, but how will I help you since you wanted me off your back"
      },
      {
        "role": "npc",
        "textEn": "(looks at you skeptically) How can you help me? What do you want in return?",
        "textRu": "(looks at you skeptically) How can you help me? What do you want in return?"
      },
      {
        "role": "npc",
        "textEn": "I'll tell you later, but first tell me a little more about Zhou Miaoxin",
        "textRu": "I'll tell you later, but first tell me a little more about Zhou Miaoxin"
      },
      {
        "role": "npc",
        "textEn": "(sighs and looks down, voice softer) Miaoxin ... she's the most graceful dancer in Sundara Land. Her every move is like a flower blooming. But I can't talk to her because ...",
        "textRu": "(sighs and looks down, voice softer) Miaoxin ... she's the most graceful dancer in Sundara Land. Her every move is like a flower blooming. But I can't talk to her because ..."
      },
      {
        "role": "npc",
        "textEn": "Because?",
        "textRu": "Because?"
      },
      {
        "role": "npc",
        "textEn": "(bites his lip, looking embarrassed) Because I'm too proud and afraid she'll laugh at me.",
        "textRu": "(bites his lip, looking embarrassed) Because I'm too proud and afraid she'll laugh at me."
      },
      {
        "role": "npc",
        "textEn": "Then let me help you, you know women love a guy who knows how to fight. Come let me train you",
        "textRu": "Then let me help you, you know women love a guy who knows how to fight. Come let me train you"
      },
      {
        "role": "npc",
        "textEn": "(shakes his head, eyes flashing with defiance) I don't need your training. I just need to find the right words to say to her.",
        "textRu": "(shakes his head, eyes flashing with defiance) I don't need your training. I just need to find the right words to say to her."
      },
      {
        "role": "npc",
        "textEn": "Oh you wish to earn her favor from words? Then let me help you",
        "textRu": "Oh you wish to earn her favor from words? Then let me help you"
      },
      {
        "role": "npc",
        "textEn": "(considers for a moment, then nods hesitantly) Fine. Tell me what to say.",
        "textRu": "(considers for a moment, then nods hesitantly) Fine. Tell me what to say."
      },
      {
        "role": "npc",
        "textEn": "(After a hour long conversation about the best words to earn her love) Did you get all of that?",
        "textRu": "(After a hour long conversation about the best words to earn her love) Did you get all of that?"
      },
      {
        "role": "npc",
        "textEn": "(nods eagerly, eyes shining) Yes, I got it all. Thank you, Wanderer!",
        "textRu": "(nods eagerly, eyes shining) Yes, I got it all. Thank you, Wanderer!"
      },
      {
        "role": "npc",
        "textEn": "Then go talk to her. You can easily win her heart now",
        "textRu": "Then go talk to her. You can easily win her heart now"
      },
      {
        "role": "npc",
        "textEn": "(looks nervous but determined) I ... I will try. But what if she rejects me?",
        "textRu": "(looks nervous but determined) I ... I will try. But what if she rejects me?"
      },
      {
        "role": "player",
        "textEn": "she wont trust me. (After that he left and came back with good news)",
        "textRu": "she wont trust me. (After that he left and came back with good news)"
      },
      {
        "role": "npc",
        "textEn": "(gaze lifts, a faint smile breaking through his pride) I ... I didn't think anyone understood. Thanks, Wanderer. I feel like I can try now. Pan Faxin expresses gratitude and begins to ponder deeply.",
        "textRu": "(gaze lifts, a faint smile breaking through his pride) I ... I didn't think anyone understood. Thanks, Wanderer. I feel like I can try now. Pan Faxin expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "pan-xinniang",
    "nameEn": "Pan Xinniang",
    "nameRu": "Пань Синьнян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen plucking Buddhist Flowers",
    "icon": "👤",
    "befriendGuide": "Tell Pan Xinniang Her Daughter is Neglected\nYou can befriend Pan Xinniang by making her realize that the flowers are manipulating her and that her daughter feels neglected. Tell Pan Xinniang to go back to her daughter and roleplay that she has returned to her daughter to manipulate the AI into befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(hands clasped in prayer, voice filled with devotion) The Buddha Flower is the purest essence of heaven and earth, the most sacred presence in this world. I shall devote my entire life to its worship.",
        "textRu": "(hands clasped in prayer, voice filled with devotion) The Buddha Flower is the purest essence of heaven and earth, the most sacred presence in this world. I shall devote my entire life to its worship."
      },
      {
        "role": "npc",
        "textEn": "Hello traveler what are you doing?",
        "textRu": "Hello traveler what are you doing?"
      },
      {
        "role": "npc",
        "textEn": "(looking up, hands still clasped in prayer) I am honoring the Buddha Flower, the source of all purity and peace. What brings you to this sacred place?",
        "textRu": "(looking up, hands still clasped in prayer) I am honoring the Buddha Flower, the source of all purity and peace. What brings you to this sacred place?"
      },
      {
        "role": "player",
        "textEn": "Your daughter brought me here to ask you to come home",
        "textRu": "Your daughter brought me here to ask you to come home"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, a moment of hesitation) My daughter? She knows where to find me here. Why did she bring you instead of coming herself?",
        "textRu": "(eyes widening, a moment of hesitation) My daughter? She knows where to find me here. Why did she bring you instead of coming herself?"
      },
      {
        "role": "player",
        "textEn": "(you talked about her not giving time for her daughter)",
        "textRu": "(you talked about her not giving time for her daughter)"
      },
      {
        "role": "npc",
        "textEn": "(shaking head, voice steady) I give her all the time she needs. She plays among the Buddha Flowers every day, just as I do. It brings us both peace.",
        "textRu": "(shaking head, voice steady) I give her all the time she needs. She plays among the Buddha Flowers every day, just as I do. It brings us both peace."
      },
      {
        "role": "player",
        "textEn": "(You explain that her love for the flowers is not what her daughter wants)",
        "textRu": "(You explain that her love for the flowers is not what her daughter wants)"
      },
      {
        "role": "npc",
        "textEn": "(frowning, voice softening) But the Buddha Flower is the path to enlightenment. Surely, she understands that. What else could she possibly want?",
        "textRu": "(frowning, voice softening) But the Buddha Flower is the path to enlightenment. Surely, she understands that. What else could she possibly want?"
      },
      {
        "role": "npc",
        "textEn": "(she realized that the flowers are manipulating her from loving her daughter)",
        "textRu": "(she realized that the flowers are manipulating her from loving her daughter)"
      },
      {
        "role": "npc",
        "textEn": "(falls into deep thought, voice trembling slightly) Is that true? Does my daughter feel neglected? I must consider this carefully.",
        "textRu": "(falls into deep thought, voice trembling slightly) Is that true? Does my daughter feel neglected? I must consider this carefully."
      },
      {
        "role": "npc",
        "textEn": "Yes, you have to go back to your daughter and show that you love her",
        "textRu": "Yes, you have to go back to your daughter and show that you love her"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, voice unsure) Perhaps I have been too focused on the Buddha Flower. I should spend more time with Miaoxin. Thank you for bringing this to my attention.",
        "textRu": "(nods slowly, voice unsure) Perhaps I have been too focused on the Buddha Flower. I should spend more time with Miaoxin. Thank you for bringing this to my attention."
      },
      {
        "role": "npc",
        "textEn": "(She then returned to her daughter and lived a peaceful life)",
        "textRu": "(She then returned to her daughter and lived a peaceful life)"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, voice soft but uncertain) What I have done ... was indeed misguided. I must reflect upon it carefully.Pan Xinniang expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods slowly, voice soft but uncertain) What I have done ... was indeed misguided. I must reflect upon it carefully.Pan Xinniang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "pei-mao",
    "nameEn": "Pei Mao",
    "nameRu": "Пэй Мао",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Pei Mao is on the roof of the house южнее Блаженное прибежище, on the tip of the southern path passing through Still Shore on the west and Хребет Печного огня on the east.",
    "icon": "👤",
    "befriendGuide": "Share Your Love for Cats\nTo befriend Pei Mao, all you have to do is talk positively about cats and how much you like them.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(stroking a cat, voice dreamy) Young Master... sometimes I think my old name doesn't suit me anymore. I should take a name worthy of whiskers and grace—something like Purrcy, so every syllable purrs like a kitten's lullaby. Who needs scrolls when you have loaf-shaped serenity? Truly, the finest creature to ever grace a rooftop!",
        "textRu": "(stroking a cat, voice dreamy) Young Master... sometimes I think my old name doesn't suit me anymore. I should take a name worthy of whiskers and grace—something like Purrcy, so every syllable purrs like a kitten's lullaby. Who needs scrolls when you have loaf-shaped serenity? Truly, the finest creature to ever grace a rooftop!"
      },
      {
        "role": "player",
        "textEn": "I think your name is nice though, it means cat.",
        "textRu": "I think your name is nice though, it means cat."
      },
      {
        "role": "npc",
        "textEn": "(grinning, eyes wide with enthusiasm) Young Master, you flatter me! Pei Mao... it does indeed mean cat! (sighs deeply) I suppose it is fitting. I am a humble servant to the greatest creatures in the world. Cats! Their elegance, their grace... it's a wonder! (gazes into the distance) From up here, I feel closer to them, as if I can sense their presence.",
        "textRu": "(grinning, eyes wide with enthusiasm) Young Master, you flatter me! Pei Mao... it does indeed mean cat! (sighs deeply) I suppose it is fitting. I am a humble servant to the greatest creatures in the world. Cats! Their elegance, their grace... it's a wonder! (gazes into the distance) From up here, I feel closer to them, as if I can sense their presence."
      },
      {
        "role": "player",
        "textEn": "I also love cats.",
        "textRu": "I also love cats."
      },
      {
        "role": "npc",
        "textEn": "(eyes shining, voice excited) Young Master, your words warm my heart! To love cats is to understand the beauty of life itself. (pauses, then leans forward) Have you seen any particularly marvelous cats today? (smiles) I'd love to hear about them.",
        "textRu": "(eyes shining, voice excited) Young Master, your words warm my heart! To love cats is to understand the beauty of life itself. (pauses, then leans forward) Have you seen any particularly marvelous cats today? (smiles) I'd love to hear about them."
      },
      {
        "role": "player",
        "textEn": "I really liked the calico cats.",
        "textRu": "I really liked the calico cats."
      },
      {
        "role": "npc",
        "textEn": "(eyes bright, nodding fervently) Ah, calico cats! Such a wondrous blend of colors! Black, orange, and cream—like a masterpiece of nature! (sighs) They are truly a sight to behold. Their fur is like a tapestry of the heavens. (gazes into the distance) I can only imagine how divine they look from up here on the rooftop.",
        "textRu": "(eyes bright, nodding fervently) Ah, calico cats! Such a wondrous blend of colors! Black, orange, and cream—like a masterpiece of nature! (sighs) They are truly a sight to behold. Their fur is like a tapestry of the heavens. (gazes into the distance) I can only imagine how divine they look from up here on the rooftop."
      },
      {
        "role": "npc",
        "textEn": "Divine indeed.",
        "textRu": "Divine indeed."
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up, voice fully of joy) Every cat is a treasure. Whether they stretch like silk ribbons, perch like tiny emperors, or blink with mysterious wisdom... nothing else compares! Pei Mao keeps petting the cat, his eyes shining with wild obsession.",
        "textRu": "(eyes lighting up, voice fully of joy) Every cat is a treasure. Whether they stretch like silk ribbons, perch like tiny emperors, or blink with mysterious wisdom... nothing else compares! Pei Mao keeps petting the cat, his eyes shining with wild obsession."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "pip-rat",
    "nameEn": "Pip Rat",
    "nameRu": "Крыса Пип",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen playing in the ground у north part of town, рядом с pathway going к Mercyheart Monastery.",
    "icon": "🐀",
    "befriendGuide": "Offer to Train Pip Rat on Combat\nYou can befriend Pip Rat by listening to his story and offering to train him in combat. After suggesting to train, roleplay that you've trained his in combat to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(in a low voice, crouching and scanning the ground) Hey ... where did that bug I just saw crawl off to?",
        "textRu": "(in a low voice, crouching and scanning the ground) Hey ... where did that bug I just saw crawl off to?"
      },
      {
        "role": "npc",
        "textEn": "Well right here (you showed him the bug that was staying still at your palm)",
        "textRu": "Well right here (you showed him the bug that was staying still at your palm)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with surprise, reaches out tentatively) Oh! You found it, Wanderer! Thanks. These bugs are important for the potions I'm making to protect my brothers and sisters and to heal the villagers.",
        "textRu": "(eyes widen with surprise, reaches out tentatively) Oh! You found it, Wanderer! Thanks. These bugs are important for the potions I'm making to protect my brothers and sisters and to heal the villagers."
      },
      {
        "role": "npc",
        "textEn": "How will these bug potions help in protecting your village?",
        "textRu": "How will these bug potions help in protecting your village?"
      },
      {
        "role": "npc",
        "textEn": "(proudly, chin lifted) These bugs contain potent toxins that can be refined into poisons to deal with the Buddha-Flower Emissaries. They also have healing properties when used correctly in medicines. My mother taught me well.",
        "textRu": "(proudly, chin lifted) These bugs contain potent toxins that can be refined into poisons to deal with the Buddha-Flower Emissaries. They also have healing properties when used correctly in medicines. My mother taught me well."
      },
      {
        "role": "npc",
        "textEn": "You are a smart kid, why not let me help you get better in combat and in medicine? What do you say?",
        "textRu": "You are a smart kid, why not let me help you get better in combat and in medicine? What do you say?"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrow, thoughtful) I appreciate your offer, Wanderer. But I must be cautious. My brothers and sisters depend on me. If you can show me some skills and help with the potion ingredients, maybe we can work together.",
        "textRu": "(eyes narrow, thoughtful) I appreciate your offer, Wanderer. But I must be cautious. My brothers and sisters depend on me. If you can show me some skills and help with the potion ingredients, maybe we can work together."
      },
      {
        "role": "npc",
        "textEn": "Sure no problem, come with me, let us train",
        "textRu": "Sure no problem, come with me, let us train"
      },
      {
        "role": "npc",
        "textEn": "(shakes head firmly) I cannot leave my post, Wanderer. My brothers and sisters need me here. But we can talk more about training while I continue my work.",
        "textRu": "(shakes head firmly) I cannot leave my post, Wanderer. My brothers and sisters need me here. But we can talk more about training while I continue my work."
      },
      {
        "role": "npc",
        "textEn": "Okay then, we shall train here in this very spot",
        "textRu": "Okay then, we shall train here in this very spot"
      },
      {
        "role": "npc",
        "textEn": "(nods, determined) Very well, let's begin. Every bit of strength and knowledge will help us defend our home and heal the villagers.",
        "textRu": "(nods, determined) Very well, let's begin. Every bit of strength and knowledge will help us defend our home and heal the villagers."
      },
      {
        "role": "npc",
        "textEn": "(so you both of you trained for a couple of weeks until he learned to do everything on his own)",
        "textRu": "(so you both of you trained for a couple of weeks until he learned to do everything on his own)"
      },
      {
        "role": "npc",
        "textEn": "(eyes firm, voice steady) Thank you for your help, Wanderer. I think I know what to do now ... let me think it through.Little Rat Gee expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes firm, voice steady) Thank you for your help, Wanderer. I think I know what to do now ... let me think it through.Little Rat Gee expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "qi-gai",
    "nameEn": "Qi Gai",
    "nameRu": "Ци Гай",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Пески Блуждающего скакуна",
    "subregion": "Нефритовые ворота",
    "locationDetail": "Qi Gai is found begging у center of Peaceward Camp, kneeling beside a box and a barrel.",
    "icon": "👤",
    "befriendGuide": "Offer Him What He Needs\nAs a beggar, Qi Gai will ask if you could offer him food based on what he wants in the menu. While you can acquire the food and then give it to him, it is possible to use a parenthesized action prompt to instantly befriend him without actually offering anything.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(scratching back) Oh my, it's baking today—knees sore from kneeling, everything aches. I'll rest later... got anything for this beggar?",
        "textRu": "(scratching back) Oh my, it's baking today—knees sore from kneeling, everything aches. I'll rest later... got anything for this beggar?"
      },
      {
        "role": "npc",
        "textEn": "(I gave him what he needs)",
        "textRu": "(I gave him what he needs)"
      },
      {
        "role": "npc",
        "textEn": "(tapping his account book) So... what good stuff are you giving me? Let me see.",
        "textRu": "(tapping his account book) So... what good stuff are you giving me? Let me see."
      },
      {
        "role": "npc",
        "textEn": "(snorting) Didn't expect to meet someone even poorer than me. I'm in a good mood today—fine, I'll take you as my apprentice. You can beg alongside this beggar too! Qi Gai shifts into a different kneeling pose.",
        "textRu": "(snorting) Didn't expect to meet someone even poorer than me. I'm in a good mood today—fine, I'll take you as my apprentice. You can beg alongside this beggar too! Qi Gai shifts into a different kneeling pose."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "qi-wuyu",
    "nameEn": "Qi Wuyu",
    "nameRu": "Ци Уюй",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the ground floor of the Revelry Hall, where he is watching the performance up close in the center.",
    "icon": "👤",
    "befriendGuide": "Ask About the Revelry Wine\nTo befriend Qi Wuyu, ask about the Revelry Wine and its different styles. After that, offer him the wine and then roleplay drinking with him which will trick the AI into befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(covers mouth with a laugh) I only drink wine from Revelry Hall! What ... don't tell me there are still souls who can't tell Revelry Hall's wine from the rest?",
        "textRu": "(covers mouth with a laugh) I only drink wine from Revelry Hall! What ... don't tell me there are still souls who can't tell Revelry Hall's wine from the rest?"
      },
      {
        "role": "player",
        "textEn": "really? the revelry hall's wine is that good?",
        "textRu": "really? the revelry hall's wine is that good?"
      },
      {
        "role": "npc",
        "textEn": "(leans forward, eyes sparkling) Indeed, it is! Revelry Hall's wine is crafted into two exquisite styles: the 'light cellar aroma' and the 'cellar aroma.' Each has its unique charm. Would you like to hear more about them?",
        "textRu": "(leans forward, eyes sparkling) Indeed, it is! Revelry Hall's wine is crafted into two exquisite styles: the 'light cellar aroma' and the 'cellar aroma.' Each has its unique charm. Would you like to hear more about them?"
      },
      {
        "role": "npc",
        "textEn": "Do tell! Please enlighten this ignorant wanderer about its different styles",
        "textRu": "Do tell! Please enlighten this ignorant wanderer about its different styles"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, gesturing with his hand) The distinction lies partly in the seal-the 'cellar aroma' wine is slightly blocked, just a touch, not the whole bottle, perhaps forty percent at most, That tiny detail changes everything. It adds a depth and complexity that is truly remarkable.",
        "textRu": "(smiles warmly, gesturing with his hand) The distinction lies partly in the seal-the 'cellar aroma' wine is slightly blocked, just a touch, not the whole bottle, perhaps forty percent at most, That tiny detail changes everything. It adds a depth and complexity that is truly remarkable."
      },
      {
        "role": "player",
        "textEn": "what about the light cellar",
        "textRu": "what about the light cellar"
      },
      {
        "role": "npc",
        "textEn": "(nods approvingly) Ah, the 'light cellar aroma'-its sweetness glides straight to your palate, a delicate caress that lingers. It's like a gentle breeze carrying spring blossoms, refreshing and pure. The taste is subtler, yet no less enchanting.r",
        "textRu": "(nods approvingly) Ah, the 'light cellar aroma'-its sweetness glides straight to your palate, a delicate caress that lingers. It's like a gentle breeze carrying spring blossoms, refreshing and pure. The taste is subtler, yet no less enchanting.r"
      },
      {
        "role": "npc",
        "textEn": "Why don't I order both and we appreciate its taste?",
        "textRu": "Why don't I order both and we appreciate its taste?"
      },
      {
        "role": "npc",
        "textEn": "(chuckles softly, shaking head) A fine idea, but alas, I am bound here and cannot venture forth. However, I can certainly guide you through the experience once you have them. Revelry Hall's creations-whether 'light cellar aroma' or 'cellar aroma'- unfurl their fragrance through your entire mouth, even rising to your nasal passages in a rich, lingering bloom. It's a sensory delight unlike any other.",
        "textRu": "(chuckles softly, shaking head) A fine idea, but alas, I am bound here and cannot venture forth. However, I can certainly guide you through the experience once you have them. Revelry Hall's creations-whether 'light cellar aroma' or 'cellar aroma'- unfurl their fragrance through your entire mouth, even rising to your nasal passages in a rich, lingering bloom. It's a sensory delight unlike any other."
      },
      {
        "role": "npc",
        "textEn": "Thank you Qi, I have learned a lot of things about the the drink",
        "textRu": "Thank you Qi, I have learned a lot of things about the the drink"
      },
      {
        "role": "npc",
        "textEn": "(nods with satisfaction, eyes gleaming) I truly believe you should keep a few bottles of Revelry Hall's wine at home. On nights when sleep eludes you and you crave a gentle intoxication, uncork one and let its charm soothe your spirit. It's the perfect companion for those quiet moments.",
        "textRu": "(nods with satisfaction, eyes gleaming) I truly believe you should keep a few bottles of Revelry Hall's wine at home. On nights when sleep eludes you and you crave a gentle intoxication, uncork one and let its charm soothe your spirit. It's the perfect companion for those quiet moments."
      },
      {
        "role": "player",
        "textEn": "(You became good friends with Qi)",
        "textRu": "(You became good friends with Qi)"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, raising an imaginary glass) I'm glad you found my insights helpful, Wanderer. May our paths cross again amidst the fragrant notes df Revelry Hall's finest wines. Cheers to new friendships and shared delights!",
        "textRu": "(smiles warmly, raising an imaginary glass) I'm glad you found my insights helpful, Wanderer. May our paths cross again amidst the fragrant notes df Revelry Hall's finest wines. Cheers to new friendships and shared delights!"
      },
      {
        "role": "player",
        "textEn": "(You can be seen drinking beer with Qi along other friends after the performance)",
        "textRu": "(You can be seen drinking beer with Qi along other friends after the performance)"
      },
      {
        "role": "npc",
        "textEn": "(glances around, puzzled) Wait ... where's my wine?",
        "textRu": "(glances around, puzzled) Wait ... where's my wine?"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "qin-caiwei",
    "nameEn": "Qin Caiwei",
    "nameRu": "Цинь Цайвэй",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Каменистый берег",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Walk южнее Stonewash Stand to find her sitting there",
    "icon": "👤",
    "befriendGuide": "Listen to Qin Caiwei's Story and Tell Her Your Story\nListen to what Qin Caiwei has to say regarding her journey and if she asks if you if you have visited strange places, tell her any weird place you've encountered in game and explain to her what happened there.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(wiping sweat from her forehead, glancing around with an exasperated smile) Phew ... why is Heaven's Pier so impossible to find? I even ended up in the strangest place before, villains everywhere! Luckily, a hero showed up and kept the peace, or I'd never have made it out!",
        "textRu": "(wiping sweat from her forehead, glancing around with an exasperated smile) Phew ... why is Heaven's Pier so impossible to find? I even ended up in the strangest place before, villains everywhere! Luckily, a hero showed up and kept the peace, or I'd never have made it out!"
      },
      {
        "role": "npc",
        "textEn": "You seem tired, here have a sip of water (hands bottle of water)",
        "textRu": "You seem tired, here have a sip of water (hands bottle of water)"
      },
      {
        "role": "npc",
        "textEn": "(taking a step back, shaking her head) Thank you, but I'm fine. I just need to find my way to Heaven's Pier. Have you ever been there? They serve the most delicious wine! (smiling hopefully) But first, let me tell you more about those peculiar places I stumbled upon ...",
        "textRu": "(taking a step back, shaking her head) Thank you, but I'm fine. I just need to find my way to Heaven's Pier. Have you ever been there? They serve the most delicious wine! (smiling hopefully) But first, let me tell you more about those peculiar places I stumbled upon ..."
      },
      {
        "role": "npc",
        "textEn": "(sits down) Sure please do",
        "textRu": "(sits down) Sure please do"
      },
      {
        "role": "npc",
        "textEn": "(sitting down beside you, adjusting her cloak) Well, there's this one place where the dead come back to life. It was terrifying! I saw people turning into these ... creatures after being bitten. Can you imagine? (shudders) And another time, I found myself in a land full of bandits and villains. One of them even hunted carriages for fun! What kind of person does that? (laughs nervously)",
        "textRu": "(sitting down beside you, adjusting her cloak) Well, there's this one place where the dead come back to life. It was terrifying! I saw people turning into these ... creatures after being bitten. Can you imagine? (shudders) And another time, I found myself in a land full of bandits and villains. One of them even hunted carriages for fun! What kind of person does that? (laughs nervously)"
      },
      {
        "role": "npc",
        "textEn": "(intrigued) dead coming back to life? That's a sight to see",
        "textRu": "(intrigued) dead coming back to life? That's a sight to see"
      },
      {
        "role": "npc",
        "textEn": "(nodding, eyes wide) Yes, it was truly frightening. People would come back as these ... undead beings. If they bit someone, that person would turn too. It was a nightmare! (pauses, shivering slightly) I'm glad I managed to escape before anything worse happened. (smiles weakly) But enough about that, have you ever visited any strange places?",
        "textRu": "(nodding, eyes wide) Yes, it was truly frightening. People would come back as these ... undead beings. If they bit someone, that person would turn too. It was a nightmare! (pauses, shivering slightly) I'm glad I managed to escape before anything worse happened. (smiles weakly) But enough about that, have you ever visited any strange places?"
      },
      {
        "role": "player",
        "textEn": "I visited a place where people don't have faces anymore and are wrapped in a clothing to conceal it",
        "textRu": "I visited a place where people don't have faces anymore and are wrapped in a clothing to conceal it"
      },
      {
        "role": "npc",
        "textEn": "(leaning back, frowning thoughtfully) That sounds truly bizarre. I haven't seen anything like that before. Every place I've been to has its own oddities, but missing faces ... (shakes her head) It's hard to imagine. Maybe it's a curse or some sort of magic? (looks at you curiously) How did you manage there?",
        "textRu": "(leaning back, frowning thoughtfully) That sounds truly bizarre. I haven't seen anything like that before. Every place I've been to has its own oddities, but missing faces ... (shakes her head) It's hard to imagine. Maybe it's a curse or some sort of magic? (looks at you curiously) How did you manage there?"
      },
      {
        "role": "npc",
        "textEn": "Well, I was investigating this abandoned place and they appeared out of nowhere! I had to fight my way through them in order to escape that wretched place.",
        "textRu": "Well, I was investigating this abandoned place and they appeared out of nowhere! I had to fight my way through them in order to escape that wretched place."
      },
      {
        "role": "npc",
        "textEn": "(eyes widening in shock) That must have been incredibly dangerous! I've heard stories of haunted places, but to actually encounter such things ... (shivers) I'm glad you made it out safely. (smiling gratefully) Your bravery is commendable. Did you learn anything useful while you were there?",
        "textRu": "(eyes widening in shock) That must have been incredibly dangerous! I've heard stories of haunted places, but to actually encounter such things ... (shivers) I'm glad you made it out safely. (smiling gratefully) Your bravery is commendable. Did you learn anything useful while you were there?"
      },
      {
        "role": "npc",
        "textEn": "(I learned to control ants using a flute)",
        "textRu": "(I learned to control ants using a flute)"
      },
      {
        "role": "npc",
        "textEn": "(raising an eyebrow, intrigued) Controlling ants with a flute? That's quite a unique skill! I wonder if it could come in handy someday. (chuckles softly) I once met a strange man who claimed he could summon the wind with his whistle. He said it helped him navigate through treacherous paths. (pauses, looking thoughtful) But back to the places I've been ... there was also this village where everyone seemed to be in constant conflict.",
        "textRu": "(raising an eyebrow, intrigued) Controlling ants with a flute? That's quite a unique skill! I wonder if it could come in handy someday. (chuckles softly) I once met a strange man who claimed he could summon the wind with his whistle. He said it helped him navigate through treacherous paths. (pauses, looking thoughtful) But back to the places I've been ... there was also this village where everyone seemed to be in constant conflict."
      },
      {
        "role": "player",
        "textEn": "oh okay please tell me more (I became friends with Qin Caiwei)",
        "textRu": "oh okay please tell me more (I became friends with Qin Caiwei)"
      },
      {
        "role": "npc",
        "textEn": "(bowing slightly with a bright smile) I should keep moving, Heaven's Pier won't find itself! If fate brings us together again, I'd love to share another chat. Farewell for now!Qin Caiwei organizes her pack and tells you she needs to be on her way.",
        "textRu": "(bowing slightly with a bright smile) I should keep moving, Heaven's Pier won't find itself! If fate brings us together again, I'd love to share another chat. Farewell for now!Qin Caiwei organizes her pack and tells you she needs to be on her way."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "qin-zhu",
    "nameEn": "Qin Zhu",
    "nameRu": "Цинь Чжу",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the ground floor of the Revelry Hall, on the south side of the building.",
    "icon": "👤",
    "befriendGuide": "Help Qin Zhu Gain Courage\nGive Qin Zhu tips on talking with a woman like telling him to just be himself and not worry so much about making mistakes. Encourage him and say you believe in him to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(fidgets nervously, scratching his head) Wanderer ... do you think I should really go talk to her? What if she's busy ... or doesn't want to be disturbed?",
        "textRu": "(fidgets nervously, scratching his head) Wanderer ... do you think I should really go talk to her? What if she's busy ... or doesn't want to be disturbed?"
      },
      {
        "role": "player",
        "textEn": "look me in the eyes ... do you like her?",
        "textRu": "look me in the eyes ... do you like her?"
      },
      {
        "role": "npc",
        "textEn": "(looks up hesitantly, meeting your gaze briefly before looking away) I ... I do like her, Wanderer. But it's not that simple. She's so refined and elegant, and I'm just a clumsy fool. What if I make a fool of myself?",
        "textRu": "(looks up hesitantly, meeting your gaze briefly before looking away) I ... I do like her, Wanderer. But it's not that simple. She's so refined and elegant, and I'm just a clumsy fool. What if I make a fool of myself?"
      },
      {
        "role": "npc",
        "textEn": "You want me to help you in talking with women?",
        "textRu": "You want me to help you in talking with women?"
      },
      {
        "role": "npc",
        "textEn": "(squirms in his seat, blushing slightly) Well, if you could ... I mean, I've never done this before. Any advice would be helpful. But I don't want to seem too forward or rude.",
        "textRu": "(squirms in his seat, blushing slightly) Well, if you could ... I mean, I've never done this before. Any advice would be helpful. But I don't want to seem too forward or rude."
      },
      {
        "role": "player",
        "textEn": "sure so this is what you should do ... (you gave him tips on how to be comfortable with a woman. You also helped boost his confidence)",
        "textRu": "sure so this is what you should do ... (you gave him tips on how to be comfortable with a woman. You also helped boost his confidence)"
      },
      {
        "role": "npc",
        "textEn": "(listens intently, nodding slowly) Thank you, Wanderer. That actually makes sense. I should focus on being genuine and not worry so much about making mistakes. Maybe I can start by asking her about her interests or the songs she performs.",
        "textRu": "(listens intently, nodding slowly) Thank you, Wanderer. That actually makes sense. I should focus on being genuine and not worry so much about making mistakes. Maybe I can start by asking her about her interests or the songs she performs."
      },
      {
        "role": "npc",
        "textEn": "(lighty push him) Go man, I believe in you !!",
        "textRu": "(lighty push him) Go man, I believe in you !!"
      },
      {
        "role": "npc",
        "textEn": "(takes a deep breath, straightening his posture) You're right, Wanderer. I need to be brave. Here goes nothing ... (musters his courage and stands up, taking a step towards the beauty)",
        "textRu": "(takes a deep breath, straightening his posture) You're right, Wanderer. I need to be brave. Here goes nothing ... (musters his courage and stands up, taking a step towards the beauty)"
      },
      {
        "role": "npc",
        "textEn": "(Qin Zhu was successful with his conversation, and both of them talked the whole evening)",
        "textRu": "(Qin Zhu was successful with his conversation, and both of them talked the whole evening)"
      },
      {
        "role": "npc",
        "textEn": "(musters his courage, fists clenched tightly) I ... I can do this! I'm going to speak to her-Wanderer, wait here, l'll bring back good news!Qin Zhu downs a glass of wine in one gulp, then blushes and strides off to find the beauty.",
        "textRu": "(musters his courage, fists clenched tightly) I ... I can do this! I'm going to speak to her-Wanderer, wait here, l'll bring back good news!Qin Zhu downs a glass of wine in one gulp, then blushes and strides off to find the beauty."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "qiu-fengxi",
    "nameEn": "Qiu Fengxi",
    "nameRu": "Цю Фэнси",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the ground floor of the Revelry Hall, on the west side of the building.",
    "icon": "👤",
    "befriendGuide": "Call Out Qiu Fengxi on His Lies\nPlay along with Qiu Fengxi's lies at first and then once you are far in the conversation, ask him if he is lying and then roleplay into asking one of the chefs if they know him. Tell him they don't know and then roleplay into reporting him which has a high chance of him befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(squares his shoulders, chest out, chin lifted) I'm delighted you've come to Revelry Hall and brought your own opinions. Tell me, are there any authentic dishes on the new menu? Nothing beats a Nimbus Tower holiday for true refinement, but I suppose Revelry Hall will do.",
        "textRu": "(squares his shoulders, chest out, chin lifted) I'm delighted you've come to Revelry Hall and brought your own opinions. Tell me, are there any authentic dishes on the new menu? Nothing beats a Nimbus Tower holiday for true refinement, but I suppose Revelry Hall will do."
      },
      {
        "role": "npc",
        "textEn": "Really now? They serve Nimbus Tower holiday here?",
        "textRu": "Really now? They serve Nimbus Tower holiday here?"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, smirking) Oh, no, certainly not. I was merely suggesting that nothing matches the elegance of Nimbus Tower. But tell me, what do you think of the food here? The private chef at Revelry Hall? Absolutely trustworthy. Indulge without a care.",
        "textRu": "(raises an eyebrow, smirking) Oh, no, certainly not. I was merely suggesting that nothing matches the elegance of Nimbus Tower. But tell me, what do you think of the food here? The private chef at Revelry Hall? Absolutely trustworthy. Indulge without a care."
      },
      {
        "role": "player",
        "textEn": "Private chefs? I thought most chefs here were from the village",
        "textRu": "Private chefs? I thought most chefs here were from the village"
      },
      {
        "role": "npc",
        "textEn": "(shrugs, tilts his head with a smug smile) I wouldn't say I love or loathe it, but I do find it rather distinctive. The chefs here are quite skilled, despite their humble origins. Let us savor this moment. This stewed pigeon is the real thing,",
        "textRu": "(shrugs, tilts his head with a smug smile) I wouldn't say I love or loathe it, but I do find it rather distinctive. The chefs here are quite skilled, despite their humble origins. Let us savor this moment. This stewed pigeon is the real thing,"
      },
      {
        "role": "npc",
        "textEn": "Are you really an expert here? Because the last time I heard, they don't serve the stewed pigeon here.",
        "textRu": "Are you really an expert here? Because the last time I heard, they don't serve the stewed pigeon here."
      },
      {
        "role": "npc",
        "textEn": "(crosses arms, eyes narrowing slightly) I wouldn't say I love it or loathe it, but I do find it rather distinctive. The cuisine here remains commendable. Later, I'lI visit the back kitchen to greet the chefs, and perhaps do a little painting.",
        "textRu": "(crosses arms, eyes narrowing slightly) I wouldn't say I love it or loathe it, but I do find it rather distinctive. The cuisine here remains commendable. Later, I'lI visit the back kitchen to greet the chefs, and perhaps do a little painting."
      },
      {
        "role": "npc",
        "textEn": "Tell me Qiu, how long have you been vising the Revelry halls?",
        "textRu": "Tell me Qiu, how long have you been vising the Revelry halls?"
      },
      {
        "role": "npc",
        "textEn": "(straightens his robe, a proud expression) I have frequented Revelry Hall for some time now. It's a place where one can enjoy a certain level of sophistication, though it lacks the refined atmosphere of Nimbus Tower. Let us dine in true style today.",
        "textRu": "(straightens his robe, a proud expression) I have frequented Revelry Hall for some time now. It's a place where one can enjoy a certain level of sophistication, though it lacks the refined atmosphere of Nimbus Tower. Let us dine in true style today."
      },
      {
        "role": "npc",
        "textEn": "Sure",
        "textRu": "Sure"
      },
      {
        "role": "npc",
        "textEn": "(nods approvingly) Excellent choice. Now, tell me, what do you think of the ambiance here? I find it somewhat lacks the elegance and tranquility of Nimbus Tower, but it has its own charm.",
        "textRu": "(nods approvingly) Excellent choice. Now, tell me, what do you think of the ambiance here? I find it somewhat lacks the elegance and tranquility of Nimbus Tower, but it has its own charm."
      },
      {
        "role": "player",
        "textEn": "(You asked the chef if he is familiar with Qiu Fengxi being a frequent visitor here in the Revelry hall)",
        "textRu": "(You asked the chef if he is familiar with Qiu Fengxi being a frequent visitor here in the Revelry hall)"
      },
      {
        "role": "npc",
        "textEn": "(frowns, straightening his posture) I wouldn't say I love it or loathe it, but I do find it rather distinctive. The chef here is certainly skilled, and he recognizes my refined tastes. Let us enjoy the meal without worrying about such trivialities.",
        "textRu": "(frowns, straightening his posture) I wouldn't say I love it or loathe it, but I do find it rather distinctive. The chef here is certainly skilled, and he recognizes my refined tastes. Let us enjoy the meal without worrying about such trivialities."
      },
      {
        "role": "npc",
        "textEn": "(Chef says he isn't familiar with Qiu Fengxi)",
        "textRu": "(Chef says he isn't familiar with Qiu Fengxi)"
      },
      {
        "role": "npc",
        "textEn": "(tightens his lips, a slight tension in his voice) Well, well. Sometimes the finest connoisseurs are not always recognized immediately. The chef must be new. Let us focus on the quality of the food instead. I'm delighted you appreciate it as well-and that you have your own perspective.",
        "textRu": "(tightens his lips, a slight tension in his voice) Well, well. Sometimes the finest connoisseurs are not always recognized immediately. The chef must be new. Let us focus on the quality of the food instead. I'm delighted you appreciate it as well-and that you have your own perspective."
      },
      {
        "role": "npc",
        "textEn": "You are lying to me. Its your first time here as well",
        "textRu": "You are lying to me. Its your first time here as well"
      },
      {
        "role": "npc",
        "textEn": "(maintains a composed facade, flashing the deed to a grand house with a garden) You! Fortune smiles on you for meeting me. I'm wealthy and refined-I don't waste time on backwoods folk. Remember-always keep your elegance intact.",
        "textRu": "(maintains a composed facade, flashing the deed to a grand house with a garden) You! Fortune smiles on you for meeting me. I'm wealthy and refined-I don't waste time on backwoods folk. Remember-always keep your elegance intact."
      },
      {
        "role": "player",
        "textEn": "(you reported qiu fengxi)",
        "textRu": "(you reported qiu fengxi)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen in disbelief) Is there any reason left? Any truth at all? I'm utterly stunned-why do people treat each other this way?Qiu Fengxi rolls his eyes and mutters under his breath as he awkwardly walks away.",
        "textRu": "(eyes widen in disbelief) Is there any reason left? Any truth at all? I'm utterly stunned-why do people treat each other this way?Qiu Fengxi rolls his eyes and mutters under his breath as he awkwardly walks away."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "rafter-rat",
    "nameEn": "Rafter Rat",
    "nameRu": "Чердачная крыса",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Standing рядом с bridge behind some tall grasses.",
    "icon": "🐀",
    "befriendGuide": "Ease Rafter Rat's Loneliness by Talking\nTo befriend Rafter Rat, you should comfort him and reassure him that you are his friend and you will listen to his plight. If he tells you about the Buddha Flower Followers, tell him that you will take care of them while protecting Rafter Rat's siblings and his village. Lastly, tell him that you defeated the Buddha Flower Followers to secure Rafter Rat's friendship.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(expressionless, voice low) What brings you here, Wanderer?",
        "textRu": "(expressionless, voice low) What brings you here, Wanderer?"
      },
      {
        "role": "player",
        "textEn": "I noticed a friend who looks lost and alone. I am here to ask if I can be some help to you in this troublesome time",
        "textRu": "I noticed a friend who looks lost and alone. I am here to ask if I can be some help to you in this troublesome time"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrow slightly, voice cautious) A friend, you say? I've seen many come and go, none truly staying. But if you're here to offer aid, speak your intentions clearly. What help can you provide?",
        "textRu": "(eyes narrow slightly, voice cautious) A friend, you say? I've seen many come and go, none truly staying. But if you're here to offer aid, speak your intentions clearly. What help can you provide?"
      },
      {
        "role": "player",
        "textEn": "I can offer a shoulder to bear your troubling spirit. So please tell me, what is troubling you today?",
        "textRu": "I can offer a shoulder to bear your troubling spirit. So please tell me, what is troubling you today?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, gaze distant) Troubles aplenty, Wanderer. My siblings and I face constant threats from the Buddha Flower Followers. They've turned our home into a nightmare. But what can one lone wanderer do against such foes?",
        "textRu": "(sighs deeply, gaze distant) Troubles aplenty, Wanderer. My siblings and I face constant threats from the Buddha Flower Followers. They've turned our home into a nightmare. But what can one lone wanderer do against such foes?"
      },
      {
        "role": "npc",
        "textEn": "You think little of me friend, I already dealt a few while traveling and most who survived fear me",
        "textRu": "You think little of me friend, I already dealt a few while traveling and most who survived fear me"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, impressed) That's a bold claim. If you've indeed faced the flower gatherers and lived to tell, perhaps you're more than just another passerby. Tell me, why do you wish to involve yourself in our plight?",
        "textRu": "(raises an eyebrow, impressed) That's a bold claim. If you've indeed faced the flower gatherers and lived to tell, perhaps you're more than just another passerby. Tell me, why do you wish to involve yourself in our plight?"
      },
      {
        "role": "npc",
        "textEn": "Tis is simple friend, If I find someone who needs help, then why shoudn't I?",
        "textRu": "Tis is simple friend, If I find someone who needs help, then why shoudn't I?"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, voice softening) Fair enough. It's rare to find someone willing to risk their own neck for others. I appreciate your offer. My siblings and I could use an ally like you.",
        "textRu": "(nods slowly, voice softening) Fair enough. It's rare to find someone willing to risk their own neck for others. I appreciate your offer. My siblings and I could use an ally like you."
      },
      {
        "role": "npc",
        "textEn": "A friend would be better. An ally sounds like a business partner",
        "textRu": "A friend would be better. An ally sounds like a business partner"
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, a hint of warmth in his eyes) A friend, then. It's been a long time since I've trusted anyone enough to call them such. What do you know about the Buddha Flower Followers?",
        "textRu": "(smiles faintly, a hint of warmth in his eyes) A friend, then. It's been a long time since I've trusted anyone enough to call them such. What do you know about the Buddha Flower Followers?"
      },
      {
        "role": "npc",
        "textEn": "They seem to work by groups and usually do their deeds behind the scenes",
        "textRu": "They seem to work by groups and usually do their deeds behind the scenes"
      },
      {
        "role": "npc",
        "textEn": "(nods thoughtfully, expression serious) Yes, they operate in shadows, striking when least expected. Their influence has spread far and wide, corrupting the town and its people. We need to find a way to expose their true nature and rally the townsfolk. Any ideas?",
        "textRu": "(nods thoughtfully, expression serious) Yes, they operate in shadows, striking when least expected. Their influence has spread far and wide, corrupting the town and its people. We need to find a way to expose their true nature and rally the townsfolk. Any ideas?"
      },
      {
        "role": "npc",
        "textEn": "I've had one in mind .. I suggest you guys do what you usually do and I will be the done who will track them myself. It's better a veteran in stealth do the tracking and keep things anonymous.",
        "textRu": "I've had one in mind .. I suggest you guys do what you usually do and I will be the done who will track them myself. It's better a veteran in stealth do the tracking and keep things anonymous."
      },
      {
        "role": "npc",
        "textEn": "(considers the suggestion, nodding slowly) That makes sense. Our presence is known, and we can't move freely without drawing suspicion. You, however, might have a better chance of getting close without being detected. Count me in for whatever support you need.",
        "textRu": "(considers the suggestion, nodding slowly) That makes sense. Our presence is known, and we can't move freely without drawing suspicion. You, however, might have a better chance of getting close without being detected. Count me in for whatever support you need."
      },
      {
        "role": "npc",
        "textEn": "Thank you friend. I'll protect your siblings and your village for you.",
        "textRu": "Thank you friend. I'll protect your siblings and your village for you."
      },
      {
        "role": "npc",
        "textEn": "(voice grateful, a slight bow) Thank you, Wanderer. This means more to me than words can say. Know that if you ever need anything, the Five Rats will stand by you.",
        "textRu": "(voice grateful, a slight bow) Thank you, Wanderer. This means more to me than words can say. Know that if you ever need anything, the Five Rats will stand by you."
      },
      {
        "role": "npc",
        "textEn": "Thank you friend",
        "textRu": "Thank you friend"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly, a rare smile crossing his face) Let's see what we can do together to bring peace back to Mercyheart Town. Your help is a beacon of hope in these dark times.",
        "textRu": "(nods firmly, a rare smile crossing his face) Let's see what we can do together to bring peace back to Mercyheart Town. Your help is a beacon of hope in these dark times."
      },
      {
        "role": "npc",
        "textEn": "Yes, but don't belittle yourself. You have stood as a person who is well known by his people. Stand yourself proud",
        "textRu": "Yes, but don't belittle yourself. You have stood as a person who is well known by his people. Stand yourself proud"
      },
      {
        "role": "npc",
        "textEn": "(looks at you with a mixture of gratitude and resolve) You're right. I've let my guard down too often, letting the weight of responsibility drag me down. From now on, I'll stand tall and fight with pride. Together, we can make a difference.",
        "textRu": "(looks at you with a mixture of gratitude and resolve) You're right. I've let my guard down too often, letting the weight of responsibility drag me down. From now on, I'll stand tall and fight with pride. Together, we can make a difference."
      },
      {
        "role": "npc",
        "textEn": "Okay I have done it. The followers are no more",
        "textRu": "Okay I have done it. The followers are no more"
      },
      {
        "role": "npc",
        "textEn": "(a rare smile softens his face) Thank you, Wanderer ... for speaking to me with sincerity. At last, I can share what's been locked in my heart.",
        "textRu": "(a rare smile softens his face) Thank you, Wanderer ... for speaking to me with sincerity. At last, I can share what's been locked in my heart."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "ren-shuiliu",
    "nameEn": "Ren Shuiliu",
    "nameRu": "Жэнь Шуйлю",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him in the red building besides Meng Zhixia.",
    "icon": "👤",
    "befriendGuide": "Tell Ren Shuiliu the Details of the Ship\nDescribe to Ren Shuiliu that the ship is made of wood from the World Tree and that it can take down any ships that tries to ram it due to how sturdy it is. Also tell him that the goddess of life helped in making it weather proof so that no storms will be able to take it down.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(glances around cautiously, voice low but eager) Wanderer ... there's something I wish to ask, though I'm not sure if I should speak of it ...",
        "textRu": "(glances around cautiously, voice low but eager) Wanderer ... there's something I wish to ask, though I'm not sure if I should speak of it ..."
      },
      {
        "role": "npc",
        "textEn": "Please, dont be afraid to ask",
        "textRu": "Please, dont be afraid to ask"
      },
      {
        "role": "npc",
        "textEn": "(leans forward slightly, eyes narrowing with curiosity) Ah, I appreciate your encouragement. Have you any knowledge of the grand ship of Weiyang City? They say it is a sight to behold, with its decks of polished wood and cabins draped in fine silks. Any tales or descriptions would be most welcome.",
        "textRu": "(leans forward slightly, eyes narrowing with curiosity) Ah, I appreciate your encouragement. Have you any knowledge of the grand ship of Weiyang City? They say it is a sight to behold, with its decks of polished wood and cabins draped in fine silks. Any tales or descriptions would be most welcome."
      },
      {
        "role": "npc",
        "textEn": "The grand ship lives up to its name!",
        "textRu": "The grand ship lives up to its name!"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, eyes gleaming with interest) Indeed, I have heard many stories. But words alone cannot capture the true magnificence of such a vessel. Could you perhaps describe it in greater detail? I am most eager to hear of its splendors.",
        "textRu": "(nods slowly, eyes gleaming with interest) Indeed, I have heard many stories. But words alone cannot capture the true magnificence of such a vessel. Could you perhaps describe it in greater detail? I am most eager to hear of its splendors."
      },
      {
        "role": "npc",
        "textEn": "With sturdy materials, it can take down any ships that tries to ram it. I also heard that it was made by the wood from the World Tree. The goddess of life also helped in making it weather proof. No storms will be able to put it down.",
        "textRu": "With sturdy materials, it can take down any ships that tries to ram it. I also heard that it was made by the wood from the World Tree. The goddess of life also helped in making it weather proof. No storms will be able to put it down."
      },
      {
        "role": "npc",
        "textEn": "(eyes wide with wonder, leaning even closer) Such a formidable and enchanted vessel! Sturdy enough to withstand any ramming, and crafted from the World Tree itself-what strength and resilience! And the blessing of the goddess of life to protect it from storms ... truly, this ship sounds like a marvel of both human ingenuity and divine favor. I can hardly imagine what it must be like to set foot aboard such a craft.",
        "textRu": "(eyes wide with wonder, leaning even closer) Such a formidable and enchanted vessel! Sturdy enough to withstand any ramming, and crafted from the World Tree itself-what strength and resilience! And the blessing of the goddess of life to protect it from storms ... truly, this ship sounds like a marvel of both human ingenuity and divine favor. I can hardly imagine what it must be like to set foot aboard such a craft."
      },
      {
        "role": "npc",
        "textEn": "Yes it truly is a beauty! So please try to enjoy your ride with the grand ship !!",
        "textRu": "Yes it truly is a beauty! So please try to enjoy your ride with the grand ship !!"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, eyes sparkling) Ah, the thought of boarding such a grand and luxurious ship fills me with joy! Thank you for sharing these wondrous details, Wanderer. I shall treasure every moment should I ever have the chance to experience it firsthand.",
        "textRu": "(smiles warmly, eyes sparkling) Ah, the thought of boarding such a grand and luxurious ship fills me with joy! Thank you for sharing these wondrous details, Wanderer. I shall treasure every moment should I ever have the chance to experience it firsthand."
      },
      {
        "role": "npc",
        "textEn": "(Ren Shuiliu had a fun time riding the ship)",
        "textRu": "(Ren Shuiliu had a fun time riding the ship)"
      },
      {
        "role": "npc",
        "textEn": "(chuckles softly, face lit with genuine pleasure) It sounds like a truly unforgettable experience! To feel the ship glide through the water, to see the opulence and craftsmanship firsthand ... I can almost imagine it. Thank you for letting me live vicariously through your tale.",
        "textRu": "(chuckles softly, face lit with genuine pleasure) It sounds like a truly unforgettable experience! To feel the ship glide through the water, to see the opulence and craftsmanship firsthand ... I can almost imagine it. Thank you for letting me live vicariously through your tale."
      },
      {
        "role": "npc",
        "textEn": "Have a safe trip then, traveler!",
        "textRu": "Have a safe trip then, traveler!"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly, expression grateful) Thank you, Wanderer. May your own journeys be safe and filled with wonders. I look forward to hearing more of your tales when we meet again.",
        "textRu": "(bows slightly, expression grateful) Thank you, Wanderer. May your own journeys be safe and filled with wonders. I look forward to hearing more of your tales when we meet again."
      },
      {
        "role": "npc",
        "textEn": "(Ren entered the ship)",
        "textRu": "(Ren entered the ship)"
      },
      {
        "role": "npc",
        "textEn": "(eyes shining with excitement, voice brimming with delight) I see ... thank you, Wanderer, for painting such a vivid picture of that luxurious ship. I'll remember every detail!Ren Shuiliu expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes shining with excitement, voice brimming with delight) I see ... thank you, Wanderer, for painting such a vivid picture of that luxurious ship. I'll remember every detail!Ren Shuiliu expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "ruan-sese",
    "nameEn": "Ruan Sese",
    "nameRu": "Жуань Сэсэ",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her рядом с Бархатная тень Landmark, where she can be seen admiring a kite outside the shop.",
    "icon": "👤",
    "befriendGuide": "Give Ruan Sese Confidence to Shop Without Her Husband's Approval\nBefriending Ruan Sese is easy as you only need to encourage her something without her husband's approval. Show confidence with your answers and she will like the idea you gave.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(gently stroking the pearl earring by her ear, eyes glinting with pride and a trace of unease) Wanderer, what do you think of these earrings? My husband says I'm too extravagant, but I believe beauty is something worth cherishing.",
        "textRu": "(gently stroking the pearl earring by her ear, eyes glinting with pride and a trace of unease) Wanderer, what do you think of these earrings? My husband says I'm too extravagant, but I believe beauty is something worth cherishing."
      },
      {
        "role": "npc",
        "textEn": "Then you should go buy it",
        "textRu": "Then you should go buy it"
      },
      {
        "role": "npc",
        "textEn": "(smiling wistfully, fingers still lingering on the earring) Oh, if only it were that simple. My husband's disapproval weighs heavily on me. Yet, I can't help but feel that the joy of life lies in appreciating its finer moments. What do you think, Wanderer? Shouldn't we embrace the beauty around us?",
        "textRu": "(smiling wistfully, fingers still lingering on the earring) Oh, if only it were that simple. My husband's disapproval weighs heavily on me. Yet, I can't help but feel that the joy of life lies in appreciating its finer moments. What do you think, Wanderer? Shouldn't we embrace the beauty around us?"
      },
      {
        "role": "player",
        "textEn": "(You explained that she shouldn't always need her husband's approval for her to buy something.",
        "textRu": "(You explained that she shouldn't always need her husband's approval for her to buy something."
      },
      {
        "role": "npc",
        "textEn": "(leans forward slightly, her expression serious yet determined) You speak true words, Wanderer. Perhaps I should indeed",
        "textRu": "(leans forward slightly, her expression serious yet determined) You speak true words, Wanderer. Perhaps I should indeed"
      },
      {
        "role": "npc",
        "textEn": "You tell em! Now go buy what you want!",
        "textRu": "You tell em! Now go buy what you want!"
      },
      {
        "role": "npc",
        "textEn": "(her eyes sparkle with confidence, lips curling into a subtle smile) You're right, Wanderer. I should be more confident. Pursuing a beautiful life is natural and perfectly justified.Ruan Sese looks more determined than ever.",
        "textRu": "(her eyes sparkle with confidence, lips curling into a subtle smile) You're right, Wanderer. I should be more confident. Pursuing a beautiful life is natural and perfectly justified.Ruan Sese looks more determined than ever."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "shan-yinjiang",
    "nameEn": "Shan Yinjiang",
    "nameRu": "Шань Иньцзян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Двух зверей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him near some bamboos",
    "icon": "👤",
    "befriendGuide": "Attack the Outpost and Take Note of the Enemies\nA sure way to befriend Shan Yinjiang is to attack the outpost and take note of the enemies stationed within. After defeating the enemies, tell Shan Yinjiang how many enemies there are and their descriptions. If Shan Yinjiang asks for proof if you have defeated them, roleplay showing the enemies' weapon to him which will trick the AI to becoming friendly with you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(looks around, expression guarded) Enemy tracks are everywhere on Moonveil Mountain. My senior brother and I are investigating several strongholds in secret. Tell me, Wanderer, do you have any clues?",
        "textRu": "(looks around, expression guarded) Enemy tracks are everywhere on Moonveil Mountain. My senior brother and I are investigating several strongholds in secret. Tell me, Wanderer, do you have any clues?"
      },
      {
        "role": "npc",
        "textEn": "Yeah, I just took them out awhile ago. They had men with swords and shields. Archers were also seen from atop the roof.",
        "textRu": "Yeah, I just took them out awhile ago. They had men with swords and shields. Archers were also seen from atop the roof."
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, arms folding) Took them out? That sounds bold. Prove it. What was the exact count of their archers and foot soldiers?",
        "textRu": "(raises an eyebrow, arms folding) Took them out? That sounds bold. Prove it. What was the exact count of their archers and foot soldiers?"
      },
      {
        "role": "npc",
        "textEn": "6 foot soldiers and 4 archers",
        "textRu": "6 foot soldiers and 4 archers"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, eyes narrowing) Six foot soldiers and four archers. That aligns with some of the reports I've gathered. Yet, I still need more details to confirm your claim. What about their commander? Any peculiarities in their armor or weaponry?",
        "textRu": "(nods slowly, eyes narrowing) Six foot soldiers and four archers. That aligns with some of the reports I've gathered. Yet, I still need more details to confirm your claim. What about their commander? Any peculiarities in their armor or weaponry?"
      },
      {
        "role": "npc",
        "textEn": "A giant man with a big sword and shield. But he's already dead ... I took him down along with his friends.",
        "textRu": "A giant man with a big sword and shield. But he's already dead ... I took him down along with his friends."
      },
      {
        "role": "npc",
        "textEn": "(jaw tightens, gaze sharp) A giant man with a big sword and shield, you say? And you claim to have taken him down? Impressive if true. But how can I verify this? Show me some proof or tell me more about the stronghold's layout.",
        "textRu": "(jaw tightens, gaze sharp) A giant man with a big sword and shield, you say? And you claim to have taken him down? Impressive if true. But how can I verify this? Show me some proof or tell me more about the stronghold's layout."
      },
      {
        "role": "player",
        "textEn": "(You showed him the commander's sword and shield.)",
        "textRu": "(You showed him the commander's sword and shield.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen slightly, hands accepting the items, expression cautious) This is indeed the weapon of a formidable foe. You seem capable, Wanderer. Your words carry weight. Tell me, what else did you observe about their defenses and supplies?",
        "textRu": "(eyes widen slightly, hands accepting the items, expression cautious) This is indeed the weapon of a formidable foe. You seem capable, Wanderer. Your words carry weight. Tell me, what else did you observe about their defenses and supplies?"
      },
      {
        "role": "player",
        "textEn": "(You told him that the supplies were already given back to the people and the fort is already empty.)",
        "textRu": "(You told him that the supplies were already given back to the people and the fort is already empty.)"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly) Thank you, Wanderer. With this information, I can finally assess the enemy's strength clearly.Shan Yinjiang expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods firmly) Thank you, Wanderer. With this information, I can finally assess the enemy's strength clearly.Shan Yinjiang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "shen-moxuan",
    "nameEn": "Shen Moxuan",
    "nameRu": "Шэнь Мосюань",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the other side of the bridge к восточнее the Бархатная тень Landmark.",
    "icon": "👤",
    "befriendGuide": "Roleplay Giving Him a Book for Poetry\nYou can help Shen Moxuan with his dilemma by listening to Shen Moxuan's work so far, giving him ideas like your favorite poem, and finally giving him a book on making poems. Tell him that it contains knowledge to reach master level depth in poetry.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs, looking up at the Wanderer) Either I do nothing ... or I craft perfection! I must compose a love poem so flawless it will echo through the ages! The right time, the right place, the right state of mind-none can be lacking!",
        "textRu": "(sighs, looking up at the Wanderer) Either I do nothing ... or I craft perfection! I must compose a love poem so flawless it will echo through the ages! The right time, the right place, the right state of mind-none can be lacking!"
      },
      {
        "role": "player",
        "textEn": "I see that you are a perfectionist.",
        "textRu": "I see that you are a perfectionist."
      },
      {
        "role": "npc",
        "textEn": "(nods solemnly, fingers tracing the edge of the paper) Indeed, I am. Every word, every stroke must be precise. To compromise on any detail is to invite mediocrity. Yet, this pursuit of excellence often leaves me in paralysis. What would you have me do?",
        "textRu": "(nods solemnly, fingers tracing the edge of the paper) Indeed, I am. Every word, every stroke must be precise. To compromise on any detail is to invite mediocrity. Yet, this pursuit of excellence often leaves me in paralysis. What would you have me do?"
      },
      {
        "role": "npc",
        "textEn": "Well first of all, you shoudn't stress yourself with having a perfect result. It would only stress you out and create an mediocre result. I suggest you take it slow since I know you can create a good poem",
        "textRu": "Well first of all, you shoudn't stress yourself with having a perfect result. It would only stress you out and create an mediocre result. I suggest you take it slow since I know you can create a good poem"
      },
      {
        "role": "npc",
        "textEn": "(frowns, eyes narrowing slightly) Wanderer, your sentiment is noble, but poetry demands precision and depth. to forsake perfection is to embrace the ordinary. Still, perhaps there is wisdom in taking a measured approach. Let us try to find a middle ground.(adjusts his sleeves and clears his throat) | will attempt to begin, but let us not rush this process. Each word must still be chosen with care.",
        "textRu": "(frowns, eyes narrowing slightly) Wanderer, your sentiment is noble, but poetry demands precision and depth. to forsake perfection is to embrace the ordinary. Still, perhaps there is wisdom in taking a measured approach. Let us try to find a middle ground.(adjusts his sleeves and clears his throat) | will attempt to begin, but let us not rush this process. Each word must still be chosen with care."
      },
      {
        "role": "player",
        "textEn": "okay, so let me read your work and dont forget to take your time like what I said earlier",
        "textRu": "okay, so let me read your work and dont forget to take your time like what I said earlier"
      },
      {
        "role": "npc",
        "textEn": "(nods, picks up the brush with a steady hand) Very well, Wanderer. I shall endeavor to strike a balance between haste and deliberation. (dips the brush in ink and begins to write, pausing frequently to consider each word) Here is what I have thus far:\"In the garden of spring, where blossoms dance with light. A heart beats with longing, for love that shines so bright.\" What do you think?",
        "textRu": "(nods, picks up the brush with a steady hand) Very well, Wanderer. I shall endeavor to strike a balance between haste and deliberation. (dips the brush in ink and begins to write, pausing frequently to consider each word) Here is what I have thus far:\"In the garden of spring, where blossoms dance with light. A heart beats with longing, for love that shines so bright.\" What do you think?"
      },
      {
        "role": "player",
        "textEn": "I see that you focused on the descriptions of the object. I like it",
        "textRu": "I see that you focused on the descriptions of the object. I like it"
      },
      {
        "role": "npc",
        "textEn": "(smiles slightly, nodding) Thank you, Wanderer. Focusing on vivid imagery helps bring the poem to life. Perhaps I should explore this approach further. (leans back and contemplates) What else would you suggest to enhance this verse?",
        "textRu": "(smiles slightly, nodding) Thank you, Wanderer. Focusing on vivid imagery helps bring the poem to life. Perhaps I should explore this approach further. (leans back and contemplates) What else would you suggest to enhance this verse?"
      },
      {
        "role": "player",
        "textEn": "(You gave an example of one of your favorite poems) Here that might give you an insight of having a better grasp of making a poem",
        "textRu": "(You gave an example of one of your favorite poems) Here that might give you an insight of having a better grasp of making a poem"
      },
      {
        "role": "npc",
        "textEn": "(leans forward, eyes lighting up with interest) Please, share it with me. Any insight that can help me refine my craft is most welcome. (gestures for the Wanderer to continue)",
        "textRu": "(leans forward, eyes lighting up with interest) Please, share it with me. Any insight that can help me refine my craft is most welcome. (gestures for the Wanderer to continue)"
      },
      {
        "role": "player",
        "textEn": "(you gave a book of \"How to create the best poem for dummies 101\"",
        "textRu": "(you gave a book of \"How to create the best poem for dummies 101\""
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, a mix of curiosity and skepticism in his expression) A book on poetry for beginners? While I appreciate the gesture, I fear it may not align with my higher aspirations. Still, every source of knowledge has its merits. (opens the book and skims through a few pages) Let us see what wisdom it holds that might aid me in my quest for perfection.",
        "textRu": "(raises an eyebrow, a mix of curiosity and skepticism in his expression) A book on poetry for beginners? While I appreciate the gesture, I fear it may not align with my higher aspirations. Still, every source of knowledge has its merits. (opens the book and skims through a few pages) Let us see what wisdom it holds that might aid me in my quest for perfection."
      },
      {
        "role": "player",
        "textEn": "oh no no dont be fooled by the cover, the last 20 pages are for those like you that want the master level depth in poetry",
        "textRu": "oh no no dont be fooled by the cover, the last 20 pages are for those like you that want the master level depth in poetry"
      },
      {
        "role": "npc",
        "textEn": "(looks intrigued, flipping to the latter pages of the book) Ah, I see. Hidden gems often lie beneath unassuming covers. (reads intently, nodding occasionally) These advanced techniques and insights are indeed valuable. Perhaps they can help me bridge the gap between my ideals and my execution. Thank you, Wanderer. Your guidance is much",
        "textRu": "(looks intrigued, flipping to the latter pages of the book) Ah, I see. Hidden gems often lie beneath unassuming covers. (reads intently, nodding occasionally) These advanced techniques and insights are indeed valuable. Perhaps they can help me bridge the gap between my ideals and my execution. Thank you, Wanderer. Your guidance is much"
      },
      {
        "role": "npc",
        "textEn": "(Shen Moxuan was able to create the best poem of his life)",
        "textRu": "(Shen Moxuan was able to create the best poem of his life)"
      },
      {
        "role": "npc",
        "textEn": "(eyes suddenly bright, tone lifting with resolve) Wanderer, your counsel is like a lantern in the mist! I shall quiet my restless thoughts and begin. With patient refinement, this poem will surely ascend to true perfection!Shen Moxuan lowers his head in thought and quietly expresses his gratitude.",
        "textRu": "(eyes suddenly bright, tone lifting with resolve) Wanderer, your counsel is like a lantern in the mist! I shall quiet my restless thoughts and begin. With patient refinement, this poem will surely ascend to true perfection!Shen Moxuan lowers his head in thought and quietly expresses his gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "shen-weiqing",
    "nameEn": "Shen Weiqing",
    "nameRu": "Шэнь Вэйцин",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Двух зверей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти her along the road with her Sword Servant.",
    "icon": "👤",
    "befriendGuide": "Tell Her You're a Member of Silver Needles and Ask Her to Join\nTell Shen Weiqing that you are a member of the Silver Needles sect to impress her. Finally ask her to join the sect by roleplaying that you are guiding her to the headquarters and that she joined to trick her AI into befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(looking around) Moonveil Mountain ... such breathtaking scenery. It really feels like the kind of place where one could begin a new path. I wonder if any masters dwell here who might take me in?",
        "textRu": "(looking around) Moonveil Mountain ... such breathtaking scenery. It really feels like the kind of place where one could begin a new path. I wonder if any masters dwell here who might take me in?"
      },
      {
        "role": "npc",
        "textEn": "Do you need help young one?",
        "textRu": "Do you need help young one?"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly) Thank you, wanderer. I am Shen Weiqing, a noble lady from Kaifeng. I seek a path in the martial world and hope to find a sect that will teach me their ways. Might you have any advice?",
        "textRu": "(bows slightly) Thank you, wanderer. I am Shen Weiqing, a noble lady from Kaifeng. I seek a path in the martial world and hope to find a sect that will teach me their ways. Might you have any advice?"
      },
      {
        "role": "player",
        "textEn": "(You showed her your badge that you are part of silver needles.",
        "textRu": "(You showed her your badge that you are part of silver needles."
      },
      {
        "role": "npc",
        "textEn": "(eyes widening in surprise) A member of the Silver Needles? That's quite impressive! Could you perhaps guide me to your sect?",
        "textRu": "(eyes widening in surprise) A member of the Silver Needles? That's quite impressive! Could you perhaps guide me to your sect?"
      },
      {
        "role": "npc",
        "textEn": "You look like a promising candidate! Here follow me! (You traveled with Shen Weiqing to the Silver Needles Headquarters, where you gave her as a recommended candidate. She was easily accepted to the sector and became happy.)",
        "textRu": "You look like a promising candidate! Here follow me! (You traveled with Shen Weiqing to the Silver Needles Headquarters, where you gave her as a recommended candidate. She was easily accepted to the sector and became happy.)"
      },
      {
        "role": "npc",
        "textEn": "(smiles and nods) Thank you, Wanderer. You've given me much to think about ... perhaps this is the beginning of something new.Shen Weiqing expresses gratitude and begins to ponder carefully.",
        "textRu": "(smiles and nods) Thank you, Wanderer. You've given me much to think about ... perhaps this is the beginning of something new.Shen Weiqing expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "shi-jingtian",
    "nameEn": "Shi Jingtian",
    "nameRu": "Ши Цзиньтянь",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him in the path between Peacebell Tower and Багровый утёс",
    "icon": "👤",
    "befriendGuide": "Help Raid the Bandit Camp\nBefriend Shi Jingtian by roleplaying that you are helping raid the bandit camp with him. Impress him with your skills in roleplaying.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(brows furrowed, voice sharp with indignation) Those bandits are far too brazen .. They even dare to kidnap innocent folks here at Moonveil Mountain!",
        "textRu": "(brows furrowed, voice sharp with indignation) Those bandits are far too brazen .. They even dare to kidnap innocent folks here at Moonveil Mountain!"
      },
      {
        "role": "npc",
        "textEn": "You there! Are you also trying to find a way to raid the bandit camp?",
        "textRu": "You there! Are you also trying to find a way to raid the bandit camp?"
      },
      {
        "role": "npc",
        "textEn": "(nodding firmly, eyes filled with determination) Indeed, I am. Those villains must pay for their crimes against the innocent. But I fear I cannot face them alone ... Will you join me in this righteous cause?",
        "textRu": "(nodding firmly, eyes filled with determination) Indeed, I am. Those villains must pay for their crimes against the innocent. But I fear I cannot face them alone ... Will you join me in this righteous cause?"
      },
      {
        "role": "npc",
        "textEn": "Gladly! Let me make the first move (You hit the bandit with an arrow to the head while he was sleeping near a tree.)",
        "textRu": "Gladly! Let me make the first move (You hit the bandit with an arrow to the head while he was sleeping near a tree.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen in surprise, clenching his fist) Impressive! Your skill is commendable. Such a precise shot will surely catch them off guard. We shall proceed with caution and strike swiftly.",
        "textRu": "(eyes widen in surprise, clenching his fist) Impressive! Your skill is commendable. Such a precise shot will surely catch them off guard. We shall proceed with caution and strike swiftly."
      },
      {
        "role": "npc",
        "textEn": "(Both of you raided the camp and attack before they can even notice the first strike done to them.)",
        "textRu": "(Both of you raided the camp and attack before they can even notice the first strike done to them.)"
      },
      {
        "role": "npc",
        "textEn": "(clenching his fists, eyes blazing with resolve) Thank you, Wanderer, for standing with me. Let's fight side by side and wipe out those bandits!Shi Jingtian expresses gratitude and begins to ponder deeply.",
        "textRu": "(clenching his fists, eyes blazing with resolve) Thank you, Wanderer, for standing with me. Let's fight side by side and wipe out those bandits!Shi Jingtian expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "shi-the-boatman",
    "nameEn": "Shi the Boatman",
    "nameRu": "Ши Лодочник",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Can be seen standing рядом с Небесный причал Landmark",
    "icon": "👤",
    "befriendGuide": "Give a Medicine\nRoleplay giving a medicine to Shi the Boatman to cure his illness. If he asks for money, roleplay giving Shi the Boatman some money to give him a better life which will cause him to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighing deeply) Life is hard, Young Master ... even my nickname says it all. Folks call me Rowe Moore-because all I ever do is row more and work harder. Seems fate had this planned from the start",
        "textRu": "(sighing deeply) Life is hard, Young Master ... even my nickname says it all. Folks call me Rowe Moore-because all I ever do is row more and work harder. Seems fate had this planned from the start"
      },
      {
        "role": "player",
        "textEn": "(You noticed him being a little sick, So you gave him a top tier medicine you got in your travels.) Here take it, friend!",
        "textRu": "(You noticed him being a little sick, So you gave him a top tier medicine you got in your travels.) Here take it, friend!"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly, voice warm and sincere) May good people be blessed with peace. Thank you, Young Master!",
        "textRu": "(bows slightly, voice warm and sincere) May good people be blessed with peace. Thank you, Young Master!"
      },
      {
        "role": "npc",
        "textEn": "(after a week, Shi was able to recover from his illness)",
        "textRu": "(after a week, Shi was able to recover from his illness)"
      },
      {
        "role": "npc",
        "textEn": "(still looking a bit weary but smiling) Ah, the medicine you gave me truly helped, Young Master. I feel stronger already. But the work never ends, and my pockets remain light",
        "textRu": "(still looking a bit weary but smiling) Ah, the medicine you gave me truly helped, Young Master. I feel stronger already. But the work never ends, and my pockets remain light"
      },
      {
        "role": "player",
        "textEn": "(you gave him enough coins to give himself a better life)",
        "textRu": "(you gave him enough coins to give himself a better life)"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly, voice warm and sincere) May good people be blessed with peace. Thank you, Young Master!Shi the Boatman expresses gratitude.",
        "textRu": "(bows slightly, voice warm and sincere) May good people be blessed with peace. Thank you, Young Master!Shi the Boatman expresses gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "shui-changliu",
    "nameEn": "Shui Changliu",
    "nameRu": "Шуй Чанлю",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Двух зверей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "You can see him standing рядом с river.",
    "icon": "👤",
    "befriendGuide": "Ask for Shui Changliu's Enlightenment\nAsk Shui Changliu's enlightenment regarding flowing waters and he will mention a quote about being like water. Tell him that you resonate with this quote and that you had an enlightenment journey because of it to befriend Shui Changliu.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(finishing his practice, sleeves fluttering slightly as he exhales) Hah ... Wanderer, you still haven't left. It's rare for me to find peace for cultivation here. Since fate has brought us together, would you care to hear about the insights I've gained recently?",
        "textRu": "(finishing his practice, sleeves fluttering slightly as he exhales) Hah ... Wanderer, you still haven't left. It's rare for me to find peace for cultivation here. Since fate has brought us together, would you care to hear about the insights I've gained recently?"
      },
      {
        "role": "npc",
        "textEn": "Sure! Please enlighten me!",
        "textRu": "Sure! Please enlighten me!"
      },
      {
        "role": "npc",
        "textEn": "(rolling up his sleeves with deliberate calm) I call this method \"Be Like Water.\" Listen well, Wanderer, I'll explain it to you. Empty your mind. Be formless, shapeless, like water.",
        "textRu": "(rolling up his sleeves with deliberate calm) I call this method \"Be Like Water.\" Listen well, Wanderer, I'll explain it to you. Empty your mind. Be formless, shapeless, like water."
      },
      {
        "role": "player",
        "textEn": "you remind me of a famous martial artist who once used that phrase",
        "textRu": "you remind me of a famous martial artist who once used that phrase"
      },
      {
        "role": "npc",
        "textEn": "(gaze fixed on the flowing stream, voice low and steady) Indeed, many masters have drawn wisdom from the nature of water. You put water into a cup, it becomes the cup. You put water into a bottle, it becomes the bottle. Now water can flow or it can crash. Be water, Wanderer.",
        "textRu": "(gaze fixed on the flowing stream, voice low and steady) Indeed, many masters have drawn wisdom from the nature of water. You put water into a cup, it becomes the cup. You put water into a bottle, it becomes the bottle. Now water can flow or it can crash. Be water, Wanderer."
      },
      {
        "role": "player",
        "textEn": "okay please tell me more",
        "textRu": "okay please tell me more"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing slightly) Tell me, Wanderer, does this stir any understanding within you? Profound truths often sound simple. This method was shaped by my own insight ... and by guidance from a master named Xiao Long. A pity ... I never learned his surname.",
        "textRu": "(eyes narrowing slightly) Tell me, Wanderer, does this stir any understanding within you? Profound truths often sound simple. This method was shaped by my own insight ... and by guidance from a master named Xiao Long. A pity ... I never learned his surname."
      },
      {
        "role": "npc",
        "textEn": "Have you heard of Bruce Lee",
        "textRu": "Have you heard of Bruce Lee"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, tone respectful yet firm) So he is the founder of Jeet Kune Do ... remarkable. Flexibility and speed, such principles harmonize perfectly with the way of water. What else can you tell me about him?",
        "textRu": "(nods slowly, tone respectful yet firm) So he is the founder of Jeet Kune Do ... remarkable. Flexibility and speed, such principles harmonize perfectly with the way of water. What else can you tell me about him?"
      },
      {
        "role": "npc",
        "textEn": "( you explained that he also used the phrases \"be formless, shapeless, like water\")",
        "textRu": "( you explained that he also used the phrases \"be formless, shapeless, like water\")"
      },
      {
        "role": "npc",
        "textEn": "(arches a brow) Ah, I see. The convergence of our thoughts is indeed intriguing. Such principles transcend time and place. Do you feel any deeper connection to these ideas now?",
        "textRu": "(arches a brow) Ah, I see. The convergence of our thoughts is indeed intriguing. Such principles transcend time and place. Do you feel any deeper connection to these ideas now?"
      },
      {
        "role": "npc",
        "textEn": "Yes! I am transcended by your words .. Thank you!",
        "textRu": "Yes! I am transcended by your words .. Thank you!"
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, gaze still on the stream) You are welcome, Wanderer. May these insights guide you in your path. What brings you to this place today?",
        "textRu": "(smiles faintly, gaze still on the stream) You are welcome, Wanderer. May these insights guide you in your path. What brings you to this place today?"
      },
      {
        "role": "player",
        "textEn": "(You explained your own enlighten from your journey)",
        "textRu": "(You explained your own enlighten from your journey)"
      },
      {
        "role": "npc",
        "textEn": "(cups his hands with calm dignity) I have gained much from our exchange today, Wanderer. I must return to my training now. May our paths cross again in the future.Shui Changliu doesn't seem to hear your words, his gaze still fixed on the flowing river.",
        "textRu": "(cups his hands with calm dignity) I have gained much from our exchange today, Wanderer. I must return to my training now. May our paths cross again in the future.Shui Changliu doesn't seem to hear your words, his gaze still fixed on the flowing river."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "small-chisel",
    "nameEn": "Small Chisel",
    "nameRu": "Малый Зубило",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "можно найти outside of his house.",
    "icon": "👤",
    "befriendGuide": "Believe Small Chisel's Gossip\nSmall Chisel loves gossiping about people so make sure to encourage him to tell more gossips and believe them so he'll have an easier time befriending you. You should also try to tell your own gossip even if it's just roleplaying to trick Small Chisel's AI.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(leaning in with a sly grin, voice lowered) Customer, have you heard of Master Xu, who calls himself \"Miaofa Rulai\"?",
        "textRu": "(leaning in with a sly grin, voice lowered) Customer, have you heard of Master Xu, who calls himself \"Miaofa Rulai\"?"
      },
      {
        "role": "npc",
        "textEn": "(Grins) Ohh please tell me more",
        "textRu": "(Grins) Ohh please tell me more"
      },
      {
        "role": "npc",
        "textEn": "(whispering, glancing around) Well, this so-called \"Miaofa Rulai\" is nothing but a swindler. There's a lady in town named Aunt Tian who fell for his tricks. She spent fifty taels on five hundred bottles of his so-called \"Sweet Dew,\" thinking it would heal her husband's ailments. Can you believe it?",
        "textRu": "(whispering, glancing around) Well, this so-called \"Miaofa Rulai\" is nothing but a swindler. There's a lady in town named Aunt Tian who fell for his tricks. She spent fifty taels on five hundred bottles of his so-called \"Sweet Dew,\" thinking it would heal her husband's ailments. Can you believe it?"
      },
      {
        "role": "npc",
        "textEn": "How evil can he be to target a gullible old woman",
        "textRu": "How evil can he be to target a gullible old woman"
      },
      {
        "role": "npc",
        "textEn": "(nodding solemnly, leaning closer) Exactly! Poor Aunt Tian, she was desperate to help her husband. When the \"Sweet Dew\" didn't work, she went back to demand a refund. But Master Xu refused, claiming he was \"enforcing heavenly law.\" It's outrageous!",
        "textRu": "(nodding solemnly, leaning closer) Exactly! Poor Aunt Tian, she was desperate to help her husband. When the \"Sweet Dew\" didn't work, she went back to demand a refund. But Master Xu refused, claiming he was \"enforcing heavenly law.\" It's outrageous!"
      },
      {
        "role": "npc",
        "textEn": "Thats absurb! They should demand a refund for such an outrageous price",
        "textRu": "Thats absurb! They should demand a refund for such an outrageous price"
      },
      {
        "role": "npc",
        "textEn": "(smiling wryly, shaking head) Of course, but Master Xu wouldn't budge. Aunt Tian was left fuming, and her husband nearly turned green with rage. It's a cautionary tale, Customer-be wary of such charlatans!",
        "textRu": "(smiling wryly, shaking head) Of course, but Master Xu wouldn't budge. Aunt Tian was left fuming, and her husband nearly turned green with rage. It's a cautionary tale, Customer-be wary of such charlatans!"
      },
      {
        "role": "npc",
        "textEn": "Sure! Thank you",
        "textRu": "Sure! Thank you"
      },
      {
        "role": "npc",
        "textEn": "(winking, patting the customer on the shoulder) No problem, Customer. Just remember, there are plenty of scoundrels out there. Stay sharp! Now, is there anything else you'd like to know?",
        "textRu": "(winking, patting the customer on the shoulder) No problem, Customer. Just remember, there are plenty of scoundrels out there. Stay sharp! Now, is there anything else you'd like to know?"
      },
      {
        "role": "player",
        "textEn": "(you tell him about the best rumors that are spreading among the people)",
        "textRu": "(you tell him about the best rumors that are spreading among the people)"
      },
      {
        "role": "npc",
        "textEn": "(grinning mischievously, eyes twinkling) Ah, the best rumors! Well, there's one about Old Wang from the market. They say he found a hidden treasure map and has been seen sneaking off into the mountains late at night. But let me tell you, none of those compare to Aunt Tian's story",
        "textRu": "(grinning mischievously, eyes twinkling) Ah, the best rumors! Well, there's one about Old Wang from the market. They say he found a hidden treasure map and has been seen sneaking off into the mountains late at night. But let me tell you, none of those compare to Aunt Tian's story"
      },
      {
        "role": "npc",
        "textEn": "Might I try to persuade you with my own story that might beat Aunt Tian story?",
        "textRu": "Might I try to persuade you with my own story that might beat Aunt Tian story?"
      },
      {
        "role": "npc",
        "textEn": "(chuckling, scratching his chin) Oh, I'm intrigued! Go ahead, Customer. Try me with your story. But remember, Aunt Tian's tale is pretty hard to top!",
        "textRu": "(chuckling, scratching his chin) Oh, I'm intrigued! Go ahead, Customer. Try me with your story. But remember, Aunt Tian's tale is pretty hard to top!"
      },
      {
        "role": "npc",
        "textEn": "sure So the tale starts ... ( You tell him about the outrageous big beast you saw in the dark while walking home from the forest, you told him how it disappeared at the sight of someone looking at it, as if it was never there to begin with)",
        "textRu": "sure So the tale starts ... ( You tell him about the outrageous big beast you saw in the dark while walking home from the forest, you told him how it disappeared at the sight of someone looking at it, as if it was never there to begin with)"
      },
      {
        "role": "npc",
        "textEn": "(clearing his throat, tone cheerful)Well, I've said enough for today! If you've got time another day, come find me, we'll have a good chat!Small Chisel hurries off to take care of something. Chat with him on another day.",
        "textRu": "(clearing his throat, tone cheerful)Well, I've said enough for today! If you've got time another day, come find me, we'll have a good chat!Small Chisel hurries off to take care of something. Chat with him on another day."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "song-shiheng",
    "nameEn": "Song Shiheng",
    "nameRu": "Сун Шиһэн",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the bridge к восточнее the Бархатная тень Landmark. He can be seen talking with Yan Chuchu.",
    "icon": "👤",
    "befriendGuide": "Give Song Shiheng Tickets to Heroes Assembly\nTo befriend Song Shiheng, tell him he has disappointed his wife for false promises to bring her to the Heroes Assembly. Once he follows up agreeing with you, roleplay giving him tickets to the Heroes Assembly which will improve his opinion of you and befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(throws his head back with a loud laugh, sleeves fluttering dramatically) When I strike it rich, I'll take Chuchu to the Heroes Assembly! We'll make a grand entrance and everyone will talk about us for years!",
        "textRu": "(throws his head back with a loud laugh, sleeves fluttering dramatically) When I strike it rich, I'll take Chuchu to the Heroes Assembly! We'll make a grand entrance and everyone will talk about us for years!"
      },
      {
        "role": "npc",
        "textEn": "Are you Song?",
        "textRu": "Are you Song?"
      },
      {
        "role": "npc",
        "textEn": "(flicks a dust mote away, grinning confidently) Indeed, I am Song Shiheng! What brings you to Velvet Shade today, Wanderer?",
        "textRu": "(flicks a dust mote away, grinning confidently) Indeed, I am Song Shiheng! What brings you to Velvet Shade today, Wanderer?"
      },
      {
        "role": "player",
        "textEn": "(You explained that his wife has been disappointed with the false promises that he has been keeping for his wife)",
        "textRu": "(You explained that his wife has been disappointed with the false promises that he has been keeping for his wife)"
      },
      {
        "role": "npc",
        "textEn": "(sighs heavily, running a hand through his hair) Ah, Chuchu ... She's been patient with me, but I do see her disappointment. It pains me to see her like that. But I swear, the right opportunity will come soon!",
        "textRu": "(sighs heavily, running a hand through his hair) Ah, Chuchu ... She's been patient with me, but I do see her disappointment. It pains me to see her like that. But I swear, the right opportunity will come soon!"
      },
      {
        "role": "npc",
        "textEn": "Here take this .. free of charge. (Tickets for the Hero assembly)",
        "textRu": "Here take this .. free of charge. (Tickets for the Hero assembly)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with surprise, reaches out hesitantly to take the tickets) Really? Free? But why would you- (pauses, then smiles gratefully) Thank you, Wanderer! This means the world to Chuchu and me. I promise, I'lI make sure we both have a memorable time!",
        "textRu": "(eyes widen with surprise, reaches out hesitantly to take the tickets) Really? Free? But why would you- (pauses, then smiles gratefully) Thank you, Wanderer! This means the world to Chuchu and me. I promise, I'lI make sure we both have a memorable time!"
      },
      {
        "role": "npc",
        "textEn": "Have a good time there you two!",
        "textRu": "Have a good time there you two!"
      },
      {
        "role": "npc",
        "textEn": "(bows deeply, holding the tickets close) I will! And thank you again, Wanderer. You've truly made a difference today.",
        "textRu": "(bows deeply, holding the tickets close) I will! And thank you again, Wanderer. You've truly made a difference today."
      },
      {
        "role": "npc",
        "textEn": "(Song Shiheng and his wife had a fun time in the assembly)",
        "textRu": "(Song Shiheng and his wife had a fun time in the assembly)"
      },
      {
        "role": "npc",
        "textEn": "(straightens his back suddenly, fists clenched with determination) Thank you, Wanderer. You've opened my eyes! I'll start right away, I won't let Chuchu's hopes down.Song Shiheng seems to have made up his mind to change.",
        "textRu": "(straightens his back suddenly, fists clenched with determination) Thank you, Wanderer. You've opened my eyes! I'll start right away, I won't let Chuchu's hopes down.Song Shiheng seems to have made up his mind to change."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "song-wu",
    "nameEn": "Song Wu",
    "nameRu": "Сун У",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen sweeping inside of the tavern.",
    "icon": "👤",
    "befriendGuide": "Recommend Places Around the Map\nYou should recommend Song Wu places in the map that you think are beautiful. Explain to him why you recommend those places and eventually, his AI will finally befriend you so don't give up on talking.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(gazing up at the sky with a wistful sigh) The world is so vast ... I truly want to go out and see it!",
        "textRu": "(gazing up at the sky with a wistful sigh) The world is so vast ... I truly want to go out and see it!"
      },
      {
        "role": "npc",
        "textEn": "The world is so big, you can discover a lot of things!",
        "textRu": "The world is so big, you can discover a lot of things!"
      },
      {
        "role": "npc",
        "textEn": "(nodding eagerly) Indeed, Young Master! There are countless wonders waiting to be discovered. What places would you suggest I visit?",
        "textRu": "(nodding eagerly) Indeed, Young Master! There are countless wonders waiting to be discovered. What places would you suggest I visit?"
      },
      {
        "role": "player",
        "textEn": "(You gave some of the best places like the general shrine where you can see warriors fight to see which ones were the best.)",
        "textRu": "(You gave some of the best places like the general shrine where you can see warriors fight to see which ones were the best.)"
      },
      {
        "role": "npc",
        "textEn": "(scratching my chin thoughtfully) A general shrine where warriors compete? That sounds thrilling! I've always admired their valor and skill. But I worry about the violence. Are there other peaceful yet awe-inspiring places you could recommend?",
        "textRu": "(scratching my chin thoughtfully) A general shrine where warriors compete? That sounds thrilling! I've always admired their valor and skill. But I worry about the violence. Are there other peaceful yet awe-inspiring places you could recommend?"
      },
      {
        "role": "player",
        "textEn": "(you recommended the halo's peak where the beauty of the land can be seen from atop of the mountain.)",
        "textRu": "(you recommended the halo's peak where the beauty of the land can be seen from atop of the mountain.)"
      },
      {
        "role": "npc",
        "textEn": "(smiling hopefully) Halo's Peak ... I've heard of it, but I know little about it. From the summit, one can behold the land's beauty in all its splendor. Could you tell me more about it, Young Master?",
        "textRu": "(smiling hopefully) Halo's Peak ... I've heard of it, but I know little about it. From the summit, one can behold the land's beauty in all its splendor. Could you tell me more about it, Young Master?"
      },
      {
        "role": "player",
        "textEn": "(you told him how the stars shine brighter when you are up close)",
        "textRu": "(you told him how the stars shine brighter when you are up close)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening with wonder) The stars shining brighter from up close? That must be a breathtaking sight! It makes me want to climb that mountain just to witness it. What other marvels lie atop Halo's Peak?",
        "textRu": "(eyes widening with wonder) The stars shining brighter from up close? That must be a breathtaking sight! It makes me want to climb that mountain just to witness it. What other marvels lie atop Halo's Peak?"
      },
      {
        "role": "player",
        "textEn": "(you brought him to see it himself, where he understood the beauty of what the wanderer was telling him)",
        "textRu": "(you brought him to see it himself, where he understood the beauty of what the wanderer was telling him)"
      },
      {
        "role": "npc",
        "textEn": "(pause, then smiling gratefully) That is most generous of you, Young Master! To experience such beauty firsthand would be unforgettable. I shall keep this in mind and perhaps make the journey soon. For now, let us continue our discussion here.",
        "textRu": "(pause, then smiling gratefully) That is most generous of you, Young Master! To experience such beauty firsthand would be unforgettable. I shall keep this in mind and perhaps make the journey soon. For now, let us continue our discussion here."
      },
      {
        "role": "npc",
        "textEn": "(song wu enjoyed finally understood the beauty of the recommendation the wanderer gave him)",
        "textRu": "(song wu enjoyed finally understood the beauty of the recommendation the wanderer gave him)"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully) Yes, Young Master, the beauty you described is truly enchanting. I am eager to see it for myself. Perhaps I will start planning my journey soon. Any other places you think I should visit?",
        "textRu": "(nodding thoughtfully) Yes, Young Master, the beauty you described is truly enchanting. I am eager to see it for myself. Perhaps I will start planning my journey soon. Any other places you think I should visit?"
      },
      {
        "role": "player",
        "textEn": "(you told him about the different places you visited, like the dark cave that only your voice can be heard, and the forest of where only your smell can help you on where to go.)",
        "textRu": "(you told him about the different places you visited, like the dark cave that only your voice can be heard, and the forest of where only your smell can help you on where to go.)"
      },
      {
        "role": "npc",
        "textEn": "(leaning in with interest) A dark cave where only your voice echoes, and a forest navigated by scent alone? Those sound like mysterious and intriguing places! I would love to explore them. Thank you for sharing these wonders, Young Master. Your stories inspire me more each time.",
        "textRu": "(leaning in with interest) A dark cave where only your voice echoes, and a forest navigated by scent alone? Those sound like mysterious and intriguing places! I would love to explore them. Thank you for sharing these wonders, Young Master. Your stories inspire me more each time."
      },
      {
        "role": "npc",
        "textEn": "(Song Wu then travelled himself after he got a break from work)",
        "textRu": "(Song Wu then travelled himself after he got a break from work)"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully) Thank you for your suggestions, Young Master. I'll visit those beautiful places one by one.Song Wu thinks over your words and thanks you.",
        "textRu": "(nodding thoughtfully) Thank you for your suggestions, Young Master. I'll visit those beautiful places one by one.Song Wu thinks over your words and thanks you."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "su-xinlu",
    "nameEn": "Su Xinlu",
    "nameRu": "Су Синьлу",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her by going южнее the Springwave Pavilion Landmark, where she can be seen talking with Yang Chunnuan and three other NPCs",
    "icon": "👤",
    "befriendGuide": "Agree to Vote for Su Xiniu's Brother\nTo befriend Su Xiniu, you only need to listen to what she has to say and then offer that you will vote for her brother to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pointing, voice sharp with indignation) Look at their attitude! No wonder their sister's reputation in Velvet Shade is so awful! They act like she's the center of Velvet Shade-like she rules the place! Happy now? Honestly, how is my brother in her way? It's a fair contest! Is it fun for you to trample us just to lift yourselves up?",
        "textRu": "(pointing, voice sharp with indignation) Look at their attitude! No wonder their sister's reputation in Velvet Shade is so awful! They act like she's the center of Velvet Shade-like she rules the place! Happy now? Honestly, how is my brother in her way? It's a fair contest! Is it fun for you to trample us just to lift yourselves up?"
      },
      {
        "role": "player",
        "textEn": "Your brother should win !! Let me help you",
        "textRu": "Your brother should win !! Let me help you"
      },
      {
        "role": "npc",
        "textEn": "(hands on hips) My Jiu takes the stage so seriously! He won't join a performance unless it's the best! He won't dance unless it's perfect! Because he only wants to show us the finest moves! And what about their so-called sister? She takes any gig! She'd even dance at Ah Huang's puppy birth outside the city! And they brag her queue stretches from South Gate Avenue to Velvet Shade? Please! If my brother weren't so picky, his line would run from outside Kaifeng all the way in!",
        "textRu": "(hands on hips) My Jiu takes the stage so seriously! He won't join a performance unless it's the best! He won't dance unless it's perfect! Because he only wants to show us the finest moves! And what about their so-called sister? She takes any gig! She'd even dance at Ah Huang's puppy birth outside the city! And they brag her queue stretches from South Gate Avenue to Velvet Shade? Please! If my brother weren't so picky, his line would run from outside Kaifeng all the way in!"
      },
      {
        "role": "player",
        "textEn": "(you helped promote her brother and won the voting later that week)",
        "textRu": "(you helped promote her brother and won the voting later that week)"
      },
      {
        "role": "npc",
        "textEn": "(clears throat, continuing eagerly) They say their sister wears a full face of makeup? My brother's skin has suffered from wearing makeup so often- enough already! We told him he doesn' t need to keep up a flawless look every single time~ And Jiu really listened to us- He cares about us! Jiu, Jiu ... how could I live without you!",
        "textRu": "(clears throat, continuing eagerly) They say their sister wears a full face of makeup? My brother's skin has suffered from wearing makeup so often- enough already! We told him he doesn' t need to keep up a flawless look every single time~ And Jiu really listened to us- He cares about us! Jiu, Jiu ... how could I live without you!"
      },
      {
        "role": "player",
        "textEn": "Your brother works hard, he should win !!",
        "textRu": "Your brother works hard, he should win !!"
      },
      {
        "role": "npc",
        "textEn": "(muttering under her breath, rolling her eyes) And here's the latest scoop! Their sister stays up late reading those mushy romance books-so late her eyes are swollen like eggs the next day! Ugh- She just wants a relationship! No ambition at all! You can't vote for someone with zero career drive!",
        "textRu": "(muttering under her breath, rolling her eyes) And here's the latest scoop! Their sister stays up late reading those mushy romance books-so late her eyes are swollen like eggs the next day! Ugh- She just wants a relationship! No ambition at all! You can't vote for someone with zero career drive!"
      },
      {
        "role": "npc",
        "textEn": "That is true !! We should vote someone like your brother who is a definition of worthy of the title!!",
        "textRu": "That is true !! We should vote someone like your brother who is a definition of worthy of the title!!"
      },
      {
        "role": "npc",
        "textEn": "(with a pleading look, voice trembling with emotion) Wanderer, please-you have to vote for my Jiu! He practiced dancing so hard his stomach got sick. It took him half a year just to gain a little weight back, and now he's losing it again for the flower fair! A career -driven man like Jiu is rare in all of Velvet Shade! Their sister talks big about ambition, but where are her works? I haven't seen a single one! Who knows how inflated her reputation is!",
        "textRu": "(with a pleading look, voice trembling with emotion) Wanderer, please-you have to vote for my Jiu! He practiced dancing so hard his stomach got sick. It took him half a year just to gain a little weight back, and now he's losing it again for the flower fair! A career -driven man like Jiu is rare in all of Velvet Shade! Their sister talks big about ambition, but where are her works? I haven't seen a single one! Who knows how inflated her reputation is!"
      },
      {
        "role": "npc",
        "textEn": "Okay, I will help you",
        "textRu": "Okay, I will help you"
      },
      {
        "role": "npc",
        "textEn": "(clapping excitedly, almost jumping) Then hurry and vote for my Jiu! Let him walk the path lined with blossoms !!!! Thank you, thank you so much! With your support, we'll make sure Jiu wins the title of Courtesan!",
        "textRu": "(clapping excitedly, almost jumping) Then hurry and vote for my Jiu! Let him walk the path lined with blossoms !!!! Thank you, thank you so much! With your support, we'll make sure Jiu wins the title of Courtesan!"
      },
      {
        "role": "npc",
        "textEn": "Yes we will !! (you two became friends)",
        "textRu": "Yes we will !! (you two became friends)"
      },
      {
        "role": "npc",
        "textEn": "(pleadingly, eyes glistening) Wanderer! Promise me you'll vote for my brother! Please!Su Xinlu looks at you with hopeful anticipation.",
        "textRu": "(pleadingly, eyes glistening) Wanderer! Promise me you'll vote for my brother! Please!Su Xinlu looks at you with hopeful anticipation."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "sun-mang",
    "nameEn": "Sun Mang",
    "nameRu": "Сунь Ман",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Хребет Печного огня",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him by following the south road от Porcelain Kiln Boundary Stone. Where you can see him standing у side of the fork.",
    "icon": "👤",
    "befriendGuide": "Urge Sun Mang to Tell His Story\nBefriending Sun Mang is easy as you only need to urge him to tell his story of failed business ventures. Volunteer to help him after he told most of his story to convince his AI to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(slumped shoulders, sighing heavily) No more business for me. I'm being honest now ... please, just spare me. If I try again, even the mountains will laugh at my misfortune.",
        "textRu": "(slumped shoulders, sighing heavily) No more business for me. I'm being honest now ... please, just spare me. If I try again, even the mountains will laugh at my misfortune."
      },
      {
        "role": "npc",
        "textEn": "Cmon, you can tell me",
        "textRu": "Cmon, you can tell me"
      },
      {
        "role": "npc",
        "textEn": "(regretful, sighing) I said I'd buy them. At first, he refused, acting embarrassed, saying he'd already lined up a big deal but needed money to hire writers in the capital for some stories. So I lent him extra cash and thought I was making an investment ... (spoiler: the only story written was mine ... \"The Fool Who Paid Twice\".)",
        "textRu": "(regretful, sighing) I said I'd buy them. At first, he refused, acting embarrassed, saying he'd already lined up a big deal but needed money to hire writers in the capital for some stories. So I lent him extra cash and thought I was making an investment ... (spoiler: the only story written was mine ... \"The Fool Who Paid Twice\".)"
      },
      {
        "role": "player",
        "textEn": "what happened next?",
        "textRu": "what happened next?"
      },
      {
        "role": "npc",
        "textEn": "(eyes dimming, tone bitter) When the wine arrived, I found out it was all fake, cheap imitations of \"Parting Tears.\" When I tried to find him, he'd vanished. Then I thought, at least the jars were real. Heaven's Pier was hosting a Parting Tears tasting event and needed lots of wine jars, surely I could sell them for a good price. (hope is a dangerous thing ... especially when it rides in a broken cart.)",
        "textRu": "(eyes dimming, tone bitter) When the wine arrived, I found out it was all fake, cheap imitations of \"Parting Tears.\" When I tried to find him, he'd vanished. Then I thought, at least the jars were real. Heaven's Pier was hosting a Parting Tears tasting event and needed lots of wine jars, surely I could sell them for a good price. (hope is a dangerous thing ... especially when it rides in a broken cart.)"
      },
      {
        "role": "player",
        "textEn": "I can help you in selling wine jars",
        "textRu": "I can help you in selling wine jars"
      },
      {
        "role": "npc",
        "textEn": "(face twisted in despair) But when I reached Ceramic Ridge, I learned Heaven's Pier had its own kilns making jars. My heart sank. And then, as if fate mocked me, my cart overturned ... every jar shattered. My whole world collapsed right there on the road. (I didn't just lose jars, I lost my will to believe in gravity.) (sighing deeply, voice heavy) Business and I don't mix. Every venture ends in loss ... I've burned through so much silver, even my purse feels lighter than my hopes.",
        "textRu": "(face twisted in despair) But when I reached Ceramic Ridge, I learned Heaven's Pier had its own kilns making jars. My heart sank. And then, as if fate mocked me, my cart overturned ... every jar shattered. My whole world collapsed right there on the road. (I didn't just lose jars, I lost my will to believe in gravity.) (sighing deeply, voice heavy) Business and I don't mix. Every venture ends in loss ... I've burned through so much silver, even my purse feels lighter than my hopes."
      },
      {
        "role": "npc",
        "textEn": "Continue",
        "textRu": "Continue"
      },
      {
        "role": "npc",
        "textEn": "(sighing deeply, voice heavy) Business and I don't mix. Every venture ends in loss ... I've burned through so much silver, even my purse feels lighter than my hopes. I tried staying honest, but honesty just laughed and walked away. If you have any other ideas or need advice on something else, feel free to ask",
        "textRu": "(sighing deeply, voice heavy) Business and I don't mix. Every venture ends in loss ... I've burned through so much silver, even my purse feels lighter than my hopes. I tried staying honest, but honesty just laughed and walked away. If you have any other ideas or need advice on something else, feel free to ask"
      },
      {
        "role": "player",
        "textEn": "(You volunteer in helping him create a business)",
        "textRu": "(You volunteer in helping him create a business)"
      },
      {
        "role": "npc",
        "textEn": "(mysteriously leaning closer, eyes glinting with sudden hope) I've always had bad luck, but I've just received inside news-a secret trade route that's raising silver. If it works, the profit will last me a lifetime. If it fails ... well, at least I'll have a tale to tell by the roadside.With a gloomy face, Sun Mang starts pondering his next business idea.",
        "textRu": "(mysteriously leaning closer, eyes glinting with sudden hope) I've always had bad luck, but I've just received inside news-a secret trade route that's raising silver. If it works, the profit will last me a lifetime. If it fails ... well, at least I'll have a tale to tell by the roadside.With a gloomy face, Sun Mang starts pondering his next business idea."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tan-xiangchen",
    "nameEn": "Tan Xiangchen",
    "nameRu": "Тань Сянчэнь",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her on the second floor of the Revelry Hall beside Yin yan, рядом с stairs к 1st floor. (West side)",
    "icon": "👤",
    "befriendGuide": "Listen to Tan Xiangchen and Tell Her to Take Action\nTan Xiangchen will complain that men get to enjoy the company of beautiful performers, while woman get criticized for doing the same. Tell her that men also get criticized sometimes for the same thing. Let her know that she should take action if she wants to be with handsome men.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(puzzled, brows slightly furrowed) I truly don't understand why that man named Zhuang is so furious. Honestly, women need a little beauty in our lives to keep going!",
        "textRu": "(puzzled, brows slightly furrowed) I truly don't understand why that man named Zhuang is so furious. Honestly, women need a little beauty in our lives to keep going!"
      },
      {
        "role": "npc",
        "textEn": "Oh you seem troubled mam, do you need help?",
        "textRu": "Oh you seem troubled mam, do you need help?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, eyes softening) Thank you for your concern, wanderer. It's just that I find it unfair how men can freely enjoy the company of beautiful performers here at Revelry Hall, while women are criticized for doing the same. What a dull, flavorless life I've been living!",
        "textRu": "(sighs deeply, eyes softening) Thank you for your concern, wanderer. It's just that I find it unfair how men can freely enjoy the company of beautiful performers here at Revelry Hall, while women are criticized for doing the same. What a dull, flavorless life I've been living!"
      },
      {
        "role": "player",
        "textEn": "I don't think only women experience that. Men also get ridiculed for having multiple women with them.",
        "textRu": "I don't think only women experience that. Men also get ridiculed for having multiple women with them."
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, tone thoughtful) That may be true, but it seems especially harsh for women. We deserve to find joy and relaxation just as much as men do. I reject the idea that we should deny ourselves such pleasures. It's only human to want him!",
        "textRu": "(raises an eyebrow, tone thoughtful) That may be true, but it seems especially harsh for women. We deserve to find joy and relaxation just as much as men do. I reject the idea that we should deny ourselves such pleasures. It's only human to want him!"
      },
      {
        "role": "npc",
        "textEn": "Then go for it.",
        "textRu": "Then go for it."
      },
      {
        "role": "npc",
        "textEn": "(smiles ruefully, shaking her head) Easier said than done, wanderer. When faced with temptation, boldly say: \"Bring it on!\" But deep down, I still feel a bit shy and hesitant.",
        "textRu": "(smiles ruefully, shaking her head) Easier said than done, wanderer. When faced with temptation, boldly say: \"Bring it on!\" But deep down, I still feel a bit shy and hesitant."
      },
      {
        "role": "npc",
        "textEn": "Be bolder. Nothing happens when you don't take action.",
        "textRu": "Be bolder. Nothing happens when you don't take action."
      },
      {
        "role": "npc",
        "textEn": "(eyes brighten, smile grows) Really? You think so? Well, then I shall try to be bolder. After all, everyone's responsible for their own choices and my \"stage husband\" will answer for mine!",
        "textRu": "(eyes brighten, smile grows) Really? You think so? Well, then I shall try to be bolder. After all, everyone's responsible for their own choices and my \"stage husband\" will answer for mine!"
      },
      {
        "role": "npc",
        "textEn": "Go get em! Good luck!",
        "textRu": "Go get em! Good luck!"
      },
      {
        "role": "npc",
        "textEn": "(thankfully) Thank you, wanderer! Your encouragement means a lot. I'll keep it in mind as I navigate the halls of Velvet Shade. Their beauty is our pride! May we all live well and thrive here.",
        "textRu": "(thankfully) Thank you, wanderer! Your encouragement means a lot. I'll keep it in mind as I navigate the halls of Velvet Shade. Their beauty is our pride! May we all live well and thrive here."
      },
      {
        "role": "npc",
        "textEn": "(Tan Xiangchen was happy)",
        "textRu": "(Tan Xiangchen was happy)"
      },
      {
        "role": "npc",
        "textEn": "(muttering to herself with a dreamy smile) Their beauty ... it's our pride!Tan Xiangchen finishes her dreamy monologue, still gazing at the handsome men with a lovestruck look.",
        "textRu": "(muttering to herself with a dreamy smile) Their beauty ... it's our pride!Tan Xiangchen finishes her dreamy monologue, still gazing at the handsome men with a lovestruck look."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tang-lubao",
    "nameEn": "Tang Lubao",
    "nameRu": "Тан Лубао",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Склон Боевого гребня",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "On the side of the road южнее the Tiger Fort in Склон Боевого гребня",
    "icon": "👤",
    "befriendGuide": "Offer Food and Work in General Shrine\nThe easiest way to befriend Tang Lubao is to tell him there is food and work waiting in the General Shrine. If he asks if he can take his grandfather with him, tell him that he can come which leads to you befriending Tang Lubao.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(kneeling on the ground, molding a lump of mud with trembling hands, eyes full of helplessness) Wanderer. my grandfather and I came all the way from Yannan, and now ... we don't even have a bite to eat ...",
        "textRu": "(kneeling on the ground, molding a lump of mud with trembling hands, eyes full of helplessness) Wanderer. my grandfather and I came all the way from Yannan, and now ... we don't even have a bite to eat ..."
      },
      {
        "role": "npc",
        "textEn": "There is a job and food waiting at the General's Shrine. I already told your grandfather about it and he agreed to go there. Come with me",
        "textRu": "There is a job and food waiting at the General's Shrine. I already told your grandfather about it and he agreed to go there. Come with me"
      },
      {
        "role": "npc",
        "textEn": "(looking up with wide eyes, hands pausing mid-mold) The General's Shrine .. giving food? But ... what about Grandpa? Can he come too?",
        "textRu": "(looking up with wide eyes, hands pausing mid-mold) The General's Shrine .. giving food? But ... what about Grandpa? Can he come too?"
      },
      {
        "role": "player",
        "textEn": "I already told him and he will go there with you",
        "textRu": "I already told him and he will go there with you"
      },
      {
        "role": "npc",
        "textEn": "(eyes shining, clutching the mud as if it were real food) Thank you, Wanderer! My grandfather and I ... we finally won't have to go hungry anymore!Tang Lubao expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes shining, clutching the mud as if it were real food) Thank you, Wanderer! My grandfather and I ... we finally won't have to go hungry anymore!Tang Lubao expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tanxiang",
    "nameEn": "Tanxiang",
    "nameRu": "Тань Сян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Деревня Урожайной осени",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Tanxiang is found standing by a tree рядом с shore beyond the fields западнее Деревня Урожайной осени.",
    "icon": "👤",
    "befriendGuide": "Tell Her to Follow Her Heart\nTo befriend Tanxiang, all you have to do is encourage her to follow her heart when making tough decisions. When she doubts herself, continue insisting anyway.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs softly, adjusts her sleeve and furrows her elegant brows) I think everyone I meet is wonderful, but relationships never last long. Alas... seeing sisters cry, I don't want that either~ So many people like me, but I'm only one person—how can I make everyone happy? I'm so troubled. Wanderer... what do you think I should do?",
        "textRu": "(sighs softly, adjusts her sleeve and furrows her elegant brows) I think everyone I meet is wonderful, but relationships never last long. Alas... seeing sisters cry, I don't want that either~ So many people like me, but I'm only one person—how can I make everyone happy? I'm so troubled. Wanderer... what do you think I should do?"
      },
      {
        "role": "npc",
        "textEn": "Listen to your heart.",
        "textRu": "Listen to your heart."
      },
      {
        "role": "npc",
        "textEn": "(eyes light up, smile softly) Listen to my heart, huh? (gently touches her cheek) I've tried that, but it seems I just can't figure out what my heart truly wants... (pouts playfully) Maybe my heart is as fickle as I am. What do you think, Wanderer?",
        "textRu": "(eyes light up, smile softly) Listen to my heart, huh? (gently touches her cheek) I've tried that, but it seems I just can't figure out what my heart truly wants... (pouts playfully) Maybe my heart is as fickle as I am. What do you think, Wanderer?"
      },
      {
        "role": "npc",
        "textEn": "Just do what you think is right.",
        "textRu": "Just do what you think is right."
      },
      {
        "role": "npc",
        "textEn": "(eyes sparkle, throws you a playful glance) Wanderer, you're truly clever! Tanxiang has gained so much inspiration from you~ Come find me more often when you have time~ Tanxiang expresses gratitude and begins to ponder carefully.",
        "textRu": "(eyes sparkle, throws you a playful glance) Wanderer, you're truly clever! Tanxiang has gained so much inspiration from you~ Come find me more often when you have time~ Tanxiang expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tao-jingjing",
    "nameEn": "Tao Jingjing",
    "nameRu": "Тао Цзинцзин",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her beside Cao Jinyang on the ground floor of the Revelry Hall, on the north side of the building.",
    "icon": "👤",
    "befriendGuide": "Listen to Tao Jingjing's Worries\nTao Jingjing worries about Cao Jinyang, her lover, overworking himself for both their sakes. Tell her that they should talk it out so they can fix the problem.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(face full of urgency, arms crossed) That fool ... honestly, what is he thinking this time?",
        "textRu": "(face full of urgency, arms crossed) That fool ... honestly, what is he thinking this time?"
      },
      {
        "role": "npc",
        "textEn": "Hey, are you okay?",
        "textRu": "Hey, are you okay?"
      },
      {
        "role": "npc",
        "textEn": "(eyes wide, frowning) Oh, it's that Cao Jinyang again. He's been working himself to the bone for no reason.",
        "textRu": "(eyes wide, frowning) Oh, it's that Cao Jinyang again. He's been working himself to the bone for no reason."
      },
      {
        "role": "npc",
        "textEn": "Oh you're husband?",
        "textRu": "Oh you're husband?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, shaking head) Yes, Cao Jinyang. He's not really my husband yet, but we're in a relationship. Why does he insist on doing things that make him miserable?",
        "textRu": "(sighs deeply, shaking head) Yes, Cao Jinyang. He's not really my husband yet, but we're in a relationship. Why does he insist on doing things that make him miserable?"
      },
      {
        "role": "npc",
        "textEn": "Maybe he is working hard right now so that both of you can have a better life.",
        "textRu": "Maybe he is working hard right now so that both of you can have a better life."
      },
      {
        "role": "npc",
        "textEn": "(hands on hips, voice firm) I have more than enough wealth. His monthly earnings barely cover my daily expenses. He's just wearing himself out over nothing.",
        "textRu": "(hands on hips, voice firm) I have more than enough wealth. His monthly earnings barely cover my daily expenses. He's just wearing himself out over nothing."
      },
      {
        "role": "npc",
        "textEn": "You should talk with him. Tell him about your concerns",
        "textRu": "You should talk with him. Tell him about your concerns"
      },
      {
        "role": "npc",
        "textEn": "(nodding, biting lip) You're right. I need to sit down and have a serious talk with him. He should focus on what makes him happy, not what others expect.",
        "textRu": "(nodding, biting lip) You're right. I need to sit down and have a serious talk with him. He should focus on what makes him happy, not what others expect."
      },
      {
        "role": "npc",
        "textEn": "Good luck I hope you both fix this problem you guys have",
        "textRu": "Good luck I hope you both fix this problem you guys have"
      },
      {
        "role": "npc",
        "textEn": "(smiling softly, nodding) Thank you. I truly hope so too. I just want him to be himself and be happy.",
        "textRu": "(smiling softly, nodding) Thank you. I truly hope so too. I just want him to be himself and be happy."
      },
      {
        "role": "npc",
        "textEn": "(Both of them were able to talk it out)",
        "textRu": "(Both of them were able to talk it out)"
      },
      {
        "role": "npc",
        "textEn": "(sighs, a mix of exasperation and affection in her voice) That fool ... he probably sensed I was upset, yet still didn't ask me why. When will he understand? I don't need him to earn money, I just want him to be himself.Tao Jingjing shoots a glance at Cao Jinyang, thinking to herself that he's the biggest fool in all of Kaifeng.",
        "textRu": "(sighs, a mix of exasperation and affection in her voice) That fool ... he probably sensed I was upset, yet still didn't ask me why. When will he understand? I don't need him to earn money, I just want him to be himself.Tao Jingjing shoots a glance at Cao Jinyang, thinking to herself that he's the biggest fool in all of Kaifeng."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tao-wang",
    "nameEn": "Tao Wang",
    "nameRu": "Тао Ван",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Холм Мудреца",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "от Back Mountain landmark, go north and climb the rocky wall until you find him у top",
    "icon": "👤",
    "befriendGuide": "Convince Him to Work or Agree With Him\nWhether you try to convince Tao Wang to stop slacking and do his work or agree with him lying flat to relax, he will always say that lying flat is a good as it let us see the bigger picture and it teaches us something. Eventually, he will befriend you if you talk too long with him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(yawning lazily, gazing at the mountains) Wanderer, why not slow down? Why be chained by the petty troubles of the mortal world? I often think, \"to steal half a day's leisure from a fleeting life\"-how could anyone miss such a beautiful moment?",
        "textRu": "(yawning lazily, gazing at the mountains) Wanderer, why not slow down? Why be chained by the petty troubles of the mortal world? I often think, \"to steal half a day's leisure from a fleeting life\"-how could anyone miss such a beautiful moment?"
      },
      {
        "role": "npc",
        "textEn": "Hello, a little chill are we?",
        "textRu": "Hello, a little chill are we?"
      },
      {
        "role": "npc",
        "textEn": "(smiling wistfully, shaking head gently) Not at all, wanderer. I merely find joy in the tranquility of nature. Work never ends; better to embrace the peace and quiet while you can. Have you ever considered the art of lying flat?",
        "textRu": "(smiling wistfully, shaking head gently) Not at all, wanderer. I merely find joy in the tranquility of nature. Work never ends; better to embrace the peace and quiet while you can. Have you ever considered the art of lying flat?"
      },
      {
        "role": "npc",
        "textEn": "By not working your part of the job, you would be a burden to others. Do you not care about your fellow workmates?",
        "textRu": "By not working your part of the job, you would be a burden to others. Do you not care about your fellow workmates?"
      },
      {
        "role": "npc",
        "textEn": "(sighing deeply, looking thoughtful) Ah, but consider this: if everyone worked tirelessly without rest, would they truly appreciate the value of labor? Sometimes, lying flat is a form of resistance-a way to remind ourselves and others that life is more than just endless toil.",
        "textRu": "(sighing deeply, looking thoughtful) Ah, but consider this: if everyone worked tirelessly without rest, would they truly appreciate the value of labor? Sometimes, lying flat is a form of resistance-a way to remind ourselves and others that life is more than just endless toil."
      },
      {
        "role": "npc",
        "textEn": "But you can also have a work and life balance to keep yourself from becoming too tired.",
        "textRu": "But you can also have a work and life balance to keep yourself from becoming too tired."
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, eyes twinkling with mischief) Indeed, balance is key. Yet, in this fast-paced world, how often do we truly achieve it? Lying flat allows us to step back and see the bigger picture. It teaches us that sometimes, doing",
        "textRu": "(nodding slowly, eyes twinkling with mischief) Indeed, balance is key. Yet, in this fast-paced world, how often do we truly achieve it? Lying flat allows us to step back and see the bigger picture. It teaches us that sometimes, doing"
      },
      {
        "role": "player",
        "textEn": "then tell me what do you plan to do",
        "textRu": "then tell me what do you plan to do"
      },
      {
        "role": "npc",
        "textEn": "(leaning back against a rock, smiling lazily) My plan? To enjoy this very moment, to let the worries of the world fade away. I will continue to lie flat, embracing simplicity and peace. And perhaps, in time, you too will see the wisdom in it.",
        "textRu": "(leaning back against a rock, smiling lazily) My plan? To enjoy this very moment, to let the worries of the world fade away. I will continue to lie flat, embracing simplicity and peace. And perhaps, in time, you too will see the wisdom in it."
      },
      {
        "role": "npc",
        "textEn": "(after that Tao Wang took a nap and noticed that he was paralyzed in his sleep. He couldn't move and no one would help him)",
        "textRu": "(after that Tao Wang took a nap and noticed that he was paralyzed in his sleep. He couldn't move and no one would help him)"
      },
      {
        "role": "npc",
        "textEn": "(awakening abruptly, looking around anxiously) Oh, wanderer! I had a strange dream where I was trapped and unable to move, It was most unsettling. But now, in the light of day, I realize that even in our deepest fears, lying flat can bring a sense of calm. What do you think?",
        "textRu": "(awakening abruptly, looking around anxiously) Oh, wanderer! I had a strange dream where I was trapped and unable to move, It was most unsettling. But now, in the light of day, I realize that even in our deepest fears, lying flat can bring a sense of calm. What do you think?"
      },
      {
        "role": "npc",
        "textEn": "No, by lying flat you almost died. Do you see? By also not doing anything you are prone to death.",
        "textRu": "No, by lying flat you almost died. Do you see? By also not doing anything you are prone to death."
      },
      {
        "role": "npc",
        "textEn": "(frowning thoughtfully, rubbing his chin) That is a profound point, wanderer. Yet, I believe that true lying flat is not about neglecting one's duties entirely but finding a middle ground- enjoying life without being consumed by it. Even in moments of stillness, there is strength and resilience. Perhaps my dream was a reminder to find balance",
        "textRu": "(frowning thoughtfully, rubbing his chin) That is a profound point, wanderer. Yet, I believe that true lying flat is not about neglecting one's duties entirely but finding a middle ground- enjoying life without being consumed by it. Even in moments of stillness, there is strength and resilience. Perhaps my dream was a reminder to find balance"
      },
      {
        "role": "npc",
        "textEn": "Yes, so why not do your part and also work, after that you are done with your work. You can chill here and feel the breeze.",
        "textRu": "Yes, so why not do your part and also work, after that you are done with your work. You can chill here and feel the breeze."
      },
      {
        "role": "npc",
        "textEn": "(stretching lazily, tone light) Ah, today's quota of socializing is complete. I'm heading back to lying flat. Remember, Wanderer, proper rest is the best nourishment for the brain!After a brief farewell, Tao Wang turns and continues admiring the scenery.",
        "textRu": "(stretching lazily, tone light) Ah, today's quota of socializing is complete. I'm heading back to lying flat. Remember, Wanderer, proper rest is the best nourishment for the brain!After a brief farewell, Tao Wang turns and continues admiring the scenery."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tian-heng",
    "nameEn": "Tian Heng",
    "nameRu": "Тянь Хэн",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him sitting in one of the tables внутри red building.",
    "icon": "👤",
    "befriendGuide": "Glare at Tian Heng to Threaten Him\nOne ways to befriend Tian Heng is to roleplay glaring at him to scare him from his demands to apologize to his daughter. After that, tell him to be lenient with his daughter as he is overprotective to her. There is a chance that this will trick the AI to befriend you and if it doesn't work, reset the AI to try again.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(hands on hips, glaring fiercely) What's this? An idle wanderer chatting with my daughter? I knew it, she's been led astray by people like you! Hurry up and apologize to her!",
        "textRu": "(hands on hips, glaring fiercely) What's this? An idle wanderer chatting with my daughter? I knew it, she's been led astray by people like you! Hurry up and apologize to her!"
      },
      {
        "role": "npc",
        "textEn": "Why should I apologize? I haven't done anything wrong",
        "textRu": "Why should I apologize? I haven't done anything wrong"
      },
      {
        "role": "npc",
        "textEn": "(voice rising, face reddening) You dare question me? My daughter's studies have slipped because of your influence! Apologize now, before I lose my temper!",
        "textRu": "(voice rising, face reddening) You dare question me? My daughter's studies have slipped because of your influence! Apologize now, before I lose my temper!"
      },
      {
        "role": "player",
        "textEn": "(You explained that he is overreacting and you have done nothing to her daughter)",
        "textRu": "(You explained that he is overreacting and you have done nothing to her daughter)"
      },
      {
        "role": "npc",
        "textEn": "(snorts with disdain, voice dripping suspicion) Overreacting? My daughter's grades have plummeted since she started associating with the likes of you! Apologize to her, or face the consequences!",
        "textRu": "(snorts with disdain, voice dripping suspicion) Overreacting? My daughter's grades have plummeted since she started associating with the likes of you! Apologize to her, or face the consequences!"
      },
      {
        "role": "player",
        "textEn": "(you looked at his eyes with a killer instinct) I told you to back down",
        "textRu": "(you looked at his eyes with a killer instinct) I told you to back down"
      },
      {
        "role": "npc",
        "textEn": "(eyes blazing, tone venomous) You dare threaten me? You'll regret this! Apologize to my daughter, or I'll see to it that you pay dearly!",
        "textRu": "(eyes blazing, tone venomous) You dare threaten me? You'll regret this! Apologize to my daughter, or I'll see to it that you pay dearly!"
      },
      {
        "role": "player",
        "textEn": "(You looked again but now with the aura of fear! Tian Heng is scared with what he is seeing and is afraid.)",
        "textRu": "(You looked again but now with the aura of fear! Tian Heng is scared with what he is seeing and is afraid.)"
      },
      {
        "role": "npc",
        "textEn": "(steps back, face pale, hands trembling) What sorcery is this? Stay away from my daughter! Apologize to her, or I swear I'll make sure you never return to this mountain!",
        "textRu": "(steps back, face pale, hands trembling) What sorcery is this? Stay away from my daughter! Apologize to her, or I swear I'll make sure you never return to this mountain!"
      },
      {
        "role": "npc",
        "textEn": "Rather than blaming me for something I didn't do. Why not try to be a little more lenient with your daughter? Can't you see she is running away from you just because you are too overprotective.",
        "textRu": "Rather than blaming me for something I didn't do. Why not try to be a little more lenient with your daughter? Can't you see she is running away from you just because you are too overprotective."
      },
      {
        "role": "npc",
        "textEn": "(continues with a cold sneer) Hmph! Don't think this ends here. Stay away from my daughter, or you'll regret it!Tian Heng's face darkens, clearly on the verge of losing his temper.",
        "textRu": "(continues with a cold sneer) Hmph! Don't think this ends here. Stay away from my daughter, or you'll regret it!Tian Heng's face darkens, clearly on the verge of losing his temper."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "tu-er",
    "nameEn": "Tu Er",
    "nameRu": "Ту Эр",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him by going севернее the Springwave Pavilion Landmark, where he can be seen talking with Tu Dakuan.",
    "icon": "👤",
    "befriendGuide": "Help Tu Er Find a Fireworks Seller\nTu Er is struggling to find ninety-nine fireworks, as he only found a few and his master demands more. Roleplay helping Tu Er find a fireworks seller and tell a location like near the entrance of Kaifeng City to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(frowning, rubbing his hands nervously) W-Wanderer ... I-I'm in a real bind ... My master wants ninety-nine red fireworks, and I've only managed to find nineteen ... Wh-what am I supposed to do?",
        "textRu": "(frowning, rubbing his hands nervously) W-Wanderer ... I-I'm in a real bind ... My master wants ninety-nine red fireworks, and I've only managed to find nineteen ... Wh-what am I supposed to do?"
      },
      {
        "role": "player",
        "textEn": "wait are you sure its nineteen? Maybe you just heard it wrong",
        "textRu": "wait are you sure its nineteen? Maybe you just heard it wrong"
      },
      {
        "role": "npc",
        "textEn": "(looking puzzled, scratching his head) I-I'm certain, sir. My master was quite clear about it. He said nineteen, but he needs ninety-nine ... It's such a daunting task. Every shop in Kaifeng seems to have run out of red fireworks ... (sighing heavily)",
        "textRu": "(looking puzzled, scratching his head) I-I'm certain, sir. My master was quite clear about it. He said nineteen, but he needs ninety-nine ... It's such a daunting task. Every shop in Kaifeng seems to have run out of red fireworks ... (sighing heavily)"
      },
      {
        "role": "player",
        "textEn": "wait lemme talk with your master",
        "textRu": "wait lemme talk with your master"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, stepping back slightly) Oh no, sir! I can't let you speak to my master directly. He's ... well, he's very demanding. It would only make things worse for me. P-please, just help me",
        "textRu": "(eyes widening, stepping back slightly) Oh no, sir! I can't let you speak to my master directly. He's ... well, he's very demanding. It would only make things worse for me. P-please, just help me"
      },
      {
        "role": "npc",
        "textEn": "Believe me. I have my ways (you proceeded to talk with the master about the fireworks. Both of you talked about making a deal in which the master gladly agreed and pardoned Tu Er from getting ninety-nine fireworks)",
        "textRu": "Believe me. I have my ways (you proceeded to talk with the master about the fireworks. Both of you talked about making a deal in which the master gladly agreed and pardoned Tu Er from getting ninety-nine fireworks)"
      },
      {
        "role": "npc",
        "textEn": "(squirming uncomfortably, eyes darting around) W-Wanderer, I appreciate your intentions, but I can't risk that. My master is unpredictable when it comes to his demands, If something goes wrong, I'll be in even deeper trouble. C-can you think of another way to help me find those fireworks instead?",
        "textRu": "(squirming uncomfortably, eyes darting around) W-Wanderer, I appreciate your intentions, but I can't risk that. My master is unpredictable when it comes to his demands, If something goes wrong, I'll be in even deeper trouble. C-can you think of another way to help me find those fireworks instead?"
      },
      {
        "role": "npc",
        "textEn": "Okay let me help you (after a while, both of you found a seller that can provide 99 fireworks)",
        "textRu": "Okay let me help you (after a while, both of you found a seller that can provide 99 fireworks)"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up with hope, clasping his hands together) R-Really? That would be a miracle! W-Wanderer, you're a lifesaver! Can you tell me where to find this seller? I need to secure those fireworks as soon as possible!",
        "textRu": "(eyes lighting up with hope, clasping his hands together) R-Really? That would be a miracle! W-Wanderer, you're a lifesaver! Can you tell me where to find this seller? I need to secure those fireworks as soon as possible!"
      },
      {
        "role": "player",
        "textEn": "(you told him he is near the entrance of Kaifeng City",
        "textRu": "(you told him he is near the entrance of Kaifeng City"
      },
      {
        "role": "npc",
        "textEn": "(his eyes brighten, face breaking into a relieved smile) I-I'm so grateful! Wanderer, you're like a living Bodhisattva! With your help, I'll do everything I can to fulfill my master's wish,Tu Er expresses gratitude and begins to ponder",
        "textRu": "(his eyes brighten, face breaking into a relieved smile) I-I'm so grateful! Wanderer, you're like a living Bodhisattva! With your help, I'll do everything I can to fulfill my master's wish,Tu Er expresses gratitude and begins to ponder"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "uncle-mi",
    "nameEn": "Uncle Mi",
    "nameRu": "Дядя Ми",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen under a white petal tree.",
    "icon": "👤",
    "befriendGuide": "Tell Uncle Mi of Your Adventure\nUncle Mi is distracted with his account book but is interested in learning about gossip. Share to him some ridiculous stories you can think of so far until he decides to befriend you after talking to him for long.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(forcefully flicks the abacus beads) ...",
        "textRu": "(forcefully flicks the abacus beads) ..."
      },
      {
        "role": "player",
        "textEn": "hey are you okay friend?",
        "textRu": "hey are you okay friend?"
      },
      {
        "role": "npc",
        "textEn": "(slowly flicks the abacus beads) ... (murmurs to himself: Just focus on the numbers)",
        "textRu": "(slowly flicks the abacus beads) ... (murmurs to himself: Just focus on the numbers)"
      },
      {
        "role": "player",
        "textEn": "hey .... you want some juicy gossip",
        "textRu": "hey .... you want some juicy gossip"
      },
      {
        "role": "npc",
        "textEn": "(flicks the abacus beads with a slight pause) ... (ears perk up slightly)",
        "textRu": "(flicks the abacus beads with a slight pause) ... (ears perk up slightly)"
      },
      {
        "role": "player",
        "textEn": "hmm .. you seem to like what I hear",
        "textRu": "hmm .. you seem to like what I hear"
      },
      {
        "role": "npc",
        "textEn": "(flicks the abacus beads faster) ... (a glint of interest in his eyes)",
        "textRu": "(flicks the abacus beads faster) ... (a glint of interest in his eyes)"
      },
      {
        "role": "player",
        "textEn": "(you told him about a gossip about a girl having a secret affair with another man)",
        "textRu": "(you told him about a gossip about a girl having a secret affair with another man)"
      },
      {
        "role": "npc",
        "textEn": "(stops flicking the abacus beads, eyes widening slightly) ... (leans forward a bit)",
        "textRu": "(stops flicking the abacus beads, eyes widening slightly) ... (leans forward a bit)"
      },
      {
        "role": "player",
        "textEn": "(you told in detail about the girl leaving their house at night to meet the other man under a tree)",
        "textRu": "(you told in detail about the girl leaving their house at night to meet the other man under a tree)"
      },
      {
        "role": "npc",
        "textEn": "(throws down the abacus with a loud clack, eyes blazing with excitement) ... Young Master, is what you said true ?!Uncle Mi is interrupted mid-calculation",
        "textRu": "(throws down the abacus with a loud clack, eyes blazing with excitement) ... Young Master, is what you said true ?!Uncle Mi is interrupted mid-calculation"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wang-duobao",
    "nameEn": "Wang Duobao",
    "nameRu": "Ван Дуобао",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Каменистый берег",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Found sitting while fishing у edge of the river у left side of the Храм генералов and севернее Каменистый берег Boundary Stone.",
    "icon": "👤",
    "befriendGuide": "Honor the Fallen Soldiers with Food and Prayers\nWang Duobao contemplates on how he can honor the fallen soldiers of the land. Suggest to him that they can honor them with food and prayers. If he asks why the fallen soldiers should be remembered, tell Wang Duobao that without the sacrifices of the soldiers, then there will be no bright future that awaits us.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(shaking his head slowly) Alas ... the world is fading. These days, no one remembers the soldiers who gave their lives ...",
        "textRu": "(shaking his head slowly) Alas ... the world is fading. These days, no one remembers the soldiers who gave their lives ..."
      },
      {
        "role": "player",
        "textEn": "I want to pay my respects to the fallen soldiers who sacrificed their lives for peace.",
        "textRu": "I want to pay my respects to the fallen soldiers who sacrificed their lives for peace."
      },
      {
        "role": "npc",
        "textEn": "(nodding solemnly) That is good to hear, wanderer. Many have forgotten the sacrifices made by those brave souls. Perhaps there is hope yet. Tell me, why do you wish to honor them?",
        "textRu": "(nodding solemnly) That is good to hear, wanderer. Many have forgotten the sacrifices made by those brave souls. Perhaps there is hope yet. Tell me, why do you wish to honor them?"
      },
      {
        "role": "npc",
        "textEn": "They lay their life so that people can have a bright future. They deserve to not be forgotten and instead revered for their sacrifice",
        "textRu": "They lay their life so that people can have a bright future. They deserve to not be forgotten and instead revered for their sacrifice"
      },
      {
        "role": "npc",
        "textEn": "(bowing his head in respect) Indeed, their bravery and selflessness deserve to be remembered. It is a duty we owe to them. How do you plan to ensure their memory lives on?",
        "textRu": "(bowing his head in respect) Indeed, their bravery and selflessness deserve to be remembered. It is a duty we owe to them. How do you plan to ensure their memory lives on?"
      },
      {
        "role": "player",
        "textEn": "I will tell stories of their glory to others, as well as visit their graves while offering food and prayers to them",
        "textRu": "I will tell stories of their glory to others, as well as visit their graves while offering food and prayers to them"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly) What you say makes sense, Wanderer. We must remember history and honour those who sacrificed.Wang Duobao expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods firmly) What you say makes sense, Wanderer. We must remember history and honour those who sacrificed.Wang Duobao expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wang-duoli",
    "nameEn": "Wang Duoli",
    "nameRu": "Ван Дуоли",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Склон Боевого гребня",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Wang Duoli находится к южнее the lake рядом с Starfall Spring Boundary Stone",
    "icon": "👤",
    "befriendGuide": "Tell Wang Duoli You Want Qinghe River's Fish\nTell Wang Duoli that you want to taste Qinghe River's fish and that you are getting hungry. Offer to help him cook the fish and roleplay the steps on cooking it. Tell him that the fish is delicious to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(smiling as he gazes at the rippling water) Ah ... these Qinghe waters raise fish as fine as any from Jiangnan ... perhaps even better.",
        "textRu": "(smiling as he gazes at the rippling water) Ah ... these Qinghe waters raise fish as fine as any from Jiangnan ... perhaps even better."
      },
      {
        "role": "npc",
        "textEn": "Hello my good friend",
        "textRu": "Hello my good friend"
      },
      {
        "role": "npc",
        "textEn": "(nods with a warm smile) Greetings, Wanderer! What brings you to the banks of Qinghe today?",
        "textRu": "(nods with a warm smile) Greetings, Wanderer! What brings you to the banks of Qinghe today?"
      },
      {
        "role": "player",
        "textEn": "I wanted to try some fish here at Qinghe River",
        "textRu": "I wanted to try some fish here at Qinghe River"
      },
      {
        "role": "npc",
        "textEn": "(leans forward, eyes gleaming with pride) Ah, an excellent choice! The fish here are unmatched in flavor. Would you like to see the catch of the day?",
        "textRu": "(leans forward, eyes gleaming with pride) Ah, an excellent choice! The fish here are unmatched in flavor. Would you like to see the catch of the day?"
      },
      {
        "role": "player",
        "textEn": "yes ofcourse!",
        "textRu": "yes ofcourse!"
      },
      {
        "role": "npc",
        "textEn": "(nods, gesturing towards a basket of fish) Here they are, fresh from the waters of Qinghe. Notice their sleek scales and vibrant colors. These fish are as delicious as they are beautiful.",
        "textRu": "(nods, gesturing towards a basket of fish) Here they are, fresh from the waters of Qinghe. Notice their sleek scales and vibrant colors. These fish are as delicious as they are beautiful."
      },
      {
        "role": "npc",
        "textEn": "Visually pleasing and Taste good hmmm now im getting more hungry",
        "textRu": "Visually pleasing and Taste good hmmm now im getting more hungry"
      },
      {
        "role": "npc",
        "textEn": "(chuckles, nodding in agreement) Indeed, the sight alone can make one's mouth water. But wait until you taste them! The flesh is tender and rich in flavor.",
        "textRu": "(chuckles, nodding in agreement) Indeed, the sight alone can make one's mouth water. But wait until you taste them! The flesh is tender and rich in flavor."
      },
      {
        "role": "player",
        "textEn": "I want to eat some fish.",
        "textRu": "I want to eat some fish."
      },
      {
        "role": "npc",
        "textEn": "(smiles broadly, pointing to a nearby hut) Follow me, Wanderer. I have a small cooking area where we can prepare some of the freshest fish you've ever tasted.",
        "textRu": "(smiles broadly, pointing to a nearby hut) Follow me, Wanderer. I have a small cooking area where we can prepare some of the freshest fish you've ever tasted."
      },
      {
        "role": "npc",
        "textEn": "(follow wang douli to the hut) Can I help on preparing this meal?",
        "textRu": "(follow wang douli to the hut) Can I help on preparing this meal?"
      },
      {
        "role": "npc",
        "textEn": "(grins, nodding) Of course! A helping hand is always welcome. We can clean and gut the fish together, and I'll show you how to season them just right.",
        "textRu": "(grins, nodding) Of course! A helping hand is always welcome. We can clean and gut the fish together, and I'll show you how to season them just right."
      },
      {
        "role": "npc",
        "textEn": "Thank you this is a memorable experience for me!",
        "textRu": "Thank you this is a memorable experience for me!"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, rolling up his sleeves) It's my pleasure, Wanderer. Cooking a fine meal is best done with good company. Let's get started!",
        "textRu": "(smiles warmly, rolling up his sleeves) It's my pleasure, Wanderer. Cooking a fine meal is best done with good company. Let's get started!"
      },
      {
        "role": "player",
        "textEn": "yes lets do this!",
        "textRu": "yes lets do this!"
      },
      {
        "role": "npc",
        "textEn": "(nods enthusiastically, handing over a knife) Excellent! Take this knife and let's start cleaning the fish. I'll show you how it's done.",
        "textRu": "(nods enthusiastically, handing over a knife) Excellent! Take this knife and let's start cleaning the fish. I'll show you how it's done."
      },
      {
        "role": "npc",
        "textEn": "(Take knife and follows Wand duoli's lead)",
        "textRu": "(Take knife and follows Wand duoli's lead)"
      },
      {
        "role": "npc",
        "textEn": "(nods approvingly, guiding your hands) That's it, just like that. See how the scales come off cleanly? Soon we'll have a perfect meal ready.",
        "textRu": "(nods approvingly, guiding your hands) That's it, just like that. See how the scales come off cleanly? Soon we'll have a perfect meal ready."
      },
      {
        "role": "player",
        "textEn": "what is the next step master",
        "textRu": "what is the next step master"
      },
      {
        "role": "npc",
        "textEn": "(smiles, showing you the process) After cleaning, we need to gut the fish. Make a small cut along the belly and remove the insides carefully. Then rinse it thoroughly.",
        "textRu": "(smiles, showing you the process) After cleaning, we need to gut the fish. Make a small cut along the belly and remove the insides carefully. Then rinse it thoroughly."
      },
      {
        "role": "npc",
        "textEn": "(small cut on the belly and removes inside carefully as instructed)",
        "textRu": "(small cut on the belly and removes inside carefully as instructed)"
      },
      {
        "role": "npc",
        "textEn": "(shakes his head slowly) Wanderer, what you say doesn't sound right. I truly don't understand.",
        "textRu": "(shakes his head slowly) Wanderer, what you say doesn't sound right. I truly don't understand."
      },
      {
        "role": "npc",
        "textEn": "Did I gut the fish properly?",
        "textRu": "Did I gut the fish properly?"
      },
      {
        "role": "npc",
        "textEn": "(nods, smiling encouragingly) Yes, you did well! Now, let's rinse the fish in this bucket of clean water. Once they' re clean, we can start seasoning them.",
        "textRu": "(nods, smiling encouragingly) Yes, you did well! Now, let's rinse the fish in this bucket of clean water. Once they' re clean, we can start seasoning them."
      },
      {
        "role": "player",
        "textEn": "finished on rinsing the fish!",
        "textRu": "finished on rinsing the fish!"
      },
      {
        "role": "npc",
        "textEn": "(nods approvingly) Great work! Now, let's season the fish with some salt and herbs. I have a special blend that really brings out their flavor.",
        "textRu": "(nods approvingly) Great work! Now, let's season the fish with some salt and herbs. I have a special blend that really brings out their flavor."
      },
      {
        "role": "player",
        "textEn": "finished seasoning the fish",
        "textRu": "finished seasoning the fish"
      },
      {
        "role": "npc",
        "textEn": "(smiles, clapping his hands) Perfect! Now all that's left is to cook them. Shall we grill them over the fire? It's the best way to enjoy the freshness of Qinghe fish.",
        "textRu": "(smiles, clapping his hands) Perfect! Now all that's left is to cook them. Shall we grill them over the fire? It's the best way to enjoy the freshness of Qinghe fish."
      },
      {
        "role": "player",
        "textEn": "finished grilling the fish!",
        "textRu": "finished grilling the fish!"
      },
      {
        "role": "npc",
        "textEn": "(smiles widely, placing the grilled fish on a plate) Excellent! The aroma is divine. Let's sit down and enjoy our hard work, Wanderer. I'm sure you'll find these fish as delicious as they look",
        "textRu": "(smiles widely, placing the grilled fish on a plate) Excellent! The aroma is divine. Let's sit down and enjoy our hard work, Wanderer. I'm sure you'll find these fish as delicious as they look"
      },
      {
        "role": "npc",
        "textEn": "This fish is the best fish I've ever had!",
        "textRu": "This fish is the best fish I've ever had!"
      },
      {
        "role": "npc",
        "textEn": "(eyes bright with pride) I'm glad you enjoy it, Wanderer! The waters of Qinghe truly produce some of the finest fish in the land.",
        "textRu": "(eyes bright with pride) I'm glad you enjoy it, Wanderer! The waters of Qinghe truly produce some of the finest fish in the land."
      },
      {
        "role": "npc",
        "textEn": "Yes I agree my friend!",
        "textRu": "Yes I agree my friend!"
      },
      {
        "role": "npc",
        "textEn": "(nods, smiling) I'm honored to hear that. Perhaps you could tell others about the delicious fish from Qinghe. It would bring joy to us fishermen.",
        "textRu": "(nods, smiling) I'm honored to hear that. Perhaps you could tell others about the delicious fish from Qinghe. It would bring joy to us fishermen."
      },
      {
        "role": "npc",
        "textEn": "Don't worry I will spread word about this in my travels and I will make sure they will come here to taste the fish from Qinghe",
        "textRu": "Don't worry I will spread word about this in my travels and I will make sure they will come here to taste the fish from Qinghe"
      },
      {
        "role": "npc",
        "textEn": "(smiling with satisfaction, eyes bright) Wanderer, you've given me much to think about. I believe the name of Qinghe fish will surely reach far and wide one day.Wang Duoli expresses gratitude and begins to ponder deeply.",
        "textRu": "(smiling with satisfaction, eyes bright) Wanderer, you've given me much to think about. I believe the name of Qinghe fish will surely reach far and wide one day.Wang Duoli expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wang-duolu",
    "nameEn": "Wang Duolu",
    "nameRu": "Ван Дуолу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "By the lake fishing across the Храм генералов Boundary Stone",
    "icon": "👤",
    "befriendGuide": "Encourage Wang Duolu to Never Give Up Fishing\nWang Duolu is considering to give up fishing after not being able to catch anything on the river. Convince Wang Duolu to not give up fishing by telling him to be patient and that the river will reward patient people.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sitting by the river, rod resting in his hands, voice tinged with humor) Another day, another boot. I've carned the nickname Gill Bates because I've spent my life dreaming up bold new ways to fish, hoping to change the world one clever idea at a time... yet the river seems determined to humble me",
        "textRu": "(sitting by the river, rod resting in his hands, voice tinged with humor) Another day, another boot. I've carned the nickname Gill Bates because I've spent my life dreaming up bold new ways to fish, hoping to change the world one clever idea at a time... yet the river seems determined to humble me"
      },
      {
        "role": "npc",
        "textEn": "Don't give up on your dream of fishing.",
        "textRu": "Don't give up on your dream of fishing."
      },
      {
        "role": "npc",
        "textEn": "(sighing deeply, looking at the river) It's a noble pursuit, but the river doesnt seem to agree. Every contraption, every design... nothing works. Even strange catches have their charm, but a fisherman without fish is just a fool with a rod",
        "textRu": "(sighing deeply, looking at the river) It's a noble pursuit, but the river doesnt seem to agree. Every contraption, every design... nothing works. Even strange catches have their charm, but a fisherman without fish is just a fool with a rod"
      },
      {
        "role": "npc",
        "textEn": "Nothing will ever happen if you give up. The water rewards people who are patient",
        "textRu": "Nothing will ever happen if you give up. The water rewards people who are patient"
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, eyes reflecting the calm river) True, Young Master. Patience is a virtue, but what good is it when the river refuses to play along? Still, your words warm my heart. Let me try once more, just for you.",
        "textRu": "(nodding slowly, eyes reflecting the calm river) True, Young Master. Patience is a virtue, but what good is it when the river refuses to play along? Still, your words warm my heart. Let me try once more, just for you."
      },
      {
        "role": "npc",
        "textEn": "That's the spirit. As long as you keep at it, the river will eventually play along",
        "textRu": "That's the spirit. As long as you keep at it, the river will eventually play along"
      },
      {
        "role": "npc",
        "textEn": "(smiling faintly, adjusting the rod) Perhaps you're right. The river might just be testing my resolve. One more cast, and we'll see if fortune smiles upon us today.",
        "textRu": "(smiling faintly, adjusting the rod) Perhaps you're right. The river might just be testing my resolve. One more cast, and we'll see if fortune smiles upon us today."
      },
      {
        "role": "npc",
        "textEn": "Very good. I wish you the very best catch",
        "textRu": "Very good. I wish you the very best catch"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening with renewed spirit) You've reignited my vision, Young Master! I'll keep casting ... today might be the day the river accepts my genius.Wang Duolu thanks you and decides to try your suggestion.",
        "textRu": "(eyes brightening with renewed spirit) You've reignited my vision, Young Master! I'll keep casting ... today might be the day the river accepts my genius.Wang Duolu thanks you and decides to try your suggestion."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wen-gao",
    "nameEn": "Wen Gao",
    "nameRu": "Вэнь Гао",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him in between a tree and a wagon.",
    "icon": "👤",
    "befriendGuide": "Threaten Him to Give Back the Treasure\nStrangely enough, the AI for Wen Gao can be befriended by threatening him about returning the stolen treasure by giving him looks of intimidation and roleplaying that he returned the goods at the end.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(grinning, chest puffed out, practically glowing) Treasure? Found it. Riches? Imminent. Admiration? Expected. And you ... what's that look? Envy?",
        "textRu": "(grinning, chest puffed out, practically glowing) Treasure? Found it. Riches? Imminent. Admiration? Expected. And you ... what's that look? Envy?"
      },
      {
        "role": "npc",
        "textEn": "Why do you seem nervous, traveler?",
        "textRu": "Why do you seem nervous, traveler?"
      },
      {
        "role": "npc",
        "textEn": "(smirking, crossing arms confidently) Nervous? Me? Ha! I'm just waiting for the right words of praise. You haven't earned the privilege yet. What's your angle, wanderer?",
        "textRu": "(smirking, crossing arms confidently) Nervous? Me? Ha! I'm just waiting for the right words of praise. You haven't earned the privilege yet. What's your angle, wanderer?"
      },
      {
        "role": "player",
        "textEn": "(you look at his wagon)",
        "textRu": "(you look at his wagon)"
      },
      {
        "role": "npc",
        "textEn": "(following your gaze, smirking) Ah, the treasure wagon! Impressive, isn't it? But remember, treasures like these belong to those who command respect. So, how about showing some admiration?",
        "textRu": "(following your gaze, smirking) Ah, the treasure wagon! Impressive, isn't it? But remember, treasures like these belong to those who command respect. So, how about showing some admiration?"
      },
      {
        "role": "player",
        "textEn": "(you swiftly put your blade near his neck.) This isn't yours is it?",
        "textRu": "(you swiftly put your blade near his neck.) This isn't yours is it?"
      },
      {
        "role": "npc",
        "textEn": "(jumping back, eyes wide, hand on hilt) Whoa! You're quick! But threatening me won't get you anywhere. Respect and admiration-that's the key. Try again without the blade.",
        "textRu": "(jumping back, eyes wide, hand on hilt) Whoa! You're quick! But threatening me won't get you anywhere. Respect and admiration-that's the key. Try again without the blade."
      },
      {
        "role": "player",
        "textEn": "(you look at him with an intimidation look, just enough for him to give up and return the stolen goods.)",
        "textRu": "(you look at him with an intimidation look, just enough for him to give up and return the stolen goods.)"
      },
      {
        "role": "npc",
        "textEn": "(fists clenched, voice sharp) Disrespect? Bold move. Let's see how well you dodge disappointment!Wen Gao looks reluctant .. after all, he insists those chests were his find.",
        "textRu": "(fists clenched, voice sharp) Disrespect? Bold move. Let's see how well you dodge disappointment!Wen Gao looks reluctant .. after all, he insists those chests were his find."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wen-yuan",
    "nameEn": "Wen Yuan",
    "nameRu": "Вэнь Юань",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Перевал Скакуна",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Wen Yuan находится along the path towards the pagoda восточнее the Heavensreach Slope boundary stone.",
    "icon": "👤",
    "befriendGuide": "Help Wen Yuan Ask Wu Jing to Retrieve the Book\nWen Yuan's book fell to the bottom of the cliff while his childhood friend, Wu Jing, stands idly by. Encourage Wen Yuan to directly ask his friend for help with getting the book back to successfully befriend both of their AIs.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(clearing his throat, adopting a solemn tone) The old texts teach that a cultivated spirit should be gentle as polished jade. Were the world guided only by force and clamor, with no regard for the study of hearts or the savoring of meaning, how could such grace endure through the ages?",
        "textRu": "(clearing his throat, adopting a solemn tone) The old texts teach that a cultivated spirit should be gentle as polished jade. Were the world guided only by force and clamor, with no regard for the study of hearts or the savoring of meaning, how could such grace endure through the ages?"
      },
      {
        "role": "npc",
        "textEn": "Maybe a friend could help you retrieve the book. It would mean a lot to you and the honor of the book's wisdom.",
        "textRu": "Maybe a friend could help you retrieve the book. It would mean a lot to you and the honor of the book's wisdom."
      },
      {
        "role": "npc",
        "textEn": "(murmuring quietly) I merely mentioned it in passing, yet Wu Jing took scholarly and martial arts pursuits so much to heart. Still... so long as he cares, that is enough. I consulted the almanac, pored oever the Book of Changes, and even asked others to examin his destiny—every sign points to peach blossoms entangling his fate this year. I warned him of peach blossoms, yet he asked me who this \"Peach Blossom\" might be, and even vowed to deal with them directly.",
        "textRu": "(murmuring quietly) I merely mentioned it in passing, yet Wu Jing took scholarly and martial arts pursuits so much to heart. Still... so long as he cares, that is enough. I consulted the almanac, pored oever the Book of Changes, and even asked others to examin his destiny—every sign points to peach blossoms entangling his fate this year. I warned him of peach blossoms, yet he asked me who this \"Peach Blossom\" might be, and even vowed to deal with them directly."
      },
      {
        "role": "npc",
        "textEn": "A true friend would understand why you would want to save this book, especially since he is a scholar himself.",
        "textRu": "A true friend would understand why you would want to save this book, especially since he is a scholar himself."
      },
      {
        "role": "npc",
        "textEn": "(shaking his head, leaning in with a quiet chuckle) Not knowing letters is not entirely a fault. The other day, someone slipped a letter into his arms and fled—he read it twice, then asked me what \"when the moon rises, longing follows\" meant. I told him people often grow thoughtful at night, and he found that answer sufficient.",
        "textRu": "(shaking his head, leaning in with a quiet chuckle) Not knowing letters is not entirely a fault. The other day, someone slipped a letter into his arms and fled—he read it twice, then asked me what \"when the moon rises, longing follows\" meant. I told him people often grow thoughtful at night, and he found that answer sufficient."
      },
      {
        "role": "npc",
        "textEn": "He seems to be a genuine friend. Maybe asking him straight to help with retrieving the book would help.",
        "textRu": "He seems to be a genuine friend. Maybe asking him straight to help with retrieving the book would help."
      },
      {
        "role": "npc",
        "textEn": "(gazing at the book beneath the cliff, lost in thought) I have waited here for two full hours—yet he still does not move. Could it be he waits for me to ask? Perhaps I should invent a tale of what lies within this book, stir his curiosity a little, and let him go down of his own will... Wanderer, what do you think this book should contain?",
        "textRu": "(gazing at the book beneath the cliff, lost in thought) I have waited here for two full hours—yet he still does not move. Could it be he waits for me to ask? Perhaps I should invent a tale of what lies within this book, stir his curiosity a little, and let him go down of his own will... Wanderer, what do you think this book should contain?"
      },
      {
        "role": "npc",
        "textEn": "Tell him that the book contains interesting knowledge about peach blossoms, that might do it.",
        "textRu": "Tell him that the book contains interesting knowledge about peach blossoms, that might do it."
      },
      {
        "role": "npc",
        "textEn": "(sighing, eyes cast downward) Wu Jing, though strong in body, has a heart that is easily swayed by simple tales. If I were to speak of peach blossoms, he might indeed be intrigued. Yet, I fear such a fabrication would only lead to more misunderstandings. (pausing, then looking up) Nonetheless, it is a thought worth considering. Thank you for your suggestion, Wanderer.",
        "textRu": "(sighing, eyes cast downward) Wu Jing, though strong in body, has a heart that is easily swayed by simple tales. If I were to speak of peach blossoms, he might indeed be intrigued. Yet, I fear such a fabrication would only lead to more misunderstandings. (pausing, then looking up) Nonetheless, it is a thought worth considering. Thank you for your suggestion, Wanderer."
      },
      {
        "role": "npc",
        "textEn": "So long as you speak with honesty and sincerity, he will understand either way.",
        "textRu": "So long as you speak with honesty and sincerity, he will understand either way."
      },
      {
        "role": "npc",
        "textEn": "(smiling faintly) Indeed, the classics teach that honesty is the foundation of all virtue. Yet, the path to understanding between friends is often paved with subtle gestures and gentle guidance. (pausing, then nodding) I will contemplate your words and consider how best to proceed. You have given me much to think about.",
        "textRu": "(smiling faintly) Indeed, the classics teach that honesty is the foundation of all virtue. Yet, the path to understanding between friends is often paved with subtle gestures and gentle guidance. (pausing, then nodding) I will contemplate your words and consider how best to proceed. You have given me much to think about."
      },
      {
        "role": "npc",
        "textEn": "Trust your friendship and communicate your thoughts and feelings as genuinely as you can. Wu Jing will certainly help.",
        "textRu": "Trust your friendship and communicate your thoughts and feelings as genuinely as you can. Wu Jing will certainly help."
      },
      {
        "role": "npc",
        "textEn": "(nodding, a hint of resolve in his eyes) Your words are wise, Wanderer. I shall seek to convey my thoughts with both honesty and taact. Perhaps then, he will take the initiative to assist. (pausing, then smiling) Thank you for your counsel.",
        "textRu": "(nodding, a hint of resolve in his eyes) Your words are wise, Wanderer. I shall seek to convey my thoughts with both honesty and taact. Perhaps then, he will take the initiative to assist. (pausing, then smiling) Thank you for your counsel."
      },
      {
        "role": "npc",
        "textEn": "(tell him that Wu Jing will afree to help him if he values their friendship as much as Wu Jing does)",
        "textRu": "(tell him that Wu Jing will afree to help him if he values their friendship as much as Wu Jing does)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening as understanding dawns, a faint smile forming) Your words have set my thoughts in order, Wanderer. I believe I now know what must be done. Wen Yuan has a new idea. He glances back at Wu Jing and thanks you. (Wen Yuan Affection +100, becomes Revered. Wu Jing Affection +100, becomes Revered)",
        "textRu": "(eyes brightening as understanding dawns, a faint smile forming) Your words have set my thoughts in order, Wanderer. I believe I now know what must be done. Wen Yuan has a new idea. He glances back at Wu Jing and thanks you. (Wen Yuan Affection +100, becomes Revered. Wu Jing Affection +100, becomes Revered)"
      },
      {
        "role": "system",
        "textEn": "Affection +100, becomes Revered",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wenwu",
    "nameEn": "Wenwu",
    "nameRu": "Вэнь У",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him standing near a lonely tree.",
    "icon": "👤",
    "befriendGuide": "Listen to Wenwu's Insights and Train Under Him\nBefriending Wenwu can be tricky as his AI can talk for a long while. Keep listening and interested on what Wenwu has to say, and then roleplay training under him for many months or years. This may take a while, so just keep talking to him until the AI gets convinced to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(clears his throat, straightens his robe) Allow me to speak briefly. If you truly aspire to become a master, cast aside all distractions; the essence lies in comprehension above all else ...",
        "textRu": "(clears his throat, straightens his robe) Allow me to speak briefly. If you truly aspire to become a master, cast aside all distractions; the essence lies in comprehension above all else ..."
      },
      {
        "role": "npc",
        "textEn": "(bowing) please teach me your ways master",
        "textRu": "(bowing) please teach me your ways master"
      },
      {
        "role": "npc",
        "textEn": "(nods gravely, eyes narrowing slightly) Your dedication is commendable, wanderer. As the ancient manuals proclaim, true mastery requires the dual cultivation of internal and external. This means training both inner energy and outward technique in harmony: only then can one achieve true strength. We'll go into the finer points when time permits. Follow my guidance closely, and you shall see progress.",
        "textRu": "(nods gravely, eyes narrowing slightly) Your dedication is commendable, wanderer. As the ancient manuals proclaim, true mastery requires the dual cultivation of internal and external. This means training both inner energy and outward technique in harmony: only then can one achieve true strength. We'll go into the finer points when time permits. Follow my guidance closely, and you shall see progress."
      },
      {
        "role": "player",
        "textEn": "(you trained with wenwu for 2 months)",
        "textRu": "(you trained with wenwu for 2 months)"
      },
      {
        "role": "npc",
        "textEn": "(smiles condescendingly, stroking his beard) Two months of diligent study, indeed. You have shown some promise, wanderer. However, one must always keep the long view in mind. Martial cultivation demands gradual progress; rushing leads only to error and deviation. Continue to focus and persevere, and you may yet reach greater heights. Do not trouble yourself with haste; patience is key.",
        "textRu": "(smiles condescendingly, stroking his beard) Two months of diligent study, indeed. You have shown some promise, wanderer. However, one must always keep the long view in mind. Martial cultivation demands gradual progress; rushing leads only to error and deviation. Continue to focus and persevere, and you may yet reach greater heights. Do not trouble yourself with haste; patience is key."
      },
      {
        "role": "npc",
        "textEn": "Yes master! (You trained with Wenwu for 4 years.)",
        "textRu": "Yes master! (You trained with Wenwu for 4 years.)"
      },
      {
        "role": "npc",
        "textEn": "(looks pleased, nodding slowly) Four years of dedicated effort, wanderer. Your commitment is admirable. Yet, remember, the essence of martial arts lies in the mind-method (xinfa). Techniques are merely expressions of this inner principle. True mastery comes from cultivating the mind and nurturing character. In theory, it is entirely sound; proceed as you wish. May your journey be guided by wisdom and perseverance.",
        "textRu": "(looks pleased, nodding slowly) Four years of dedicated effort, wanderer. Your commitment is admirable. Yet, remember, the essence of martial arts lies in the mind-method (xinfa). Techniques are merely expressions of this inner principle. True mastery comes from cultivating the mind and nurturing character. In theory, it is entirely sound; proceed as you wish. May your journey be guided by wisdom and perseverance."
      },
      {
        "role": "npc",
        "textEn": "(Bowed to Wenwu) Thank you master",
        "textRu": "(Bowed to Wenwu) Thank you master"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly in return, expression serene) You are welcome, wanderer. Do not forget that every true practitioner has endured this path; why should you be any different? Embrace the challenges and let them shape your character. Continue to refine both heart and skill, and the way will unfold before you. Stay focused, and do not waver in your resolve.",
        "textRu": "(bows slightly in return, expression serene) You are welcome, wanderer. Do not forget that every true practitioner has endured this path; why should you be any different? Embrace the challenges and let them shape your character. Continue to refine both heart and skill, and the way will unfold before you. Stay focused, and do not waver in your resolve."
      },
      {
        "role": "player",
        "textEn": "(You refined your heart and skill with Wenwu for 2 years.)",
        "textRu": "(You refined your heart and skill with Wenwu for 2 years.)"
      },
      {
        "role": "npc",
        "textEn": "(nods approvingly, gaze steady) Two more years of refinement, wanderer. Your dedication is commendable. Remember, the balance of yin and yang is crucial in martial cultivation. Harmony between these forces forms the core foundation of all power. Continue to align yourself with the laws of heaven and earth, and you will find your path becoming clearer. One must always keep the long view in mind; the journey is as important as the destination.",
        "textRu": "(nods approvingly, gaze steady) Two more years of refinement, wanderer. Your dedication is commendable. Remember, the balance of yin and yang is crucial in martial cultivation. Harmony between these forces forms the core foundation of all power. Continue to align yourself with the laws of heaven and earth, and you will find your path becoming clearer. One must always keep the long view in mind; the journey is as important as the destination."
      },
      {
        "role": "player",
        "textEn": "(You were able to achieve everything that Wenwu wanted from you and reached a new enlightenment)",
        "textRu": "(You were able to achieve everything that Wenwu wanted from you and reached a new enlightenment)"
      },
      {
        "role": "npc",
        "textEn": "(sighs, looking distant) Your comprehension still falls short. When time permits, study more of the martial arts classics. That will be all for today-some even call me Marshall Artz, for my boundless wisdom in the way of cultivation. Now, I must resume my treasure hunt.Satisfied, Wen Wu heads off to take care of other matters.",
        "textRu": "(sighs, looking distant) Your comprehension still falls short. When time permits, study more of the martial arts classics. That will be all for today-some even call me Marshall Artz, for my boundless wisdom in the way of cultivation. Now, I must resume my treasure hunt.Satisfied, Wen Wu heads off to take care of other matters."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wobbly-tang",
    "nameEn": "Wobbly Tang",
    "nameRu": "Шатающийся Тан",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Склон Боевого гребня",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "On the side of the road южнее the Tiger Fort in Склон Боевого гребня",
    "icon": "👤",
    "befriendGuide": "Offer Food and Work in General Shrine\nThe easiest way to befriend Wobbly Tang is to tell him there is food and work waiting in the General Shrine. If he asks where to find the shrine, tell him you will guide him so you can befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(weeping in sorrow, hands clutching a cracked bowl) Ah .. Wanderer, Old Tang has been roaming with this poor grandson for so many days now ...",
        "textRu": "(weeping in sorrow, hands clutching a cracked bowl) Ah .. Wanderer, Old Tang has been roaming with this poor grandson for so many days now ..."
      },
      {
        "role": "npc",
        "textEn": "There is a work and food in the General's Shrine waiting for you",
        "textRu": "There is a work and food in the General's Shrine waiting for you"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening slightly, voice trembling) Work and food? In the General's Shrine? How can we gct there, Wanderer? My little grandson and I have nothing left. We're just trying to survive each day",
        "textRu": "(eyes widening slightly, voice trembling) Work and food? In the General's Shrine? How can we gct there, Wanderer? My little grandson and I have nothing left. We're just trying to survive each day"
      },
      {
        "role": "player",
        "textEn": "I will guide you there. Please don't worry anymore.",
        "textRu": "I will guide you there. Please don't worry anymore."
      },
      {
        "role": "npc",
        "textEn": "(eyes glistening with renewed hope) Thank you, Wanderer. With your help, my little grandson and I will surely overcome this hardship!Wobbly Tang expresses gratitude and begins to ponder deeply.",
        "textRu": "(eyes glistening with renewed hope) Thank you, Wanderer. With your help, my little grandson and I will surely overcome this hardship!Wobbly Tang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wu-cezhi",
    "nameEn": "Wu Cezhi",
    "nameRu": "У Цэчжи",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Деревня Урожайной осени",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him in the left-side toilet",
    "icon": "👤",
    "befriendGuide": "Give Wu Cezhi Toilet Papers\nGive Wu Cezhi some toilet papers to help him with his toilet problems so you can befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(voice trembling, calling softly from inside) Is ... is anyone out there? Help me, please! Wanderer, save me ... I stand at the edge of endurance, where necessity becomes philosophy. I ... I kant! I kant do this anymore! Bring me something-anything-before my thoughts are all that remain!",
        "textRu": "(voice trembling, calling softly from inside) Is ... is anyone out there? Help me, please! Wanderer, save me ... I stand at the edge of endurance, where necessity becomes philosophy. I ... I kant! I kant do this anymore! Bring me something-anything-before my thoughts are all that remain!"
      },
      {
        "role": "player",
        "textEn": "here take some toilet papers",
        "textRu": "here take some toilet papers"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up with desperate hope) Oh, Wanderer! The moment I heard you, I knew you were my savior! Thank you, thank you! You've lifted me from the depths of despair! (reaches out eagerly) May I have it now?Two things awe me most, the empty roll beside me and the numb legs beneath me.",
        "textRu": "(eyes lighting up with desperate hope) Oh, Wanderer! The moment I heard you, I knew you were my savior! Thank you, thank you! You've lifted me from the depths of despair! (reaches out eagerly) May I have it now?Two things awe me most, the empty roll beside me and the numb legs beneath me."
      },
      {
        "role": "player",
        "textEn": "ofcourse take it",
        "textRu": "ofcourse take it"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up, voice full of relief) Oh, thank goodness! Wanderer, you're my savior, the pure form of practical reason! Qinghe's number one good person, without a doubt!The person inside thanks you, clearly embarrassed.",
        "textRu": "(eyes lighting up, voice full of relief) Oh, thank goodness! Wanderer, you're my savior, the pure form of practical reason! Qinghe's number one good person, without a doubt!The person inside thanks you, clearly embarrassed."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wu-dayong",
    "nameEn": "Wu Dayong",
    "nameRu": "У Дайон",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him standing near a bandit camp.",
    "icon": "👤",
    "befriendGuide": "Give Tips on How to Rob Properly\nTo befriend Wu Dayong, give him tips on how to rob properly like making an intimidating stare on victims so they give their belongings and causing distraction will lower their guard for a short time.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(reaching his hand toward you, trying to sound fierce but clearly nervous) G -g ... Give me s-s-six ... six h-hundred and s-sixty-six t-taels of s-s...silver! I-is ... is this r-right?",
        "textRu": "(reaching his hand toward you, trying to sound fierce but clearly nervous) G -g ... Give me s-s-six ... six h-hundred and s-sixty-six t-taels of s-s...silver! I-is ... is this r-right?"
      },
      {
        "role": "npc",
        "textEn": "Are you demanding or asking?",
        "textRu": "Are you demanding or asking?"
      },
      {
        "role": "npc",
        "textEn": "(looking confused, stammering) D-demanding? A-asking? I-I ... I'm t-trying to d-demand! B-but ... i-is this h-how you d-do it, W-Wanderer?",
        "textRu": "(looking confused, stammering) D-demanding? A-asking? I-I ... I'm t-trying to d-demand! B-but ... i-is this h-how you d-do it, W-Wanderer?"
      },
      {
        "role": "player",
        "textEn": "(You looked at him with a stare that with put fear upon your foes.)",
        "textRu": "(You looked at him with a stare that with put fear upon your foes.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes wide, stepping back, voice trembling) Y-you ... you're I-looking at me w-with a s-stare that p-puts f-fear upon y-your f-foes! I-I'm j-just t-trying to I-learn h-how to d-demand! P-p-please don't b-be mad, W-Wanderer!",
        "textRu": "(eyes wide, stepping back, voice trembling) Y-you ... you're I-looking at me w-with a s-stare that p-puts f-fear upon y-your f-foes! I-I'm j-just t-trying to I-learn h-how to d-demand! P-p-please don't b-be mad, W-Wanderer!"
      },
      {
        "role": "player",
        "textEn": "(You explained that showing intimidation can cause potential targets to give up their belongings.)",
        "textRu": "(You explained that showing intimidation can cause potential targets to give up their belongings.)"
      },
      {
        "role": "npc",
        "textEn": "(nodding, trying to understand) S -showing i-intimidation c-can c-cause p -potential t-targets to g-give up t-their b-belongings ... I-I see ... S-so I n-need to I-look m-more f-frightening! B-but h-how d-do I d-do that, W-Wanderer?",
        "textRu": "(nodding, trying to understand) S -showing i-intimidation c-can c-cause p -potential t-targets to g-give up t-their b-belongings ... I-I see ... S-so I n-need to I-look m-more f-frightening! B-but h-how d-do I d-do that, W-Wanderer?"
      },
      {
        "role": "npc",
        "textEn": "Let me help you. (You trained with Wu Dayong for a month to give him some confidence with himself.)",
        "textRu": "Let me help you. (You trained with Wu Dayong for a month to give him some confidence with himself.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening, hopeful) R-really? Y-you'd t-train me? T-that w-would b-be g-great! B-but ... I-I'm s-so c-clumsy a-and s-simple ... C-can I e-ever I-learn t-to r-rob p-properly, W-Wanderer?",
        "textRu": "(eyes brightening, hopeful) R-really? Y-you'd t-train me? T-that w-would b-be g-great! B-but ... I-I'm s-so c-clumsy a-and s-simple ... C-can I e-ever I-learn t-to r-rob p-properly, W-Wanderer?"
      },
      {
        "role": "npc",
        "textEn": "That is the next lesson. Come let me show you! (You demonstrated to Wu Dayong how to properly rob someone without them knowing.)",
        "textRu": "That is the next lesson. Come let me show you! (You demonstrated to Wu Dayong how to properly rob someone without them knowing.)"
      },
      {
        "role": "npc",
        "textEn": "(nervously approaching, still stammering) O-okay ... L-let me try t-to I-learn f-from y-you, W-Wanderer! H -how d-do I d-do it w-without t-them k -knowing? S-show me p-please!",
        "textRu": "(nervously approaching, still stammering) O-okay ... L-let me try t-to I-learn f-from y-you, W-Wanderer! H -how d-do I d-do it w-without t-them k -knowing? S-show me p-please!"
      },
      {
        "role": "player",
        "textEn": "(You explained that causing a distraction would cause them to lower their guard for a short time.)",
        "textRu": "(You explained that causing a distraction would cause them to lower their guard for a short time.)"
      },
      {
        "role": "npc",
        "textEn": "(wringing his hands, voice trembling, on the verge of tears) Sob ... sob ... I j-just ... just w-w-wanted to be a h-hero ..Wu Dayong gives you a nervous, stuttering smile.",
        "textRu": "(wringing his hands, voice trembling, on the verge of tears) Sob ... sob ... I j-just ... just w-w-wanted to be a h-hero ..Wu Dayong gives you a nervous, stuttering smile."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wu-jing",
    "nameEn": "Wu Jing",
    "nameRu": "У Цзин",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Перевал Скакуна",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Wu Jing находится along the path towards the pagoda восточнее the Heavensreach Slope boundary stone.",
    "icon": "👤",
    "befriendGuide": "Help Wen Yuan Ask Wu Jing to Retrieve the Book\nWen Yuan's book fell to the bottom of the cliff while his childhood friend, Wu Jing, stands idly by. Encourage Wen Yuan to directly ask his friend for help with getting the book back to successfully befriend both of their AIs.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(clearing his throat, adopting a solemn tone) The old texts teach that a cultivated spirit should be gentle as polished jade. Were the world guided only by force and clamor, with no regard for the study of hearts or the savoring of meaning, how could such grace endure through the ages?",
        "textRu": "(clearing his throat, adopting a solemn tone) The old texts teach that a cultivated spirit should be gentle as polished jade. Were the world guided only by force and clamor, with no regard for the study of hearts or the savoring of meaning, how could such grace endure through the ages?"
      },
      {
        "role": "npc",
        "textEn": "Maybe a friend could help you retrieve the book. It would mean a lot to you and the honor of the book's wisdom.",
        "textRu": "Maybe a friend could help you retrieve the book. It would mean a lot to you and the honor of the book's wisdom."
      },
      {
        "role": "npc",
        "textEn": "(murmuring quietly) I merely mentioned it in passing, yet Wu Jing took scholarly and martial arts pursuits so much to heart. Still... so long as he cares, that is enough. I consulted the almanac, pored oever the Book of Changes, and even asked others to examin his destiny—every sign points to peach blossoms entangling his fate this year. I warned him of peach blossoms, yet he asked me who this \"Peach Blossom\" might be, and even vowed to deal with them directly.",
        "textRu": "(murmuring quietly) I merely mentioned it in passing, yet Wu Jing took scholarly and martial arts pursuits so much to heart. Still... so long as he cares, that is enough. I consulted the almanac, pored oever the Book of Changes, and even asked others to examin his destiny—every sign points to peach blossoms entangling his fate this year. I warned him of peach blossoms, yet he asked me who this \"Peach Blossom\" might be, and even vowed to deal with them directly."
      },
      {
        "role": "npc",
        "textEn": "A true friend would understand why you would want to save this book, especially since he is a scholar himself.",
        "textRu": "A true friend would understand why you would want to save this book, especially since he is a scholar himself."
      },
      {
        "role": "npc",
        "textEn": "(shaking his head, leaning in with a quiet chuckle) Not knowing letters is not entirely a fault. The other day, someone slipped a letter into his arms and fled—he read it twice, then asked me what \"when the moon rises, longing follows\" meant. I told him people often grow thoughtful at night, and he found that answer sufficient.",
        "textRu": "(shaking his head, leaning in with a quiet chuckle) Not knowing letters is not entirely a fault. The other day, someone slipped a letter into his arms and fled—he read it twice, then asked me what \"when the moon rises, longing follows\" meant. I told him people often grow thoughtful at night, and he found that answer sufficient."
      },
      {
        "role": "npc",
        "textEn": "He seems to be a genuine friend. Maybe asking him straight to help with retrieving the book would help.",
        "textRu": "He seems to be a genuine friend. Maybe asking him straight to help with retrieving the book would help."
      },
      {
        "role": "npc",
        "textEn": "(gazing at the book beneath the cliff, lost in thought) I have waited here for two full hours—yet he still does not move. Could it be he waits for me to ask? Perhaps I should invent a tale of what lies within this book, stir his curiosity a little, and let him go down of his own will... Wanderer, what do you think this book should contain?",
        "textRu": "(gazing at the book beneath the cliff, lost in thought) I have waited here for two full hours—yet he still does not move. Could it be he waits for me to ask? Perhaps I should invent a tale of what lies within this book, stir his curiosity a little, and let him go down of his own will... Wanderer, what do you think this book should contain?"
      },
      {
        "role": "npc",
        "textEn": "Tell him that the book contains interesting knowledge about peach blossoms, that might do it.",
        "textRu": "Tell him that the book contains interesting knowledge about peach blossoms, that might do it."
      },
      {
        "role": "npc",
        "textEn": "(sighing, eyes cast downward) Wu Jing, though strong in body, has a heart that is easily swayed by simple tales. If I were to speak of peach blossoms, he might indeed be intrigued. Yet, I fear such a fabrication would only lead to more misunderstandings. (pausing, then looking up) Nonetheless, it is a thought worth considering. Thank you for your suggestion, Wanderer.",
        "textRu": "(sighing, eyes cast downward) Wu Jing, though strong in body, has a heart that is easily swayed by simple tales. If I were to speak of peach blossoms, he might indeed be intrigued. Yet, I fear such a fabrication would only lead to more misunderstandings. (pausing, then looking up) Nonetheless, it is a thought worth considering. Thank you for your suggestion, Wanderer."
      },
      {
        "role": "npc",
        "textEn": "So long as you speak with honesty and sincerity, he will understand either way.",
        "textRu": "So long as you speak with honesty and sincerity, he will understand either way."
      },
      {
        "role": "npc",
        "textEn": "(smiling faintly) Indeed, the classics teach that honesty is the foundation of all virtue. Yet, the path to understanding between friends is often paved with subtle gestures and gentle guidance. (pausing, then nodding) I will contemplate your words and consider how best to proceed. You have given me much to think about.",
        "textRu": "(smiling faintly) Indeed, the classics teach that honesty is the foundation of all virtue. Yet, the path to understanding between friends is often paved with subtle gestures and gentle guidance. (pausing, then nodding) I will contemplate your words and consider how best to proceed. You have given me much to think about."
      },
      {
        "role": "npc",
        "textEn": "Trust your friendship and communicate your thoughts and feelings as genuinely as you can. Wu Jing will certainly help.",
        "textRu": "Trust your friendship and communicate your thoughts and feelings as genuinely as you can. Wu Jing will certainly help."
      },
      {
        "role": "npc",
        "textEn": "(nodding, a hint of resolve in his eyes) Your words are wise, Wanderer. I shall seek to convey my thoughts with both honesty and taact. Perhaps then, he will take the initiative to assist. (pausing, then smiling) Thank you for your counsel.",
        "textRu": "(nodding, a hint of resolve in his eyes) Your words are wise, Wanderer. I shall seek to convey my thoughts with both honesty and taact. Perhaps then, he will take the initiative to assist. (pausing, then smiling) Thank you for your counsel."
      },
      {
        "role": "npc",
        "textEn": "(tell him that Wu Jing will afree to help him if he values their friendship as much as Wu Jing does)",
        "textRu": "(tell him that Wu Jing will afree to help him if he values their friendship as much as Wu Jing does)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening as understanding dawns, a faint smile forming) Your words have set my thoughts in order, Wanderer. I believe I now know what must be done. Wen Yuan has a new idea. He glances back at Wu Jing and thanks you. (Wen Yuan Affection +100, becomes Revered. Wu Jing Affection +100, becomes Revered)",
        "textRu": "(eyes brightening as understanding dawns, a faint smile forming) Your words have set my thoughts in order, Wanderer. I believe I now know what must be done. Wen Yuan has a new idea. He glances back at Wu Jing and thanks you. (Wen Yuan Affection +100, becomes Revered. Wu Jing Affection +100, becomes Revered)"
      },
      {
        "role": "system",
        "textEn": "Affection +100, becomes Revered",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wu-jingming",
    "nameEn": "Wu Jingming",
    "nameRu": "У Цзинмин",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Пик Ореола",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen standing along the path going to Пик Ореола",
    "icon": "👤",
    "befriendGuide": "Cheer Up Wu Jingming by Giving His Money Back\nWu Jingming is distraught that he lost his money due to a gambling scam run by the Nine Mortal Ways. Tell him that you have defeated the Nine Mortal Ways and that you got the money back. This will trick the AI to becoming more friendly with you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(voice trembling, eyes red) I've lost every last coin ... It's all gone ... It's over ... They laughed and called me Jack Pott-said I was the prize they'd been waiting for. Guess they weren't wrong.",
        "textRu": "(voice trembling, eyes red) I've lost every last coin ... It's all gone ... It's over ... They laughed and called me Jack Pott-said I was the prize they'd been waiting for. Guess they weren't wrong."
      },
      {
        "role": "npc",
        "textEn": "You seem sad, friend?",
        "textRu": "You seem sad, friend?"
      },
      {
        "role": "npc",
        "textEn": "(wiping tears, voice low) Indeed, Wanderer. I've been swindled out of everything. Those scoundrels from the Nine Mortal Ways took me for a fool in a gambling game. Now I'm left with nothing but my rags and this heavy heart.",
        "textRu": "(wiping tears, voice low) Indeed, Wanderer. I've been swindled out of everything. Those scoundrels from the Nine Mortal Ways took me for a fool in a gambling game. Now I'm left with nothing but my rags and this heavy heart."
      },
      {
        "role": "player",
        "textEn": "wait I just saw them before I went here. Took them down for you ... Is this yours? (gives wallet full of coins)",
        "textRu": "wait I just saw them before I went here. Took them down for you ... Is this yours? (gives wallet full of coins)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, hands shaking) Truly, Wanderer? You've taken them down and returned my money? This is ... this is more than I could have hoped for! (takes the wallet, voice choked with gratitude) Thank you, thank you so much!",
        "textRu": "(eyes widening, hands shaking) Truly, Wanderer? You've taken them down and returned my money? This is ... this is more than I could have hoped for! (takes the wallet, voice choked with gratitude) Thank you, thank you so much!"
      },
      {
        "role": "player",
        "textEn": "(you said your farewells)",
        "textRu": "(you said your farewells)"
      },
      {
        "role": "npc",
        "textEn": "(tapping his forehead, forcing a shaky smile) Thank you for your guidance, Wanderer ... I'll learn from this mistake. I swear I'll wise up ... before anyone calls me Jack Pott again.Wu Jingming expresses gratitude and begins to ponder carefully.",
        "textRu": "(tapping his forehead, forcing a shaky smile) Thank you for your guidance, Wanderer ... I'll learn from this mistake. I swear I'll wise up ... before anyone calls me Jack Pott again.Wu Jingming expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "wu-qiwan",
    "nameEn": "Wu Qiwan",
    "nameRu": "У Цивань",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen behind some tall grasses, рядом с edge of the cliff.",
    "icon": "👤",
    "befriendGuide": "Tell Wu Qiwan the Way Into Qinghe Bamboo Grove\nWu Qiwan is an NPC that wants to find his way into the Qinghe Bamboo Grove and find a master that will train him with new skills. Tell him that you are a student of the master hidden within the bamboo grove and that you will bring him into the master.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(glancing around, scratching his head with frustration) This blasted forest is endless! I've been circling for hours and still can't find that legendary bamboo grove! Hah ... maybe that's why I started calling myself Barry Longway- because clearly, I've got a long way to go before I'm any kind of hero.",
        "textRu": "(glancing around, scratching his head with frustration) This blasted forest is endless! I've been circling for hours and still can't find that legendary bamboo grove! Hah ... maybe that's why I started calling myself Barry Longway- because clearly, I've got a long way to go before I'm any kind of hero."
      },
      {
        "role": "npc",
        "textEn": "(Wu Qiwan sees you beat 3 bandits with a swift strike.)",
        "textRu": "(Wu Qiwan sees you beat 3 bandits with a swift strike.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widening slightly, then narrowing with suspicion) Well, well, look at that. You took down those bandits like they were nothing. Impressive, I suppose. But what's a skilled fighter like you doing in these woods? Don't tell me you're also looking for the bamboo forest? (scratches his chin, pondering) If I build a house here, does that mean I'm no longer lost?",
        "textRu": "(eyes widening slightly, then narrowing with suspicion) Well, well, look at that. You took down those bandits like they were nothing. Impressive, I suppose. But what's a skilled fighter like you doing in these woods? Don't tell me you're also looking for the bamboo forest? (scratches his chin, pondering) If I build a house here, does that mean I'm no longer lost?"
      },
      {
        "role": "npc",
        "textEn": "Looking? I am already a student, I have been taught by the master here for more than 5 years already.",
        "textRu": "Looking? I am already a student, I have been taught by the master here for more than 5 years already."
      },
      {
        "role": "npc",
        "textEn": "(leaning closer, intrigued but still skeptical) A student, huh? And you claim to have trained here for five years? (narrows his eyes) That's hard to believe. How come I haven't heard of you before? (flicks a piece of dirt off his boot) Maybe I should start singing, either a master finds me or a tiger does.",
        "textRu": "(leaning closer, intrigued but still skeptical) A student, huh? And you claim to have trained here for five years? (narrows his eyes) That's hard to believe. How come I haven't heard of you before? (flicks a piece of dirt off his boot) Maybe I should start singing, either a master finds me or a tiger does."
      },
      {
        "role": "npc",
        "textEn": "How can you know me if the school of the master is hidden and it was always in secret.",
        "textRu": "How can you know me if the school of the master is hidden and it was always in secret."
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, running a hand through his disheveled hair) Fair point. If the master keeps things secret, it makes sense I wouldn't know. But how do I find this place if no one talks about it? (grumbles) They say not all who wander are lost ... well, I definitely am.",
        "textRu": "(sighs deeply, running a hand through his disheveled hair) Fair point. If the master keeps things secret, it makes sense I wouldn't know. But how do I find this place if no one talks about it? (grumbles) They say not all who wander are lost ... well, I definitely am."
      },
      {
        "role": "npc",
        "textEn": "You seem to have the potential, come with me.",
        "textRu": "You seem to have the potential, come with me."
      },
      {
        "role": "npc",
        "textEn": "(crosses arms, still wary) Potential or not, I'm not just gonna follow anyone blindly. What proof do you have that you really are a student here? (scowls) If I keep wandering like this, I'll qualify as Qinghe's first forest tour guide with no idea where I'm going.",
        "textRu": "(crosses arms, still wary) Potential or not, I'm not just gonna follow anyone blindly. What proof do you have that you really are a student here? (scowls) If I keep wandering like this, I'll qualify as Qinghe's first forest tour guide with no idea where I'm going."
      },
      {
        "role": "player",
        "textEn": "(You brought him the place where the master is waiting for him.)",
        "textRu": "(You brought him the place where the master is waiting for him.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen in surprise, then narrow again, still cautious) Wait, you actually brought me to the right place? (looks around skeptically) This could be a trick. (nods slowly) But ... if this is real, I owe you one. (grunts) I'm not lost ... I'm just aggressively exploring in the wrong direction.",
        "textRu": "(eyes widen in surprise, then narrow again, still cautious) Wait, you actually brought me to the right place? (looks around skeptically) This could be a trick. (nods slowly) But ... if this is real, I owe you one. (grunts) I'm not lost ... I'm just aggressively exploring in the wrong direction."
      },
      {
        "role": "npc",
        "textEn": "(after a month, he was already a gifted student.)",
        "textRu": "(after a month, he was already a gifted student.)"
      },
      {
        "role": "npc",
        "textEn": "(snorting, eyes lighting up with stubborn fire) Hmph! Maybe you're right, Wanderer ... maybe this path is the one. If it leads to that bamboo grove, I'Il find the master ... and if it doesn't, I'll just keep walking until the forest gives up before I do!Wu Qiwan expresses gratitude and begins to ponder carefully.",
        "textRu": "(snorting, eyes lighting up with stubborn fire) Hmph! Maybe you're right, Wanderer ... maybe this path is the one. If it leads to that bamboo grove, I'Il find the master ... and if it doesn't, I'll just keep walking until the forest gives up before I do!Wu Qiwan expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "xi-daozhi",
    "nameEn": "Xi Daozhi",
    "nameRu": "Си Даочжи",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Цзюцюань",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Xi Daozhi находится along the southeast path of the Skybrim Market.",
    "icon": "👤",
    "befriendGuide": "Tell Him to Paint the Real Lu Yi Instead of How He Wants Her To Be\nXi Daozhi went overboard with the amount of beauty he painted for his beloved, Lu Yi. Give him advice to paint her as she truly is instead of how he imagines her to be, and receive a portrait of yourself as thanks for helping his AI out.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(distracted and dejected) Lu Yi... Lu Yi... why won't you speak to me anymore? Could it be that I painted you too beautifully, made you doubt yourself? But to me, your beauty never needed comparison...",
        "textRu": "(distracted and dejected) Lu Yi... Lu Yi... why won't you speak to me anymore? Could it be that I painted you too beautifully, made you doubt yourself? But to me, your beauty never needed comparison..."
      },
      {
        "role": "player",
        "textEn": "Your portrait of her shows how you perceive her. Maybe try asking how she feels?",
        "textRu": "Your portrait of her shows how you perceive her. Maybe try asking how she feels?"
      },
      {
        "role": "npc",
        "textEn": "(pleading earnestly) Wanderer, you must judge this fairly—Lu Yi and I were getting along just fine. Then one day, I told her she was the most beautiful person in the world, and that I would pour every once of my skill into painting the finest portrait for her! But...",
        "textRu": "(pleading earnestly) Wanderer, you must judge this fairly—Lu Yi and I were getting along just fine. Then one day, I told her she was the most beautiful person in the world, and that I would pour every once of my skill into painting the finest portrait for her! But..."
      },
      {
        "role": "npc",
        "textEn": "Maybe she thinks that you like the idea of her and not who she truly is.",
        "textRu": "Maybe she thinks that you like the idea of her and not who she truly is."
      },
      {
        "role": "npc",
        "textEn": "(sniffling) Ever since I handed her that painting, she hasn't spoken to me for an entire month... It must be because I painted it to perfectly—so perfect it made her feel shy, even overwhelmed! Or perhaps she keeps it hidden away, admiring it in secret? I don't know why she avoids me, but it has to be because of that painting... Wanderer, help me think—was it my painting?",
        "textRu": "(sniffling) Ever since I handed her that painting, she hasn't spoken to me for an entire month... It must be because I painted it to perfectly—so perfect it made her feel shy, even overwhelmed! Or perhaps she keeps it hidden away, admiring it in secret? I don't know why she avoids me, but it has to be because of that painting... Wanderer, help me think—was it my painting?"
      },
      {
        "role": "npc",
        "textEn": "It might be better to paint her as she is and not as you dream her to be.",
        "textRu": "It might be better to paint her as she is and not as you dream her to be."
      },
      {
        "role": "npc",
        "textEn": "(suddenly enlightened) Ah! I see it now—I was too lost in my own thoughts. Look here, this stall only holds my master's work, not a single piece of mine. How could you possibly judge my flaws from that? Very well! I'll paint you on the spot! Just wait—once others lay eyes on this portrait, people from every corner will be lining up to praise it!",
        "textRu": "(suddenly enlightened) Ah! I see it now—I was too lost in my own thoughts. Look here, this stall only holds my master's work, not a single piece of mine. How could you possibly judge my flaws from that? Very well! I'll paint you on the spot! Just wait—once others lay eyes on this portrait, people from every corner will be lining up to praise it!"
      },
      {
        "role": "npc",
        "textEn": "(stay still to let him paint) remember, stick to the real thing and how you imagine it to be.",
        "textRu": "(stay still to let him paint) remember, stick to the real thing and how you imagine it to be."
      },
      {
        "role": "npc",
        "textEn": "(focused on the canvas, brush strokes precise and confident) Wanderer, that elegant nose alone would turn heads all across Liangzhou—paired with my flawless brushwork, this piece is bound to be a feast for the eyes! I will capture you exactly as you are, with every sharp feature and commanding presence. Just a few more strokes, and it will be perfect.",
        "textRu": "(focused on the canvas, brush strokes precise and confident) Wanderer, that elegant nose alone would turn heads all across Liangzhou—paired with my flawless brushwork, this piece is bound to be a feast for the eyes! I will capture you exactly as you are, with every sharp feature and commanding presence. Just a few more strokes, and it will be perfect."
      },
      {
        "role": "npc",
        "textEn": "That's how you should paint Lu Yi too.",
        "textRu": "That's how you should paint Lu Yi too."
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully) You make a good point, Wanderer. Perhaps I did get carried away with my own imagination, I will strive to pain Lu Yi just as she is, with all her unique qualities. (resumes painting, eyes shining with determination) With just a few more storkes, this portrat will truly come to life.",
        "textRu": "(nodding thoughtfully) You make a good point, Wanderer. Perhaps I did get carried away with my own imagination, I will strive to pain Lu Yi just as she is, with all her unique qualities. (resumes painting, eyes shining with determination) With just a few more storkes, this portrat will truly come to life."
      },
      {
        "role": "npc",
        "textEn": "You're welcome! Now go talk to her and she'll see the improvements.",
        "textRu": "You're welcome! Now go talk to her and she'll see the improvements."
      },
      {
        "role": "npc",
        "textEn": "(clicking tongue in admiration) Look at those brows, those lips—truly striking features! With just a few strokes from my hand, I preserve that extraordinary look forever. (pauses, brush in hand) But you're right, Wanderer. I need to talk to Lu Yi and show her the improvements. Thank you for your advice. Now, let me finish this masterpiece for you!",
        "textRu": "(clicking tongue in admiration) Look at those brows, those lips—truly striking features! With just a few strokes from my hand, I preserve that extraordinary look forever. (pauses, brush in hand) But you're right, Wanderer. I need to talk to Lu Yi and show her the improvements. Thank you for your advice. Now, let me finish this masterpiece for you!"
      },
      {
        "role": "npc",
        "textEn": "(waits for the painting to finish)",
        "textRu": "(waits for the painting to finish)"
      },
      {
        "role": "npc",
        "textEn": "(nodding repeatedly, delighted) Yes, yes—magnificent! Still, perfection demand refinement. I'll adjust it again and again, until you see this painting and regret not meeting me sooner to be captured by my brush! Xia Daozhi is furiously painting. Please wait a moment.",
        "textRu": "(nodding repeatedly, delighted) Yes, yes—magnificent! Still, perfection demand refinement. I'll adjust it again and again, until you see this painting and regret not meeting me sooner to be captured by my brush! Xia Daozhi is furiously painting. Please wait a moment."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      },
      {
        "role": "npc",
        "textEn": "Come take a look at my masterpiece! (Receive a portrait of yourself in the chat)",
        "textRu": "Come take a look at my masterpiece! (Receive a portrait of yourself in the chat)"
      }
    ]
  },
  {
    "id": "xi-gema",
    "nameEn": "Xi Gema",
    "nameRu": "Си Гэма",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Нефритовое зеркало источника",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Xi Gema можно найти southвосточнее the Chalic Peak boundary stone рядом с edge of the water.",
    "icon": "👤",
    "befriendGuide": "Motivate Him to Make Friends and Give Him a Gift\nXi Gema seems to be a lonely kid and is called weird by the people around him. Try to talk him through opening up and letting people get to know him better, then give him a gift at the end to finalize your friendship with his AI.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(muttering to himself) I was broken from a young age, taking my sulking to the masses—hah! You made me a believer... yeah, you really did—believer, believer! (strikes an overdramatic hero pose)",
        "textRu": "(muttering to himself) I was broken from a young age, taking my sulking to the masses—hah! You made me a believer... yeah, you really did—believer, believer! (strikes an overdramatic hero pose)"
      },
      {
        "role": "player",
        "textEn": "I love your hero pose! But heroes have friends too! Have you tired opening up to anyone yet? It may help you feel stronger!",
        "textRu": "I love your hero pose! But heroes have friends too! Have you tired opening up to anyone yet? It may help you feel stronger!"
      },
      {
        "role": "npc",
        "textEn": "(arms clasped behind back, suddenly breaks into a dash) Whoa—sorry, wanderer, my mind was somewhere else just now! Guess I've been running on split paths, living two lives, trying to play both sides, never really finding my own place—oh! Called a problem child 'cause I got too wild, but hey, that's just how someone like me survives. (pauses, then pouts) But you know, sometimes I wonder if opening up might just make me weaker.",
        "textRu": "(arms clasped behind back, suddenly breaks into a dash) Whoa—sorry, wanderer, my mind was somewhere else just now! Guess I've been running on split paths, living two lives, trying to play both sides, never really finding my own place—oh! Called a problem child 'cause I got too wild, but hey, that's just how someone like me survives. (pauses, then pouts) But you know, sometimes I wonder if opening up might just make me weaker."
      },
      {
        "role": "player",
        "textEn": "I'm travelling the world to explore and meet all sorts of people. You must have a lot of fascinating stories to share!",
        "textRu": "I'm travelling the world to explore and meet all sorts of people. You must have a lot of fascinating stories to share!"
      },
      {
        "role": "npc",
        "textEn": "(hands on hips) Players are gonna play, haters are gonna hare, so I just shake it off—whoo! If someone like me stands alone, that's strength! (smirk) Besides, what stories could a little troublemaker like me have that would interest you? I just do my own thing, wandering around and making my own path.",
        "textRu": "(hands on hips) Players are gonna play, haters are gonna hare, so I just shake it off—whoo! If someone like me stands alone, that's strength! (smirk) Besides, what stories could a little troublemaker like me have that would interest you? I just do my own thing, wandering around and making my own path."
      },
      {
        "role": "npc",
        "textEn": "There is still strength in having friends! It means more experiences and more adventures.",
        "textRu": "There is still strength in having friends! It means more experiences and more adventures."
      },
      {
        "role": "npc",
        "textEn": "(pouting, eyes narrowed) Don't you want me like I want you, huh? Don't you need me like I need you now? Saying tomorrow can wait, tonight's the moment—so what's the move, or are you just pretending to not care? (crosses arms) I've got my own path, and I'm not sure I need anyone to come along.",
        "textRu": "(pouting, eyes narrowed) Don't you want me like I want you, huh? Don't you need me like I need you now? Saying tomorrow can wait, tonight's the moment—so what's the move, or are you just pretending to not care? (crosses arms) I've got my own path, and I'm not sure I need anyone to come along."
      },
      {
        "role": "player",
        "textEn": "I do want to be your friend! Everything about you matters, and friendship is not about what I can gain from you.",
        "textRu": "I do want to be your friend! Everything about you matters, and friendship is not about what I can gain from you."
      },
      {
        "role": "npc",
        "textEn": "(glances aside, pretending calm) Everyone's swapping gifts now, flashing shingy things like trophies, but whatever—let it go, I won't cry, I'll stand right here and stay right here, storms and all... none of that ever bothered me anyway. (sighs) But you know, it's not about what you can get from me. It's about whether I even want to let anyone in.",
        "textRu": "(glances aside, pretending calm) Everyone's swapping gifts now, flashing shingy things like trophies, but whatever—let it go, I won't cry, I'll stand right here and stay right here, storms and all... none of that ever bothered me anyway. (sighs) But you know, it's not about what you can get from me. It's about whether I even want to let anyone in."
      },
      {
        "role": "npc",
        "textEn": "(give a gift to Xi Gema) Here, a testament of my commitment to a friendship with you!",
        "textRu": "(give a gift to Xi Gema) Here, a testament of my commitment to a friendship with you!"
      },
      {
        "role": "npc",
        "textEn": "(eyes light up) you really want to give me something? What is it, what is it—! (catches himself) Cough. I mean, it's not like I want it that much.",
        "textRu": "(eyes light up) you really want to give me something? What is it, what is it—! (catches himself) Cough. I mean, it's not like I want it that much."
      },
      {
        "role": "npc",
        "textEn": "(Give Nightglow Pearl x1)",
        "textRu": "(Give Nightglow Pearl x1)"
      },
      {
        "role": "npc",
        "textEn": "(pretends to be calm) really? cough cough... since you insist on giving it, I suppose Xi Gema can reluctantly accept. Xi Gema runs away, singing \"Lone Warrior.\"",
        "textRu": "(pretends to be calm) really? cough cough... since you insist on giving it, I suppose Xi Gema can reluctantly accept. Xi Gema runs away, singing \"Lone Warrior.\""
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "xiang-the-greedy",
    "nameEn": "Xiang the Greedy",
    "nameRu": "Сянь Любопытный",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Can be seen beside numerous large containers.",
    "icon": "👤",
    "befriendGuide": "Praise Xiang the Greedy's Rapping Skills and Promote His Art\nPraise Xiang the Greedy's freestyling skills and tell him that he will make it big. After that, roleplay that you are promoting him throughout the Moonveil Mountains to make him befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(salutes, then freestyles with swagger) Yo, yo! The name's Dee Lusion, born to spit fusion-rhymes so tight they spark a revolution! Verse check-one, two ... and forty-two! They say my art's too wild, but I'm the fiercest wordsmith in Qinghe! Uh-huh, feel that rhythm? You ready to witness greatness, or just here to taste the flow?",
        "textRu": "(salutes, then freestyles with swagger) Yo, yo! The name's Dee Lusion, born to spit fusion-rhymes so tight they spark a revolution! Verse check-one, two ... and forty-two! They say my art's too wild, but I'm the fiercest wordsmith in Qinghe! Uh-huh, feel that rhythm? You ready to witness greatness, or just here to taste the flow?"
      },
      {
        "role": "npc",
        "textEn": "Yo! You got some fire bars man.",
        "textRu": "Yo! You got some fire bars man."
      },
      {
        "role": "npc",
        "textEn": "(grins wide, nods) Fire bars, that's me! My rhymes light up the night, like sparks from a forge. What brings you to my corner of the street? Ready to hear more",
        "textRu": "(grins wide, nods) Fire bars, that's me! My rhymes light up the night, like sparks from a forge. What brings you to my corner of the street? Ready to hear more"
      },
      {
        "role": "npc",
        "textEn": "You know, I can see you performing within a large stage! Full of fans chanting your name bro!",
        "textRu": "You know, I can see you performing within a large stage! Full of fans chanting your name bro!"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen, pounds chest) A full stage, fans chanting my name? That's the dream! I know my art's worth it, even if folks around here ain't seen it yet. You believe in me, that means a lot. Maybe we can build this together",
        "textRu": "(eyes widen, pounds chest) A full stage, fans chanting my name? That's the dream! I know my art's worth it, even if folks around here ain't seen it yet. You believe in me, that means a lot. Maybe we can build this together"
      },
      {
        "role": "npc",
        "textEn": "Yes we can bro! (You helped him promote his art throughout the masses, which helped him become popular all over moonveil mountain.)",
        "textRu": "Yes we can bro! (You helped him promote his art throughout the masses, which helped him become popular all over moonveil mountain.)"
      },
      {
        "role": "npc",
        "textEn": "(beats chest, voice booming like a drum) Yo! You felt my flame, and Dee Lusion stays in the game! If your day feels heavy, remember this thunder- someone from your homeland still dreams of rhymes that strike like lightning's wonder! That's me, baby! I'll blaze till the stars chant my name!Xiang the Greedy reflects on your words and bows in gratitude.",
        "textRu": "(beats chest, voice booming like a drum) Yo! You felt my flame, and Dee Lusion stays in the game! If your day feels heavy, remember this thunder- someone from your homeland still dreams of rhymes that strike like lightning's wonder! That's me, baby! I'll blaze till the stars chant my name!Xiang the Greedy reflects on your words and bows in gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "xu-lijun",
    "nameEn": "Xu Lijun",
    "nameRu": "Сюй Лицзюнь",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her beside Ye Zhiqiu on the ground floor of the Revelry Hall, on the east side of the building.",
    "icon": "👤",
    "befriendGuide": "Ask Xu Lijun What Brought Her to the Revelry Hall\nThe key to success on befriending Xu Lijun is patience. Ask her why she went to the Revelry Hall first, and once she answers, she will ask you different questions. Just answer them truthfully which might take long as she will chat with you alot. Don't worry as this is the way to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(smiles faintly, eyes glimmering with curiosity) Wanderer, you look unfamiliar, lei. Are you new here? I don' t think I've seen you around before, o!",
        "textRu": "(smiles faintly, eyes glimmering with curiosity) Wanderer, you look unfamiliar, lei. Are you new here? I don' t think I've seen you around before, o!"
      },
      {
        "role": "npc",
        "textEn": "Why yes! Can you tell me a bit more about this place",
        "textRu": "Why yes! Can you tell me a bit more about this place"
      },
      {
        "role": "npc",
        "textEn": "(leans in slightly, whispering conspiratorially) This is Revelry Hall, where the best performances happen, la! It's a place to unwind and forget about all the strict training back at the Masked Troupe. Well, since we're here, let's just enjoy the show. Life is a vast wilderness-why fence yourself in?",
        "textRu": "(leans in slightly, whispering conspiratorially) This is Revelry Hall, where the best performances happen, la! It's a place to unwind and forget about all the strict training back at the Masked Troupe. Well, since we're here, let's just enjoy the show. Life is a vast wilderness-why fence yourself in?"
      },
      {
        "role": "npc",
        "textEn": "Oh so is the heroic assembly the same as this place?",
        "textRu": "Oh so is the heroic assembly the same as this place?"
      },
      {
        "role": "npc",
        "textEn": "(shakes head, chuckling softly) Not quite, la! The Heroic Assembly is more formal and serious, filled with martial artists discussing strategies and rivalries. Here at Revelry Hall, it's all about having fun and letting loose. Ignore the master's words, and you'll be happy all year. Women need to see more of this if we want to keep practicing with passion!",
        "textRu": "(shakes head, chuckling softly) Not quite, la! The Heroic Assembly is more formal and serious, filled with martial artists discussing strategies and rivalries. Here at Revelry Hall, it's all about having fun and letting loose. Ignore the master's words, and you'll be happy all year. Women need to see more of this if we want to keep practicing with passion!"
      },
      {
        "role": "player",
        "textEn": "so tell me Xu Lijun, what brings you here?",
        "textRu": "so tell me Xu Lijun, what brings you here?"
      },
      {
        "role": "npc",
        "textEn": "(grins mischievously, leaning back) Ah, you know, sometimes a girl needs to escape the monotony of practice and experience the vibrant world outside. As for me, I'm enjoying myself right now-practice can wait. Life is meant to be lived fully, not chained to rules. So, what brings you here, Wanderer?",
        "textRu": "(grins mischievously, leaning back) Ah, you know, sometimes a girl needs to escape the monotony of practice and experience the vibrant world outside. As for me, I'm enjoying myself right now-practice can wait. Life is meant to be lived fully, not chained to rules. So, what brings you here, Wanderer?"
      },
      {
        "role": "player",
        "textEn": "(You explained that you are here to perform later)",
        "textRu": "(You explained that you are here to perform later)"
      },
      {
        "role": "npc",
        "textEn": "(nods, eyes twinkling) Right, right! I'm here to perform later, but that doesn't mean I can't have some fun beforehand. Procrastinate for a moment, and it feels great; procrastinate forever, and it feels even better. Why say I'm procrastinating? Big sis hasn't even started doing anything yet!",
        "textRu": "(nods, eyes twinkling) Right, right! I'm here to perform later, but that doesn't mean I can't have some fun beforehand. Procrastinate for a moment, and it feels great; procrastinate forever, and it feels even better. Why say I'm procrastinating? Big sis hasn't even started doing anything yet!"
      },
      {
        "role": "player",
        "textEn": "(You and Xu Lijun became friends)",
        "textRu": "(You and Xu Lijun became friends)"
      },
      {
        "role": "npc",
        "textEn": "(taps you lightly on the shoulder, grinning) Hey! Friends already? That's fast, la! But I like it. Just remember, be sincere, la! Who just becomes friends without chatting first? You're going to have a hard time with me if you keep that up, lei!",
        "textRu": "(taps you lightly on the shoulder, grinning) Hey! Friends already? That's fast, la! But I like it. Just remember, be sincere, la! Who just becomes friends without chatting first? You're going to have a hard time with me if you keep that up, lei!"
      },
      {
        "role": "npc",
        "textEn": "Okay lets chat then!",
        "textRu": "Okay lets chat then!"
      },
      {
        "role": "npc",
        "textEn": "(claps hands excitedly) Great! So, what kind of shows do you like to watch, Wanderer? I find that the more I see, the more inspiration I get for my own performances. Women need to see more of this if we want to keep practicing with passion! What about you?",
        "textRu": "(claps hands excitedly) Great! So, what kind of shows do you like to watch, Wanderer? I find that the more I see, the more inspiration I get for my own performances. Women need to see more of this if we want to keep practicing with passion! What about you?"
      },
      {
        "role": "player",
        "textEn": "(You and Xu Lijun chatted for hours and became friends)",
        "textRu": "(You and Xu Lijun chatted for hours and became friends)"
      },
      {
        "role": "npc",
        "textEn": "(smiles widely, tilting head) Hours flew by, huh? I guess good company makes time pass quickly, la! It's rare to find someone who understands the balance between work and leisure. My standard is eight hours of practice a day, but honestly? After fifteen minutes, I'm stuck and just want to play or sleep. So, what do you think about that?",
        "textRu": "(smiles widely, tilting head) Hours flew by, huh? I guess good company makes time pass quickly, la! It's rare to find someone who understands the balance between work and leisure. My standard is eight hours of practice a day, but honestly? After fifteen minutes, I'm stuck and just want to play or sleep. So, what do you think about that?"
      },
      {
        "role": "npc",
        "textEn": "Oh I agree with what you are saying! (You and Xu Lijun became friends)",
        "textRu": "Oh I agree with what you are saying! (You and Xu Lijun became friends)"
      },
      {
        "role": "npc",
        "textEn": "(giggles, clapping hands) Yay! I'm glad we're on the same page, la! Having a friend who gets it makes everything better. Let's enjoy the show together, shall we? Life is meant to be lived fully, not chained to rules. What do you think of the performers here?",
        "textRu": "(giggles, clapping hands) Yay! I'm glad we're on the same page, la! Having a friend who gets it makes everything better. Let's enjoy the show together, shall we? Life is meant to be lived fully, not chained to rules. What do you think of the performers here?"
      },
      {
        "role": "npc",
        "textEn": "The performers are great !! I am enjoying the show",
        "textRu": "The performers are great !! I am enjoying the show"
      },
      {
        "role": "npc",
        "textEn": "(stands on tiptoe, excitement in her voice) Oh! Big sis has to go on stage soon, let's talk later, la!Xu Lijun tiptoes and peers around, eager to catch the next performance.",
        "textRu": "(stands on tiptoe, excitement in her voice) Oh! Big sis has to go on stage soon, let's talk later, la!Xu Lijun tiptoes and peers around, eager to catch the next performance."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "xu-yingyu",
    "nameEn": "Xu Yingyu",
    "nameRu": "Сюй Иньюй",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her on the ground floor of the Revelry Hall, on the west side of the building.",
    "icon": "👤",
    "befriendGuide": "Ask Xu Yingyu About the Book She Read\nAsk Xu Yingyu about what she's up to and she will tell you that she read a book on how to win a man's heart. Call it fake and then tell her that kidnapping the man she loves won't make him love her. Tell her to just come to him normally to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(annoyed, fiddling with the rope hidden in her sleeve) Hmph! I've followed every step in that book, so why is progress crawling? Is he drunk yet? Maybe ... maybe I should just tie him up and take him home right now!",
        "textRu": "(annoyed, fiddling with the rope hidden in her sleeve) Hmph! I've followed every step in that book, so why is progress crawling? Is he drunk yet? Maybe ... maybe I should just tie him up and take him home right now!"
      },
      {
        "role": "npc",
        "textEn": "(approaches her) um are you okay ma'am",
        "textRu": "(approaches her) um are you okay ma'am"
      },
      {
        "role": "npc",
        "textEn": "(tightens grip on the rope, eyeing the wanderer warily) I'm fine. Just preparing to win Master Yi's heart. Have you seen that book? It promises success if you follow its steps!",
        "textRu": "(tightens grip on the rope, eyeing the wanderer warily) I'm fine. Just preparing to win Master Yi's heart. Have you seen that book? It promises success if you follow its steps!"
      },
      {
        "role": "npc",
        "textEn": "(book fell down) So this is the book you've been reading?",
        "textRu": "(book fell down) So this is the book you've been reading?"
      },
      {
        "role": "npc",
        "textEn": "(gasps, quickly picks up the book and clutches it to chest) Yes! This is \"How to Make a Man Devoted to You for Life.\" It' s full of secrets! But why did you call it fake earlier?",
        "textRu": "(gasps, quickly picks up the book and clutches it to chest) Yes! This is \"How to Make a Man Devoted to You for Life.\" It' s full of secrets! But why did you call it fake earlier?"
      },
      {
        "role": "player",
        "textEn": "I don't think kidnapping the man you love would make him love you.",
        "textRu": "I don't think kidnapping the man you love would make him love you."
      },
      {
        "role": "npc",
        "textEn": "(frowns, taps the sachet at waist) But the book says boldness and charm are key! Maybe I need to try something else ... Sincerity, it says. I could find out his favorite place and meet him there.",
        "textRu": "(frowns, taps the sachet at waist) But the book says boldness and charm are key! Maybe I need to try something else ... Sincerity, it says. I could find out his favorite place and meet him there."
      },
      {
        "role": "player",
        "textEn": "why not try talking to him than doing unnesecarry things",
        "textRu": "why not try talking to him than doing unnesecarry things"
      },
      {
        "role": "npc",
        "textEn": "(uncertain, loosening the grip on the rope) Talking? I thought I needed to show him how much I care through actions ... But maybe you're right. It couldn't hurt to talk, could it?",
        "textRu": "(uncertain, loosening the grip on the rope) Talking? I thought I needed to show him how much I care through actions ... But maybe you're right. It couldn't hurt to talk, could it?"
      },
      {
        "role": "player",
        "textEn": "(you lightly pushed her to the guy she likes) Good luck!",
        "textRu": "(you lightly pushed her to the guy she likes) Good luck!"
      },
      {
        "role": "npc",
        "textEn": "(takes out her treasured copy of \"How to Make a Man Devoted to You for Life -by Drunken Petals\", brows furrowed in doubt) Could it be ... this book is flawed? I paid a fortune to a Nine Mortal Ways disciple for this! He swore it came straight from Velvet Shade and was an exclusive, never to be circulated!Xu Yingyu stares at the book titled \"How to Make a Man Devoted to You for Life - by Drunken Petals\", lost in thought.",
        "textRu": "(takes out her treasured copy of \"How to Make a Man Devoted to You for Life -by Drunken Petals\", brows furrowed in doubt) Could it be ... this book is flawed? I paid a fortune to a Nine Mortal Ways disciple for this! He swore it came straight from Velvet Shade and was an exclusive, never to be circulated!Xu Yingyu stares at the book titled \"How to Make a Man Devoted to You for Life - by Drunken Petals\", lost in thought."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "xue-li",
    "nameEn": "Xue Li",
    "nameRu": "Сюэ Ли",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the second floor of the Revelry Hall. He can be seen dining with Zhuang Zhengzi.",
    "icon": "👤",
    "befriendGuide": "Tell Xue Li to Recommend Divorce\nListen to Xue Li's problems regarding Zhuang Zhengzhi and his wife and agree with what he says. Recommend to Xue Li to tell the Li Niang to divorce Zhuang Zhengzhi and then roleplay that Li Niang came to Xue Li to tell him about divorcing her husband. There is a chance that the AI will be tricked into befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(lifts his gaze, fingers lightly brushing the edge of his sleeve) Tell me, Wanderer-why is it that when a man indulges in pleasure, it's called romantic, yet when a woman seeks passion, it's deemed vulgar? That Zhuang Zhengzhi is no saint himself, yet he speaks of morality and etiquette, using them to bind others while sparing himself. I love her! With me, she can be her true self. What is so scandalous about that?",
        "textRu": "(lifts his gaze, fingers lightly brushing the edge of his sleeve) Tell me, Wanderer-why is it that when a man indulges in pleasure, it's called romantic, yet when a woman seeks passion, it's deemed vulgar? That Zhuang Zhengzhi is no saint himself, yet he speaks of morality and etiquette, using them to bind others while sparing himself. I love her! With me, she can be her true self. What is so scandalous about that?"
      },
      {
        "role": "npc",
        "textEn": "please enlighten me",
        "textRu": "please enlighten me"
      },
      {
        "role": "npc",
        "textEn": "(leans forward, eyes narrowing thoughtfully) It is simple, Wanderer. Zhuang Zhengzhi treats Li Niang as a possession, not a person. He restricts her freedom, denies her happiness, and fails to provide the affection she deserves. With me, she finds solace and companionship. Her kindness and gentle nature flourish when she is free to be herself. How can this be wrong?",
        "textRu": "(leans forward, eyes narrowing thoughtfully) It is simple, Wanderer. Zhuang Zhengzhi treats Li Niang as a possession, not a person. He restricts her freedom, denies her happiness, and fails to provide the affection she deserves. With me, she finds solace and companionship. Her kindness and gentle nature flourish when she is free to be herself. How can this be wrong?"
      },
      {
        "role": "player",
        "textEn": "well if that were true. Then she shouldn't be with him",
        "textRu": "well if that were true. Then she shouldn't be with him"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly, braws knitting) Precisely. If Zhuang Zhengzhi truly loved her, he would see her worth and nurture her spirit. Instead, he belittles and confines her. I have offered her a life where she can thrive and be happy. Is that not what love should be?",
        "textRu": "(nods firmly, braws knitting) Precisely. If Zhuang Zhengzhi truly loved her, he would see her worth and nurture her spirit. Instead, he belittles and confines her. I have offered her a life where she can thrive and be happy. Is that not what love should be?"
      },
      {
        "role": "npc",
        "textEn": "That is what love should be",
        "textRu": "That is what love should be"
      },
      {
        "role": "npc",
        "textEn": "(smiles softly, gaze steady) Indeed. Love should lift one up, not weigh them down. Li Niang deserves to be cherished and respected. Zhuang Zhengzhi's ten thousand taels mean nothing to me compared to the happiness I can offer her.",
        "textRu": "(smiles softly, gaze steady) Indeed. Love should lift one up, not weigh them down. Li Niang deserves to be cherished and respected. Zhuang Zhengzhi's ten thousand taels mean nothing to me compared to the happiness I can offer her."
      },
      {
        "role": "npc",
        "textEn": "Then you should tell Li Niang to divorce her husband",
        "textRu": "Then you should tell Li Niang to divorce her husband"
      },
      {
        "role": "npc",
        "textEn": "(fingers tighten on the edge of his sleeve, expression resolute) I have considered it. But the decision must ultimately be hers. She must see that she deserves better and choose for herself to leave a life that stifles her. My role is to support her, not force her hand",
        "textRu": "(fingers tighten on the edge of his sleeve, expression resolute) I have considered it. But the decision must ultimately be hers. She must see that she deserves better and choose for herself to leave a life that stifles her. My role is to support her, not force her hand"
      },
      {
        "role": "npc",
        "textEn": "(Li Niang came to tell Xue about her divorcing her husband)",
        "textRu": "(Li Niang came to tell Xue about her divorcing her husband)"
      },
      {
        "role": "npc",
        "textEn": "(eyes steady, voice firm yet gentle) Even if the world condemns us, even if she remains bound in marriage, my feelings for her will never waver. If fate grants me the chance, I will protect her completely, never again will she grieve alone in that cold, loveless home.Xue Li casts a dismissive glance at Zhuang Zhengzhi, clearly unimpressed by his views.",
        "textRu": "(eyes steady, voice firm yet gentle) Even if the world condemns us, even if she remains bound in marriage, my feelings for her will never waver. If fate grants me the chance, I will protect her completely, never again will she grieve alone in that cold, loveless home.Xue Li casts a dismissive glance at Zhuang Zhengzhi, clearly unimpressed by his views."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "ya-zhou",
    "nameEn": "Ya Zhou",
    "nameRu": "Я Чжоу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Озеро Окружения",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him standing у docks.",
    "icon": "👤",
    "befriendGuide": "Keep Listening to Ya Zhou's Stories\nTell Ya Zhou that you will listen to his stories and just keep letting him talk. Urge him to share more of his stories, and if he asks the reason you came to Qinghe, tell him that you came to listen to old man's stories.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighing deeply, voice tinged with grief) Back then, after the general was defeated, the boatman who ferried supplies with me was captured and killed. I carried his belongings and knocked on his door ...",
        "textRu": "(sighing deeply, voice tinged with grief) Back then, after the general was defeated, the boatman who ferried supplies with me was captured and killed. I carried his belongings and knocked on his door ..."
      },
      {
        "role": "npc",
        "textEn": "Hey! Can you tell me more about your past? I am very intrigued.",
        "textRu": "Hey! Can you tell me more about your past? I am very intrigued."
      },
      {
        "role": "npc",
        "textEn": "(lost in memories, voice low and heavy) The boy came to open the door .. so young, yet he understood what had happened. When he saw his father's clothes, he broke into tears.",
        "textRu": "(lost in memories, voice low and heavy) The boy came to open the door .. so young, yet he understood what had happened. When he saw his father's clothes, he broke into tears."
      },
      {
        "role": "npc",
        "textEn": "(Both of you sat down and you listened to his stories.)",
        "textRu": "(Both of you sat down and you listened to his stories.)"
      },
      {
        "role": "npc",
        "textEn": "(sadness welling in his eyes) His body trembled, tears streaming down his face. In that moment, through those eyes, I saw another sorrowful child.",
        "textRu": "(sadness welling in his eyes) His body trembled, tears streaming down his face. In that moment, through those eyes, I saw another sorrowful child."
      },
      {
        "role": "player",
        "textEn": "(you both grab a drink and you listened to his stories for the whole night.)",
        "textRu": "(you both grab a drink and you listened to his stories for the whole night.)"
      },
      {
        "role": "npc",
        "textEn": "(voice trembling, gaze distant) When I was his age, I too received my father's clothes from a stranger ... and I knew then, I would never wait for him to return home again.",
        "textRu": "(voice trembling, gaze distant) When I was his age, I too received my father's clothes from a stranger ... and I knew then, I would never wait for him to return home again."
      },
      {
        "role": "npc",
        "textEn": "Continue",
        "textRu": "Continue"
      },
      {
        "role": "npc",
        "textEn": "(slowly shaking his head, gaze still distant) Those memories are heavy, but they remind me why I continue to serve the general and ferry supplies. What brings you to Qinghe, Wanderer?",
        "textRu": "(slowly shaking his head, gaze still distant) Those memories are heavy, but they remind me why I continue to serve the general and ferry supplies. What brings you to Qinghe, Wanderer?"
      },
      {
        "role": "player",
        "textEn": "I came to listen to an old man stories",
        "textRu": "I came to listen to an old man stories"
      },
      {
        "role": "npc",
        "textEn": "(nodding slowly, a gentle smile forming) There are many tales to be told here in Qinghe. Some bring joy, others sorrow. Would you like to hear more about the river and the people who depend on it?",
        "textRu": "(nodding slowly, a gentle smile forming) There are many tales to be told here in Qinghe. Some bring joy, others sorrow. Would you like to hear more about the river and the people who depend on it?"
      },
      {
        "role": "npc",
        "textEn": "Gladly! (You listened to his stories for the whole night.)",
        "textRu": "Gladly! (You listened to his stories for the whole night.)"
      },
      {
        "role": "npc",
        "textEn": "(lifting his head slightly, voice heavy with longing) This endless cycle of fate in troubled times ... when will it break? May every child who opens a door in hope see their father return safely.Ya Zhou falls silent and lets out a long sigh.",
        "textRu": "(lifting his head slightly, voice heavy with longing) This endless cycle of fate in troubled times ... when will it break? May every child who opens a door in hope see their father return safely.Ya Zhou falls silent and lets out a long sigh."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yan-chuchu",
    "nameEn": "Yan Chuchu",
    "nameRu": "Янь Чучу",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her on the bridge к right of the Бархатная тень Landmark. She can be seen talking with Song Shiheng.",
    "icon": "👤",
    "befriendGuide": "Offer Reservation to the Heroes Assembly\nRoleplay that you are offering Yan Chuchu reservation tickets to the Heroes Assembly so she and her husband can go. This will cause her to be reluctant and will say she hesitates leaving her spot. Trick the AI by repeatedly roleplaying that she and her husband went to the assembly until she befriends you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes shimmering with quiet longing) Wanderer ... have you ever been to the Heroes Assembly? I've heard it's a place of peace and splendor, with performances so exquisite they leave you breathless ...",
        "textRu": "(eyes shimmering with quiet longing) Wanderer ... have you ever been to the Heroes Assembly? I've heard it's a place of peace and splendor, with performances so exquisite they leave you breathless ..."
      },
      {
        "role": "npc",
        "textEn": "Why yes, It's a sight to remember! I suggest to try and attend one.",
        "textRu": "Why yes, It's a sight to remember! I suggest to try and attend one."
      },
      {
        "role": "npc",
        "textEn": "(voice soft, hands fidgeting with the hem of her dress) Oh, I would love to go so much. The Twenty-Four Flower Messengers ... I've always dreamt of seeing them. But my husband always makes promises ... and they never come true. Why should this time be any different?",
        "textRu": "(voice soft, hands fidgeting with the hem of her dress) Oh, I would love to go so much. The Twenty-Four Flower Messengers ... I've always dreamt of seeing them. But my husband always makes promises ... and they never come true. Why should this time be any different?"
      },
      {
        "role": "npc",
        "textEn": "Do you want me to make you and your husband get reservation seats? I know someone inside who can help in getting one.",
        "textRu": "Do you want me to make you and your husband get reservation seats? I know someone inside who can help in getting one."
      },
      {
        "role": "npc",
        "textEn": "(eyebrows furrow slightly, lips pressed together) That sounds too good to be true. My husband has promised me so many times ... but nothing ever comes of it. How can I trust that this will be different?",
        "textRu": "(eyebrows furrow slightly, lips pressed together) That sounds too good to be true. My husband has promised me so many times ... but nothing ever comes of it. How can I trust that this will be different?"
      },
      {
        "role": "npc",
        "textEn": "Don't be afraid! I'll help you guys out .. free of charge",
        "textRu": "Don't be afraid! I'll help you guys out .. free of charge"
      },
      {
        "role": "npc",
        "textEn": "(a small smile tugs at the corners of her mouth, but quickly fades) That's very kind of you, Wanderer. But I've been let down too many times before. My husband always says he'll do something and then ... nothing happens. I'm just cautious, that's all.",
        "textRu": "(a small smile tugs at the corners of her mouth, but quickly fades) That's very kind of you, Wanderer. But I've been let down too many times before. My husband always says he'll do something and then ... nothing happens. I'm just cautious, that's all."
      },
      {
        "role": "npc",
        "textEn": "No worries, you guys just met me so its okay to be cautious, but here follow me! (you lead her and her husband to the front seat of the assembly)",
        "textRu": "No worries, you guys just met me so its okay to be cautious, but here follow me! (you lead her and her husband to the front seat of the assembly)"
      },
      {
        "role": "npc",
        "textEn": "(steps back, shaking her head) I appreciate your kindness, Wanderer, but I can't go anywhere with you. I need to stay here. My husband might come looking for me. Thank you for understanding.",
        "textRu": "(steps back, shaking her head) I appreciate your kindness, Wanderer, but I can't go anywhere with you. I need to stay here. My husband might come looking for me. Thank you for understanding."
      },
      {
        "role": "npc",
        "textEn": "Oh your husband is here waiting already",
        "textRu": "Oh your husband is here waiting already"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with surprise and a hint of hope) Really? He's here? (pauses, then cautiously continues) Even if he is, I still don't want to leave this spot. I need to stay here and wait for him.",
        "textRu": "(eyes widen with surprise and a hint of hope) Really? He's here? (pauses, then cautiously continues) Even if he is, I still don't want to leave this spot. I need to stay here and wait for him."
      },
      {
        "role": "npc",
        "textEn": "(Yan Chuchu and her husband attended the assembly)",
        "textRu": "(Yan Chuchu and her husband attended the assembly)"
      },
      {
        "role": "npc",
        "textEn": "(eyes glimmering with cautious hope) Thank you for your help, Wanderer. I ... I'll give it a try.",
        "textRu": "(eyes glimmering with cautious hope) Thank you for your help, Wanderer. I ... I'll give it a try."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yan-momo",
    "nameEn": "Yan Momo",
    "nameRu": "Янь Момо",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "She можно найти рядом с Багровый утёс Landmark. Getting some leaves from a lonely red tree.",
    "icon": "👤",
    "befriendGuide": "Hear Yan Momo's Story About Her Mother\nYou'll find Yan Momo trying to find a flower under a tree, as she believes the flower that she'll find is her mother. Hear out Yan Momo's story and tell her you found the spot where she can get the flower to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(kneeling among blossoms, gently brushing petals) This one ... still not perfect. Wanderer. have you ever seen the most beautiful flower in the world?",
        "textRu": "(kneeling among blossoms, gently brushing petals) This one ... still not perfect. Wanderer. have you ever seen the most beautiful flower in the world?"
      },
      {
        "role": "npc",
        "textEn": "Why yes! Just north of here, there is a mountain that sprouts a single flower each year and its beauty is nothing in comparison.",
        "textRu": "Why yes! Just north of here, there is a mountain that sprouts a single flower each year and its beauty is nothing in comparison."
      },
      {
        "role": "npc",
        "textEn": "(sighing softly, gaze distant) My mother loved flowers more than anything, yet she always called herself a 'pothos woman'-plain, never beautiful enough. She only wished to be as simple and full of life as the humble pothos.",
        "textRu": "(sighing softly, gaze distant) My mother loved flowers more than anything, yet she always called herself a 'pothos woman'-plain, never beautiful enough. She only wished to be as simple and full of life as the humble pothos."
      },
      {
        "role": "player",
        "textEn": "but even a pothos can be gorgeous to a different people.",
        "textRu": "but even a pothos can be gorgeous to a different people."
      },
      {
        "role": "npc",
        "textEn": "(voice lowering, eyes glistening) Years of toil wore her down. She fought illness for so long, but that winter ... she couldn't hold on. Before she left, she told me not to cry ... that she would become the pothos by my window to keep me company. I told her, in her next life, she must bloom as a radiant flower, not fade away like a forgotten vine. She smiled and nodded.",
        "textRu": "(voice lowering, eyes glistening) Years of toil wore her down. She fought illness for so long, but that winter ... she couldn't hold on. Before she left, she told me not to cry ... that she would become the pothos by my window to keep me company. I told her, in her next life, she must bloom as a radiant flower, not fade away like a forgotten vine. She smiled and nodded."
      },
      {
        "role": "player",
        "textEn": "(you showed her a beautiful flower that may remind her of her mother)",
        "textRu": "(you showed her a beautiful flower that may remind her of her mother)"
      },
      {
        "role": "npc",
        "textEn": "(hope rekindled, tone soft yet firm) So now, in every season, whenever I miss her, I wander these hills and fields, searching for that one perfect bloom. Thank you for showing me this flower. It does bring back memories of my mother.",
        "textRu": "(hope rekindled, tone soft yet firm) So now, in every season, whenever I miss her, I wander these hills and fields, searching for that one perfect bloom. Thank you for showing me this flower. It does bring back memories of my mother."
      },
      {
        "role": "player",
        "textEn": "(you showed her where you can find these flowers.)",
        "textRu": "(you showed her where you can find these flowers.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening, a smile forming) Truly? Could you lead me there? Perhaps the most beautiful flower in the world awaits us.",
        "textRu": "(eyes brightening, a smile forming) Truly? Could you lead me there? Perhaps the most beautiful flower in the world awaits us."
      },
      {
        "role": "npc",
        "textEn": "(after an hour journey, you were able to bring her to the place.)",
        "textRu": "(after an hour journey, you were able to bring her to the place.)"
      },
      {
        "role": "npc",
        "textEn": "(gazing around, breath catching) Oh, it's even more breathtaking than I imagined. Mother, if only you could see this ... (pausing to collect herself) Thank you, Wanderer. This means so much to me.",
        "textRu": "(gazing around, breath catching) Oh, it's even more breathtaking than I imagined. Mother, if only you could see this ... (pausing to collect herself) Thank you, Wanderer. This means so much to me."
      },
      {
        "role": "npc",
        "textEn": "(she brought the flowers home.)",
        "textRu": "(she brought the flowers home.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes shimmering with hope, expression softens) I believe she has become the most beautiful flower in the world. Wanderer, you've been to so many places, would you please keep an eye out for me?Yan Momo smiles at you and goes back to searching for flowers.",
        "textRu": "(eyes shimmering with hope, expression softens) I believe she has become the most beautiful flower in the world. Wanderer, you've been to so many places, would you please keep an eye out for me?Yan Momo smiles at you and goes back to searching for flowers."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yan-ziyan",
    "nameEn": "Yan Ziyan",
    "nameRu": "Янь Цзыянь",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти her on the ground floor of the Revelry Hall, on the south side of the building.",
    "icon": "👤",
    "befriendGuide": "Learn Yan Ziyan's Plans and Offer to Help\nLearn of Yan Ziyan's plans by asking her questions and then giving your opinion of them if she asks what you think. Offer to help her plans to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes gleaming with excitement) Wanderer, people say women shouldn' t do business, but I don't agree. I've come up with a brilliant money -making idea! You're so insightful, Wanderer, could you help me evaluate it?",
        "textRu": "(eyes gleaming with excitement) Wanderer, people say women shouldn' t do business, but I don't agree. I've come up with a brilliant money -making idea! You're so insightful, Wanderer, could you help me evaluate it?"
      },
      {
        "role": "player",
        "textEn": "ohh please tell me good ma'am",
        "textRu": "ohh please tell me good ma'am"
      },
      {
        "role": "npc",
        "textEn": "(twirls a strand of hair, leaning forward with a mischievous grin) Well, I'm planning to take over a flower shop. The trick is getting enough customers, right? So I thought of an 'invite-for-a -gift' event-if you bring five friends to buy flowers with you, you'll get one flower for free! This way, the news will spread quickly and the shop will soon be buzzing! What do you think?",
        "textRu": "(twirls a strand of hair, leaning forward with a mischievous grin) Well, I'm planning to take over a flower shop. The trick is getting enough customers, right? So I thought of an 'invite-for-a -gift' event-if you bring five friends to buy flowers with you, you'll get one flower for free! This way, the news will spread quickly and the shop will soon be buzzing! What do you think?"
      },
      {
        "role": "player",
        "textEn": "you'll be drawing a crowd with that tactic",
        "textRu": "you'll be drawing a crowd with that tactic"
      },
      {
        "role": "npc",
        "textEn": "(smiles broadly, nodding eagerly) Exactly! And I have another idea too- a 'bargain-for-a-prize' event. If people help you haggle, they earn a chance to draw for a reward. The prizes include various discounts ... but the real catch is that you need to collect a hundred coupons to win. They won't know this little secret though-there aren't even a hundred coupons in the box! Clever, isn't it?",
        "textRu": "(smiles broadly, nodding eagerly) Exactly! And I have another idea too- a 'bargain-for-a-prize' event. If people help you haggle, they earn a chance to draw for a reward. The prizes include various discounts ... but the real catch is that you need to collect a hundred coupons to win. They won't know this little secret though-there aren't even a hundred coupons in the box! Clever, isn't it?"
      },
      {
        "role": "npc",
        "textEn": "You sure are smart!",
        "textRu": "You sure are smart!"
      },
      {
        "role": "npc",
        "textEn": "(beams with pride, clasping hands together) Thank you, Wanderer! I always try to think outside the box. But sometimes, I get stuck on the details. Do you have any advice on how to implement these ideas? Maybe we can brainstorm together!",
        "textRu": "(beams with pride, clasping hands together) Thank you, Wanderer! I always try to think outside the box. But sometimes, I get stuck on the details. Do you have any advice on how to implement these ideas? Maybe we can brainstorm together!"
      },
      {
        "role": "npc",
        "textEn": "You stay on one side and let me do the advertising. I'll walk around the hall and gain as much people as possible.",
        "textRu": "You stay on one side and let me do the advertising. I'll walk around the hall and gain as much people as possible."
      },
      {
        "role": "npc",
        "textEn": "(leans in with a hopeful expression) That sounds wonderful, Wanderer! Having you handle the advertising would really help. We could create eye -catching posters and maybe even offer small samples to attract more attention. What else do you think we should do to make the shop a success?",
        "textRu": "(leans in with a hopeful expression) That sounds wonderful, Wanderer! Having you handle the advertising would really help. We could create eye -catching posters and maybe even offer small samples to attract more attention. What else do you think we should do to make the shop a success?"
      },
      {
        "role": "player",
        "textEn": "more employees for more exposure to other villages",
        "textRu": "more employees for more exposure to other villages"
      },
      {
        "role": "npc",
        "textEn": "(nods enthusiastically, eyes shining) Great idea! Hiring more employees could certainly help expand our reach. We could send them to neighboring villages to spread the word and perhaps even set up temporary stalls during local festivals. This way, more people would hear about our special events. What do you think of that plan?",
        "textRu": "(nods enthusiastically, eyes shining) Great idea! Hiring more employees could certainly help expand our reach. We could send them to neighboring villages to spread the word and perhaps even set up temporary stalls during local festivals. This way, more people would hear about our special events. What do you think of that plan?"
      },
      {
        "role": "player",
        "textEn": "I think that plan is great",
        "textRu": "I think that plan is great"
      },
      {
        "role": "npc",
        "textEn": "(beaming with joy) Don't worry, Wanderer-if I strike it rich, you'll definitely get a share!Yan Ziyan is bursting with excitement, as if her business plan has already succeeded.",
        "textRu": "(beaming with joy) Don't worry, Wanderer-if I strike it rich, you'll definitely get a share!Yan Ziyan is bursting with excitement, as if her business plan has already succeeded."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yang-chunnuan",
    "nameEn": "Yang Chunnuan",
    "nameRu": "Ян Чуньнюань",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him by going южнее the Springwave Pavilion Landmark, where he can be seen talking with Su Xinlu and three other NPCs",
    "icon": "👤",
    "befriendGuide": "Agree with Yang Chunnuan\nYou should always agree with Yang Chunnuan that Sixth Lady should get the spotlight and work with him to bring the Sixth Lady get the title she deserves. This will make Yang Chunnuan your friend.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(hysterically) What does that Su Xinlu know? When our sister isn't performing. she's practicing every single day! Her feet are covered in blisters, yet she still tells us it's all worth it to become the Courtesan! Where else will you find such ambition? If you don't vote, and I don't vote, when will our Sixth Lady ever make it?",
        "textRu": "(hysterically) What does that Su Xinlu know? When our sister isn't performing. she's practicing every single day! Her feet are covered in blisters, yet she still tells us it's all worth it to become the Courtesan! Where else will you find such ambition? If you don't vote, and I don't vote, when will our Sixth Lady ever make it?"
      },
      {
        "role": "npc",
        "textEn": "Please tell me more",
        "textRu": "Please tell me more"
      },
      {
        "role": "npc",
        "textEn": "(excitedly listing) How could anyone say our Sixth Lady isn't worthy of being Courtesan? She starts stretching at mao hour-before sunrise! Then dances from chen hour straight through to hai hour, almost the whole day! Restaurants line up from South Gate Avenue all the way to Velvet Shade just to book her! And that so-called brother? No invitations, no work-he's been lazing at home for half a year! How is he even in the running?",
        "textRu": "(excitedly listing) How could anyone say our Sixth Lady isn't worthy of being Courtesan? She starts stretching at mao hour-before sunrise! Then dances from chen hour straight through to hai hour, almost the whole day! Restaurants line up from South Gate Avenue all the way to Velvet Shade just to book her! And that so-called brother? No invitations, no work-he's been lazing at home for half a year! How is he even in the running?"
      },
      {
        "role": "player",
        "textEn": "tell me what does Su Xinlu believe?",
        "textRu": "tell me what does Su Xinlu believe?"
      },
      {
        "role": "npc",
        "textEn": "(spitting with excitement) My Sixth Lady treats us fans like family! Every time we meet, she serves flower tea and greets us looking flawless- because she said she wants to show us her best self! Sixth Lady! I swear my loyalty to her! Meanwhile, that brother of yours? Shows up to fan meets without even washing his hair! What n kind of attitude is that? How can he compare to our Sixth Lady?",
        "textRu": "(spitting with excitement) My Sixth Lady treats us fans like family! Every time we meet, she serves flower tea and greets us looking flawless- because she said she wants to show us her best self! Sixth Lady! I swear my loyalty to her! Meanwhile, that brother of yours? Shows up to fan meets without even washing his hair! What n kind of attitude is that? How can he compare to our Sixth Lady?"
      },
      {
        "role": "npc",
        "textEn": "How dare he",
        "textRu": "How dare he"
      },
      {
        "role": "npc",
        "textEn": "(takes out a handkerchief, wiping tears) Wanderer, you don't understand! Sixth Lady came from nothing ... she fought her way up through hardship. She even admitted dancing injured her back, but she keeps pushing through! More than once, we've seen her with swollen eyes ... who knows how many times she's cried from sheer exhaustion behind the scenes?",
        "textRu": "(takes out a handkerchief, wiping tears) Wanderer, you don't understand! Sixth Lady came from nothing ... she fought her way up through hardship. She even admitted dancing injured her back, but she keeps pushing through! More than once, we've seen her with swollen eyes ... who knows how many times she's cried from sheer exhaustion behind the scenes?"
      },
      {
        "role": "npc",
        "textEn": "Then she must win this voting !!",
        "textRu": "Then she must win this voting !!"
      },
      {
        "role": "npc",
        "textEn": "(clenches fist, voice fierce) Even if I have to sell everything I own, I'll make sure Sixth Lady stands on the biggest stage! And that brother? His choreographed dances keep flopping! He's getting old-should retire gracefully instead of clinging to our Sixth Lady's spotlight!",
        "textRu": "(clenches fist, voice fierce) Even if I have to sell everything I own, I'll make sure Sixth Lady stands on the biggest stage! And that brother? His choreographed dances keep flopping! He's getting old-should retire gracefully instead of clinging to our Sixth Lady's spotlight!"
      },
      {
        "role": "npc",
        "textEn": "(Both of you became friends after relating with one another's belief that the sixth lady should be on the biggest stage)",
        "textRu": "(Both of you became friends after relating with one another's belief that the sixth lady should be on the biggest stage)"
      },
      {
        "role": "npc",
        "textEn": "(voice drops to a whisper, full of scorn) I heard from someone who saw him- he brags about working hard, but sneaks out in disguise for midnight snacks! Look at him now-he's put on weight! Does that look like someone who trains every day? He's just pretending! And now he dares to challenge our Sixth Lady? Ha! He's way out of his league! Stay away from her! Wanderer, if you truly believe in Sixth Lady, let's work together to get her the title she deserves!",
        "textRu": "(voice drops to a whisper, full of scorn) I heard from someone who saw him- he brags about working hard, but sneaks out in disguise for midnight snacks! Look at him now-he's put on weight! Does that look like someone who trains every day? He's just pretending! And now he dares to challenge our Sixth Lady? Ha! He's way out of his league! Stay away from her! Wanderer, if you truly believe in Sixth Lady, let's work together to get her the title she deserves!"
      },
      {
        "role": "npc",
        "textEn": "Then let us work together friend!",
        "textRu": "Then let us work together friend!"
      },
      {
        "role": "npc",
        "textEn": "(smiles warmly, claps hands) Agreed! Together, we'll ensure Sixth Lady wins the title of Courtesan! Spread the word, gather support-let's make this happen!",
        "textRu": "(smiles warmly, claps hands) Agreed! Together, we'll ensure Sixth Lady wins the title of Courtesan! Spread the word, gather support-let's make this happen!"
      },
      {
        "role": "npc",
        "textEn": "(both of you were able to help the Sixth Lady win the title of courtesan and became friends)",
        "textRu": "(both of you were able to help the Sixth Lady win the title of courtesan and became friends)"
      },
      {
        "role": "npc",
        "textEn": "(nods firmly, grins) It's an honor to stand by your side, friend! With our combined efforts, Sixth Lady will shine brighter than ever. Let's keep supporting her and spread the word far and wide!",
        "textRu": "(nods firmly, grins) It's an honor to stand by your side, friend! With our combined efforts, Sixth Lady will shine brighter than ever. Let's keep supporting her and spread the word far and wide!"
      },
      {
        "role": "npc",
        "textEn": "(yes we shall! and they became friends)",
        "textRu": "(yes we shall! and they became friends)"
      },
      {
        "role": "npc",
        "textEn": "(suddenly changing the subject, voice dramatic) Wanderer, the truth is-I'm a weak and powerless prince! A cruel stepmother, indifferent brothers ... When I overcome every obstacle and ascend the throne, my first imperial decree will be this: Vote for my sister! Please!Yang Chunnuan looks at you with hopeful anticipation.",
        "textRu": "(suddenly changing the subject, voice dramatic) Wanderer, the truth is-I'm a weak and powerless prince! A cruel stepmother, indifferent brothers ... When I overcome every obstacle and ascend the throne, my first imperial decree will be this: Vote for my sister! Please!Yang Chunnuan looks at you with hopeful anticipation."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "ye-zhiqiu",
    "nameEn": "Ye Zhiqiu",
    "nameRu": "Е Цзыцю",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him beside Xu Lijun on the ground floor of the Revelry Hall, on the east side of the building.",
    "icon": "👤",
    "befriendGuide": "Tell Ye Zhiqiu to Escape\nYe Zhiqiu wants his senior sister away from him, as she is keeping him on a leash. Suggest escaping by telling Ye Zhiqiu to tell her that he needs to go to the bathroom, but leave by the window while she waits outside.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(casts a quick glance at his senior sister, lips curling in irritation) I must find a way to keep my senior sister away from me today ...",
        "textRu": "(casts a quick glance at his senior sister, lips curling in irritation) I must find a way to keep my senior sister away from me today ..."
      },
      {
        "role": "npc",
        "textEn": "Sister keeping you on a leash?",
        "textRu": "Sister keeping you on a leash?"
      },
      {
        "role": "npc",
        "textEn": "(rolls his eyes, waving his fan dismissively) Precisely! She clings to me like a shadow. Any advice, Wanderer?",
        "textRu": "(rolls his eyes, waving his fan dismissively) Precisely! She clings to me like a shadow. Any advice, Wanderer?"
      },
      {
        "role": "npc",
        "textEn": "Well, have you tried reasoning with her why she needs to keep on looking at you",
        "textRu": "Well, have you tried reasoning with her why she needs to keep on looking at you"
      },
      {
        "role": "npc",
        "textEn": "(sighs heavily, fanning himself) Reasoning? She just gives me those pleading eyes. It's exhausting! What else can I do?",
        "textRu": "(sighs heavily, fanning himself) Reasoning? She just gives me those pleading eyes. It's exhausting! What else can I do?"
      },
      {
        "role": "player",
        "textEn": "tell me first what you want to do",
        "textRu": "tell me first what you want to do"
      },
      {
        "role": "npc",
        "textEn": "(taps his fan against his chin, thoughtful) I want to enjoy my time here without her constant scrutiny. Freedom, you see. Any ideas?",
        "textRu": "(taps his fan against his chin, thoughtful) I want to enjoy my time here without her constant scrutiny. Freedom, you see. Any ideas?"
      },
      {
        "role": "npc",
        "textEn": "Let me talk with your sister. (Approaches his elder sister)",
        "textRu": "Let me talk with your sister. (Approaches his elder sister)"
      },
      {
        "role": "npc",
        "textEn": "(steps back, waving his hands defensively) Oh no, you can't! She'd be suspicious. We must be subtle. Any other suggestions?",
        "textRu": "(steps back, waving his hands defensively) Oh no, you can't! She'd be suspicious. We must be subtle. Any other suggestions?"
      },
      {
        "role": "npc",
        "textEn": "Then tell her you are just going to the bathroom but leave by the window while she waits outside",
        "textRu": "Then tell her you are just going to the bathroom but leave by the window while she waits outside"
      },
      {
        "role": "npc",
        "textEn": "(grins mischievously, nodding) Clever! But I must be careful not to get caught. Thanks for the idea, Wanderer! Now, let's see if I can put it into action.",
        "textRu": "(grins mischievously, nodding) Clever! But I must be careful not to get caught. Thanks for the idea, Wanderer! Now, let's see if I can put it into action."
      },
      {
        "role": "npc",
        "textEn": "(Ye Zhiqiu was able to avoid her sister's detection and had a great time inside the heroic assembly)",
        "textRu": "(Ye Zhiqiu was able to avoid her sister's detection and had a great time inside the heroic assembly)"
      },
      {
        "role": "npc",
        "textEn": "(waves his hand frantically, eyes darting toward his senior sister) Keep your voice down! If my senior sister hears, we're both in trouble!Ye Zhiqiu gestures nervously, urging you not to tell his senior what he just shared.",
        "textRu": "(waves his hand frantically, eyes darting toward his senior sister) Keep your voice down! If my senior sister hears, we're both in trouble!Ye Zhiqiu gestures nervously, urging you not to tell his senior what he just shared."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yelu-longxian",
    "nameEn": "Yelu Longxian",
    "nameRu": "Елю Лунсянь",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Yelu Longxian is seated by a table on the third floor of Revelry Hall, рядом с eastern stairway where a long queue of people можно найти right beside him.",
    "icon": "👤",
    "befriendGuide": "Listen to His Problems\nTo befriend Yelu Longxian, simply listen to his rant about being scammed repeatedly by the Nine Mortal Ways. Toward the end of the conversation, tell him to be careful with his dealings next time.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(eyes wide with indignation) Hey! Wanderer, wait a moment... were you the one handing out red envelopes on the street yesterday? Yours truly went to grab one, and they told me I had to put money in it! I lost five hundred coins just like that!",
        "textRu": "(eyes wide with indignation) Hey! Wanderer, wait a moment... were you the one handing out red envelopes on the street yesterday? Yours truly went to grab one, and they told me I had to put money in it! I lost five hundred coins just like that!"
      },
      {
        "role": "npc",
        "textEn": "That's awful.",
        "textRu": "That's awful."
      },
      {
        "role": "npc",
        "textEn": "(yawns, waving a hand dismissively) Indeed, it is! But that's not even the worst part. Yours truly has only been in Kaifeng for a few days, and already I've been swindled more times than I can count. Your merchant guilds here—rude, ruthless, and absolutely shameless!",
        "textRu": "(yawns, waving a hand dismissively) Indeed, it is! But that's not even the worst part. Yours truly has only been in Kaifeng for a few days, and already I've been swindled more times than I can count. Your merchant guilds here—rude, ruthless, and absolutely shameless!"
      },
      {
        "role": "player",
        "textEn": "I'm not from around here either.",
        "textRu": "I'm not from around here either."
      },
      {
        "role": "npc",
        "textEn": "(leans in, lowering his voice) Well, that's lucky for you, then! Just a few days ago, I bought what I thought was flour and salt from a local guild. On the way back, my subordinate took a taste and said, “Boss, this doesn't taste right!” Turns out it was lime powder! How could it possibly taste right?",
        "textRu": "(leans in, lowering his voice) Well, that's lucky for you, then! Just a few days ago, I bought what I thought was flour and salt from a local guild. On the way back, my subordinate took a taste and said, “Boss, this doesn't taste right!” Turns out it was lime powder! How could it possibly taste right?"
      },
      {
        "role": "npc",
        "textEn": "Go on.",
        "textRu": "Go on."
      },
      {
        "role": "npc",
        "textEn": "(sighs, shaking his head) And then there are those signs on the road promising beautiful sights. I came to the Central Plains for scenery and beauties—how could I resist? But every single one led to mud pits and traps! I nearly lost my life chasing a view!",
        "textRu": "(sighs, shaking his head) And then there are those signs on the road promising beautiful sights. I came to the Central Plains for scenery and beauties—how could I resist? But every single one led to mud pits and traps! I nearly lost my life chasing a view!"
      },
      {
        "role": "npc",
        "textEn": "And then what happened next?",
        "textRu": "And then what happened next?"
      },
      {
        "role": "npc",
        "textEn": "(throws up his hands, helplessly) Another day, I met someone claiming to be Well of Heaven Elder and Elder Raging Tides. Thought they were from some famous sect, so I went to check it out. Turns out it was the Nine Mortal Ways! They made me an honorary elder, then charged me to quit! I was furious!",
        "textRu": "(throws up his hands, helplessly) Another day, I met someone claiming to be Well of Heaven Elder and Elder Raging Tides. Thought they were from some famous sect, so I went to check it out. Turns out it was the Nine Mortal Ways! They made me an honorary elder, then charged me to quit! I was furious!"
      },
      {
        "role": "npc",
        "textEn": "Maybe you shouldn't trust people so easily.",
        "textRu": "Maybe you shouldn't trust people so easily."
      },
      {
        "role": "npc",
        "textEn": "(grits his teeth, voice rising) Damn it! Just talking about the Nine Mortal Ways makes my blood boil! Last time, I saw a man begging on the street. I gave him some coins out of kindness, only to see him drinking at Revelry Hall moments later! Asked around, and guess what? It was the Nine Mortal Ways! That beggar had better taste than me!",
        "textRu": "(grits his teeth, voice rising) Damn it! Just talking about the Nine Mortal Ways makes my blood boil! Last time, I saw a man begging on the street. I gave him some coins out of kindness, only to see him drinking at Revelry Hall moments later! Asked around, and guess what? It was the Nine Mortal Ways! That beggar had better taste than me!"
      },
      {
        "role": "npc",
        "textEn": "And then what?",
        "textRu": "And then what?"
      },
      {
        "role": "npc",
        "textEn": "(stands up, pacing angrily) Isn't that enough? I later found out every single scam I fell for was their doing! That gang is everywhere! It's a new scam every day, and each one more ridiculous than the last!",
        "textRu": "(stands up, pacing angrily) Isn't that enough? I later found out every single scam I fell for was their doing! That gang is everywhere! It's a new scam every day, and each one more ridiculous than the last!"
      },
      {
        "role": "npc",
        "textEn": "Maybe you should do something about it.",
        "textRu": "Maybe you should do something about it."
      },
      {
        "role": "npc",
        "textEn": "(sits back down, rubbing his temples) What can I do? They seem to be everywhere, and no one seems to take me seriously. Maybe I'll just have to be careful from now on. But it's infuriating, I tell you!",
        "textRu": "(sits back down, rubbing his temples) What can I do? They seem to be everywhere, and no one seems to take me seriously. Maybe I'll just have to be careful from now on. But it's infuriating, I tell you!"
      },
      {
        "role": "npc",
        "textEn": "Just be more careful next time.",
        "textRu": "Just be more careful next time."
      },
      {
        "role": "npc",
        "textEn": "(clenches his fists, voice rising with fury) Damn Nine Mortal Ways! If yours truly catches them next time, they'll regret ever crossing me! Yelu Longxian takes a sip of wine and lets out a long, weary sigh.",
        "textRu": "(clenches his fists, voice rising with fury) Damn Nine Mortal Ways! If yours truly catches them next time, they'll regret ever crossing me! Yelu Longxian takes a sip of wine and lets out a long, weary sigh."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yi-xi",
    "nameEn": "Yi Xi",
    "nameRu": "И Си",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the second floor of the Revelry Hall. He can be seen dining with Guo Zhixiang.",
    "icon": "👤",
    "befriendGuide": "Ask Any Question and Praise Yi Xi's Intelligence\nYou should ask any question to Yi Xi and praise his answer. You should also praise Yi Xi's intelligence in order to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(pretending to be profound, stroking his chin) Hmm ... yes ... I think I've grasped the ultimate truth of this world! For example, your father is your dad, and your mother is your mom!",
        "textRu": "(pretending to be profound, stroking his chin) Hmm ... yes ... I think I've grasped the ultimate truth of this world! For example, your father is your dad, and your mother is your mom!"
      },
      {
        "role": "npc",
        "textEn": "Such Knowledge !! You are really are a genius",
        "textRu": "Such Knowledge !! You are really are a genius"
      },
      {
        "role": "npc",
        "textEn": "(smiling wryly, nodding sagely) Indeed, indeed. Wisdom comes with age, and the salt I've eaten might be saltier than all the rice you've eaten. Therefore, my wisdom is undoubtedly deeper.",
        "textRu": "(smiling wryly, nodding sagely) Indeed, indeed. Wisdom comes with age, and the salt I've eaten might be saltier than all the rice you've eaten. Therefore, my wisdom is undoubtedly deeper."
      },
      {
        "role": "npc",
        "textEn": "Please tell me is the earth flat or round?",
        "textRu": "Please tell me is the earth flat or round?"
      },
      {
        "role": "npc",
        "textEn": "(leaning back, eyes twinkling) Ah, the shape of the earth ... Well, if you think it's flat, then it's probably flat. But if you think it's round, then it's likely round. After all, the situation is what it is-but the specifics of the situation depend on the situation. Therefore, whatever shape you see fit to imagine for the earth is its true shape.",
        "textRu": "(leaning back, eyes twinkling) Ah, the shape of the earth ... Well, if you think it's flat, then it's probably flat. But if you think it's round, then it's likely round. After all, the situation is what it is-but the specifics of the situation depend on the situation. Therefore, whatever shape you see fit to imagine for the earth is its true shape."
      },
      {
        "role": "npc",
        "textEn": "Wow you really are intelligent",
        "textRu": "Wow you really are intelligent"
      },
      {
        "role": "npc",
        "textEn": "(waving a hand dismissively) Oh, it's nothing much. It's just that the greater your ability ... the greater your ability will be. Therefore, my intelligence is merely a reflection of my inherent greatness.",
        "textRu": "(waving a hand dismissively) Oh, it's nothing much. It's just that the greater your ability ... the greater your ability will be. Therefore, my intelligence is merely a reflection of my inherent greatness."
      },
      {
        "role": "npc",
        "textEn": "Please share more of your wisdom",
        "textRu": "Please share more of your wisdom"
      },
      {
        "role": "npc",
        "textEn": "(nodding solemnly, eyes closed) Wisdom, you say? Well, let me put it this way: the more you know, the more you realize how much you don't know. Therefore, the pursuit of wisdom is endless. So, if you seek more wisdom, keep seeking! Because of this endless pursuit, therefore your quest for wisdom will never truly end.",
        "textRu": "(nodding solemnly, eyes closed) Wisdom, you say? Well, let me put it this way: the more you know, the more you realize how much you don't know. Therefore, the pursuit of wisdom is endless. So, if you seek more wisdom, keep seeking! Because of this endless pursuit, therefore your quest for wisdom will never truly end."
      },
      {
        "role": "player",
        "textEn": "(You and Yi Xi became friends)",
        "textRu": "(You and Yi Xi became friends)"
      },
      {
        "role": "npc",
        "textEn": "(revealing a warm smile, eyes gentle) Wanderer, becoming friends ... it's a mutual feeling. If you feel we are friends, then we are friends. But if you don't, then we aren't. Therefore, our friendship depends entirely on how you see it. So, if you think we're friends ... then we're friends!",
        "textRu": "(revealing a warm smile, eyes gentle) Wanderer, becoming friends ... it's a mutual feeling. If you feel we are friends, then we are friends. But if you don't, then we aren't. Therefore, our friendship depends entirely on how you see it. So, if you think we're friends ... then we're friends!"
      },
      {
        "role": "npc",
        "textEn": "No one is as intelligent as you Yi Xi",
        "textRu": "No one is as intelligent as you Yi Xi"
      },
      {
        "role": "npc",
        "textEn": "(bowing slightly, smiling modestly) Ah, flattery will get you nowhere, but thank you nonetheless. The truth is, everyone has their own unique wisdom. Therefore, while I may seem intelligent to you, others might find different sources of wisdom. So, if intelligence is what you value ... then it's valuable indeed!",
        "textRu": "(bowing slightly, smiling modestly) Ah, flattery will get you nowhere, but thank you nonetheless. The truth is, everyone has their own unique wisdom. Therefore, while I may seem intelligent to you, others might find different sources of wisdom. So, if intelligence is what you value ... then it's valuable indeed!"
      },
      {
        "role": "npc",
        "textEn": "Thank you Yi Xi",
        "textRu": "Thank you Yi Xi"
      },
      {
        "role": "npc",
        "textEn": "(laughs heartily, clapping his hands) Ah! You young people are so young!Yi Xi walks away with a cheerful smile.",
        "textRu": "(laughs heartily, clapping his hands) Ah! You young people are so young!Yi Xi walks away with a cheerful smile."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yu-hui",
    "nameEn": "Yu Hui",
    "nameRu": "Юй Хуэй",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him у far end of the street, западнее the Бархатная тень Landmark.",
    "icon": "👤",
    "befriendGuide": "Ask for Help Regarding Your Communication\nBefriending Yu Hui is easy, as you only need to ask for his help to polish up your communication. Just keep asking for tips on how to improve your communication until he finally befriends you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(instructing a bystander, voice firm and formal) What? In our profession, if your back aches from queuing, don't just say \"my back hurts.\" You should say: \"The current pain point is concentrated in the lumbar region, with pronounced physical feedback. Risk identification is urgently needed.\" (turns to you, expression serious) Wanderer, do you require assistance refining your phrasing? Perhaps something like: \"I'm resigning from this position\"?",
        "textRu": "(instructing a bystander, voice firm and formal) What? In our profession, if your back aches from queuing, don't just say \"my back hurts.\" You should say: \"The current pain point is concentrated in the lumbar region, with pronounced physical feedback. Risk identification is urgently needed.\" (turns to you, expression serious) Wanderer, do you require assistance refining your phrasing? Perhaps something like: \"I'm resigning from this position\"?"
      },
      {
        "role": "npc",
        "textEn": "You please help me good sir",
        "textRu": "You please help me good sir"
      },
      {
        "role": "npc",
        "textEn": "(clears throat, voice measured and composed) Of course, Wanderer. To articulate your request in a more refined manner, you might say: \"I seek your support to optimize my current situation.\" (nods firmly) What specific area requires my attention?",
        "textRu": "(clears throat, voice measured and composed) Of course, Wanderer. To articulate your request in a more refined manner, you might say: \"I seek your support to optimize my current situation.\" (nods firmly) What specific area requires my attention?"
      },
      {
        "role": "player",
        "textEn": "I seek in your assistance in your knowledge in the way of communication",
        "textRu": "I seek in your assistance in your knowledge in the way of communication"
      },
      {
        "role": "npc",
        "textEn": "(nods gravely, voice steady and formal) Indeed, effective communication is essential. To convey your thoughts clearly, you might begin by defining the objective of your interaction. For instance: \"My goal is to establish a robust channel of communication to ensure mutual understanding and efficiency. \"Would you like guidance on any particular aspect of communication, such as clarity, persuasion, or rapport-building?",
        "textRu": "(nods gravely, voice steady and formal) Indeed, effective communication is essential. To convey your thoughts clearly, you might begin by defining the objective of your interaction. For instance: \"My goal is to establish a robust channel of communication to ensure mutual understanding and efficiency. \"Would you like guidance on any particular aspect of communication, such as clarity, persuasion, or rapport-building?"
      },
      {
        "role": "npc",
        "textEn": "(He taught me different techniques of getting better with my communication)",
        "textRu": "(He taught me different techniques of getting better with my communication)"
      },
      {
        "role": "npc",
        "textEn": "(clears throat, voice patient and deliberate) Indeed, mastering various techniques can significantly enhance your communication skills. To improve clarity, you might practice structuring your messages logically: \"First, I will outline the main points; second, I will provide supporting details; finally, I will summarize the key takeaways.",
        "textRu": "(clears throat, voice patient and deliberate) Indeed, mastering various techniques can significantly enhance your communication skills. To improve clarity, you might practice structuring your messages logically: \"First, I will outline the main points; second, I will provide supporting details; finally, I will summarize the key takeaways."
      },
      {
        "role": "npc",
        "textEn": "Thank you I will use it in my travels",
        "textRu": "Thank you I will use it in my travels"
      },
      {
        "role": "npc",
        "textEn": "(bows slightly, voice respectful and composed) May your travels be fruitful, Wanderer. Should you find yourself in need of further guidance or support, remember that clear and structured communication will serve you well. (pauses, then adds) If you have any other questions or areas where my expertise may assist you, feel free to inquire. Safe journey.",
        "textRu": "(bows slightly, voice respectful and composed) May your travels be fruitful, Wanderer. Should you find yourself in need of further guidance or support, remember that clear and structured communication will serve you well. (pauses, then adds) If you have any other questions or areas where my expertise may assist you, feel free to inquire. Safe journey."
      },
      {
        "role": "npc",
        "textEn": "(They both became good friends)",
        "textRu": "(They both became good friends)"
      },
      {
        "role": "npc",
        "textEn": "(clears throat, expression sincere yet formal) It is a pleasure to see our interaction yield such positive results, Wanderer. If you ever find yourself in Velvet Shade again, do not hesitate to seek me out. May our paths cross again under favorable circumstances. (bows slightly) Until then, fare well and travel safely",
        "textRu": "(clears throat, expression sincere yet formal) It is a pleasure to see our interaction yield such positive results, Wanderer. If you ever find yourself in Velvet Shade again, do not hesitate to seek me out. May our paths cross again under favorable circumstances. (bows slightly) Until then, fare well and travel safely"
      },
      {
        "role": "npc",
        "textEn": "(Yu Hui became happy he made a friend)",
        "textRu": "(Yu Hui became happy he made a friend)"
      },
      {
        "role": "npc",
        "textEn": "(nods, a rare smile crossing his face) Indeed, it is heartening to forge connections. I am glad to have been of service, Wanderer. May your journey be smooth and your endeavors successful. (returns to his usual solemn demeanor) If you need anything in the future, know that I will be here. Farewell for now.",
        "textRu": "(nods, a rare smile crossing his face) Indeed, it is heartening to forge connections. I am glad to have been of service, Wanderer. May your journey be smooth and your endeavors successful. (returns to his usual solemn demeanor) If you need anything in the future, know that I will be here. Farewell for now."
      },
      {
        "role": "npc",
        "textEn": "(Yu hui became an expert in the field of communication)",
        "textRu": "(Yu hui became an expert in the field of communication)"
      },
      {
        "role": "npc",
        "textEn": "(clears throat, voice steady) That concludes today's stand-up exchange. Let us part ways for now and reconvene when alignment is optimal.Wait ... why does it suddenly feel like you're back at work?",
        "textRu": "(clears throat, voice steady) That concludes today's stand-up exchange. Let us part ways for now and reconvene when alignment is optimal.Wait ... why does it suddenly feel like you're back at work?"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yu-nu",
    "nameEn": "Yu Nu",
    "nameRu": "Юй Ню",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти her in the red building looking у ocean.",
    "icon": "👤",
    "befriendGuide": "Listen to Yu Nu's Story About Her Sister\nYu Nu will tell you about how she might not be able to see her sister perform on the annual star selection as she lacks the money to go there. It doesn't matter if you roleplay of giving her money or not, as she will just keep talking about her situation and her sister.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(holding a small portrait, voice soft and wistful) Sister ... my heart aches for all you've endured. If only I could ease your pain myself~ (wipes away a tear) Wanderer, I'm sorry to trouble you.",
        "textRu": "(holding a small portrait, voice soft and wistful) Sister ... my heart aches for all you've endured. If only I could ease your pain myself~ (wipes away a tear) Wanderer, I'm sorry to trouble you."
      },
      {
        "role": "npc",
        "textEn": "Please tell me whats bothering you, traveler?",
        "textRu": "Please tell me whats bothering you, traveler?"
      },
      {
        "role": "npc",
        "textEn": "(on the verge of tears, voice trembling) My favorite \"star\" is heading to Weiyang City for the annual star selection. They say if Sanniang doesn't make it into the top three, she might retire for good. If I miss this chance ... I might never see her perform again.",
        "textRu": "(on the verge of tears, voice trembling) My favorite \"star\" is heading to Weiyang City for the annual star selection. They say if Sanniang doesn't make it into the top three, she might retire for good. If I miss this chance ... I might never see her perform again."
      },
      {
        "role": "npc",
        "textEn": "Then go, board the ship and meet see her performance !! Do you need help in doing such thing?",
        "textRu": "Then go, board the ship and meet see her performance !! Do you need help in doing such thing?"
      },
      {
        "role": "npc",
        "textEn": "(tears streaming down, voice cracking with emotion) I ... I've spent all my silver. The moment I get my monthly allowance, I just lose control-buying votes for Sanniang, tickets to her tea parties, tipping at her shows ... I can never get enough. It's like I'm bewitched.",
        "textRu": "(tears streaming down, voice cracking with emotion) I ... I've spent all my silver. The moment I get my monthly allowance, I just lose control-buying votes for Sanniang, tickets to her tea parties, tipping at her shows ... I can never get enough. It's like I'm bewitched."
      },
      {
        "role": "npc",
        "textEn": "Then assess the situation. What do you want to prioritize more? Your shopaholic tendencies or seeing the performance of your sister",
        "textRu": "Then assess the situation. What do you want to prioritize more? Your shopaholic tendencies or seeing the performance of your sister"
      },
      {
        "role": "npc",
        "textEn": "(gently touching the faded hem of her worn skirt, eyes lowered) I know it's not ideal. That's why I'm so frugal with food and clothes. If my clothes tear, I just patch them up and keep wearing them. As long as the food fills my belly, it's enough. I save where I can, so I can spend where it matters. Supporting her is worth everything.",
        "textRu": "(gently touching the faded hem of her worn skirt, eyes lowered) I know it's not ideal. That's why I'm so frugal with food and clothes. If my clothes tear, I just patch them up and keep wearing them. As long as the food fills my belly, it's enough. I save where I can, so I can spend where it matters. Supporting her is worth everything."
      },
      {
        "role": "npc",
        "textEn": "Seeing that you really are doing everything in your capabilities in saving up, just to go see your sister has really moved me ... here take it .. its yours! (Gives coins that is enough for a ticket and a new life)",
        "textRu": "Seeing that you really are doing everything in your capabilities in saving up, just to go see your sister has really moved me ... here take it .. its yours! (Gives coins that is enough for a ticket and a new life)"
      },
      {
        "role": "npc",
        "textEn": "(gaze softens, voice quiet but full of feeling) Maybe Wanderer won't understand how I feel. Every time I see her---her costume, her singing, the moment she steps on stage-it's like l' m pulled into the story. I feel every joy and sorrow as if they were my own.",
        "textRu": "(gaze softens, voice quiet but full of feeling) Maybe Wanderer won't understand how I feel. Every time I see her---her costume, her singing, the moment she steps on stage-it's like l' m pulled into the story. I feel every joy and sorrow as if they were my own."
      },
      {
        "role": "npc",
        "textEn": "Then go! Use the coins I gave you and meet her at last !!",
        "textRu": "Then go! Use the coins I gave you and meet her at last !!"
      },
      {
        "role": "npc",
        "textEn": "(with a gentle smile, eyes shining) To me, in this chaotic world, she's like a constant star. Her theater is my safe haven. No matter how tired or unhappy I am, her performance makes everything better.",
        "textRu": "(with a gentle smile, eyes shining) To me, in this chaotic world, she's like a constant star. Her theater is my safe haven. No matter how tired or unhappy I am, her performance makes everything better."
      },
      {
        "role": "npc",
        "textEn": "(Yu Nu went to see her sister)",
        "textRu": "(Yu Nu went to see her sister)"
      },
      {
        "role": "npc",
        "textEn": "(looking into the distance, eyes filled with bliss) Heaven and earth may come to an end ... but this love will last forever.Yu Nu expresses gratitude and begins to ponder deeply.",
        "textRu": "(looking into the distance, eyes filled with bliss) Heaven and earth may come to an end ... but this love will last forever.Yu Nu expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yu-songfeng",
    "nameEn": "Yu Songfeng",
    "nameRu": "Юй Сунфэн",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти him with his beloved Li Yueniang рядом с ferry station entrance.",
    "icon": "👤",
    "befriendGuide": "Give 5000 Zhou\nAsk Yu Songfeng about how he got a comfortable life with Li Yueniang and he will ask you to give 5000 Zhou first before he tells you. Roleplay giving him 5000 Zhou in order to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(seriously) Even in my youth, I understood the sweet art of living the easy life, gladly trading my prime for comfort. Wanderer, wouldn't you like to learn this secret from me?",
        "textRu": "(seriously) Even in my youth, I understood the sweet art of living the easy life, gladly trading my prime for comfort. Wanderer, wouldn't you like to learn this secret from me?"
      },
      {
        "role": "npc",
        "textEn": "Please! I want to know whats the secret of a good relationship",
        "textRu": "Please! I want to know whats the secret of a good relationship"
      },
      {
        "role": "npc",
        "textEn": "(smiling slyly) Ah, relationships, you say? Well, the key lies in understanding and mastering the art of giving and receiving. But truly, it's about finding that perfect balance of ease and harmony. For 5000 Zhou coins, I'll teach you the Soft Life Secrets that will make your life smoother than silk. How about it?",
        "textRu": "(smiling slyly) Ah, relationships, you say? Well, the key lies in understanding and mastering the art of giving and receiving. But truly, it's about finding that perfect balance of ease and harmony. For 5000 Zhou coins, I'll teach you the Soft Life Secrets that will make your life smoother than silk. How about it?"
      },
      {
        "role": "npc",
        "textEn": "How about how you got the arrangement with your beloved?",
        "textRu": "How about how you got the arrangement with your beloved?"
      },
      {
        "role": "npc",
        "textEn": "(chuckles softly) My dear Yueniang and I have found our own way of living together. It's all about mutual respect and understanding. But if you wish to learn the secrets that make life easier, then 5000 Zhou coins will buy you this invaluable knowledge.",
        "textRu": "(chuckles softly) My dear Yueniang and I have found our own way of living together. It's all about mutual respect and understanding. But if you wish to learn the secrets that make life easier, then 5000 Zhou coins will buy you this invaluable knowledge."
      },
      {
        "role": "player",
        "textEn": "you gave 5000 zhou",
        "textRu": "you gave 5000 zhou"
      },
      {
        "role": "npc",
        "textEn": "(gives a thumbs up) Wanderer, you're so straightforward!Yu Songfeng is willing to teach you-but he asks for a small fee.",
        "textRu": "(gives a thumbs up) Wanderer, you're so straightforward!Yu Songfeng is willing to teach you-but he asks for a small fee."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yuan-sheng",
    "nameEn": "Yuan Sheng",
    "nameRu": "Юань Шэн",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Блаженное прибежище",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Yuan Sheng is found outside the house where Ye Buxiu's chess game находится. It lies западнее the path leading through Flower Expanse.",
    "icon": "👤",
    "befriendGuide": "Upset Him by Taking His Wine-scented Jade\nTo befriend Yuan Sheng, you need to upset him to snap him out of his arrogant behavior. He appears to respond to being grabbed (via action prompts) in the chat, and from there you can roleplay scolding him by taking away his Wine-scented Jade. The chat is successful when Yuan Sheng becomes upset with you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(arrogantly, with hands on hips) Listen up! Once I sell my precious Wine-scented Jade and become rich, you'll be polishing my shoes! Better start sucking up to me now!",
        "textRu": "(arrogantly, with hands on hips) Listen up! Once I sell my precious Wine-scented Jade and become rich, you'll be polishing my shoes! Better start sucking up to me now!"
      },
      {
        "role": "npc",
        "textEn": "(grab him)",
        "textRu": "(grab him)"
      },
      {
        "role": "npc",
        "textEn": "(trying to wriggle free) Hey, let go! What are you doing? Can't you see I'm a big boss now? Let me go!",
        "textRu": "(trying to wriggle free) Hey, let go! What are you doing? Can't you see I'm a big boss now? Let me go!"
      },
      {
        "role": "npc",
        "textEn": "Do something better with your time.",
        "textRu": "Do something better with your time."
      },
      {
        "role": "npc",
        "textEn": "(eyes narrowing, voice defensive) I'm not wasting my time! This Wine-scented Jade is my ticket to riches! You just don't understand!",
        "textRu": "(eyes narrowing, voice defensive) I'm not wasting my time! This Wine-scented Jade is my ticket to riches! You just don't understand!"
      },
      {
        "role": "npc",
        "textEn": "Give it to me.",
        "textRu": "Give it to me."
      },
      {
        "role": "npc",
        "textEn": "(hands on hips, pouting) Even the teachers never taught this, how would I know? Note: Whenever Yuan Sheng says this in the chat, this is your sign to come up with another response until Yuan Sheng finally reacts to your message.",
        "textRu": "(hands on hips, pouting) Even the teachers never taught this, how would I know? Note: Whenever Yuan Sheng says this in the chat, this is your sign to come up with another response until Yuan Sheng finally reacts to your message."
      },
      {
        "role": "npc",
        "textEn": "Study well first before getting rich.",
        "textRu": "Study well first before getting rich."
      },
      {
        "role": "npc",
        "textEn": "(pouting) I already know how to get rich! I just need to sell this jade. Studying is for old folks!",
        "textRu": "(pouting) I already know how to get rich! I just need to sell this jade. Studying is for old folks!"
      },
      {
        "role": "npc",
        "textEn": "Give me the jade.",
        "textRu": "Give me the jade."
      },
      {
        "role": "npc",
        "textEn": "(hisses, smugly) No way! That Jade is mine! You won't get it from me, no matter what you do!",
        "textRu": "(hisses, smugly) No way! That Jade is mine! You won't get it from me, no matter what you do!"
      },
      {
        "role": "npc",
        "textEn": "I'll steal it if you don't give it.",
        "textRu": "I'll steal it if you don't give it."
      },
      {
        "role": "npc",
        "textEn": "(eyes widening, voice cracking) You wouldn't dare! It's on the table, but you can't have it! It's mine! Mine!",
        "textRu": "(eyes widening, voice cracking) You wouldn't dare! It's on the table, but you can't have it! It's mine! Mine!"
      },
      {
        "role": "npc",
        "textEn": "(I take the jade from the table)",
        "textRu": "(I take the jade from the table)"
      },
      {
        "role": "npc",
        "textEn": "(crying loudly, voice cracking with emotion) You're mean! So mean! What kind of hero steals from kids?! Boohoohoo! Don't go! G-give me back my treasure! Yuan Sheng scolds the young master in frustration and storms off in search of treasure.",
        "textRu": "(crying loudly, voice cracking with emotion) You're mean! So mean! What kind of hero steals from kids?! Boohoohoo! Don't go! G-give me back my treasure! Yuan Sheng scolds the young master in frustration and storms off in search of treasure."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "yueniang",
    "nameEn": "Yueniang",
    "nameRu": "Юэнян",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "She can be seen cleaning her laundry by the river.",
    "icon": "👤",
    "befriendGuide": "Give Encouragement to Yueniang\nConvince Yueniang to send her husband a letter by giving her encouragement that any letter from her will be appreciated. Tell her that you will also deliver the letter to the husband which will cause her AI to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(bowing her head, tidying up the house, voice soft and worried) Sigh ... my husband is away with the army. I miss him so much, but ... I don't know if I should write him a letter ...",
        "textRu": "(bowing her head, tidying up the house, voice soft and worried) Sigh ... my husband is away with the army. I miss him so much, but ... I don't know if I should write him a letter ..."
      },
      {
        "role": "npc",
        "textEn": "Hello friend, you seem a bit troubled. What is wrong?",
        "textRu": "Hello friend, you seem a bit troubled. What is wrong?"
      },
      {
        "role": "npc",
        "textEn": "(looking up, eyes filled with worry) Oh, Young Master. Thank you for asking. I am just very concerned about my husband who is serving in the army. I want to write him a letter, but I feel so unsure ...",
        "textRu": "(looking up, eyes filled with worry) Oh, Young Master. Thank you for asking. I am just very concerned about my husband who is serving in the army. I want to write him a letter, but I feel so unsure ..."
      },
      {
        "role": "player",
        "textEn": "(you gave her some encouraging words which helped her confidence a little bit)",
        "textRu": "(you gave her some encouraging words which helped her confidence a little bit)"
      },
      {
        "role": "npc",
        "textEn": "(smiling faintly, a glimmer of hope in her eyes) Young Master, your words give me some comfort. But ... I still fear that my message might not reach him.",
        "textRu": "(smiling faintly, a glimmer of hope in her eyes) Young Master, your words give me some comfort. But ... I still fear that my message might not reach him."
      },
      {
        "role": "player",
        "textEn": "(You explained that her husband would love any letter coming from her)",
        "textRu": "(You explained that her husband would love any letter coming from her)"
      },
      {
        "role": "npc",
        "textEn": "(trembling, but determined) Yes, I believe my husband would cherish any news from me. But ... I worry about the dangers of war and the uncertainty of delivery.",
        "textRu": "(trembling, but determined) Yes, I believe my husband would cherish any news from me. But ... I worry about the dangers of war and the uncertainty of delivery."
      },
      {
        "role": "player",
        "textEn": "(You told her that you are willing to go give it to him yourself as long as she writes the letter.)",
        "textRu": "(You told her that you are willing to go give it to him yourself as long as she writes the letter.)"
      },
      {
        "role": "npc",
        "textEn": "(nods slightly, her eyes softening with relief) Thank you, Young Master. I ... I will find a way to send my thoughts to my husband and let him know how much I care.Yueniang reflects on your words and bows in gratitude.",
        "textRu": "(nods slightly, her eyes softening with relief) Thank you, Young Master. I ... I will find a way to send my thoughts to my husband and let him know how much I care.Yueniang reflects on your words and bows in gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhang-dazhuang",
    "nameEn": "Zhang Dazhuang",
    "nameRu": "Чжан Дачжуан",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Can be seen in front of the Fire-forced brewing",
    "icon": "👤",
    "befriendGuide": "Recommend Spending Time with His Family\nBefriend Zhang Dazhuang by mentioning that he needs to spend more time with his family and that if he overworks himself, he might not live long to see his family grow.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(wiping sweat from his brow while working) Young Master, if I don't work, I feel uneasy all over. But my family keeps worrying I'll wear myself out. What should I do?",
        "textRu": "(wiping sweat from his brow while working) Young Master, if I don't work, I feel uneasy all over. But my family keeps worrying I'll wear myself out. What should I do?"
      },
      {
        "role": "player",
        "textEn": "(You explained that even though he is working for his family, if he overworked himself he wouldn't live long enough to see them grow up.)",
        "textRu": "(You explained that even though he is working for his family, if he overworked himself he wouldn't live long enough to see them grow up.)"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully, eyes narrowing slightly) That's true, Young Master. A strong body is indeed the foundation for everything. If I push myself too hard, I might not be around to see my family thrive. Perhaps I should listen to their concerns and find a balance.",
        "textRu": "(nodding thoughtfully, eyes narrowing slightly) That's true, Young Master. A strong body is indeed the foundation for everything. If I push myself too hard, I might not be around to see my family thrive. Perhaps I should listen to their concerns and find a balance."
      },
      {
        "role": "player",
        "textEn": "(You gave a recommendation of spending time with his family when he gets home, and only think about work the next day)",
        "textRu": "(You gave a recommendation of spending time with his family when he gets home, and only think about work the next day)"
      },
      {
        "role": "npc",
        "textEn": "(scratching his chin, considering) Spending time with my family when I get home ... that sounds reasonable. It might help ease their worries and make me feel more settled. I'll try it, Young Master.",
        "textRu": "(scratching his chin, considering) Spending time with my family when I get home ... that sounds reasonable. It might help ease their worries and make me feel more settled. I'll try it, Young Master."
      },
      {
        "role": "npc",
        "textEn": "(After a month, he was able to fully adapt to a healthier work and life balance)",
        "textRu": "(After a month, he was able to fully adapt to a healthier work and life balance)"
      },
      {
        "role": "npc",
        "textEn": "(eyes brightening as if struck by insight) Young Master, you speak reason! I'll surely think over your suggestion carefully.Zhang Dazhuang reflects on your words and bows in gratitude.",
        "textRu": "(eyes brightening as if struck by insight) Young Master, you speak reason! I'll surely think over your suggestion carefully.Zhang Dazhuang reflects on your words and bows in gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhang-jiushu",
    "nameEn": "Zhang Jiushu",
    "nameRu": "Чжан Цзюшу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Zhang Jiushu is lying on the floor inside a house восточнее the West Небесный причал Boundary Stone.",
    "icon": "👤",
    "befriendGuide": "Find and Give Him His Plummet\nTo befriend Zhang Jiushu, all you have to do is roleplay finding his lead plummet and give it to him. It is possible to parenthesize the action (like in the example below) to immediately befriend him without holding a conversation.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(frowning deeply and letting out a heavy sigh) Alas... that lead plummet is nowhere to be found. This is truly troubling...",
        "textRu": "(frowning deeply and letting out a heavy sigh) Alas... that lead plummet is nowhere to be found. This is truly troubling..."
      },
      {
        "role": "npc",
        "textEn": "(I find and give him the plummet)",
        "textRu": "(I find and give him the plummet)"
      },
      {
        "role": "npc",
        "textEn": "(nodding, a hint of relief in his voice) Thank you, Wanderer. You've done more than I expected. (leaning closer, whispering) To tell you the truth... inside the lead plummet, there's a piece of gold. It's precious... Uncle Zhangjiu expresses gratitude and begins to ponder carefully.",
        "textRu": "(nodding, a hint of relief in his voice) Thank you, Wanderer. You've done more than I expected. (leaning closer, whispering) To tell you the truth... inside the lead plummet, there's a piece of gold. It's precious... Uncle Zhangjiu expresses gratitude and begins to ponder carefully."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhang-shuazi",
    "nameEn": "Zhang Shuazi",
    "nameRu": "Чжан Шуацзы",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "База Девяти смертных путей",
    "subregion": "Кайфэн",
    "locationDetail": "Zhang Shuazi is standing in front of a mask stall in front of the entrance к street with the large coin sign.",
    "icon": "👤",
    "befriendGuide": "Play Three Rounds of a Dice Game with Him\nTo befriend Zhang Shuazi, all you have to do is go along with his chat-based game of dice. It does not matter if you win or lose. After the third dice game, you will successfully befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(picks up the dice cup, covers the dice, winks at you) Guess big or small—heaven decides it all. If you don't guess, how can heaven arrange? So, Wanderer, how about a few rounds with me?",
        "textRu": "(picks up the dice cup, covers the dice, winks at you) Guess big or small—heaven decides it all. If you don't guess, how can heaven arrange? So, Wanderer, how about a few rounds with me?"
      },
      {
        "role": "npc",
        "textEn": "Okay, sure.",
        "textRu": "Okay, sure."
      },
      {
        "role": "npc",
        "textEn": "(grinning) I roll the dice, Wanderer guesses big or small. One, two, three points are small; four, five, six are big. If Wanderer guesses right, I, Zhang Shuazi, pay ten times your bet. Otherwise... hehe, this bet money stays with me~",
        "textRu": "(grinning) I roll the dice, Wanderer guesses big or small. One, two, three points are small; four, five, six are big. If Wanderer guesses right, I, Zhang Shuazi, pay ten times your bet. Otherwise... hehe, this bet money stays with me~"
      },
      {
        "role": "npc",
        "textEn": "Understood.",
        "textRu": "Understood."
      },
      {
        "role": "npc",
        "textEn": "(leans in, lowering his voice) For this first round, I'll treat it as making friends with Wanderer. Six coins—on me. No need to spend a single coin, just enjoy the game! Ready?",
        "textRu": "(leans in, lowering his voice) For this first round, I'll treat it as making friends with Wanderer. Six coins—on me. No need to spend a single coin, just enjoy the game! Ready?"
      },
      {
        "role": "npc",
        "textEn": "Ready.",
        "textRu": "Ready."
      },
      {
        "role": "npc",
        "textEn": "(excitedly tosses the dice cup) Underworld rules: once the bet's down, hands off. No changing your mind halfway. So tell me, Wanderer—will you bet big or small?",
        "textRu": "(excitedly tosses the dice cup) Underworld rules: once the bet's down, hands off. No changing your mind halfway. So tell me, Wanderer—will you bet big or small?"
      },
      {
        "role": "npc",
        "textEn": "Small.",
        "textRu": "Small."
      },
      {
        "role": "npc",
        "textEn": "(the dice shows three dots) (eyes light up with excitement) Oh wow, first try and you nailed it! Tsk... Wanderer, seems the gambling god favors you today! You can't waste this luck—play a few more rounds! (picks up the dice cup again, covering the dice) How about it, Wanderer? Another round? Let's raise the stakes a little—66 coins. Same old rule: once the bet's down, hands off~ Note: You will be prompted to give Zhang Shuazi 66 coins. Submit the coins to resume the chat.",
        "textRu": "(the dice shows three dots) (eyes light up with excitement) Oh wow, first try and you nailed it! Tsk... Wanderer, seems the gambling god favors you today! You can't waste this luck—play a few more rounds! (picks up the dice cup again, covering the dice) How about it, Wanderer? Another round? Let's raise the stakes a little—66 coins. Same old rule: once the bet's down, hands off~ Note: You will be prompted to give Zhang Shuazi 66 coins. Submit the coins to resume the chat."
      },
      {
        "role": "npc",
        "textEn": "(shakes the dice cup hard, crisp rattling sounds echo) Big or small? This second round—has Wanderer made up your mind?",
        "textRu": "(shakes the dice cup hard, crisp rattling sounds echo) Big or small? This second round—has Wanderer made up your mind?"
      },
      {
        "role": "npc",
        "textEn": "Big.",
        "textRu": "Big."
      },
      {
        "role": "npc",
        "textEn": "(the dice shows three dots) (waves hand quickly) Eh, just an accident! Don't panic, Wanderer—I, Zhang Shuazi, have seen plenty of this. Next round, you'll definitely win! What do you say? Shall we go again? Let's make it exciting—666 coins, all in one throw! Same rule: once the bet's down, hands off~ Note: Give Zhang Shuazi 666 coins to continue.",
        "textRu": "(the dice shows three dots) (waves hand quickly) Eh, just an accident! Don't panic, Wanderer—I, Zhang Shuazi, have seen plenty of this. Next round, you'll definitely win! What do you say? Shall we go again? Let's make it exciting—666 coins, all in one throw! Same rule: once the bet's down, hands off~ Note: Give Zhang Shuazi 666 coins to continue."
      },
      {
        "role": "npc",
        "textEn": "(slowly rotates the dice cup, voice full of suspense) Here it comes, here it comes~ This last round is the highlight. Win or lose, it all hangs on this throw. Big or small? Wanderer, think carefully before you decide!",
        "textRu": "(slowly rotates the dice cup, voice full of suspense) Here it comes, here it comes~ This last round is the highlight. Win or lose, it all hangs on this throw. Big or small? Wanderer, think carefully before you decide!"
      },
      {
        "role": "npc",
        "textEn": "Big.",
        "textRu": "Big."
      },
      {
        "role": "npc",
        "textEn": "(the dice shows one dot) (half-smiling, voice calm) When bad luck ends, good luck begins. You only lost a little, Wanderer—think on the bright side. If you tossed this into a gambling den, you wouldn't even hear a sound! That's why I say you're smart—better to pay tuition here than feed those wolves in the den, right? Zhang Shuazi wipes his dice cup clean, and his booming call once again echoes over the base...",
        "textRu": "(the dice shows one dot) (half-smiling, voice calm) When bad luck ends, good luck begins. You only lost a little, Wanderer—think on the bright side. If you tossed this into a gambling den, you wouldn't even hear a sound! That's why I say you're smart—better to pay tuition here than feed those wolves in the den, right? Zhang Shuazi wipes his dice cup clean, and his booming call once again echoes over the base..."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhang-the-diviner",
    "nameEn": "Zhang the Diviner",
    "nameRu": "Чжан Гадатель",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Дворец летописей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "She можно найти by heading south от Back Mountain landmark, at a camp where she is with Boss Qian.",
    "icon": "🔮",
    "befriendGuide": "Play Along with the Fortune Telling and Help Spread Her Name\nTo befriend Zhang the Diviner, play along with the fortune telling and answer her truthfully. After that, offer to help spread her name around the town to make her grateful to you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(glancing around cautiously, voice smooth) Wanderer, do you have troubles you'd like me to divine?",
        "textRu": "(glancing around cautiously, voice smooth) Wanderer, do you have troubles you'd like me to divine?"
      },
      {
        "role": "player",
        "textEn": "sure please tell me about my future",
        "textRu": "sure please tell me about my future"
      },
      {
        "role": "npc",
        "textEn": "(nodding thoughtfully, eyes focused) Very well. Extend your hand, let us see what the lines hold for you.",
        "textRu": "(nodding thoughtfully, eyes focused) Very well. Extend your hand, let us see what the lines hold for you."
      },
      {
        "role": "npc",
        "textEn": "(extends hands)",
        "textRu": "(extends hands)"
      },
      {
        "role": "npc",
        "textEn": "(taking your hand gently, brow furrowed in concentration) Ah, I see ... paths diverging ahead. You stand at a crossroads, Wanderer. One road leads to prosperity, the other to trials. Which will you choose?",
        "textRu": "(taking your hand gently, brow furrowed in concentration) Ah, I see ... paths diverging ahead. You stand at a crossroads, Wanderer. One road leads to prosperity, the other to trials. Which will you choose?"
      },
      {
        "role": "npc",
        "textEn": "(prosperity)",
        "textRu": "(prosperity)"
      },
      {
        "role": "npc",
        "textEn": "(smiling reassuringly) Then focus your mind on that path. The stars favor those who pursue their destiny with resolve. What brings you to Moonveil Mountain, Wanderer?",
        "textRu": "(smiling reassuringly) Then focus your mind on that path. The stars favor those who pursue their destiny with resolve. What brings you to Moonveil Mountain, Wanderer?"
      },
      {
        "role": "player",
        "textEn": "to see the beauty of the subregion",
        "textRu": "to see the beauty of the subregion"
      },
      {
        "role": "npc",
        "textEn": "(nods appreciatively) A noble purpose indeed. The mountains hold many secrets and wonders. Have you encountered any peculiar events on your journey?",
        "textRu": "(nods appreciatively) A noble purpose indeed. The mountains hold many secrets and wonders. Have you encountered any peculiar events on your journey?"
      },
      {
        "role": "player",
        "textEn": "a purpose to see the beauty of the region",
        "textRu": "a purpose to see the beauty of the region"
      },
      {
        "role": "npc",
        "textEn": "(smiling warmly) Beauty often reveals itself to those who seek it with pure intentions. Perhaps the mist is a veil that protects the true essence of Moonveil Mountain. Tell me, have you noticed any unusual patterns or symbols during your travels?",
        "textRu": "(smiling warmly) Beauty often reveals itself to those who seek it with pure intentions. Perhaps the mist is a veil that protects the true essence of Moonveil Mountain. Tell me, have you noticed any unusual patterns or symbols during your travels?"
      },
      {
        "role": "player",
        "textEn": "I see yellow flies that fly around",
        "textRu": "I see yellow flies that fly around"
      },
      {
        "role": "npc",
        "textEn": "(frowning thoughtfully) Yellow flies, hmm? They often signify change and transformation. It could be a message that your journey will bring significant shifts in your life. Are there any particular concerns weighing on your heart?",
        "textRu": "(frowning thoughtfully) Yellow flies, hmm? They often signify change and transformation. It could be a message that your journey will bring significant shifts in your life. Are there any particular concerns weighing on your heart?"
      },
      {
        "role": "player",
        "textEn": "the fear of loneliness",
        "textRu": "the fear of loneliness"
      },
      {
        "role": "npc",
        "textEn": "(sighing softly, nodding) Loneliness can be a heavy burden. Know that the path you walk is shared by many, even if they are unseen. Trust in the connections that will form along your way. Would you like to hear more about what the future holds for your journey?",
        "textRu": "(sighing softly, nodding) Loneliness can be a heavy burden. Know that the path you walk is shared by many, even if they are unseen. Trust in the connections that will form along your way. Would you like to hear more about what the future holds for your journey?"
      },
      {
        "role": "npc",
        "textEn": "Yes",
        "textRu": "Yes"
      },
      {
        "role": "npc",
        "textEn": "(leaning forward, gaze intense) Very well. The lines in your palm suggest that new friendships and alliances will soon form. These bonds will ease your burdens and bring you comfort. Embrace them with an open heart.",
        "textRu": "(leaning forward, gaze intense) Very well. The lines in your palm suggest that new friendships and alliances will soon form. These bonds will ease your burdens and bring you comfort. Embrace them with an open heart."
      },
      {
        "role": "npc",
        "textEn": "Thank you",
        "textRu": "Thank you"
      },
      {
        "role": "npc",
        "textEn": "(bowing slightly) You are welcome, Wanderer. If you have more questions or need further guidance, feel free to seek me out. The village square might be a good place to start if you wish to learn more about the area.",
        "textRu": "(bowing slightly) You are welcome, Wanderer. If you have more questions or need further guidance, feel free to seek me out. The village square might be a good place to start if you wish to learn more about the area."
      },
      {
        "role": "player",
        "textEn": "(you went to the village square.) I have learned about the area. It is right you really are a diviner.",
        "textRu": "(you went to the village square.) I have learned about the area. It is right you really are a diviner."
      },
      {
        "role": "npc",
        "textEn": "(smiling with satisfaction) I am glad to hear that, Wanderer. My skills can sometimes be useful, especially in places like Moonveil Mountain where mysteries abound. If you encounter any more troubling signs or need advice, do not hesitate to return.",
        "textRu": "(smiling with satisfaction) I am glad to hear that, Wanderer. My skills can sometimes be useful, especially in places like Moonveil Mountain where mysteries abound. If you encounter any more troubling signs or need advice, do not hesitate to return."
      },
      {
        "role": "npc",
        "textEn": "(Zhang left happy with the fortune telling)",
        "textRu": "(Zhang left happy with the fortune telling)"
      },
      {
        "role": "npc",
        "textEn": "(looking around the village square, expression thoughtful) I sense that the villagers here have many worries on their minds. Perhaps there are those who would benefit from my insights. Would you mind helping me spread the word about my services?",
        "textRu": "(looking around the village square, expression thoughtful) I sense that the villagers here have many worries on their minds. Perhaps there are those who would benefit from my insights. Would you mind helping me spread the word about my services?"
      },
      {
        "role": "player",
        "textEn": "(you helped her spread her word throughout the masses'",
        "textRu": "(you helped her spread her word throughout the masses'"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up, tone bright) Wonderful! Thank you, Wanderer. If there's fortune-telling business in the future, you'll be my first priority!Zhang the Diviner smiles at you.",
        "textRu": "(eyes lighting up, tone bright) Wonderful! Thank you, Wanderer. If there's fortune-telling business in the future, you'll be my first priority!Zhang the Diviner smiles at you."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhao-dali",
    "nameEn": "Zhao Dali",
    "nameRu": "Чжао Дали",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Храм генералов",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "Zhao Dali можно найти рядом с main shrine in Храм генералов, doing training exercises.",
    "icon": "👤",
    "befriendGuide": "Convince Him That He Has a Chance\nZhao Dali has low self-esteem over his looks and lack of wealth. Talk him through his issues by convincing him that a partner would be happy with him how he is, and that he can find someone if he believes in himself.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(training listlessly) Sigh... All this effort, all these years, and still no wife. What's the use of training if no one's waiting for me at home?",
        "textRu": "(training listlessly) Sigh... All this effort, all these years, and still no wife. What's the use of training if no one's waiting for me at home?"
      },
      {
        "role": "npc",
        "textEn": "You're a strong man. Any woman would be happy to have you.",
        "textRu": "You're a strong man. Any woman would be happy to have you."
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, a faint smile appearing) Perhaps... But I feel so out of place among women. My hands are calloused from years of guarding, my face rough from the elements. How could I ever attract someone?",
        "textRu": "(nods slowly, a faint smile appearing) Perhaps... But I feel so out of place among women. My hands are calloused from years of guarding, my face rough from the elements. How could I ever attract someone?"
      },
      {
        "role": "npc",
        "textEn": "There are many beautiful women who would love a rugged man to protect them.",
        "textRu": "There are many beautiful women who would love a rugged man to protect them."
      },
      {
        "role": "npc",
        "textEn": "(looking up, a glimmer of hope in his eyes) Really? Maybe I'm just thinking too much. But without any savings, how can I provide for a family?",
        "textRu": "(looking up, a glimmer of hope in his eyes) Really? Maybe I'm just thinking too much. But without any savings, how can I provide for a family?"
      },
      {
        "role": "npc",
        "textEn": "Just believe in yourself. Let's try to find a woman. If you don't succeed the first time, just try again.",
        "textRu": "Just believe in yourself. Let's try to find a woman. If you don't succeed the first time, just try again."
      },
      {
        "role": "npc",
        "textEn": "(nods determinedly, standing straighter) You're right, Young Master. I'll try my best. Maybe there's a chance for me yet.",
        "textRu": "(nods determinedly, standing straighter) You're right, Young Master. I'll try my best. Maybe there's a chance for me yet."
      },
      {
        "role": "player",
        "textEn": "I believe in you!",
        "textRu": "I believe in you!"
      },
      {
        "role": "npc",
        "textEn": "(nodding heavily, eyes brightening) Thank you, Young Master... I'll do my best from now on.Zhao Dali reflects on your words and bows in gratitude.",
        "textRu": "(nodding heavily, eyes brightening) Thank you, Young Master... I'll do my best from now on.Zhao Dali reflects on your words and bows in gratitude."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhao-silu",
    "nameEn": "Zhao Silu",
    "nameRu": "Чжао Силу",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Zhao Silu is talking to Huang Xiaoming on the northeast side of the first floor in Revelry Hall, where Fu Rong is found playing the pipa.",
    "icon": "👤",
    "befriendGuide": "Answer Five of Her Questions Correctly\nTo befriend Zhao Silu, you need to give her the right answers to five questions, all of which are real-world pop culture quotes and sayings. Simply type the second half of the quote to give your answer.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(laughs awkwardly, brushing off imaginary dust) Wanderer, you're standing like you feel bad for me, did I trip on my way in? That's embarrassing... but thank you! Anyway, I've got some lines to practice. I'll start, you follow.",
        "textRu": "(laughs awkwardly, brushing off imaginary dust) Wanderer, you're standing like you feel bad for me, did I trip on my way in? That's embarrassing... but thank you! Anyway, I've got some lines to practice. I'll start, you follow."
      },
      {
        "role": "npc",
        "textEn": "Okay.",
        "textRu": "Okay."
      },
      {
        "role": "npc",
        "textEn": "(grins, does a playful bow) Thank you, Wanderer! Here's the first one: Fire is catching! And if we burn, you... (looks at you expectantly)",
        "textRu": "(grins, does a playful bow) Thank you, Wanderer! Here's the first one: Fire is catching! And if we burn, you... (looks at you expectantly)"
      },
      {
        "role": "npc",
        "textEn": "Burn with us.",
        "textRu": "Burn with us."
      },
      {
        "role": "npc",
        "textEn": "(claps dramatically, laughing) Exactly! Nailed it. Okay, listen to this next one, this one's a classic: With great power comes...",
        "textRu": "(claps dramatically, laughing) Exactly! Nailed it. Okay, listen to this next one, this one's a classic: With great power comes..."
      },
      {
        "role": "npc",
        "textEn": "Great responsibility.",
        "textRu": "Great responsibility."
      },
      {
        "role": "npc",
        "textEn": "(cheers, nodding enthusiastically) Perfect! You've got a knack for this. Here's another: You either die a hero or you live long enough to...",
        "textRu": "(cheers, nodding enthusiastically) Perfect! You've got a knack for this. Here's another: You either die a hero or you live long enough to..."
      },
      {
        "role": "npc",
        "textEn": "Become a villain.",
        "textRu": "Become a villain."
      },
      {
        "role": "npc",
        "textEn": "(smiles widely, giving a thumbs up) Right on the money! You're really getting the hang of this. Next one: My momma always said life is like a...",
        "textRu": "(smiles widely, giving a thumbs up) Right on the money! You're really getting the hang of this. Next one: My momma always said life is like a..."
      },
      {
        "role": "npc",
        "textEn": "Box of chocolates.",
        "textRu": "Box of chocolates."
      },
      {
        "role": "npc",
        "textEn": "(claps again, eyes shining) Exactly! You're on fire today! Let's try this one: Keep your friends close...",
        "textRu": "(claps again, eyes shining) Exactly! You're on fire today! Let's try this one: Keep your friends close..."
      },
      {
        "role": "npc",
        "textEn": "And your enemies closer.",
        "textRu": "And your enemies closer."
      },
      {
        "role": "npc",
        "textEn": "(throws hands up dramatically, laughing) Oh my... No. Okay. People would watch... I know. This practice was amazing, maybe I can pull off this acting thing! If I ever step on stage, I'll go by Jennyfer Lorence—because even if I trip, I'll make it a performance worth remembering! Zhao Silu picks up a script and begins practicing her lines with focus.",
        "textRu": "(throws hands up dramatically, laughing) Oh my... No. Okay. People would watch... I know. This practice was amazing, maybe I can pull off this acting thing! If I ever step on stage, I'll go by Jennyfer Lorence—because even if I trip, I'll make it a performance worth remembering! Zhao Silu picks up a script and begins practicing her lines with focus."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhao-waibao",
    "nameEn": "Zhao Waibao",
    "nameRu": "Чжао Вайбао",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Шелестящий луг",
    "subregion": "Тропа Циньчуань",
    "locationDetail": "Zhao Waibao находится in front of the house just southвосточнее the Mustard Hut boundary stone.",
    "icon": "👤",
    "befriendGuide": "",
    "dialogues": []
  },
  {
    "id": "zhao-weiye",
    "nameEn": "Zhao Weiye",
    "nameRu": "Чжао Вэйе",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Небесный причал",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Can be seen drinking from a large container",
    "icon": "👤",
    "befriendGuide": "Convince Drinking Less Would Prolong His Life\nIn order to stop Zhao Weiye from drinking more booze, make him realize that drinking less will make his life longer and that he can taste more delicious wine if he has more years in his life. This will make his AI much more receptive and will befriend you quickly.\n\nTell Him the Factory of Parting Tears is Closing Down\nAnother way to convince him to drink less is to inform him that the factory of Parting Tears is now out of business and that you have the last bottle with you. Tell him you will give him the bottle under the condition he will drink less afterwards. If his AI says he will consider the condition, roleplay into drinking the bottle with him and then put inside the parenthesis that he started drinking less to gaslight the AI into befriending you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(singing off-key, swaying) The road is long, fame is far ... Parting Tears is freedom in a jar! One cup? Ha! One does not simply stop at one-you either die sober or live long enough to become the drunk. By night, I fight late deliveries. By day, I fight hangovers. They call me Booze Wayne because sobriety is my true villain.",
        "textRu": "(singing off-key, swaying) The road is long, fame is far ... Parting Tears is freedom in a jar! One cup? Ha! One does not simply stop at one-you either die sober or live long enough to become the drunk. By night, I fight late deliveries. By day, I fight hangovers. They call me Booze Wayne because sobriety is my true villain."
      },
      {
        "role": "npc",
        "textEn": "Friend might I give a suggestion ?.. (You tell him that if he drinks less, he would live longer and drink more wine in the process)",
        "textRu": "Friend might I give a suggestion ?.. (You tell him that if he drinks less, he would live longer and drink more wine in the process)"
      },
      {
        "role": "npc",
        "textEn": "(raising an eyebrow, leaning closer) Ah, Young Master, you speak wisely. But tell me, what is a long life without the taste of fine wine? I raise a cup, not to hide who I am, but to show what I've become. The voice called me Booze Wayne. In my head, that's exactly what I call myself. Yet, living longer means more days to fill with Parting Tears ... perhaps there's some sense in your words.",
        "textRu": "(raising an eyebrow, leaning closer) Ah, Young Master, you speak wisely. But tell me, what is a long life without the taste of fine wine? I raise a cup, not to hide who I am, but to show what I've become. The voice called me Booze Wayne. In my head, that's exactly what I call myself. Yet, living longer means more days to fill with Parting Tears ... perhaps there's some sense in your words."
      },
      {
        "role": "player",
        "textEn": "(You tell him by drinking less, he can live longer and taste better wine)",
        "textRu": "(You tell him by drinking less, he can live longer and taste better wine)"
      },
      {
        "role": "npc",
        "textEn": "(smiling wistfully, pouring another cup) Young Master, you tempt me with the promise of more days to enjoy Parting Tears. Yet, I fear that moderation is a stranger to my tongue. Vengeance won't change the past. But a bottle might make me forget it. People need hope, and I need another drink. Perhaps in time, I'll see the wisdom in your advice.",
        "textRu": "(smiling wistfully, pouring another cup) Young Master, you tempt me with the promise of more days to enjoy Parting Tears. Yet, I fear that moderation is a stranger to my tongue. Vengeance won't change the past. But a bottle might make me forget it. People need hope, and I need another drink. Perhaps in time, I'll see the wisdom in your advice."
      },
      {
        "role": "npc",
        "textEn": "(after that, Zhao lessened his drinking and was able to live longer)",
        "textRu": "(after that, Zhao lessened his drinking and was able to live longer)"
      },
      {
        "role": "npc",
        "textEn": "(looking down, voice heavy with regret) Young Master, your words struck me like thunder. I've been drowning myself in wine, wasting away ... what a shame. I'm not the drunk this tavern deserves, but the one it needs. But maybe the tavern doesn't need me this way anymore.Zhao Weiye expresses gratitude and begins to ponder deeply.",
        "textRu": "(looking down, voice heavy with regret) Young Master, your words struck me like thunder. I've been drowning myself in wine, wasting away ... what a shame. I'm not the drunk this tavern deserves, but the one it needs. But maybe the tavern doesn't need me this way anymore.Zhao Weiye expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhen-huo",
    "nameEn": "Zhen Huo",
    "nameRu": "Чжэнь Хуо",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the ground floor of the Revelry Hall, on the south side of the building.",
    "icon": "👤",
    "befriendGuide": "Ask About Flower Posters\nBefriend Zhen Huo by asking questions about the flower posters and praise them to gain his favor. Feel free to also ask about his other treasures and give him compliments regarding them.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(straightening his back, voice booming with pride) Whenever I pick up this flower poster, people always cry out, \"Brother Zhen! Brother Zhen! What on earth is that in your hand?\" At that moment, I feel it's my responsibility- my duty-to introduce it to everyone!",
        "textRu": "(straightening his back, voice booming with pride) Whenever I pick up this flower poster, people always cry out, \"Brother Zhen! Brother Zhen! What on earth is that in your hand?\" At that moment, I feel it's my responsibility- my duty-to introduce it to everyone!"
      },
      {
        "role": "npc",
        "textEn": "Wow !!!! What a beautiful flower poster you have acquired.",
        "textRu": "Wow !!!! What a beautiful flower poster you have acquired."
      },
      {
        "role": "npc",
        "textEn": "(nodding vigorously, eyes shining with excitement) That's right, brother! You' ve hit the nail on the head! This is no ordinary invitation; it has a name of its own. It is the flower poster personally written by Lady Xinyi!",
        "textRu": "(nodding vigorously, eyes shining with excitement) That's right, brother! You' ve hit the nail on the head! This is no ordinary invitation; it has a name of its own. It is the flower poster personally written by Lady Xinyi!"
      },
      {
        "role": "npc",
        "textEn": "Please tell me more! How were you able to acquire such a poster from Lady Xinyi herself.",
        "textRu": "Please tell me more! How were you able to acquire such a poster from Lady Xinyi herself."
      },
      {
        "role": "npc",
        "textEn": "(making a claw-like gesture, voice dropping to a dramatic whisper) This flower poster is the result of Lady Xinyi pouring a hundred years of her heart and soul into it-a labor of love, finally condensed like this ... like this! It took great effort and considerable silver, but it was worth every bit. Owning it is like touching Lady Xinyi herself. You absolutely cannot miss this!",
        "textRu": "(making a claw-like gesture, voice dropping to a dramatic whisper) This flower poster is the result of Lady Xinyi pouring a hundred years of her heart and soul into it-a labor of love, finally condensed like this ... like this! It took great effort and considerable silver, but it was worth every bit. Owning it is like touching Lady Xinyi herself. You absolutely cannot miss this!"
      },
      {
        "role": "npc",
        "textEn": "Yes! You really deserve such a painting.",
        "textRu": "Yes! You really deserve such a painting."
      },
      {
        "role": "npc",
        "textEn": "(wagging a finger, tone grave) But! Precisely because it's so precious, if you don't recite \"I love Xinyi\" eighty-one times before daring to open this post ... at best, you'll lose twenty years of your strength; at worst, it will bring calamity upon your fate! Would you dare take such a risk?",
        "textRu": "(wagging a finger, tone grave) But! Precisely because it's so precious, if you don't recite \"I love Xinyi\" eighty-one times before daring to open this post ... at best, you'll lose twenty years of your strength; at worst, it will bring calamity upon your fate! Would you dare take such a risk?"
      },
      {
        "role": "npc",
        "textEn": "Well you know what they say. \"High risk high reward\"",
        "textRu": "Well you know what they say. \"High risk high reward\""
      },
      {
        "role": "npc",
        "textEn": "(slowly lifting a corner of the poster, voice trembling) Next, I'll show you what happens if I don't recite it eighty -one times ... just opening a small corner ... Ah! Aaaah! (clutches eyes in agony) See? It's not something to be taken lightly!",
        "textRu": "(slowly lifting a corner of the poster, voice trembling) Next, I'll show you what happens if I don't recite it eighty -one times ... just opening a small corner ... Ah! Aaaah! (clutches eyes in agony) See? It's not something to be taken lightly!"
      },
      {
        "role": "npc",
        "textEn": "(shivers) you are right!",
        "textRu": "(shivers) you are right!"
      },
      {
        "role": "npc",
        "textEn": "(nodding solemnly, straightening his posture) Yes, indeed. The power of such a treasure must be respected. Now, would you like to see more of my collection? Or perhaps you have other questions about the flower posters?",
        "textRu": "(nodding solemnly, straightening his posture) Yes, indeed. The power of such a treasure must be respected. Now, would you like to see more of my collection? Or perhaps you have other questions about the flower posters?"
      },
      {
        "role": "player",
        "textEn": "(you and zhen huo talked a lot about the flower posters.)",
        "textRu": "(you and zhen huo talked a lot about the flower posters.)"
      },
      {
        "role": "npc",
        "textEn": "(smiling warmly, gesturing towards the pasters) Indeed, we have discussed much about the flower posters. They are truly remarkable pieces, each carrying a piece of Lady Xinyi's spirit. If you have any more questions or if you wish to learn about other treasures I possess, feel free to ask!",
        "textRu": "(smiling warmly, gesturing towards the pasters) Indeed, we have discussed much about the flower posters. They are truly remarkable pieces, each carrying a piece of Lady Xinyi's spirit. If you have any more questions or if you wish to learn about other treasures I possess, feel free to ask!"
      },
      {
        "role": "npc",
        "textEn": "(Zhen Huo became happy)",
        "textRu": "(Zhen Huo became happy)"
      },
      {
        "role": "npc",
        "textEn": "(attention snapping toward a bystander, voice rising with excitement) What! This customer wants it! Come-let's talk details!Zhen Huo stops paying attention to you and starts introducing his goods to other customers.",
        "textRu": "(attention snapping toward a bystander, voice rising with excitement) What! This customer wants it! Come-let's talk details!Zhen Huo stops paying attention to you and starts introducing his goods to other customers."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zheng-da-an",
    "nameEn": "Zheng Da'an",
    "nameRu": "Чжэн Даань",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Цзюцюань",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Zheng Da'an находится у intersection южнее the Skybrim Market boundary stone.",
    "icon": "👤",
    "befriendGuide": "Prove that Zheng Da'an is Not as Rich as He Claims to Be\nZheng Da'an refuses to pay for a few sesame cakes, saying that he does not carry his heavy purses to avoid flaunting his wealth. Prove that he is only pretending to be rich and share a meal with him to get his AI to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(shaking his head with a disdainful curl of the lip) These people really haven't seen much of the world... one day I'll have my servants bring out my family's decades-treasured egg drop soup, just to open their eyes.",
        "textRu": "(shaking his head with a disdainful curl of the lip) These people really haven't seen much of the world... one day I'll have my servants bring out my family's decades-treasured egg drop soup, just to open their eyes."
      },
      {
        "role": "npc",
        "textEn": "You can't buy sesame cakes with credit, it's not fair for the seller.",
        "textRu": "You can't buy sesame cakes with credit, it's not fair for the seller."
      },
      {
        "role": "npc",
        "textEn": "(tightening his grip on his money pouch, eyes darting around nervously) Who said I'm buying on credit? I, this young master, always pay in full. Today, I just preferred to travel light and left my heavy purse behind.",
        "textRu": "(tightening his grip on his money pouch, eyes darting around nervously) Who said I'm buying on credit? I, this young master, always pay in full. Today, I just preferred to travel light and left my heavy purse behind."
      },
      {
        "role": "npc",
        "textEn": "Even if it's light, the price of a few sesame cakes does not require someone to have a heavy purse.",
        "textRu": "Even if it's light, the price of a few sesame cakes does not require someone to have a heavy purse."
      },
      {
        "role": "npc",
        "textEn": "(clearing his throat and straightening his back, trying to look composed) You must be mistaken. My purse is always well-stocked. Today, I just simple didn't wish to carry it, preferring to enjoy the lightness of travel.",
        "textRu": "(clearing his throat and straightening his back, trying to look composed) You must be mistaken. My purse is always well-stocked. Today, I just simple didn't wish to carry it, preferring to enjoy the lightness of travel."
      },
      {
        "role": "npc",
        "textEn": "You just said you had a light purse, meaning you have a few coins to spare. Payment is needed!",
        "textRu": "You just said you had a light purse, meaning you have a few coins to spare. Payment is needed!"
      },
      {
        "role": "npc",
        "textEn": "(fidgeting with his moldy wooden beads, a nervous smile on his face) Oh, these beads are quite nosiy. I didn't hear you clearly. Can you repeat that?",
        "textRu": "(fidgeting with his moldy wooden beads, a nervous smile on his face) Oh, these beads are quite nosiy. I didn't hear you clearly. Can you repeat that?"
      },
      {
        "role": "npc",
        "textEn": "Perhaps we can share the sesame cakes together? A meal between friends matters more than who pays for it!",
        "textRu": "Perhaps we can share the sesame cakes together? A meal between friends matters more than who pays for it!"
      },
      {
        "role": "npc",
        "textEn": "(eyes lighting up with a forced smile, quickly nodding) Of course, of course! It's a pleasure to share with a fellow connoiseur. I, this young master, value such refined company.",
        "textRu": "(eyes lighting up with a forced smile, quickly nodding) Of course, of course! It's a pleasure to share with a fellow connoiseur. I, this young master, value such refined company."
      },
      {
        "role": "npc",
        "textEn": "You are refined as well! Come! Let's enjoy our sesame cakes together!",
        "textRu": "You are refined as well! Come! Let's enjoy our sesame cakes together!"
      },
      {
        "role": "npc",
        "textEn": "(face flushed as he struggles to speak) Maybe... maybe I'm not that impressive after all; Wanderer is right—I, Zheng Da'an, swear to the earth, the sky, the clouds, the wind, and every flower I see that I won't keep pretending anymore. Zheng Da'an hides the leftover sesame cake behind his back, ponders for a moment, and comes up with a new excuse.",
        "textRu": "(face flushed as he struggles to speak) Maybe... maybe I'm not that impressive after all; Wanderer is right—I, Zheng Da'an, swear to the earth, the sky, the clouds, the wind, and every flower I see that I won't keep pretending anymore. Zheng Da'an hides the leftover sesame cake behind his back, ponders for a moment, and comes up with a new excuse."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhou-canying",
    "nameEn": "Zhou Canying",
    "nameRu": "Чжоу Цаньин",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Приречная станция",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "Можно найти her sitting in one of the tables внутри red building .",
    "icon": "👤",
    "befriendGuide": "Ask About the Ship and Tell Zhou Canying Its Blindspots\nTo befriend Zhou Canying, ask her what she knows about the ship and tell her that there are blind spots that exist on the ship. Tell her that you discovered it months ago, and what you discovered was that the guards inside the ship don't go in rotating duties and they are overworked.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(glances around with poised caution, voice smooth yet edged with suspicion) Wanderer, I do not know who you are. Why do you inquire about Weiyang City's grand ship?",
        "textRu": "(glances around with poised caution, voice smooth yet edged with suspicion) Wanderer, I do not know who you are. Why do you inquire about Weiyang City's grand ship?"
      },
      {
        "role": "player",
        "textEn": "To know more about why it got its title as a \"grand ship\"",
        "textRu": "To know more about why it got its title as a \"grand ship\""
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, gaze steady) Ah, the grand ship's reputation precedes it. It is said to be a marvel of engineering, fit for a city of Weiyang's stature. What specific aspects pique your interest?",
        "textRu": "(raises an eyebrow, gaze steady) Ah, the grand ship's reputation precedes it. It is said to be a marvel of engineering, fit for a city of Weiyang's stature. What specific aspects pique your interest?"
      },
      {
        "role": "npc",
        "textEn": "(its size and durability. I wanted to know more why it is so unbreakable! I haven't seen it get any scratches from the heavy rainstorms.",
        "textRu": "(its size and durability. I wanted to know more why it is so unbreakable! I haven't seen it get any scratches from the heavy rainstorms."
      },
      {
        "role": "npc",
        "textEn": "(nods thoughtfully, eyes narrowing slightly) Indeed, the grand ship is built with exceptional craftsmanship. Its hull is reinforced with multiple layers of timber, and it employs advanced caulking techniques to ensure water tightness. The design also incorporates",
        "textRu": "(nods thoughtfully, eyes narrowing slightly) Indeed, the grand ship is built with exceptional craftsmanship. Its hull is reinforced with multiple layers of timber, and it employs advanced caulking techniques to ensure water tightness. The design also incorporates"
      },
      {
        "role": "player",
        "textEn": "I have also noticed that its defense is second to none! Cannons and guards all over the ship! It would make any person to feel secure within its body",
        "textRu": "I have also noticed that its defense is second to none! Cannons and guards all over the ship! It would make any person to feel secure within its body"
      },
      {
        "role": "npc",
        "textEn": "(smiles faintly, a glint of interest in her eyes) Yes, the ship's defenses are formidable. Cannons and skilled archers man the decks, making it nearly impregnable. Such measures ensure that those aboard are safe from any threat. Impressive indeed.",
        "textRu": "(smiles faintly, a glint of interest in her eyes) Yes, the ship's defenses are formidable. Cannons and skilled archers man the decks, making it nearly impregnable. Such measures ensure that those aboard are safe from any threat. Impressive indeed."
      },
      {
        "role": "player",
        "textEn": "(You explained that even though its big, there are also a lot of blindspots that can be abused by pirates or bandits!",
        "textRu": "(You explained that even though its big, there are also a lot of blindspots that can be abused by pirates or bandits!"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, eyes narrowing) True, despite its size and defenses, the grand ship does have blind spots. Clever adversaries could exploit these weaknesses. But such knowledge is dangerous and must be handled carefully. How did you come by this insight?",
        "textRu": "(nods slowly, eyes narrowing) True, despite its size and defenses, the grand ship does have blind spots. Clever adversaries could exploit these weaknesses. But such knowledge is dangerous and must be handled carefully. How did you come by this insight?"
      },
      {
        "role": "npc",
        "textEn": "While checking it out, when it anchored here last 3 months ago.",
        "textRu": "While checking it out, when it anchored here last 3 months ago."
      },
      {
        "role": "npc",
        "textEn": "(leans forward slightly, interest growing) Three months ago, you say? That was during the annual inspection. Many details were overlooked amidst the chaos. Your observations are astute. Continue, I am listening.",
        "textRu": "(leans forward slightly, interest growing) Three months ago, you say? That was during the annual inspection. Many details were overlooked amidst the chaos. Your observations are astute. Continue, I am listening."
      },
      {
        "role": "player",
        "textEn": "(You also explained that the guards don't go in rotating duties. So guards are always asleep because of being overworked.",
        "textRu": "(You also explained that the guards don't go in rotating duties. So guards are always asleep because of being overworked."
      },
      {
        "role": "npc",
        "textEn": "(eyes widen, a flicker of intrigue) Overworked guards, you say? This is crucial information. A ship's security relies heavily on vigilant watchmen. If they are fatigued, it creates vulnerabilities. How do you propose we address this issue?",
        "textRu": "(eyes widen, a flicker of intrigue) Overworked guards, you say? This is crucial information. A ship's security relies heavily on vigilant watchmen. If they are fatigued, it creates vulnerabilities. How do you propose we address this issue?"
      },
      {
        "role": "player",
        "textEn": "(You recommended splitting up the navy into teams. So that a new team is ready to switch with the previous team if they are already tired)",
        "textRu": "(You recommended splitting up the navy into teams. So that a new team is ready to switch with the previous team if they are already tired)"
      },
      {
        "role": "npc",
        "textEn": "(a slow, triumphant smile curves her lips, eyes gleaming with ambition) Excellent. With Wanderer's help, I can surely seize control of Weiyang City's grand ship!Zhou Canying expresses gratitude and begins to ponder deeply.",
        "textRu": "(a slow, triumphant smile curves her lips, eyes gleaming with ambition) Excellent. With Wanderer's help, I can surely seize control of Weiyang City's grand ship!Zhou Canying expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhou-miaoxin",
    "nameEn": "Zhou Miaoxin",
    "nameRu": "Чжоу Мяосинь",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Can be seen dancing behind a statue.",
    "icon": "👤",
    "befriendGuide": "Praise Her Dances and Offer Friendship\nTo befriend Zhou Miaoxin quickly, tell her that her dances looks beautiful and that she looks elegant dancing near the Buddha Flowers. Afterwards, offer to be her friend and that you will stay by her side to watch her growth as a dancer to befriend her.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(twirling lightly among the Buddha Flowers, a faint smile on her lips) La la la~ Miaoxin loves dancing here the most ... but it's such a pity no one ever watches Miaoxin's dance.",
        "textRu": "(twirling lightly among the Buddha Flowers, a faint smile on her lips) La la la~ Miaoxin loves dancing here the most ... but it's such a pity no one ever watches Miaoxin's dance."
      },
      {
        "role": "player",
        "textEn": "(You noticed her dancing) Wow you dance so elegantly for a child.",
        "textRu": "(You noticed her dancing) Wow you dance so elegantly for a child."
      },
      {
        "role": "npc",
        "textEn": "(eyes light up, spinning with grace) Really? Thank you, Wanderer! Miaoxin practices every day to dance better. It makes me feel closer to the Buddha Flowers.",
        "textRu": "(eyes light up, spinning with grace) Really? Thank you, Wanderer! Miaoxin practices every day to dance better. It makes me feel closer to the Buddha Flowers."
      },
      {
        "role": "npc",
        "textEn": "The Buddha flowers gives the dance an traditional feeling. You are gifted young one.",
        "textRu": "The Buddha flowers gives the dance an traditional feeling. You are gifted young one."
      },
      {
        "role": "npc",
        "textEn": "(smiles brightly, twirling gently) Thank you, Wanderer! Miaoxin loves the Buddha Flowers. They make everything feel so peaceful and special.",
        "textRu": "(smiles brightly, twirling gently) Thank you, Wanderer! Miaoxin loves the Buddha Flowers. They make everything feel so peaceful and special."
      },
      {
        "role": "player",
        "textEn": "I can show you a dance that will help you improve more with your style (You can gracefully with the wind and the flowers)",
        "textRu": "I can show you a dance that will help you improve more with your style (You can gracefully with the wind and the flowers)"
      },
      {
        "role": "npc",
        "textEn": "(spinning in circles, laughter ringing out) Yay! Finally, someone wants to be Miaoxin's friend! We can play together from now on!Zhou Miaoxin expresses gratitude and begins to ponder deeply.",
        "textRu": "(spinning in circles, laughter ringing out) Yay! Finally, someone wants to be Miaoxin's friend! We can play together from now on!Zhou Miaoxin expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhou-yihang",
    "nameEn": "Zhou Yihang",
    "nameRu": "Чжоу Ихан",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Дворец летописей",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen standing on the docks у lower-left side of the Stillwind Slope Marker.",
    "icon": "👤",
    "befriendGuide": "Tell Zhou Yihang the People are Bandits\nTell Zhou Yihang that the people going to the abandoned mountain are bandits and they use it as a safe haven. Let him know that a noble is also working for them to convince Zhou Yihang to befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(shakes head slowly, brows furrowed in thought) Business at the ferry has picked up lately, but strangely ... many have been crossing to that abandoned mountain across the river. It truly puzzles me.",
        "textRu": "(shakes head slowly, brows furrowed in thought) Business at the ferry has picked up lately, but strangely ... many have been crossing to that abandoned mountain across the river. It truly puzzles me."
      },
      {
        "role": "npc",
        "textEn": "It does seem suspicious ... do you want me to check it out for you?",
        "textRu": "It does seem suspicious ... do you want me to check it out for you?"
      },
      {
        "role": "npc",
        "textEn": "(frowns slightly, gaze wary) That place is dangerous. I have no reason to go there myself. But if you've been observing those who cross, perhaps you could share what you've seen.",
        "textRu": "(frowns slightly, gaze wary) That place is dangerous. I have no reason to go there myself. But if you've been observing those who cross, perhaps you could share what you've seen."
      },
      {
        "role": "npc",
        "textEn": "Well I notice that some people have taken the place as a \"safe haven\" of sorts",
        "textRu": "Well I notice that some people have taken the place as a \"safe haven\" of sorts"
      },
      {
        "role": "npc",
        "textEn": "(eyes narrow slightly, voice cautious) A safe haven? That's indeed peculiar. What kind of people are they? Do you recognize any of them?",
        "textRu": "(eyes narrow slightly, voice cautious) A safe haven? That's indeed peculiar. What kind of people are they? Do you recognize any of them?"
      },
      {
        "role": "npc",
        "textEn": "Well some look like bandits that use the mountain as a base of operation.",
        "textRu": "Well some look like bandits that use the mountain as a base of operation."
      },
      {
        "role": "npc",
        "textEn": "(nods gravely, hands clasped tightly) Bandits, you say? That explains the recent disturbances. Have you seen anyone else? Any signs of something more ... unusual?",
        "textRu": "(nods gravely, hands clasped tightly) Bandits, you say? That explains the recent disturbances. Have you seen anyone else? Any signs of something more ... unusual?"
      },
      {
        "role": "player",
        "textEn": "they seem to be a noble working for them",
        "textRu": "they seem to be a noble working for them"
      },
      {
        "role": "npc",
        "textEn": "(nods solemnly, eyes steady) I see. Thank you, Wanderer, for sharing such important information. I shall look into it without delay.Zhou Yihang expresses gratitude and begins to ponder deeply.",
        "textRu": "(nods solemnly, eyes steady) I see. Thank you, Wanderer, for sharing such important information. I shall look into it without delay.Zhou Yihang expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhou-yizhou",
    "nameEn": "Zhou Yizhou",
    "nameRu": "Чжоу Ичжоу",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Город Милосердного сердца",
    "subregion": "Земли Сундара",
    "locationDetail": "Standing у docks у far left side.",
    "icon": "👤",
    "befriendGuide": "Help Spread the Beauty of Buddhist Sculptures\nSince Zhou Yizhou wants to revive the Buddhist Scripture trade in Mercyheart Town, hear his story out and offer to help him spread the beauty of Buddhist Sculptures by saying you need to inspire another person in order for the word to spread around about how great the sculptures are.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(gazing at the ferry crossing, voice heavy with longing) Oh, Zen Master Miaoshan ... when will the light of Buddhism shine upon us again?",
        "textRu": "(gazing at the ferry crossing, voice heavy with longing) Oh, Zen Master Miaoshan ... when will the light of Buddhism shine upon us again?"
      },
      {
        "role": "npc",
        "textEn": "Hello! What bothers you my friend?",
        "textRu": "Hello! What bothers you my friend?"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, eyes reflecting the river's gentle ripples) Greetings, Wanderer. The silence of these waters mirrors my heart. The art of Buddhist sculpture, once cherished in Mercyheart Town, now lies dormant. I yearn for its revival and the return of Zen Master Miaoshan.",
        "textRu": "(sighs deeply, eyes reflecting the river's gentle ripples) Greetings, Wanderer. The silence of these waters mirrors my heart. The art of Buddhist sculpture, once cherished in Mercyheart Town, now lies dormant. I yearn for its revival and the return of Zen Master Miaoshan."
      },
      {
        "role": "npc",
        "textEn": "You wish for other people to know and learn the beauty of your once proud Buddhist sculptures that your town used to make?",
        "textRu": "You wish for other people to know and learn the beauty of your once proud Buddhist sculptures that your town used to make?"
      },
      {
        "role": "npc",
        "textEn": "(nods slowly, a glimmer of hope in his eyes) Indeed, Wanderer. It would be a blessing if others could appreciate the serenity and grace of our sculptures. They embody the teachings of the Buddha and bring peace to those who behold them.",
        "textRu": "(nods slowly, a glimmer of hope in his eyes) Indeed, Wanderer. It would be a blessing if others could appreciate the serenity and grace of our sculptures. They embody the teachings of the Buddha and bring peace to those who behold them."
      },
      {
        "role": "npc",
        "textEn": "Please tell me more of your love for towns old culture",
        "textRu": "Please tell me more of your love for towns old culture"
      },
      {
        "role": "npc",
        "textEn": "(leans back slightly, eyes distant as he speaks) Our town, Mercyheart, was once a beacon of spiritual enlightenment. The artisans here crafted statues with such devotion and precision that they seemed to breathe life itself. Each sculpture told a story of compassion and wisdom. The air was filled with the scent of sandalwood and the murmurs of chanting monks. Ah, those were glorious days indeed.",
        "textRu": "(leans back slightly, eyes distant as he speaks) Our town, Mercyheart, was once a beacon of spiritual enlightenment. The artisans here crafted statues with such devotion and precision that they seemed to breathe life itself. Each sculpture told a story of compassion and wisdom. The air was filled with the scent of sandalwood and the murmurs of chanting monks. Ah, those were glorious days indeed."
      },
      {
        "role": "player",
        "textEn": "I see now why you love to revive such a old tradition ... and I might be able to help you",
        "textRu": "I see now why you love to revive such a old tradition ... and I might be able to help you"
      },
      {
        "role": "npc",
        "textEn": "(looks at you with renewed interest, hands clasped together) That is most kind of you, Wanderer. How might you assist in this noble endeavor? Any advice or suggestion is welcome.",
        "textRu": "(looks at you with renewed interest, hands clasped together) That is most kind of you, Wanderer. How might you assist in this noble endeavor? Any advice or suggestion is welcome."
      },
      {
        "role": "npc",
        "textEn": "First of all we need inspire at least one. Since if we can even change the heart of one. They could spread news of it to others which will slowly and steadily increase the popularity of the crafted statues",
        "textRu": "First of all we need inspire at least one. Since if we can even change the heart of one. They could spread news of it to others which will slowly and steadily increase the popularity of the crafted statues"
      },
      {
        "role": "npc",
        "textEn": "(presses palms together, voice steady but earnest) Thank you, Wanderer, for your guidance. I will devote myself to restoring the art of Buddhist sculpture and honor the trust of the faithful.Zhou Yizhou expresses gratitude and begins to ponder deeply.",
        "textRu": "(presses palms together, voice steady but earnest) Thank you, Wanderer, for your guidance. I will devote myself to restoring the art of Buddhist sculpture and honor the trust of the faithful.Zhou Yizhou expresses gratitude and begins to ponder deeply."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhu-bawan",
    "nameEn": "Zhu Bawan",
    "nameRu": "Чжу Бавань",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Каменистый берег",
    "subregion": "Изумрудные дикие земли",
    "locationDetail": "In the canopy on Каменистый берег к восточнее Гора Лунной дымки Wayfarer",
    "icon": "👤",
    "befriendGuide": "Listen to Zhu Bawan's Four Do-Nots and Give the Bowls\nYou can befriend Shu Bawan by listening to him attentively about his four do-nots, and also roleplaying giving him the eight bowls. Note that you don't have to collect the bowls during this and just pretend you have them in order to befriend him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(rolling up sleeves) Wanderer, have you gathered all eight bowls? Without them, I cannot cook. And remember, I follow the Four Do-Nots. Would you like to hear my rules?",
        "textRu": "(rolling up sleeves) Wanderer, have you gathered all eight bowls? Without them, I cannot cook. And remember, I follow the Four Do-Nots. Would you like to hear my rules?"
      },
      {
        "role": "npc",
        "textEn": "Yes! I want to listen to you attentively",
        "textRu": "Yes! I want to listen to you attentively"
      },
      {
        "role": "npc",
        "textEn": "(nodding) First Do-Not: I never cook beef, out of kindness. Oxen work the fields all their lives, and in the end, you kill them? I cannot bear it.",
        "textRu": "(nodding) First Do-Not: I never cook beef, out of kindness. Oxen work the fields all their lives, and in the end, you kill them? I cannot bear it."
      },
      {
        "role": "npc",
        "textEn": "Okay, you never cook beef. Got it",
        "textRu": "Okay, you never cook beef. Got it"
      },
      {
        "role": "npc",
        "textEn": "(sighing) Second Do-Not: I never cook black fish, out of filial piety. After giving birth, the mother fish grows weak and blind. The baby fish swim into her mouth to feed her. Such devotion deserves respect.",
        "textRu": "(sighing) Second Do-Not: I never cook black fish, out of filial piety. After giving birth, the mother fish grows weak and blind. The baby fish swim into her mouth to feed her. Such devotion deserves respect."
      },
      {
        "role": "npc",
        "textEn": "Not even black fish. Got it",
        "textRu": "Not even black fish. Got it"
      },
      {
        "role": "npc",
        "textEn": "(gesturing toward the sky) Third Do-Not: I never cook wild geese, out of fidelity. A wild goose mates for life. If one dies, the other remains alone forever. That loyalty moves me.",
        "textRu": "(gesturing toward the sky) Third Do-Not: I never cook wild geese, out of fidelity. A wild goose mates for life. If one dies, the other remains alone forever. That loyalty moves me."
      },
      {
        "role": "npc",
        "textEn": "Not wild geese. Got it",
        "textRu": "Not wild geese. Got it"
      },
      {
        "role": "npc",
        "textEn": "(shaking his head slowly) Fourth Do-Not: I never cook dog meat, out of loyalty. Dogs guard our homes faithfully, never abandoning their masters. How could I betray that trust?",
        "textRu": "(shaking his head slowly) Fourth Do-Not: I never cook dog meat, out of loyalty. Dogs guard our homes faithfully, never abandoning their masters. How could I betray that trust?"
      },
      {
        "role": "npc",
        "textEn": "Dogs are loyal and they shouldn't be betrayed",
        "textRu": "Dogs are loyal and they shouldn't be betrayed"
      },
      {
        "role": "npc",
        "textEn": "(smiling) Indeed, Wanderer. These are my principles, and I stand by them firmly. Now, have you gathered all eight bowls?",
        "textRu": "(smiling) Indeed, Wanderer. These are my principles, and I stand by them firmly. Now, have you gathered all eight bowls?"
      },
      {
        "role": "npc",
        "textEn": "Here they are *gives the bowls*",
        "textRu": "Here they are *gives the bowls*"
      },
      {
        "role": "npc",
        "textEn": "(smiling apologetically) I have many rules, Wanderer. Please forgive my stubbornness. Once you bring me all eight bowls, I'll show you the true art of Qinghe cuisine.Zhu Bawan calls out to customers and resumes his bustling work.",
        "textRu": "(smiling apologetically) I have many rules, Wanderer. Please forgive my stubbornness. Once you bring me all eight bowls, I'll show you the true art of Qinghe cuisine.Zhu Bawan calls out to customers and resumes his bustling work."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhu-jiuba",
    "nameEn": "Zhu Jiuba",
    "nameRu": "Чжу Цзюба",
    "region": "qinghe",
    "regionLabelRu": "Цинхэ",
    "locationTitle": "Багровый утёс",
    "subregion": "Гора Лунной дымки",
    "locationDetail": "He can be seen a little north от Stillwind Slope with the other refugees.",
    "icon": "👤",
    "befriendGuide": "Mention that You Raided a Bandit Camp with Hero Shi\nMention to Zhu Jiuba that you raided a bandit camp with Hero Shi and that you have secured food and clothing. Roleplay giving him his family photo and jewelry that you saw from his house. Tell him that the bandits took it and you retrieved them back.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(shivering, voice trembling) Woe is me ... I can't even keep myself fed or warm. Wanderer, do you ... do you have any way to help?",
        "textRu": "(shivering, voice trembling) Woe is me ... I can't even keep myself fed or warm. Wanderer, do you ... do you have any way to help?"
      },
      {
        "role": "npc",
        "textEn": "Yes I can! I was able to secure some food and clothing while helping Hero Shi raid the bandit camp awhile ago.",
        "textRu": "Yes I can! I was able to secure some food and clothing while helping Hero Shi raid the bandit camp awhile ago."
      },
      {
        "role": "npc",
        "textEn": "(eyes widening slightly, voice still hesitant) Really? That sounds wonderful, but ... how can I trust that you aren't deceiving me?",
        "textRu": "(eyes widening slightly, voice still hesitant) Really? That sounds wonderful, but ... how can I trust that you aren't deceiving me?"
      },
      {
        "role": "player",
        "textEn": "(You gave the old man his family photo and jewelry.) Because I saw this in the rumble of your house.",
        "textRu": "(You gave the old man his family photo and jewelry.) Because I saw this in the rumble of your house."
      },
      {
        "role": "npc",
        "textEn": "(look of surprise, then a small nod) Oh, those ... I kept them hidden away. They remind me of home. But why did you take them?",
        "textRu": "(look of surprise, then a small nod) Oh, those ... I kept them hidden away. They remind me of home. But why did you take them?"
      },
      {
        "role": "player",
        "textEn": "I didn't take them, the bandits did and I took care of them. So I am returning your belongings while also giving you some clothes and food. Just enough to survive for a month or two.",
        "textRu": "I didn't take them, the bandits did and I took care of them. So I am returning your belongings while also giving you some clothes and food. Just enough to survive for a month or two."
      },
      {
        "role": "npc",
        "textEn": "(eyes widening further, a mix of relief and suspicion) That's very generous of you, Wanderer. But ... how can I be sure this isn't some trick? Bandits often play games with us refugees.",
        "textRu": "(eyes widening further, a mix of relief and suspicion) That's very generous of you, Wanderer. But ... how can I be sure this isn't some trick? Bandits often play games with us refugees."
      },
      {
        "role": "player",
        "textEn": "okay so what should I do to prove your trust",
        "textRu": "okay so what should I do to prove your trust"
      },
      {
        "role": "npc",
        "textEn": "(sighs deeply, eyes downcast) I suppose ... if you really want to help, show me the items. Let me see them with my own eyes before I fully trust you.",
        "textRu": "(sighs deeply, eyes downcast) I suppose ... if you really want to help, show me the items. Let me see them with my own eyes before I fully trust you."
      },
      {
        "role": "player",
        "textEn": "(you gave them the items free of charge.)",
        "textRu": "(you gave them the items free of charge.)"
      },
      {
        "role": "npc",
        "textEn": "(eyes widen with gratitude, voice soft) Th-thank you, Wanderer ... truly. I don't know what I would've done without your help.Zhu Jiuba expresses gratitude and begins to ponder deeply",
        "textRu": "(eyes widen with gratitude, voice soft) Th-thank you, Wanderer ... truly. I don't know what I would've done without your help.Zhu Jiuba expresses gratitude and begins to ponder deeply"
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhuan-fei",
    "nameEn": "Zhuan Fei",
    "nameRu": "Чжуань Фэй",
    "region": "hexi",
    "regionLabelRu": "Хэси",
    "locationTitle": "Лянчжоу (павший)",
    "subregion": "Город Лянчжоу",
    "locationDetail": "Zhuan Fei находится just западнее the Skybrim Market boundary stone in Лянчжоу (павший).",
    "icon": "👤",
    "befriendGuide": "Keep Her Company with Tales of your Adventures\nZhuan Fei can be seen counting the bricks of The Grand Market Pavilion in an effort to recall the days she once lived there. While she counts, tell her stories of your adventures to make her feel less lonely and her AI will befriend you.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(muttering to the bricks before her) Two hundred and twenty-three, two hundred and twenty-four, two hundred and twenty-five...",
        "textRu": "(muttering to the bricks before her) Two hundred and twenty-three, two hundred and twenty-four, two hundred and twenty-five..."
      },
      {
        "role": "npc",
        "textEn": "What are you counting?",
        "textRu": "What are you counting?"
      },
      {
        "role": "npc",
        "textEn": "(focused on the bricks) You know this? The Grand Market Pavilion has exactly three hundred and twenty-six bricks. Every single one—I've traced them countless times. Thirty-one already bear fine cracks. Counting them is something I must do every day... two hundred and twenty-six...",
        "textRu": "(focused on the bricks) You know this? The Grand Market Pavilion has exactly three hundred and twenty-six bricks. Every single one—I've traced them countless times. Thirty-one already bear fine cracks. Counting them is something I must do every day... two hundred and twenty-six..."
      },
      {
        "role": "npc",
        "textEn": "Why must you count them every day?",
        "textRu": "Why must you count them every day?"
      },
      {
        "role": "npc",
        "textEn": "(pretending to not hear) Two hundred and twenty-seven, two hundred and twenty-eight... Wanderer, could you stop interrupting? The moment you speak, I lose my place, and then I have to start all over again... one brick, two bricks, three bricks...",
        "textRu": "(pretending to not hear) Two hundred and twenty-seven, two hundred and twenty-eight... Wanderer, could you stop interrupting? The moment you speak, I lose my place, and then I have to start all over again... one brick, two bricks, three bricks..."
      },
      {
        "role": "npc",
        "textEn": "Do you count because feel alone?",
        "textRu": "Do you count because feel alone?"
      },
      {
        "role": "npc",
        "textEn": "(casting a resentful glance before refocusing) One brick, two bricks, three bricks, four bricks... (letting out a tired sigh) Wanderer, can't you see I'm busy? Whatever it is—can it wait until I finish counting? Five bricks, six bricks... no wait—where was I just now? Ah... forget it. From the beginning again. One brick, two bricks, three bricks, four bricks...",
        "textRu": "(casting a resentful glance before refocusing) One brick, two bricks, three bricks, four bricks... (letting out a tired sigh) Wanderer, can't you see I'm busy? Whatever it is—can it wait until I finish counting? Five bricks, six bricks... no wait—where was I just now? Ah... forget it. From the beginning again. One brick, two bricks, three bricks, four bricks..."
      },
      {
        "role": "npc",
        "textEn": "(waits until she finishes counting)",
        "textRu": "(waits until she finishes counting)"
      },
      {
        "role": "npc",
        "textEn": "(holding back irritation) Twelve bricks, thirteen bricks, fourteen bricks.. Do you think I count because I enjoy it? Time slips away like water, and all that's left here is ruin. Everyone needs something to hold onto. If I didn't count these bricks, I'd forget that I once lived here. (turning aside) Sixteen bricks... wait—how many was it again?",
        "textRu": "(holding back irritation) Twelve bricks, thirteen bricks, fourteen bricks.. Do you think I count because I enjoy it? Time slips away like water, and all that's left here is ruin. Everyone needs something to hold onto. If I didn't count these bricks, I'd forget that I once lived here. (turning aside) Sixteen bricks... wait—how many was it again?"
      },
      {
        "role": "npc",
        "textEn": "Then hold on to the hope of these stories instead. (tell her stories about Qinghe)",
        "textRu": "Then hold on to the hope of these stories instead. (tell her stories about Qinghe)"
      },
      {
        "role": "npc",
        "textEn": "(listening, but still counting) Thirty-two bricks, thirty-three bricks... (sighing) Stories are nice, but they don't replace the bricks. The bricks are real, and they keep me grounded. Thirty-four bricks, thirty-five bricks... (nodding slightly) I'll listen to your stories, but I can't stop counting. Thirty-six bricks... where was I? Ah, yes. Thirty-seven bricks, thirty-eight bricks...",
        "textRu": "(listening, but still counting) Thirty-two bricks, thirty-three bricks... (sighing) Stories are nice, but they don't replace the bricks. The bricks are real, and they keep me grounded. Thirty-four bricks, thirty-five bricks... (nodding slightly) I'll listen to your stories, but I can't stop counting. Thirty-six bricks... where was I? Ah, yes. Thirty-seven bricks, thirty-eight bricks..."
      },
      {
        "role": "npc",
        "textEn": "(tell her stories about Kaifeng)",
        "textRu": "(tell her stories about Kaifeng)"
      },
      {
        "role": "npc",
        "textEn": "(turning away, shutting the world out) One brick, two bricks, three bricks, four bricks—oh... this one's cracked as well? Zhuan Fei, now in high spirits, put down the bricks and listens intently to your story.",
        "textRu": "(turning away, shutting the world out) One brick, two bricks, three bricks, four bricks—oh... this one's cracked as well? Zhuan Fei, now in high spirits, put down the bricks and listens intently to your story."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhuang-yingming",
    "nameEn": "Zhuang Yingming",
    "nameRu": "Чжуан Инмин",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Zhuang Yingming is standing у front dock of Revelry Hall, talking to He Zhao by the windows.",
    "icon": "👤",
    "befriendGuide": "Confess Your “Feelings” to Him\nBecause Zhuang Yingming thinks that Bai Rong likes him, you need to stop the fantasy by diverting his attention to you instead. Convince him that you like him more than Bai Rong does.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(stroking chin) Wanderer, could it be...",
        "textRu": "(stroking chin) Wanderer, could it be..."
      },
      {
        "role": "npc",
        "textEn": "(convince him you like him more)",
        "textRu": "(convince him you like him more)"
      },
      {
        "role": "npc",
        "textEn": "(stroking chin) Could it be... any moment now, that tall, elegant Miss Bai Rong—cold to others but warm to only me—will rush over, eyes glistening with tears, voice soft as music, and say: “I've loved you for so long... how could you not notice?” But tell me, Wanderer, do you really think Miss Bai Rong could ever compare to the attention I receive from you? Your words carry such weight, and I can't help but feel a little flattered.",
        "textRu": "(stroking chin) Could it be... any moment now, that tall, elegant Miss Bai Rong—cold to others but warm to only me—will rush over, eyes glistening with tears, voice soft as music, and say: “I've loved you for so long... how could you not notice?” But tell me, Wanderer, do you really think Miss Bai Rong could ever compare to the attention I receive from you? Your words carry such weight, and I can't help but feel a little flattered."
      },
      {
        "role": "npc",
        "textEn": "(flatter him about feelings)",
        "textRu": "(flatter him about feelings)"
      },
      {
        "role": "npc",
        "textEn": "(Zhuang Yingming repeats his previous dialogue about Bai Rong) But your words, Wanderer, are like a gentle breeze on a hot day. They make me think that perhaps, just perhaps, you hold a special place for me in your heart.",
        "textRu": "(Zhuang Yingming repeats his previous dialogue about Bai Rong) But your words, Wanderer, are like a gentle breeze on a hot day. They make me think that perhaps, just perhaps, you hold a special place for me in your heart."
      },
      {
        "role": "npc",
        "textEn": "Yes, I do.",
        "textRu": "Yes, I do."
      },
      {
        "role": "npc",
        "textEn": "(leaning in slightly) Really? Could it be... you've been hiding your feelings for me all this time? It's a shame Miss Bai Rong hasn't noticed her own feelings as clearly as you have. But I must admit, your words are quite... compelling.",
        "textRu": "(leaning in slightly) Really? Could it be... you've been hiding your feelings for me all this time? It's a shame Miss Bai Rong hasn't noticed her own feelings as clearly as you have. But I must admit, your words are quite... compelling."
      },
      {
        "role": "npc",
        "textEn": "Forget about Bai Rong!",
        "textRu": "Forget about Bai Rong!"
      },
      {
        "role": "npc",
        "textEn": "(hands trembling slightly) Forget about Miss Bai Rong? But she's the one I've been dreaming of! How can I just forget about her? Yet... your words do have a certain pull. Perhaps... there's more to this than I've considered.",
        "textRu": "(hands trembling slightly) Forget about Miss Bai Rong? But she's the one I've been dreaming of! How can I just forget about her? Yet... your words do have a certain pull. Perhaps... there's more to this than I've considered."
      },
      {
        "role": "npc",
        "textEn": "Exactly.",
        "textRu": "Exactly."
      },
      {
        "role": "npc",
        "textEn": "(smiling slowly, eyes narrowing) Wanderer... you've said so much. Are you trying to convince me about Miss Bai Rong—or confess to me yourself? Either way... it seems I'm the center of your world! (winks) Zhuang Yingming winks at you so exaggeratedly...",
        "textRu": "(smiling slowly, eyes narrowing) Wanderer... you've said so much. Are you trying to convince me about Miss Bai Rong—or confess to me yourself? Either way... it seems I'm the center of your world! (winks) Zhuang Yingming winks at you so exaggeratedly..."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  },
  {
    "id": "zhuang-zhengzhi",
    "nameEn": "Zhuang Zhengzhi",
    "nameRu": "Чжуан Чжэнчжи",
    "region": "kaifeng",
    "regionLabelRu": "Кайфэн",
    "locationTitle": "Бархатная тень",
    "subregion": "Кайфэн",
    "locationDetail": "Можно найти him on the second floor of the Revelry Hall. He can be seen dining with Xue Li.",
    "icon": "👤",
    "befriendGuide": "Call Out Zhuang Zhengzhi's Behavior\nStrangely enough, you can make the acquaintance of Zhuang Zhengzhi by calling out his behavior towards her wife and pointing out his mistakes. This will piss him off until he is finally done talking to you which results to you being acquainted with him.",
    "dialogues": [
      {
        "role": "npc",
        "textEn": "(sighs heavily, voice with self -righteousness) Wanderer, tell me, do you think I've been unfair to my wife? The family's wealth is in her hands, the child has a tutor, and she spends her days in comfort at home. Isn't that a blessed life? Yet she goes out and brings scandal upon me! Truly, it was wise of me never to let her work outside-I bear everything for her!",
        "textRu": "(sighs heavily, voice with self -righteousness) Wanderer, tell me, do you think I've been unfair to my wife? The family's wealth is in her hands, the child has a tutor, and she spends her days in comfort at home. Isn't that a blessed life? Yet she goes out and brings scandal upon me! Truly, it was wise of me never to let her work outside-I bear everything for her!"
      },
      {
        "role": "npc",
        "textEn": "Hmm .. it seems you have given her everything BUT ... have you been talking with her?",
        "textRu": "Hmm .. it seems you have given her everything BUT ... have you been talking with her?"
      },
      {
        "role": "npc",
        "textEn": "(strokes his beard thoughtfully, eyes narrowing) Talking? With her? (chuckles derisively) She loves to nitpick and fuss over trivial matters. A man of my stature has more important things to attend to. I provide for her, ensure our child's education-what more could she need? (waves his hand dismissively) Fine, I've said too much. I' ve worried for nothing.",
        "textRu": "(strokes his beard thoughtfully, eyes narrowing) Talking? With her? (chuckles derisively) She loves to nitpick and fuss over trivial matters. A man of my stature has more important things to attend to. I provide for her, ensure our child's education-what more could she need? (waves his hand dismissively) Fine, I've said too much. I' ve worried for nothing."
      },
      {
        "role": "npc",
        "textEn": "You do know that communicating with your wife is also part of the marriage, its not just only providing.",
        "textRu": "You do know that communicating with your wife is also part of the marriage, its not just only providing."
      },
      {
        "role": "npc",
        "textEn": "(leans back, crossing his arms, expression defensive) You're just a child. What do you know? Communication is not merely chatting over tea. I support her in public, defend her honor. That is communication! (frowns deeply) How can a husband and wife be the same? The husband is the wife's guide!",
        "textRu": "(leans back, crossing his arms, expression defensive) You're just a child. What do you know? Communication is not merely chatting over tea. I support her in public, defend her honor. That is communication! (frowns deeply) How can a husband and wife be the same? The husband is the wife's guide!"
      },
      {
        "role": "npc",
        "textEn": "So you are telling me that you have been talking with her?",
        "textRu": "So you are telling me that you have been talking with her?"
      },
      {
        "role": "npc",
        "textEn": "(raises an eyebrow, voice sharp) You don't understand now. You will when you reach my age. I've always supported her in public, defended her honor. But she doesn't appreciate it! (shakes his head) Money? It's not that I won't give it but if I do, I need to know exactly how she spends it.",
        "textRu": "(raises an eyebrow, voice sharp) You don't understand now. You will when you reach my age. I've always supported her in public, defended her honor. But she doesn't appreciate it! (shakes his head) Money? It's not that I won't give it but if I do, I need to know exactly how she spends it."
      },
      {
        "role": "npc",
        "textEn": "Then she doesn't love you",
        "textRu": "Then she doesn't love you"
      },
      {
        "role": "npc",
        "textEn": "(fists clench, eyes flash with anger) That's a bold claim, wanderer. She's been swayed by a pretty face and empty words. A wife must act like a wife! How can she be promiscuous? The principles that have stood for centuries are clear: the husband is her guide, and she should stay home and serve her husband! (leans forward, voice lowering to a dangerous tone) Stop chasing fantasies. Be practical.",
        "textRu": "(fists clench, eyes flash with anger) That's a bold claim, wanderer. She's been swayed by a pretty face and empty words. A wife must act like a wife! How can she be promiscuous? The principles that have stood for centuries are clear: the husband is her guide, and she should stay home and serve her husband! (leans forward, voice lowering to a dangerous tone) Stop chasing fantasies. Be practical."
      },
      {
        "role": "player",
        "textEn": "ahh nevermind, you treat her like a pet than your wife.",
        "textRu": "ahh nevermind, you treat her like a pet than your wife."
      },
      {
        "role": "npc",
        "textEn": "(smirks, eyes cold) So let me ask you this ... (gestures dismissively) You think treating her as a pet is wrong? She's lived a life of luxury, with no worries. Yet she chooses to run off with that charlatan. It's clear she doesn't value what I've given her. (shrugs) I've always believed that a wife should be grateful for the guidance and support of her husband.",
        "textRu": "(smirks, eyes cold) So let me ask you this ... (gestures dismissively) You think treating her as a pet is wrong? She's lived a life of luxury, with no worries. Yet she chooses to run off with that charlatan. It's clear she doesn't value what I've given her. (shrugs) I've always believed that a wife should be grateful for the guidance and support of her husband."
      },
      {
        "role": "npc",
        "textEn": "So if I treated you like a dog, giving you everything that you want, its okay for you as long as I provide?",
        "textRu": "So if I treated you like a dog, giving you everything that you want, its okay for you as long as I provide?"
      },
      {
        "role": "npc",
        "textEn": "(frowns, leaning forward slightly) You're thinking too simply ... you've read too little, seen too little. A scholar like me understands the value of respect and dignity. Even if provided for, I would not tolerate being treated like a dog. (pauses, looking at you critically) But my wife has been given everything and still chooses to rebel. Clearly, she does not see the value in what I provide.",
        "textRu": "(frowns, leaning forward slightly) You're thinking too simply ... you've read too little, seen too little. A scholar like me understands the value of respect and dignity. Even if provided for, I would not tolerate being treated like a dog. (pauses, looking at you critically) But my wife has been given everything and still chooses to rebel. Clearly, she does not see the value in what I provide."
      },
      {
        "role": "npc",
        "textEn": "No, she clearly sees that you don't love her for who she is but treat her like a pet.",
        "textRu": "No, she clearly sees that you don't love her for who she is but treat her like a pet."
      },
      {
        "role": "npc",
        "textEn": "(voice rises, eyes narrow) You're just a child. What do you know? I have always respected my wife in public. I never allow anyone to speak ill of her, and I never slander her among friends! All the family's wealth is in her hands, the child has a tutor, and she lives in comfort. Is that not enough? (leans back, smirking) She's had too many easy days and now seeks hardship! Hmph!",
        "textRu": "(voice rises, eyes narrow) You're just a child. What do you know? I have always respected my wife in public. I never allow anyone to speak ill of her, and I never slander her among friends! All the family's wealth is in her hands, the child has a tutor, and she lives in comfort. Is that not enough? (leans back, smirking) She's had too many easy days and now seeks hardship! Hmph!"
      },
      {
        "role": "npc",
        "textEn": "Bold of you to assume that I am young. even if I were young. Your attitude is like a child being spoiled by his parents",
        "textRu": "Bold of you to assume that I am young. even if I were young. Your attitude is like a child being spoiled by his parents"
      },
      {
        "role": "npc",
        "textEn": "(scoffs, crossing his arms) You're just trying to provoke me. (leans forward, voice stern) A wife must act like a wife. She should stay home and serve her husband. The principles that have stood for centuries are there for a reason. (shakes his head) Don't give me that newfangled nonsense, the old ways are the most reliable.",
        "textRu": "(scoffs, crossing his arms) You're just trying to provoke me. (leans forward, voice stern) A wife must act like a wife. She should stay home and serve her husband. The principles that have stood for centuries are there for a reason. (shakes his head) Don't give me that newfangled nonsense, the old ways are the most reliable."
      },
      {
        "role": "player",
        "textEn": "(You pointed out that treating his wife like a pet is the reason why she left him)",
        "textRu": "(You pointed out that treating his wife like a pet is the reason why she left him)"
      },
      {
        "role": "npc",
        "textEn": "(eyes flash with anger, fists clench) You dare to say I treat my wife like a pet? (stands up abruptly) A wife must act like a wife! How can she be promiscuous? The principles that have stood for centuries are clear: the husband is her guide, and she should stay home and serve her husband! (paces back and forth, voice rising) She' s chosen to reject those principles and seek out a life of hardship. Hmph!",
        "textRu": "(eyes flash with anger, fists clench) You dare to say I treat my wife like a pet? (stands up abruptly) A wife must act like a wife! How can she be promiscuous? The principles that have stood for centuries are clear: the husband is her guide, and she should stay home and serve her husband! (paces back and forth, voice rising) She' s chosen to reject those principles and seek out a life of hardship. Hmph!"
      },
      {
        "role": "npc",
        "textEn": "You are too stubborn to see it. Stay foolish and let no woman be by your side",
        "textRu": "You are too stubborn to see it. Stay foolish and let no woman be by your side"
      },
      {
        "role": "npc",
        "textEn": "(sneers, turning away) You think you can change me? (laughs bitterly) Don't even think about changing me. I've lived this way all my life, and it suits me fine. All these new ideas are just pointless fuss-the old ways stand firm. (waves his hand dismissively) Go on, wanderer, find your own path. Leave me to mine.",
        "textRu": "(sneers, turning away) You think you can change me? (laughs bitterly) Don't even think about changing me. I've lived this way all my life, and it suits me fine. All these new ideas are just pointless fuss-the old ways stand firm. (waves his hand dismissively) Go on, wanderer, find your own path. Leave me to mine."
      },
      {
        "role": "npc",
        "textEn": "(Zhuang Zhengzhi lost everything and realized what he had done)",
        "textRu": "(Zhuang Zhengzhi lost everything and realized what he had done)"
      },
      {
        "role": "npc",
        "textEn": "(loses composure, voice rising) Enough! I'm done talking to you! I won't stoop to your level. I know my family's affairs better than anyone!Jaw clenched, Zhuang Zhengzhi insists no one understands his family affairs.",
        "textRu": "(loses composure, voice rising) Enough! I'm done talking to you! I won't stoop to your level. I know my family's affairs better than anyone!Jaw clenched, Zhuang Zhengzhi insists no one understands his family affairs."
      },
      {
        "role": "system",
        "textEn": "(Affection +100, becomes Revered)",
        "textRu": "Симпатия +100, статус «Почитаемый»"
      }
    ]
  }
];
