/**
 * Parse input XML and Convert it into steps.
 */
import { Step } from "./types";
import { StepType } from "./types";

export function parseXmlToJsonSteps(xml: string): Step[] {
  // Define the regex pattern for matching file blocks
  const filePattern = /([\w./-]+):\n```\n([\s\S]+?)\n```/g;

  const steps: Step[] = [];
  let match;

  // Iterate over all matches of file names and their contents
  while ((match = filePattern.exec(xml)) !== null) {
    const filePath = match[1]; // Extract file path
    const fileContent = match[2]; // Extract file content
    const fileName = filePath.includes('/') ? filePath.split('/').slice(-1) : filePath

    // Determine the type of step based on the file name or content
    const stepType = getStepType(filePath);

    // Create a new step object
    const step: Step = {
      id: steps.length + 1, // Assign a unique ID for each step
      title: `Create:${filePath}`,
      description: `Create file ${fileName}`,
      type: stepType,
      status: 'pending',
      code: fileContent, // Attach the file content as code
      path: filePath, // Attach the file path to the step
    };

    // Add the step to the array
    steps.push(step);
  }

  return steps;
}

// Helper function to determine the step type based on the file name
function getStepType(filePath: string): StepType {
  if (filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    return StepType.CreateFile;
  } else if (filePath.endsWith('.html') || filePath.endsWith('.css')) {
    return StepType.CreateFile;
  } else if (filePath.endsWith('.json')) {
    return StepType.CreateFile;
  } else if (filePath.endsWith('.config.js')) {
    return StepType.CreateFile;
  } else {
    return StepType.CreateFile; 
  }
}


export function parseXmlAndGenerateSteps(xmlString: string, originalSteps: Step[]): Step[] {
  // Define regex patterns for parsing the XML structure
  const artifactPattern = /<boltArtifact\s+id="([^"]+)"\s+title="([^"]+)">([\s\S]*?)<\/boltArtifact>/;
  const actionPattern = /<boltAction\s+type="([^"]+)"\s+filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;

  const artifactMatch = artifactPattern.exec(xmlString);

  if (!artifactMatch) {
    throw new Error("Invalid XML: 'boltArtifact' not found");
  }

  const artifactContent = artifactMatch[3];

  const steps: Step[] = [];
  let actionMatch;
  let stepId = 1;

  // Extract and process each action within the artifact
  while ((actionMatch = actionPattern.exec(artifactContent)) !== null) {
    const actionType = actionMatch[1];
    const filePath = actionMatch[2];
    const content = actionMatch[3];

    let stepType: StepType;
    switch (actionType) {
      case 'file':
        stepType = StepType.CreateFile;
        break;
      case 'folder':
        stepType = StepType.CreateFolder;
        break;
      default:
        throw new Error(`Unknown boltAction type: ${actionType}`);
    }

    const title = originalSteps.filter((step: Step) => step.path == filePath).length ? `Update:${filePath}` : `Create:${filePath}`
    steps.push({
      id: stepId++,
      title: title,
      description: `Handle the ${actionType} at ${filePath}`,
      type: stepType,
      status: 'pending',
      code: stepType === StepType.CreateFile ? content.trim() : undefined,
      path: filePath,
    });
  }

  return steps;
}
