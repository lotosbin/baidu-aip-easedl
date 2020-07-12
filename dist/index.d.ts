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
export declare type DataSetType = "IMAGE_CLASSIFICATION" | "OBJECT_DETECTION" | "IMAGE_SEGMENTATION" | "SOUND_CLASSIFICATION" | "TEXT_CLASSIFICATION" | String;
export interface ClientOptions {
    text_cls_endpoint: string;
}
export declare class Client {
    private api_key;
    private secret_key;
    private options;
    protected url: string;
    protected cache: TCache;
    protected text_cls_endpoint: string;
    /**
     * @param api_key
     * @param secret_key
     * @param options
     */
    constructor(api_key: String, secret_key: String, options: ClientOptions);
    protected getAccessToken(): Promise<any>;
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_TEXT_API/top
     * @return
     */
    text_cls_top(text: string): Promise<TResults<TPriorityResult[]>>;
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/0e4e34*
     */
    dataset_add_entity(type: DataSetType, datasetId: number, name: string, content: string, label: string): Promise<TResults<any>>;
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/5f0139f6
     */
    dataset_create(type: DataSetType, name: string): Promise<TDataSetListItem>;
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/d0f6dfe6
     */
    dataset_delete(type: DataSetType, dataset_id: number): Promise<TResults<any>>;
    /**
     * * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b917e3e2*
     */
    dataset_list(type: DataSetType, skip?: number, take?: number): Promise<TDataSetListResult>;
    /**
     * @return
     */
    recommend_priority(text: string): Promise<TResults<TPriorityResult[]>>;
    dataset_today(): Promise<TDataSetListItem>;
    /**
     *
     * @param type    是    string    数据集类型，可包括： IMAGE_CLASSIFICATION, OBJECT_DETECTION, IMAGE_SEGMENTATION, SOUND_CLASSIFICATION, TEXT_CLASSIFICATION分别对应：图像分类、物体检测、图像分割、声音分类、文本分类
     * @param  dataset_id    是    number    数据集ID
     * @param start    否    number    起始序号，默认0
     * @param num    否    number    数量，默认20，最多100
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b50d8bad
     */
    label_list(type: DataSetType, dataset_id: Number, start?: Number, num?: Number): Promise<TResults<TLabel[]>>;
    /**
     *
     * @param type    是    string    数据集类型，可包括： IMAGE_CLASSIFICATION, OBJECT_DETECTION, IMAGE_SEGMENTATION, SOUND_CLASSIFICATION, TEXT_CLASSIFICATION分别对应：图像分类、物体检测、图像分割、声音分类、文本分类
     * @param  dataset_id    是    number    数据集ID
     * @param label_name    是    string    标签/分类名称
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/28c205e4
     */
    label_delete(type: DataSetType, dataset_id: Number, label_name: String): Promise<TResults<any>>;
}
export {};
