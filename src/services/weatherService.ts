import axios from 'axios';

// 天气数据接口定义
export interface WeatherData {
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: string;
}

export interface CityWeather {
  city: string;
  daily: WeatherData[];
}

// 使用新的天气API
const BASE_URL = 'https://cn.apihz.cn/api/tianqi/tqyb.php';
const API_ID = '88888888';
const API_KEY = '88888888';

// 常用城市与省份的映射关系
const cityProvinceMap: Record<string, string> = {
  '北京': '北京',
  '上海': '上海',
  '广州': '广东',
  '深圳': '广东',
  '成都': '四川',
  '杭州': '浙江',
  '重庆': '重庆',
  '西安': '陕西',
  '南京': '江苏',
  '武汉': '湖北',
  '长沙': '湖南',
  '天津': '天津'
};

/**
 * 获取城市天气预报
 * @param cityName 城市名称
 * @returns 天气数据
 */
export const getWeatherForecast = async (cityName: string): Promise<CityWeather> => {
  try {
    // 从城市名称中提取省份和地区
    let sheng = cityProvinceMap[cityName] || cityName;
    let place = cityName;
    
    if (cityName.includes(',')) {
      const parts = cityName.split(',');
      sheng = parts[0].trim();
      place = parts[1].trim();
    }
    
    // 使用新API获取天气数据
    const response = await axios.get(
      `${BASE_URL}?id=${API_ID}&key=${API_KEY}&sheng=${encodeURIComponent(sheng)}&place=${encodeURIComponent(place)}`
    );
    
    if (response.data.code === 200) {
      // 创建一个包含7天相同天气数据的数组（因为新API只返回当天天气）
      const dailyData: WeatherData[] = [];
      
      // 当前日期
      const today = new Date();
      
      // 生成7天的天气数据
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        dailyData.push({
          date: dateStr,
          tempMax: response.data.temperature,
          tempMin: response.data.temperature - 5, // 估算最低温度
          condition: i === 0 ? response.data.weather1 : response.data.weather2, // 第一天用weather1，其他天用weather2
          icon: i === 0 ? '100' : '101' // 简单图标映射，实际应根据天气状况映射
        });
      }

      return {
        city: response.data.place,
        daily: dailyData
      };
    } else {
      throw new Error('无法获取天气数据，请检查城市名称是否正确');
    }
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

// 备选API：如果主API不可用，可以使用备选API
// 暂时移除未实现的备选API函数
// export const getWeatherForecastAlternative = async (_cityName: string): Promise<CityWeather> => {
//   try {
//     // 这里保留备选API的实现，但实际上我们现在只使用主API
//     // 如果需要实现备选API，可以在这里添加代码
//     throw new Error('备选API暂未实现');
//   } catch (error) {
//     console.error('Alternative API error:', error);
//     throw error;
//   }
// };