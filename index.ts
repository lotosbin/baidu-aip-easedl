import moment from "moment";
import fetch from "node-fetch";
import utf8 from "utf8";

interface TCache {
    access_token: null | string;
    dataset: null | TDataSetListItem[];
}

export interface TDataSetListResult {
    results: TDataSetListItem[];
}

export interface TDataSetListItem {
    dataset_id: number;
    dataset_name: string;
}

export interface TPriorityResult {
    name: string;
    score: number;
}

export interface TResults<T> {
    error_code: number;
    error_msg: string;
    log_id: number;
    results: T;
}

export interface TLabel {
    label_id: String;
    label_name: String;
    entity_count: Number;
}

export type DataSetType = "IMAGE_CLASSIFICATION" | "OBJECT_DETECTION" | "IMAGE_SEGMENTATION" | "SOUND_CLASSIFICATION" | "TEXT_CLASSIFICATION" | String;

export interface ClientOptions {
    text_cls_endpoint: string;
}

export class Client {
    protected url: string;
    protected cache: TCache = {access_token: null, dataset: null};
    // tslint:disable-next-line:variable-name
    protected text_cls_endpoint = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/recommend_priority";

    /**
     * @param api_key
     * @param secret_key
     * @param options
     */
    // tslint:disable-next-line:variable-name
    constructor(private api_key: String, private secret_key: String, private options: ClientOptions) {
        this.url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${api_key}&client_secret=${secret_key}`;
        console.log(`api_key=${api_key},secret_key=${secret_key}`);
    }

    protected async getAccessToken() {
        if (this.cache.access_token) {
            return this.cache.access_token;
        }
        const response = await fetch(this.url, {method: "POST"});
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error) {
            throw new Error(`${json.error}:${json.error_description}`);
        }
        this.cache.access_token = json.access_token;
        return json.access_token;
    }

    /**
     * @see https://ai.baidu.com/docs#/EasyDL_TEXT_API/top
     * @return
     */
    public async text_cls_top(text: string): Promise<TResults<TPriorityResult[]>> {
        const url = `${(this.options || {}).text_cls_endpoint || this.text_cls_endpoint}?access_token=${(await this.getAccessToken())}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                text: `${text || "empty"}`,
                top_num: 6
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }

    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/0e4e34*
     */
    public async dataset_add_entity(type: DataSetType, datasetId: number, name: string, content: string, label: string): Promise<TResults<any>> {
        console.debug(`dataset_add_entity:datasetId=${datasetId},label=${label},name=${name},content=${content}`);
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/addentity?access_token=${(await this.getAccessToken())}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type,
                dataset_id: datasetId,
                entity_content: `${utf8.encode(content.slice(0, 10000 / 2))}`,
                entity_name: name,
                labels: [{label_name: `${label}`}]
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }

    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/5f0139f6
     */
    public async dataset_create(type: DataSetType, name: string): Promise<TDataSetListItem> {
        console.debug(`dataset_list`);
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/create?access_token=${(await this.getAccessToken())}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type,
                dataset_name: `${name}`,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return {
            dataset_id: json.dataset_id,
            dataset_name: name
        };
    }

    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/d0f6dfe6
     */
    // tslint:disable-next-line:variable-name
    public async dataset_delete(type: DataSetType, dataset_id: number): Promise<TResults<any>> {
        console.debug(`dataset_list`);
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/delete?access_token=${(await this.getAccessToken())}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type,
                dataset_id,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }

    /**
     * * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b917e3e2*
     */
    public async dataset_list(type: DataSetType, skip = 0, take = 100): Promise<TDataSetListResult> {
        console.debug(`dataset_list`);
        const accessToken = await this.getAccessToken();
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/dataset/list?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type,
                start: skip,
                num: take,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }

    /**
     * @return
     */
    public async recommend_priority(text: string): Promise<TResults<TPriorityResult[]>> {
        const accessToken = await this.getAccessToken();
        const url = `${(this.options || {}).text_cls_endpoint || this.text_cls_endpoint}?access_token=${accessToken}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                text: `${text || "empty"}`,
                top_num: 6
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }

        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }

    public async dataset_today(): Promise<TDataSetListItem> {
        const date = moment(Date.now()).format("YYYYMMDD");
        const list: TDataSetListItem[] = this.cache.dataset || (await this.dataset_list("TEXT_CLASSIFICATION") || {results: []}).results;
        this.cache.dataset = list;
        let dataset = list.find((it) => it.dataset_name === date || it.dataset_name === `${date} V1`);
        if (!dataset) {
            dataset = await this.dataset_create("TEXT_CLASSIFICATION", date);
            this.cache.dataset = null;
        }
        return dataset;
    }

    /**
     *
     * @param type    是    string    数据集类型，可包括： IMAGE_CLASSIFICATION, OBJECT_DETECTION, IMAGE_SEGMENTATION, SOUND_CLASSIFICATION, TEXT_CLASSIFICATION分别对应：图像分类、物体检测、图像分割、声音分类、文本分类
     * @param  dataset_id    是    number    数据集ID
     * @param start    否    number    起始序号，默认0
     * @param num    否    number    数量，默认20，最多100
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b50d8bad
     */
    // tslint:disable-next-line:variable-name
    public async label_list(type: DataSetType, dataset_id: Number, start: Number = 0, num: Number = 20): Promise<TResults<TLabel[]>> {
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/label/list?access_token=${(await this.getAccessToken())}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type,
                dataset_id,
                start,
                num,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }

    /**
     *
     * @param type    是    string    数据集类型，可包括： IMAGE_CLASSIFICATION, OBJECT_DETECTION, IMAGE_SEGMENTATION, SOUND_CLASSIFICATION, TEXT_CLASSIFICATION分别对应：图像分类、物体检测、图像分割、声音分类、文本分类
     * @param  dataset_id    是    number    数据集ID
     * @param label_name    是    string    标签/分类名称
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/28c205e4
     */
    // tslint:disable-next-line:variable-name
    public async label_delete(type: DataSetType, dataset_id: Number, label_name: String): Promise<TResults<any>> {
        const url = `https://aip.baidubce.com/rpc/2.0/easydl/label/delete?access_token=${(await this.getAccessToken())}`;
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                type,
                dataset_id,
                label_name,
            })
        });
        if (!response.ok) {
            throw new Error(`${response.status}:${await response.text()}`);
        }
        const json = await response.json();
        if (json.error_code) {
            throw new Error(`${json.error_code}:${json.error_msg}`);
        }
        return json;
    }
}
