import {Client} from "../index";
import {expect} from "chai";
import {suite, test} from '@testdeck/mocha';

@suite
class BaiduApiEaseDLClientTest extends Client {
    constructor() {
        const {BAIDU_API_EASEDL_SECRET_KEY, BAIDU_API_EASEDL_APP_KEY}: any = process.env;
        super(BAIDU_API_EASEDL_APP_KEY, BAIDU_API_EASEDL_SECRET_KEY, {
            text_cls_endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/recommend_priority",
        });
    }

    @test getAccessToken_should_success() {
        const accessToken = this.getAccessToken();
        expect(!!accessToken);
    }

    @test
    async text_cls_top_should_correct() {
        let result = await this.text_cls_top("大家好，一名前端工程师。\n" +
            "人可以累，心不能累\n" +
            "刚入职时，作为一名技术新人，负责 PC 版的淘宝首页，这块业务很特殊，它的受众很多，每天都有上亿的流量，系统的复杂度虽不是很高，但是风险特别大，而且需要与很多很多很多人交涉，我接手之时业务发生了一些变化，作业量很大，压力也很大，有来自业务方的压力，也有技术上的挑战，那段时间，连续一两个月，加班到晚上 1 点左右回家，而且 1 点以后还有可能收到业务方的电话。\n" +
            "有一天晚上，优化一个技术细节问题，日的疲惫感让我一下子爆发了出来，那天晚上，我哽咽了，哭了，最后泣不成声，主管在旁边，他话不多，等我哭的差不多的时候，他告诉我，“成长是很累，但是人可以累，心不能累”。");
        console.log(result);
        expect(result.results.length > 0)
    }


    @test
    async text_cls_dataset_list_should_correct() {
        let result = await this.dataset_list("TEXT_CLASSIFICATION");
        console.log(result);
        expect(result.results.length > 0);
    }
}

