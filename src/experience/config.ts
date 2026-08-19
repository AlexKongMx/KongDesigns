import { kongDesignsClient } from "./clients/kongDesigns";
import { composeExperienceConfig } from "./composeConfig";
import { kongDesignsVerticalPack } from "./verticals/kongDesigns";

export const kongDesignsExperience = composeExperienceConfig(kongDesignsVerticalPack, kongDesignsClient);
