import axios, { AxiosError } from "axios";
import { getAccessToken } from "./auth";

type Params = {
    endpoint: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: object,
    withAuth?: boolean,
    headers?: { [key: string]: string }
}

export const useApi = async <TypeDataResponse>({
    endpoint,
    method = 'GET',
    data = {},
    withAuth = true,
    headers = {}
}: Params): Promise<{
    data: TypeDataResponse,
    error_detail: string
}> => {
    let headersData  = headers

    const access_token = getAccessToken()
    if (withAuth) {
        headersData['Authorization'] = `Bearer ${access_token}`
    }

    try {
        const request = await axios(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/${endpoint}`, {
            method,
            data: method != 'GET' && data,
            params: method == 'GET' && data,
            headers
        })

        return {
            data: request.data,
            error_detail: ''
        }
    } catch (e) {
        const error = e as AxiosError<{ detail: string }>

        return {
            data: null as TypeDataResponse,
            error_detail: error.response?.data.detail ?? error.message
        }
    }
}