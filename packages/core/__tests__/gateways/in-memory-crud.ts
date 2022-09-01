import { Crud } from "../../gateways/crud-manager";
import { Drive } from "../../gateways/drive-manager";

export default class InMemoryCrud implements Crud {
    public drive: Drive
}