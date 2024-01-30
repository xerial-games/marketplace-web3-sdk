import { DomHelper } from "@/helpers/dom";
import { ObserverHelper } from "@/helpers/observer";
import web2Functions from "@/functions/web2/web2";
import XerialWalletViewmodel from "../xerial_wallet";

export const xerialWalletViewmodelInstance = new XerialWalletViewmodel({
	observer: new ObserverHelper(),
	getProjectForMarketplace: web2Functions.getProjectForDomain,
	dom: new DomHelper(),
});