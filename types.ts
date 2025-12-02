export interface AccountInfo {
  user_info: {
    username: string;
    status: string;
    exp_date: string;
    is_trial: string;
    active_cons: string;
    max_connections: string;
  };
  server_info: {
    url: string;
    port: string;
    https_port: string;
    server_protocol: string;
    rtmp_port: string;
    timezone: string;
    timestamp_now: number;
    time_now: string;
  };
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id: string;
  added: string;
  category_id: string;
  custom_sid: string;
  tv_archive: number;
  direct_source: string;
  tv_archive_duration: number;
  stream_url?: string; // Added by backend enrichment
}

export interface Credentials {
  url: string;
  username: string;
  password: string;
}

// Keeping existing types for compatibility if needed elsewhere, but aliasing them or redefining to match new structure if possible.
// The new components use Category and LiveStream. The old ones used XtreamCategory and XtreamStream.
// Let's keep the old ones for now to avoid breaking other components immediately, but the new LiveTV will use the new types.

export interface XtreamCategory extends Category { }
export interface XtreamStream extends LiveStream {
  // Add missing properties from old XtreamStream if any, to satisfy old code
  views?: string;
  tags?: string[];
}
export interface UserCredentials extends Credentials { }

export enum ViewMode {
  HOME = 'home',
  LIVE_TV = 'live',
  MOVIES = 'movies',
  SERIES = 'series',
  SETTINGS = 'settings'
}