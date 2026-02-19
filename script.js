const surahSelect = document.getElementById('surah-select');
const quranDisplay = document.getElementById('quran-display');
const bookmarkInfo = document.getElementById('bookmark-info');

// 1. جلب قائمة السور (الفهرس)
async function loadSurahs() {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    data.data.forEach(surah => {
        const option = document.createElement('option');
        option.value = surah.number;
        option.textContent = `${surah.number}. ${surah.name} (${surah.englishName})`;
        surahSelect.appendChild(option);
    });
}

// 2. جلب آيات السورة المختارة
async function loadAyahs(surahNumber) {
    quranDisplay.innerHTML = "جاري التحميل...";
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
    const data = await response.json();
    
    displayQuran(data.data);
}

// 3. عرض الآيات في الصفحة
function displayQuran(surahData) {
    quranDisplay.innerHTML = `<h3>${surahData.name}</h3>`;
    
    surahData.ayahs.forEach(ayah => {
        const ayahSpan = document.createElement('span');
        ayahSpan.className = 'ayah';
        ayahSpan.innerHTML = `${ayah.text} <span class="ayah-num">(${ayah.numberInSurah})</span> `;
        
        // إضافة ميزة الحفظ عند الضغط على الآية
        ayahSpan.onclick = () => saveBookmark(surahData.name, surahData.number, ayah.numberInSurah);
        
        quranDisplay.appendChild(ayahSpan);
    });
}

// 4. حفظ العلامة (LocalStorage)
function saveBookmark(name, sNum, aNum) {
    const bookmark = { name, sNum, aNum };
    localStorage.setItem('quranBookmark', JSON.stringify(bookmark));
    displayCurrentBookmark();
    alert(`تم حفظ العلامة: ${name} - آية ${aNum}`);
}

// 5. عرض العلامة المحفوظة والرجوع إليها
function displayCurrentBookmark() {
    const saved = JSON.parse(localStorage.getItem('quranBookmark'));
    if (saved) {
        bookmarkInfo.innerHTML = `
            <span>آخر ما وصلت إليه: ${saved.name} (آية ${saved.aNum})</span>
            <button class="bookmark-btn" onclick="loadAyahs(${saved.sNum})">انتقال</button>
        `;
    }
}

// تشغيل الوظائف عند فتح الصفحة
surahSelect.onchange = (e) => loadAyahs(e.target.value);
loadSurahs();
displayCurrentBookmark();