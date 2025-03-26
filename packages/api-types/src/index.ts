// 타입 내보내기 예시
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
