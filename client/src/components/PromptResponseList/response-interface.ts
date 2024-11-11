interface TemporalContext {
  info_date?: string;
  history_context: string;
}

interface MainResponse {
  summary: string;
  detailed_info: string;
  key_points: string[];
}

interface TextContent {
  temporal_context?: TemporalContext;
  main_response?: MainResponse;
  disclaimer?: string;
}

export interface ApiResponse {
  text: TextContent;
  citation?: any;
}

export interface ResponseInterface {
  id: string;
  response?: ApiResponse;
  selfFlag: boolean;
  error?: boolean;
  image?: string;
}