"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var utf8_1 = __importDefault(require("utf8"));
var Client = /** @class */ (function () {
    /**
     * @param api_key
     * @param secret_key
     * @param options
     */
    // tslint:disable-next-line:variable-name
    function Client(api_key, secret_key, options) {
        this.api_key = api_key;
        this.secret_key = secret_key;
        this.options = options;
        this.cache = { access_token: null, dataset: null };
        // tslint:disable-next-line:variable-name
        this.text_cls_endpoint = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/recommend_priority";
        this.url = "https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=" + api_key + "&client_secret=" + secret_key;
        console.log("api_key=" + api_key + ",secret_key=" + secret_key);
    }
    Client.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, _a, _b, json;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.cache.access_token) {
                            return [2 /*return*/, this.cache.access_token];
                        }
                        return [4 /*yield*/, node_fetch_1.default(this.url, { method: "POST" })];
                    case 1:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 3];
                        _a = Error.bind;
                        _b = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 2: throw new (_a.apply(Error, [void 0, _b + (_c.sent())]))();
                    case 3: return [4 /*yield*/, response.json()];
                    case 4:
                        json = _c.sent();
                        if (json.error) {
                            throw new Error(json.error + ":" + json.error_description);
                        }
                        this.cache.access_token = json.access_token;
                        return [2 /*return*/, json.access_token];
                }
            });
        });
    };
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_TEXT_API/top
     * @return
     */
    Client.prototype.text_cls_top = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, response, _b, _c, json;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = ((this.options || {}).text_cls_endpoint || this.text_cls_endpoint) + "?access_token=";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        url = _a + (_d.sent());
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    text: "" + (text || "empty"),
                                    top_num: 6
                                })
                            })];
                    case 2:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = Error.bind;
                        _c = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_b.apply(Error, [void 0, _c + (_d.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _d.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/0e4e34*
     */
    Client.prototype.dataset_add_entity = function (type, datasetId, name, content, label) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, response, _b, _c, json;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.debug("dataset_add_entity:datasetId=" + datasetId + ",label=" + label + ",name=" + name + ",content=" + content);
                        _a = "https://aip.baidubce.com/rpc/2.0/easydl/dataset/addentity?access_token=";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        url = _a + (_d.sent());
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    type: type,
                                    dataset_id: datasetId,
                                    entity_content: "" + utf8_1.default.encode(content.slice(0, 10000 / 2)),
                                    entity_name: name,
                                    labels: [{ label_name: "" + label }]
                                })
                            })];
                    case 2:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = Error.bind;
                        _c = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_b.apply(Error, [void 0, _c + (_d.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _d.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/5f0139f6
     */
    Client.prototype.dataset_create = function (type, name) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, response, _b, _c, json;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.debug("dataset_list");
                        _a = "https://aip.baidubce.com/rpc/2.0/easydl/dataset/create?access_token=";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        url = _a + (_d.sent());
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    type: type,
                                    dataset_name: "" + name,
                                })
                            })];
                    case 2:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = Error.bind;
                        _c = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_b.apply(Error, [void 0, _c + (_d.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _d.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, {
                                dataset_id: json.dataset_id,
                                dataset_name: name
                            }];
                }
            });
        });
    };
    /**
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/d0f6dfe6
     */
    // tslint:disable-next-line:variable-name
    Client.prototype.dataset_delete = function (type, dataset_id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, response, _b, _c, json;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        console.debug("dataset_list");
                        _a = "https://aip.baidubce.com/rpc/2.0/easydl/dataset/delete?access_token=";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        url = _a + (_d.sent());
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    type: type,
                                    dataset_id: dataset_id,
                                })
                            })];
                    case 2:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = Error.bind;
                        _c = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_b.apply(Error, [void 0, _c + (_d.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _d.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     * * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b917e3e2*
     */
    Client.prototype.dataset_list = function (type, skip, take) {
        if (skip === void 0) { skip = 0; }
        if (take === void 0) { take = 100; }
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, url, response, _a, _b, json;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        console.debug("dataset_list");
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        accessToken = _c.sent();
                        url = "https://aip.baidubce.com/rpc/2.0/easydl/dataset/list?access_token=" + accessToken;
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    type: type,
                                    start: skip,
                                    num: take,
                                })
                            })];
                    case 2:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _a = Error.bind;
                        _b = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_a.apply(Error, [void 0, _b + (_c.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _c.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     * @return
     */
    Client.prototype.recommend_priority = function (text) {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken, url, response, _a, _b, json;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        accessToken = _c.sent();
                        url = ((this.options || {}).text_cls_endpoint || this.text_cls_endpoint) + "?access_token=" + accessToken;
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    text: "" + (text || "empty"),
                                    top_num: 6
                                })
                            })];
                    case 2:
                        response = _c.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _a = Error.bind;
                        _b = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_a.apply(Error, [void 0, _b + (_c.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _c.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    Client.prototype.dataset_today = function () {
        return __awaiter(this, void 0, void 0, function () {
            var date, list, _a, dataset;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        date = moment_1.default(Date.now()).format("YYYYMMDD");
                        _a = this.cache.dataset;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.dataset_list("TEXT_CLASSIFICATION")];
                    case 1:
                        _a = ((_b.sent()) || { results: [] }).results;
                        _b.label = 2;
                    case 2:
                        list = _a;
                        this.cache.dataset = list;
                        dataset = list.find(function (it) { return it.dataset_name === date || it.dataset_name === date + " V1"; });
                        if (!!dataset) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.dataset_create("TEXT_CLASSIFICATION", date)];
                    case 3:
                        dataset = _b.sent();
                        this.cache.dataset = null;
                        _b.label = 4;
                    case 4: return [2 /*return*/, dataset];
                }
            });
        });
    };
    /**
     *
     * @param type    是    string    数据集类型，可包括： IMAGE_CLASSIFICATION, OBJECT_DETECTION, IMAGE_SEGMENTATION, SOUND_CLASSIFICATION, TEXT_CLASSIFICATION分别对应：图像分类、物体检测、图像分割、声音分类、文本分类
     * @param  dataset_id    是    number    数据集ID
     * @param start    否    number    起始序号，默认0
     * @param num    否    number    数量，默认20，最多100
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/b50d8bad
     */
    // tslint:disable-next-line:variable-name
    Client.prototype.label_list = function (type, dataset_id, start, num) {
        if (start === void 0) { start = 0; }
        if (num === void 0) { num = 20; }
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, response, _b, _c, json;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = "https://aip.baidubce.com/rpc/2.0/easydl/label/list?access_token=";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        url = _a + (_d.sent());
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    type: type,
                                    dataset_id: dataset_id,
                                    start: start,
                                    num: num,
                                })
                            })];
                    case 2:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = Error.bind;
                        _c = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_b.apply(Error, [void 0, _c + (_d.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _d.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    /**
     *
     * @param type    是    string    数据集类型，可包括： IMAGE_CLASSIFICATION, OBJECT_DETECTION, IMAGE_SEGMENTATION, SOUND_CLASSIFICATION, TEXT_CLASSIFICATION分别对应：图像分类、物体检测、图像分割、声音分类、文本分类
     * @param  dataset_id    是    number    数据集ID
     * @param label_name    是    string    标签/分类名称
     * @see https://ai.baidu.com/docs#/EasyDL_DATA_API/28c205e4
     */
    // tslint:disable-next-line:variable-name
    Client.prototype.label_delete = function (type, dataset_id, label_name) {
        return __awaiter(this, void 0, void 0, function () {
            var url, _a, response, _b, _c, json;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = "https://aip.baidubce.com/rpc/2.0/easydl/label/delete?access_token=";
                        return [4 /*yield*/, this.getAccessToken()];
                    case 1:
                        url = _a + (_d.sent());
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: "POST",
                                body: JSON.stringify({
                                    type: type,
                                    dataset_id: dataset_id,
                                    label_name: label_name,
                                })
                            })];
                    case 2:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = Error.bind;
                        _c = response.status + ":";
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_b.apply(Error, [void 0, _c + (_d.sent())]))();
                    case 4: return [4 /*yield*/, response.json()];
                    case 5:
                        json = _d.sent();
                        if (json.error_code) {
                            throw new Error(json.error_code + ":" + json.error_msg);
                        }
                        return [2 /*return*/, json];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
