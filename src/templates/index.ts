import { blankTemplate } from "./blank";
import { startupTemplate } from "./startup";
import { agencyTemplate } from "./agency";
import { travelTemplate } from "./travel";
import { healthTemplate } from "./health";
import { realEstateTemplate } from "./realestate";

export const TEMPLATES = [
	blankTemplate,
	startupTemplate,
	agencyTemplate,
	travelTemplate,
	healthTemplate,
	realEstateTemplate,
];
export type { TemplateDefinition } from "./blank";
