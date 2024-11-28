const API_KEY = '13b16a8b188782ebf3f0f387f898bded';

// 扩展中文城市名映射并按拼音排序
const cityNameMap = {
    '安庆': 'Anqing',
    '蚌埠': 'Bengbu',
    '北京': 'Beijing',
    '长春': 'Changchun',
    '长沙': 'Changsha',
    '常州': 'Changzhou',
    '成都': 'Chengdu',
    '大连': 'Dalian',
    '东莞': 'Dongguan',
    '佛山': 'Foshan',
    '福州': 'Fuzhou',
    '广州': 'Guangzhou',
    '贵阳': 'Guiyang',
    '哈尔滨': 'Harbin',
    '海口': 'Haikou',
    '杭州': 'Hangzhou',
    '合肥': 'Hefei',
    '河源': 'Heyuan',
    '呼和浩特': 'Hohhot',
    '惠州': 'Huizhou',
    '济南': 'Jinan',
    '嘉兴': 'Jiaxing',
    '江门': 'Jiangmen',
    '金华': 'Jinhua',
    '昆明': 'Kunming',
    '兰州': 'Lanzhou',
    '丽水': 'Lishui',
    '洛阳': 'Luoyang',
    '南昌': 'Nanchang',
    '南京': 'Nanjing',
    '南宁': 'Nanning',
    '南通': 'Nantong',
    '宁波': 'Ningbo',
    '青岛': 'Qingdao',
    '泉州': 'Quanzhou',
    '厦门': 'Xiamen',
    '上海': 'Shanghai',
    '绍兴': 'Shaoxing',
    '深圳': 'Shenzhen',
    '沈阳': 'Shenyang',
    '石家庄': 'Shijiazhuang',
    '苏州': 'Suzhou',
    '台州': 'Taizhou',
    '太原': 'Taiyuan',
    '天津': 'Tianjin',
    '温州': 'Wenzhou',
    '武汉': 'Wuhan',
    '无锡': 'Wuxi',
    '乌鲁木齐': 'Urumqi',
    '西安': 'Xian',
    '西宁': 'Xining',
    '香港': 'Hong Kong',
    '徐州': 'Xuzhou',
    '烟台': 'Yantai',
    '银川': 'Yinchuan',
    '岳阳': 'Yueyang',
    '湛江': 'Zhanjiang',
    '长治': 'Changzhi',
    '郑州': 'Zhengzhou',
    '中山': 'Zhongshan',
    '重庆': 'Chongqing',
    '珠海': 'Zhuhai',
    // 国际城市
    '东京': 'Tokyo',
    '首尔': 'Seoul',
    '新加坡': 'Singapore',
    '曼谷': 'Bangkok',
    '吉隆坡': 'Kuala Lumpur',
    '雅加达': 'Jakarta',
    '马尼拉': 'Manila',
    '河内': 'Hanoi',
    '伦敦': 'London',
    '巴黎': 'Paris',
    '柏林': 'Berlin',
    '罗马': 'Rome',
    '莫斯科': 'Moscow',
    '纽约': 'New York',
    '洛杉矶': 'Los Angeles',
    '旧金山': 'San Francisco',
    '芝加哥': 'Chicago',
    '温哥华': 'Vancouver',
    '多伦多': 'Toronto',
    '悉尼': 'Sydney',
    '墨尔本': 'Melbourne',
    '奥克兰': 'Auckland',
    '迪拜': 'Dubai'
};

// 添加常用城市快捷选择
const commonCities = ['北京', '上海', '广州', '深圳', '杭州', '成都', '武汉', '西安'];

// 创建常用城市按钮
function createCommonCityButtons() {
    const container = document.createElement('div');
    container.className = 'common-cities';
    container.innerHTML = '<span>常用城市：</span>' + 
        commonCities.map(city => 
            `<button class="city-btn" type="button">${city}</button>`
        ).join('');
    
    document.querySelector('.search-box').insertAdjacentElement('afterend', container);
    
    // 添加点击事件
    container.querySelectorAll('.city-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.getElementById('cityInput').value = btn.textContent;
            searchWeather();
        });
    });
}

// 添加加载状态指示
function setLoading(isLoading) {
    const button = document.querySelector('button');
    const input = document.getElementById('cityInput');
    if (isLoading) {
        button.disabled = true;
        button.textContent = '查询中...';
        input.disabled = true;
    } else {
        button.disabled = false;
        button.textContent = '查询';
        input.disabled = false;
    }
}

async function searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const errorDiv = document.getElementById('error');
    const weatherResult = document.getElementById('weatherResult');
    const inputCity = cityInput.value.trim();

    if (!inputCity) {
        errorDiv.textContent = '请输入城市名称';
        return;
    }

    setLoading(true);
    errorDiv.textContent = '';

    try {
        let searchCity = cityNameMap[inputCity] || inputCity;
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&appid=${API_KEY}&lang=zh_cn`
        );
        
        if (!response.ok) {
            throw new Error('未找到该城市，请检查拼写或尝试使用英文名');
        }

        const data = await response.json();
        displayWeather(data);
        
        // 保存到历史记录
        saveToHistory(inputCity);
        
    } catch (error) {
        errorDiv.textContent = error.message;
        weatherResult.innerHTML = '';
    } finally {
        setLoading(false);
    }
}

// 保存搜索历史
function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    // 移除已存在的相同城市
    history = history.filter(item => item !== city);
    // 添加到开头
    history.unshift(city);
    // 最多保存5条记录
    history = history.slice(0, 5);
    localStorage.setItem('searchHistory', JSON.stringify(history));
    localStorage.setItem('lastSearchedCity', city);
    updateHistoryUI();
}

// 更新历史记录UI
function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const historyContainer = document.getElementById('searchHistory');
    if (!historyContainer) return;

    historyContainer.innerHTML = history.length ? '<div class="history-title">搜索历史：</div>' : '';
    history.forEach(city => {
        const btn = document.createElement('button');
        btn.className = 'history-item';
        btn.textContent = city;
        btn.onclick = () => {
            document.getElementById('cityInput').value = city;
            searchWeather();
        };
        historyContainer.appendChild(btn);
    });
}

function displayWeather(data) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = '';

    // 添加城市名称和当前时间
    const cityNameDiv = document.createElement('div');
    cityNameDiv.className = 'city-name';
    const currentTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    cityNameDiv.innerHTML = `
        <h2>${data.city.name}, ${data.city.country}</h2>
        <div class="current-time">更新时间：${currentTime}</div>
    `;
    weatherResult.appendChild(cityNameDiv);

    const dailyData = filterDailyData(data.list);

    // 创建天气卡片容器
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'weather-cards-container';

    dailyData.forEach((day, index) => {
        // 获取当天的最高温和最低温
        const dayTemp = getDayTemperatures(data.list, new Date(day.dt * 1000));
        
        const date = new Date(day.dt * 1000);
        const temp = getTemperature(day.main.temp);
        const description = day.weather[0].description;
        const icon = day.weather[0].icon;
        const humidity = day.main.humidity;
        const windSpeed = day.wind.speed;

        const weatherCard = document.createElement('div');
        weatherCard.className = `weather-card ${index === 0 ? 'today' : ''}`;
        weatherCard.innerHTML = `
            <div class="date">${formatDate(date)}${index === 0 ? ' (今天)' : ''}</div>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="天气图标">
            <div class="temp">${temp}</div>
            <div class="temp-range">
                <span class="temp-min">最低 ${getTemperature(dayTemp.min)}</span>
                <span class="temp-max">最高 ${getTemperature(dayTemp.max)}</span>
            </div>
            <div class="description">${description}</div>
            <div class="details">
                <div>湿度: ${humidity}%</div>
                <div>风速: ${Math.round(windSpeed * 3.6)}km/h</div>
            </div>
        `;

        cardsContainer.appendChild(weatherCard);
    });

    weatherResult.appendChild(cardsContainer);
}

// 获取某一天的最高温和最低温
function getDayTemperatures(list, targetDate) {
    const targetDateStr = targetDate.toDateString();
    const dayData = list.filter(item => {
        const itemDate = new Date(item.dt * 1000).toDateString();
        return itemDate === targetDateStr;
    });

    if (dayData.length === 0) {
        return {
            max: targetDate.main.temp,
            min: targetDate.main.temp
        };
    }

    const temperatures = dayData.map(item => item.main.temp);
    return {
        max: Math.max(...temperatures),
        min: Math.min(...temperatures)
    };
}

function filterDailyData(list) {
    const dailyData = [];
    const dates = new Set();

    for (const item of list) {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dates.has(date) && dailyData.length < 5) {
            dates.add(date);
            dailyData.push(item);
        }
    }

    return dailyData;
}

function getTemperature(kelvin) {
    const unit = document.querySelector('input[name="unit"]:checked').value;
    if (unit === 'celsius') {
        return `${Math.round(kelvin - 273.15)}°C`;
    } else {
        return `${Math.round((kelvin - 273.15) * 9/5 + 32)}°F`;
    }
}

function formatDate(date) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// 添加温度单位切换的事件监听器
document.querySelectorAll('input[name="unit"]').forEach(radio => {
    radio.addEventListener('change', () => {
        const weatherResult = document.getElementById('weatherResult');
        if (weatherResult.innerHTML !== '') {
            // 如果已经显示天气数据，重新搜索以更新温度显示
            searchWeather();
        }
    });
});

// 添加回车键搜索功能
document.getElementById('cityInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

// 页面加载时初始化
window.addEventListener('load', () => {
    createCommonCityButtons();
    
    // 创建搜索历史容器
    const historyDiv = document.createElement('div');
    historyDiv.id = 'searchHistory';
    historyDiv.className = 'search-history';
    document.querySelector('.unit-toggle').insertAdjacentElement('afterend', historyDiv);
    
    updateHistoryUI();
    
    const lastCity = localStorage.getItem('lastSearchedCity');
    if (lastCity) {
        document.getElementById('cityInput').value = lastCity;
        searchWeather();
    }
});

// 添加输入建议功能
const cityInput = document.getElementById('cityInput');
cityInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    if (value.length >= 1) {
        const suggestions = Object.keys(cityNameMap).filter(city => 
            city.includes(value) || cityNameMap[city].toLowerCase().includes(value.toLowerCase())
        );
        showSuggestions(suggestions);
    }
});

function showSuggestions(suggestions) {
    let suggestionsDiv = document.getElementById('suggestions');
    if (!suggestionsDiv) {
        suggestionsDiv = document.createElement('div');
        suggestionsDiv.id = 'suggestions';
        document.querySelector('.search-box').appendChild(suggestionsDiv);
    }
    
    if (suggestions.length > 0) {
        suggestionsDiv.innerHTML = suggestions
            .slice(0, 5)
            .map(city => `<div class="suggestion">${city}</div>`)
            .join('');
        
        suggestionsDiv.style.display = 'block';
    } else {
        suggestionsDiv.style.display = 'none';
    }
}

// 点击建议项时填充输入框
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggestion')) {
        cityInput.value = e.target.textContent;
        document.getElementById('suggestions').style.display = 'none';
        searchWeather();
    }
}); 