export interface XtreamCategory {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface XtreamStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string | null;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
  rating?: string;
  rating_5based?: number;
  is_adult?: number;
  views?: string; // Mock property for UI
  tags?: string[]; // Mock property for UI
}

export interface UserCredentials {
  url: string;
  username: string;
  password: string;
}

export enum ViewMode {
  HOME = 'home',
  LIVE_TV = 'live',
  MOVIES = 'movies',
  SERIES = 'series',
  SETTINGS = 'settings'
}