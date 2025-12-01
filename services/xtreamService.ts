import { XtreamCategory, XtreamStream } from '../types';

// Mock Data Generators for Visual Demo

export const mockCategories: XtreamCategory[] = [
  { category_id: "1", category_name: "Ukraine", parent_id: 0 },
  { category_id: "2", category_name: "Brazil", parent_id: 0 },
  { category_id: "3", category_name: "Germany", parent_id: 0 },
  { category_id: "4", category_name: "United States", parent_id: 0 },
  { category_id: "5", category_name: "France", parent_id: 0 },
  { category_id: "6", category_name: "Portugal", parent_id: 0 },
  { category_id: "7", category_name: "South Africa", parent_id: 0 },
  { category_id: "8", category_name: "China", parent_id: 0 },
];

export const mockStreams: XtreamStream[] = [
  {
    num: 1,
    name: "Nat Geo Wild HD",
    stream_type: "live",
    stream_id: 101,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Nat_Geo_Wild_logo.svg/2560px-Nat_Geo_Wild_logo.svg.png", // Placeholder
    epg_channel_id: "natgeo",
    added: "2023-01-01",
    category_id: "4",
    custom_sid: "",
    tv_archive: 1,
    direct_source: "",
    tv_archive_duration: 0,
    views: "+8.2M Views",
    tags: ["HD", "EPG"]
  },
  {
    num: 2,
    name: "Disney Channel",
    stream_type: "live",
    stream_id: 102,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Disney_Channel_logo.svg/2560px-Disney_Channel_logo.svg.png",
    epg_channel_id: "disney",
    added: "2023-01-01",
    category_id: "4",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "",
    tv_archive_duration: 0,
    views: "850K Views",
    tags: ["4K", "EPG", "$"]
  },
  {
    num: 3,
    name: "HBO Family",
    stream_type: "live",
    stream_id: 103,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/2560px-HBO_logo.svg.png",
    epg_channel_id: "hbo",
    added: "2023-01-01",
    category_id: "4",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "",
    tv_archive_duration: 0,
    views: "1.7M Views",
    tags: ["HD"]
  },
  {
    num: 4,
    name: "Discovery Science",
    stream_type: "live",
    stream_id: 104,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Discovery_Science_201x_logo.svg/1200px-Discovery_Science_201x_logo.svg.png",
    epg_channel_id: "discovery",
    added: "2023-01-01",
    category_id: "4",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "",
    tv_archive_duration: 0,
    views: "500K Views",
    tags: ["FHD"]
  },
  {
    num: 5,
    name: "ESPN Sport",
    stream_type: "live",
    stream_id: 105,
    stream_icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/ESPN_logo.svg/2560px-ESPN_logo.svg.png",
    epg_channel_id: "espn",
    added: "2023-01-01",
    category_id: "4",
    custom_sid: "",
    tv_archive: 0,
    direct_source: "",
    tv_archive_duration: 0,
    views: "12M Views",
    tags: ["HD", "LIVE"]
  }
];

export const getCountryFlag = (categoryName: string) => {
  const map: Record<string, string> = {
    "Ukraine": "🇺🇦",
    "Brazil": "🇧🇷",
    "Germany": "🇩🇪",
    "United States": "🇺🇸",
    "France": "🇫🇷",
    "Portugal": "🇵🇹",
    "South Africa": "🇿🇦",
    "China": "🇨🇳"
  };
  return map[categoryName] || "📺";
};

// Simulated Service Calls
export const fetchCategories = async (url: string, type: string = 'get_live_categories'): Promise<XtreamCategory[]> => {
  // In a real app, this would use fetch() with the xtream params
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockCategories), 500);
  });
};

export const fetchStreams = async (url: string, categoryId: string, type: string = 'get_live_streams'): Promise<XtreamStream[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
        // Return mostly US channels for demo if US selected, otherwise empty or generic
        if(categoryId === "4") return resolve(mockStreams);
        return resolve([]); 
    }, 600);
  });
};