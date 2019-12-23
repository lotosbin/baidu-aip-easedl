import fetch from "node-fetch";
import utf8 from "utf8";

interface TCache {
    access_token: null | string,
    dataset: null | Array<TDataSetListItem>
}

const cache: TCache = {access_token: null, dataset: null};

export interface TDataSetListResult {
    results: Array<TDataSetListItem>;
}

export interface TDataSetListItem {
    dataset_id: number;
    dataset_name: string;
}

export interface TPriorityResult {
    name: string;
    score: number;
}

export interface TResult<T> {
    error_code: number,
    error_msg: string,
    log_id: number,
    result: T,
}

export interface TResults<T> {
    error_code: number,
    error_msg: string,
    log_id: number,
    results: T,
}

export type DataSetType = "IMAGE_CLASSIFICATION" | "OBJECT_DETECTION" | "IMAGE_SEGMENTATION" | "SOUND_CLASSIFICATION" | "TEXT_CLASSIFICATION" | String;

export class Client {
    private api_key: String;
    private secret_key: String;
    protected url: string;
    protected text_cls_endpoint: String;

    constructor(api_key: String, secret_key: String, {text_cls_endpoint}: any) {
        this.api_key = api_key;
        this.secret_key = secret_key;
        this.url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${api_key}&client_secret=${secret_key}`;
        this.text_cls_endpoint = text_cls_endpoint;
    }


    protected async getAccessToken() {
        if (cache.access_token) {
            return cache.access_token;
        }
        const response = await fetch(this.url, {method: 'POST'});
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`)
        }
        const json = await response.json();
        if (json.error) {
            throw new Error(`${json.error}:${json.error_description}`)
        }
        cache.access_token = json.access_token;
        return json.access_token;
    }


    /**
     * @see https://ai.baidu.com/docs#/EasyDL_TEXT_API/top
     * @return
     */
    async text_cls_top(text: string): Promise<TResults<Array<TPriorityResult>>> {
        const accessToken = await this.getAccessToken();
        const url = `${this.text_cls_endpoint}?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "text": `${text || "empty"}`,
                "top_num": 6
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`)
        }
        return await response.json();
    }

    async dataset_add_entity(type: DataSetType, datasetId: number, name: string, content: string, label: string) {
        console.debug(`dataset_add_entity:name=${name},content=${content}`);
        const accessToken = await this.getAccessToken();
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/addentity?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": type,
                "dataset_id": datasetId,
                "entity_content": `${utf8.encode(content.slice(0, 10000 / 2))}`,
                "entity_name": name,
                "labels": [{"label_name": `${label}`}]
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`)
        }
        const json = await response.json();
        /*{
        log_id: 8538749507596601000,
        results: [
         { name: '0', score: 0.7447099685668945 },
         { name: '1', score: 0.2552900016307831 }
        ]
        }*/
        console.debug(`dataset_add_entity:result=${JSON.stringify(json)}`);
        return json;
    }

    async dataset_create(type: DataSetType, name: string): Promise<TDataSetListItem> {
        console.debug(`dataset_list`);
        const accessToken = await this.getAccessToken();
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/create?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": type,
                "dataset_name": `${name}`,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`)
        }
        const json = await response.json();
        /*{
       { total_num: 2,
      results:
       [ { dataset_id: 33883,
           dataset_name: 'auto',
           type: 'TEXT_CLASSIFICATION',
           status: 'normal' },
         { dataset_id: 34015,
           dataset_name: '1',
           type: 'TEXT_CLASSIFICATION',
           status: 'normal' } ],
      log_id: 565872871 }

        */
        console.debug(`dataset_create:result=${JSON.stringify(json)}`);
        return {
            dataset_id: json.dataset_id,
            dataset_name: name
        };
    }

    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b917e3e2
     * */
    async dataset_list(type: DataSetType, skip = 0, take = 100): Promise<TDataSetListResult> {
        console.debug(`dataset_list`);
        const accessToken = await this.getAccessToken();
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/list?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "type": type,
                "start": skip,
                "num": take,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`)
        }
        const json = await response.json();
        /*{
       { total_num: 2,
      results:
       [ { dataset_id: 33883,
           dataset_name: 'auto',
           type: 'TEXT_CLASSIFICATION',
           status: 'normal' },
         { dataset_id: 34015,
           dataset_name: '1',
           type: 'TEXT_CLASSIFICATION',
           status: 'normal' } ],
      log_id: 565872871 }

        */
        console.debug(`dataset_list:result=${JSON.stringify(json)}`);
        return json;
    }


}
