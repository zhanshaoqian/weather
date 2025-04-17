import { useState, useEffect } from 'react';
import '../styles/WeatherApp.css';
import { getWeatherForecast, CityWeather, WeatherData } from '../services/weatherService';

const WeatherApp = () => {
  const [city, setCity] = useState<string>('上海');
  const [weatherData, setWeatherData] = useState<CityWeather | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputCity, setInputCity] = useState<string>('');

  // 常用城市列表
  const commonCities = [
    '北京',
    '上海',
    '广州',
    '深圳',
    '成都',
    '杭州',
    '重庆',
    '西安'
  ];

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWeatherForecast(cityName);
      setWeatherData(data);
    } catch (err) {
      setError('获取天气数据失败，请检查城市名称或稍后再试');
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCity(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  // 处理快捷城市选择
  const handleQuickCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setInputCity('');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 ${weekday}`;
  };

  return (
    <div className="weather-app">
      <h1>天气预报</h1>
      
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputCity}
            onChange={handleCityChange}
            placeholder="输入城市名称"
            className="city-input"
          />
          <button type="submit" className="search-button">查询</button>
        </form>
      </div>
      
      <div className="common-cities">
        <span className="common-cities-label">常用城市：</span>
        {commonCities.map((commonCity) => (
          <button
            key={commonCity}
            className={`city-tag ${city === commonCity ? 'active' : ''}`}
            onClick={() => handleQuickCitySelect(commonCity)}
          >
            {commonCity}
          </button>
        ))}
      </div>

      {loading && <div className="loading">加载中...</div>}
      
      {error && <div className="error">{error}</div>}
      
      {weatherData && !loading && !error && (
        <div className="weather-container">
          <h2 className="city-name">{weatherData.city}</h2>
          
          <div className="weather-cards">
            {weatherData.daily.map((day, index) => (
              <div key={index} className="weather-card">
                <div className="date">{index === 0 ? '今天' : formatDate(day.date)}</div>
                <div className="condition">{day.condition}</div>
                <div className="icon">
                  <img 
                    src={`https://a.hecdn.net/img/common/icon/202106d/${day.icon}.png`} 
                    alt={day.condition} 
                  />
                </div>
                <div className="temperature">
                  <span className="temp-max">{day.tempMax}°</span>
                  <span className="temp-min">{day.tempMin}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;