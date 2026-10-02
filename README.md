# राष्ट्रनीति (RashtraNiti)
> **“एक आम आदमी से प्रधानमंत्री तक”**
> 
> *A Grand Political Strategy, Election Simulation & Governance Mobile Game set in India (भारत).*

---

## 🏛️ परियोजना परिचय (Project Overview)
**राष्ट्रनीति** एक काल्पनिक राजनीतिक रणनीति, चुनावी सिमुलेशन और शासन प्रबंधन मोबाइल गेम है। इसमें खिलाड़ी भारत के एक साधारण नागरिक से शुरुआत करके अपनी पार्टी की स्थापना करता है, जमीनी स्तर से चुनाव लड़ता है, संसद पहुंचता है, और अंततः भारत के प्रधानमंत्री पद तक पहुंचकर राष्ट्र का संचालन करता है।

---

## 🚀 दोहरे निष्पादन विकल्प (Dual Delivery Architecture)

1. **Native Android Studio Project (Kotlin + Jetpack Compose)**
   - **भाषा व फ्रेमवर्क**: Kotlin, Jetpack Compose (Material3)
   - **आर्किटेक्चर**: MVVM, Clean Architecture, StateFlow, Coroutines
   - **डेटाबेस**: Android Room Database (Offline First & Auto-save)
   - **स्थान**: `app/` डायरेक्टरी (Android Studio में सीधे खोलने योग्य)
   - **कम्पैटिबिलिटी**: Android 7.0+ (API 24 to 35)

2. **तत्काल खेलने योग्य मोबाइल वेब सिमुलेटर (Instant Playable Preview)**
   - **तकनीक**: Vanilla HTML5, CSS3, JavaScript (Web Audio API, SVG 2D India Map)
   - **स्थान**: `web-preview/`
   - **लाइव सर्वर**: `http://localhost:8080` पर सक्रिय

---

## 📱 12 स्तरीय राजनीतिक यात्रा (12 Levels of Progression)

| स्तर (Level) | पदवी (Title - Hindi) | Title (English) | मुख्य कार्य / उद्देश्य (Objective) |
|---|---|---|---|
| **Level 1** | आम नागरिक | Common Citizen | जनविश्वास बढ़ाएं और प्रारंभिक संगठन बनाएं। |
| **Level 2** | दल संस्थापक | Party Founder | पार्टी का नाम, चुनाव चिह्न, ध्वज और घोषणापत्र बनाएं। |
| **Level 3** | स्थानीय प्रत्याशी | Local Candidate | स्थानीय निर्वाचन क्षेत्र में प्रचार और बूथ प्रबंधन। |
| **Level 4** | जनप्रतिनिधि | Elected Representative | विकास कार्य, क्षेत्रीय समस्याएं व राज्य में पैठ। |
| **Level 5** | राज्यस्तरीय नेता | State Politician | राज्यव्यापी रैलियां व संगठन विस्तार। |
| **Level 6** | विधानसभा चुनाव | State Election | विधानसभा में पार्टी के लिए सीटें जीतना। |
| **Level 7** | राष्ट्रीय नेता | National Politician | राष्ट्रीय मुद्दों पर भाषण व गठबंधन चर्चाएं। |
| **Level 8** | सांसद (MP) | Member of Parliament | लोकसभा में प्रवेश और संसदीय बहसों में भागीदारी। |
| **Level 9** | सरकार गठन | Government Formation | 272+ सीटों का गठबंधन अथवा पूर्ण बहुमत। |
| **Level 10** | प्रधानमंत्री | Prime Minister | राष्ट्रपति भवन में शपथ एवं केंद्रीय मंत्रिमंडल गठन। |
| **Level 11** | राष्ट्र संचालन | Governance | GDP, बजट, आपदा राहत, कूटनीति व रक्षा। |
| **Level 12** | अगला आम चुनाव | Next General Election | 5 वर्ष के प्रदर्शन के आधार पर पुनः जनादेश। |

---

## 🎮 प्रमुख गेमिंग प्रणालियां (Core Systems)

### 1. 2D भारत मानचित्र (Interactive India Map)
- 4 ज़ूम स्तर: **संपूर्ण भारत ➔ राज्य ➔ जिला ➔ निर्वाचन क्षेत्र**
- प्रभाव क्षेत्र, अनलॉक सीटें, प्रतिद्वंद्वी दल और स्थानीय मुद्दे प्रदर्शित होते हैं।

### 2. अभियान रणनीति (10 Campaign Modes)
1. **घर-घर संपर्क (Door-to-Door)**: जनविश्वास +4%, न्यूनतम लागत
2. **जनसभा (Public Meeting)**: कार्यकर्ताओं का उत्साहवर्धन
3. **विशाल जन रैली (Public Rally)**: व्यापक लोकप्रियता व मीडिया ध्यान
4. **टाउन हॉल (Town Hall)**: बुद्धिजीवियों व युवाओं से सीधा संवाद
5. **सार्वजनिक बहस (Debate)**: प्रतिद्वंद्वी को चुनौती
6. **घोषणापत्र प्रस्तुति (Manifesto)**: 5 वर्षीय विकास विजन
7. **डिजिटल अभियान (Digital Campaign)**: सोशल मीडिया ट्रेंड्स
8. **मीडिया अभियान (Media Ads)**: टीवी व समाचार पत्र
9. **कार्यकर्ता महाभियान (Volunteer Drive)**: बूथ स्तर पर सेना
10. **सामुदायिक संवाद (Community Outreach)**: किसान व कर्मचारी वर्ग

### 3. भारत निर्वाचन आयोग व EVM मतगणना (Election Commission)
- चुनाव आचार संहिता और चुनावी व्यय सीमा का अनुपालन।
- मत प्रतिशत, मतदान दर (Turnout), EVM लाइव काउंटिंग और जीत के अंतर की सटीक गणना।

### 4. केंद्रीय मंत्रिमंडल एवं प्रधानमंत्री डैशबोर्ड (Cabinet & PM Mode)
- **8 मुख्य मंत्रालय**: गृह, वित्त, विज्ञान व तकनीक, कृषि, बुनियादी ढांचा, स्वास्थ्य, शिक्षा, रक्षा।
- **राष्ट्रीय आर्थिक सूचकांक**: GDP विकास दर, मुद्रास्फीति (Inflation), बेरोजगारी, सरकारी अनुमोदन, जनसंतुष्टि।

### 5. केंद्रीय वार्षिक बजट (Union Budget Simulator)
- ₹32 लाख करोड़ राजस्व बनाम ₹36.5 लाख करोड़ व्यय।
- मंत्रालयवार आवंटन में ₹10,000 करोड़ की वृद्धि/कमी करने पर राजकोषीय घाटे में त्वरित परिवर्तन।

### 6. संसद व विधेयक (Parliament System)
- लोकसभा में 543 कुल सीटें (बहुमत: 272)।
- सरकारी विधेयक प्रस्तुत करना, बहस और मतविभाजन (Ayes vs Noes)।

### 7. अचानक संकट एवं प्राकृतिक आपदाएं (Crisis & Disaster Engine)
- गंगा बेसिन बाढ़, मीडिया ट्रायल, आर्थिक चुनौतियां।
- 3 नीतिगत विकल्प: तत्काल राहत पैकेज, प्रशासनिक निगरानी, या स्वयं दौरा। हर निर्णय के अल्पकालिक व दीर्घकालिक परिणाम।

### 8. संवैधानिक प्रश्नोत्तरी (Political Quiz)
- संविधान, संसद, चुनाव आयोग और प्रशासन से संबंधित प्रामाणिक प्रश्नोत्तरी।
- सही उत्तर पर +10 अंक, +3 राजनीतिक ज्ञान व +2 नेतृत्व क्षमता।

### 9. मल्टीप्लेयर प्रणाली (Multiplayer Arena)
- 6 काल्पनिक प्रतिस्पर्धी मोड्स: बहुदलीय आम चुनाव, दल बनाम दल, सीट संग्राम, गठबंधन, नीति चुनौती और लीडरबोर्ड।
- फेयर-प्ले नियम व बिना वास्तविक धन का सुरक्षित वातावरण।

---

## 🛠️ प्रोजेक्ट कैसे चलाएं? (How to Run)

### विकल्प 1: Android Studio में चलाना (Native Kotlin App)
1. **Android Studio** खोलें।
2. **Open** पर क्लिक करें और इस फोल्डर `c:\Users\deep1\OneDrive\Documents\agho` का चयन करें।
3. Gradle Sync पूर्ण होने दें।
4. अपना Android Emulator या USB Debugging वाला फोन चुनें और **Run 'app'** (Shift + F10) दबाएं।

### विकल्प 2: ब्राउज़र में तुरंत खेलना (Instant Web Preview)
1. टर्मिनल में यह कमांड चलाएं (यदि सर्वर बंद हो):
   ```powershell
   python -m http.server 8080 --directory web-preview
   ```
2. अपने ब्राउज़र (Chrome/Edge/Firefox) में खोलें:
   ```
   http://localhost:8080
   ```
3. पूरी गेम यात्रा — आम नागरिक ➔ पार्टी गठन ➔ अभियान ➔ चुनाव ➔ संसद ➔ प्रधानमंत्री — का जीवंत अनुभव लें!

---

## 📂 फ़ाइल संरचना (Directory Structure)
```
agho/
├── settings.gradle.kts
├── build.gradle.kts
├── gradle.properties
├── gradle/
│   ├── libs.versions.toml
│   └── wrapper/gradle-wrapper.properties
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── res/
│       │   ├── values/strings.xml (English)
│       │   ├── values-hi/strings.xml (हिन्दी - प्राथमिक)
│       │   ├── values/colors.xml
│       │   └── values/themes.xml
│       └── java/com/rashtraniti/game/
│           ├── RashtraNitiApp.kt
│           ├── MainActivity.kt
│           ├── data/
│           │   ├── model/GameModels.kt
│           │   ├── local/GameDao.kt, AppDatabase.kt, GameSaveEntity.kt
│           │   └── repository/GameRepository.kt
│           ├── engine/
│           │   ├── GameEngine.kt
│           │   └── ElectionCalculator.kt
│           ├── viewmodel/GameViewModel.kt
│           └── ui/
│               ├── theme/Color.kt, Type.kt, Theme.kt
│               ├── components/CommonComponents.kt
│               └── screens/
│                   ├── OpeningScreen.kt
│                   ├── PlayerCreationScreen.kt
│                   ├── PartyCreationScreen.kt
│                   ├── HomeScreen.kt
│                   ├── MapScreen.kt
│                   ├── CampaignScreen.kt
│                   ├── ElectionScreen.kt
│                   ├── CabinetScreen.kt
│                   ├── BudgetScreen.kt
│                   ├── ParliamentScreen.kt
│                   ├── QuizScreen.kt
│                   ├── MediaScreen.kt
│                   ├── MultiplayerScreen.kt
│                   └── ProfileAchievementsScreen.kt
└── web-preview/
    ├── index.html
    ├── style.css
    └── app.js
```
