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
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var index_1 = require("../index");
describe("client", function () {
    var client;
    before(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, BAIDU_AIP_EASEDL_SECRET_KEY, BAIDU_AIP_EASEDL_API_KEY;
        return __generator(this, function (_b) {
            _a = process.env, BAIDU_AIP_EASEDL_SECRET_KEY = _a.BAIDU_AIP_EASEDL_SECRET_KEY, BAIDU_AIP_EASEDL_API_KEY = _a.BAIDU_AIP_EASEDL_API_KEY;
            client = new index_1.Client(BAIDU_AIP_EASEDL_API_KEY, BAIDU_AIP_EASEDL_SECRET_KEY, {
                text_cls_endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/recommend_priority",
            });
            return [2 /*return*/];
        });
    }); });
    it("should getAccessToken", function () { return __awaiter(void 0, void 0, void 0, function () {
        var accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getAccessToken()];
                case 1:
                    accessToken = _a.sent();
                    console.log(accessToken);
                    chai_1.expect(!!accessToken);
                    return [2 /*return*/];
            }
        });
    }); });
    it("should text_cls_top_should_correct", function () { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.getAccessToken()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, client.text_cls_top("大家好，一名前端工程师。\n" +
                            "人可以累，心不能累\n" +
                            "刚入职时，作为一名技术新人，负责 PC 版的淘宝首页，这块业务很特殊，它的受众很多，每天都有上亿的流量，系统的复杂度虽不是很高，但是风险特别大，而且需要与很多很多很多人交涉，我接手之时业务发生了一些变化，作业量很大，压力也很大，有来自业务方的压力，也有技术上的挑战，那段时间，连续一两个月，加班到晚上 1 点左右回家，而且 1 点以后还有可能收到业务方的电话。\n" +
                            "有一天晚上，优化一个技术细节问题，日的疲惫感让我一下子爆发了出来，那天晚上，我哽咽了，哭了，最后泣不成声，主管在旁边，他话不多，等我哭的差不多的时候，他告诉我，“成长是很累，但是人可以累，心不能累”。")];
                case 2:
                    result = _a.sent();
                    console.log(result);
                    chai_1.expect(result.results.length > 0);
                    return [2 /*return*/];
            }
        });
    }); });
});
