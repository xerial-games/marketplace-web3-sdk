import { DomHelper } from "@/helpers/dom";
import { ObserverHelper } from "@/helpers/observer";
import web2Functions from "@/utils/web2_functions/web2_functions";
import XerialWalletViewmodel from "../xerial_wallet";

export const xerialWalletViewmodelInstance = new XerialWalletViewmodel({
	observer: new ObserverHelper(),
	getProjectForMarketplace: web2Functions.getProjectForDomain,
	dom: new DomHelper(),
});