import {suite, test} from "@testdeck/mocha";
import {expect} from "chai";
import moment from "moment";
import {Client, TDataSetListItem} from "../index";

@suite
class ClientTest extends Client {
    private dataset_name: string = "";
    private dataset_id: number = 0;

    constructor() {
        super(process.env.BAIDU_AIP_EASEDL_API_KEY || "", process.env.BAIDU_AIP_EASEDL_SECRET_KEY || "", {
            text_cls_endpoint: "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/text_cls/recommend_priority",
        });
        this.dataset_name = `test_${moment().format("YYYYMMDD")}`;
    }

    @test
    public async getAccessToken_should_success() {
        const accessToken = await this.getAccessToken();
        expect(!!accessToken);
    }

    @test
    public async text_cls_top_should_correct() {
        const result = await this.text_cls_top("大家好，一名前端工程师。\n" +
            "人可以累，心不能累\n" +
            "刚入职时，作为一名技术新人，负责 PC 版的淘宝首页，这块业务很特殊，它的受众很多，每天都有上亿的流量，系统的复杂度虽不是很高，但是风险特别大，而且需要与很多很多很多人交涉，我接手之时业务发生了一些变化，作业量很大，压力也很大，有来自业务方的压力，也有技术上的挑战，那段时间，连续一两个月，加班到晚上 1 点左右回家，而且 1 点以后还有可能收到业务方的电话。\n" +
            "有一天晚上，优化一个技术细节问题，日的疲惫感让我一下子爆发了出来，那天晚上，我哽咽了，哭了，最后泣不成声，主管在旁边，他话不多，等我哭的差不多的时候，他告诉我，“成长是很累，但是人可以累，心不能累”。");
        console.log(result);
        expect(result.results.length > 0);
    }

    @test
    public async text_cls_dataset_list_should_correct() {
        const result = await this.dataset_list("TEXT_CLASSIFICATION");
        console.log(result);
        expect(result.results.length > 0);
    }

    @test
    public async dataset_create_should_correct() {
        // clean
        const list = await this.dataset_list("TEXT_CLASSIFICATION", 0, 100);
        const find = list.results.find((e) => e.dataset_name === this.dataset_name || e.dataset_name === `${this.dataset_name} V1`);
        if (find) {
            console.log(`clean `);
            await this.dataset_delete("TEXT_CLASSIFICATION", find.dataset_id);
        }
        // begin
        const item = await this.dataset_create("TEXT_CLASSIFICATION", this.dataset_name);
        expect(item.dataset_name).to.equal(this.dataset_name);
        expect(item.dataset_id).to.be.exist;
        this.dataset_id = item.dataset_id;
    }

    @test
    public async dataset_add_entity_should_correct() {
        const today = await this.dataset_today();
        const results = await this.dataset_add_entity("TEXT_CLASSIFICATION", today.dataset_id, `test_${new Date().getSeconds()}`, "孙俪卡斯蒂略疯狂世界孙俪开始的交流方式看得见", "1");
        expect(results.error_code).to.be.undefined;
    }

    @test
    public async label_list_should_correct() {
        const result = await this.dataset_list("TEXT_CLASSIFICATION");
        const datasetId = result.results[0].dataset_id;
        const results = await this.label_list("TEXT_CLASSIFICATION", datasetId);
        console.log(results);
        expect(results.error_code).to.be.undefined;
    }

    @test
    public async label_delete_should_correct() {
        const today = await this.dataset_today();
        const results = await this.label_delete("TEXT_CLASSIFICATION", today.dataset_id, "1");
        expect(results.error_code).to.be.undefined;
        expect(results.log_id).to.exist;
    }

}
