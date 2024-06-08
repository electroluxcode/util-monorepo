// 自定义格式
declare interface Result<T = any> {
	code: number;
	type: "success" | "error" | "warning";
	message: string;
	result: T;
}

declare type Method =
	| "get"
	| "GET"
	| "delete"
	| "DELETE"
	| "head"
	| "HEAD"
	| "options"
	| "OPTIONS"
	| "post"
	| "POST"
	| "put"
	| "PUT"
	| "patch"
	| "PATCH";

interface RawAxiosHeaders {
	[key: string]: any;
}

type commonHeaderKey =
	| "Accept"
	| "Content-Length"
	| "User-Agent"
	| "Content-Encoding"
	| "Authorization";

type commonContentType =
	| "text/html"
	| "text/plain"
	| "multipart/form-data"
	| "application/json"
	| "application/x-www-form-urlencoded"
	| "application/octet-stream";
declare type RawAxiosRequestHeaders = Partial<
	RawAxiosHeaders & {
		[Key in commonHeaderKey]: any;
	} & {
		"Content-Type": commonContentType;
	}
>;

// 下载
declare interface AxiosProgressEvent {
	loaded: number;
	total?: number;
	progress?: number;
	bytes: number;
	rate?: number;
	estimated?: number;
	upload?: boolean;
	download?: boolean;
	event?: any;
}

// fetchHook 的 基本 type
declare interface CreateAxiosOptions {
	url?: string;
	method?: Method | string;
	baseURL?: string;
	headers?: RawAxiosRequestHeaders;
	params?: any;
	data?: any;
	timeout?: number;
	timeoutErrorMessage?: string;
	withCredentials?: boolean;
	responseType?: ResponseType;
	xsrfCookieName?: string;
	xsrfHeaderName?: string;
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
	onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
	maxContentLength?: number;
	validateStatus?: ((status: number) => boolean) | null;
	maxBodyLength?: number;
	maxRedirects?: number;

	// 额外功能
	transform?: AxiosTransform;
	requestOptions?: {
		// Interface address, use the default apiUrl if you leave it blank
		apiUrl?: string;
		// Error message prompt type
		errorMessageMode?: MessageMode;
		// Success message prompt type
		successMessageMode?: MessageMode;
		// Whether to send token in header
		withToken?: boolean;
		// 请求重试机制
		retryRequest?: {
			isOpenRetry: boolean;
			count: number;
			waitTime: number;
			successFn?: (res: AxiosResponse) => any;
			errorFn?: (res: AxiosResponse) => void;
		};
		// 是否去重
		isDeduplication?: boolean;
	};
	responseOptions?: {
		// vben 的是否返回 native 集成到了这里
		type: "json" | "text" | "native";
	};
	__retryCount?: any;
}

// 重要 增强方法
declare type MessageMode = "none" | "modal" | "message" | undefined;
interface;

type CommonResponseHeadersList =
	| "Server"
	| "Content-Type"
	| "Content-Length"
	| "Cache-Control"
	| "Content-Encoding";
// 封装 fetchHook response
declare interface AxiosResponse {
	data: any;
	status: number;
	statusText: string;
	ok?: boolean;
	headers: Partial<
		RawAxiosHeaders & {
			[key in CommonResponseHeadersList]: any;
		}
	>;
	config: CreateAxiosOptions;
}

declare interface axiosInstanceType {
	request: any;
	config: CreateAxiosOptions;
}

// transformResponseHook 和 beforeRequestHook 跟 响应和请求拦截器功能重叠
// requestCatchHook 和 requestInterceptorsCatch 两个捕获器功能重叠
declare abstract class AxiosTransform {
	/**
	 * @des 请求拦截器
	 */
	requestInterceptors?: (
		axiosInstance: axiosInstanceType,
		config: CreateAxiosOptions
	) => any;

	/**
	 * @des 响应拦截器
	 */
	responseInterceptors?: (
		axiosInstance: axiosInstanceType,
		res: AxiosResponse
	) => any;

	/**
	 * @des 请求拦截器错误处理
	 */
	requestInterceptorsCatch?: (
		axiosInstance: axiosInstanceType,
		error: Error,
		res?: AxiosResponse
	) => void;

	/**
	 * @des 响应拦截器错误处理
	 */
	responseInterceptorsCatch?: (
		axiosInstance: axiosInstanceType,
		error: Error,
		res?: AxiosResponse
	) => void;
}
