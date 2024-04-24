import axios from "axios";
import qs from "qs";
import ClientError from "../types/errors/ClientError";
import ConnectionError from "../types/errors/ConnectionError";
import ServerError from "../types/errors/ServerError";
import UnauthorizedError from "../types/errors/UnauthorizedError";
import i18n from "../i18n";

const axiosClient = axios.create({
  baseURL: "",
  paramsSerializer: (params) => {
    // sử dụng thư viện qs để serialize các tham số với định dạng lặp lại
    return qs.stringify(params, { arrayFormat: "repeat" });
  },
});

// Thêm một bộ đón chặn request
axiosClient.interceptors.request.use(
  function (config) {
    // Làm gì đó trước khi request dược gửi đi
    config.headers["Accept-Language"] = i18n.languages;
    return config;
  },
  function (error) {
    if (UnauthorizedError.isUnauthorizedError(error)) return Promise.reject(error);
    // Làm gì đó với lỗi request
    return Promise.reject(new ConnectionError());
  },
);

// Thêm một bộ đón chặn response
axiosClient.interceptors.response.use(
  function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response;
  },
  function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    if (axios.isAxiosError(error)) {
      if (!error.response) return Promise.reject(new ConnectionError());
      const response = error.response;
      if (response.status >= 500 || !response.data) return Promise.reject(new ServerError());
      if (response.status === 401) return Promise.reject(new UnauthorizedError());
      try {
        const body = error.response.data as ProblemDetails;
        const clientError = new ClientError(
          response.status,
          response.headers,
          body,
          body.title,
          body.detail,
          body.errors,
        );
        return Promise.reject(clientError);
      } catch (e) {
        return Promise.reject(new ServerError());
      }
    }
    return Promise.reject(error);
  },
);

interface ProblemDetails {
  status: number;
  title: string;
  type: string;
  detail: string;
  errors: { [key: string]: string[] };
}

export default axiosClient;
